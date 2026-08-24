/* Launch / pitch-deck showcase — hidden route /showcase
   ─────────────────────────────────────────────────────────────────────────
   A fullscreen product clip: the REAL Sidney investigation page (deep-navy
   enterprise theme, electric-cyan accent, Inter, 8px radius) inside a
   windowed frame floating on the site-hero MeshGradient. Authored on a fixed
   1600×900 canvas and CSS-scaled to the viewport, so it records at 16:9.

   It behaves like the product, not a demo reel. One investigation plays:
     query typed → the reasoning graph BUILDS on the Graph tab while the run
     progresses (branches → evidence → findings → synthesis) → the Report tab
     is the actual document, read stop by stop (citation click opens the
     CitationPopover; map / timeline / outlook blocks populate as reached) →
     the Sources tab is read (graded news, social media with media analysis,
     dark web) → back to the finished graph → “Finish”.

   Content + choreography: src/showcase-content.jsx (shaped after the export).
   Reference UI: the real product (screenshots) / sidney-staging — never shipped.

   Debug: /showcase?scene=vis:geo | sec:Key%20Judgments | src:S1 | run | graph
          (&instant=1 disables smooth scrolling for headless captures)       */
import React from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { Icon } from "./Components.jsx";
import { INVESTIGATIONS } from "./showcase-content.jsx";
import { inline, mdSections, Prose } from "./report-md.jsx";

/* ═══ Small product icons (lucide-style, inline so the site's shared set stays untouched) ═══ */
const Ic = ({ n, size = 14, stroke = 1.7, className = "" }) => {
  const p = {
    pencil: <><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></>,
    refresh: <><path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/></>,
    repeat: <><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></>,
    checkcircle: <><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></>,
    dots: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    ext: <><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    film: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/></>,
    video: <><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></>,
    plane: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    note: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></>,
    fit: <><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></>,
    shieldoff: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 9 6 6M15 9l-6 6"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>{p[n]}</svg>
  );
};

/* ═══ Product primitives ═══════════════════════════════════════════════════ */
const gradeTier = (g) => (/^A/.test(g) ? "a" : /^B/.test(g) ? "b" : /^C/.test(g) ? "c" : g === "S" ? "social" : g === "UNVERIFIED" ? "dark" : "d");
const Grade = ({ g }) => <span className={`pv-grade ${gradeTier(g)}`}>{g}</span>;

const Reveal = ({ on, delay = 0, as: Tag = "div", className = "", children, ...rest }) => (
  <Tag className={`pv-rv ${on ? "on" : ""} ${className}`} style={{ transitionDelay: on ? `${delay}ms` : "0ms" }} {...rest}>{children}</Tag>
);

/* Real path lengths for draw-on strokes. We deliberately avoid SVG
   `pathLength` + `<marker>`: Chromium wipes pathLength-normalised dashes on
   the next repaint once a marker exists in the document. */
const segLen = (pts) => pts.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
const quadPts = (x1, y1, cx, cy, x2, y2, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2]; });
const cubicPts = (x1, y1, ax, ay, bx, by, x2, y2, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u ** 3 * x1 + 3 * u * u * t * ax + 3 * u * t * t * bx + t ** 3 * x2, u ** 3 * y1 + 3 * u * u * t * ay + 3 * u * t * t * by + t ** 3 * y2]; });

/* ═══ Query ════════════════════════════════════════════════════════════════ */
const RECENT = [
  { t: "Strait of Hormuz disruption — Berlin importer impact", k: "GEOPOLITICAL_ANALYSIS", d: "25 May 2026" },
  { t: "Middle East energy transition: dual-track 2026",       k: "MARKET_INTELLIGENCE",   d: "13 Jul 2026" },
  { t: "Puerto Barú sentiment analysis",                       k: "SOCIAL_INVESTIGATION",  d: "02 Jul 2026" },
];
const QueryScene = ({ typed, focused }) => (
  <div className="sc sc-query">
    <div className={`pv-cmd ${focused ? "focused" : ""}`}>
      <Icon name="sparkle" size={16}/>
      <span className={`pv-cmd-text ${!typed ? "ph" : ""}`}>
        {typed || "Ask Sidney to run an investigation…"}
        {focused && <span className="pv-caret"/>}
      </span>
      <span className="pv-cmd-kbd"><span>⌘</span><span>↵</span></span>
    </div>
    <div className="pv-recent">
      <div className="pv-recent-h">Recent investigations</div>
      {RECENT.map((r) => (
        <div key={r.t} className="pv-recent-row">
          <span className="pv-recent-t">{r.t}</span>
          <span className="pv-recent-k">{r.k}</span>
          <span className="pv-recent-d">{r.d}</span>
          <span className="pv-pill final sm"><span className="pv-pill-dot"/>Finalised</span>
        </div>
      ))}
    </div>
  </div>
);

/* ═══ InvestigationProgress panel ══════════════════════════════════════════ */
const NEXT_COPY = {
  plan: "Break the question into analytical branches", clarify: "Confirm scope, horizon and client posture",
  research: "Retrieve, de-duplicate and triage sources", grade: "Score each source — reliability · authority · bias · attribution",
  analyse: "Link evidence to findings; sequence and score risks", write: "Draft key judgments and sections",
};
const fmtEta = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const ProgressPanel = ({ inv, step, progress, eta }) => {
  const cur = inv.steps[Math.max(0, step)];
  return (
    <div className="pv-progress-panel">
      <div className="pv-pp-head">
        <span className="pv-spin"/>
        <span className="pv-pp-title">Investigation in progress</span>
        <span className="pv-pp-pct">{progress}%</span>
        <span className="pv-pp-stop">Stop run</span>
      </div>
      <div className="pv-stepper">
        {inv.steps.map((s, i) => (
          <div key={s.key} className={`pv-step ${i < step ? "done" : i === step ? "curr" : ""}`}>
            {i > 0 && <span className="pv-step-line"/>}
            <span className="pv-step-node">{i < step ? <Icon name="check" size={11} stroke={3.5}/> : i + 1}</span>
            <span className="pv-step-label">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="pv-bar"><span className={`pv-bar-fill ${progress > 85 ? "hot" : ""}`} style={{ width: `${progress}%` }}/></div>
      <div className="pv-next">
        <span className="pv-next-k">Next step</span>
        <span className="pv-next-t">{cur ? NEXT_COPY[cur.key] : "Starting…"}</span>
        <span className="pv-next-eta">~ {fmtEta(eta)} remaining</span>
      </div>
    </div>
  );
};

/* ═══ Reasoning graph — Graph tab (InvestigationGraph.tsx · React Flow + dagre LR) ═ */
const GK = { investigation: "hsl(195 70% 52%)", branch: "#3b82f6", finding: "#f59e0b", causal: "#8b5cf6", evidence: "#94a3b8", synthesis: "#10b981" };
const NW = 250, NH = 62, COLS = [12, 292, 600, 915], RY = 76, Y0 = 10;
const graphHeight = (g) => Y0 + Math.max(...g.nodes.map((n) => n.row)) * RY + NH + 10;
const ReasoningGraph = ({ inv, n, edges, scale = 1, showCtl = true }) => {
  const g = inv.graph;
  const pos = {}; g.nodes.forEach((nd) => { pos[nd.id] = { x: COLS[nd.col], y: Y0 + nd.row * RY }; });
  const vis = new Set(g.nodes.slice(0, n).map((x) => x.id));
  const H = graphHeight(g);
  return (
    <div className="pv-flow">
      <div className="pv-flow-canvas" style={{ transform: `scale(${scale})`, height: H }}>
        <svg className="pv-flow-edges" aria-hidden="true">
          {g.edges.map(([a, b, dashed], i) => {
            const A = pos[a], B = pos[b];
            const x1 = A.x + NW, y1 = A.y + NH / 2, x2 = B.x, y2 = B.y + NH / 2, c = (x1 + x2) / 2;
            const on = edges ? vis.has(a) && vis.has(b) : false;
            const L = segLen(cubicPts(x1, y1, c, y1, c, y2, x2, y2));
            return <path key={i} d={`M ${x1} ${y1} C ${c} ${y1}, ${c} ${y2}, ${x2} ${y2}`} className={`pv-flow-edge ${dashed ? "dashed" : ""} ${on ? "on" : ""}`} style={dashed ? undefined : { strokeDasharray: L, strokeDashoffset: on ? 0 : L }}/>;
          })}
        </svg>
        {g.nodes.map((nd, i) => (
          <div key={nd.id} className={`pv-fnode ${nd.kind} ${i < n ? "on" : ""}`} style={{ left: pos[nd.id].x, top: pos[nd.id].y, width: NW, height: NH, "--k": GK[nd.kind] }}>
            <div className="pv-fnode-head">
              <span className="pv-fnode-kind">{nd.kind}</span>
              {nd.meta && <span className="pv-fnode-meta">{nd.meta}</span>}
              {nd.kind === "evidence" && <><Grade g={nd.grade === "S" ? "S" : nd.grade === "D" ? "D" : nd.grade}/>{nd.score != null && <span className="pv-fnode-score">{nd.score}</span>}</>}
            </div>
            <span className="pv-fnode-t">{nd.title}</span>
            {nd.sub && <span className="pv-fnode-s">{nd.sub}</span>}
            {nd.domain && <span className="pv-fnode-s">{nd.domain}</span>}
            {nd.flag && <span className="pv-fnode-flag">{nd.flag}</span>}
            {nd.x && <span className="pv-fnode-x">{nd.x}</span>}
          </div>
        ))}
      </div>
      {showCtl && <div className="pv-flow-ctl"><span>+</span><span>−</span><span><Ic n="fit" size={12}/></span></div>}
      <div className="pv-flow-mini">
        {g.nodes.slice(0, n).map((nd) => <i key={nd.id} style={{ left: pos[nd.id].x / 10, top: pos[nd.id].y / 10, width: NW / 10, height: NH / 10, background: GK[nd.kind] }}/>)}
      </div>
      <span className="pv-flow-attr">React Flow</span>
    </div>
  );
};

/* ═══ Visual blocks (product P1 panels, anchored inside section boxes) ═════ */
const VisHead = ({ title, count }) => (
  <div className="pv-vis-h"><span>{title}</span>{count != null && <em>{count}</em>}</div>
);

/* — Operational picture (InvestigationGeolocationsMap.tsx: mapbox dark-v11) — */
const KIND = { incident: "#f87171", hq: "#60a5fa", border: "#f59e0b", registration: "#a78bfa", residence: "#34d399", other: "#eab308" };
const KIND_LABEL = { incident: "Incident", hq: "HQ / facility", border: "Border / maritime", other: "Context" };
const COAST = [
  [-14.1, 40.32], [-13.6, 40.55], [-13.15, 40.55], [-12.97, 40.49], [-12.9, 40.56],
  [-12.6, 40.6], [-12.44, 40.51], [-12.2, 40.62], [-11.95, 40.62], [-11.7, 40.6],
  [-11.5, 40.47], [-11.35, 40.37], [-11.15, 40.42], [-10.95, 40.45], [-10.77, 40.47],
  [-10.65, 40.62], [-10.5, 40.65], [-10.38, 40.52], [-10.3, 40.45],
];
const shortName = (e) => (e.includes("(") ? e.split("(")[0].trim() : e);
const LABEL_LEFT = new Set(["Palma", "Pemba", "Ancuabe", "Chiure", "Meluco", "Muidumbe", "Nangade"]);

const GeoBlock = ({ inv, map, pinRef, W = 840, H = 460 }) => {
  const geo = inv.blocks.geo;
  const fr = geo.frame;
  const latSpan = fr.latN - fr.latS;
  const lngSpan = (latSpan * (W / H)) / Math.cos(((fr.latN + fr.latS) / 2) * Math.PI / 180);
  const f = { latN: fr.latN, latS: fr.latS, lngW: fr.lngC - lngSpan / 2, lngE: fr.lngC + lngSpan / 2 };
  const px = (lng) => ((lng - f.lngW) / (f.lngE - f.lngW)) * W;
  const py = (lat) => ((f.latN - lat) / (f.latN - f.latS)) * H;
  const inFrame = (p) => p.coordinates[0] <= f.latN && p.coordinates[0] >= f.latS && p.coordinates[1] >= f.lngW && p.coordinates[1] <= f.lngE;
  const pts = inv.geolocations.filter(inFrame);
  const off = inv.geolocations.filter((p) => !inFrame(p));
  const path = (arr, close) => arr.map(([la, ln], i) => `${i ? "L" : "M"} ${px(ln).toFixed(1)} ${py(la).toFixed(1)}`).join(" ") + (close ? " Z" : "");
  const land = `${path(COAST)} L ${px(f.lngW)} ${py(COAST[COAST.length - 1][0])} L ${px(f.lngW)} ${py(COAST[0][0])} Z`;
  const kindStroke = { contested_route: "#f87171", monitored_route: "#fbbf24" };
  const z = map.zoom ? 1 : 0.7;
  return (
    <div className="pv-mapbox" style={{ height: H }}>
      <div className="pv-maplayer" style={{ transform: `scale(${z})` }}>
        <svg className="pv-map-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <path d={land} className="pv-land"/>
          <path d={path(COAST)} className="pv-coast"/>
          <text x={px(39.0)} y={py(-10.42) - 8} className="pv-map-country">TANZANIA</text>
          <text x={px(38.55)} y={py(-12.6)} className="pv-map-country">MOZAMBIQUE</text>
          <text x={px(41.6)} y={py(-12.3)} className="pv-map-water">Mozambique Channel</text>
          <line x1={px(f.lngW)} y1={py(-10.42)} x2={px(40.52)} y2={py(-10.38)} className="pv-border"/>
          <g className={`pv-area ${map.area ? "on" : ""}`}>
            {geo.areas.map((a, i) => (
              <React.Fragment key={i}>
                <path d={path(a.polygon, true)} className="pv-area-fill"/>
                <path d={path(a.polygon, true)} className="pv-area-line"/>
                <text x={px(40.1)} y={py(-11.9)} className="pv-area-label">{a.label}</text>
              </React.Fragment>
            ))}
          </g>
          <g className={`pv-routes ${map.routes ? "on" : ""}`}>
            {geo.routes.map((r, i) => {
              const L = segLen(r.line.map(([la, ln]) => [px(ln), py(la)]));
              const dash = { strokeDasharray: L, strokeDashoffset: map.routes ? 0 : L, transitionDelay: `${i * 250}ms` };
              return (
                <React.Fragment key={i}>
                  <path d={path(r.line)} className="pv-route-halo" style={dash}/>
                  <path d={path(r.line)} className="pv-route" style={{ ...dash, stroke: kindStroke[r.kind], strokeWidth: r.kind === "contested_route" ? 2.4 : 1.8 }}/>
                </React.Fragment>
              );
            })}
            <text x={px(40.48)} y={py(-11.12)} className="pv-route-label" style={{ fill: "#f87171" }}>N380</text>
            <text x={px(39.62)} y={py(-13.38)} className="pv-route-label" style={{ fill: "#fbbf24" }}>N14</text>
          </g>
          <g className={`pv-moves ${map.move ? "on" : ""}`}>
            {geo.movements.map((mv, i) => {
              const x1 = px(mv.from[1]), y1 = py(mv.from[0]), x2 = px(mv.to[1]), y2 = py(mv.to[0]);
              const cx = (x1 + x2) / 2 - 34, cy = (y1 + y2) / 2;
              const L = segLen(quadPts(x1, y1, cx, cy, x2, y2));
              const ang = (Math.atan2(y2 - cy, x2 - cx) * 180) / Math.PI;
              return (
                <React.Fragment key={i}>
                  <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} className="pv-move" style={{ strokeDasharray: L, strokeDashoffset: map.move ? 0 : L }}/>
                  <path d="M 0 0 L 9 4.5 L 0 9 Z" className="pv-move-head" transform={`translate(${x2} ${y2}) rotate(${ang}) translate(-8 -4.5)`}/>
                  <text x={cx - 8} y={cy + 4} className="pv-move-label" textAnchor="end">{mv.label}</text>
                </React.Fragment>
              );
            })}
          </g>
        </svg>
        {pts.map((p, i) => {
          const isPopup = p.entity === geo.popup;
          const yPct = (py(p.coordinates[0]) / H) * 100;
          const name = shortName(p.entity);
          return (
            <div key={p.entity} ref={isPopup ? pinRef : undefined}
                 className={`pv-marker ${i < map.pts ? "on" : ""} ${LABEL_LEFT.has(name) ? "lbl-left" : ""}`}
                 style={{ left: `${(px(p.coordinates[1]) / W) * 100}%`, top: `${yPct}%`, "--z": 1 / z }}>
              <span className="pv-marker-dot" style={{ background: KIND[p.type] || KIND.other }}/>
              <span className="pv-marker-label">{name}</span>
              {isPopup && (
                <div className={`pv-popup ${map.popup ? "on" : ""} ${yPct < 35 ? "below" : ""}`}>
                  <div className="pv-popup-h"><span className="d" style={{ background: KIND[p.type] }}/>{p.entity}</div>
                  <div className="pv-popup-k">{KIND_LABEL[p.type] || p.type}</div>
                  <div className="pv-popup-c">{p.context}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="pv-map-toggle">Focus operational area</div>
      <div className="pv-map-nav"><span>+</span><span>−</span><span className="c"><i/></span></div>
      <div className="pv-map-legend">
        {Object.entries(KIND_LABEL).map(([k, l]) => <span key={k}><i style={{ background: KIND[k] }}/>{l}</span>)}
        <span className="sep"/>
        <span><i className="area"/>Threat area</span>
        <span><i className="line" style={{ background: "#f87171" }}/>Contested route</span>
        <span><i className="line" style={{ background: "#fbbf24" }}/>Monitored route</span>
      </div>
      {off.map((p, i) => (
        <span key={p.entity} className={`pv-map-off ${map.pts > pts.length - 1 ? "on" : ""}`} style={{ top: 40 + i * 26 }}>
          <i style={{ background: KIND[p.type] || KIND.other }}/>{shortName(p.entity)} · off-map
        </span>
      ))}
    </div>
  );
};

/* — Timeline.tsx (vertical spine) — */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CAT = { security: "Security", political: "Political", commercial: "Commercial", humanitarian: "Humanitarian" };
const P = (s) => Date.parse(`${s}T00:00:00Z`);
const fmtDay = (iso) => { const d = new Date(P(iso)); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`; };
function buildRows(tl, todayIso) {
  const rec = [...tl.events].sort((a, b) => P(a.date) - P(b.date)).map((e) => ({ ...e, t: P(e.date), kind: "recorded" }));
  const exp = tl.forward_triggers.filter((f) => f.date).map((f) => ({ ...f, t: f.precision === "month" ? P(`${f.date}-15`) : P(f.date), kind: "expected" })).sort((a, b) => a.t - b.t);
  const und = tl.forward_triggers.filter((f) => !f.date).map((f) => ({ ...f, kind: "undated" }));
  const rows = [];
  const push = (list) => {
    let last = null;
    list.forEach((e) => {
      const d = new Date(e.t);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      if (key !== last) {
        if (last !== null) {
          const [py, pm] = last.split("-").map(Number);
          const skipped = (d.getUTCFullYear() - py) * 12 + d.getUTCMonth() - pm - 1;
          if (skipped > 0) rows.push({ type: "gap", label: skipped === 1 ? `${MONTHS[(pm + 1) % 12]} · no recorded events` : `${MONTHS[(pm + 1) % 12]} – ${MONTHS[(pm + skipped) % 12]} · no recorded events` });
        }
        rows.push({ type: "month", label: `${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}` });
        last = key;
      }
      rows.push({ type: "ev", ...e });
    });
  };
  push(rec);
  rows.push({ type: "today", label: `Today · report generated ${fmtDay(todayIso)} ${new Date(P(todayIso)).getUTCFullYear()}` });
  push(exp);
  if (und.length) { rows.push({ type: "head", label: "Open windows · inside the horizon" }); und.forEach((u) => rows.push({ type: "ev", ...u })); }
  return rows;
}
const dateLabel = (e) => (e.kind === "undated" ? "—" : e.kind === "expected" && e.precision === "month" ? `≈ ${MONTHS[Number(e.date.slice(5, 7)) - 1]}` : fmtDay(e.date));

const TimelineBlock = ({ inv, tlN }) => {
  const tl = inv.blocks.timeline;
  const rows = React.useMemo(() => buildRows(tl, inv.today), [tl, inv.today]);
  const counts = {}; rows.forEach((r) => { if (r.type === "ev") counts[r.category] = (counts[r.category] || 0) + 1; });
  const total = rows.filter((r) => r.type === "ev").length;
  const listRef = React.useRef(null);
  React.useEffect(() => { const el = listRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }, [tlN]);
  return (
    <>
      <div className="pv-tl-chips">
        <span className="pv-tl-chip on">All <b>{total}</b></span>
        {Object.entries(CAT).map(([k, l]) => <span key={k} className="pv-tl-chip"><i className={`cat-${k}`}/>{l} <b>{counts[k] || 0}</b></span>)}
      </div>
      <ol className="pv-tl" ref={listRef}>
        {rows.map((r, i) => {
          const on = i < tlN;
          if (r.type === "month") return <li key={i} className={`pv-tl-month ${on ? "on" : ""}`}>{r.label}</li>;
          if (r.type === "gap") return <li key={i} className={`pv-tl-gap ${on ? "on" : ""}`}>{r.label}</li>;
          if (r.type === "today") return <li key={i} className={`pv-tl-today ${on ? "on" : ""}`}><i/><span>{r.label}</span></li>;
          if (r.type === "head") return <li key={i} className={`pv-tl-month tail ${on ? "on" : ""}`}>{r.label}</li>;
          return (
            <li key={i} className={`pv-tl-ev ${r.kind} ${on ? "on" : ""}`}>
              <i className={`cat-${r.category}`}/>
              <span className="pv-tl-date">{dateLabel(r)}</span>
              <span className="pv-tl-label">{r.label}{r.kind === "undated" && <em> · {r.window}</em>}</span>
              <span className={`pv-tl-tag cat-${r.category}`}>{CAT[r.category]}</span>
            </li>
          );
        })}
      </ol>
    </>
  );
};

/* — ScenarioOutlook.tsx — */
const SEV = { upside: "#34d399", baseline: "#fbbf24", downside: "#fb923c", tail: "#f87171" };
const ScenariosBlock = ({ inv, on }) => (
  <div className="pv-scn-list">
    {inv.blocks.scenarios.items.slice(0, 4).map((s, i) => {
      const mid = (s.p_low + s.p_high) / 2;
      return (
        <Reveal key={s.name} on={on} delay={i * 140} className="pv-scn">
          <div className="pv-scn-top">
            <span className="pv-scn-name">{s.name}</span>
            <span className="pv-scn-sev" style={{ color: SEV[s.severity], borderColor: SEV[s.severity] }}>{s.severity === "tail" ? "tail risk" : s.severity}</span>
            <span className="pv-scn-p">{s.p_low}–{s.p_high}%</span>
          </div>
          <div className="pv-scn-track">
            <span className="pv-scn-band" style={{ left: `${s.p_low}%`, width: `${s.p_high - s.p_low}%`, background: SEV[s.severity] }}/>
            <span className="pv-scn-fill" style={{ width: on ? `${mid}%` : 0, background: SEV[s.severity], transitionDelay: `${i * 140 + 200}ms` }}/>
          </div>
          <p className="pv-scn-sum">{s.summary}</p>
          <div className="pv-scn-ind">{s.indicators.length} indicators</div>
        </Reveal>
      );
    })}
  </div>
);

/* — RiskMatrix.tsx — */
const sevBand = (p) => (p >= 20 ? "s4" : p >= 15 ? "s3" : p >= 10 ? "s2" : p >= 5 ? "s1" : "");
const RiskMatrixBlock = ({ inv, on }) => {
  const mx = inv.blocks.risk_matrix;
  const byCell = {};
  mx.risks.forEach((r) => { const k = `${r.likelihood},${r.impact}`; (byCell[k] = byCell[k] || []).push(r); });
  const offsets = { 1: [[0, 0]], 2: [[-11, 0], [11, 0]], 3: [[-13, -6], [0, 6], [13, -6]] };
  const top = [...mx.risks].sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact).slice(0, 6);
  return (
    <div className="pv-mx-wrap">
      <div className="pv-mx-grid">
        <span className="pv-mx-y">Likelihood →</span>
        <div className="pv-mx">
          {[5, 4, 3, 2, 1].map((L) => [1, 2, 3, 4, 5].map((I) => {
            const cell = byCell[`${L},${I}`] || [];
            return (
              <div key={`${L}${I}`} className={`pv-mx-cell ${sevBand(L * I)}`}>
                {cell.map((r, ri) => {
                  const [dx, dy] = (offsets[cell.length] || offsets[3])[ri] || [0, 0];
                  const idx = mx.risks.indexOf(r);
                  return <span key={r.id} className="pv-mx-marker" style={{ transform: `translate(${dx}px, ${dy}px) scale(${on ? 1 : 0})`, transitionDelay: `${300 + idx * 90}ms` }}>{r.id}</span>;
                })}
              </div>
            );
          }))}
        </div>
        <span className="pv-mx-x">Impact →</span>
      </div>
      <div className="pv-mx-list">
        {top.map((r, i) => (
          <Reveal key={r.id} on={on} delay={700 + i * 120} className="pv-mx-row">
            <span className="pv-mx-id">{r.id}</span>
            <span className="pv-mx-label">{r.label}</span>
            <span className="pv-mx-li">L{r.likelihood} × I{r.impact}</span>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

/* — PhasedRoadmap.tsx — */
const TIER_COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#a78bfa"];
const RoadmapBlock = ({ inv, on }) => {
  const plan = inv.blocks.phased_plan;
  return (
    <>
      <div className="pv-rm-axis">
        {Array.from({ length: plan.axis_months + 1 }, (_, m) => (
          <span key={m} className={`pv-rm-tick ${m % 3 === 0 ? "maj" : ""}`} style={{ left: `${(m / plan.axis_months) * 100}%` }}>{m % 3 === 0 && <b>M{m}</b>}</span>
        ))}
      </div>
      <div className="pv-rm-rows">
        {plan.tiers.map((t, i) => (
          <div key={t.name} className="pv-rm-row">
            <span className="pv-rm-bar" style={{ left: `${(t.start / plan.axis_months) * 100}%`, width: `${((t.end - t.start) / plan.axis_months) * 100}%`, background: TIER_COLORS[i], transform: on ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${i * 220}ms` }}/>
            {t.gate_to_next && <span className={`pv-rm-gate ${on ? "on" : ""}`} style={{ left: `${(t.end / plan.axis_months) * 100}%`, transitionDelay: `${i * 220 + 500}ms` }}/>}
          </div>
        ))}
      </div>
      <div className="pv-rm-tiers">
        {plan.tiers.map((t, i) => (
          <Reveal key={t.name} on={on} delay={i * 220 + 300} className="pv-rm-tier">
            <div className="pv-rm-name"><i style={{ background: TIER_COLORS[i] }}/>{t.name}</div>
            <div className="pv-rm-window">{t.window}</div>
            <ul>{t.actions.slice(0, 2).map((a, j) => <li key={j}>{a}</li>)}</ul>
            {t.gate_to_next && <div className="pv-rm-gatecrit"><span className="pv-rm-diamond"/>Gate: {t.gate_to_next[0]}</div>}
          </Reveal>
        ))}
      </div>
    </>
  );
};

/* ═══ Report tab — the document (ReportContent.tsx) ════════════════════════ */
const SectionBox = React.forwardRef(({ title, count, icon, children, className = "" }, ref) => (
  <section className={`pv-secbox ${className}`} ref={ref}>
    <div className="pv-sec-h">
      <h2>{icon && <span className="pv-sec-ic">{icon}</span>}{title}{count != null && <em>({count})</em>}</h2>
      <Icon name="chevdown" size={16} className="pv-sec-chev"/>
    </div>
    <div className="pv-sec-body">{children}</div>
  </section>
));

const KeyJudgments = ({ items }) => (
  <ul className="pv-kj">{items.map((li, i) => <li key={i}>{inline(li, `kj${i}`)}</li>)}</ul>
);

const ReportDoc = ({ inv, st, refs, pinRef, pop, docRef }) => {
  const sections = React.useMemo(() => mdSections(inv.report_md), [inv.report_md]);
  const norm = (s) => s.toLowerCase();
  const visualsFor = (title) => inv.visuals.filter((v) => norm(title).startsWith(norm(v.heading)));
  const placed = new Set();
  const renderVis = (v) => {
    placed.add(v.block);
    const count = v.block === "geo" ? `${inv.geolocations.length} locations`
      : v.block === "timeline" ? `${inv.blocks.timeline.events.length + inv.blocks.timeline.forward_triggers.length} events`
      : v.block === "risk_matrix" ? `${inv.blocks.risk_matrix.risks.length} risks`
      : v.block === "scenarios" ? inv.blocks.scenarios.horizon
      : v.block === "phased_plan" ? `${inv.blocks.phased_plan.tiers.length} tiers` : null;
    return (
      <div key={v.block} className={`pv-vis pv-vis-${v.block}`} ref={(el) => (refs.current[`vis:${v.block}`] = el)}>
        <VisHead title={v.label} count={count}/>
        {v.block === "geo" && <GeoBlock inv={inv} map={st.geo} pinRef={pinRef}/>}
        {v.block === "timeline" && <TimelineBlock inv={inv} tlN={st.tl}/>}
        {v.block === "scenarios" && <ScenariosBlock inv={inv} on={st.outlook}/>}
        {v.block === "risk_matrix" && <RiskMatrixBlock inv={inv} on={st.outlook}/>}
        {v.block === "phased_plan" && <RoadmapBlock inv={inv} on={st.pp}/>}
      </div>
    );
  };
  const popSrc = pop ? inv.sources.find((s) => String(s.i) === String(pop.n)) : null;
  return (
    <div className="pv-doc" ref={docRef}>
      <div className="pv-doc-top">
        <span className="pv-doc-meta-l">{inv.generated}</span>
        <span className="pv-timesaved"><Icon name="zap" size={12}/>{inv.timeSaved}</span>
      </div>
      <SectionBox title="Executive Summary" ref={(el) => (refs.current["sec:executive summary"] = el)}>
        <div className="pv-prose"><p>{inline(inv.report_summary, "sum")}</p></div>
      </SectionBox>
      {sections.map((sec, i) => (
        <SectionBox key={i} title={sec.title} ref={(el) => (refs.current[`sec:${norm(sec.title)}`] = el)}>
          {/key judg/i.test(sec.title)
            ? <KeyJudgments items={sec.nodes.flatMap((n) => (n.t === "ul" ? n.c : []))}/>
            : <Prose nodes={sec.nodes} keyBase={`s${i}`}/>}
          {visualsFor(sec.title).filter((v) => !placed.has(v.block)).map(renderVis)}
        </SectionBox>
      ))}
      <div className="pv-doc-end"/>
      {pop && (
        <div className="pv-citepop" style={{ left: pop.x, top: pop.y }}>
          <div className="pv-cp-head">
            <span className="pv-cite lg">{pop.n}</span>
            <span className="pv-cp-name">{popSrc ? popSrc.name : `Source ${pop.n}`}</span>
            {popSrc && <Grade g={popSrc.grade}/>}
          </div>
          {popSrc && <div className="pv-cp-title">{popSrc.title}</div>}
          {popSrc && <div className="pv-cp-meta">{popSrc.date}{popSrc.composite != null && <> · score <b>{popSrc.composite}</b>/100</>} · {popSrc.voice}</div>}
          {popSrc && <div className="pv-cp-insight">{popSrc.insight}</div>}
          <div className="pv-cp-foot">Open source <Ic n="ext" size={11}/></div>
        </div>
      )}
    </div>
  );
};

/* ScrollScrubber — the product's custom 56px-thumb rail. */
const Scrubber = ({ scrollerRef, dep }) => {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const on = () => setPct(el.scrollHeight > el.clientHeight ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 0);
    el.addEventListener("scroll", on); on();
    return () => el.removeEventListener("scroll", on);
  }, [scrollerRef, dep]);
  return <div className="pv-scrub"><span className="pv-scrub-thumb" style={{ top: `calc(${pct} * (100% - 56px))` }}/></div>;
};

/* ═══ Sources tab — graded news · social media (media analysis) · dark web ═ */
const GRADE_FILL = { "A": "#059669", "B+": "#d97706", "B": "#b45309", "C": "#ef4444", "D": "#b91c1c" };
const PLATFORM = {
  x: { label: "X", cls: "x" },
  telegram: { label: "Telegram", cls: "tg", icon: "plane" },
};
const MEDIA_ICON = { image: "image", video: "video", audio: "mic" };
const MEDIA_LABEL = { image: "Media analysis", video: "Video analysis", audio: "Audio analysis" };

const SocialCard = ({ s, expanded, expRef, anchorRef }) => {
  const pf = PLATFORM[s.platform];
  return (
    <div className={`pv-scard ${s.platform}`} ref={anchorRef}>
      <div className="pv-scard-head">
        <span className="pv-scard-i">[{s.i}]</span>
        <Ic n="ext" size={13} className="pv-scard-ext"/>
        <span className="pv-scard-handle">{s.handle}</span>
        <span className="pv-scard-date">{s.date}</span>
        {s.length && <span className="pv-scard-len"><Ic n={MEDIA_ICON[s.media]} size={11}/>{s.length}</span>}
        <span className={`pv-pf ${pf.cls}`}>{pf.icon && <Ic n={pf.icon} size={11}/>}{pf.label}</span>
      </div>
      {s.channel && <div className="pv-scard-channel"><Ic n="plane" size={11}/>{s.channel}</div>}
      <div className="pv-scard-url">{s.url}</div>
      <div className={`pv-scard-toggle ${expanded ? "open" : ""}`} ref={expRef}>
        <Ic n={s.media === "image" ? "film" : MEDIA_ICON[s.media]} size={14}/>
        <span className="pv-scard-ma">{MEDIA_LABEL[s.media]}</span>
        <span className={`pv-verdict ${s.verdictTone}`}>{s.verdict}</span>
        {s.chips && s.chips.map((c) => <span key={c} className="pv-mchip">{c}</span>)}
        <Icon name="chevdown" size={14} className="pv-scard-chev"/>
      </div>
      {expanded && (
        <div className="pv-scard-body">
          <p className="pv-scard-sum">{s.summary}</p>
          <p className="pv-scard-assess">{s.assessment}</p>
          {s.sections.map((sec) => (
            <div key={sec.h} className="pv-scard-sec">
              <div className="pv-scard-sech">{sec.h}</div>
              <ul>{sec.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DarkCard = ({ d, anchorRef }) => (
  <div className="pv-dcard" ref={anchorRef}>
    <div className="pv-scard-head">
      <span className="pv-scard-i">[{d.i}]</span>
      <Ic n="shieldoff" size={13} className="pv-scard-ext"/>
      <span className="pv-scard-handle">{d.forum}</span>
      <span className="pv-scard-date">{d.date}</span>
      <span className="pv-pf dark">Dark web</span>
    </div>
    <div className="pv-scard-url">onion address masked · {d.retrieved}</div>
    <div className="pv-dcard-thread"><span>Thread</span>{d.thread}<em>{d.replies} replies</em></div>
    <p className="pv-scard-sum">{d.excerpt}</p>
    <div className="pv-scard-sec">
      <div className="pv-scard-sech">Analysis</div>
      <ul>{d.analysis.map((a, i) => <li key={i}>{a}</li>)}</ul>
    </div>
  </div>
);

const SourcesDoc = ({ inv, st, refs, srcRefs, expRefs, docRef }) => {
  const sc = inv.blocks.source_composition;
  const graded = Object.values(sc.grade_distribution).reduce((a, b) => a + b, 0);
  const total = sc.types.reduce((a, t) => a + t.count, 0);
  return (
    <div className="pv-doc wide" ref={docRef}>
      <div className="pv-panel pv-comp">
        <div className="pv-panel-h"><Icon name="newspaper" size={14}/><span className="pv-panel-t">Source composition</span><span className="pv-panel-count">{total} cited</span></div>
        <div className="pv-comp-row">
          <div className="pv-comp-stats">
            <div className="pv-comp-stat"><span className="v">{total}</span><span className="k">sources cited</span></div>
            <div className="pv-comp-stat"><span className="v">{graded}</span><span className="k">graded</span></div>
            <div className="pv-comp-stat"><span className="v">{sc.average_score}</span><span className="k">avg score</span></div>
            <span className="pv-comp-profile">profile: {sc.profile_used}</span>
          </div>
          <div className="pv-comp-right">
            <div className={`pv-comp-bar ${st.srcBar ? "on" : ""}`}>
              {Object.entries(sc.grade_distribution).map(([g, n], i) => (
                <span key={g} className="pv-comp-seg" style={{ flexGrow: n, background: GRADE_FILL[g], transitionDelay: `${i * 90}ms` }}>{n >= 5 && <b style={{ color: g === "B+" ? "#16181d" : "#fff" }}>{g} · {n}</b>}</span>
              ))}
            </div>
            <div className="pv-comp-types">
              {sc.types.map((t) => <span key={t.type} className="pv-comp-type"><em>{t.type === "darkweb" ? "Dark web" : t.type[0].toUpperCase() + t.type.slice(1)}</em><b>{t.count}</b>{t.extends_only && <i>extends-only</i>}</span>)}
            </div>
          </div>
        </div>
      </div>

      <SectionBox title="News Sources" count={sc.types[0].count} icon={<Icon name="newspaper" size={15}/>} ref={(el) => (refs.current["src:news"] = el)}>
        <div className="pv-src-list">
          {inv.sources.map((s) => (
            <div key={s.i} ref={(el) => (srcRefs.current[s.i] = el)} className={`pv-src ${st.srcOpen === s.i ? "hover" : ""}`}>
              <span className="pv-src-i">{s.i}</span>
              <div className="pv-src-body">
                <div className="pv-src-top">
                  <span className="pv-src-name">{s.name}</span>
                  <Grade g={s.grade}/>
                  <span className="pv-src-domain">{s.domain}</span>
                  <span className="pv-src-date">{s.date}</span>
                </div>
                <div className="pv-src-title">{s.title}</div>
                <div className="pv-src-insight">{s.insight}</div>
              </div>
              {st.srcOpen === s.i && (
                <div className="pv-gradecard">
                  <div className="pv-gc-head">
                    <span className="pv-gc-name">{s.name}</span>
                    <span className="pv-gc-score"><Grade g={s.grade}/><b>{s.composite}</b><i>/100</i></span>
                  </div>
                  <div className="pv-gc-factors">
                    {Object.entries(s.factors).map(([k, val], j) => (
                      <div key={k} className="pv-gc-factor">
                        <span className="pv-gc-fk">{k}</span>
                        <span className="pv-gc-bar"><span className="pv-gc-fill" style={{ width: `${val}%`, animationDelay: `${j * 60}ms` }}/></span>
                        <span className="pv-gc-fv">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pv-gc-tags">
                    <span className="pv-gc-tag"><em>Bias</em>{s.bias}</span>
                    <span className="pv-gc-tag"><em>Voice</em>{s.voice}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="pv-src-more">+ {sc.types[0].count - inv.sources.length} more graded sources</div>
        </div>
      </SectionBox>

      <SectionBox title="Social-Media Sources" count={sc.types[1].count} icon={<Ic n="chat" size={15}/>} className="social">
        <p className="pv-src-note social">{inv.social_note}</p>
        {inv.social_sources.map((s) => (
          <SocialCard key={s.i} s={s} expanded={!!st.srcExp[s.i]}
                      anchorRef={(el) => (refs.current[`src:${s.i}`] = el)}
                      expRef={(el) => (expRefs.current[s.i] = el)}/>
        ))}
      </SectionBox>

      <SectionBox title="Dark-Web Sources" count={sc.types[2].count} icon={<Ic n="shieldoff" size={15}/>} className="dark">
        <p className="pv-src-note dark">{inv.dark_note}</p>
        {inv.dark_sources.map((d) => <DarkCard key={d.i} d={d} anchorRef={(el) => (refs.current[`src:${d.i}`] = el)}/>)}
      </SectionBox>
      <div className="pv-doc-end"/>
    </div>
  );
};

/* ═══ Engine ═══════════════════════════════════════════════════════════════ */
const INIT = {
  scene: "query", typed: "", focused: false,
  gN: 0, gEdges: true,
  tl: 0, geo: { zoom: false, pts: 0, area: false, routes: false, move: false, popup: false }, outlook: false, pp: false, pop: null,
  srcBar: false, srcOpen: null, srcExp: {},
  done: false, cursor: { x: 0, y: 0, show: false, down: false },
};
const reducer = (s, a) => (typeof a === "function" ? a(s) : { ...s, ...a });

/* Build the cue list. Times in ms from t=0. Cues are state patches or
   actions: { scrollTo }, { cursorTo }, { clickCite }, { expand }. */
function buildScript(inv) {
  const cues = [];
  const at = (t, patch) => cues.push({ t, patch });
  const starts = {};
  let t = 0;

  // — query
  starts.query = 0;
  at(0, { ...INIT });
  at(350, { focused: true });
  for (let i = 1; i <= inv.query.length; i++) at(350 + 12 * i, { typed: inv.query.slice(0, i) });
  t = 350 + 12 * inv.query.length + 550;

  // — run: the reasoning graph builds on the Graph tab
  starts.run = t;
  const N = inv.graph.nodes.length, gap = 270;
  at(t, { scene: "run", gN: 0 });
  for (let i = 1; i <= N; i++) at(t + 400 + i * gap, { gN: i });
  t = t + 400 + N * gap + 1300;

  // — report: read the document stop by stop
  starts.report = t;
  at(t, { scene: "report" });
  t += 200;
  inv.stops.forEach((stop) => {
    starts[stop.at] = t;
    at(t, { scrollTo: stop.at });
    if (stop.at === "vis:timeline") {
      const rows = buildRows(inv.blocks.timeline, inv.today).length;
      for (let i = 1; i <= rows; i++) at(t + 500 + i * 70, { tl: i });
    }
    if (stop.at === "vis:geo") {
      const pts = inv.geolocations.length;
      at(t + 350, (s) => ({ ...s, geo: { ...s.geo, zoom: true } }));
      for (let i = 1; i <= pts; i++) at(t + 500 + i * 85, (s) => ({ ...s, geo: { ...s.geo, pts: i } }));
      at(t + 2000, (s) => ({ ...s, geo: { ...s.geo, area: true } }));
      at(t + 2400, (s) => ({ ...s, geo: { ...s.geo, routes: true } }));
      at(t + 3400, (s) => ({ ...s, geo: { ...s.geo, move: true } }));
      at(t + 4300, { cursorTo: "pin" });
      at(t + 4750, (s) => ({ ...s, geo: { ...s.geo, popup: true } }));
      at(t + stop.dwell - 300, (s) => ({ ...s, cursor: { ...s.cursor, show: false } }));
    }
    if (stop.at === "vis:scenarios" || stop.at === "vis:risk_matrix") at(t + 250, { outlook: true });
    if (stop.at === "vis:phased_plan") at(t + 250, { pp: true });
    if (stop.click != null) {
      at(t + 1100, { cursorTo: `cite:${stop.click}` });
      at(t + 1650, { clickCite: stop.click });
      at(t + stop.dwell - 250, (s) => ({ ...s, pop: null, cursor: { ...s.cursor, show: false } }));
    }
    t += stop.dwell;
  });

  // — sources: read the source list
  starts.sources = t;
  at(t, { scene: "sources", srcBar: false, srcOpen: null, srcExp: {} });
  at(t + 250, { srcBar: true });
  t += 200;
  inv.sourceStops.forEach((stop) => {
    starts[stop.at] = t;
    at(t, { scrollTo: stop.at });
    if (stop.hover != null) {
      at(t + 900, { cursorTo: `src:${stop.hover}` });
      at(t + 1300, { srcOpen: stop.hover });
      at(t + stop.dwell - 250, (s) => ({ ...s, srcOpen: null, cursor: { ...s.cursor, show: false } }));
    }
    if (stop.expand) {
      at(t + 700, { cursorTo: `exp:${stop.expand}` });
      at(t + 1150, { expand: stop.expand });
      at(t + stop.dwell - 250, (s) => ({ ...s, cursor: { ...s.cursor, show: false } }));
    }
    t += stop.dwell;
  });

  // — graph: the finished reasoning graph, then Finish
  starts.graph = t;
  at(t, { scene: "graph", gN: N });
  at(t + 1900, { cursorTo: "finish" });
  at(t + 2400, { clickFinish: true });
  at(t + 2560, (s) => ({ ...s, cursor: { ...s.cursor, down: false } }));
  at(t + 4200, (s) => ({ ...s, cursor: { ...s.cursor, show: false } }));
  t += 4600;

  return { cues, starts, total: t };
}

export const ShowcaseA = () => {
  const params = React.useMemo(() => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""), []);
  const inv = INVESTIGATIONS[0];
  const [s, dispatch] = React.useReducer(reducer, INIT);
  const [scale, setScale] = React.useState(1);
  const [meshOn, setMeshOn] = React.useState(true);
  const timers = React.useRef([]);
  const scaleRef = React.useRef(1);
  const scrollerRef = React.useRef(null);
  const docRef = React.useRef(null);
  const anchors = React.useRef({});
  const srcRefs = React.useRef({});
  const expRefs = React.useRef({});
  const pinRef = React.useRef(null);
  const finishRef = React.useRef(null);
  const stopRef = React.useRef("top");
  const behavior = params.get("instant") ? "auto" : "smooth";

  React.useEffect(() => {
    const fit = () => { const sc = Math.min(window.innerWidth / 1600, window.innerHeight / 900); scaleRef.current = sc; setScale(sc); };
    fit(); window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  React.useEffect(() => {
    const onVis = () => setMeshOn(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  // Anchor refs are (re)attached on mount and nulled on unmount by React; only the scroll position needs resetting per tab.
  React.useEffect(() => { if (scrollerRef.current) scrollerRef.current.scrollTo({ top: 0, behavior: "auto" }); }, [s.scene]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const anchorEl = (key) => {
    if (key === "top") return null;
    if (key.startsWith("sec:")) {
      const want = key.slice(4).toLowerCase();
      const hit = Object.keys(anchors.current).find((k) => k.startsWith("sec:") && k.slice(4).startsWith(want));
      return hit ? anchors.current[hit] : null;
    }
    return anchors.current[key] || null;
  };
  const scrollTo = (key) => {
    const sc = scrollerRef.current;
    if (!sc) return;
    stopRef.current = key;
    if (key === "top") { sc.scrollTo({ top: 0, behavior }); return; }
    const el = anchorEl(key);
    if (!el) return;
    const top = (el.getBoundingClientRect().top - sc.getBoundingClientRect().top) / scaleRef.current + sc.scrollTop - 14;
    sc.scrollTo({ top: Math.max(0, top), behavior });
  };
  const citeEl = (n) => {
    const sc = scrollerRef.current;
    if (!sc) return null;
    const scope = anchorEl(stopRef.current) || sc;
    return scope.querySelector(`[data-cite="${n}"]`) || sc.querySelector(`[data-cite="${n}"]`);
  };
  /* The presentation cursor lives outside the scaled stage → viewport coords. */
  const cursorTo = (key) => {
    let node = null, mode = "center", dx = 0, dy = 0;
    if (key === "pin") { node = pinRef.current && pinRef.current.querySelector(".pv-marker-dot"); dx = 4; dy = 6; }
    else if (key === "finish") { node = finishRef.current; }
    else if (key.startsWith("src:")) { node = srcRefs.current[key.slice(4)]; mode = "row"; }
    else if (key.startsWith("exp:")) { node = expRefs.current[key.slice(4)]; mode = "row"; dx = 40; }
    else if (key.startsWith("cite:")) { node = citeEl(key.slice(5)); }
    if (!node) return;
    const r = node.getBoundingClientRect();
    const x = mode === "row" ? r.left + 60 + dx : r.left + r.width / 2 + dx;
    const y = mode === "row" ? r.top + r.height / 2 + 4 : r.top + r.height / 2 + dy;
    dispatch((st) => ({ ...st, cursor: { x, y, show: true, down: false } }));
  };
  const press = () => {
    dispatch((st) => ({ ...st, cursor: { ...st.cursor, down: true } }));
    timers.current.push(setTimeout(() => dispatch((st) => ({ ...st, cursor: { ...st.cursor, down: false } })), 160));
  };
  const clickCite = (n) => {
    const el = citeEl(n), doc = docRef.current;
    if (!el || !doc) return;
    const r = el.getBoundingClientRect(), d = doc.getBoundingClientRect();
    const x = Math.min((r.left - d.left) / scaleRef.current - 20, doc.clientWidth - 372);
    const y = (r.bottom - d.top) / scaleRef.current + 10;
    dispatch((st) => ({ ...st, pop: { n, x: Math.max(0, x), y } }));
    press();
  };
  const apply = (patch) => {
    if (patch && typeof patch === "object") {
      if (patch.scrollTo) { scrollTo(patch.scrollTo); return; }
      if (patch.cursorTo) { cursorTo(patch.cursorTo); return; }
      if (patch.clickCite != null) { clickCite(patch.clickCite); return; }
      if (patch.expand) { dispatch((st) => ({ ...st, srcExp: { ...st.srcExp, [patch.expand]: true } })); press(); return; }
      if (patch.clickFinish) { dispatch({ done: true }); press(); return; }
    }
    dispatch(patch);
  };
  const isAction = (p) => p && typeof p === "object" && (p.scrollTo || p.cursorTo || p.clickCite != null || p.expand || p.clickFinish);

  const run = React.useCallback((skipTo) => {
    clear();
    const { cues, starts, total } = buildScript(inv);
    const offset = skipTo && starts[skipTo] != null ? starts[skipTo] : 0;
    cues.forEach(({ t, patch }) => {
      if (t < offset) { if (!isAction(patch)) dispatch(patch); else if (patch.expand) dispatch((st) => ({ ...st, srcExp: { ...st.srcExp, [patch.expand]: true } })); }
      else timers.current.push(setTimeout(() => apply(patch), t - offset));
    });
    if (offset > 0 && (skipTo.startsWith("sec:") || skipTo.startsWith("vis:") || skipTo.startsWith("src:") || skipTo === "top")) timers.current.push(setTimeout(() => scrollTo(skipTo), 60));
    timers.current.push(setTimeout(() => run(), total - offset));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => run(params.get("scene")), 400);
    return () => { clearTimeout(id); clear(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Derived run state from graph progress. */
  const N = inv.graph.nodes.length;
  const running = s.scene === "run";
  const revealed = inv.graph.nodes.slice(0, s.gN);
  const step = running ? (revealed.length ? Math.max(...revealed.map((n) => n.step)) : 0) : inv.steps.length;
  const progress = running ? Math.min(99, Math.round((s.gN / N) * 100)) : 100;
  const eta = Math.max(0, (N - s.gN) * 270 + 1300);

  const tab = s.scene === "run" || s.scene === "graph" ? "Graph" : s.scene === "sources" ? "Sources" : "Report";
  const status = s.scene === "query" ? null : running ? "running" : s.done ? "done" : "review";
  const isQuery = s.scene === "query";

  return (
    <div className="pv-viewport">
      <div className="pv-mesh-wrap" aria-hidden="true">
        <MeshGradient className="pv-mesh" colors={["#05070d", "#0a1420", "#1ebee6", "#05070d"]} speed={meshOn ? 0.32 : 0} backgroundColor="#05070d" minPixelRatio={1} maxPixelCount={500_000}/>
      </div>
      <div className="pv-vignette" aria-hidden="true"/>

      <div className="pv-scaler" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="pv-window">
          <div className="pv-chrome">
            <div className="pv-lights"><span/><span/><span/></div>
            <div className="pv-urlbar"><Icon name="lock" size={11}/> app.sidney.satorusgroup.com<span className="pv-url-path">/investigations{isQuery ? "/new" : `/${inv.id}`}</span></div>
          </div>

          <div className="pv-page">
            <header className="pv-head">
              <div className="pv-back"><Icon name="arrow" size={14} className="pv-back-arrow"/> Investigations</div>
              <div className="pv-head-row">
                <h1 className="pv-title">
                  {!isQuery && <Ic n="pencil" size={16} className="pv-title-pen"/>}
                  {isQuery ? "New investigation" : inv.query}
                </h1>
                {!isQuery && (
                  <div className="pv-actions">
                    <span className="pv-btn"><Ic n="refresh" size={14}/>Run again</span>
                    <span className="pv-btn"><Ic n="repeat" size={14}/>Recurring</span>
                    <span className={`pv-btn ${s.done ? "done" : ""}`} ref={finishRef}><Ic n="checkcircle" size={14}/>{s.done ? "Finished" : "Finish"}</span>
                    <span className="pv-btn icon"><Ic n="dots" size={14}/></span>
                  </div>
                )}
              </div>
              <div className="pv-meta-row">
                {status && (
                  <span className={`pv-pill ${status}`}>
                    {status === "running" && <span className="pv-pill-dot"/>}
                    {status === "running" ? "Running" : status === "done" ? "Finalised" : "Review"}
                  </span>
                )}
                {!isQuery && <span className="pv-meta-x">{inv.versionDate}</span>}
                {!isQuery && <span className="pv-meta-sep">·</span>}
                {!isQuery && <span className="pv-meta-x">1 version</span>}
                {isQuery && <span className="pv-meta-x">Draft · not yet run</span>}
              </div>
            </header>

            <div className="pv-body">
              <aside className="pv-rail">
                <div className="pv-rail-h"><span>Versions</span><b>{isQuery ? 0 : 1}</b></div>
                {!isQuery && (
                  <div className="pv-version">
                    <span className="pv-vchip">v1</span>
                    <div className="pv-vbody">
                      <div className="pv-vname">Version 1 <span className="pv-latest">Latest</span></div>
                      <div className="pv-vdate">{inv.versionDate}</div>
                    </div>
                  </div>
                )}
                <div className="pv-rail-thread"><span><Ic n="chat" size={15}/>Thread</span><em>All activity</em></div>
              </aside>

              <section className="pv-content">
                {!isQuery && (
                  <div className="pv-tabs">
                    {["Report", "Sources", "Graph"].map((tb) => <span key={tb} className={`pv-tab ${tab === tb ? "active" : ""}`}>{tb}</span>)}
                    <span className="pv-tab-right"><Ic n="note" size={14}/>Annotations</span>
                  </div>
                )}

                {s.scene === "query" && <div className="pv-stage"><QueryScene typed={s.typed} focused={s.focused}/></div>}

                {s.scene === "run" && (
                  <div className="pv-stage run">
                    <ProgressPanel inv={inv} step={step} progress={progress} eta={eta}/>
                    <div className="pv-graph-wrap"><ReasoningGraph inv={inv} n={s.gN} edges scale={0.74} showCtl={false}/></div>
                  </div>
                )}

                {s.scene === "graph" && (
                  <div className="pv-stage">
                    <div className="pv-graph-wrap full"><ReasoningGraph inv={inv} n={N} edges scale={0.92}/></div>
                  </div>
                )}

                {s.scene === "report" && (
                  <div className="pv-scroll" ref={scrollerRef}>
                    <ReportDoc inv={inv} st={s} refs={anchors} pinRef={pinRef} pop={s.pop} docRef={docRef}/>
                    <Scrubber scrollerRef={scrollerRef} dep="report"/>
                  </div>
                )}

                {s.scene === "sources" && (
                  <div className="pv-scroll" ref={scrollerRef}>
                    <SourcesDoc inv={inv} st={s} refs={anchors} srcRefs={srcRefs} expRefs={expRefs} docRef={docRef}/>
                    <Scrubber scrollerRef={scrollerRef} dep="sources"/>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>

      <div className={`pv-cursor ${s.cursor.show ? "show" : ""} ${s.cursor.down ? "down" : ""}`} style={{ left: s.cursor.x, top: s.cursor.y }} aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 3l14 7-6 1.5-2.2 6z" fill="#fff" stroke="#0a0f1a" strokeWidth="1.3" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
};
