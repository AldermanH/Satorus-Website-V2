#!/usr/bin/env node
/**
 * Build the immutable legal content modules in src/legal/content/ from the
 * source .docx files in "Legal docs/".
 *
 * Fidelity rules (these pages are contractual documents):
 *  - Text comes from the docx XML verbatim (runs, bold, tables, caps).
 *  - Clause numbers are Word AUTO-NUMBERING, invisible to normal extractors.
 *    The rendered numbers were captured from Microsoft Word itself (the
 *    `list string` of every paragraph) into scripts/legal/word-numbering/*.txt.
 *    This script aligns each docx paragraph with its Word record and refuses
 *    to build if anything fails to line up.
 *  - Never edit a generated v-file after publication. To publish v1.1: add the
 *    new docx, run this script for the new version slug, and update the
 *    `current` pointer in src/legal/registry.js.
 *
 * Usage: node scripts/legal/build-legal-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DOCS_DIR = path.join(ROOT, 'Legal docs');
const NUM_DIR = path.join(ROOT, 'scripts', 'legal', 'word-numbering');
const OUT_DIR = path.join(ROOT, 'src', 'legal', 'content');

/* ────────────────────────── minimal XML parser ────────────────────────── */

function decodeEntities(s) {
  return s.replace(/&(amp|lt|gt|quot|apos|#x?[0-9a-fA-F]+);/g, (m, e) => {
    if (e === 'amp') return '&';
    if (e === 'lt') return '<';
    if (e === 'gt') return '>';
    if (e === 'quot') return '"';
    if (e === 'apos') return "'";
    const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return String.fromCodePoint(code);
  });
}

function parseXML(src) {
  let pos = 0;
  function parseAttrs(s) {
    const attrs = {};
    const re = /([\w:.-]+)\s*=\s*"([^"]*)"/g;
    let m;
    while ((m = re.exec(s))) attrs[m[1]] = decodeEntities(m[2]);
    return attrs;
  }
  function parseNodes(parentTag) {
    const nodes = [];
    while (pos < src.length) {
      if (src[pos] === '<') {
        if (src.startsWith('</', pos)) {
          const end = src.indexOf('>', pos);
          const tag = src.slice(pos + 2, end).trim();
          if (tag !== parentTag) throw new Error(`XML mismatch: </${tag}> inside <${parentTag}> @${pos}`);
          pos = end + 1;
          return nodes;
        }
        if (src.startsWith('<?', pos) || src.startsWith('<!--', pos)) {
          const close = src.startsWith('<?', pos) ? '?>' : '-->';
          pos = src.indexOf(close, pos) + close.length;
          continue;
        }
        const end = src.indexOf('>', pos);
        let inner = src.slice(pos + 1, end);
        const selfClose = inner.endsWith('/');
        if (selfClose) inner = inner.slice(0, -1);
        const sp = inner.search(/[\s]/);
        const tag = sp === -1 ? inner : inner.slice(0, sp);
        const attrs = sp === -1 ? {} : parseAttrs(inner.slice(sp));
        pos = end + 1;
        const node = { tag, attrs, children: [] };
        if (!selfClose) node.children = parseNodes(tag);
        nodes.push(node);
      } else {
        const next = src.indexOf('<', pos);
        const text = src.slice(pos, next === -1 ? src.length : next);
        if (text) nodes.push({ tag: '#text', text: decodeEntities(text) });
        pos = next === -1 ? src.length : next;
      }
    }
    return nodes;
  }
  return parseNodes(null);
}

function findAll(nodes, tag, out = []) {
  for (const n of nodes) {
    if (n.tag === tag) out.push(n);
    if (n.children) findAll(n.children, tag, out);
  }
  return out;
}
function child(node, tag) {
  return node.children ? node.children.find((c) => c.tag === tag) : undefined;
}

/* ────────────────────────── docx reading ────────────────────────── */

function readEntry(docxPath, entry) {
  return execFileSync('unzip', ['-p', docxPath, entry], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
}

function onOff(rpr, tag) {
  const n = rpr && child(rpr, tag);
  if (!n) return undefined;
  const v = n.attrs['w:val'];
  return v === '0' || v === 'false' || v === 'none' ? false : true;
}

function styleMaps(stylesXml) {
  const tree = parseXML(stylesXml);
  const styles = {};
  for (const s of findAll(tree, 'w:style')) {
    const id = s.attrs['w:styleId'];
    const rpr = child(s, 'w:rPr');
    styles[id] = {
      basedOn: child(s, 'w:basedOn')?.attrs['w:val'],
      bold: onOff(rpr, 'w:b'),
      italic: onOff(rpr, 'w:i'),
      caps: onOff(rpr, 'w:caps'),
      smallCaps: onOff(rpr, 'w:smallCaps'),
    };
  }
  function resolve(id, prop) {
    let cur = id, guard = 0;
    while (cur && styles[cur] && guard++ < 20) {
      const v = styles[cur][prop];
      if (v !== undefined) return v;
      cur = styles[cur].basedOn;
    }
    return undefined;
  }
  return { resolve };
}

function relTargets(relsXml) {
  const map = {};
  for (const r of findAll(parseXML(relsXml), 'Relationship')) map[r.attrs.Id] = r.attrs.Target;
  return map;
}

/* Extract formatted segments from a paragraph node. */
function paraSegments(pNode, styleRes, rels) {
  const pPr = child(pNode, 'w:pPr');
  const pStyle = pPr && child(pPr, 'w:pStyle')?.attrs['w:val'];
  const base = {
    bold: pStyle ? styleRes.resolve(pStyle, 'bold') : undefined,
    italic: pStyle ? styleRes.resolve(pStyle, 'italic') : undefined,
    caps: pStyle ? styleRes.resolve(pStyle, 'caps') : undefined,
  };
  const segs = [];
  const fld = { depth: 0, inInstr: false };

  function walk(nodes, link) {
    for (const n of nodes) {
      if (n.tag === 'w:hyperlink') {
        const target = n.attrs['r:id'] ? rels[n.attrs['r:id']] : undefined;
        walk(n.children, target || link);
      } else if (n.tag === 'w:fldSimple') {
        walk(n.children, link);
      } else if (n.tag === 'w:r') {
        const rpr = child(n, 'w:rPr');
        const rStyle = rpr && child(rpr, 'w:rStyle')?.attrs['w:val'];
        const fmt = {
          bold: onOff(rpr, 'w:b') ?? (rStyle ? styleRes.resolve(rStyle, 'bold') : undefined) ?? base.bold ?? false,
          italic: onOff(rpr, 'w:i') ?? (rStyle ? styleRes.resolve(rStyle, 'italic') : undefined) ?? base.italic ?? false,
          caps: onOff(rpr, 'w:caps') ?? (rStyle ? styleRes.resolve(rStyle, 'caps') : undefined) ?? base.caps ?? false,
          link,
        };
        for (const c of n.children) {
          if (c.tag === 'w:fldChar') {
            const t = c.attrs['w:fldCharType'];
            if (t === 'begin') { fld.depth++; fld.inInstr = true; }
            else if (t === 'separate') fld.inInstr = false;
            else if (t === 'end') { fld.depth = Math.max(0, fld.depth - 1); fld.inInstr = false; }
          } else if (c.tag === 'w:instrText') {
            /* field code, not displayed */
          } else if (fld.inInstr) {
            /* skip anything inside field instruction */
          } else if (c.tag === 'w:t') {
            const text = (c.children || []).map((x) => x.text ?? '').join('');
            segs.push({ ...fmt, text: fmt.caps ? text.toUpperCase() : text });
          } else if (c.tag === 'w:tab') {
            segs.push({ ...fmt, text: ' ' });
          } else if (c.tag === 'w:br') {
            segs.push({ ...fmt, text: '\n' });
          } else if (c.tag === 'w:noBreakHyphen') {
            segs.push({ ...fmt, text: '‑' });
          }
        }
      }
    }
  }
  walk(pNode.children || [], undefined);

  /* merge adjacent segments with identical formatting */
  const merged = [];
  for (const s of segs) {
    const last = merged[merged.length - 1];
    if (last && last.bold === s.bold && last.italic === s.italic && last.link === s.link) last.text += s.text;
    else merged.push({ ...s });
  }
  return { pStyle, segs: merged };
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function segsToHtml(segs) {
  return segs
    .map((s) => {
      let h = esc(s.text).replace(/\n/g, '<br/>');
      if (s.bold) h = `<strong>${h}</strong>`;
      if (s.italic) h = `<em>${h}</em>`;
      if (s.link) h = `<a href="${esc(s.link)}">${h}</a>`;
      return h;
    })
    .join('');
}
const segsText = (segs) => segs.map((s) => s.text).join('');

/* ────────────────────── Word numbering ground truth ────────────────────── */

function loadWordRecords(slug) {
  const raw = fs.readFileSync(path.join(NUM_DIR, `${slug}.txt`), 'utf8');
  const recs = [];
  for (const line of raw.split('\n')) {
    const m = line.match(/^⟦(.*?)⟧(.*)$/);
    if (m) recs.push({ num: m[1].replace(/\s+$/, ''), text: m[2] });
  }
  return recs;
}
const norm = (s) => s.replace(/[\s ]+/g, ' ').trim();

function makeAligner(records, slug) {
  let i = 0;
  return function align(text) {
    const t = norm(text);
    if (!t) return '';
    for (let j = i; j < Math.min(i + 60, records.length); j++) {
      if (norm(records[j].text) === t) {
        i = j + 1;
        return records[j].num.trim();
      }
    }
    throw new Error(
      `[${slug}] could not align paragraph with Word numbering dump:\n  "${t.slice(0, 120)}"\n  next dump records: ${records
        .slice(i, i + 4)
        .map((r) => JSON.stringify(norm(r.text).slice(0, 60)))
        .join(' | ')}`
    );
  };
}

/* ────────────────────────── document walking ────────────────────────── */

function walkDocument(docxPath, slug) {
  const doc = parseXML(readEntry(docxPath, 'word/document.xml'));
  const styleRes = styleMaps(readEntry(docxPath, 'word/styles.xml'));
  const rels = relTargets(readEntry(docxPath, 'word/_rels/document.xml.rels'));
  const align = makeAligner(loadWordRecords(slug), slug);

  const body = child(findAll(doc, 'w:document')[0] ?? { children: doc }, 'w:body') ?? { children: [] };
  const blocks = [];

  for (const node of body.children) {
    if (node.tag === 'w:p') {
      const { pStyle, segs } = paraSegments(node, styleRes, rels);
      const text = segsText(segs);
      if (!norm(text)) continue; // spacing / section-break paragraphs
      blocks.push({ kind: 'para', style: pStyle || '', segs, text, num: align(text) });
    } else if (node.tag === 'w:tbl') {
      const rows = [];
      for (const tr of node.children.filter((c) => c.tag === 'w:tr')) {
        const cells = [];
        for (const tc of tr.children.filter((c) => c.tag === 'w:tc')) {
          const paras = [];
          for (const p of tc.children.filter((c) => c.tag === 'w:p')) {
            const { segs } = paraSegments(p, styleRes, rels);
            if (norm(segsText(segs))) {
              align(segsText(segs)); // keep dump pointer in sync
              paras.push(segs);
            }
          }
          cells.push(paras);
        }
        if (cells.length) rows.push(cells);
      }
      if (rows.length) blocks.push({ kind: 'table', rows });
    }
  }
  return blocks;
}

/* ────────────────────────── HTML emission ────────────────────────── */

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function numToken(num) {
  const m1 = num.match(/^([0-9.]+)\.?$/);
  if (m1) return m1[1].replace(/\./g, '-');
  const m2 = num.match(/^\(([a-z0-9ivxlc]+)\)$/i);
  if (m2) return m2[1].toLowerCase();
  return slugify(num);
}

function renderTable(t) {
  const rowHtml = (cells, tag) =>
    '<tr>' +
    cells
      .map((paras) => `<${tag}>${paras.map((segs) => `<p>${segsToHtml(segs)}</p>`).join('')}</${tag}>`)
      .join('') +
    '</tr>';
  const first = t.rows[0];
  const headerish =
    first &&
    first.every((paras) => paras.every((segs) => segs.every((s) => s.bold || !norm(s.text))));
  let html = '<div class="legal-table-wrap"><table class="legal-table">';
  if (headerish && t.rows.length > 1) {
    html += `<thead>${rowHtml(first, 'th')}</thead><tbody>${t.rows
      .slice(1)
      .map((r) => rowHtml(r, 'td'))
      .join('')}</tbody>`;
  } else {
    html += `<tbody>${t.rows.map((r) => rowHtml(r, 'td')).join('')}</tbody>`;
  }
  return html + '</table></div>';
}

/**
 * Shared emitter. Per-document config decides which styles are section
 * headings; everything else becomes numbered/plain paragraphs or bullets.
 */
function emit(blocks, cfg) {
  const out = [];
  const toc = [];
  const usedIds = new Set();
  const stack = []; // { level, id }
  let listOpen = false;
  let curAnnex = null;
  let curPart = null;

  const uniq = (id) => {
    let v = id, n = 2;
    while (usedIds.has(v)) v = `${id}-${n++}`;
    usedIds.add(v);
    return v;
  };
  const closeList = () => {
    if (listOpen) { out.push('</ul>'); listOpen = false; }
  };
  const numSpan = (num) => (num ? `<span class="legal-num">${esc(num)}</span> ` : '');

  for (const b of blocks) {
    if (b.kind === 'table') { closeList(); out.push(renderTable(b)); continue; }

    const { style, segs, text, num } = b;
    const bodyHtml = segsToHtml(segs).trim();
    const isBullet = num === '•' || num === '·' || num === '';
    const level = cfg.levelOf(style, num);

    /* skip the doc-title and version-line paragraphs: rendered by the page header */
    if (cfg.skip && cfg.skip(b, out.length)) continue;

    /* Annex headings (DPA) */
    if (style === 'Annex') {
      closeList();
      curAnnex = numToken(num); curPart = null;
      const id = uniq(numToken(num) || 'annex');
      out.push(`<h2 id="${id}" class="legal-h2 legal-annex">${numSpan(num)}${bodyHtml}</h2>`);
      toc.push({ id, label: `${num} — ${norm(text)}`, level: 0 });
      stack.length = 0;
      continue;
    }
    if (style === 'Part') {
      closeList();
      if (num) {
        curPart = numToken(num);
        const id = uniq(`${curAnnex || 'annex'}-${numToken(num)}`);
        out.push(`<h3 id="${id}" class="legal-h3">${numSpan(num)}${bodyHtml}</h3>`);
        toc.push({ id, label: `${num} — ${norm(text)}`, level: 1 });
        stack.length = 0;
      } else {
        out.push(`<h4 class="legal-h4">${bodyHtml}</h4>`);
      }
      continue;
    }

    /* numbered/unnumbered paragraphs and headings */
    if (num && !isBullet) {
      closeList();
      const tok = numToken(num);
      const isDotted = /^[0-9.]+\.?$/.test(num);
      let id;
      if (isDotted && !curAnnex) {
        id = `clause-${tok}`;
      } else if (isDotted && curAnnex) {
        id = `${curAnnex}${curPart ? '-' + curPart : ''}-cl-${tok}`;
      } else {
        const parent = [...stack].reverse().find((s) => s.level < level);
        id = parent ? `${parent.id}-${tok}` : `clause-${tok}`;
      }
      id = uniq(id);
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      stack.push({ level, id });

      if (cfg.isH2 && cfg.isH2(b)) {
        out.push(`<h2 id="${id}" class="legal-h2">${numSpan(num)}${bodyHtml}</h2>`);
        toc.push({ id, label: `${num} ${norm(text)}`, level: 0 });
        continue;
      }
      if (cfg.isH3 && cfg.isH3(b)) {
        out.push(`<h3 id="${id}" class="legal-h3">${numSpan(num)}${bodyHtml}</h3>`);
        if (cfg.h3InToc) toc.push({ id, label: `${num} ${norm(text)}`, level: 1 });
        continue;
      }
      out.push(
        `<p id="${id}" class="legal-p lvl-${Math.min(level, 5)}">${numSpan(num)}<span class="legal-body">${bodyHtml}</span></p>`
      );
      continue;
    }

    if (isBullet && num) {
      if (!listOpen) { out.push('<ul class="legal-ul">'); listOpen = true; }
      out.push(`<li>${bodyHtml}</li>`);
      continue;
    }

    /* unnumbered paragraph */
    closeList();
    if (cfg.isH2 && cfg.isH2(b)) {
      const id = uniq(slugify(norm(text)).slice(0, 60) || 'section');
      out.push(`<h2 id="${id}" class="legal-h2">${bodyHtml}</h2>`);
      toc.push({ id, label: norm(text), level: 0 });
      continue;
    }
    if (cfg.isLabel && cfg.isLabel(b)) {
      out.push(`<p class="legal-label-line">${bodyHtml}</p>`);
      continue;
    }
    out.push(`<p class="legal-p lvl-0 unnum">${bodyHtml}</p>`);
  }
  closeList();
  return { html: out.join('\n'), toc };
}

/* ────────────────────────── per-document configs ────────────────────────── */

const DOCS = [
  {
    slug: 'msa',
    file: 'Satorus - Master Services Agreement (web version).docx',
    name: 'Master Services Agreement',
    shortName: 'MSA',
    description:
      'The Satorus Master Services Agreement governing access to and use of the Sidney platform. Incorporated by reference into signed Order Forms.',
    cfg: {
      levelOf(style) {
        const m = style.match(/^Heading(\d)$/);
        if (m) return Number(m[1]) - 1;
        return 0;
      },
      skip: (b, emitted) => emitted === 0 && /^SATORUS - MASTER SERVICES AGREEMENT/.test(norm(b.text)) ||
        /^Version 1\.0 – effective/.test(norm(b.text)),
      isH2: (b) => b.style === 'Heading1',
      isH3: (b) =>
        b.style === 'Heading2' && b.segs.every((s) => s.bold || !norm(s.text)) && norm(b.text).length < 60,
      isLabel: (b) => norm(b.text) === 'TERMS',
      h3InToc: false,
    },
  },
  {
    slug: 'dpa',
    file: 'Satorus - Sidney - Data Processing Agreement (web version).docx',
    name: 'Data Processing Agreement',
    shortName: 'DPA',
    description:
      'The Satorus Data Processing Agreement for the Sidney platform, containing the clauses required by Article 28(3) UK GDPR and EU GDPR, with processing particulars and international transfer terms.',
    cfg: {
      levelOf(style, num) {
        if (style === 'TitleClause') return 0;
        if (/^(Schedule)?Untitledsubclause1$/.test(style)) return 1;
        if (/^(Schedule)?Untitledsubclause2$/.test(style)) return 2;
        if (/^(Schedule)?Untitledsubclause3$/.test(style)) return 3;
        if (/^(Schedule)?Untitledsubclause4$/.test(style)) return 4;
        if (/^\d+\.$/.test(num)) return 0;
        if (/^\d+\.\d+$/.test(num)) return 1;
        if (/^\([a-z]+\)$/.test(num)) return 2;
        if (/^\([ivxlc]+\)$/.test(num)) return 3;
        return 1;
      },
      skip: (b, emitted) =>
        (emitted === 0 && /^DATA PROCESSING AGREEMENT/.test(norm(b.text))) ||
        /^Version 1\.0 – effective/.test(norm(b.text)),
      isH2: (b) =>
        (b.style === 'TitleClause' && /^\d+\.$/.test(b.num) && norm(b.text).length < 60) ||
        (!b.num && norm(b.text) === 'AGREED TERMS'),
      isH3: () => false,
      isLabel: (b) => !b.num && /^This DPA is entered into by the parties/.test(norm(b.text)),
      h3InToc: false,
    },
  },
  {
    slug: 'documentation',
    file: 'Satorus - Sidney - Documentation.docx',
    name: 'Sidney Documentation',
    shortName: 'Documentation',
    description:
      'The Documentation for the Sidney platform under the Satorus Master Services Agreement: platform description, user instructions and the Credit Schedule.',
    cfg: {
      levelOf() {
        return 0;
      },
      skip: (b, emitted) =>
        (emitted === 0 && /^SATORUS – SIDNEY – DOCUMENTATION/.test(norm(b.text))) ||
        /^Version 1\.0 – effective/.test(norm(b.text)),
      isH2: (b) => b.style === 'Heading1' && /^\d+\.\s/.test(norm(b.text)),
      isH3: () => false,
      isLabel: () => false,
      h3InToc: false,
    },
  },
];

/* Documentation headings carry literal numbers ("1. About Sidney") — give them
   stable ids and ToC entries. */
function fixDocumentationToc(html, toc) {
  const newToc = [];
  let newHtml = html;
  for (const t of toc) {
    const m = t.label.match(/^(\d+)\.\s+(.*)$/);
    if (m) {
      const id = `section-${m[1]}`;
      newHtml = newHtml.replace(`id="${t.id}"`, `id="${id}"`);
      newToc.push({ id, label: t.label, level: 0 });
    } else newToc.push(t);
  }
  return { html: newHtml, toc: newToc };
}

/* ────────────────────────── build ────────────────────────── */

const VERSION = {
  number: '1.0',
  slug: 'v1-0',
  effective: '2026-07-20',
  effectiveDisplay: '20 July 2026',
  banner: 'Version 1.0 – effective 20 July 2026',
};

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const d of DOCS) {
  const docxPath = path.join(DOCS_DIR, d.file);
  const blocks = walkDocument(docxPath, d.slug);
  const titleBlock = blocks.find((b) => b.kind === 'para');
  let { html, toc } = emit(blocks, d.cfg);
  if (d.slug === 'documentation') ({ html, toc } = fixDocumentationToc(html, toc));

  const module_ = {
    slug: d.slug,
    name: d.name,
    shortName: d.shortName,
    description: d.description,
    docTitle: norm(titleBlock.text),
    version: VERSION.number,
    versionSlug: VERSION.slug,
    effective: VERSION.effective,
    effectiveDisplay: VERSION.effectiveDisplay,
    banner: VERSION.banner,
    toc,
    html,
  };
  const file = path.join(OUT_DIR, `${d.slug}-${VERSION.slug}.js`);
  fs.writeFileSync(
    file,
    `/* GENERATED by scripts/legal/build-legal-content.mjs — DO NOT EDIT.\n` +
      ` * Immutable content of ${d.name} v${VERSION.number} (effective ${VERSION.effectiveDisplay}).\n` +
      ` * Publishing a new version means adding a NEW file, never editing this one. */\n` +
      `export default ${JSON.stringify(module_, null, 2)};\n`
  );
  console.log(`${d.slug}: ${blocks.length} blocks, ${toc.length} toc entries → ${path.relative(ROOT, file)}`);
}
console.log('done');
