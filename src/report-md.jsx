/* Report markdown → React, mirroring the product's ReportContent.tsx rules:
   ## sections, ### sub-heads, bullets, blockquotes, **bold**, inline [n] /
   [Sn] / [Dn] citations as circular badges, and "Confidence: **High**"
   regex-matched into confidence pills. Shared by the /showcase loop.        */
import React from "react";

export const CONF = {
  "High":        { filled: 4, half: false, cls: "high",    label: "High Confidence" },
  "Medium-High": { filled: 3, half: true,  cls: "medhigh", label: "Medium-High Confidence" },
  "Medium":      { filled: 3, half: false, cls: "med",     label: "Medium Confidence" },
  "Medium-Low":  { filled: 2, half: false, cls: "medlow",  label: "Medium-Low Confidence" },
  "Low":         { filled: 1, half: false, cls: "low",     label: "Low Confidence" },
};
export const Confidence = ({ level }) => {
  const s = CONF[level] || CONF.Medium;
  return (
    <span className={`pv-conf ${s.cls}`}>
      <span className="pv-conf-dots">
        {[0, 1, 2, 3].map((i) => {
          if (s.half && i === s.filled) return <span key={i} className="pv-conf-dot half"/>;
          return <span key={i} className={`pv-conf-dot ${i < s.filled ? "on" : ""}`}/>;
        })}
      </span>
      {s.label}
    </span>
  );
};

/* Inline citation badge — news (cyan) · social (purple) · dark (amber). */
export const Cite = ({ n, v }) => <sup className={`pv-cite ${v || ""}`} data-cite={n}>{n}</sup>;

const INLINE_SRC = "Confidence:\\s*\\*\\*(High|Medium-High|Medium-Low|Medium|Low)\\*\\*|\\*\\*(.+?)\\*\\*|\\[(\\d+)\\]|\\[S(\\d+)(?::[vat])?\\]|\\[D(\\d+)\\]";
export function inline(text, keyBase = "t") {
  const re = new RegExp(INLINE_SRC, "g");
  const out = [];
  let last = 0, m, k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<span key={`${keyBase}-${k++}`} className="pv-conf-inline"><Confidence level={m[1]}/></span>);
    else if (m[2]) out.push(<strong key={`${keyBase}-${k++}`}>{inline(m[2], `${keyBase}b${k}`)}</strong>);
    else if (m[3]) out.push(<Cite key={`${keyBase}-${k++}`} n={m[3]}/>);
    else if (m[4]) out.push(<Cite key={`${keyBase}-${k++}`} n={`S${m[4]}`} v="social"/>);
    else if (m[5]) out.push(<Cite key={`${keyBase}-${k++}`} n={`D${m[5]}`} v="dark"/>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/* Markdown body → [{ title, nodes: [{ t: "h3"|"p"|"ul"|"quote", c }] }] split on ## */
export function mdSections(md) {
  const sections = [];
  let cur = null;
  let para = [];
  const flush = () => { if (para.length && cur) cur.nodes.push({ t: "p", c: para.join(" ") }); para = []; };
  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) { flush(); cur = { title: line.slice(3).trim(), nodes: [] }; sections.push(cur); }
    else if (line.startsWith("### ")) { flush(); if (cur) cur.nodes.push({ t: "h3", c: line.slice(4).trim() }); }
    else if (line.startsWith("> ")) { flush(); if (cur) cur.nodes.push({ t: "quote", c: line.slice(2).trim() }); }
    else if (line.startsWith("- ")) {
      flush();
      if (cur) {
        const prev = cur.nodes[cur.nodes.length - 1];
        if (prev && prev.t === "ul") prev.c.push(line.slice(2));
        else cur.nodes.push({ t: "ul", c: [line.slice(2)] });
      }
    }
    else if (line.trim() === "") flush();
    else para.push(line.trim());
  }
  flush();
  return sections;
}

export const Prose = ({ nodes, keyBase = "s" }) => (
  <div className="pv-prose">
    {nodes.map((n, i) => {
      if (n.t === "h3") return <h3 key={i}>{n.c}</h3>;
      if (n.t === "quote") return <blockquote key={i}>{inline(n.c, `${keyBase}q${i}`)}</blockquote>;
      if (n.t === "ul") return <ul key={i}>{n.c.map((li, j) => <li key={j}>{inline(li, `${keyBase}l${i}-${j}`)}</li>)}</ul>;
      return <p key={i}>{inline(n.c, `${keyBase}p${i}`)}</p>;
    })}
  </div>
);
