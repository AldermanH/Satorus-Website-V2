#!/usr/bin/env python3
"""Build the hosted legal pages from frozen content fragments.

Reads content/legal/manifest.json + the per-version HTML fragments produced
by docx2html.py, and writes fully static pages into public/legal/:

    public/legal/index.html                     document index
    public/legal/<slug>/index.html              canonical URL, current version
    public/legal/<slug>/<version>/index.html    immutable archive route

The canonical and archive pages for the current version carry identical
document content; archive pages canonical-tag the versionless URL. Publishing
a new version = add a fragment file + manifest entry, move "current", rerun.
Shipped fragments are never edited — this script sha256-verifies every listed
fragment and aborts on any mismatch (run with --update-hashes once, when a
new version is first added, to record its hash).

The document fragment (title, version line, clause text) is wrapped in
<article> untouched apart from structural mapping (headings, ids, table
wrappers) — no wording is added inside the article except elements marked
data-chrome="1", which the fidelity checker (check.py --page) strips before
diffing against the .docx extraction.

Usage: python3 scripts/legal/build.py [--update-hashes]
"""
import json, re, sys, hashlib, html
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTENT = ROOT / 'content' / 'legal'
OUT = ROOT / 'public' / 'legal'
SITE = 'https://satorusgroup.com'

# ---------------------------------------------------------------------------
# fragment -> document body transform
# ---------------------------------------------------------------------------

def slugify(text):
    s = re.sub(r'<[^>]+>', '', text)
    s = html.unescape(s).lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:60]


def strip_tags(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()


BLOCK_RE = re.compile(r'<p\b([^>]*)>(.*)</p>$')


def block_parts(block):
    m = BLOCK_RE.match(block)
    if not m:
        return None, None, None, None
    attrs, inner = m.group(1), m.group(2)
    sm = re.search(r'data-style="([^"]*)"', attrs)
    style = sm.group(1) if sm else ''
    nm = re.match(r'<span class="num">([^<]*)</span>\s*(.*)$', inner)
    num = html.unescape(nm.group(1)) if nm else None
    rest = nm.group(2) if nm else inner
    return style, num, rest, attrs


class Ids:
    def __init__(self):
        self.seen = set()

    def take(self, base):
        i, out = 1, base
        while out in self.seen:
            i += 1
            out = f'{base}-{i}'
        self.seen.add(out)
        return out


def heading(tag, hid, num, rest_html, lit=False):
    # "num num-lit" marks a number that is literal text in the source docx
    # (not reconstructed from Word auto-numbering): check.py strips only the
    # reconstructed ones before diffing against the reference extraction.
    cls = 'num num-lit' if lit else 'num'
    numspan = f'<span class="{cls}">{html.escape(num)}</span> ' if num else ''
    return f'<{tag} id="{hid}">{numspan}{rest_html}</{tag}>'


def transform(slug, fragment, has_version_line=True):
    """Returns (title_html, version_text, body_html, toc) where toc is a list
    of {id, label, children:[{id,label}]}. version_text is None when the
    source document carries no version line (manifest supplies the banner)."""
    blocks = [b for b in fragment.split('\n') if b.strip()]

    # First paragraph is the document title; for contract documents the
    # second is the version line.
    t_style, _, title_inner, _ = block_parts(blocks[0])
    if has_version_line:
        version_text = strip_tags(blocks[1])
        if not re.match(r'Version \d+\.\d+ – effective ', version_text):
            raise SystemExit(f'{slug}: second paragraph is not a version line: {version_text!r}')
        blocks = blocks[2:]
    else:
        version_text = None
        blocks = blocks[1:]

    ids = Ids()
    toc = []
    out = []
    cur_annex = None  # DPA: current annex slug for part ids

    def add_toc(hid, label, level):
        entry = {'id': hid, 'label': label, 'children': []}
        if level == 2 or not toc:
            toc.append(entry)
        else:
            toc[-1]['children'].append(entry)

    for block in blocks:
        if block.startswith('<table>'):
            # header-styled first row iff every cell is entirely bold
            first_row = re.search(r'<tr>(.*?)</tr>', block)
            klass = 'table-wrap'
            if first_row:
                cells = re.findall(r'<td[^>]*>(.*?)</td>', first_row.group(1))
                texts = [strip_tags(c) for c in cells]
                bolds = [strip_tags(' '.join(re.findall(r'<strong>(.*?)</strong>', c))) for c in cells]
                if cells and all(t and t == b for t, b in zip(texts, bolds)):
                    klass += ' table-headed'
            out.append(f'<div class="{klass}">{block}</div>')
            continue
        if block.startswith('<ul') or block.startswith('<li') or block.startswith('</ul'):
            out.append(block)
            continue

        style, num, rest, attrs = block_parts(block)
        if style is None:
            out.append(block)
            continue
        text = strip_tags(rest)

        if slug == 'msa':
            if style == 'Heading1' and num:
                hid = ids.take('clause-' + num.rstrip('.').replace('.', '-'))
                add_toc(hid, f'{num} {text}', 2)
                out.append(heading('h2', hid, num, rest))
                continue

        elif slug == 'dpa':
            if style in ('TitleClause', '1stclause'):
                if num:
                    hid = ids.take('clause-' + num.rstrip('.').replace('.', '-'))
                    add_toc(hid, f'{num} {text}', 2)
                    out.append(heading('h2', hid, num, rest))
                    continue
                if len(text) <= 40:  # e.g. "AGREED TERMS"
                    hid = ids.take(slugify(text))
                    add_toc(hid, text, 2)
                    out.append(heading('h2', hid, None, rest))
                    continue
                # long unnumbered TitleClause (the closing statement) — a
                # bolded standalone sentence, not a section heading
                out.append(f'<p class="statement">{rest}</p>')
                continue
            if style == 'Annex' and num:
                cur_annex = slugify(num)             # "annex-a"
                hid = ids.take(cur_annex)
                add_toc(hid, f'{num} {text}', 2)
                out.append(heading('h2', hid, num, rest))
                continue
            if style == 'Part':
                if num:
                    base = (cur_annex + '-' if cur_annex else '') + slugify(num)
                    hid = ids.take(base)
                    add_toc(hid, f'{num} {text}', 3)
                    out.append(heading('h3', hid, num, rest))
                else:
                    hid = ids.take((cur_annex + '-' if cur_annex else '') + slugify(text))
                    out.append(heading('h4', hid, None, rest))
                continue
            if style == 'ScheduleTitleClause' and not num:
                out.append(heading('h4', ids.take(slugify(text)), None, rest))
                continue

        elif slug in ('documentation', 'privacy'):
            m = re.match(r'^<strong>(\d+)\.\s*(.*)</strong>\s*$', rest)
            if not num and m:
                hid = ids.take('section-' + m.group(1))
                add_toc(hid, f'{m.group(1)}. {m.group(2)}', 2)
                out.append(heading('h2', hid, m.group(1) + '.', m.group(2), lit=True))
                continue

        out.append(block)

    title_html = title_inner
    return title_html, version_text, '\n'.join(out), toc


# ---------------------------------------------------------------------------
# page template
# ---------------------------------------------------------------------------

CSS = """
:root{
  --bg:hsl(234,8%,6%);--bg-deep:hsl(240,14%,4.5%);--surface:hsl(235,14%,9%);
  --elevated:hsl(232,10%,12%);--fg:hsl(0,0%,92%);--fg-muted:hsl(220,10%,58%);
  --fg-subtle:hsla(0,0%,95%,.58);--accent:hsl(187,72%,48%);
  --accent-soft:hsl(187,55%,62%);--accent-10:hsla(187,72%,48%,.1);
  --border:hsl(232,10%,15%);--border-strong:hsl(232,10%,20%);
  --sans:'Instrument Sans',system-ui,-apple-system,sans-serif;
  --display:'Outfit',system-ui,sans-serif;
  --mono:'IBM Plex Mono','Consolas',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);
  font-size:15.5px;line-height:1.75;-webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility}
a{color:var(--accent-soft);text-decoration:none}
a:hover{text-decoration:underline;text-underline-offset:3px}
.caps{text-transform:uppercase}

/* top bar */
.bar{border-bottom:1px solid var(--border);background:var(--bg-deep)}
.bar-in{max-width:1080px;margin:0 auto;padding:14px 24px;display:flex;
  align-items:baseline;gap:14px}
.mark{font-family:var(--display);font-weight:700;font-size:13px;
  letter-spacing:.14em;color:var(--fg)}
.mark:hover{text-decoration:none;color:var(--accent-soft)}
.crumb{font-size:12.5px;color:var(--fg-muted)}
.crumb a{color:var(--fg-muted)}

/* layout */
.shell{max-width:1080px;margin:0 auto;padding:40px 24px 80px;display:grid;
  grid-template-columns:236px minmax(0,46rem);gap:56px;
  justify-content:center}
@media(max-width:920px){.shell{display:block;padding-top:24px}}

/* toc */
.side{font-size:13px}
.toc{position:sticky;top:24px;max-height:calc(100vh - 48px);overflow-y:auto;
  padding-right:8px}
.toc summary{cursor:pointer;font-family:var(--display);font-weight:600;
  font-size:11px;letter-spacing:.09em;text-transform:uppercase;
  color:var(--fg-subtle);list-style:none;padding:8px 0}
.toc summary::-webkit-details-marker{display:none}
.toc summary::after{content:"▸";margin-left:6px;color:var(--fg-subtle)}
.toc[open] summary::after{content:"▾"}
.toc ol{list-style:none;border-left:1px solid var(--border);margin-top:4px}
.toc ol ol{border-left:none;margin:0 0 2px 14px}
.toc li a{display:block;padding:4px 0 4px 14px;color:var(--fg-muted);
  line-height:1.45;border-left:2px solid transparent;margin-left:-1.5px}
.toc ol ol li a{padding-left:10px;font-size:12.5px;color:var(--fg-subtle)}
.toc li a:hover{color:var(--fg);text-decoration:none;
  border-left-color:var(--accent)}
.toc .num{color:var(--accent-soft);font-family:var(--mono);font-size:11px}
@media(max-width:920px){
  .toc{position:static;max-height:none;border:1px solid var(--border);
    border-radius:8px;background:var(--surface);padding:4px 16px;
    margin-bottom:28px}
}

/* document header */
.eyebrow{font-family:var(--sans);font-size:11px;font-weight:500;
  letter-spacing:.09em;text-transform:uppercase;color:var(--fg-subtle);
  margin-bottom:14px}
article h1{font-family:var(--display);font-weight:600;font-size:27px;
  line-height:1.2;letter-spacing:-.015em;margin:0 0 18px}
.version-banner{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;
  border:1px solid var(--border);border-left:2px solid var(--accent);
  border-radius:8px;background:var(--surface);padding:12px 16px;
  margin-bottom:8px}
.version-line{font-family:var(--mono);font-size:13px;color:var(--fg)}
.version-note{font-size:12.5px;color:var(--fg-muted)}
.version-banner .dl{margin-left:auto;font-size:12.5px;white-space:nowrap}
.intro-gap{height:26px}

/* document body */
article{min-width:0}
article p{margin:0 0 1.05em}
article h2{font-family:var(--display);font-weight:600;font-size:19.5px;
  line-height:1.3;letter-spacing:-.01em;margin:2.6em 0 1em;
  padding-top:1.6em;border-top:1px solid var(--border)}
article h3{font-family:var(--display);font-weight:600;font-size:16px;
  margin:2em 0 .9em}
article h4{font-family:var(--sans);font-weight:600;font-size:15px;
  margin:1.8em 0 .8em}
article h2 .num,article h3 .num{color:var(--accent-soft)}
.num{font-family:var(--mono);font-size:.85em;font-weight:500;
  color:var(--accent-soft);letter-spacing:0}
p.clause{margin-bottom:1.05em}
p.lvl2{margin-left:1.5rem}
p.lvl3{margin-left:3rem}
p.lvl4{margin-left:4.25rem}
p.lvl5{margin-left:5.25rem}
@media(max-width:560px){
  p.lvl2{margin-left:.9rem}p.lvl3{margin-left:1.8rem}
  p.lvl4{margin-left:2.6rem}p.lvl5{margin-left:3.2rem}
}
p.statement{font-weight:600;margin:1.6em 0}
article ul{margin:0 0 1.05em;padding-left:1.4em}
article li{margin-bottom:.35em}
article li::marker{color:var(--fg-subtle)}
article strong{font-weight:600;color:hsl(0,0%,97%)}

/* tables */
.table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:8px;
  margin:0 0 1.4em;background:var(--surface)}
.table-wrap table{border-collapse:collapse;width:100%;font-size:13.5px;
  line-height:1.55}
.table-wrap td{padding:10px 14px;border-top:1px solid var(--border);
  vertical-align:top;min-width:9rem}
.table-wrap tr:first-child td{border-top:none}
.table-wrap td p{margin:0 0 .5em}
.table-wrap td p:last-child{margin-bottom:0}
.table-headed tr:first-child td{background:var(--elevated);
  font-family:var(--display);font-size:12px;letter-spacing:.02em;
  white-space:nowrap}
.dfn-table td:first-child{min-width:11rem;width:11rem}

/* version history + footer */
.vh{max-width:46rem;margin:0 auto;padding:0 24px 40px}
@media(min-width:921px){.vh{margin-left:calc((1080px - 236px - 46rem - 56px)/2 + 236px + 56px + ((100vw - 1080px)/2));margin-left:0}}
.vh-in{max-width:1080px;margin:0 auto;padding:28px 24px 56px;display:grid;
  grid-template-columns:236px minmax(0,46rem);gap:56px;justify-content:center}
@media(max-width:920px){.vh-in{display:block}}
.vh h2{font-family:var(--display);font-weight:600;font-size:13px;
  letter-spacing:.06em;text-transform:uppercase;color:var(--fg-subtle);
  margin-bottom:12px}
.vh table{border-collapse:collapse;font-size:13px}
.vh td{padding:6px 22px 6px 0;color:var(--fg-muted)}
.vh .cur{color:var(--fg)}
footer.foot{border-top:1px solid var(--border);background:var(--bg-deep)}
.foot-in{max-width:1080px;margin:0 auto;padding:22px 24px;display:flex;
  flex-wrap:wrap;gap:8px 24px;justify-content:space-between;
  font-size:12.5px;color:var(--fg-muted)}
.foot-in a{color:var(--fg-muted)}

/* index page */
.docs{list-style:none;display:grid;gap:16px;margin-top:30px}
.doc-card{border:1px solid var(--border);border-radius:10px;
  background:var(--surface);padding:20px 22px}
.doc-card h2{font-family:var(--display);font-weight:600;font-size:17px;
  margin:0 0 4px}
.doc-card h2 a{color:var(--fg)}
.doc-card h2 a:hover{color:var(--accent-soft);text-decoration:none}
.doc-meta{font-family:var(--mono);font-size:12px;color:var(--fg-muted);
  margin-bottom:10px}
.doc-desc{font-size:14px;color:var(--fg-muted);line-height:1.6;margin:0 0 12px}
.doc-links{font-size:13px;display:flex;flex-wrap:wrap;gap:16px}
.index-shell{max-width:720px;margin:0 auto;padding:48px 24px 80px}
.index-shell h1{font-family:var(--display);font-weight:600;font-size:26px;
  margin-bottom:10px}
.index-lede{color:var(--fg-muted);font-size:14.5px;max-width:56ch}

/* print */
@media print{
  :root{--bg:#fff;--bg-deep:#fff;--surface:#fff;--elevated:#f4f4f4;
    --fg:#000;--fg-muted:#333;--fg-subtle:#555;--accent:#000;
    --accent-soft:#000;--border:#bbb;--border-strong:#999}
  @page{margin:18mm 16mm}
  body{background:#fff;color:#000;font-size:10.5pt;line-height:1.55}
  .bar,.side,.version-banner .dl,.version-note,.vh-in,footer.foot{display:none!important}
  .shell{display:block;max-width:100%;padding:0}
  article{max-width:100%}
  a{color:#000;text-decoration:none}
  article strong{color:#000}
  article h1{font-size:17pt}
  article h2{font-size:13pt;break-after:avoid;border-top-color:#ccc}
  article h3,article h4{break-after:avoid}
  .version-banner{border:1px solid #999;border-left:3px solid #000;
    background:#fff}
  p.clause{orphans:3;widows:3}
  .table-wrap{overflow:visible;border-color:#999;break-inside:auto}
  .table-wrap td{border:1px solid #bbb}
  tr{break-inside:avoid}
}
"""

FONTS = (
  '<link rel="preconnect" href="https://fonts.googleapis.com"/>'
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>'
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
  'family=Instrument+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700'
  '&family=IBM+Plex+Mono:wght@400;500&display=swap"/>'
)

TOC_SCRIPT = ("<script>(function(){var t=document.querySelector('.toc');"
              "if(t&&matchMedia('(min-width:921px)').matches)"
              "t.setAttribute('open','');})();</script>")


def head(title, description, canonical):
    return f"""<meta charset="utf-8"/>
<title>{html.escape(title)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="description" content="{html.escape(description)}"/>
<link rel="canonical" href="{canonical}"/>
<meta name="theme-color" content="#0e1014"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="{html.escape(title)}"/>
<meta property="og:description" content="{html.escape(description)}"/>
<link rel="icon" type="image/svg+xml" href="/assets/satorus-icon-cyan.svg"/>
{FONTS}
<style>{CSS}</style>"""


def bar():
    return ('<div class="bar"><div class="bar-in">'
            '<a class="mark" href="/">SATORUS</a>'
            '<span class="crumb"><a href="/legal">Legal</a></span>'
            '</div></div>')


def toc_html(toc):
    items = []
    for e in toc:
        label = e['label']
        m = re.match(r'^((?:ANNEX [A-Z]|Part \d+|[\d.]+))\s+(.*)$', label)
        if m:
            lab = f'<span class="num">{html.escape(m.group(1))}</span> {html.escape(m.group(2))}'
        else:
            lab = html.escape(label)
        kids = ''
        if e['children']:
            kid_items = []
            for k in e['children']:
                km = re.match(r'^((?:ANNEX [A-Z]|Part \d+|[\d.]+))\s+(.*)$', k['label'])
                if km:
                    klab = f'<span class="num">{html.escape(km.group(1))}</span> {html.escape(km.group(2))}'
                else:
                    klab = html.escape(k['label'])
                kid_items.append(f'<li><a href="#{k["id"]}">{klab}</a></li>')
            kids = '<ol>' + ''.join(kid_items) + '</ol>'
        items.append(f'<li><a href="#{e["id"]}">{lab}</a>{kids}</li>')
    return ('<details class="toc"><summary>Contents</summary><ol>'
            + ''.join(items) + '</ol></details>')


def version_history_html(slug, doc):
    rows = []
    for v in reversed(doc['versions']):
        cur = ' class="cur"' if v['id'] == doc['current'] else ''
        note = 'current' if v['id'] == doc['current'] else 'superseded'
        rows.append(f'<tr{cur}><td>Version {v["label"]}</td>'
                    f'<td>effective {v["effective"]}</td><td>{note}</td>'
                    f'<td><a href="/legal/{slug}/{v["id"]}">permanent link</a></td></tr>')
    return ('<div class="vh-in"><div></div><div><h2 id="version-history">Version history</h2>'
            '<table>' + ''.join(rows) + '</table></div></div>')


def footer(extra=''):
    q = f'<div>{extra}</div>' if extra else ''
    return ('<footer class="foot"><div class="foot-in">'
            '<div>© 2026 Satorus Group Ltd · London</div>'
            f'{q}'
            '<div><a href="/legal">Legal index</a></div>'
            '</div></footer>')


def doc_page(slug, doc, version, is_archive):
    frag = (CONTENT / version['file']).read_text(encoding='utf-8')
    has_vl = doc.get('sourceVersionLine', True)
    title_html, version_text, body, toc = transform(slug, frag, has_vl)

    expected = f'Version {version["label"]} – effective {version["effective"]}'
    if has_vl and version_text != expected:
        raise SystemExit(f'{slug} {version["id"]}: version line mismatch: '
                         f'{version_text!r} != {expected!r}')
    # source has no version line: the banner is page furniture built from the
    # manifest, marked data-chrome so fidelity checks skip it
    version_chrome = '' if has_vl else ' data-chrome="1"'
    if version_text is None:
        version_text = expected

    is_current = version['id'] == doc['current']
    canonical = f'{SITE}/legal/{slug}'
    pdf = f'/legal/pdf/satorus-{slug}-{version["id"]}.pdf'
    if is_current:
        note = 'This is the version currently in force.'
    else:
        note = (f'Superseded — this is an archived version. '
                f'<a href="/legal/{slug}">View the current version</a>.')
    page_title = doc['pageTitle'] + ('' if is_current else f' (v{version["label"]})')

    # definitions table hint for the MSA (first table = definitions)
    body = body.replace('<div class="table-wrap">', '<div class="table-wrap dfn-table">', 1) \
        if slug == 'msa' else body

    extra_foot = ('Questions: <a href="mailto:harry@satorusgroup.com">harry@satorusgroup.com</a>'
                  if slug == 'documentation' else '')

    return f"""<!doctype html>
<html lang="en">
<head>
{head(page_title, doc['description'], canonical)}
</head>
<body>
{bar()}
<main class="shell">
<div class="side">
{toc_html(toc)}
</div>
<article>
<div class="eyebrow" data-chrome="1">{html.escape(doc.get('eyebrow', 'Legal · Contractual document'))}</div>
<h1>{title_html}</h1>
<div class="version-banner">
<span class="version-line"{version_chrome}>{html.escape(version_text)}</span>
<span class="version-note" data-chrome="1">{note}</span>
<a class="dl" data-chrome="1" href="{pdf}">Download PDF</a>
</div>
<div class="intro-gap"></div>
{body}
</article>
</main>
{version_history_html(slug, doc)}
{footer(extra_foot)}
{TOC_SCRIPT}
</body>
</html>
"""


def index_page(manifest):
    cards = []
    for slug, doc in manifest['documents'].items():
        cur = next(v for v in doc['versions'] if v['id'] == doc['current'])
        pdf = f'/legal/pdf/satorus-{slug}-{cur["id"]}.pdf'
        cards.append(f"""<li class="doc-card">
<h2><a href="/legal/{slug}">{html.escape(doc['shortTitle'])}</a></h2>
<div class="doc-meta">Version {cur['label']} · effective {cur['effective']}</div>
<p class="doc-desc">{html.escape(doc['description'])}</p>
<div class="doc-links"><a href="/legal/{slug}">Read online</a>
<a href="{pdf}">Download PDF</a>
<a href="/legal/{slug}/{cur['id']}">Permanent link to v{cur['label']}</a></div>
</li>""")
    description = ('Contractual documents for the Sidney platform: the Satorus '
                   'Master Services Agreement, Data Processing Agreement and '
                   'Documentation, each versioned with its effective date.')
    return f"""<!doctype html>
<html lang="en">
<head>
{head('Legal — Satorus Group', description, f'{SITE}/legal')}
</head>
<body>
{bar()}
<main class="index-shell">
<h1>Legal</h1>
<p class="index-lede">The contractual documents below are incorporated by
reference into signed Order Forms. The canonical URLs always serve the version
currently in force; each version also has a permanent archive link.</p>
<ul class="docs">
{''.join(cards)}
</ul>
</main>
{footer()}
</body>
</html>
"""


def main():
    update_hashes = '--update-hashes' in sys.argv
    manifest_path = CONTENT / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))

    for slug, doc in manifest['documents'].items():
        for v in doc['versions']:
            data = (CONTENT / v['file']).read_bytes()
            digest = hashlib.sha256(data).hexdigest()
            if v['sha256'] == 'TBD' or (update_hashes and v['sha256'] != digest):
                v['sha256'] = digest
                print(f'recorded hash for {v["file"]}: {digest[:16]}…')
            elif v['sha256'] != digest:
                raise SystemExit(
                    f'INTEGRITY FAILURE: {v["file"]} does not match its recorded '
                    f'sha256. Shipped versions are immutable — restore the file, '
                    f'or publish a new version instead.')
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n',
                             encoding='utf-8')

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'index.html').write_text(index_page(manifest), encoding='utf-8')
    print('wrote public/legal/index.html')

    for slug, doc in manifest['documents'].items():
        for v in doc['versions']:
            page = doc_page(slug, doc, v, is_archive=True)
            d = OUT / slug / v['id']
            d.mkdir(parents=True, exist_ok=True)
            (d / 'index.html').write_text(page, encoding='utf-8')
            print(f'wrote public/legal/{slug}/{v["id"]}/index.html')
            if v['id'] == doc['current']:
                (OUT / slug / 'index.html').write_text(page, encoding='utf-8')
                print(f'wrote public/legal/{slug}/index.html (current = {v["id"]})')


if __name__ == '__main__':
    main()
