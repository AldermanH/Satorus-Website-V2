/* Report visualisation prototype — hidden route /report-viz
   ─────────────────────────────────────────────────────────────────────────
   Engineering demo for the "report visualisations" work: renders a real
   Sidney report export ("report example.json") plus the proposed structured
   blocks (src/report-blocks.js) with deterministic template renderers, in
   the product's visual language (tokens mirrored from the /showcase mimic
   of sidney-staging).

   Every chart is hand-rolled SVG/HTML — no chart dependency — because each
   component must also render statically in the HTML/PDF export path. The
   "Export preview" toggle re-themes all components onto white via CSS
   custom properties to derisk the print/light requirement. */
import React from "react";
import { Icon, SatorusMark } from "./Components.jsx";
import { BLOCKS, REPORT_META } from "./report-blocks.js";
import report from "../report example.json";

/* vis-timeline (+ moment) loads only when the timeline panel is in
   interactive mode — keeps it out of the marketing-site bundle. */
const VisTimelinePanel = React.lazy(() => import("./ReportVizVisTimeline.jsx"));

/* ── Product primitives (mirror SiteA-Showcase.jsx) ── */
const Cite = ({ n }) => <sup className="pv-cite">{n}</sup>;

const CONF = {
  "High":        { filled: 4, half: false, cls: "high",    label: "High Confidence" },
  "Medium-High": { filled: 3, half: true,  cls: "medhigh", label: "Medium-High Confidence" },
  "Medium":      { filled: 3, half: false, cls: "med",     label: "Medium Confidence" },
  "Medium-Low":  { filled: 2, half: false, cls: "medlow",  label: "Medium-Low Confidence" },
  "Low":         { filled: 1, half: false, cls: "low",     label: "Low Confidence" },
};
const Confidence = ({ level }) => {
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

/* ── Category + severity token lookups ── */
const CAT = {
  security:     { v: "var(--rv-cat-sec)", label: "Security" },
  political:    { v: "var(--rv-cat-pol)", label: "Political" },
  commercial:   { v: "var(--rv-cat-com)", label: "Commercial" },
  humanitarian: { v: "var(--rv-cat-hum)", label: "Humanitarian" },
};
const SEV = {
  baseline: { v: "var(--rv-cat-pol)", label: "baseline" },
  upside:   { v: "var(--rv-cat-com)", label: "upside" },
  downside: { v: "var(--rv-cat-hum)", label: "downside" },
  tail:     { v: "var(--rv-cat-sec)", label: "tail risk" },
};

/* ── Inline markdown → React (bold, [n] / [Sn] citations, confidence) ── */
const INLINE_SRC = "Confidence:\\s*\\*\\*(High|Medium-High|Medium-Low|Medium|Low)\\*\\*|\\*\\*(.+?)\\*\\*|\\[(\\d+)\\]|\\[S(\\d+)(?::[vat])?\\]";
function inline(text, keyBase = "t") {
  // fresh regex per call — inline() recurses for bold content, and a shared
  // global regex's lastIndex would be clobbered by the inner call
  const re = new RegExp(INLINE_SRC, "g");
  const out = [];
  let last = 0, m, k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<span key={`${keyBase}-${k++}`} style={{ display: "inline-block", margin: "0 2px", verticalAlign: "middle" }}><Confidence level={m[1]}/></span>);
    else if (m[2]) out.push(<strong key={`${keyBase}-${k++}`}>{inline(m[2], `${keyBase}b${k}`)}</strong>);
    else if (m[3]) out.push(<Cite key={`${keyBase}-${k++}`} n={m[3]}/>);
    else if (m[4]) out.push(<Cite key={`${keyBase}-${k++}`} n={`S${m[4]}`}/>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/* Markdown body → [{title, nodes:[{t:"h3"|"p"|"ul", ...}]}] keyed on ## / ### */
function mdSections(md) {
  const sections = [];
  let cur = null;
  const lines = md.split("\n");
  let para = [];
  const flushPara = () => {
    if (para.length && cur) cur.nodes.push({ t: "p", c: para.join(" ") });
    para = [];
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) {
      flushPara();
      cur = { title: line.slice(3).trim(), nodes: [] };
      sections.push(cur);
    } else if (line.startsWith("### ")) {
      flushPara();
      if (cur) cur.nodes.push({ t: "h3", c: line.slice(4).trim() });
    } else if (line.startsWith("- ")) {
      flushPara();
      if (cur) {
        const prev = cur.nodes[cur.nodes.length - 1];
        if (prev && prev.t === "ul") prev.c.push(line.slice(2));
        else cur.nodes.push({ t: "ul", c: [line.slice(2)] });
      }
    } else if (line.trim() === "") {
      flushPara();
    } else {
      para.push(line.trim());
    }
  }
  flushPara();
  return sections;
}

const Prose = ({ nodes }) => (
  <div className="pv-prose">
    {nodes.map((n, i) => {
      if (n.t === "h3") return <div key={i} className="rv-h3">{n.c}</div>;
      if (n.t === "ul") return <ul key={i}>{n.c.map((li, j) => <li key={j}>{inline(li, `li${i}-${j}`)}</li>)}</ul>;
      return <p key={i}>{inline(n.c, `p${i}`)}</p>;
    })}
  </div>
);

/* ── Shared panel chrome ── */
const Panel = ({ icon, title, count, block, prov, children }) => (
  <section className="pv-sec pv-box">
    <div className="pv-box-h">
      {icon && <Icon name={icon} size={14}/>} {title}
      {count != null && <span className="pv-box-count">{count}</span>}
      {prov && <span className={`rv-prov ${prov}`} style={{ marginLeft: 10 }}>{prov === "authored" ? "authored for prototype" : prov === "derived" ? "derived from payload" : "payload"}</span>}
      {block && <span className="rv-blocktag">block:"{block}"</span>}
    </div>
    {children}
  </section>
);

/* ── Tooltip ── */
function useTip() {
  const [tip, setTip] = React.useState(null);
  const show = (e, title, lines) => {
    const x = Math.min(e.clientX + 14, window.innerWidth - 320);
    setTip({ x, y: e.clientY + 14, title, lines });
  };
  const showAt = (el, title, lines) => {
    const r = el.getBoundingClientRect();
    setTip({ x: Math.min(r.right + 8, window.innerWidth - 320), y: r.top, title, lines });
  };
  const hide = () => setTip(null);
  const node = tip ? (
    <div className="rv-tip" style={{ left: tip.x, top: tip.y }}>
      <div className="rv-tip-t">{tip.title}</div>
      {tip.lines.map((l, i) => <div key={i} className="rv-tip-l">{l}</div>)}
    </div>
  ) : null;
  return { show, showAt, hide, node };
}

/* ═══ 1. Scenario outlook ═══ */
const fmtPct = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const ScenarioOutlook = ({ data, tip }) => {
  const main = data.items.filter((s) => !s.orthogonal);
  const orth = data.items.filter((s) => s.orthogonal);
  const Row = ({ s }) => {
    const mid = (s.p_low + s.p_high) / 2;
    const sev = SEV[s.severity] || SEV.baseline;
    return (
      <div className="rv-scn">
        <div className="rv-scn-top">
          <span className="rv-scn-dot" style={{ background: sev.v }}/>
          <span className="rv-scn-name">{s.name}</span>
          <span className="rv-scn-sev">{sev.label}</span>
          <span className="rv-scn-band">{s.p_low}–{s.p_high}%</span>
        </div>
        <div
          className="rv-scn-track" tabIndex={0}
          onMouseMove={(e) => tip.show(e, s.name, [`Probability band ${s.p_low}–${s.p_high}% · midpoint ${fmtPct(mid)}%`, s.summary])}
          onMouseLeave={tip.hide}
          onFocus={(e) => tip.showAt(e.currentTarget, s.name, [`Probability band ${s.p_low}–${s.p_high}% · midpoint ${fmtPct(mid)}%`])}
          onBlur={tip.hide}
        >
          <span className="rv-scn-range" style={{ left: `${s.p_low}%`, width: `${s.p_high - s.p_low}%`, background: sev.v }}/>
          <span className="rv-scn-fill" style={{ width: `${mid}%`, background: sev.v }}/>
        </div>
        <p className="rv-scn-sum">{s.summary}</p>
        <details className="rv-ind">
          <summary>{s.indicators.length} indicators</summary>
          <ul>{s.indicators.map((ind, i) => <li key={i}>{ind}</li>)}</ul>
        </details>
      </div>
    );
  };
  return (
    <>
      <div className="rv-scn-list">
        {main.map((s) => <Row key={s.name} s={s}/>)}
        {orth.length > 0 && (
          <div className="rv-orth"><span className="rv-orth-pill">orthogonal — outside the scenario probability space</span></div>
        )}
        {orth.map((s) => <Row key={s.name} s={s}/>)}
      </div>
      <div className="rv-scn-axis">{[0, 25, 50, 75, 100].map((v) => <span key={v}>{v}%</span>)}</div>
      <p className="rv-note">Bar fills to the band midpoint; the lighter region spans the assessed range. Colour encodes severity tier. Probability bands are analyst-authored — the report grades the baseline trajectory <b>Medium confidence</b>.</p>
    </>
  );
};

/* ═══ 2. Timeline ═══ */
const dayMs = 86400000;
const P = (s) => Date.parse(`${s}T00:00:00Z`);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Shape({ cat, cx, cy, r = 5, hollow = false }) {
  const c = CAT[cat] || CAT.security;
  const fill = hollow ? "var(--rv-surface)" : c.v;
  const stroke = hollow ? c.v : "var(--rv-surface)";
  const sw = 2;
  if (cat === "political") {
    const d = r + 1.5;
    return <rect x={cx - d / 1.35} y={cy - d / 1.35} width={d * 1.48} height={d * 1.48} transform={`rotate(45 ${cx} ${cy})`} rx="1.5" fill={fill} stroke={stroke} strokeWidth={sw}/>;
  }
  if (cat === "commercial") return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx="1.5" fill={fill} stroke={stroke} strokeWidth={sw}/>;
  if (cat === "humanitarian") return <path d={`M ${cx} ${cy - r - 1} L ${cx + r + 1} ${cy + r} L ${cx - r - 1} ${cy + r} Z`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>;
  return <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={sw}/>;
}

const TimelineChart = ({ data, tip }) => {
  const W = 1120, padL = 16, padR = 16;
  const axisY = 200;
  const t0 = P(data.window.start), t1 = P(data.window.end);
  const x = (t) => padL + ((t - t0) / (t1 - t0)) * (W - padL - padR);
  const today = P(REPORT_META.generated);

  const dated = [
    ...data.events.map((e) => ({ ...e, t: P(e.date), kind: "event" })),
    ...data.forward_triggers.filter((f) => f.date).map((f) => ({
      ...f,
      t: f.precision === "month" ? P(`${f.date}-15`) : P(f.date),
      kind: "trigger",
    })),
  ].sort((a, b) => a.t - b.t);

  // De-collide same-date markers horizontally, then fit labels into lanes
  // (nearest-to-axis first, shortest leader lines). Each lane holds
  // non-overlapping intervals; a label may sit right or left of its marker.
  // Dense clusters degrade to a shorter truncation; tooltips carry full text.
  const xs = dated.map((d) => x(d.t));
  for (let i = 1; i < xs.length; i++) if (xs[i] - xs[i - 1] < 11) xs[i] = xs[i - 1] + 11;
  const lanes = [axisY - 32, axisY - 56, axisY - 80, axisY - 104, axisY - 128, axisY - 152, axisY - 176];
  const laneIv = lanes.map(() => []);
  const GAP = 12;
  const fits = (li, s, e) => laneIv[li].every(([is, ie]) => e < is - GAP || s > ie + GAP);
  const estW = (t) => t.length * 6.1 + 6;
  const gapsIn = (li) => {
    const iv = [...laneIv[li]].sort((a, b) => a[0] - b[0]);
    const gaps = [];
    let prev = padL;
    for (const [s, e] of iv) {
      if (s - GAP > prev) gaps.push([prev, s - GAP]);
      prev = Math.max(prev, e + GAP);
    }
    if (W - padR > prev) gaps.push([prev, W - padR]);
    return gaps;
  };
  const placeLabel = (xi, label) => {
    const attempts = [label.length > 30 ? `${label.slice(0, 29)}…` : label];
    if (label.length > 17) attempts.push(`${label.slice(0, 16)}…`);
    for (const text of attempts) {
      const w = estW(text);
      for (let li = 0; li < lanes.length; li++) {
        if (xi + w <= W - padR && fits(li, xi, xi + w)) return { li, lx: xi, w, text };
        if (xi - w >= padL && fits(li, xi - w, xi)) return { li, lx: xi - w, w, text };
      }
      let best = null; // slide into the nearest free gap, slanted leader
      for (let li = 0; li < lanes.length; li++) {
        for (const [gs, ge] of gapsIn(li)) {
          if (ge - gs < w) continue;
          const lx = Math.max(gs, Math.min(xi - w / 2, ge - w));
          const dist = Math.abs(lx + w / 2 - xi) + li * 14;
          if (dist <= 300 && (!best || dist < best.dist)) best = { li, lx, w, text, dist };
        }
      }
      if (best) return best;
    }
    const text = `${label.slice(0, 10)}…`;
    return { li: lanes.length - 1, lx: Math.max(padL, Math.min(xi, W - padR - estW(text))), w: estW(text), text };
  };
  const placed = dated.map((d, i) => {
    const p = placeLabel(xs[i], d.label);
    laneIv[p.li].push([p.lx, p.lx + p.w]);
    return { ...d, x: xs[i], laneY: lanes[p.li], lx: p.lx, w: p.w, text: p.text };
  });

  const undated = data.forward_triggers.filter((f) => !f.date);
  const monthTicks = [];
  for (let mo = 0; mo <= 13; mo++) {
    const t = Date.UTC(2026, mo, 1);
    if (t >= t0 && t <= t1) monthTicks.push({ t, label: MONTHS[mo % 12] });
  }
  const H = axisY + 44 + undated.length * 21 + 6;
  const fg = "var(--s-muted-fg)";

  return (
    <>
      <svg className="rv-tl-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Timeline of recorded events and forward triggers">
        {data.bands.map((b, i) => {
          const bx = x(P(b.from)), bw = x(P(b.to)) - bx;
          return (
            <g key={i}>
              <rect x={bx} y={20} width={bw} height={axisY - 20} fill={CAT[b.category].v} opacity="0.07"/>
              <text x={bx + bw - 6} y={30} fontSize="9" fontWeight="600" fill={fg} letterSpacing="0.06em" textAnchor="end">{b.label.toUpperCase()}</text>
            </g>
          );
        })}
        {monthTicks.map((mt, i) => (
          <g key={i}>
            <line x1={x(mt.t)} y1={axisY} x2={x(mt.t)} y2={axisY + 5} stroke="var(--rv-grid)" strokeWidth="1"/>
            <text x={x(mt.t) + 3} y={axisY + 17} fontSize="9.5" fill={fg}>{mt.label}{mt.label === "Jan" ? ` ${new Date(mt.t).getUTCFullYear() % 100}` : ""}</text>
          </g>
        ))}
        <line x1={padL} y1={axisY} x2={W - padR} y2={axisY} stroke="var(--rv-grid)" strokeWidth="1"/>

        <line x1={x(today)} y1={8} x2={x(today)} y2={axisY + 22} stroke="var(--s-fg)" strokeWidth="1.2" opacity="0.5"/>
        <text x={x(today) + 5} y={13} fontSize="9" fontWeight="700" fill="var(--s-fg)" opacity="0.75" letterSpacing="0.08em">TODAY · 14 JUL</text>

        {placed.map((d, i) => (
          <g key={i}>
            <line x1={Math.max(d.lx + 3, Math.min(d.x, d.lx + d.w - 3))} y1={d.laneY + 4} x2={d.x} y2={axisY - 8} stroke="var(--rv-grid)" strokeWidth="1"/>
            <text x={d.lx} y={d.laneY} fontSize="10" fill="var(--s-fg)" opacity="0.8" textAnchor="start">{d.text}</text>
            <g
              tabIndex={0}
              onMouseMove={(e) => tip.show(e, d.label, [
                d.kind === "trigger" ? `Expected · ${d.precision === "month" ? d.date : d.date}` : new Date(d.t).toUTCString().slice(5, 16),
                `${CAT[d.category].label}${d.kind === "trigger" ? " · forward trigger" : ""}`,
              ])}
              onMouseLeave={tip.hide}
              onFocus={(e) => tip.showAt(e.currentTarget, d.label, [CAT[d.category].label])}
              onBlur={tip.hide}
              style={{ cursor: "default" }}
            >
              <circle cx={d.x} cy={axisY} r="12" fill="transparent"/>
              <Shape cat={d.category} cx={d.x} cy={axisY} hollow={d.kind === "trigger"}/>
            </g>
          </g>
        ))}

        {undated.map((u, i) => {
          const y = axisY + 30 + i * 21;
          const ux = x(today) + 10;
          return (
            <g key={i}
               onMouseMove={(e) => tip.show(e, u.label, [`Undated forward trigger · ${u.window}`, CAT[u.category].label])}
               onMouseLeave={tip.hide}>
              <rect x={ux} y={y} width={W - padR - ux} height="17" rx="4" fill={CAT[u.category].v} opacity="0.08"/>
              <rect x={ux} y={y} width={W - padR - ux} height="17" rx="4" fill="none" stroke={CAT[u.category].v} strokeWidth="1" strokeDasharray="3 3" opacity="0.55"/>
              <text x={ux + 8} y={y + 12} fontSize="9.5" fill="var(--s-fg)" opacity="0.75">{u.label} — {u.window}</text>
            </g>
          );
        })}
      </svg>
      <div className="rv-legend">
        {Object.entries(CAT).map(([k, c]) => (
          <span key={k} className="rv-legend-item">
            <svg width="14" height="14" viewBox="0 0 14 14"><Shape cat={k} cx={7} cy={7} r={4.5}/></svg>
            {c.label}
          </span>
        ))}
        <span className="rv-legend-sep"/>
        <span className="rv-legend-item">
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="4.5" fill="var(--rv-surface)" stroke={fg} strokeWidth="2"/></svg>
          outlined = expected / forward
        </span>
      </div>
      <p className="rv-note">Recorded events left of the today marker; forward triggers right. Undated triggers render as a band across the horizon, not a point. Export variant: same SVG, no hover, taller layout with full labels.</p>
    </>
  );
};

/* ═══ 2b. Timeline hybrid — density strip + chronological list ═══
   The reading-first form: a slim label-free strip carries tempo (dot columns,
   today bar, dry-season band, open windows); every event's date and full
   label live in the list. Strip and list are hover-linked. Both halves are
   static-renderable, so workspace and export share this code path. */
const fmtDay = (iso) => {
  const d = new Date(P(iso));
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};
const TimelineHybrid = ({ data, tip }) => {
  const [hot, setHot] = React.useState(null);
  const W = 1120, padL = 16, padR = 16, H = 118, axisY = 88;
  const t0 = P("2025-11-01"), t1 = P("2027-03-01");
  const x = (t) => padL + ((t - t0) / (t1 - t0)) * (W - padL - padR);
  const today = P(REPORT_META.generated);

  const recorded = [...data.events].sort((a, b) => P(a.date) - P(b.date)).map((e, i) => ({ ...e, id: `e${i}`, t: P(e.date), kind: "recorded" }));
  const expected = data.forward_triggers.filter((f) => f.date).map((f, i) => ({
    ...f, id: `f${i}`, t: f.precision === "month" ? P(`${f.date}-15`) : P(f.date), kind: "expected",
    dateLabel: f.precision === "month" ? `${MONTHS[Number(f.date.slice(5, 7)) - 1]} ${f.date.slice(0, 4)}` : `${fmtDay(f.date)} ${f.date.slice(0, 4)}`,
  })).sort((a, b) => a.t - b.t);
  const undated = data.forward_triggers.filter((f) => !f.date).map((f, i) => ({ ...f, id: `u${i}`, kind: "undated" }));

  // dots stack into mini columns where dates nearly coincide — the tempo picture
  const dots = [];
  [...recorded, ...expected].sort((a, b) => a.t - b.t).forEach((d) => {
    const dx = x(d.t);
    const level = dots.filter((p) => Math.abs(p.dx - dx) < 10).length;
    dots.push({ ...d, dx, level });
  });

  const monthTicks = [];
  for (let t = Date.UTC(2025, 10, 1); t <= t1; ) {
    const d = new Date(t);
    monthTicks.push({ t, m: d.getUTCMonth(), y: d.getUTCFullYear() });
    t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
  }

  const dotHandlers = (d) => ({
    onMouseMove: (e) => { setHot(d.id); tip.show(e, d.label, [`${d.kind === "recorded" ? `${fmtDay(d.date)} 2026 · recorded` : `Expected · ${d.dateLabel}`} · ${CAT[d.category].label}`]); },
    onMouseLeave: () => { setHot(null); tip.hide(); },
  });
  const Row = ({ d, dateLabel }) => (
    <div
      className={`rvh-row ${hot === d.id ? "hot" : ""}`}
      onMouseEnter={() => setHot(d.id)} onMouseLeave={() => setHot(null)}
    >
      <span className="rvh-date">{dateLabel}</span>
      <span className={`rvh-dot ${d.kind} rvv-${d.category}`}/>
      <span className="rvh-label">
        {d.label}
        {d.kind === "undated" && <em className="rvh-win">{d.window}</em>}
      </span>
    </div>
  );

  return (
    <>
      <svg className="rv-tl-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Event density strip — dots per event over time">
        {data.bands.map((b, i) => (
          <rect key={i} x={x(P(b.from))} y={14} width={x(P(b.to)) - x(P(b.from))} height={axisY - 14} fill={CAT[b.category].v} opacity="0.08"/>
        ))}
        {monthTicks.map((mt, i) => (
          <g key={i}>
            <line x1={x(mt.t)} y1={axisY} x2={x(mt.t)} y2={axisY + 4} stroke="var(--rv-grid)" strokeWidth="1"/>
            {mt.m % 3 === 0 && <text x={x(mt.t) + 4} y={axisY + 15} fontSize="9.5" fill="var(--s-muted-fg)">{MONTHS[mt.m]}{mt.m === 0 ? ` '${String(mt.y).slice(2)}` : ""}</text>}
          </g>
        ))}
        <line x1={padL} y1={axisY} x2={W - padR} y2={axisY} stroke="var(--rv-grid)" strokeWidth="1"/>
        {undated.map((u, i) => (
          <g key={u.id} {...dotHandlers({ ...u, label: u.label })}
             onMouseMove={(e) => { setHot(u.id); tip.show(e, u.label, [`Undated forward trigger — ${u.window}`, CAT[u.category].label]); }}>
            <line x1={x(today) + 8} y1={26 + i * 13} x2={W - padR - 10} y2={26 + i * 13} stroke={CAT[u.category].v} strokeWidth="1.5" strokeDasharray="4 4" opacity={hot === u.id ? 1 : 0.55}/>
            <path d={`M ${W - padR - 10} ${22 + i * 13} L ${W - padR - 2} ${26 + i * 13} L ${W - padR - 10} ${30 + i * 13} Z`} fill={CAT[u.category].v} opacity={hot === u.id ? 1 : 0.55}/>
          </g>
        ))}
        <line x1={x(today)} y1={8} x2={x(today)} y2={axisY} stroke="var(--s-fg)" strokeWidth="1.2" opacity="0.55"/>
        <text x={x(today) - 5} y={16} fontSize="8.5" fontWeight="700" fill="var(--s-fg)" opacity="0.75" letterSpacing="0.08em" textAnchor="end">TODAY</text>
        {dots.map((d) => (
          <circle
            key={d.id} className={`rvh-sdot ${hot === d.id ? "hot" : ""}`}
            cx={d.dx} cy={axisY - 9 - d.level * 14} r="5.5"
            fill={d.kind === "expected" ? "var(--rv-surface)" : CAT[d.category].v}
            stroke={d.kind === "expected" ? CAT[d.category].v : "var(--rv-surface)"}
            strokeWidth="2"
            {...dotHandlers(d)}
          />
        ))}
      </svg>
      <div className="rvh-list">
        <div className="rvh-cols">
          <div>
            <div className="rvh-sect">Recorded · 2026</div>
            {recorded.map((d) => <Row key={d.id} d={d} dateLabel={fmtDay(d.date)}/>)}
          </div>
          <div>
            <div className="rvh-sect">Forward look · as of 14 Jul 2026</div>
            {expected.map((d) => <Row key={d.id} d={d} dateLabel={d.dateLabel}/>)}
            {undated.map((d) => <Row key={d.id} d={d} dateLabel="no date"/>)}
            <p className="rvh-note">Outlined = expected, dashed ring = undated window. Watch-indicators for each scenario live in the Scenario outlook below.</p>
          </div>
        </div>
      </div>
    </>
  );
};

/* ═══ 2c. Timeline v4 — vertical spine chronology (from scratch) ═══
   Time flows down, the way a chronology is read. Month headers group
   events; skipped months render as explicit gap rows so temporal distance
   stays honest; TODAY is a hard divider; expected items continue below on
   a dashed spine; undated windows close the tail. Category filter chips
   dim everything else. No hover needed to read anything; the whole thing
   is static markup, so workspace and export share it. */
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TimelineSpine = ({ data }) => {
  const [only, setOnly] = React.useState(null);
  const today = P(REPORT_META.generated);
  const band = data.bands[0];
  const bandFrom = P(band.from), bandTo = P(band.to);
  const inBand = (t) => t >= bandFrom && t <= bandTo;

  const recorded = [...data.events].sort((a, b) => P(a.date) - P(b.date)).map((e) => ({ ...e, t: P(e.date), kind: "recorded" }));
  const expected = data.forward_triggers.filter((f) => f.date).map((f) => ({
    ...f, t: f.precision === "month" ? P(`${f.date}-15`) : P(f.date), kind: "expected",
  })).sort((a, b) => a.t - b.t);
  const undated = data.forward_triggers.filter((f) => !f.date).map((f) => ({ ...f, kind: "undated" }));

  const counts = {};
  [...recorded, ...expected, ...undated].forEach((e) => { counts[e.category] = (counts[e.category] || 0) + 1; });

  const rows = [];
  const pushEvents = (list) => {
    let lastKey = null;
    list.forEach((e) => {
      const d = new Date(e.t);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      if (key !== lastKey) {
        if (lastKey !== null) {
          const [py, pm] = lastKey.split("-").map(Number);
          const skipped = (d.getUTCFullYear() - py) * 12 + d.getUTCMonth() - pm - 1;
          if (skipped > 0) {
            const from = MONTHS[(pm + 1) % 12], to = MONTHS[(pm + skipped) % 12];
            rows.push({ type: "gap", label: skipped === 1 ? `${from} · no recorded events` : `${from} – ${to} · no recorded events` });
          }
        }
        const bandStart = new Date(bandFrom);
        const opensHere = d.getUTCFullYear() === bandStart.getUTCFullYear() && d.getUTCMonth() === bandStart.getUTCMonth();
        rows.push({ type: "month", label: `${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}`, t: e.t, band: opensHere ? band.label : null });
        lastKey = key;
      }
      rows.push({ type: "ev", ...e });
    });
  };
  pushEvents(recorded);
  rows.push({ type: "today" });
  pushEvents(expected);
  rows.push({ type: "head", label: "Open windows · inside the 6–12 month horizon" });
  undated.forEach((u) => rows.push({ type: "ev", ...u, t: Infinity }));

  const dateLabel = (e) => {
    if (e.kind === "undated") return "—";
    if (e.kind === "expected" && e.precision === "month") return `≈ ${MONTHS[Number(e.date.slice(5, 7)) - 1]}`;
    return fmtDay(e.date);
  };
  const dimmed = (e) => only && e.category !== only;

  return (
    <div className="rvs">
      <div className="rvs-filters">
        <button className={`rvs-chip ${only === null ? "on" : ""}`} onClick={() => setOnly(null)}>All <b>{recorded.length + expected.length + undated.length}</b></button>
        {Object.entries(CAT).map(([k, c]) => (
          <button key={k} className={`rvs-chip ${only === k ? "on" : ""}`} onClick={() => setOnly(only === k ? null : k)}>
            <span className={`rvv-key rvv-${k}`}/>{c.label} <b>{counts[k] || 0}</b>
          </button>
        ))}
        <span className="rvs-filter-note">{only ? `showing ${CAT[only].label.toLowerCase()} — click again for all` : "click a category to focus it"}</span>
      </div>

      {rows.map((r, i) => {
        const future = r.type === "today" || (r.t !== undefined && r.t > today) || r.type === "head";
        const spineCls = `rvs-spine ${future ? "future" : ""} ${r.t !== undefined && r.t !== Infinity && inBand(r.t) ? "band" : ""}`;
        if (r.type === "month") return (
          <div key={i} className="rvs-month">
            <span className="rvs-date"/>
            <span className={spineCls}><i className="rvs-tick"/></span>
            <span className="rvs-month-label">{r.label}{r.band && <em className="rvs-band-chip">{r.band} · Jun–Oct</em>}</span>
          </div>
        );
        if (r.type === "gap") return (
          <div key={i} className="rvs-gap">
            <span className="rvs-date"/>
            <span className="rvs-spine gapline"/>
            <span>{r.label}</span>
          </div>
        );
        if (r.type === "today") return (
          <div key={i} className="rvs-todayrow">
            <span className="rvs-date"/>
            <span className="rvs-spine future"><i className="rvs-node today"/></span>
            <span className="rvs-today-label">Today · report generated 14 Jul 2026 — expected developments continue below</span>
          </div>
        );
        if (r.type === "head") return (
          <div key={i} className="rvs-month">
            <span className="rvs-date"/>
            <span className="rvs-spine future tail"><i className="rvs-tick"/></span>
            <span className="rvs-month-label">{r.label}</span>
          </div>
        );
        return (
          <div key={i} className={`rvs-row ${dimmed(r) ? "dim" : ""}`}>
            <span className="rvs-date">{dateLabel(r)}</span>
            <span className={`${spineCls} ${r.kind === "undated" ? "tail" : ""}`}>
              <i className={`rvs-node ${r.kind} rvv-${r.category}`}/>
            </span>
            <span className="rvs-label">
              {r.label}
              {r.kind === "undated" && <em className="rvh-win">{r.window}</em>}
            </span>
            <span className={`rvs-tag rvv-${r.category}`}>{CAT[r.category].label}</span>
          </div>
        );
      })}
      <p className="rv-note" style={{ marginLeft: 8 }}>Solid node = recorded · outlined = expected · dashed = undated window. The spine turns dashed after today; tinted where the dry-season spike window applies. Skipped months are shown, not hidden — vertical distance stays honest.</p>
    </div>
  );
};

/* ═══ 3. Risk matrix ═══ */
const sevBand = (p) => (p >= 20 ? "s4" : p >= 15 ? "s3" : p >= 10 ? "s2" : p >= 5 ? "s1" : "");
const RiskMatrix = ({ data, tip }) => {
  const clamp = (n) => Math.max(1, Math.min(5, Math.round(n)));
  const risks = data.risks.map((r) => ({ ...r, likelihood: clamp(r.likelihood), impact: clamp(r.impact) }));
  const byCell = {};
  risks.forEach((r) => {
    const key = `${r.likelihood},${r.impact}`;
    (byCell[key] = byCell[key] || []).push(r);
  });
  const offsets = { 1: [[0, 0]], 2: [[-14, 0], [14, 0]], 3: [[-16, 0], [0, 0], [16, 0]] };
  const sorted = [...risks].sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact);
  return (
    <div className="rv-mx-wrap">
      <div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="rv-mx-axis y">Likelihood ↑</span>
          <div style={{ flex: 1 }}>
            <div className="rv-mx">
              {[5, 4, 3, 2, 1].map((L) => (
                <React.Fragment key={L}>
                  <span className="rv-mx-ylab">{L}</span>
                  {[1, 2, 3, 4, 5].map((I) => {
                    const cell = byCell[`${L},${I}`] || [];
                    return (
                      <div key={I} className={`rv-mx-cell ${sevBand(L * I)}`}>
                        {cell.map((r, ri) => {
                          const [dx, dy] = (offsets[cell.length] || offsets[3])[ri] || [0, 0];
                          return (
                            <span
                              key={r.id} className="rv-mx-marker" tabIndex={0}
                              style={{ left: `calc(50% - 12px + ${dx}px)`, top: `calc(50% - 12px + ${dy}px)` }}
                              onMouseMove={(e) => tip.show(e, `${r.id} · ${r.label}`, [`Likelihood ${r.likelihood} · Impact ${r.impact}`, r.summary])}
                              onMouseLeave={tip.hide}
                              onFocus={(e) => tip.showAt(e.currentTarget, `${r.id} · ${r.label}`, [`Likelihood ${r.likelihood} · Impact ${r.impact}`])}
                              onBlur={tip.hide}
                            >{r.id}</span>
                          );
                        })}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
              <span/>
              {[1, 2, 3, 4, 5].map((I) => <span key={I} className="rv-mx-xlab">{I}</span>)}
            </div>
            <div className="rv-mx-axis" style={{ textAlign: "center", marginTop: 2 }}>Impact →</div>
          </div>
        </div>
        <div className="rv-mx-scale">
          <div className="rv-mx-scale-swatches">
            {["var(--rv-cell)", "var(--rv-sev-1)", "var(--rv-sev-2)", "var(--rv-sev-3)", "var(--rv-sev-4)"].map((c, i) => <span key={i} style={{ background: c }}/>)}
          </div>
          <span className="rv-mx-scale-lab">low → critical · severity = likelihood × impact</span>
        </div>
      </div>
      <div className="rv-mx-legend">
        {sorted.map((r) => (
          <div key={r.id} className="rv-mx-lrow">
            <span className="rv-mx-lid">{r.id}</span>
            <div>
              <div className="rv-mx-lhead">
                <span className="rv-mx-llab">{r.label}</span>
                <span className="rv-mx-lli">L{r.likelihood} × I{r.impact}</span>
              </div>
              <p className="rv-mx-lsum">{r.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══ 4. Phased roadmap ═══ */
const PhasedPlan = ({ data }) => {
  const W = 1120, pad = 10, aY = 20;
  const mx = (m) => pad + (m / data.axis_months) * (W - 2 * pad);
  const gates = data.tiers.filter((t) => t.gate_to_next);
  return (
    <>
      <svg className="rv-pp-axis" viewBox={`0 0 ${W} 36`} aria-hidden="true">
        <line x1={pad} y1={aY} x2={W - pad} y2={aY} stroke="var(--rv-grid)" strokeWidth="1"/>
        {Array.from({ length: data.axis_months + 1 }, (_, m) => (
          <g key={m}>
            <line x1={mx(m)} y1={aY - (m % 3 === 0 ? 5 : 3)} x2={mx(m)} y2={aY + (m % 3 === 0 ? 5 : 3)} stroke="var(--rv-grid)" strokeWidth="1"/>
            {m % 3 === 0 && <text x={mx(m)} y={aY + 16} fontSize="9.5" fill="var(--s-muted-fg)" textAnchor="middle">M{m}</text>}
          </g>
        ))}
        {gates.map((t, i) => (
          <rect key={i} x={mx(t.end) - 5.5} y={aY - 5.5} width="11" height="11" rx="2" transform={`rotate(45 ${mx(t.end)} ${aY})`} fill="var(--s-primary)"/>
        ))}
      </svg>
      <div className="rv-pp-tiers" style={{ gridTemplateColumns: data.tiers.map((t) => `${t.end - t.start}fr`).join(" ") }}>
        {data.tiers.map((t) => (
          <div key={t.name} className="rv-pp-tier">
            <div className="rv-pp-name">{t.name}</div>
            <span className="rv-pp-window">{t.window}</span>
            <details className="rv-ind">
              <summary>{t.actions.length} actions</summary>
              <ul>{t.actions.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </details>
          </div>
        ))}
      </div>
      <div className="rv-pp-gates" style={{ minHeight: 128, marginTop: 12 }}>
        {gates.map((t, i) => (
          <div key={i} className="rv-pp-gate" style={{ left: `${(t.end / data.axis_months) * 100}%`, transform: `translateX(${i === 0 ? -66 : -34}%)` }}>
            <div className="rv-pp-gate-card">
              <div className="rv-pp-gate-head"><span className="rv-pp-diamond"/> Gate → Tier {i + 2}</div>
              <ul>{t.gate_to_next.map((g, j) => <li key={j}>{g}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
      <p className="rv-note">Stage-gate: each tier opens only when the gate criteria hold. Actions collapse in the workspace and print in full on export. The report leaves trigger points to the client — this plan is <b>authored for the prototype</b>.</p>
    </>
  );
};

/* ═══ 5. Source composition ═══ */
const GRADE_FILL = { "A": "var(--rv-grade-a)", "B+": "var(--rv-grade-bp)", "B": "var(--rv-grade-b)", "C": "var(--rv-grade-c)", "D": "var(--rv-grade-d)" };
const GRADE_INK  = { "A": "#fff", "B+": "#16181d", "B": "#fff", "C": "#fff", "D": "#fff" };
const gradeTier = (g) => (/^A/.test(g) ? "a" : /^B/.test(g) ? "b" : "cd");
const Grade = ({ g }) => <span className={`pv-grade ${gradeTier(g)}`}>{g}</span>;

const SourceComposition = ({ data, tip }) => {
  const graded = Object.values(data.grade_distribution).reduce((a, b) => a + b, 0);
  const total = data.types.reduce((a, t) => a + t.count, 0);
  const maxType = Math.max(...data.types.map((t) => t.count));
  return (
    <>
      <div className="rv-sc-stats">
        <div className="rv-sc-stat"><span className="v">{total}</span><span className="k">sources cited</span></div>
        <div className="rv-sc-stat"><span className="v">{graded}</span><span className="k">graded news</span></div>
        <div className="rv-sc-stat"><span className="v">{data.average_score}</span><span className="k">avg score</span></div>
        <span className="rv-sc-profile">profile: {data.profile_used}</span>
      </div>
      <div className="rv-sc-bar">
        {Object.entries(data.grade_distribution).map(([g, n]) => (
          <div
            key={g} className="rv-sc-seg" tabIndex={0}
            style={{ flexGrow: n, background: GRADE_FILL[g] }}
            onMouseMove={(e) => tip.show(e, `Grade ${g}`, [`${n} of ${graded} graded sources · ${Math.round((n / graded) * 100)}%`])}
            onMouseLeave={tip.hide}
            onFocus={(e) => tip.showAt(e.currentTarget, `Grade ${g}`, [`${n} sources`])}
            onBlur={tip.hide}
          >
            {n >= 5 && <span style={{ color: GRADE_INK[g] }}>{g} · {n}</span>}
          </div>
        ))}
      </div>
      <div className="rv-legend">
        {Object.entries(data.grade_distribution).map(([g, n]) => (
          <span key={g} className="rv-legend-item"><Grade g={g}/><b style={{ color: "var(--s-fg)", fontVariantNumeric: "tabular-nums" }}>{n}</b></span>
        ))}
      </div>
      <div className="rv-sc-types">
        {data.types.map((t) => (
          <div key={t.type} className="rv-sc-type">
            <span className="t">{t.type === "darkweb" ? "Dark web" : t.type[0].toUpperCase() + t.type.slice(1)}</span>
            <span className="n">{t.count}</span>
            <span className="rv-sc-minitrack">
              {t.count > 0 && <span className="rv-sc-minifill" style={{ width: `${(t.count / maxType) * 100}%`, background: t.type === "news" ? "var(--s-primary)" : "var(--rv-geo-other)", borderRadius: t.count === maxType ? 4 : undefined }}/>}
            </span>
            {t.extends_only ? <span className="rv-sc-flag">extends-only</span> : <span/>}
          </div>
        ))}
        <p className="rv-sc-zero">Dark web: searched — no relevant posts (consistent with DarkOwl coverage gaps; ISM propaganda routes via IS-central Al-Naba).</p>
      </div>
      <p className="rv-note"><b>Production:</b> drives directly from <b>source_grading</b> (grade_distribution · average_score · total_sources_graded), already returned by the report API and currently rendered nowhere. Grade split here is illustrative — this payload's sources[] carry no grades. Social and dark-web sources extend the picture; they never upgrade confidence.</p>
    </>
  );
};

/* ═══ 6. Geo operational overlay (SVG schematic) ═══ */
const GEO_FILL = { hq: "var(--rv-cat-com)", incident: "var(--rv-cat-sec)", border: "var(--rv-cat-pol)", other: "var(--rv-geo-other)" };
const COAST = [
  [-14.1, 40.32], [-13.6, 40.55], [-13.15, 40.55], [-12.97, 40.49], [-12.9, 40.56],
  [-12.6, 40.6], [-12.44, 40.51], [-12.2, 40.62], [-11.95, 40.62], [-11.7, 40.6],
  [-11.5, 40.47], [-11.35, 40.37], [-11.15, 40.42], [-10.95, 40.45], [-10.77, 40.47],
  [-10.65, 40.62], [-10.5, 40.65], [-10.38, 40.52], [-10.3, 40.45],
];
const LABEL_TUNE = {
  "Pemba": { anchor: "end", dx: -10, dy: 3 },
  "Ancuabe": { anchor: "end", dx: -10, dy: 3 },
  "Meluco": { anchor: "end", dx: -10, dy: 3 },
  "Muidumbe": { anchor: "end", dx: -10, dy: 3 },
  "Nangade": { anchor: "end", dx: -10, dy: 3 },
  "Chiure": { anchor: "end", dx: -10, dy: 3 },
  "Palma": { anchor: "end", dx: -10, dy: -2 },
  "Afungi peninsula (Mozambique LNG site)": { dy: -8 },
  "Mocimboa da Praia": { dy: 12 },
  "Mozambique Channel": { dy: -8 },
};
const shortName = (e) => (e.includes("(") ? e.split("(")[0].trim() : e);

const GeoSchematic = ({ points, overlay, tip }) => {
  const [showAll, setShowAll] = React.useState(false);
  const W = 860;
  const dom = showAll
    ? { latN: 1.5, latS: -27.5, lngW: 28.0, lngE: 43.5, H: 540 }
    : { latN: -10.3, latS: -14.1, lngW: 38.2, lngE: 43.0, H: 640 };
  const px = (lng) => ((lng - dom.lngW) / (dom.lngE - dom.lngW)) * W;
  const py = (lat) => ((dom.latN - lat) / (dom.latN - dom.latS)) * dom.H;
  const inFrame = (p) => p.coordinates[0] <= dom.latN && p.coordinates[0] >= dom.latS && p.coordinates[1] >= dom.lngW && p.coordinates[1] <= dom.lngE;
  const visible = points.filter(inFrame);
  const offMap = points.filter((p) => !inFrame(p));
  const path = (pts, close) => pts.map(([la, ln], i) => `${i ? "L" : "M"} ${px(ln).toFixed(1)} ${py(la).toFixed(1)}`).join(" ") + (close ? " Z" : "");
  const landPath = `${path(COAST)} L ${px(dom.lngW)} ${py(COAST[COAST.length - 1][0])} L ${px(dom.lngW)} ${py(COAST[0][0])} Z`;
  const grat = { lats: [-11, -12, -13, -14], lngs: [39, 40, 41, 42] };
  const kindStroke = { contested_route: "var(--rv-cat-sec)", monitored_route: "var(--rv-cat-hum)" };

  return (
    <>
      <div className="rv-geo-frame">
        <span className="rv-geo-caption">Schematic · approximate geometry{showAll ? " · not to scale" : ""}</span>
        <button className="rv-geo-expand" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Focus operational area" : `Show all locations (${offMap.length} off-map)`}
        </button>
        <svg className="rv-geo-svg" viewBox={`0 0 ${W} ${dom.H}`} role="img" aria-label="Operational picture — schematic map of Cabo Delgado">
          {!showAll && <path d={landPath} fill="var(--rv-map-land)"/>}
          {!showAll && <path d={path(COAST)} fill="none" stroke="var(--rv-map-coast)" strokeWidth="1.2"/>}
          {grat.lngs.map((ln) => ln >= dom.lngW && ln <= dom.lngE && (
            <g key={`ln${ln}`}>
              <line x1={px(ln)} y1="0" x2={px(ln)} y2={dom.H} stroke="var(--s-fg)" opacity="0.05" strokeWidth="1"/>
              <text x={px(ln) + 4} y={dom.H - 8} fontSize="9" fill="var(--s-muted-fg)" opacity="0.7">{ln}°E</text>
            </g>
          ))}
          {grat.lats.map((la) => la <= dom.latN && la >= dom.latS && (
            <g key={`la${la}`}>
              <line x1="0" y1={py(la)} x2={W} y2={py(la)} stroke="var(--s-fg)" opacity="0.05" strokeWidth="1"/>
              <text x={6} y={py(la) - 4} fontSize="9" fill="var(--s-muted-fg)" opacity="0.7">{Math.abs(la)}°S</text>
            </g>
          ))}
          {!showAll && (
            <>
              <line x1={px(38.2)} y1={py(-10.42)} x2={px(40.52)} y2={py(-10.38)} stroke="var(--s-muted-fg)" strokeWidth="1" strokeDasharray="5 4" opacity="0.55"/>
              <text x={px(39.0)} y={py(-10.42) - 8} fontSize="10" fontWeight="600" letterSpacing="0.18em" fill="var(--s-muted-fg)" opacity="0.7">TANZANIA</text>
              <text x={px(42.0)} y={py(-12.3)} fontSize="10.5" fontStyle="italic" fill="var(--s-muted-fg)" opacity="0.8">Mozambique Channel</text>

              {overlay.areas.map((a, i) => (
                <g key={i}
                   onMouseMove={(e) => tip.show(e, a.label, [a.context, "kind: threat_area · approximate"])}
                   onMouseLeave={tip.hide}>
                  <path d={path(a.polygon, true)} fill="var(--rv-cat-sec)" opacity="0.13"/>
                  <path d={path(a.polygon, true)} fill="none" stroke="var(--rv-cat-sec)" strokeWidth="1.1" opacity="0.55"/>
                  <text x={px(40.1)} y={py(-11.9)} fontSize="9.5" fontStyle="italic" fill="var(--rv-cat-sec)" opacity="0.9">{a.label}</text>
                </g>
              ))}
              {overlay.routes.map((r, i) => (
                <g key={i}
                   onMouseMove={(e) => tip.show(e, r.label, [r.context, `kind: ${r.kind} · smoothed through named waypoints`])}
                   onMouseLeave={tip.hide}>
                  <path d={path(r.line)} fill="none" stroke="var(--rv-surface)" strokeWidth="4.5" opacity="0.6"/>
                  <path d={path(r.line)} fill="none" stroke={kindStroke[r.kind]} strokeWidth="2" strokeDasharray={r.kind === "contested_route" ? "7 5" : "2 5"} strokeLinecap="round"/>
                </g>
              ))}
              <text x={px(40.48)} y={py(-11.12)} fontSize="9.5" fontWeight="600" fill="var(--rv-cat-sec)" opacity="0.9">N380</text>
              <text x={px(39.85)} y={py(-13.1)} fontSize="9.5" fontWeight="600" fill="var(--rv-cat-hum)" opacity="0.9">N14</text>

              {overlay.movements.map((mv, i) => {
                const x1 = px(mv.from[1]), y1 = py(mv.from[0]), x2 = px(mv.to[1]), y2 = py(mv.to[0]);
                const cx = (x1 + x2) / 2 - 34, cy = (y1 + y2) / 2;
                return (
                  <g key={i}
                     onMouseMove={(e) => tip.show(e, mv.label, [mv.context])}
                     onMouseLeave={tip.hide}>
                    <defs>
                      <marker id={`rv-arr${i}`} viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                        <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--rv-move)"/>
                      </marker>
                    </defs>
                    <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} fill="none" stroke="var(--rv-move)" strokeWidth="2" markerEnd={`url(#rv-arr${i})`}/>
                    <text x={cx - 6} y={cy + 4} fontSize="9.5" fontStyle="italic" fill="var(--rv-move)" textAnchor="end">{mv.label}</text>
                  </g>
                );
              })}
            </>
          )}
          {showAll && (
            <g>
              <rect x={px(38.9)} y={py(-10.2)} width={px(41.2) - px(38.9)} height={py(-13.6) - py(-10.2)} fill="none" stroke="var(--s-primary)" strokeWidth="1.2" strokeDasharray="5 4"/>
              <text x={px(38.9)} y={py(-10.2) - 6} fontSize="9.5" fontWeight="600" fill="var(--s-primary)">Operational frame (focused view)</text>
            </g>
          )}
          {visible.map((p, i) => {
            const [la, ln] = p.coordinates;
            const t = LABEL_TUNE[p.entity] || LABEL_TUNE[shortName(p.entity)] || {};
            return (
              <g key={i}
                 tabIndex={0}
                 onMouseMove={(e) => tip.show(e, p.entity, [p.context, `type: ${p.type}`])}
                 onMouseLeave={tip.hide}
                 onFocus={(e) => tip.showAt(e.currentTarget, p.entity, [`type: ${p.type}`])}
                 onBlur={tip.hide}
                 style={{ cursor: "default" }}>
                <circle cx={px(ln)} cy={py(la)} r="11" fill="transparent"/>
                <circle cx={px(ln)} cy={py(la)} r="5" fill={GEO_FILL[p.type] || GEO_FILL.other} stroke="var(--rv-surface)" strokeWidth="2"/>
                <text
                  x={px(ln) + (t.dx != null ? t.dx : 10)} y={py(la) + (t.dy != null ? t.dy : 3.5)}
                  fontSize="10" fontWeight="500" fill="var(--s-fg)" opacity="0.85"
                  textAnchor={t.anchor || "start"}
                  style={{ paintOrder: "stroke", stroke: "var(--rv-map-sea)", strokeWidth: 3, strokeLinejoin: "round" }}
                >{shortName(p.entity)}</text>
              </g>
            );
          })}
        </svg>
        {!showAll && offMap.map((p, i) => (
          <span key={p.entity} className="rv-geo-chip" style={{ left: 12, bottom: 12 + i * 34 }}
                onMouseMove={(e) => tip.show(e, p.entity, [p.context, `type: ${p.type} · outside focused frame`])}
                onMouseLeave={tip.hide}>
            <span className="d" style={{ background: GEO_FILL[p.type] || GEO_FILL.other }}/>
            {shortName(p.entity)} · off-map {p.entity.startsWith("Kigali") ? "↖" : "↙"}
          </span>
        ))}
      </div>
      <div className="rv-legend">
        {[["hq", "HQ / facility"], ["incident", "Incident"], ["border", "Border / maritime"], ["other", "Context"]].map(([k, l]) => (
          <span key={k} className="rv-legend-item">
            <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="4.5" fill={GEO_FILL[k]} stroke="var(--rv-surface)" strokeWidth="2"/></svg>
            {l}
          </span>
        ))}
        <span className="rv-legend-sep"/>
        <span className="rv-legend-item"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="1" y="2" width="16" height="8" rx="2" fill="var(--rv-cat-sec)" opacity="0.25" stroke="var(--rv-cat-sec)" strokeWidth="1"/></svg>Threat area</span>
        <span className="rv-legend-item"><svg width="20" height="10" viewBox="0 0 20 10"><line x1="1" y1="5" x2="19" y2="5" stroke="var(--rv-cat-sec)" strokeWidth="2" strokeDasharray="5 3"/></svg>Contested route</span>
        <span className="rv-legend-item"><svg width="20" height="10" viewBox="0 0 20 10"><line x1="1" y1="5" x2="19" y2="5" stroke="var(--rv-cat-hum)" strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round"/></svg>Monitored route</span>
        <span className="rv-legend-item"><svg width="22" height="10" viewBox="0 0 22 10"><line x1="1" y1="5" x2="16" y2="5" stroke="var(--rv-move)" strokeWidth="2"/><path d="M 15 1 L 21 5 L 15 9 Z" fill="var(--rv-move)"/></svg>Movement</span>
      </div>
      <details className="rv-ind rv-geo-list">
        <summary>Locations list ({points.length}) — plain-text fallback for export & accessibility</summary>
        <ul>
          {points.map((p) => (
            <li key={p.entity}>
              <span className="d" style={{ background: GEO_FILL[p.type] || GEO_FILL.other }}/>
              <span className="e">{p.entity}</span>
              <span>{p.context}</span>
            </li>
          ))}
        </ul>
      </details>
      <p className="rv-note"><b>Production:</b> these layers map to Mapbox GL — typed markers with a legend, translucent area fills, styled route lines, arrow movement layers, popup cleanup (entity + context, no raw lat/long), cluster/collision handling, and bounds fitted to the primary cluster with a "show all" control (this payload's Maputo & Kigali points are exactly that outlier case). Export: Mapbox Static Images API with the same layers, falling back to this SVG schematic offline.</p>
    </>
  );
};

/* ═══ Key judgments (parsed from the payload's markdown) ═══ */
const JUDGE_RE = /Confidence:\s*\*\*(High|Medium-High|Medium-Low|Medium|Low)\*\*\s*((?:\[\w+\])*)\.?\s*$/;
const KeyJudgments = ({ items }) => (
  <ul className="pv-judgments">
    {items.map((li, i) => {
      const m = li.match(JUDGE_RE);
      const body = m ? li.slice(0, m.index).replace(/\s*$/, "") : li;
      return (
        <li key={i}>
          <span className="pv-j-num">{String(i + 1).padStart(2, "0")}</span>
          <div className="pv-j-body">
            <p>{inline(body, `j${i}`)}</p>
            {m && <span>{m[2] && inline(m[2], `jc${i}`)} <Confidence level={m[1]}/></span>}
          </div>
        </li>
      );
    })}
  </ul>
);

/* ═══ Page ═══ */
export const ReportVizA = () => {
  const [light, setLight] = React.useState(false);
  const [tlMode, setTlMode] = React.useState("hybrid");
  const [showAlts, setShowAlts] = React.useState(false);
  const tip = useTip();

  const sections = React.useMemo(() => mdSections(report.report_detailed_analysis), []);
  const judgments = sections.find((s) => s.title === "Key Judgments");
  const outlookIdx = sections.findIndex((s) => s.title.startsWith("Outlook"));
  const gapsIdx = sections.findIndex((s) => s.title.startsWith("Intelligence Gaps"));
  const midProse = sections.slice(1, outlookIdx);
  const outlook = sections[outlookIdx];
  const gaps = sections[gapsIdx];
  const methodology = React.useMemo(() => report.report_methodology.split("\n\n"), []);

  return (
    <div className={`rv-page ${light ? "rv-light" : ""}`}>
      <div className="rv-app">
      <aside className="pv-side rv-side">
        <div className="pv-side-head">
          <SatorusMark size={22} color="var(--s-primary)"/>
          <span className="pv-side-word">SIDNEY</span>
        </div>
        <nav className="pv-nav">
          {[
            { i: "sparkle", l: "Home" },
            { i: "search", l: "Investigations", active: true },
            { i: "file", l: "Projects" },
            { i: "globe", l: "Research" },
            { i: "network", l: "Social" },
          ].map((it) => (
            <div key={it.l} className={`pv-nav-item ${it.active ? "active" : ""}`}>
              {it.active && <span className="pv-nav-bar"/>}
              <Icon name={it.i} size={16}/><span>{it.l}</span>
            </div>
          ))}
        </nav>
        <div className="pv-side-foot">
          <span className="pv-avatar">HA</span>
          <div className="pv-side-user"><span className="n">Harry Alderman</span><span className="o">Satorus</span></div>
        </div>
      </aside>

      <main className="rv-main">
      <div className="rv-doc">
        <div className="pv-back"><Icon name="arrow" size={13} className="pv-back-arrow"/> Investigations</div>
        <div className="pv-doc-head"><h1 className="pv-doc-title">{report.title}</h1></div>
        <div className="pv-doc-meta">
          <span className="pv-status final"><span className="pv-status-dot"/>Finalised</span>
          <span className="pv-meta-x">{report.investigation_type.replace(/_/g, " ")}</span>
          <span className="pv-meta-x">{REPORT_META.generatedLabel}</span>
          <span className="pv-meta-x">{report.sources.length} news · 7 social · 0 dark-web</span>
          <span className="pv-meta-x">{report.geolocations.length} locations</span>
          <span className="pv-meta-note">Visualisation prototype — blocks flagged by provenance</span>
        </div>

        <div className="rv-tabsbar">
          <div className="pv-tabs">
            <span className="pv-tab active">Report</span>
            <span className="pv-tab">Sources</span>
            <span className="pv-tab">Dossier</span>
            <span className="pv-tab">Thread</span>
          </div>
          <div className="rv-theme">
            <button className={light ? "" : "on"} onClick={() => setLight(false)}>Workspace</button>
            <button className={light ? "on" : ""} onClick={() => setLight(true)}>Export preview</button>
          </div>
        </div>

        <div className="pv-report">
          <section className="pv-sec">
            <div className="pv-sec-label">Executive summary</div>
            <p className="pv-lead">{inline(report.report_summary, "sum")}</p>
          </section>

          {judgments && (
            <section className="pv-sec pv-box" style={{ marginTop: 20 }}>
              <div className="pv-box-h"><Icon name="crosshair" size={14}/> Key judgments <span className={`rv-prov payload`} style={{ marginLeft: 10 }}>payload</span></div>
              <KeyJudgments items={judgments.nodes.find((n) => n.t === "ul")?.c || []}/>
            </section>
          )}

          <section className="pv-sec pv-box">
            <div className="pv-box-h">
              <Icon name="chart" size={14}/> Timeline of developments
              <span className="rv-prov authored" style={{ marginLeft: 10 }}>authored for prototype</span>
              <button className="rvs-alts-btn" onClick={() => setShowAlts((v) => !v)}>{showAlts ? "Hide earlier iterations" : "Compare earlier iterations"}</button>
              <span className="rv-blocktag">block:"timeline"</span>
            </div>
            <TimelineSpine data={BLOCKS.timeline}/>
            {showAlts && (
              <div className="rvs-alts">
                <span className="rv-mini-toggle">
                  <button className={tlMode === "hybrid" ? "on" : ""} onClick={() => setTlMode("hybrid")}>v3 · Strip + list</button>
                  <button className={tlMode === "vis" ? "on" : ""} onClick={() => setTlMode("vis")}>v2 · vis-timeline</button>
                  <button className={tlMode === "static" ? "on" : ""} onClick={() => setTlMode("static")}>v1 · Static SVG</button>
                </span>
                <div style={{ marginTop: 14 }}>
                  {tlMode === "hybrid" && <TimelineHybrid data={BLOCKS.timeline} tip={tip}/>}
                  {tlMode === "vis" && (
                    <React.Suspense fallback={<p className="rv-note">Loading interactive timeline…</p>}>
                      <VisTimelinePanel/>
                    </React.Suspense>
                  )}
                  {tlMode === "static" && <TimelineChart data={BLOCKS.timeline} tip={tip}/>}
                </div>
              </div>
            )}
          </section>

          {midProse.map((sec) => (
            <Panel key={sec.title} title={sec.title}>
              <Prose nodes={sec.nodes}/>
            </Panel>
          ))}

          {outlook && (
            <Panel title={outlook.title}>
              <Prose nodes={outlook.nodes}/>
            </Panel>
          )}

          <Panel icon="chart" title="Scenario outlook" count={BLOCKS.scenarios.items.length} block="scenarios" prov="authored">
            <ScenarioOutlook data={BLOCKS.scenarios} tip={tip}/>
          </Panel>

          <Panel icon="crosshair" title="Risk matrix" count={BLOCKS.risk_matrix.risks.length} block="risk_matrix" prov="authored">
            <RiskMatrix data={BLOCKS.risk_matrix} tip={tip}/>
            <p className="rv-note">Labels condensed from the payload's <b>risk_factors[]</b> (11 entries); likelihood/impact scores authored for the prototype — in production the writer emits integer 1–5 scores, schema-validated and clamped at ingest.</p>
          </Panel>

          <Panel icon="file" title="Phased re-entry roadmap" block="phased_plan" prov="authored">
            <PhasedPlan data={BLOCKS.phased_plan}/>
          </Panel>

          {gaps && (
            <Panel title={gaps.title}>
              <Prose nodes={gaps.nodes}/>
            </Panel>
          )}

          <section className="pv-sec pv-box" style={{ marginTop: 20 }}>
            <div className="pv-box-h"><Icon name="network" size={14}/> Entities <span className="rv-prov payload" style={{ marginLeft: 10 }}>payload</span></div>
            <div className="pv-ent-label">Primary</div>
            <div className="pv-ent-list">
              {report.primary_entities.map((e) => (
                <div key={e.name} className="pv-ent">
                  <span className="pv-ent-name">{e.name}</span>
                  <span className="pv-ent-role">{e.role}</span>
                </div>
              ))}
            </div>
            <div className="pv-ent-label" style={{ marginTop: 16 }}>Secondary</div>
            <div className="pv-ent-chips">
              {report.secondary_entities.map((e) => <span key={e.name} className="pv-chip" title={e.role}>{e.name}</span>)}
            </div>
          </section>

          <Panel icon="globe" title="Operational picture" count={report.geolocations.length} block="geo" prov="authored">
            <GeoSchematic points={report.geolocations} overlay={BLOCKS.geo} tip={tip}/>
          </Panel>

          <Panel icon="newspaper" title="Source composition" block="source_composition" prov="derived">
            <SourceComposition data={BLOCKS.source_composition} tip={tip}/>
          </Panel>

          <Panel title="Methodology">
            <Prose nodes={methodology.map((p) => ({ t: "p", c: p }))}/>
          </Panel>

          <section className="pv-sec pv-box" style={{ marginTop: 20 }}>
            <div className="pv-box-h"><Icon name="newspaper" size={14}/> Sources <span className="pv-box-count">{report.sources.length}</span><span className="rv-prov payload" style={{ marginLeft: 10 }}>payload</span></div>
            <p className="rv-note rv-src-note">This export's sources[] carry <b>index + key_insight</b> only; production records add title, url, date, grade, composite score, factor scores and analyst signals (the annex + hover cards render from those).</p>
            <div className="pv-src-list">
              {report.sources.map((s) => (
                <div key={s.index} className="pv-src">
                  <span className="pv-src-i">{s.index}</span>
                  <div className="pv-src-body">
                    <div className="pv-src-insight" style={{ paddingTop: 3 }}>{s.key_insight}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="rv-foot">
            <SatorusMark size={14} color="var(--s-muted-fg)"/>
            Prototype for the report-visualisation work — deterministic renderers over structured blocks (report example.json); no LLM-generated markup. See the scoping doc for the MVP plan.
          </div>
        </div>
      </div>
      </main>
      </div>

      {tip.node}
    </div>
  );
};
