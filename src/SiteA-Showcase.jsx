/* Launch-event showcase — hidden route /showcase
   ─────────────────────────────────────────────────────────────────────────
   A fullscreen, self-looping "attract loop" for a TV at the launch event.
   It is a richer, more detailed sibling of the homepage DemoA: real Sidney
   investigations shown inside the full product shell — workspace sidebar, top
   bar, a live dark-web sweep console, and a live-stats rail — cycled one after
   another, scaled up for legibility across a room.

   Not linked anywhere. Reached only by typing /showcase. App.jsx renders this
   full-viewport with no site nav or footer.

   The stage is authored at a fixed 1600×900 (16:9) canvas and CSS-scaled to
   fill whatever TV/monitor it lands on, so composition is identical at 1080p
   or 4K. Internal card scrolling uses the panel's own coordinate space, so the
   scale transform never throws off scrollTo().

   Content lives in INVESTIGATIONS below — each is one real Sidney case. #1 is
   the Pakistan-Afghanistan corpus (shared with DemoA). Add #2 / #3 as further
   objects of the same shape; the player picks up any length automatically.

   Per-investigation choreography (generous dwell so a passer-by can read):
     typing → sweep → result → highlight×N → export → advance → loop           */
import React from "react";
import { Icon, SatorusMark } from "./Components.jsx";

// Inline citation pill — ties analytical claims back to a numbered evidence row.
const Cite = ({ id }) => <sup className="a-cite">{id}</sup>;

/* ═══════════════════════════════════════════════════════════════════════════
   INVESTIGATIONS
   Each object is one real Sidney case. Shape:
     { id, subject, path, query, modes[], sweep[], stats{}, langs[],
       finding{}, cards[], synth{} }
   Card sections are typed (timeline | ops | arms | quotes | analysis) so
   different real investigations can carry different evidence structures.
   ═══════════════════════════════════════════════════════════════════════════ */
const INVESTIGATIONS = [
  {
    id: "pak-afghan",
    subject: "Pakistan-Afghanistan Border",
    path: "pak-afghan-border",
    query: "Map every active zone of instability along the Pakistan–Afghanistan border. Break it down by sub-region, with sourcing.",
    modes: ["Dark-web sweep", "Read-only", "90-day window", "Multi-language"],
    // sweep hits sum to 47 — the figure the finding cites.
    sweep: [
      { src: "Hakalmedia Bot",       net: "Telegram", region: "Balochistan",   lang: "Urdu",    hits: 9 },
      { src: "War Noir",             net: "Telegram", region: "Weapons ID",     lang: "English", hits: 6 },
      { src: "ResistanceTrench",     net: "Telegram", region: "Pakistan-wide",  lang: "Pashto",  hits: 7 },
      { src: "Punisher346",          net: "Telegram", region: "Durand Line",    lang: "Dari",    hits: 5 },
      { src: "Conflict Observers",   net: "Discord",  region: "Regional",       lang: "Multi",   hits: 8 },
      { src: "MICRO-FILES",          net: "Onion",    region: "Archive",        lang: "Arabic",  hits: 4 },
      { src: "Front Line Defenders", net: "Onion",    region: "Gwadar",         lang: "English", hits: 3 },
      { src: "Mirror set 04",        net: "Pastebin", region: "Indexed",        lang: "Multi",   hits: 5 },
    ],
    stats: { hits: 47, channels: 12, sources: 8, langs: 7 },
    langs: [
      { l: "Urdu", w: 28 }, { l: "Pashto", w: 22 }, { l: "Dari", w: 18 },
      { l: "English", w: 16 }, { l: "Arabic", w: 10 }, { l: "Balochi", w: 6 },
    ],
    finding: {
      pill: "BLUF · Finding 01 of 03",
      title: "Three concurrent instability vectors across the Pakistan-Afghanistan border",
      confPips: 5,
      confLabel: "Critical",
      meta: [
        { dot: "ok", label: "Active" },
        { k: "Class.", v: "Confidential" },
        { k: "Subject", v: "Pakistan-Afghanistan Border" },
        { k: "Window", v: "Last 90 days" },
        { k: "Mode", v: "Multi-source" },
        { k: "Assigned", v: "HM" },
      ],
      body: (
        <>
          Multi-source dark-web sweep decomposed across three sub-regions surfaced an <mark>interstate military conflict</mark>, an <mark>intensifying separatist insurgency</mark>, and a <mark>nationwide militant offensive</mark> running simultaneously<Cite id="07"/>. Pakistan and the Afghan Taliban entered open warfare along the Durand Line in late February 2026 following Pakistani air strikes on Kabul<Cite id="04"/><Cite id="05"/>. In Balochistan, BLA and BLF conducted sustained operations including an unprecedented maritime attack<Cite id="01"/>, armed with US, Belarusian, Turkish, and Chinese weapons indicating sophisticated supply chains<Cite id="02"/>. TTP issued a nationwide attack order and is recruiting transnationally<Cite id="03"/>. All three vectors are escalating and mutually reinforcing<Cite id="07"/>.
        </>
      ),
      keyFindings: [
        "Durand Line interstate conflict — Pakistan launched air strikes on Kabul, Kandahar, and Paktia (Operation Ghazab-ullah-Haq, 27 Feb 2026). Afghan Taliban seized 10+ Pakistani positions. Pakistan Defence Minister declared 'open war.' Chinese-brokered peace talks in Urumqi (2 Apr) have not halted hostilities.",
        "Balochistan insurgency escalation — BLA launched Operation Herof II across 14 cities simultaneously (Jan-Feb 2026) and conducted its first-ever maritime attack off Gwadar (14 Apr 2026). Weapons provenance analysis across 5 BLF/BLA attacks confirms US, Belarusian, Turkish, Chinese, and Soviet-origin arms.",
        "TTP nationwide mobilisation — TTP leader Noor Wali Mehsud issued a nationwide attack order (27 Feb 2026). TTP claimed 1,758 attacks in 2024 and is responsible for 1,200+ deaths in Pakistan in 2025. Transnational recruitment confirmed in Bangladesh.",
      ],
      entities: [
        { type: "Non-state actors", items: ["BLA", "BLF", "TTP", "ISIS-Khorasan"] },
        { type: "State actors",     items: ["Pakistan (PAF, ISI)", "Afghan Taliban (IEA)", "China (mediator)", "Iran", "Saudi Arabia", "India (accused proxy ops)"] },
        { type: "Individuals",      items: ["Noor Wali Mehsud", "Abdul Hamid Khorasani", "Mullah Yaqoob", "Khawaja Asif", "Dr. Mahrang Baloch", "Jeeyand Baloch"] },
        { type: "Platforms",        items: ["Telegram (12+ ch)", "Discord (Conflict Observers)", "Onion (MICRO-FILES, FLD)", "Pastebin"] },
      ],
      evidenceLabel: "Evidence chain · 47 dark-web hits · 7 queries · 0 unverified",
      evidence: [
        { num: "01", kind: "POST", source: "Hakalmedia Bot — Telegram · BLA communique",     conf: "Tier 1",    loc: "Balochistan",   date: "02/2026",     target: "baloch" },
        { num: "02", kind: "POST", source: "War Noir — Telegram · weapons ID",                conf: "Confirmed", loc: "Balochistan",   date: "02-04/2026",  target: "baloch" },
        { num: "03", kind: "POST", source: "ResistanceTrench — Telegram · conflict brief",    conf: "Moderate",  loc: "Pakistan-wide", date: "02/2026",     target: "kpk"    },
        { num: "04", kind: "POST", source: "Punisher346 — Telegram · operational analysis",   conf: "Moderate",  loc: "Durand Line",   date: "02/2026",     target: "durand" },
        { num: "05", kind: "POST", source: "Conflict Observers — Discord · aggregated OSINT", conf: "Moderate",  loc: "Regional",      date: "02-04/2026",  target: "durand" },
        { num: "06", kind: "POST", source: "Front Line Defenders — Onion · human rights case", conf: "Confirmed", loc: "Gwadar",       date: "07/2024",     target: "baloch" },
        { num: "07", kind: "SYN",  source: "Cross-source synthesis · 47 hits, 3 sub-regions, 12+ channels", conf: "Confirmed", loc: "Indexed sweep", date: "Q1-Q2 2026", target: "synth" },
      ],
    },
    cards: [
      {
        id: "durand",
        tag: { label: "Sub-region 01 · Critical", kind: "critical" },
        title: "Durand Line / Interstate Conflict",
        conf: { label: "Active interstate war", dot: "critical" },
        meta: [
          { k: "Region", v: "Durand Line corridor" },
          { k: "Provinces", v: "Nangarhar, Paktia, Khost, Kunar, Kandahar" },
          { k: "Status", v: "Open warfare" },
          { k: "Trajectory", v: "Steep escalation" },
        ],
        sections: [
          { type: "timeline", h: "Escalation timeline", rows: [
            { date: "21 Feb",  event: "PAF strikes 7 terrorist bases in Nangarhar, Paktika, Khost. Retaliation for Islamabad mosque bombing (36 killed)." },
            { date: "26 Feb",  event: "Afghan Taliban launch large-scale offensive. BM-21 Grad MLRS deployed. 10 Pakistani positions seized." },
            { date: "27 Feb",  event: "Pakistan strikes Kabul for the first time. Operation Ghazab-ullah-Haq. Defence Minister declares 'open war.'" },
            { date: "27 Feb",  event: "TTP leader issues nationwide attack order against Pakistan military." },
            { date: "3 Mar",   event: "Pakistani soldiers beheaded by Taliban along Kandahar sector." },
            { date: "~15 Mar", event: "Heavy artillery and MLRS in active use. Unconfirmed reports Taliban supreme leader Akhundzada killed." },
            { date: "2 Apr",   event: "Chinese-brokered peace talks in Urumqi. Pakistan says it has 'exhausted all diplomatic options.'" },
            { date: "22 Apr",  event: "6 Pakistani soldiers killed in cross-border firing, Bajaur sector." },
            { date: "27 Apr",  event: "Afghan opposition fractures: NRF and Hazara warlord Mohaqiq recognise Durand Line, breaking with Taliban." },
          ]},
          { type: "quotes", h: "Quotes of interest", rows: [
            { quote: "“If Kabul is attacked the response will be in Islamabad.”", cite: "Mullah Yaqoob (Afghan Defence Minister) · Conflict Observers Discord · 02/2026" },
            { quote: "“If Pakistan is proud of its ballistic missiles and nuclear bombs, we have battalions of suicide bombers.”", cite: "Abdul Hamid Khorasani (Taliban commander) · Analise Militar · 02/2026" },
          ]},
          { type: "analysis", h: "Sidney's analysis", paras: [
            <>The Durand Line corridor has escalated from counter-terrorism strikes into an <mark>interstate war between two nuclear-threshold states</mark><Cite id="04"/>. The trigger was the Islamabad Shia mosque bombing (attributed to ISIS-Khorasan operating from Afghan territory), but the underlying territorial dispute over the Durand Line is the structural driver<Cite id="04"/>. Pakistan's decision to strike Kabul directly represents a threshold crossing: the Afghan Taliban's response has been both conventional (BM-21 Grad deployments, position seizures) and unconventional (Khorasani's suicide bomber threat)<Cite id="05"/>.</>,
            <>The conflict is simultaneously fracturing Afghan domestic politics. <mark>NRF and Hazara opposition recognising the Durand Line as Pakistan's border</mark> breaks a long-standing Afghan consensus<Cite id="05"/>, potentially creating openings for negotiation but also deepening Taliban intransigence. Chinese mediation in Urumqi signals Beijing's concern over CPEC corridor security but has not yet produced a ceasefire<Cite id="04"/><Cite id="05"/>.</>,
            <>Real-time Telegram coverage from 8+ simultaneous channels in 6 languages demonstrates the conflict's international information footprint<Cite id="07"/>. <em>The escalation trajectory remains steep; no de-escalation mechanism is currently visible.</em></>,
          ]},
        ],
      },
      {
        id: "baloch",
        tag: { label: "Sub-region 02 · Critical", kind: "critical" },
        title: "Balochistan / Quetta-Chaman, Gwadar, Turbat",
        conf: { label: "Escalating separatist insurgency", dot: "critical" },
        meta: [
          { k: "Region", v: "Balochistan Province" },
          { k: "Corridors", v: "Quetta-Chaman, Gwadar, Mashkay-Turbat" },
          { k: "Actors", v: "BLA · BLF · BYC" },
          { k: "Trajectory", v: "Expanding (maritime added)" },
        ],
        sections: [
          { type: "ops", h: "Key operations · 90-day window", rows: [
            { date: "31 Jan – 6 Feb", actor: "BLA",      loc: "14 cities",      sig: "Operation Herof II. Largest urban campaign. 93 BLA fighters killed. BLA seized Nushki army base." },
            { date: "24 Feb",         actor: "BLF",      loc: "Barkhan",        sig: "Attack on police. Turkish, Belarusian, Chinese weapons confirmed." },
            { date: "1 Mar",          actor: "BLF",      loc: "Kharan, Washuk", sig: "Raided government buildings. US M16A4 with M203 grenade launcher." },
            { date: "19 Mar",         actor: "BLF",      loc: "Mashkay",        sig: "US M4/M16A4 with thermal scope, RPGs." },
            { date: "28 Mar",         actor: "BLF",      loc: "Tump",           sig: "US M16A4, RPG-7 with anti-tank rockets." },
            { date: "31 Mar",         actor: "Multiple", loc: "9 areas",        sig: "30+ attacks in 24 hours. Army bases, intel centres, pipelines, bridges targeted." },
            { date: "9 Apr",          actor: "BLF",      loc: "Quetta",         sig: "Rare Belarus VSK-100 precision rifle confirmed (second appearance)." },
            { date: "14 Apr",         actor: "BLA",      loc: "Gwadar coast",   sig: "First-ever maritime attack. US M16A1, M4A1 rifles confirmed." },
          ]},
          { type: "arms", h: "Weapons provenance · 5+ engagements", rows: [
            { origin: "US",         items: "M16A1, M16A4, M4A1, Penn Arms GL65-40R grenade launcher, thermal optics" },
            { origin: "Belarusian", items: "VSK-100 precision rifle (rare, appeared twice)" },
            { origin: "Turkish",    items: "Sarsilmaz SAR 15T" },
            { origin: "Chinese",    items: "Type 56, Type 56-1" },
            { origin: "Soviet",     items: "RPG-7, AKM, PKM, GP-25/GP-30 grenade launchers" },
          ]},
          { type: "analysis", h: "Sidney's analysis", paras: [
            <>The Balochistan insurgency has entered a new phase. <mark>BLA's Operation Herof II demonstrated coordinated urban warfare capability across 14 cities simultaneously</mark><Cite id="01"/>, a significant leap from previous hit-and-run tactics. The April maritime attack off Gwadar opens an entirely new domain of operations and directly threatens CPEC port infrastructure<Cite id="01"/>.</>,
            <>Weapons provenance data across five BLF/BLA attacks tells a supply chain story<Cite id="02"/>. The presence of US thermal optics, standalone grenade launchers, and the rare Belarus VSK-100 precision rifle (appearing twice in separate engagements) indicates a <mark>well-resourced insurgency with access to multiple international supply lines</mark><Cite id="02"/>. <em>This is not improvised weaponry; it is a diversified, sophisticated procurement network.</em></>,
            <>The human rights dimension is inseparable from the military one. BYC leader Dr. Mahrang Baloch faces sedition charges linked to CPEC displacement protests<Cite id="06"/>. BYC member Sabghatullah Abdul Haq was subjected to enforced disappearance by the Pakistan Army in Gwadar<Cite id="06"/>. These cases, surfaced via onion-hosted Front Line Defenders, illustrate the civilian cost of the security response and the grievance cycle fuelling recruitment.</>,
          ]},
        ],
      },
      {
        id: "kpk",
        tag: { label: "Sub-region 03 · High", kind: "warn" },
        title: "Khyber Pakhtunkhwa / Former FATA",
        conf: { label: "Nationwide militant mobilisation", dot: "warn" },
        meta: [
          { k: "Region", v: "KPK, former FATA, nationwide" },
          { k: "Actor", v: "TTP" },
          { k: "Status", v: "Active nationwide attack order" },
          { k: "Recruitment", v: "Transnational (Bangladesh confirmed)" },
        ],
        sections: [
          { type: "quotes", h: "Quote of interest", rows: [
            { quote: "TTP leader Noor Wali Mehsud issued orders for widespread attacks across Pakistan.", cite: "ResistanceTrench · voice message · 27/02/2026" },
          ]},
          { type: "analysis", h: "Sidney's analysis", paras: [
            <>TTP remains the <mark>single deadliest non-state actor operating in Pakistan</mark><Cite id="03"/>, with 1,200+ deaths attributed in 2025 and 1,758 self-reported attacks in 2024 across sniper, guerrilla, ambush, grenade, and suicide categories<Cite id="03"/>. The nationwide attack order issued on 27 February 2026 directly coincided with the Durand Line escalation, suggesting TTP is leveraging the interstate conflict as operational cover<Cite id="04"/>.</>,
            <>Territorial control indicators are alarming: <mark>TTP militants patrolling in uniform and operating checkpoints in Bannu (KPK) during Eid</mark> demonstrates governance-level presence, not merely insurgent activity<Cite id="03"/>. Transnational recruitment in Bangladesh (25-30 confirmed recruits, named individuals arrested) expands TTP's operational base beyond the traditional Pashtun recruitment pool via online radicalisation, clerical mentorship, and labour-migration cover<Cite id="03"/>.</>,
            <>Sub-factions Jamaat-ul-Ahrar and Hizbul Ahrar have been fully absorbed into the TTP umbrella and no longer generate independent signal<Cite id="07"/>.</>,
          ]},
        ],
      },
    ],
    synth: {
      tag: "Synthesis · Recommendations",
      title: "Operational picture & forward assessment",
      paras: [
        <>The Pakistan-Afghanistan border is experiencing <mark>three simultaneous, mutually reinforcing instability vectors</mark><Cite id="07"/>: an interstate war along the Durand Line<Cite id="04"/>, an escalating separatist insurgency in Balochistan with expanding domain (maritime) and diversified international weapons supply<Cite id="01"/><Cite id="02"/>, and a nationwide TTP mobilisation order with transnational recruitment<Cite id="03"/>. These vectors compound one another: the Durand Line conflict provides TTP with operational cover, Balochistan separatists exploit the Army's two-front distraction, and all three erode state control over territory and borders<Cite id="07"/>.</>,
        <>External actor dynamics add further complexity. <mark>China is mediating but primarily motivated by CPEC corridor protection</mark><Cite id="04"/><Cite id="05"/>. Saudi Arabia has signed a mutual defence pact with Pakistan. Iran has recognised the Taliban government and offered mediation. Pakistan has explicitly accused Indian intelligence (RAW) of orchestrating terrorism through proxy networks<Cite id="03"/>. The information ecosystem spans 12+ Telegram channels, Discord servers, onion sites, and Pastebin in at least 7 languages, indicating global audience reach<Cite id="07"/>.</>,
        <><em>No de-escalation mechanism is currently visible on any of the three vectors.</em></>,
      ],
      recs: [
        <><strong>Maintain</strong> standing dark-web sweeps on BLA, TTP, and Durand Line with 72-hour refresh cycles. Tag cross-node spillover content to all relevant branches.</>,
        <><strong>Track</strong> weapons provenance indicators. The Belarus VSK-100 and US thermal optics warrant dedicated supply chain analysis via complementary OSINT sources.</>,
        <><strong>Monitor</strong> Afghan opposition fractures (NRF, Mohaqiq) as potential negotiation leverage points on the Durand Line dispute.</>,
        <><strong>Flag</strong> TTP transnational recruitment signals in Bangladesh and beyond for escalation to partner agencies.</>,
      ],
    },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Section renderers — one per typed card section
   ═══════════════════════════════════════════════════════════════════════════ */
const CardSection = ({ section }) => {
  const { type, h } = section;
  return (
    <div className="a-actor-section">
      <div className="a-actor-section-h">{h}</div>
      {type === "timeline" && (
        <div className="a-actor-timeline">
          {section.rows.map((row, i) => (
            <div key={i} className="a-actor-timeline-row">
              <span className="date">{row.date}</span>
              <span className="event">{row.event}</span>
            </div>
          ))}
        </div>
      )}
      {type === "ops" && (
        <div className="a-actor-ops">
          {section.rows.map((op, i) => (
            <div key={i} className="a-actor-ops-row">
              <span className="date">{op.date}</span>
              <span className="actor">{op.actor}</span>
              <span className="loc">{op.loc}</span>
              <span className="sig">{op.sig}</span>
            </div>
          ))}
        </div>
      )}
      {type === "arms" && (
        <ul className="a-actor-arms">
          {section.rows.map((w) => (
            <li key={w.origin}>
              <span className="origin">{w.origin}</span>
              <span className="items">{w.items}</span>
            </li>
          ))}
        </ul>
      )}
      {type === "quotes" && section.rows.map((q, i) => (
        <blockquote key={i} className="a-actor-quote">
          {q.quote}
          <cite>{q.cite}</cite>
        </blockquote>
      ))}
      {type === "analysis" && section.paras.map((p, i) => (
        <p key={i} className="a-actor-analysis">{p}</p>
      ))}
    </div>
  );
};

/* Live-stats rail counters — order and labels are fixed; values ramp with progress. */
const STAT_ROWS = [
  { key: "hits",     label: "Dark-web hits" },
  { key: "channels", label: "Channels" },
  { key: "sources",  label: "Sources swept" },
  { key: "langs",    label: "Languages" },
];

export const ShowcaseA = () => {
  const [invIdx, setInvIdx] = React.useState(0);
  const [phase, setPhase] = React.useState("idle"); // idle | typing | sweep | result | highlight | export
  const [typed, setTyped] = React.useState("");
  const [sweepStep, setSweepStep] = React.useState(0);
  const [highlightIdx, setHighlightIdx] = React.useState(-1);
  const [scale, setScale] = React.useState(1);
  const [clock, setClock] = React.useState("");

  const timers = React.useRef([]);
  const mainRef = React.useRef(null);
  const cardRefs = React.useRef({});   // id → node, keyed per active investigation
  const synthRef = React.useRef(null);

  const inv = INVESTIGATIONS[invIdx];
  const targets = [...inv.cards.map((c) => c.id), "synth"];

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (delay, fn) => { timers.current.push(setTimeout(fn, delay)); };

  // Scale the 1600×900 stage to fit the viewport (contain), re-measured on resize.
  React.useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1600, window.innerHeight / 900));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Live wall clock in the top bar.
  React.useEffect(() => {
    const tick = () => setClock(
      new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " UTC"
    );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (target) => {
    const main = mainRef.current;
    const node = target === "synth" ? synthRef.current : cardRefs.current[target];
    if (!main || !node) return;
    main.scrollTo({ top: node.offsetTop - 96, behavior: "smooth" });
  };

  // Choreograph one investigation, then advance to the next and re-run.
  const run = (idx) => {
    clearTimers();
    const cur = INVESTIGATIONS[idx];
    const cardIds = [...cur.cards.map((c) => c.id), "synth"];
    setPhase("typing");
    setTyped("");
    setSweepStep(0);
    setHighlightIdx(-1);
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "auto" });

    // 1 — type the query
    const q = cur.query;
    for (let i = 0; i <= q.length; i++) at(28 * i, () => setTyped(q.slice(0, i)));
    const typingDone = 28 * q.length + 700;

    // 2 — dark-web sweep: reveal source rows + ramp the stat counters
    at(typingDone, () => setPhase("sweep"));
    const stepMs = 850;
    cur.sweep.forEach((_, i) => at(typingDone + 300 + i * stepMs, () => setSweepStep(i + 1)));
    const sweepDone = typingDone + 300 + cur.sweep.length * stepMs + 600;

    // 3 — finding assembles; hold on the BLUF so it can be read
    at(sweepDone, () => setPhase("result"));

    // 4 — walk each deep-dive card, then the synthesis
    const walkStart = sweepDone + 5200;
    const dwell = 6200;
    cardIds.forEach((target, i) => {
      at(walkStart + i * dwell, () => {
        setPhase("highlight");
        setHighlightIdx(i);
        scrollTo(target);
      });
    });

    // 5 — export flourish, then advance + loop
    const exportAt = walkStart + cardIds.length * dwell + 800;
    at(exportAt, () => setPhase("export"));
    at(exportAt + 3200, () => {
      const next = (idx + 1) % INVESTIGATIONS.length;
      setInvIdx(next);
      run(next);
    });
  };

  // Autonomous loop — starts on mount, cleaned up on unmount. No IntersectionObserver
  // gate: on a dedicated TV route it's the only thing on screen, so it just runs.
  React.useEffect(() => {
    const start = setTimeout(() => run(0), 600);
    return () => { clearTimeout(start); clearTimers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showResult = phase === "result" || phase === "highlight" || phase === "export";
  const litTarget = highlightIdx >= 0 ? targets[highlightIdx] : null;
  const swept = showResult ? inv.sweep.length : sweepStep;
  const progress = swept / inv.sweep.length; // 0..1 across the sweep, 1 once resolved
  const statVal = (key) => Math.round(inv.stats[key] * progress);
  const stageLabel =
    phase === "idle" || phase === "typing" ? "Composing query"
    : phase === "sweep" ? "Sweeping indexed dark-web archives"
    : phase === "export" ? "Report exported" : "Finding assembled";
  const f = inv.finding;

  return (
    <div className="tv-viewport">
      <div className="tv-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>

        {/* ── Top bar ── */}
        <header className="tv-topbar">
          <div className="tv-brand">
            <SatorusMark size={20} color="var(--sidney-primary)"/>
            <span className="tv-brand-name">Satorus</span>
            <span className="tv-brand-div">/</span>
            <span className="tv-brand-product">Sidney</span>
          </div>
          <div className="tv-topbar-center">
            <span className="tv-live"><span className="tv-live-dot"/>Live intelligence</span>
            <span className="tv-topbar-sub">Dark-web sweep · read-only · 90-day window</span>
          </div>
          <div className="tv-topbar-right">
            <span className="tv-clock">{clock}</span>
            <span className="tv-classif">CONFIDENTIAL</span>
          </div>
        </header>

        {/* ── App body: sidebar · main · live rail ── */}
        <div className="tv-app">
          <aside className="tv-side">
            <div className="tv-side-group">Workspace</div>
            <div className="tv-side-item active"><Icon name="sparkle" size={16}/>Home</div>
            <div className="tv-side-item"><Icon name="search" size={16}/>Investigations<span className="tv-side-count warn">3</span></div>
            <div className="tv-side-item"><Icon name="file" size={16}/>Reports<span className="tv-side-count">18</span></div>
            <div className="tv-side-item"><Icon name="globe" size={16}/>Dark web<span className="tv-side-count ok">live</span></div>
            <div className="tv-side-item"><Icon name="network" size={16}/>Entities</div>
            <div className="tv-side-item"><Icon name="eye" size={16}/>Watchlists</div>
            <div className="tv-side-item"><Icon name="shield" size={16}/>Sources</div>

            <div className="tv-side-group" style={{ marginTop: 22 }}>Recent</div>
            <div className="tv-side-recent">
              <div className="tv-recent active"><span className="t">Pak-Afghan Border</span><span className="s">Now · Live</span></div>
              <div className="tv-recent"><span className="t">BLA Weapons Tracing</span><span className="s">6h · Review</span></div>
              <div className="tv-recent"><span className="t">TTP Nationwide Threat</span><span className="s">1d · Standing</span></div>
              <div className="tv-recent"><span className="t">Durand Line Crisis</span><span className="s">2d · Complete</span></div>
              <div className="tv-recent"><span className="t">Gwadar Maritime Watch</span><span className="s">3d · Standing</span></div>
            </div>

            <div className="tv-side-foot">
              <span className="tv-avatar">HM</span>
              <div className="tv-side-user"><span className="n">Harry M.</span><span className="o">Satorus · Analyst</span></div>
            </div>
          </aside>

          <main className="tv-main" ref={mainRef}>
            <div className="tv-main-inner">
              <div className="tv-greeting">Good morning, Harry.</div>
              <div className="tv-headline">Pick up where you left off, or start something new.</div>

              <div className={`a-cmdbar tv-cmdbar ${phase !== "idle" ? "focused" : ""}`}>
                <Icon name="sparkle" size={18}/>
                <div className={`a-cmdbar-text ${!typed ? "placeholder" : ""}`}>
                  {typed || "Start an investigation…"}
                  {phase === "typing" && <span className="caret"/>}
                </div>
                <div className="a-cmdbar-kbd"><span className="kbd">⌘</span><span className="kbd">↵</span></div>
              </div>
              <div className="a-demo-modes tv-modes">
                {inv.modes.map((m, i) => (
                  <span key={m} className={`a-demo-mode ${i === 0 ? "on" : ""}`}>{m}</span>
                ))}
              </div>

              {/* Dark-web sweep console */}
              {(phase === "sweep" || showResult) && (
                <div className="tv-sweep">
                  <div className="tv-sweep-head">
                    <span className="tv-sweep-title">
                      <span className={`tv-sweep-dot ${showResult ? "done" : ""}`}/>
                      {showResult ? "Sweep complete" : "Sweeping indexed dark-web archives"}
                    </span>
                    <span className="tv-sweep-meta">{swept}/{inv.sweep.length} sources · {statVal("hits")} hits</span>
                  </div>
                  <div className="tv-sweep-rows">
                    {inv.sweep.map((s, i) => {
                      const state = showResult || i < swept ? "done" : i === swept ? "curr" : "future";
                      return (
                        <div key={s.src} className={`tv-sweep-row ${state}`}>
                          <span className="tv-sweep-net">{s.net}</span>
                          <span className="tv-sweep-src">{s.src}</span>
                          <span className="tv-sweep-region">{s.region}</span>
                          <span className="tv-sweep-lang">{s.lang}</span>
                          <span className="tv-sweep-hits">{state === "future" ? "—" : `+${s.hits}`}</span>
                          <span className="tv-sweep-state">{state === "done" ? "indexed" : state === "curr" ? "scanning…" : ""}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BLUF finding */}
              {showResult && (
                <div className="a-finding reveal">
                  <div className="a-finding-head">
                    <span className="a-finding-pill">{f.pill}</span>
                    <div className="a-finding-title">{f.title}</div>
                    <span className="a-finding-conf">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`a-finding-pip ${i < f.confPips ? "on" : ""}`}/>
                      ))}
                      <span className="a-finding-pip-label">{f.confLabel}</span>
                    </span>
                  </div>

                  <div className="a-finding-meta">
                    {f.meta.map((m, i) => (
                      <span key={i} className="a-finding-meta-item">
                        {m.dot && <span className={`dot ${m.dot}`}/>}
                        {m.k && <span className="k">{m.k}</span>} {m.label || m.v}
                      </span>
                    ))}
                  </div>

                  <div className="a-finding-body">{f.body}</div>

                  <div className="a-finding-keys">
                    <div className="a-finding-keys-label">Key findings</div>
                    <ul>
                      {f.keyFindings.map((text, i) => (
                        <li key={i}>
                          <span className="bullet">{String(i + 1).padStart(2, "0")}</span>
                          <span>{text}<Cite id={String(i + 1).padStart(2, "0")}/></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="a-finding-entities">
                    {f.entities.map((group) => (
                      <div key={group.type} className="a-finding-entity-row">
                        <span className="a-finding-entity-k">{group.type}</span>
                        <div className="a-finding-entity-chips">
                          {group.items.map((item) => <span key={item} className="a-finding-chip">{item}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="a-finding-ev">
                    <div className="a-finding-ev-label">{f.evidenceLabel}</div>
                    {f.evidence.map((e, i) => (
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

              {/* Deep-dive cards */}
              {showResult && inv.cards.map((card) => (
                <div
                  key={card.id}
                  ref={(el) => { cardRefs.current[card.id] = el; }}
                  className={`a-actor-card reveal ${litTarget === card.id ? "highlighted" : ""}`}
                >
                  <div className="a-actor-head">
                    <span className={`a-actor-tag ${card.tag.kind}`}>{card.tag.label}</span>
                    <div className="a-actor-h">{card.title}</div>
                    <span className="a-actor-conf"><span className={`dot ${card.conf.dot === "warn" ? "warn" : ""}`}/>{card.conf.label}</span>
                  </div>
                  <div className="a-actor-meta">
                    {card.meta.map((m, i) => (
                      <span key={i}><span className="k">{m.k}</span> {m.v}</span>
                    ))}
                  </div>
                  {card.sections.map((section, i) => <CardSection key={i} section={section}/>)}
                </div>
              ))}

              {/* Synthesis & recommendations */}
              {showResult && (
                <div ref={synthRef} className={`a-synth-card reveal ${litTarget === "synth" ? "highlighted" : ""}`}>
                  <div className="a-synth-head">
                    <span className="a-synth-tag">{inv.synth.tag}</span>
                    <div className="a-synth-h">{inv.synth.title}</div>
                  </div>
                  {inv.synth.paras.map((p, i) => <p key={i} className="a-synth-body">{p}</p>)}
                  <div className="a-synth-recs">
                    <div className="a-synth-recs-h">Recommended monitoring posture</div>
                    <ol>
                      {inv.synth.recs.map((r, i) => (
                        <li key={i}><span className="bullet">{String(i + 1).padStart(2, "0")}</span><div>{r}</div></li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              <div className="tv-main-spacer" aria-hidden="true"/>
            </div>
          </main>

          {/* ── Live-stats rail ── */}
          <aside className="tv-rail">
            <div className="tv-rail-head">
              <span className="tv-rail-title">Live sweep</span>
              <span className={`tv-rail-status ${showResult ? "done" : "run"}`}>
                <span className="tv-rail-status-dot"/>{showResult ? "Resolved" : "Running"}
              </span>
            </div>

            <div className="tv-stats">
              {STAT_ROWS.map((s) => (
                <div key={s.key} className="tv-stat">
                  <span className="tv-stat-num">{statVal(s.key)}</span>
                  <span className="tv-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="tv-rail-block">
              <div className="tv-rail-block-h">Current stage</div>
              <div className="tv-rail-stage">
                <span className={`tv-rail-stage-dot ${showResult ? "done" : "run"}`}/>
                {stageLabel}
              </div>
            </div>

            <div className="tv-rail-block">
              <div className="tv-rail-block-h">Language mix</div>
              <div className="tv-langs">
                {inv.langs.map((x) => (
                  <div key={x.l} className="tv-lang">
                    <span className="tv-lang-l">{x.l}</span>
                    <span className="tv-lang-bar"><span className="tv-lang-fill" style={{ width: `${Math.min(100, progress * x.w * 3)}%` }}/></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tv-rail-block">
              <div className="tv-rail-block-h">Confidence</div>
              <div className="tv-conf">
                <span className={`tv-conf-seg ${progress > 0.15 ? "on low" : ""}`}/>
                <span className={`tv-conf-seg ${progress > 0.35 ? "on lowmod" : ""}`}/>
                <span className={`tv-conf-seg ${progress > 0.55 ? "on mod" : ""}`}/>
                <span className={`tv-conf-seg ${progress > 0.75 ? "on high" : ""}`}/>
                <span className={`tv-conf-seg ${progress >= 1 ? "on conf" : ""}`}/>
              </div>
              <div className="tv-conf-label">{progress >= 1 ? "Confirmed · cross-source verified" : "Aggregating…"}</div>
            </div>

            <div className="tv-rail-foot">
              <span>Latency</span>
              <span className="tv-rail-latency">{showResult ? "8.2s" : "—"}</span>
            </div>
          </aside>
        </div>

        {/* Export flourish */}
        <div className={`tv-export ${phase === "export" ? "show" : ""}`} aria-hidden="true">
          <span className="tv-export-icon"><Icon name="check" size={22}/></span>
          <span className="tv-export-text">Report exported · {inv.finding.keyFindings.length} findings · {inv.stats.hits} sources cited</span>
        </div>
      </div>
    </div>
  );
};
