#!/usr/bin/env python3
"""Convert a Satorus legal .docx into a faithful HTML fragment.

Why not mammoth/pandoc: these documents number their clauses with Word
auto-numbering (multi-level lists, style-linked, with per-annex restarts).
Generic converters drop the numbers entirely, but the clause numbers are
load-bearing — signed Order Forms cross-reference them. This script
implements enough of the OOXML numbering model to reproduce them exactly:

  - abstractNum levels with composite lvlText ("%1.%2.%3")
  - numStyleLink indirection (abstractNum -> numbering style -> num)
  - style-chain numbering (paragraph style carries numId/ilvl via basedOn)
  - lvlOverride: startOverride and full <lvl> redefinition, applied at
    first use of the concrete numId (this is how the DPA's Annex B
    sections restart at "1.")
  - counter semantics: incrementing a level resets deeper levels; a
    skipped intermediate level displays its start value (Word behaviour —
    gives MSA clause 3 its "3.1.1" with no explicit "3.1" paragraph)

Output blocks carry data-style="<WordStyleId>" so the page build script
can map paragraph styles to semantic tags (h2/h3/etc.) per document.
Numbering is emitted as literal text inside <span class="num">, never as
<ol> markers, so the numbers survive copy/paste, search, and print.

Usage: docx2html.py <input.docx> <output.html>
"""
import sys, zipfile, html, re
import xml.etree.ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
RELS = '{http://schemas.openxmlformats.org/package/2006/relationships}'


def qget(el, tag, attr='val'):
    c = el.find(f'{W}{tag}')
    return c.get(f'{W}{attr}') if c is not None else None


def onoff(el, tag):
    """Word on/off property: present with no val (or val true/1/on) = on."""
    c = el.find(f'{W}{tag}')
    if c is None:
        return None
    v = c.get(f'{W}val')
    return v not in ('false', '0', 'none', 'off')


class Level:
    def __init__(self, el):
        self.ilvl = int(el.get(f'{W}ilvl'))
        self.fmt = qget(el, 'numFmt') or 'decimal'
        self.text = qget(el, 'lvlText') or ''
        self.start = int(qget(el, 'start') or 1)


class Numbering:
    def __init__(self, xml, styles):
        self.abstracts = {}       # absId -> {ilvl: Level}
        self.links = {}           # absId -> numbering-style id (numStyleLink)
        self.nums = {}            # numId -> (absId, {ilvl: override dict})
        self.styles = styles
        if xml is None:
            return
        root = ET.fromstring(xml)
        for a in root.findall(f'{W}abstractNum'):
            aid = a.get(f'{W}abstractNumId')
            link = qget(a, 'numStyleLink')
            if link:
                self.links[aid] = link
            self.abstracts[aid] = {}
            for l in a.findall(f'{W}lvl'):
                lv = Level(l)
                self.abstracts[aid][lv.ilvl] = lv
        for n in root.findall(f'{W}num'):
            nid = n.get(f'{W}numId')
            aid = qget(n, 'abstractNumId')
            ovr = {}
            for o in n.findall(f'{W}lvlOverride'):
                il = int(o.get(f'{W}ilvl'))
                so = qget(o, 'startOverride')
                lvl_el = o.find(f'{W}lvl')
                ovr[il] = {
                    'start': int(so) if so is not None else None,
                    'lvl': Level(lvl_el) if lvl_el is not None else None,
                }
            self.nums[nid] = (aid, ovr)
        # counters keyed by resolved abstract id — all nums sharing an
        # abstract share counters (that's what makes 1..22 run through the
        # whole DPA); startOverrides reset them at section boundaries.
        self.counters = {}
        self.applied = set()      # numIds whose overrides have been applied

    def resolve_abs(self, num_id, seen=None):
        """Follow numStyleLink chains to the abstract that owns levels+counters."""
        seen = seen or set()
        if num_id in seen or num_id not in self.nums:
            return None
        seen.add(num_id)
        aid, _ = self.nums[num_id]
        link = self.links.get(aid)
        if link:
            st = self.styles.get(link)
            if st and st.get('numId'):
                deeper = self.resolve_abs(st['numId'], seen)
                if deeper:
                    return deeper
        return aid

    def level_def(self, num_id, ilvl):
        if num_id not in self.nums:
            return None
        aid, ovr = self.nums[num_id]
        o = ovr.get(ilvl)
        if o and o['lvl'] is not None:
            return o['lvl']
        lv = self.abstracts.get(aid, {}).get(ilvl)
        if lv is None or (aid in self.links):
            real = self.resolve_abs(num_id)
            if real is not None:
                lv = self.abstracts.get(real, {}).get(ilvl, lv)
        return lv

    def _fmt(self, fmt, n):
        if fmt == 'decimal':
            return str(n)
        if fmt in ('lowerLetter', 'upperLetter'):
            s = ''
            # Word: a..z, aa, bb, cc ... (27 -> aa)
            letter = chr(ord('a') + (n - 1) % 26)
            s = letter * ((n - 1) // 26 + 1)
            return s.upper() if fmt == 'upperLetter' else s
        if fmt in ('lowerRoman', 'upperRoman'):
            vals = [(1000, 'm'), (900, 'cm'), (500, 'd'), (400, 'cd'),
                    (100, 'c'), (90, 'xc'), (50, 'l'), (40, 'xl'),
                    (10, 'x'), (9, 'ix'), (5, 'v'), (4, 'iv'), (1, 'i')]
            out, k = '', n
            for v, sym in vals:
                while k >= v:
                    out += sym
                    k -= v
            return out.upper() if fmt == 'upperRoman' else out
        if fmt == 'none':
            return ''
        return str(n)

    def number(self, num_id, ilvl):
        """Return (kind, text) — kind is 'bullet', 'num' or None."""
        lv = self.level_def(num_id, ilvl)
        if lv is None:
            return (None, '')
        if lv.fmt == 'bullet':
            return ('bullet', '')
        if lv.fmt == 'none' and '%' not in lv.text:
            return (None, '')
        key = self.resolve_abs(num_id) or self.nums[num_id][0]
        ctr = self.counters.setdefault(key, [0] * 9)
        if num_id not in self.applied:
            self.applied.add(num_id)
            _, ovr = self.nums[num_id]
            # Only an explicit startOverride restarts numbering; a full <lvl>
            # redefinition changes formatting but the counter keeps running
            # (this is what makes Annex A's Parts run 1..7 while Annex B's
            # restart at Part 1).
            for il, o in ovr.items():
                if o['start'] is not None:
                    ctr[il] = o['start'] - 1
        ctr[ilvl] += 1
        for l in range(ilvl + 1, 9):
            ctr[l] = 0
        out = lv.text
        for n in range(9, 0, -1):
            if f'%{n}' in out:
                ld = self.level_def(num_id, n - 1)
                v = ctr[n - 1]
                if v == 0:  # skipped parent level: Word shows its start value
                    v = ld.start if ld else 1
                    ctr[n - 1] = v
                out = out.replace(f'%{n}', self._fmt(ld.fmt if ld else 'decimal', v))
        return ('num', out)


def load_styles(xml):
    """styleId -> {basedOn, numId, ilvl, bold, italic, caps, rtype}"""
    styles = {}
    if xml is None:
        return styles
    root = ET.fromstring(xml)
    for st in root.findall(f'{W}style'):
        sid = st.get(f'{W}styleId')
        d = {'basedOn': qget(st, 'basedOn'), 'numId': None, 'ilvl': None,
             'bold': None, 'italic': None, 'caps': None,
             'rtype': st.get(f'{W}type')}
        ppr = st.find(f'{W}pPr')
        if ppr is not None:
            npr = ppr.find(f'{W}numPr')
            if npr is not None:
                d['numId'] = qget(npr, 'numId')
                il = qget(npr, 'ilvl')
                d['ilvl'] = int(il) if il is not None else None
        rpr = st.find(f'{W}rPr')
        if rpr is not None:
            d['bold'] = onoff(rpr, 'b')
            d['italic'] = onoff(rpr, 'i')
            d['caps'] = onoff(rpr, 'caps')
        styles[sid] = d
    return styles


def style_chain(styles, sid):
    seen = []
    while sid and sid in styles and sid not in seen:
        seen.append(sid)
        sid = styles[sid]['basedOn']
    return [styles[s] for s in seen]


def style_num(styles, sid):
    """numId/ilvl from a style's basedOn chain (nearest wins per field)."""
    num_id, ilvl = None, None
    for d in style_chain(styles, sid):
        if num_id is None and d['numId'] is not None:
            num_id = d['numId']
        if ilvl is None and d['ilvl'] is not None:
            ilvl = d['ilvl']
    return num_id, ilvl


def style_flag(styles, sid, key):
    for d in style_chain(styles, sid):
        if d[key] is not None:
            return d[key]
    return None


class Converter:
    def __init__(self, path):
        z = zipfile.ZipFile(path)
        def read(name):
            try:
                return z.read(name)
            except KeyError:
                return None
        self.styles = load_styles(read('word/styles.xml'))
        self.numbering = Numbering(read('word/numbering.xml'), self.styles)
        self.doc = ET.fromstring(read('word/document.xml'))
        self.rels = {}
        rels_xml = read('word/document.xml.rels') or read('word/_rels/document.xml.rels')
        if rels_xml is not None:
            for rel in ET.fromstring(rels_xml).findall(f'{RELS}Relationship'):
                self.rels[rel.get('Id')] = rel.get('Target')

    # ---- runs -------------------------------------------------------------
    def run_html(self, r, pstyle):
        rpr = r.find(f'{W}rPr')
        rstyle = qget(rpr, 'rStyle') if rpr is not None else None
        bold = onoff(rpr, 'b') if rpr is not None else None
        italic = onoff(rpr, 'i') if rpr is not None else None
        caps = onoff(rpr, 'caps') if rpr is not None else None
        if bold is None and rstyle:
            bold = style_flag(self.styles, rstyle, 'bold')
        if italic is None and rstyle:
            italic = style_flag(self.styles, rstyle, 'italic')
        if caps is None and rstyle:
            caps = style_flag(self.styles, rstyle, 'caps')
        if caps is None and pstyle:
            # caps can come from the paragraph style's run properties (this is
            # how the MSA's Heading1 renders "PLATFORM USE" etc. in Word);
            # runs that opt out carry an explicit <w:caps w:val="false"/>
            caps = style_flag(self.styles, pstyle, 'caps')
        parts = []
        for child in r:
            tag = child.tag
            if tag == f'{W}t':
                parts.append(html.escape(child.text or ''))
            elif tag == f'{W}tab':
                parts.append(' ')
            elif tag == f'{W}br':
                parts.append('<br/>')
            elif tag == f'{W}noBreakHyphen':
                parts.append('-')
        text = ''.join(parts)
        if not text:
            return ''
        if caps:
            text = f'<span class="caps">{text}</span>'
        if italic:
            text = f'<em>{text}</em>'
        if bold:
            text = f'<strong>{text}</strong>'
        return text

    def para_content(self, p, pstyle):
        parts = []
        for child in p:
            if child.tag == f'{W}r':
                parts.append(self.run_html(child, pstyle))
            elif child.tag == f'{W}hyperlink':
                inner = ''.join(self.run_html(r, pstyle)
                                for r in child.findall(f'{W}r'))
                rid = child.get(f'{R}id')
                target = self.rels.get(rid, '')
                if target and inner:
                    parts.append(f'<a href="{html.escape(target)}">{inner}</a>')
                else:
                    parts.append(inner)
            elif child.tag == f'{W}ins':  # accepted-revision wrapper
                for r in child.findall(f'{W}r'):
                    parts.append(self.run_html(r, pstyle))
            elif child.tag == f'{W}sdt':  # structured document tag (gdocs export)
                content = child.find(f'{W}sdtContent')
                if content is not None:
                    parts.append(self.para_content(content, pstyle))
            elif child.tag == f'{W}smartTag':
                parts.append(self.para_content(child, pstyle))
        return ''.join(parts)

    # ---- paragraphs -------------------------------------------------------
    def para_meta(self, p):
        ppr = p.find(f'{W}pPr')
        pstyle = qget(ppr, 'pStyle') if ppr is not None else None
        num_id, ilvl = None, None
        if ppr is not None:
            npr = ppr.find(f'{W}numPr')
            if npr is not None:
                num_id = qget(npr, 'numId')
                il = qget(npr, 'ilvl')
                ilvl = int(il) if il is not None else None
        s_num, s_ilvl = style_num(self.styles, pstyle) if pstyle else (None, None)
        if num_id is None:
            num_id = s_num
        if ilvl is None:
            ilvl = s_ilvl if s_ilvl is not None else 0
        if num_id in (None, '0'):
            num_id = None
        return pstyle, num_id, ilvl

    def paragraph_html(self, p):
        """Returns (kind, html) — kind: 'empty' | 'bullet' | 'para'."""
        pstyle, num_id, ilvl = self.para_meta(p)
        content = self.para_content(p, pstyle)
        if not content.strip():
            return ('empty', '')
        kind, numtext = (None, '')
        if num_id is not None:
            kind, numtext = self.numbering.number(num_id, ilvl)
        attrs = f' data-style="{html.escape(pstyle)}"' if pstyle else ''
        if kind == 'bullet':
            return ('bullet', f'<li{attrs}>{content}</li>')
        if kind == 'num' and numtext:
            return ('para',
                    f'<p class="clause lvl{ilvl}"{attrs}>'
                    f'<span class="num">{html.escape(numtext)}</span> {content}</p>')
        return ('para', f'<p{attrs}>{content}</p>')

    # ---- tables -----------------------------------------------------------
    def table_html(self, tbl):
        # Resolve vMerge into rowspans via a first pass over the grid.
        rows = tbl.findall(f'{W}tr')
        grid = []
        for tr in rows:
            cells = []
            for tc in tr.findall(f'{W}tc'):
                tcpr = tc.find(f'{W}tcPr')
                span = 1
                vmerge = None
                if tcpr is not None:
                    gs = tcpr.find(f'{W}gridSpan')
                    if gs is not None:
                        span = int(gs.get(f'{W}val'))
                    vm = tcpr.find(f'{W}vMerge')
                    if vm is not None:
                        vmerge = vm.get(f'{W}val') or 'continue'
                paras = []
                for pp in tc.findall(f'{W}p'):
                    k, h = self.paragraph_html(pp)
                    if k == 'bullet':
                        paras.append(f'<ul>{h}</ul>')
                    elif k != 'empty':
                        paras.append(h)
                cells.append({'span': span, 'vmerge': vmerge,
                              'html': ''.join(paras), 'rowspan': 1, 'skip': False})
            grid.append(cells)
        for ri, cells in enumerate(grid):
            col = 0
            for cell in cells:
                if cell['vmerge'] == 'continue':
                    # find origin cell in a previous row at same column
                    for pr in range(ri - 1, -1, -1):
                        pcol = 0
                        for pcell in grid[pr]:
                            if pcol == col and pcell['vmerge'] != 'continue':
                                pcell['rowspan'] += 1
                                break
                            pcol += pcell['span']
                        else:
                            continue
                        break
                    cell['skip'] = True
                col += cell['span']
        out = ['<table>']
        for cells in grid:
            out.append('<tr>')
            for cell in cells:
                if cell['skip']:
                    continue
                a = ''
                if cell['span'] > 1:
                    a += f' colspan="{cell["span"]}"'
                if cell['rowspan'] > 1:
                    a += f' rowspan="{cell["rowspan"]}"'
                out.append(f'<td{a}>{cell["html"]}</td>')
            out.append('</tr>')
        out.append('</table>')
        return ''.join(out)

    # ---- document ---------------------------------------------------------
    def convert(self):
        body = self.doc.find(f'{W}body')
        out = []
        bullet_open = False
        def close_bullets():
            nonlocal bullet_open
            if bullet_open:
                out.append('</ul>')
                bullet_open = False
        blocks = []
        def flatten(parent):
            for child in parent:
                if child.tag == f'{W}sdt':
                    content = child.find(f'{W}sdtContent')
                    if content is not None:
                        flatten(content)
                else:
                    blocks.append(child)
        flatten(body)
        for child in blocks:
            if child.tag == f'{W}p':
                kind, h = self.paragraph_html(child)
                if kind == 'empty':
                    continue
                if kind == 'bullet':
                    if not bullet_open:
                        out.append('<ul>')
                        bullet_open = True
                    out.append(h)
                else:
                    close_bullets()
                    out.append(h)
            elif child.tag == f'{W}tbl':
                close_bullets()
                out.append(self.table_html(child))
        close_bullets()
        return '\n'.join(out)


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    html_out = Converter(src).convert()
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(html_out)
    sys.stderr.write(f'wrote {dst} ({len(html_out)} bytes)\n')
