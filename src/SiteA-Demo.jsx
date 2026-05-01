/* Direction A — Live Demo
   Geopolitical workflow showcasing Sidney's analytical layer (not just
   aggregation). Loop: typing → loading → result → scroll → highlight (each
   sub-region card in turn, the matching evidence rows pulse too) → restart.

   The four highlight slots map to:
     0 → Sub-region 01: Durand Line / Interstate Conflict
     1 → Sub-region 02: Balochistan separatist insurgency
     2 → Sub-region 03: KPK / Former FATA (TTP nationwide mobilisation)
     3 → Synthesis & recommendations card */
import React from "react";
import { Icon } from "./Components.jsx";

const STAGES = [
  "Decomposing query by sub-region",
  "Sweeping indexed dark-web archives",
  "Translating Arabic, Farsi, and Urdu keyword hits",
  "Cross-referencing weapons provenance data",
  "Mapping escalation timeline",
  "Profiling non-state actors",
];

const KEY_FINDINGS = [
  "Durand Line interstate conflict — Pakistan launched air strikes on Kabul, Kandahar, and Paktia (Operation Ghazab-ullah-Haq, 27 Feb 2026). Afghan Taliban seized 10+ Pakistani positions. Pakistan Defence Minister declared 'open war.' Chinese-brokered peace talks in Urumqi (2 Apr) have not halted hostilities.",
  "Balochistan insurgency escalation — BLA launched Operation Herof II across 14 cities simultaneously (Jan-Feb 2026) and conducted its first-ever maritime attack off Gwadar (14 Apr 2026). Weapons provenance analysis across 5 BLF/BLA attacks confirms US, Belarusian, Turkish, Chinese, and Soviet-origin arms.",
  "TTP nationwide mobilisation — TTP leader Noor Wali Mehsud issued a nationwide attack order (27 Feb 2026). TTP claimed 1,758 attacks in 2024 and is responsible for 1,200+ deaths in Pakistan in 2025. Transnational recruitment confirmed in Bangladesh.",
];

const ENTITIES = [
  { type: "Non-state actors", items: ["BLA", "BLF", "TTP", "ISIS-Khorasan"] },
  { type: "State actors",     items: ["Pakistan (PAF, ISI)", "Afghan Taliban (IEA)", "China (mediator)", "Iran", "Saudi Arabia", "India (accused proxy ops)"] },
  { type: "Individuals",      items: ["Noor Wali Mehsud", "Abdul Hamid Khorasani", "Mullah Yaqoob", "Khawaja Asif", "Dr. Mahrang Baloch", "Jeeyand Baloch"] },
  { type: "Platforms",        items: ["Telegram (12+ ch)", "Discord (Conflict Observers)", "Onion (MICRO-FILES, FLD)", "Pastebin"] },
];

const EVIDENCE = [
  { num: "01", kind: "POST", source: "Hakalmedia Bot — Telegram · BLA communique",     loc: "Balochistan",   date: "02/2026",     conf: "Tier 1",    target: "baloch" },
  { num: "02", kind: "POST", source: "War Noir — Telegram · weapons ID",                loc: "Balochistan",   date: "02-04/2026",  conf: "Confirmed", target: "baloch" },
  { num: "03", kind: "POST", source: "ResistanceTrench — Telegram · conflict brief",    loc: "Pakistan-wide", date: "02/2026",     conf: "Moderate",  target: "kpk"    },
  { num: "04", kind: "POST", source: "Punisher346 — Telegram · operational analysis",   loc: "Durand Line",   date: "02/2026",     conf: "Moderate",  target: "durand" },
  { num: "05", kind: "POST", source: "Conflict Observers — Discord · aggregated OSINT", loc: "Regional",      date: "02-04/2026",  conf: "Moderate",  target: "durand" },
  { num: "06", kind: "POST", source: "Front Line Defenders — Onion · human rights case", loc: "Gwadar",        date: "07/2024",     conf: "Confirmed", target: "baloch" },
  { num: "07", kind: "SYN",  source: "Cross-source synthesis · 47 hits, 3 sub-regions, 12+ channels", loc: "Indexed sweep", date: "Q1-Q2 2026", conf: "Confirmed", target: "synth" },
];

const HIGHLIGHT_TARGETS = ["durand", "baloch", "kpk", "synth"];

const DURAND_TIMELINE = [
  { date: "21 Feb",  event: "PAF strikes 7 terrorist bases in Nangarhar, Paktika, Khost. Retaliation for Islamabad mosque bombing (36 killed)." },
  { date: "26 Feb",  event: "Afghan Taliban launch large-scale offensive. BM-21 Grad MLRS deployed. 10 Pakistani positions seized." },
  { date: "27 Feb",  event: "Pakistan strikes Kabul for the first time. Operation Ghazab-ullah-Haq. Defence Minister declares 'open war.'" },
  { date: "27 Feb",  event: "TTP leader issues nationwide attack order against Pakistan military." },
  { date: "3 Mar",   event: "Pakistani soldiers beheaded by Taliban along Kandahar sector." },
  { date: "~15 Mar", event: "Heavy artillery and MLRS in active use. Unconfirmed reports Taliban supreme leader Akhundzada killed." },
  { date: "2 Apr",   event: "Chinese-brokered peace talks in Urumqi. Pakistan says it has 'exhausted all diplomatic options.'" },
  { date: "22 Apr",  event: "6 Pakistani soldiers killed in cross-border firing, Bajaur sector." },
  { date: "27 Apr",  event: "Afghan opposition fractures: NRF and Hazara warlord Mohaqiq recognise Durand Line, breaking with Taliban." },
];

const BALOCH_OPS = [
  { date: "31 Jan – 6 Feb", actor: "BLA",      loc: "14 cities",      sig: "Operation Herof II. Largest urban campaign. 93 BLA fighters killed. BLA seized Nushki army base." },
  { date: "24 Feb",         actor: "BLF",      loc: "Barkhan",        sig: "Attack on police. Turkish, Belarusian, Chinese weapons confirmed." },
  { date: "1 Mar",          actor: "BLF",      loc: "Kharan, Washuk", sig: "Raided government buildings. US M16A4 with M203 grenade launcher." },
  { date: "19 Mar",         actor: "BLF",      loc: "Mashkay",        sig: "US M4/M16A4 with thermal scope, RPGs." },
  { date: "28 Mar",         actor: "BLF",      loc: "Tump",           sig: "US M16A4, RPG-7 with anti-tank rockets." },
  { date: "31 Mar",         actor: "Multiple", loc: "9 areas",        sig: "30+ attacks in 24 hours. Army bases, intel centres, pipelines, bridges targeted." },
  { date: "9 Apr",          actor: "BLF",      loc: "Quetta",         sig: "Rare Belarus VSK-100 precision rifle confirmed (second appearance)." },
  { date: "14 Apr",         actor: "BLA",      loc: "Gwadar coast",   sig: "First-ever maritime attack. US M16A1, M4A1 rifles confirmed." },
];

const WEAPONS_PROVENANCE = [
  { origin: "US",         items: "M16A1, M16A4, M4A1, Penn Arms GL65-40R grenade launcher, thermal optics" },
  { origin: "Belarusian", items: "VSK-100 precision rifle (rare, appeared twice)" },
  { origin: "Turkish",    items: "Sarsilmaz SAR 15T" },
  { origin: "Chinese",    items: "Type 56, Type 56-1" },
  { origin: "Soviet",     items: "RPG-7, AKM, PKM, GP-25/GP-30 grenade launchers" },
];

// Inline citation pill — non-interactive, ties analytical claims back to a numbered evidence row.
const Cite = ({ id }) => <sup className="a-cite">{id}</sup>;

export const DemoA = () => {
  const [phase, setPhase] = React.useState("idle"); // idle | typing | loading | result | scroll | highlight
  const [typed, setTyped] = React.useState("");
  const [stageIdx, setStageIdx] = React.useState(-1);
  const [highlightIdx, setHighlightIdx] = React.useState(-1);
  const query = "Map current zones of instability along the Pakistan-Afghanistan border. Break down by sub-region.";
  const timers = React.useRef([]);
  const rootRef = React.useRef(null);
  const mainRef = React.useRef(null);
  const cardRefs = {
    durand: React.useRef(null),
    baloch: React.useRef(null),
    kpk:    React.useRef(null),
    synth:  React.useRef(null),
  };

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

    // result reveal — sit on the BLUF (title + meta + body + key findings +
    // entities + evidence chain) long enough for the analyst to actually read it
    const resultTime = typingTime + 400 + STAGES.length * 900;
    at(resultTime, () => setPhase("result"));

    // begin scrolling into the analytical section
    const scrollTime = resultTime + 4000;
    at(scrollTime, () => setPhase("scroll"));

    // Highlight each sub-region card in turn, then synthesis. The scroll snap
    // is quick (smooth-scroll, ~400ms) but the dwell on each card is generous
    // (5s) so visitors can scan the timeline / ops table / analysis before
    // the next snap.
    const highlightStart = scrollTime + 700;
    const dwellMs = 5000;
    HIGHLIGHT_TARGETS.forEach((target, i) => {
      at(highlightStart + i * dwellMs, () => {
        setPhase("highlight");
        setHighlightIdx(i);
        scrollToCard(target);
      });
    });

    // loop
    const loopAt = highlightStart + HIGHLIGHT_TARGETS.length * dwellMs + 2500;
    at(loopAt, run);
  };

  // Defer the start until the demo scrolls into view. Without this the loop
  // runs from page load and the user lands mid-investigation when they reach
  // the section. IntersectionObserver fires once at 25% visibility, then
  // disconnects — the loop self-perpetuates from there.
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let startTimer;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startTimer = setTimeout(run, 400);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearTimeout(startTimer);
      clearTimers();
    };
  }, []);

  const showResult = phase === "result" || phase === "scroll" || phase === "highlight";
  const litTarget = highlightIdx >= 0 ? HIGHLIGHT_TARGETS[highlightIdx] : null;

  return (
    <div className="a-demo reveal" ref={rootRef}>
      <div className="a-demo-chrome">
        <div className="a-demo-lights">
          <span className="a-demo-light"/><span className="a-demo-light"/><span className="a-demo-light"/>
        </div>
        <div className="a-demo-path">
          sidney.satorus.ai <span className="sep">/</span> home
        </div>
        <span className="a-demo-pill">Live</span>
      </div>
      <div className="a-demo-body">
        <aside className="a-demo-side">
          <div className="a-demo-side-label">Workspace</div>
          <div className="a-side-item active"><Icon name="sparkle" size={14}/>Home</div>
          <div className="a-side-item"><Icon name="search" size={14}/>Investigations <span style={{marginLeft:"auto",font:"500 10px var(--sidney-font-mono)",color:"var(--sidney-warn)"}}>3</span></div>
          <div className="a-side-item"><Icon name="file" size={14}/>Reports</div>
          <div className="a-side-item"><Icon name="globe" size={14}/>Dark web</div>
          <div className="a-demo-side-label" style={{marginTop:16}}>Recent</div>
          <div className="a-side-recent-item"><div className="a-side-recent-t">Pak-Afghan Border</div><div className="a-side-recent-s">Now · Live</div></div>
          <div className="a-side-recent-item"><div className="a-side-recent-t">BLA Weapons Tracing</div><div className="a-side-recent-s">6h ago · Review</div></div>
          <div className="a-side-recent-item"><div className="a-side-recent-t">TTP Nationwide Threat</div><div className="a-side-recent-s">1d ago · Standing</div></div>
          <div className="a-side-recent-item"><div className="a-side-recent-t">Durand Line Crisis</div><div className="a-side-recent-s">2d ago · Complete</div></div>
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
            <span className="a-demo-mode">Read-only</span>
            <span className="a-demo-mode">90-day window</span>
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
                <span className="a-finding-pill">BLUF · Finding 01 of 03</span>
                <div className="a-finding-title">Three concurrent instability vectors across the Pakistan-Afghanistan border</div>
                <span className="a-finding-conf">
                  <span className="a-finding-pip on"/><span className="a-finding-pip on"/><span className="a-finding-pip on"/><span className="a-finding-pip on"/><span className="a-finding-pip on"/>
                  <span className="a-finding-pip-label">Critical</span>
                </span>
              </div>

              <div className="a-finding-meta">
                <span className="a-finding-meta-item"><span className="dot ok"/>Active</span>
                <span className="a-finding-meta-item"><span className="k">Class.</span> Confidential</span>
                <span className="a-finding-meta-item"><span className="k">Subject</span> Pakistan-Afghanistan Border</span>
                <span className="a-finding-meta-item"><span className="k">Window</span> Last 90 days</span>
                <span className="a-finding-meta-item"><span className="k">Mode</span> Multi-source</span>
                <span className="a-finding-meta-item"><span className="k">Assigned</span> HM</span>
              </div>

              <div className="a-finding-body">
                Multi-source dark-web sweep decomposed across three sub-regions surfaced an <mark>interstate military conflict</mark>, an <mark>intensifying separatist insurgency</mark>, and a <mark>nationwide militant offensive</mark> running simultaneously<Cite id="07"/>. Pakistan and the Afghan Taliban entered open warfare along the Durand Line in late February 2026 following Pakistani air strikes on Kabul<Cite id="04"/><Cite id="05"/>. In Balochistan, BLA and BLF conducted sustained operations including an unprecedented maritime attack<Cite id="01"/>, armed with US, Belarusian, Turkish, and Chinese weapons indicating sophisticated supply chains<Cite id="02"/>. TTP issued a nationwide attack order and is recruiting transnationally<Cite id="03"/>. All three vectors are escalating and mutually reinforcing<Cite id="07"/>.
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
                <div className="a-finding-ev-label">Evidence chain · 47 dark-web hits · 7 queries · 0 unverified</div>
                {EVIDENCE.map((e, i) => (
                  <div key={i} className={`a-ev-row ${litTarget === e.target ? "highlighted" : ""}`}>
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

          {/* Sub-region 01: Durand Line / Interstate Conflict */}
          {showResult && (
            <div ref={cardRefs.durand} className={`a-actor-card reveal ${litTarget === "durand" ? "highlighted" : ""}`}>
              <div className="a-actor-head">
                <span className="a-actor-tag critical">Sub-region 01 · Critical</span>
                <div className="a-actor-h">Durand Line / Interstate Conflict</div>
                <span className="a-actor-conf"><span className="dot"/>Active interstate war</span>
              </div>
              <div className="a-actor-meta">
                <span><span className="k">Region</span> Durand Line corridor</span>
                <span><span className="k">Provinces</span> Nangarhar, Paktia, Khost, Kunar, Kandahar</span>
                <span><span className="k">Status</span> Open warfare</span>
                <span><span className="k">Trajectory</span> Steep escalation</span>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Escalation timeline</div>
                <div className="a-actor-timeline">
                  {DURAND_TIMELINE.map((row, i) => (
                    <div key={i} className="a-actor-timeline-row">
                      <span className="date">{row.date}</span>
                      <span className="event">{row.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Quotes of interest</div>
                <blockquote className="a-actor-quote">
                  "If Kabul is attacked the response will be in Islamabad."
                  <cite>Mullah Yaqoob (Afghan Defence Minister) · Conflict Observers Discord · 02/2026</cite>
                </blockquote>
                <blockquote className="a-actor-quote">
                  "If Pakistan is proud of its ballistic missiles and nuclear bombs, we have battalions of suicide bombers."
                  <cite>Abdul Hamid Khorasani (Taliban commander) · Analise Militar · 02/2026</cite>
                </blockquote>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Sidney's analysis</div>
                <p className="a-actor-analysis">
                  The Durand Line corridor has escalated from counter-terrorism strikes into an <mark>interstate war between two nuclear-threshold states</mark><Cite id="04"/>. The trigger was the Islamabad Shia mosque bombing (attributed to ISIS-Khorasan operating from Afghan territory), but the underlying territorial dispute over the Durand Line is the structural driver<Cite id="04"/>. Pakistan's decision to strike Kabul directly represents a threshold crossing: the Afghan Taliban's response has been both conventional (BM-21 Grad deployments, position seizures) and unconventional (Khorasani's suicide bomber threat)<Cite id="05"/>.
                </p>
                <p className="a-actor-analysis">
                  The conflict is simultaneously fracturing Afghan domestic politics. <mark>NRF and Hazara opposition recognising the Durand Line as Pakistan's border</mark> breaks a long-standing Afghan consensus<Cite id="05"/>, potentially creating openings for negotiation but also deepening Taliban intransigence. Chinese mediation in Urumqi signals Beijing's concern over CPEC corridor security but has not yet produced a ceasefire<Cite id="04"/><Cite id="05"/>.
                </p>
                <p className="a-actor-analysis">
                  Real-time Telegram coverage from 8+ simultaneous channels in 6 languages demonstrates the conflict's international information footprint<Cite id="07"/>. <em>The escalation trajectory remains steep; no de-escalation mechanism is currently visible.</em>
                </p>
              </div>
            </div>
          )}

          {/* Sub-region 02: Balochistan separatist insurgency */}
          {showResult && (
            <div ref={cardRefs.baloch} className={`a-actor-card reveal ${litTarget === "baloch" ? "highlighted" : ""}`}>
              <div className="a-actor-head">
                <span className="a-actor-tag critical">Sub-region 02 · Critical</span>
                <div className="a-actor-h">Balochistan / Quetta-Chaman, Gwadar, Turbat</div>
                <span className="a-actor-conf"><span className="dot"/>Escalating separatist insurgency</span>
              </div>
              <div className="a-actor-meta">
                <span><span className="k">Region</span> Balochistan Province</span>
                <span><span className="k">Corridors</span> Quetta-Chaman, Gwadar, Mashkay-Turbat</span>
                <span><span className="k">Actors</span> BLA · BLF · BYC</span>
                <span><span className="k">Trajectory</span> Expanding (maritime added)</span>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Key operations · 90-day window</div>
                <div className="a-actor-ops">
                  {BALOCH_OPS.map((op, i) => (
                    <div key={i} className="a-actor-ops-row">
                      <span className="date">{op.date}</span>
                      <span className="actor">{op.actor}</span>
                      <span className="loc">{op.loc}</span>
                      <span className="sig">{op.sig}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Weapons provenance · 5+ engagements</div>
                <ul className="a-actor-arms">
                  {WEAPONS_PROVENANCE.map(w => (
                    <li key={w.origin}>
                      <span className="origin">{w.origin}</span>
                      <span className="items">{w.items}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Sidney's analysis</div>
                <p className="a-actor-analysis">
                  The Balochistan insurgency has entered a new phase. <mark>BLA's Operation Herof II demonstrated coordinated urban warfare capability across 14 cities simultaneously</mark><Cite id="01"/>, a significant leap from previous hit-and-run tactics. The April maritime attack off Gwadar opens an entirely new domain of operations and directly threatens CPEC port infrastructure<Cite id="01"/>.
                </p>
                <p className="a-actor-analysis">
                  Weapons provenance data across five BLF/BLA attacks tells a supply chain story<Cite id="02"/>. The presence of US thermal optics, standalone grenade launchers, and the rare Belarus VSK-100 precision rifle (appearing twice in separate engagements) indicates a <mark>well-resourced insurgency with access to multiple international supply lines</mark><Cite id="02"/>. <em>This is not improvised weaponry; it is a diversified, sophisticated procurement network.</em>
                </p>
                <p className="a-actor-analysis">
                  The human rights dimension is inseparable from the military one. BYC leader Dr. Mahrang Baloch faces sedition charges linked to CPEC displacement protests<Cite id="06"/>. BYC member Sabghatullah Abdul Haq was subjected to enforced disappearance by the Pakistan Army in Gwadar<Cite id="06"/>. These cases, surfaced via onion-hosted Front Line Defenders, illustrate the civilian cost of the security response and the grievance cycle fuelling recruitment.
                </p>
              </div>
            </div>
          )}

          {/* Sub-region 03: KPK / Former FATA — TTP nationwide mobilisation */}
          {showResult && (
            <div ref={cardRefs.kpk} className={`a-actor-card reveal ${litTarget === "kpk" ? "highlighted" : ""}`}>
              <div className="a-actor-head">
                <span className="a-actor-tag warn">Sub-region 03 · High</span>
                <div className="a-actor-h">Khyber Pakhtunkhwa / Former FATA</div>
                <span className="a-actor-conf"><span className="dot warn"/>Nationwide militant mobilisation</span>
              </div>
              <div className="a-actor-meta">
                <span><span className="k">Region</span> KPK, former FATA, nationwide</span>
                <span><span className="k">Actor</span> TTP</span>
                <span><span className="k">Status</span> Active nationwide attack order</span>
                <span><span className="k">Recruitment</span> Transnational (Bangladesh confirmed)</span>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Quote of interest</div>
                <blockquote className="a-actor-quote">
                  TTP leader Noor Wali Mehsud issued orders for widespread attacks across Pakistan.
                  <cite>ResistanceTrench · voice message · 27/02/2026</cite>
                </blockquote>
              </div>

              <div className="a-actor-section">
                <div className="a-actor-section-h">Sidney's analysis</div>
                <p className="a-actor-analysis">
                  TTP remains the <mark>single deadliest non-state actor operating in Pakistan</mark><Cite id="03"/>, with 1,200+ deaths attributed in 2025 and 1,758 self-reported attacks in 2024 across sniper, guerrilla, ambush, grenade, and suicide categories<Cite id="03"/>. The nationwide attack order issued on 27 February 2026 directly coincided with the Durand Line escalation, suggesting TTP is leveraging the interstate conflict as operational cover<Cite id="04"/>.
                </p>
                <p className="a-actor-analysis">
                  Territorial control indicators are alarming: <mark>TTP militants patrolling in uniform and operating checkpoints in Bannu (KPK) during Eid</mark> demonstrates governance-level presence, not merely insurgent activity<Cite id="03"/>. Transnational recruitment in Bangladesh (25-30 confirmed recruits, named individuals arrested) expands TTP's operational base beyond the traditional Pashtun recruitment pool via online radicalisation, clerical mentorship, and labour-migration cover<Cite id="03"/>.
                </p>
                <p className="a-actor-analysis">
                  Sub-factions Jamaat-ul-Ahrar and Hizbul Ahrar have been fully absorbed into the TTP umbrella and no longer generate independent signal<Cite id="07"/>. <em>The research agent should tag these as covered-by-parent to avoid redundant queries.</em>
                </p>
              </div>
            </div>
          )}

          {/* Synthesis & recommendations — analytical move from three sub-regions to one operational picture. */}
          {showResult && (
            <div ref={cardRefs.synth} className={`a-synth-card reveal ${litTarget === "synth" ? "highlighted" : ""}`}>
              <div className="a-synth-head">
                <span className="a-synth-tag">Synthesis · Recommendations</span>
                <div className="a-synth-h">Operational picture &amp; forward assessment</div>
              </div>

              <p className="a-synth-body">
                The Pakistan-Afghanistan border is experiencing <mark>three simultaneous, mutually reinforcing instability vectors</mark><Cite id="07"/>: an interstate war along the Durand Line<Cite id="04"/>, an escalating separatist insurgency in Balochistan with expanding domain (maritime) and diversified international weapons supply<Cite id="01"/><Cite id="02"/>, and a nationwide TTP mobilisation order with transnational recruitment<Cite id="03"/>. These vectors compound one another: the Durand Line conflict provides TTP with operational cover, Balochistan separatists exploit the Army's two-front distraction, and all three erode state control over territory and borders<Cite id="07"/>.
              </p>
              <p className="a-synth-body">
                External actor dynamics add further complexity. <mark>China is mediating but primarily motivated by CPEC corridor protection</mark><Cite id="04"/><Cite id="05"/>. Saudi Arabia has signed a mutual defence pact with Pakistan. Iran has recognised the Taliban government and offered mediation. Pakistan has explicitly accused Indian intelligence (RAW) of orchestrating terrorism through proxy networks<Cite id="03"/>. The information ecosystem spans 12+ Telegram channels, Discord servers, onion sites, and Pastebin in at least 7 languages, indicating global audience reach<Cite id="07"/>.
              </p>
              <p className="a-synth-body">
                <em>No de-escalation mechanism is currently visible on any of the three vectors.</em>
              </p>

              <div className="a-synth-recs">
                <div className="a-synth-recs-h">Recommended monitoring posture</div>
                <ol>
                  <li><span className="bullet">01</span><div><strong>Maintain</strong> standing dark-web sweeps on BLA, TTP, and Durand Line with 72-hour refresh cycles. Tag cross-node spillover content to all relevant branches.</div></li>
                  <li><span className="bullet">02</span><div><strong>Track</strong> weapons provenance indicators. The Belarus VSK-100 and US thermal optics warrant dedicated supply chain analysis via complementary OSINT sources.</div></li>
                  <li><span className="bullet">03</span><div><strong>Monitor</strong> Afghan opposition fractures (NRF, Mohaqiq) as potential negotiation leverage points on the Durand Line dispute.</div></li>
                  <li><span className="bullet">04</span><div><strong>Flag</strong> TTP transnational recruitment signals in Bangladesh and beyond for escalation to partner agencies.</div></li>
                </ol>
              </div>
            </div>
          )}

          <div className="a-demo-runs">
            <span>Latency 8.2s</span>
            <span style={{color:"var(--sidney-border-strong)"}}>·</span>
            <span>47 dark-web hits cited</span>
            <button onClick={run} className="btn btn-ghost" style={{ marginLeft:"auto", height: 28, padding:"0 12px", fontSize:11, letterSpacing:"0.04em", textTransform:"uppercase"}}>Replay</button>
          </div>
        </div>
      </div>
    </div>
  );
};
