/* Direction A — Live Demo
   Dark-web workflow showcasing Sidney's analytical layer (not just aggregation).
   Loop: typing → loading → result → scroll → highlight (each analytical card in
   turn, the matching evidence row pulses too) → restart.

   The three highlight slots map to:
     0 → AndreasRybak threat-actor analysis card
     1 → uncle_mo threat-actor analysis card
     2 → synthesis & recommendations card */
import React from "react";
import { Icon } from "./Components.jsx";

const STAGES = [
  "Drafting collection plan",
  "Sweeping indexed dark-web archives",
  "Translating Arabic keyword hits",
  "Profiling threat actors",
];

const KEY_FINDINGS = [
  "AndreasRybak (Darknetmarketnoobs) — explicit incitement to arm and 'kill whoever threatens your group'; claims access to RPG-7s sold via Telegram across Iraq and Syria.",
  "uncle_mo (Dread) — describes ex-prisoner militia integration in Basra; 'no one gets in or out unless you work for the militia.'",
  "Both actors' rhetoric and timing align with AAH-aligned resistance narratives; insider-threat exposure raises NGO partner-vetting risk.",
];

const ENTITIES = [
  { type: "Handles",   items: ["AndreasRybak", "uncle_mo"] },
  { type: "Keywords",  items: ["مقاومة", "عصائب أهل الحق", "فساد", "سلاح"] },
  { type: "Platforms", items: ["Darknetmarketnoobs", "Dread", "Telegram"] },
];

const EVIDENCE = [
  { num: "01", kind: "POST", source: "AndreasRybak — Darknetmarketnoobs · pg 76",   loc: "Iraq / Syria",   date: "02/2025", target: "rybak",    conf: "Moderate"  },
  { num: "02", kind: "POST", source: "uncle_mo — Dread thread · pg 68",              loc: "Basra",          date: "03/2025", target: "uncle_mo", conf: "Moderate"  },
  { num: "03", kind: "SYN",  source: "Cross-actor synthesis · 9 hits, 6 keywords",   loc: "Indexed sweep",  date: "Q1 2025", target: "synth",    conf: "Confirmed" },
];

// Inline citation pill — non-interactive, ties analytical claims back to a numbered evidence row.
const Cite = ({ id }) => <sup className="a-cite">{id}</sup>;

export const DemoA = () => {
  const [phase, setPhase] = React.useState("idle"); // idle | typing | loading | result | scroll | highlight
  const [typed, setTyped] = React.useState("");
  const [stageIdx, setStageIdx] = React.useState(-1);
  const [highlightIdx, setHighlightIdx] = React.useState(-1);
  const query = "AAH-linked threats to NGO staff in East Baghdad — dark-web sweep";
  const timers = React.useRef([]);
  const mainRef = React.useRef(null);
  const cardRefs = { rybak: React.useRef(null), uncle_mo: React.useRef(null), synth: React.useRef(null) };

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (delay, fn) => { timers.current.push(setTimeout(fn, delay)); };

  const scrollToCard = (target) => {
    const main = mainRef.current;
    const card = cardRefs[target]?.current;
    if (!main || !card) return;
    const top = card.offsetTop - 80;
    main.scrollTo({ top, behavior: "smooth" });
  };

  const run = () => {
    clearTimers();
    setPhase("typing");
    setTyped("");
    setStageIdx(-1);
    setHighlightIdx(-1);
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "auto" });

    // type
    for (let i = 0; i <= query.length; i++) {
      at(35 * i, () => setTyped(query.slice(0, i)));
    }
    const typingTime = 35 * query.length + 400;

    // loading stages
    at(typingTime, () => { setPhase("loading"); setStageIdx(0); });
    STAGES.forEach((_, i) => at(typingTime + 400 + i * 900, () => setStageIdx(i)));

    // result reveal — sit on the BLUF for a moment so the analyst can read it
    const resultTime = typingTime + 400 + STAGES.length * 900;
    at(resultTime, () => setPhase("result"));

    // begin scrolling into the analytical section
    const scrollTime = resultTime + 1800;
    at(scrollTime, () => setPhase("scroll"));

    // highlight each analysis card in turn, scroll-syncing as we go
    const highlightStart = scrollTime + 600;
    EVIDENCE.forEach((e, i) => {
      at(highlightStart + i * 2200, () => {
        setPhase("highlight");
        setHighlightIdx(i);
        scrollToCard(e.target);
      });
    });

    // loop
    const loopAt = highlightStart + EVIDENCE.length * 2200 + 1600;
    at(loopAt, run);
  };

  React.useEffect(() => {
    const t = setTimeout(run, 800);
    return () => { clearTimeout(t); clearTimers(); };
  }, []);

  const showResult = phase === "result" || phase === "scroll" || phase === "highlight";
  const litTarget = highlightIdx >= 0 ? EVIDENCE[highlightIdx].target : null;

  return (
    <div className="a-demo reveal">
      <div className="a-demo-chrome">
        <div className="a-demo-lights">
          <span className="a-demo-light"/><span className="a-demo-light"/><span className="a-demo-light"/>
        </div>
        <div className="a-demo-path">
          sidney.satorus.ai <span className="sep">/</span> dark-web
        </div>
        <span className="a-demo-pill">Live</span>
      </div>
      <div className="a-demo-body">
        <aside className="a-demo-side">
          <div className="a-demo-side-label">Workspace</div>
          <div className="a-side-item"><Icon name="sparkle" size={14}/>Home</div>
          <div className="a-side-item"><Icon name="search" size={14}/>Investigations <span style={{marginLeft:"auto",font:"500 10px var(--sidney-font-mono)",color:"var(--sidney-warn)"}}>2</span></div>
          <div className="a-side-item"><Icon name="file" size={14}/>Reports</div>
          <div className="a-side-item active"><Icon name="globe" size={14}/>Dark web</div>
          <div className="a-demo-side-label" style={{marginTop:16}}>Recent</div>
          <div className="a-side-recent-item"><div className="a-side-recent-t">AAH · East Baghdad</div><div className="a-side-recent-s">Now · Live</div></div>
          <div className="a-side-recent-item"><div className="a-side-recent-t">Andreas Rybak</div><div className="a-side-recent-s">5h ago · Review</div></div>
          <div className="a-side-recent-item"><div className="a-side-recent-t">Baghdad Movement</div><div className="a-side-recent-s">1d ago · Standing</div></div>
        </aside>
        <div className="a-demo-main" ref={mainRef}>
          <div className="a-demo-greeting">Good morning, Harry.</div>
          <div className="a-demo-h">Pick up where you left off, or start something new.</div>
          <div className={`a-cmdbar ${phase !== "idle" ? "focused" : ""}`}>
            <Icon name="sparkle" size={16}/>
            <div className={`a-cmdbar-text ${!typed ? "placeholder" : ""}`}>
              {typed || "Start an investigation..."}
              {phase === "typing" && <span className="caret"/>}
            </div>
            <div className="a-cmdbar-kbd">
              <span className="kbd">⌘</span><span className="kbd">↵</span>
            </div>
          </div>
          <div className="a-demo-modes">
            <span className="a-demo-mode on">Dark-web sweep</span>
            <span className="a-demo-mode">Read-only · sandboxed</span>
          </div>

          {(phase === "loading" || showResult) && (
            <div className="a-demo-stages">
              {STAGES.map((s, i) => {
                const state = showResult || i < stageIdx ? "done" : i === stageIdx ? "curr" : "future";
                return (
                  <div key={s} className={`a-stage-row ${state}`}>
                    <span className="a-stage-dot"><span className="d"/></span>
                    {s}
                    {state === "done" && <span className="a-stage-t">done</span>}
                    {state === "curr" && <span className="a-stage-t">running…</span>}
                  </div>
                );
              })}
            </div>
          )}

          {showResult && (
            <div className="a-finding reveal">
              <div className="a-finding-head">
                <span className="a-finding-pill">BLUF · Finding 01 of 02</span>
                <div className="a-finding-title">Two AAH-linked threat actors targeting NGO operations in East Baghdad</div>
                <span className="a-finding-conf">
                  <span className="a-finding-pip on"/><span className="a-finding-pip on"/><span className="a-finding-pip on"/><span className="a-finding-pip"/><span className="a-finding-pip"/>
                  <span className="a-finding-pip-label">Moderate</span>
                </span>
              </div>

              <div className="a-finding-meta">
                <span className="a-finding-meta-item"><span className="dot ok"/>Active</span>
                <span className="a-finding-meta-item"><span className="k">Class.</span> Confidential</span>
                <span className="a-finding-meta-item"><span className="k">Subject</span> AAH · East Baghdad NGO posture</span>
                <span className="a-finding-meta-item"><span className="k">Window</span> Last 12 mo</span>
                <span className="a-finding-meta-item"><span className="k">Mode</span> Read-only</span>
                <span className="a-finding-meta-item"><span className="k">Assigned</span> HM</span>
              </div>

              <div className="a-finding-body">
                Read-only dark-web sweep across an Arabic keyword matrix surfaced two distinct hostile actors: an active <mark>recruiter and arms-seller</mark> calling volunteers to arms in East Baghdad<Cite id="01"/>, and an <mark>ex-prisoner insider-threat node</mark> in Basra describing forced militia integration<Cite id="02"/>. Both findings warrant immediate operational mitigation and partner-vetting review<Cite id="03"/>.
              </div>

              <div className="a-finding-keys">
                <div className="a-finding-keys-label">Key findings</div>
                <ul>
                  {KEY_FINDINGS.map((f, i) => (
                    <li key={i}>
                      <span className="bullet">{String(i + 1).padStart(2, "0")}</span>
                      <span>{f}<Cite id={String(i + 1).padStart(2, "0")}/></span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="a-finding-entities">
                {ENTITIES.map(group => (
                  <div key={group.type} className="a-finding-entity-row">
                    <span className="a-finding-entity-k">{group.type}</span>
                    <div className="a-finding-entity-chips">
                      {group.items.map(item => (
                        <span key={item} className="a-finding-chip">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="a-finding-ev">
                <div className="a-finding-ev-label">Evidence chain · 9 dark-web hits · 0 unverified</div>
                {EVIDENCE.map((e, i) => (
                  <div key={i} className={`a-ev-row ${highlightIdx === i ? "highlighted" : ""}`}>
                    <span className="num">{e.num}</span>
                    <span className="kind">{e.kind}</span>
                    <span className="src-text">{e.source}</span>
                    <span className="conf">{e.conf}</span>
                    <span className="src">{e.loc} · {e.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Threat-actor analysis: AndreasRybak. Sidney's interpretation, not the raw posts. */}
          {showResult && (
            <div ref={cardRefs.rybak} className={`a-actor-card reveal ${litTarget === "rybak" ? "highlighted" : ""}`}>
              <div className="a-actor-head">
                <span className="a-actor-tag critical">Threat actor 01 · Critical</span>
                <div className="a-actor-h">AndreasRybak</div>
                <span className="a-actor-conf"><span className="dot"/>Direct, near-term threat vector</span>
              </div>
              <div className="a-actor-meta">
                <span><span className="k">Handle</span> AndreasRybak</span>
                <span><span className="k">Platform</span> Darknetmarketnoobs · Telegram</span>
                <span><span className="k">Lang.</span> EN + AR (non-native)</span>
                <span><span className="k">Geo</span> Iraq / Syria</span>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Quotes of interest</div>
                <blockquote className="a-actor-quote">
                  "Get some followers together, arm up… and kill whoever it is that threatens you and the people in your group."
                  <cite>Darknetmarketnoobs · pg 76 · 02/2025</cite>
                </blockquote>
                <blockquote className="a-actor-quote">
                  "I have RPG-7s sold on Telegram over in Iraq and Syria."
                  <cite>Telegram cross-ref · 10/2024</cite>
                </blockquote>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Sidney's analysis</div>
                <p className="a-actor-analysis">
                  Rybak presents as a <mark>self-motivated violent extremist or arms facilitator</mark><Cite id="01"/>, operating across dark-web and Telegram ecosystems. His rhetoric combines ideological justification with operational intent — explicitly urging others to "arm up" while invoking Taliban tactics as a model for local mobilisation. Posts demonstrate <mark>both intent and capability</mark><Cite id="01"/>: intent through repeated calls to violent action, capability through claims of weapons access and recruitment outreach across Iraq/Syria.
                </p>
                <p className="a-actor-analysis">
                  Language and timing align closely with AAH-adjacent resistance narratives<Cite id="03"/>. <em>A direct command-and-control link to AAH cannot be confirmed</em>, but his discourse reinforces the group's propaganda ecosystem and could function as an informal recruitment or facilitation node — a credible, near-term threat vector for NGO staff operating in East Baghdad.
                </p>
              </div>
            </div>
          )}

          {/* Threat-actor analysis: uncle_mo. Insider-threat dimension, narrative honesty about attribution. */}
          {showResult && (
            <div ref={cardRefs.uncle_mo} className={`a-actor-card reveal ${litTarget === "uncle_mo" ? "highlighted" : ""}`}>
              <div className="a-actor-head">
                <span className="a-actor-tag warn">Threat actor 02 · Insider-threat</span>
                <div className="a-actor-h">uncle_mo</div>
                <span className="a-actor-conf"><span className="dot warn"/>Indirect risk · partner-vetting exposure</span>
              </div>
              <div className="a-actor-meta">
                <span><span className="k">Handle</span> uncle_mo</span>
                <span><span className="k">Platform</span> Dread</span>
                <span><span className="k">Lang.</span> EN translit. · regional</span>
                <span><span className="k">Geo</span> Basra Governorate</span>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Quote of interest</div>
                <blockquote className="a-actor-quote">
                  "There's an active war in my area. No one gets in or out unless you work for the militia, that is what I had to do."
                  <cite>Dread thread · pg 68 · 03/2025</cite>
                </blockquote>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Sidney's analysis</div>
                <p className="a-actor-analysis">
                  uncle_mo appears to belong to a <mark>post-incarceration militant sub-network</mark> in Basra<Cite id="02"/>, a region with known militia penetration of formal security structures. The "no one gets in or out unless you work for the militia" framing<Cite id="02"/> implies <mark>territorial control by armed groups and coercive integration of civilians</mark> — particularly released inmates — into those networks.
                </p>
                <p className="a-actor-analysis">
                  <em>uncle_mo does not explicitly advocate violence</em>, and the account's anonymity limits attribution. However, linguistic and contextual consistency with verified Basra security trends lends moderate credibility<Cite id="03"/>. The risk is therefore <mark>insider-threat rather than external attack</mark>: NGO operating environments may be infiltrated by individuals with divided loyalties through military liaisons, drivers, or local guards — underscoring stricter partner-vetting and continuous monitoring.
                </p>
              </div>
            </div>
          )}

          {/* Synthesis & recommendations — the analytical move from two profiles to one operational picture. */}
          {showResult && (
            <div ref={cardRefs.synth} className={`a-synth-card reveal ${litTarget === "synth" ? "highlighted" : ""}`}>
              <div className="a-synth-head">
                <span className="a-synth-tag">Synthesis · Recommendations</span>
                <div className="a-synth-h">Operational picture &amp; next 72 hours</div>
              </div>

              <p className="a-synth-body">
                Taken together, the two actors describe a <mark>two-vector AAH-adjacent threat surface</mark><Cite id="01"/><Cite id="02"/>: direct mobilisation rhetoric in East Baghdad (Rybak) and insider-threat penetration through ex-prisoner reintegration in Basra (uncle_mo). The convergence of online incitement with offline militia control of civilian movement makes East Baghdad a <mark>high-risk operating environment</mark><Cite id="03"/>, particularly during election-related unrest, where online mobilisation rhetoric can quickly translate into real-world volatility.
              </p>

              <div className="a-synth-recs">
                <div className="a-synth-recs-h">Recommended actions · next 72 hours</div>
                <ol>
                  <li><span className="bullet">01</span><div><strong>Suspend</strong> high-visibility field activities in Sadr City, Baghdad al-Jadida, and the Rustamiyah corridor; reroute essential movements via the IZ Green Zone and Karada compounds.</div></li>
                  <li><span className="bullet">02</span><div><strong>Re-vet</strong> local partners with military or PMF ties — prioritise drivers, fixers, and guards recruited from Basra detention pipelines.</div></li>
                  <li><span className="bullet">03</span><div><strong>Refer</strong> the AndreasRybak evidence package (redacted) to host-nation security partners; maintain standing dark-web monitoring for re-emergence of either handle.</div></li>
                </ol>
              </div>
            </div>
          )}

          <div className="a-demo-runs">
            <span>Latency 3.4s</span>
            <span style={{color:"var(--sidney-border-strong)"}}>·</span>
            <span>9 dark-web hits cited</span>
            <span style={{color:"var(--sidney-border-strong)"}}>·</span>
            <span>0 hallucinations detected</span>
            <button onClick={run} className="btn btn-ghost" style={{ marginLeft:"auto", height: 28, padding:"0 12px", fontSize:11, letterSpacing:"0.04em", textTransform:"uppercase"}}>Replay</button>
          </div>
        </div>
      </div>
    </div>
  );
};
