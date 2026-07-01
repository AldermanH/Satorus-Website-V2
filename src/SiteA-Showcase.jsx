/* Launch-event showcase — hidden route /showcase
   ─────────────────────────────────────────────────────────────────────────
   A fullscreen "presentation mode" attract loop for a TV at the launch event.
   Rather than the marketing-site look, this mirrors the REAL Sidney product UI
   (deep-navy enterprise theme, electric-cyan accent, Inter, 8px radius, the
   report-glow reading surface, inline circular citations, confidence pills,
   A-D source-grade badges) — reference: the sidney-staging repo (git-ignored,
   never shipped).

   Presentation framing: the same animated blue MeshGradient used on the site
   hero fills the viewport; a windowed, floating app frame sits on top of it
   (not edge-to-edge) so it reads like a product demo playing on a wall.

   The window is authored on a fixed 1600×900 canvas, CSS-scaled to fit any
   screen; internal scrolling uses the panel's own coordinate space so the
   scale transform never throws off scrollTo().

   Content is DUMMY data for now (one sample investigation) shaped like a real
   Sidney report — swap in real reports later, and add more objects to REPORTS
   to cycle several. Choreography:
     home → typing → running (agent stages) → report (auto-scroll sections) → loop */
import React from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { Icon, SatorusMark } from "./Components.jsx";

/* Inline numbered citation — the product's signature circular cyan badge. */
const Cite = ({ n }) => <sup className="pv-cite">{n}</sup>;

/* 4-dot confidence meter pill (mirrors ConfidencePill). */
const CONF = {
  "High":        { filled: 4, half: false, cls: "high",   label: "High Confidence" },
  "Medium-High": { filled: 3, half: true,  cls: "medhigh", label: "Medium-High Confidence" },
  "Medium":      { filled: 3, half: false, cls: "med",    label: "Medium Confidence" },
  "Medium-Low":  { filled: 2, half: false, cls: "medlow", label: "Medium-Low Confidence" },
  "Low":         { filled: 1, half: false, cls: "low",    label: "Low Confidence" },
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

/* A-D source-grade badge (mirrors SourceGradeBadge colour tiers). */
const gradeTier = (g) => (/^A/.test(g) ? "a" : /^B/.test(g) ? "b" : "cd");
const Grade = ({ g }) => <span className={`pv-grade ${gradeTier(g)}`}>{g}</span>;

/* Agent stage labels — verbatim from the product's InvestigationProgress. */
const STAGES = [
  "Classifying investigation type",
  "Researching sources",
  "Querying news intelligence",
  "Grading source quality",
  "Analysing findings",
  "Writing report",
];

/* ═══════════════════════════════════════════════════════════════════════════
   REPORTS — dummy data shaped like a real Sidney report
   (metadata + summary + key judgments + analysis sections + entities +
    geolocations + graded sources). Add more objects to cycle several.
   ═══════════════════════════════════════════════════════════════════════════ */
const REPORTS = [
  {
    id: "bab-el-mandeb",
    type: "GEOPOLITICAL ANALYSIS",
    title: "Bab-el-Mandeb Disruption: Operational Impact Assessment for a Rotterdam-Based Commodities Importer",
    query: "We import metals and energy feedstock through the Red Sea. Assess the operational impact of the current Bab-el-Mandeb disruption and give us a two-quarter outlook.",
    written: "Assessed 25 May 2026 · 14:12 CET",
    timeSaved: "≈ 14 hrs saved",
    stats: { references: 96, geolocations: 14, entities: 6, risks: 12 },
    summary: (
      <>A Rotterdam-based importer dependent on cargoes transiting the Bab-el-Mandeb strait faces a <mark>sustained, multi-quarter re-routing regime</mark> rather than a near-term return to Red Sea transit<Cite n={1}/>. Since the JWC's expansion of Listed Areas, carriers have defaulted to the Cape of Good Hope, adding 9–14 days and materially higher war-risk premia to every affected sailing<Cite n={2}/><Cite n={3}/>. The binding constraint on the client is not freight cost but <mark>schedule reliability</mark>: buffer stock and contract cover, not spot procurement, are the levers that matter over the next two quarters<Cite n={4}/>.</>
    ),
    judgments: [
      { text: <>Plan for disruption to persist through at least Q3 2026. No credible de-escalation mechanism is currently visible across the monitored sources<Cite n={1}/><Cite n={5}/>.</>, level: "High" },
      { text: <>Cape re-routing is now the market default, not the exception — spot capacity on the direct corridor has effectively withdrawn<Cite n={2}/>.</>, level: "High" },
      { text: <>War-risk insurance premia have repriced an order of magnitude higher and remain volatile week-to-week<Cite n={3}/><Cite n={6}/>.</>, level: "Medium-High" },
      { text: <>A limited, escorted convoy corridor may reopen selectively, but coverage would be partial and conditional<Cite n={7}/>.</>, level: "Medium" },
    ],
    sections: [
      {
        id: "situation",
        h: "Situation Overview",
        blocks: [
          { t: "p", c: <>The Bab-el-Mandeb strait — the 20-mile chokepoint between the Red Sea and the Gulf of Aden — has been under active threat-to-shipping conditions since early 2026<Cite n={1}/>. Following the JWC's circular expanding Listed Areas across the southern Red Sea, the major container and dry-bulk lines suspended direct transit and re-routed around the Cape of Good Hope<Cite n={2}/>.</> },
          { t: "conf", level: "High" },
          { t: "p", c: <>For a Rotterdam importer, the first-order effect is transit time: a Gulf-origin cargo that previously arrived via Suez in ~24 days now arrives in <mark>34–38 days</mark> via the Cape<Cite n={4}/>. The second-order effect is variance — sailing schedules have widened, and berth congestion at trans-shipment hubs has compounded delays<Cite n={8}/>.</> },
          { t: "quote", c: "Owners are treating the southern Red Sea as a no-go area for the foreseeable; the Cape routing is being priced into contracts now, not hedged as a temporary detour.", cite: "Lloyd's List market commentary · 21 May 2026" },
        ],
      },
      {
        id: "impact",
        h: "Impact on Client Operations",
        blocks: [
          { t: "p", c: <>Modelling the client's declared lanes against current routing, the material exposures are:</> },
          { t: "ul", c: [
            <>Landed lead-time on Gulf-origin feedstock extends by <mark>9–14 days</mark> per sailing, pushing safety-stock cover below the client's 30-day policy on two SKUs<Cite n={4}/>.</>,
            <>War-risk and additional-premium surcharges add a per-container cost that, while significant, is second-order to the schedule impact<Cite n={3}/>.</>,
            <>Contractual delivery windows on downstream sales are at risk where they were written against Suez transit assumptions<Cite n={9}/>.</>,
          ] },
          { t: "conf", level: "Medium-High" },
        ],
      },
      {
        id: "outlook",
        h: "Outlook & Recommendations",
        blocks: [
          { t: "p", c: <>Over the next two quarters the base case is <mark>continuity of the current regime</mark>: Cape routing as default, elevated premia, and episodic single-vessel incidents that periodically re-spike rates<Cite n={5}/><Cite n={6}/>. Recommended posture:</> },
          { t: "ol", c: [
            <><strong>Rebuild buffer.</strong> Lift safety stock on the two exposed SKUs to absorb the extended lead-time; treat 45 days as the working assumption, not 30<Cite n={4}/>.</>,
            <><strong>Fix cover contractually.</strong> Convert exposed spot lanes to contracted capacity with re-routing terms explicit, so schedule risk sits with the carrier<Cite n={2}/>.</>,
            <><strong>Re-paper downstream windows.</strong> Renegotiate delivery windows written on Suez assumptions before they are breached<Cite n={9}/>.</>,
            <><strong>Watch for a convoy corridor.</strong> Monitor for a selectively escorted route; if it opens, coverage will be partial — do not unwind buffer on the first announcement<Cite n={7}/>.</>,
          ] },
        ],
      },
    ],
    entities: {
      primary: [
        { name: "Bab-el-Mandeb Strait", role: "Primary maritime chokepoint; direct transit suspended by major lines" },
        { name: "Ansar Allah (Houthi)", role: "Non-state actor conducting threat-to-shipping activity in the corridor" },
        { name: "Lloyd's Joint War Committee", role: "Issued the circular expanding Listed Areas across the southern Red Sea" },
        { name: "Combined Maritime Forces", role: "Multinational naval presence; partial, conditional escort capacity" },
      ],
      secondary: ["Suez Canal Authority", "Cape of Good Hope route", "Gulf of Aden", "Djibouti trans-shipment", "P&I war-risk underwriters", "EU NAVFOR"],
    },
    geo: [
      { label: "Bab-el-Mandeb", x: 62, y: 58, kind: "incident" },
      { label: "Gulf of Aden", x: 70, y: 62, kind: "incident" },
      { label: "Suez Canal", x: 57, y: 40, kind: "route" },
      { label: "Cape of Good Hope", x: 50, y: 90, kind: "route" },
      { label: "Rotterdam", x: 46, y: 20, kind: "hq" },
      { label: "Djibouti", x: 64, y: 60, kind: "node" },
    ],
    grades: { "A": 7, "B+": 25, "B": 47, "C": 17 },
    sources: [
      { i: 1,  name: "Lloyd's List",         title: "Southern Red Sea remains a no-go as owners default to the Cape", date: "21 May 2026", grade: "A",  insight: "Frames the Cape routing as a priced-in structural shift, not a temporary detour." },
      { i: 2,  name: "TradeWinds",           title: "Box lines extend Cape diversions through Q3, cite schedule integrity", date: "19 May 2026", grade: "B+", insight: "Carrier-side confirmation that direct-corridor spot capacity has withdrawn." },
      { i: 3,  name: "Insurance Marine News", title: "War-risk additional premium repricing across Red Sea Listed Areas", date: "18 May 2026", grade: "B+", insight: "Quantifies the order-of-magnitude premium move and its week-to-week volatility." },
      { i: 4,  name: "Drewry",               title: "Transit-time and reliability impact of Cape re-routing", date: "16 May 2026", grade: "A",  insight: "Source for the 9–14 day lead-time extension used in the client model." },
      { i: 5,  name: "Chatham House",        title: "No near-term de-escalation pathway in the Red Sea corridor", date: "12 May 2026", grade: "B",  insight: "Supports the high-confidence judgment on multi-quarter persistence." },
      { i: 6,  name: "Reuters",              title: "Marine insurers hold elevated Red Sea rates amid fresh incidents", date: "20 May 2026", grade: "B+", insight: "Corroborates continued premium elevation and episodic re-spikes." },
      { i: 7,  name: "Jane's",               title: "Escort and convoy options in the Gulf of Aden: coverage limits", date: "09 May 2026", grade: "B",  insight: "Basis for the medium-confidence view on a partial convoy corridor." },
      { i: 8,  name: "Alphaliner",           title: "Trans-shipment congestion compounding Cape diversion delays", date: "17 May 2026", grade: "C",  insight: "Secondary effect: berth congestion widening schedule variance." },
    ],
  },
];

export const ShowcaseA = () => {
  const [rptIdx] = React.useState(0);
  const [phase, setPhase] = React.useState("idle"); // idle | typing | running | report
  const [typed, setTyped] = React.useState("");
  const [stageIdx, setStageIdx] = React.useState(0);
  const [progress, setProgress] = React.useState(0);      // 0..100 during running
  const [activeSection, setActiveSection] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const [meshOn, setMeshOn] = React.useState(true);

  const timers = React.useRef([]);
  const mainRef = React.useRef(null);
  const secRefs = React.useRef({});

  const rpt = REPORTS[rptIdx];
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (d, fn) => { timers.current.push(setTimeout(fn, d)); };

  // Fit the 1600×900 window to the viewport, inset so the mesh shows around it.
  React.useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1600, window.innerHeight / 900));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Pause the WebGL mesh if the tab is hidden (saves the GPU on an all-day loop).
  React.useEffect(() => {
    const onVis = () => setMeshOn(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const scrollToSection = (id) => {
    const main = mainRef.current;
    const node = secRefs.current[id];
    if (main && node) main.scrollTo({ top: node.offsetTop - 24, behavior: "smooth" });
  };

  const run = () => {
    clearTimers();
    setPhase("idle");
    setTyped("");
    setStageIdx(0);
    setProgress(0);
    setActiveSection(null);
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "auto" });

    // 1 — type the query into the command bar
    at(900, () => setPhase("typing"));
    const q = rpt.query;
    for (let i = 0; i <= q.length; i++) at(900 + 26 * i, () => setTyped(q.slice(0, i)));
    const typingDone = 900 + 26 * q.length + 700;

    // 2 — investigation running: step the agent stages + climb the progress bar
    at(typingDone, () => { setPhase("running"); setStageIdx(0); setProgress(4); });
    const stageMs = 1150;
    STAGES.forEach((_, i) => {
      at(typingDone + i * stageMs, () => setStageIdx(i));
      at(typingDone + i * stageMs, () => setProgress(Math.round(((i + 0.5) / STAGES.length) * 100)));
    });
    const runningDone = typingDone + STAGES.length * stageMs + 500;
    at(runningDone - 400, () => setProgress(100));

    // 3 — report renders; auto-scroll each section in turn
    at(runningDone, () => setPhase("report"));
    const anchors = ["top", "summary", "judgments", ...rpt.sections.map((s) => s.id), "entities", "geo", "sources"];
    const dwell = 4600;
    const readStart = runningDone + 900;
    anchors.forEach((id, i) => {
      at(readStart + i * dwell, () => {
        setActiveSection(id);
        if (id !== "top") scrollToSection(id);
        else if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // 4 — loop
    const loopAt = readStart + anchors.length * dwell + 1600;
    at(loopAt, run);
  };

  React.useEffect(() => {
    const start = setTimeout(run, 500);
    return () => { clearTimeout(start); clearTimers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showReport = phase === "report";
  const statusFinal = showReport;

  return (
    <div className="pv-viewport">
      {/* Blue-glow backdrop — same MeshGradient as the site hero */}
      <div className="pv-mesh-wrap" aria-hidden="true">
        <MeshGradient
          className="pv-mesh"
          colors={["#05070d", "#0a1420", "#1ebee6", "#05070d"]}
          speed={meshOn ? 0.32 : 0}
          backgroundColor="#05070d"
          minPixelRatio={1}
          maxPixelCount={500_000}
        />
      </div>
      <div className="pv-vignette" aria-hidden="true"/>

      {/* Centred, scaled window */}
      <div className="pv-scaler" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="pv-window">

          {/* Window chrome */}
          <div className="pv-chrome">
            <div className="pv-lights"><span/><span/><span/></div>
            <div className="pv-urlbar"><Icon name="lock" size={11}/> app.sidney.satorusgroup.com<span className="pv-url-path">/investigations</span></div>
            <div className="pv-chrome-right"><span className="pv-live"><span className="pv-live-dot"/>LIVE</span></div>
          </div>

          {/* App: sidebar + main */}
          <div className="pv-app">
            <aside className="pv-side">
              <div className="pv-side-head">
                <SatorusMark size={22} color="var(--s-primary)"/>
                <span className="pv-side-word">SIDNEY</span>
              </div>
              <nav className="pv-nav">
                {[
                  { i: "sparkle", l: "Home" },
                  { i: "search",  l: "Investigations", active: true },
                  { i: "file",    l: "Projects" },
                  { i: "globe",   l: "Research" },
                  { i: "network", l: "Social" },
                ].map((it) => (
                  <div key={it.l} className={`pv-nav-item ${it.active ? "active" : ""}`}>
                    {it.active && <span className="pv-nav-bar"/>}
                    <Icon name={it.i} size={16}/><span>{it.l}</span>
                  </div>
                ))}
              </nav>
              <div className="pv-side-foot">
                <span className="pv-avatar">HM</span>
                <div className="pv-side-user"><span className="n">Harry Alderman</span><span className="o">Satorus</span></div>
              </div>
            </aside>

            <main className="pv-main" ref={mainRef}>
              <div className="pv-doc">

                {/* Back + title + meta */}
                <div className="pv-back"><Icon name="arrow" size={13} className="pv-back-arrow"/> Investigations</div>
                <div className="pv-doc-head">
                  <h1 className="pv-doc-title">{rpt.title}</h1>
                </div>
                <div className="pv-doc-meta">
                  <span className={`pv-status ${statusFinal ? "final" : "inv"}`}>
                    <span className="pv-status-dot"/>{statusFinal ? "Finalised" : "Investigating"}
                  </span>
                  <span className="pv-meta-x">{rpt.type}</span>
                  <span className="pv-meta-x">{rpt.written}</span>
                  <span className="pv-meta-x">{rpt.stats.references} sources</span>
                </div>

                {/* Tabs */}
                <div className="pv-tabs">
                  <span className="pv-tab active">Report</span>
                  <span className="pv-tab">Sources</span>
                  <span className="pv-tab">Dossier</span>
                  <span className="pv-tab">Thread</span>
                </div>

                {/* Command bar (visible pre-report) */}
                {!showReport && (
                  <div className="pv-run">
                    <div className={`pv-cmd ${phase !== "idle" ? "focused" : ""}`}>
                      <Icon name="sparkle" size={16}/>
                      <span className={`pv-cmd-text ${!typed ? "ph" : ""}`}>
                        {typed || "Ask Sidney to run an investigation…"}
                        {phase === "typing" && <span className="pv-caret"/>}
                      </span>
                      <span className="pv-cmd-kbd"><span>⌘</span><span>↵</span></span>
                    </div>

                    {phase === "running" && (
                      <div className="pv-progress">
                        <div className="pv-progress-top">
                          <span className="pv-progress-label"><span className="pv-spin"/>{STAGES[stageIdx]}…</span>
                          <span className="pv-progress-pct">{progress}%</span>
                        </div>
                        <div className="pv-progress-track"><span className="pv-progress-fill" style={{ width: `${progress}%` }}/></div>
                        <div className="pv-stagelist">
                          {STAGES.map((s, i) => (
                            <div key={s} className={`pv-stage ${i < stageIdx ? "done" : i === stageIdx ? "curr" : ""}`}>
                              <span className="pv-stage-dot"/>{s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Report */}
                {showReport && (
                  <div className="pv-report">
                    <span className="pv-timesaved"><Icon name="zap" size={12}/>{rpt.timeSaved}</span>

                    {/* Executive summary / BLUF */}
                    <section ref={(el) => (secRefs.current.summary = el)} className={`pv-sec ${activeSection === "summary" ? "focus" : ""}`}>
                      <div className="pv-sec-label">Executive summary</div>
                      <p className="pv-lead">{rpt.summary}</p>
                    </section>

                    {/* Key judgments */}
                    <section ref={(el) => (secRefs.current.judgments = el)} className={`pv-sec pv-box ${activeSection === "judgments" ? "focus" : ""}`}>
                      <div className="pv-box-h"><Icon name="crosshair" size={14}/> Key judgments</div>
                      <ul className="pv-judgments">
                        {rpt.judgments.map((j, i) => (
                          <li key={i}>
                            <span className="pv-j-num">{String(i + 1).padStart(2, "0")}</span>
                            <div className="pv-j-body"><p>{j.text}</p><Confidence level={j.level}/></div>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Detailed analysis sections */}
                    {rpt.sections.map((sec) => (
                      <section key={sec.id} ref={(el) => (secRefs.current[sec.id] = el)} className={`pv-sec pv-box ${activeSection === sec.id ? "focus" : ""}`}>
                        <div className="pv-box-h">{sec.h}</div>
                        <div className="pv-prose">
                          {sec.blocks.map((b, i) => {
                            if (b.t === "p") return <p key={i}>{b.c}</p>;
                            if (b.t === "conf") return <div key={i} className="pv-inline-conf"><Confidence level={b.level}/></div>;
                            if (b.t === "quote") return <blockquote key={i}>{b.c}<cite>{b.cite}</cite></blockquote>;
                            if (b.t === "ul") return <ul key={i}>{b.c.map((li, j) => <li key={j}>{li}</li>)}</ul>;
                            if (b.t === "ol") return <ol key={i}>{b.c.map((li, j) => <li key={j}>{li}</li>)}</ol>;
                            return null;
                          })}
                        </div>
                      </section>
                    ))}

                    {/* Entities */}
                    <section ref={(el) => (secRefs.current.entities = el)} className={`pv-sec pv-box ${activeSection === "entities" ? "focus" : ""}`}>
                      <div className="pv-box-h"><Icon name="network" size={14}/> Entities</div>
                      <div className="pv-ent-label">Primary</div>
                      <div className="pv-ent-list">
                        {rpt.entities.primary.map((e) => (
                          <div key={e.name} className="pv-ent">
                            <span className="pv-ent-name">{e.name}</span>
                            <span className="pv-ent-role">{e.role}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pv-ent-label">Secondary</div>
                      <div className="pv-ent-chips">
                        {rpt.entities.secondary.map((s) => <span key={s} className="pv-chip">{s}</span>)}
                      </div>
                    </section>

                    {/* Geolocations map */}
                    <section ref={(el) => (secRefs.current.geo = el)} className={`pv-sec pv-box ${activeSection === "geo" ? "focus" : ""}`}>
                      <div className="pv-box-h"><Icon name="globe" size={14}/> Geolocations <span className="pv-box-count">{rpt.stats.geolocations}</span></div>
                      <div className="pv-map">
                        <div className="pv-map-grid" aria-hidden="true"/>
                        {rpt.geo.map((g, i) => (
                          <div key={i} className={`pv-pin ${g.kind}`} style={{ left: `${g.x}%`, top: `${g.y}%` }}>
                            <span className="pv-pin-ring"/><span className="pv-pin-dot"/>
                            <span className="pv-pin-label">{g.label}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Graded sources */}
                    <section ref={(el) => (secRefs.current.sources = el)} className={`pv-sec pv-box ${activeSection === "sources" ? "focus" : ""}`}>
                      <div className="pv-box-h"><Icon name="newspaper" size={14}/> Graded sources <span className="pv-box-count">{rpt.stats.references}</span></div>
                      <div className="pv-grade-dist">
                        {Object.entries(rpt.grades).map(([g, n]) => (
                          <span key={g} className="pv-grade-dist-item"><Grade g={g}/><span className="pv-grade-n">{n}</span></span>
                        ))}
                        <span className="pv-grade-avg">avg 67 · profile: geopolitical_crisis</span>
                      </div>
                      <div className="pv-src-list">
                        {rpt.sources.map((s) => (
                          <div key={s.i} className="pv-src">
                            <span className="pv-src-i">{String(s.i).padStart(2, "0")}</span>
                            <div className="pv-src-body">
                              <div className="pv-src-top">
                                <span className="pv-src-name">{s.name}</span>
                                <Grade g={s.grade}/>
                                <span className="pv-src-date">{s.date}</span>
                              </div>
                              <div className="pv-src-title">{s.title}</div>
                              <div className="pv-src-insight">{s.insight}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="pv-run-out" aria-hidden="true"/>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
