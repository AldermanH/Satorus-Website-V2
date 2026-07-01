/* Launch-event showcase — hidden route /showcase
   ─────────────────────────────────────────────────────────────────────────
   A fullscreen "presentation mode" attract loop for a TV at the launch event.
   Mirrors the REAL Sidney product UI (deep-navy enterprise theme, electric-cyan
   accent, Inter, 8px radius, report-glow reading surface, inline circular
   citations, confidence pills, A-D source-grade badges) — reference: the
   git-ignored sidney-staging repo (never shipped).

   The site-hero MeshGradient fills the viewport; a windowed, floating app frame
   sits on top of it. Authored on a fixed 1600×900 canvas, CSS-scaled to fit any
   screen; internal scrolling uses the panel's own coordinate space.

   INVESTIGATIONS cycle one after another:
     1. Cabo Delgado LNG re-entry (real report content)
     2. John Doe social investigation (synthetic — not a real person)

   Per-investigation choreography:
     home → query typed → pipeline stages → report renders → auto-scroll each
     section → (on the sources section) a cursor hovers rows to reveal the
     source-grading cards → next investigation → loop.                          */
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

/* Risk-tier badge for the outlook scenarios. */
const RiskBadge = ({ tier }) => <span className={`pv-tier ${tier.toLowerCase()}`}>{tier} risk</span>;

/* ═══════════════════════════════════════════════════════════════════════════
   INVESTIGATIONS
   ═══════════════════════════════════════════════════════════════════════════ */
const INVESTIGATIONS = [
  /* ── 1. Cabo Delgado — real report ── */
  {
    id: "cabo-delgado",
    type: "GEOPOLITICAL ANALYSIS",
    title: "Cabo Delgado Security & Political Risk: LNG Re-entry Assessment, 6–12 Months",
    query: "Assess the security and political risk environment in Cabo Delgado province, Mozambique, for a European energy services client considering re-entry to support LNG operations over the next 6 to 12 months.",
    written: "Generated 10 June 2026 · 09:41 UTC",
    timeSaved: "≈ 21 hrs saved",
    stats: { references: 75, geolocations: 12, entities: 6, risks: 12 },
    stages: [
      "Classifying investigation type",
      "Researching sources",
      "Querying news intelligence",
      "Monitoring dark-web channels",
      "Grading source quality",
      "Analysing findings",
      "Writing report",
    ],
    summary: (
      <>The Ahlu Sunnah Wal Jamaah / Islamic State Mozambique (ISM) insurgency is in a <mark>steady-state Phase 2</mark> — active, geographically widening, and structurally self-financed — but is not, on current evidence, capable of overrunning the hardened Afungi LNG enclave in the next 6–12 months<Cite n={4}/>. The single most consequential variable is the <mark>c.6,300-strong Rwandan contingent</mark> on which the perimeter rests; EU Peace Facility funding expired in May 2026 and continuation now depends on an opaque bilateral Mozambique–Rwanda arrangement<Cite n={17}/><Cite n={25}/>. Re-entry confined to the Afungi enclave and the Pemba–Afungi rotary-air bridge is <mark>Medium risk</mark>; sustained ground movement on the N380 and coastal-feeder corridors is <mark>High risk</mark><Cite n={39}/>. Overall analytic confidence is Medium.</>
    ),
    judgments: [
      { text: <>The Afungi LNG enclave will hold over the next 6–12 months absent a political shock to the Rwandan deployment. ISM retains freedom of movement to raid across a Chiure–Macomia–Ancuabe–Mocímboa arc and hijack coastal vessels, but has not demonstrated capability to take fortified ground; Mozambique LNG is 42% complete with 6,000+ workers on site<Cite n={4}/><Cite n={65}/>.</>, level: "Medium-High" },
      { text: <>The single point of failure is bilateral Mozambique–Rwanda funding for the c.6,300 RDF contingent. The EU Peace Facility tranche expired in May 2026; Brussels received no formal Rwandan renewal request; Maputo committed to fund the mission directly on undisclosed terms<Cite n={17}/><Cite n={24}/><Cite n={25}/>.</>, level: "High" },
      { text: <>The threat surface has widened southward and inland. Late-2025 saw the highest annual conflict displacement (339,000) since 2020; the April–May 2026 cluster in Ancuabe, Montepuez and Chiure now sits astride the inland N380 approach to Pemba<Cite n={9}/><Cite n={11}/><Cite n={40}/>.</>, level: "High" },
      { text: <>Re-entry confined to Afungi and the Pemba–Afungi rotary-air bridge is Medium risk; sustained ground movement on N380 and coastal feeders, or community-facing work outside the fence, is High risk. Legal exposure compounds kinetic risk through the live French TotalEnergies probe<Cite n={39}/><Cite n={41}/>.</>, level: "Medium" },
      { text: <>No observed signalling against Afungi or named European contractors in clearnet or dark-web channels; pan-jihadi Telegram traffic broadcasts Wilayah Muzambiq claims in parallel with DRC and Somalia output, but does not name LNG infrastructure<Cite n={"D1"}/><Cite n={"D2"}/>.</>, level: "Medium" },
    ],
    sections: [
      {
        id: "situation",
        h: "Situation Overview",
        blocks: [
          { t: "p", c: <>The conflict remains a Phase 2 active sub-state insurgency. ISM cannot hold population centres against the FADM–Rwandan stack, but retains freedom of movement in less-policed districts, sustains near-weekly rural raids, and is spreading laterally rather than concentrating to seize ground<Cite n={1}/><Cite n={2}/>. The TotalEnergies-led $20bn Mozambique LNG project formally re-launched construction on the Afungi peninsula on 29 January 2026, with first-LNG slipped to 2029<Cite n={51}/><Cite n={65}/>.</> },
          { t: "quote", c: "Sporadic attacks continue in Macomia, Muidumbe and Mocímboa da Praia and are conditioning movement of people and goods.", cite: "Defence Minister Cristóvão Chume · Mozambican Parliament · 6 May 2026" },
          { t: "p", c: <>Of 2,397 violent events logged since October 2017, roughly 92% involved ISM-linked elements, with a cumulative death toll of 6,624; the operational pattern spans three reinforcing modalities<Cite n={4}/>:</> },
          { t: "ul", c: [
            <><strong>Deep inland village raids</strong> — on 30 April 2026 militants assaulted Meza in Ancuabe, burning a 1946 parish and forcing civilians to hear extremist messaging<Cite n={5}/>.</>,
            <><strong>Road-axis ambushes</strong> — on 6 June 2026 fighters killed three farmers at Xitaxi–Chitunda along the EN380, one of the few paved roads in the region<Cite n={4}/>.</>,
            <><strong>Maritime predation</strong> — at least 12 boats hijacked off Mocímboa and Macomia in late May 2026, with ransoms extracted through Mozambican mobile-money rails<Cite n={4}/><Cite n={6}/>.</>,
          ] },
          { t: "conf", level: "High" },
        ],
      },
      {
        id: "posture",
        h: "Allied Force Posture & the Funding Cliff",
        blocks: [
          { t: "p", c: <>The Rwandan contingent now exceeds 6,300 personnel — roughly three times the c.2,000 originally deployed in July 2021 — concentrated around the Afungi perimeter and the Mocímboa da Praia hub, where analysts describe their primary function as <mark>protecting the gas projects</mark> rather than offensive counter-insurgency<Cite n={27}/><Cite n={28}/>. The European Peace Facility provided €40m across two tranches; that funding expired in May 2026, and the Commission has received no formal Rwandan request for renewal<Cite n={24}/><Cite n={25}/>.</> },
          { t: "p", c: <>Rwanda's posture hardened through March–April 2026: Foreign Minister Nduhungirehe stated Rwanda "will withdraw" absent sustainable financing, and spokesperson Makolo declared Kigali "has not and will not" seek further EPF funds — implicitly shifting the burden to Maputo and the European energy operators<Cite n={28}/><Cite n={30}/>. The proximate cause of non-renewal was not battlefield performance but EU and US sanctions on RDF officials over the M23 in eastern DRC<Cite n={25}/><Cite n={32}/>.</> },
          { t: "conf", level: "High" },
        ],
      },
      {
        id: "logistics",
        h: "Pemba–Afungi Logistics: Road, Maritime & Air",
        blocks: [
          { t: "p", c: <>The southward bleed of ISM activity now places the inland N380 approach to Pemba inside the active operating area for the first time at this intensity since 2022<Cite n={12}/><Cite n={40}/>. Three corridors carry differentiated risk:</> },
          { t: "risks", c: [
            { tier: "High", head: "Road — N380 inland approach", body: "Ancuabe–Montepuez–Chiure cluster sits astride the route through which TotalEnergies-bound logistics transit; opportunistic ambush / IED emplacement probability is materially raised." },
            { tier: "Medium", head: "Maritime — Pemba–Afungi sea lane", body: "Dominant risk is friendly-force misidentification and coastal predation, not Red Sea-style piracy or anti-ship threat — none of which is evidenced." },
            { tier: "Medium", head: "Air — Pemba–Afungi rotary bridge", body: "Functional 'vase clos' compound with its own airstrip; resilient but dependent on three single points of failure (Pemba airport, charter availability, JTF-held airstrip)." },
          ] },
        ],
      },
      {
        id: "outlook",
        h: "Risk-Tiered Outlook & Conditional Re-entry",
        blocks: [
          { t: "risks", c: [
            { tier: "Medium", head: "Most likely — Steady-state Phase 2", body: "ISM sustains dispersed raiding and maritime hijacking without breaching Afungi. Enclave + rotary-air bridge open to conditional re-entry under the JTF umbrella, subject to charter-backstop redundancy." },
            { tier: "High", head: "Downside — Rwandan funding falters", body: "Maputo–Kigali funding or a fresh DRC-sanctions escalation forces partial RDF drawdown; FADM cannot hold the vacuum. All postures move up one tier; defer re-entry." },
            { tier: "Medium", head: "Downside — Domestic unrest pulse", body: "A Mondlane Supreme Court conviction triggers nationwide unrest; the Pemba hub becomes High risk for the duration of the pulse (typically 2–6 weeks)." },
            { tier: "Low", head: "Tail — ISCAP technological diffusion", body: "Starlink / quadcopter ISR tactics demonstrated in the DRC reach ISM via the Al-Karrar / Tanzania conduit; the entire footprint moves to High risk." },
          ] },
          { t: "conf", level: "Medium" },
        ],
      },
    ],
    entities: {
      primary: [
        { name: "Ahlu Sunnah / IS-Mozambique (ISM)", role: "Phase 2 active sub-state insurgency; self-financed via mining raids, KFR and mobile-money rails" },
        { name: "Afungi LNG enclave", role: "Hardened 7,000-ha fenced project site; self-contained air-accessible 'vase clos'" },
        { name: "Rwanda Defence Force (RDF)", role: "c.6,300 contingent; single point of failure for the Afungi perimeter" },
        { name: "TotalEnergies", role: "Operator of the $20bn Mozambique LNG; live French manslaughter probe; JTF financing" },
      ],
      secondary: ["FADM / Mozambican Navy", "EUMAM MOZ", "President Daniel Chapo", "Venâncio Mondlane / Anamola", "ISCAP · Al-Karrar (Puntland)", "Eni — Coral Norte FLNG", "ExxonMobil — Rovuma LNG", "Lloyd's Joint War Committee"],
    },
    visual: {
      type: "map", label: "Geolocations", icon: "globe",
      pins: [
        { label: "Palma / Afungi", x: 80, y: 16, kind: "hq" },
        { label: "Mocímboa da Praia", x: 74, y: 27, kind: "incident" },
        { label: "Macomia", x: 68, y: 38, kind: "incident" },
        { label: "Meluco · Ravia mine", x: 60, y: 45, kind: "node" },
        { label: "Ancuabe", x: 58, y: 52, kind: "incident" },
        { label: "Montepuez", x: 46, y: 50, kind: "node" },
        { label: "Chiure", x: 52, y: 66, kind: "incident" },
        { label: "Pemba", x: 74, y: 56, kind: "hq" },
      ],
    },
    grades: { A: 14, "B+": 43, B: 14, C: 4 },
    gradeAvg: 74, profile: "geopolitical_crisis",
    sources: [
      { i: 22, name: "Institute for Security Studies", title: "Mozambique relies on Rwanda's troops to fight terrorism: what happens if they leave?", date: "14 Apr 2026", grade: "A", composite: 89,
        factors: { "Factual reliability": 90, "Source authority": 92, "Bias & objectivity": 86, "Attribution quality": 88 }, bias: "CENTER", voice: "Analytical",
        insight: "Scenario analysis on Rwandan withdrawal options, including the limits of a Tanzanian backstop." },
      { i: 28, name: "Reuters / Makolo statement", title: "Rwandan Troops in Mozambique for Solidarity, Not Money — Makolo", date: "03 Apr 2026", grade: "A", composite: 83,
        factors: { "Factual reliability": 85, "Source authority": 82, "Bias & objectivity": 80, "Attribution quality": 84 }, bias: "CENTER", voice: "Reporting",
        insight: "Kigali's public refusal to seek further EPF funds and the implicit invitation to LNG operators." },
      { i: 39, name: "Daily Maverick", title: "Blood Will Flow — oil giant Total's callous role in a Mozambican massacre", date: "19 Mar 2026", grade: "B+", composite: 77,
        factors: { "Factual reliability": 78, "Source authority": 74, "Bias & objectivity": 68, "Attribution quality": 82 }, bias: "LEFT-CENTER", voice: "Investigative",
        insight: "Establishes TotalEnergies' financial arrangement with Mozambican forces and the legal-exposure baseline." },
      { i: 34, name: "AFP", title: "Mozambique troops kill at least 13 fishermen in insurgent-hit area", date: "17 Mar 2026", grade: "B", composite: 67,
        factors: { "Factual reliability": 72, "Source authority": 70, "Bias & objectivity": 74, "Attribution quality": 58 }, bias: "CENTER", voice: "Reporting",
        insight: "Wire establishing the March 2026 fishermen-killing at the core of the friendly-force misidentification risk." },
      { i: 3, name: "Mozambique Exposed", title: "Insurgentes em Cabo Delgado continuam a ter financiamento próprio", date: "10 Jun 2026", grade: "A", composite: 81,
        factors: { "Factual reliability": 84, "Source authority": 78, "Bias & objectivity": 80, "Attribution quality": 83 }, bias: "CENTER", voice: "Investigative",
        insight: "Consortium finding that ISM is sustained primarily by local revenue — gold raids, KFR and mobile-money rails." },
      { i: 65, name: "BPCL / Times of India", title: "Mozambique LNG project has achieved 42% completion: BPCL", date: "07 May 2026", grade: "B", composite: 65,
        factors: { "Factual reliability": 70, "Source authority": 66, "Bias & objectivity": 64, "Attribution quality": 60 }, bias: "CENTER", voice: "Reporting",
        insight: "Disclosure of 42% completion and 6,000+ workers on the Afungi site." },
      { i: 75, name: "Regional analysis", title: "Middle East War Presents 'Serious Risk' for Africa, Warns Report", date: "04 Apr 2026", grade: "C", composite: 58,
        factors: { "Factual reliability": 60, "Source authority": 55, "Bias & objectivity": 62, "Attribution quality": 54 }, bias: "MIXED", voice: "Analytical",
        insight: "Global marine / war-risk premium-elevating cycle (>300% on affected routes) driven by Hormuz / Red Sea disruption." },
      { i: "D2", name: "@RoaaGroup · Telegram", title: "Wilayah Muzambiq claim — ISM engagement with a Mozambican navy patrol near Quiterajo beach", date: "06 May 2026", grade: "DARK", composite: null,
        factors: null, bias: "IS-mirror channel", voice: "Propaganda",
        insight: "Unverified. Treated as IS organisational output, not independent observation — DarkOwl coverage gaps on Signal apply." },
    ],
  },

  /* ── 2. John Doe — synthetic social investigation (not a real person) ── */
  {
    id: "john-doe",
    type: "SOCIAL INVESTIGATION",
    note: "Synthetic sample — not a real person",
    title: "Subject Profile — John Doe · Social & Open-Source Footprint",
    query: "Compile a social and open-source intelligence profile on the subject 'John Doe': resolve accounts and handles, map affiliations and network, and surface risk indicators.",
    written: "Generated 09 June 2026 · 16:40 UTC",
    timeSaved: "≈ 9 hrs saved",
    stats: { references: 38, geolocations: 9, entities: 5, risks: 4 },
    stages: [
      "Classifying investigation type",
      "Resolving identities & handles",
      "Collecting public posts",
      "Cross-referencing accounts",
      "Grading source reliability",
      "Compiling profile",
    ],
    summary: (
      <>Open-source collection on the subject resolves to a <mark>consistent cross-platform identity</mark> with a moderate public footprint, professional-services employment history, and no verified high-risk affiliations<Cite n={2}/><Cite n={7}/>. Handle re-use and a shared profile image link a primary professional account to two pseudonymous forum accounts at <mark>high confidence</mark><Cite n={1}/>. Two low-severity risk indicators are noted: an undisclosed advisory role and an adverse-media mention from a 2021 civil matter, since resolved<Cite n={9}/>.</>
    ),
    judgments: [
      { text: <>Identity resolution is robust: five accounts across six platforms share a handle stem, profile image and biographical markers, corroborated by mutual follow graphs<Cite n={1}/><Cite n={3}/>.</>, level: "High" },
      { text: <>Public footprint is professional and low-volume; content themes are industry commentary and conference activity, with no extremist, sanctioned or illicit-marketplace signals observed<Cite n={4}/>.</>, level: "Medium-High" },
      { text: <>One undisclosed advisory relationship to a competitor entity is inferable from event co-attendance and a shared address in registry filings — a potential conflict-of-interest flag<Cite n={6}/>.</>, level: "Medium" },
      { text: <>A single adverse-media hit (2021 civil dispute, dismissed) is the only derogatory result; no criminal record, no sanctions or PEP match<Cite n={9}/>.</>, level: "Medium" },
    ],
    sections: [
      {
        id: "identity",
        h: "Identity Resolution",
        blocks: [
          { t: "p", c: <>The subject is resolved across six platforms via a common handle stem (<mark>jdoe / j.doe / johndoe</mark>), a re-used profile image (perceptual-hash match), and consistent biographical markers (employer, city, alma mater)<Cite n={1}/><Cite n={3}/>. Two pseudonymous forum accounts are linked at high confidence through writing-style and posting-time overlap<Cite n={1}/>.</> },
          { t: "conf", level: "High" },
        ],
      },
      {
        id: "footprint",
        h: "Digital Footprint",
        blocks: [
          { t: "p", c: <>Activity is low-volume and professional. The dominant content themes are industry commentary, conference attendance and open-source contributions; no extremist, sanctioned-entity or illicit-marketplace association was observed in the collection window<Cite n={4}/><Cite n={5}/>.</> },
          { t: "ul", c: [
            <>Primary professional account: ~1,900 connections, posts monthly, sector = energy advisory<Cite n={2}/>.</>,
            <>Developer account: sporadic public commits, no sensitive credential exposure detected<Cite n={5}/>.</>,
            <>Forum accounts: technical discussion; benign sentiment, no coordination signals<Cite n={1}/>.</>,
          ] },
        ],
      },
      {
        id: "network",
        h: "Network & Associations",
        blocks: [
          { t: "p", c: <>The association graph centres on a professional cluster (current and former employers) with a secondary academic cluster. One edge — co-attendance plus a shared registry address — suggests an <mark>undisclosed advisory link</mark> to a competitor entity, surfaced here as a conflict-of-interest flag rather than a confirmed relationship<Cite n={6}/>.</> },
          { t: "conf", level: "Medium" },
        ],
      },
      {
        id: "risk",
        h: "Risk Indicators",
        blocks: [
          { t: "risks", c: [
            { tier: "Low", head: "Adverse media", body: "One 2021 civil dispute, dismissed; no ongoing litigation, no criminal record." },
            { tier: "Low", head: "Sanctions / PEP", body: "No match against consolidated sanctions or politically-exposed-person lists." },
            { tier: "Medium", head: "Conflict of interest", body: "Inferred undisclosed advisory role to a competitor entity — recommend direct disclosure request." },
            { tier: "Low", head: "Credential exposure", body: "No breached credentials tied to the resolved accounts in monitored dumps." },
          ] },
        ],
      },
    ],
    entities: {
      primary: [
        { name: "@johndoe (professional)", role: "Primary account; ~1,900 connections; energy-advisory sector" },
        { name: "j.doe (developer)", role: "Public code contributions; no credential exposure" },
        { name: "jdoe_77 (forum)", role: "Pseudonymous; linked at high confidence by style + timing" },
        { name: "Meridian Advisory Ltd", role: "Stated current employer; registry-confirmed director listing" },
      ],
      secondary: ["Northbridge Energy (former)", "St. Aldate's University (alumnus)", "Competitor entity — inferred", "City: Manchester, UK", "2021 civil matter (dismissed)"],
    },
    visual: {
      type: "network", label: "Association network", icon: "network",
      center: { label: "John Doe", x: 50, y: 50 },
      nodes: [
        { label: "@johndoe", x: 24, y: 24, kind: "hq" },
        { label: "j.doe", x: 78, y: 22, kind: "node" },
        { label: "jdoe_77", x: 84, y: 58, kind: "node" },
        { label: "Meridian Advisory", x: 62, y: 84, kind: "hq" },
        { label: "Northbridge (former)", x: 30, y: 80, kind: "node" },
        { label: "Competitor — inferred", x: 16, y: 54, kind: "incident" },
      ],
    },
    grades: { A: 6, "B+": 12, B: 14, C: 6 },
    gradeAvg: 68, profile: "person_osint",
    sources: [
      { i: 2, name: "Professional network (LinkedIn-class)", title: "Public profile — employment history, connections, endorsements", date: "08 Jun 2026", grade: "A", composite: 84,
        factors: { "Factual reliability": 86, "Source authority": 88, "Bias & objectivity": 82, "Attribution quality": 80 }, bias: "SELF-REPORTED", voice: "Primary",
        insight: "Anchor for identity resolution — employer, sector and connection graph." },
      { i: 1, name: "Handle-linkage engine", title: "Cross-platform handle + perceptual-hash image match", date: "08 Jun 2026", grade: "B+", composite: 74,
        factors: { "Factual reliability": 76, "Source authority": 70, "Bias & objectivity": 78, "Attribution quality": 72 }, bias: "N/A", voice: "Derived",
        insight: "Links the professional account to two pseudonymous forum accounts via style + timing overlap." },
      { i: 9, name: "Adverse-media index", title: "2021 civil dispute filing (dismissed) — court record aggregation", date: "07 Jun 2026", grade: "B", composite: 66,
        factors: { "Factual reliability": 70, "Source authority": 64, "Bias & objectivity": 68, "Attribution quality": 62 }, bias: "COURT RECORD", voice: "Primary",
        insight: "Only derogatory result; matter dismissed, no ongoing exposure." },
      { i: 6, name: "Corporate registry", title: "Director listings + shared registered address (Meridian / competitor)", date: "06 Jun 2026", grade: "B+", composite: 72,
        factors: { "Factual reliability": 80, "Source authority": 76, "Bias & objectivity": 74, "Attribution quality": 66 }, bias: "OFFICIAL", voice: "Primary",
        insight: "Basis for the inferred conflict-of-interest edge in the association network." },
      { i: 5, name: "Code-hosting profile", title: "Public commit history + org membership", date: "08 Jun 2026", grade: "B", composite: 63,
        factors: { "Factual reliability": 68, "Source authority": 60, "Bias & objectivity": 66, "Attribution quality": 58 }, bias: "SELF-REPORTED", voice: "Primary",
        insight: "Confirms the developer account; no sensitive credential exposure detected." },
      { i: 14, name: "Breach-monitoring feed", title: "Credential-exposure lookup across monitored dumps", date: "05 Jun 2026", grade: "C", composite: 56,
        factors: { "Factual reliability": 58, "Source authority": 52, "Bias & objectivity": 60, "Attribution quality": 54 }, bias: "AGGREGATOR", voice: "Derived",
        insight: "No breached credentials tied to the resolved accounts — negative-result source, lower weight." },
    ],
  },
];

/* Section-block renderer. */
const Block = ({ b }) => {
  if (b.t === "p") return <p>{b.c}</p>;
  if (b.t === "conf") return <div className="pv-inline-conf"><Confidence level={b.level}/></div>;
  if (b.t === "quote") return <blockquote>{b.c}<cite>{b.cite}</cite></blockquote>;
  if (b.t === "ul") return <ul>{b.c.map((li, j) => <li key={j}>{li}</li>)}</ul>;
  if (b.t === "ol") return <ol>{b.c.map((li, j) => <li key={j}>{li}</li>)}</ol>;
  if (b.t === "risks") return (
    <div className="pv-tiers">
      {b.c.map((r, j) => (
        <div key={j} className={`pv-tier-card ${r.tier.toLowerCase()}`}>
          <div className="pv-tier-top"><RiskBadge tier={r.tier}/><span className="pv-tier-head">{r.head}</span></div>
          <p className="pv-tier-body">{r.body}</p>
        </div>
      ))}
    </div>
  );
  return null;
};

export const ShowcaseA = () => {
  const [invIdx, setInvIdx] = React.useState(0);
  const [phase, setPhase] = React.useState("idle"); // idle | typing | running | report
  const [typed, setTyped] = React.useState("");
  const [stageIdx, setStageIdx] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [activeSection, setActiveSection] = React.useState(null);
  const [hoverSrc, setHoverSrc] = React.useState(null);
  const [cursor, setCursor] = React.useState({ x: 0, y: 0, show: false });
  const [scale, setScale] = React.useState(1);
  const [meshOn, setMeshOn] = React.useState(true);

  const timers = React.useRef([]);
  const mainRef = React.useRef(null);
  const secRefs = React.useRef({});
  const srcRefs = React.useRef({});

  const inv = INVESTIGATIONS[invIdx];
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (d, fn) => { timers.current.push(setTimeout(fn, d)); };

  React.useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1600, window.innerHeight / 900));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

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

  // Point the fake cursor at a source row (viewport coords — cursor lives outside the scaled stage).
  const cursorToSource = (key) => {
    const node = srcRefs.current[key];
    if (!node) return;
    const r = node.getBoundingClientRect();
    setCursor({ x: r.left + 54, y: r.top + 22, show: true });
  };

  const run = (idx) => {
    clearTimers();
    const cur = INVESTIGATIONS[idx];
    setPhase("idle"); setTyped(""); setStageIdx(0); setProgress(0);
    setActiveSection(null); setHoverSrc(null); setCursor({ x: 0, y: 0, show: false });
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "auto" });

    // 1 — type the query
    at(900, () => setPhase("typing"));
    const q = cur.query;
    for (let i = 0; i <= q.length; i++) at(900 + 22 * i, () => setTyped(q.slice(0, i)));
    const typingDone = 900 + 22 * q.length + 700;

    // 2 — pipeline stages
    at(typingDone, () => { setPhase("running"); setStageIdx(0); setProgress(4); });
    const stageMs = 1000;
    cur.stages.forEach((_, i) => {
      at(typingDone + i * stageMs, () => { setStageIdx(i); setProgress(Math.round(((i + 0.5) / cur.stages.length) * 100)); });
    });
    const runningDone = typingDone + cur.stages.length * stageMs + 500;
    at(runningDone - 350, () => setProgress(100));

    // 3 — report renders; auto-scroll each section
    at(runningDone, () => setPhase("report"));
    const anchors = ["top", "summary", "judgments", ...cur.sections.map((s) => s.id), "entities", "geo", "sources"];
    const dwellFor = (id) => (id === "sources" ? 8600 : id === "top" ? 2600 : 4600);
    let t = runningDone + 900;
    anchors.forEach((id) => {
      at(t, () => {
        setActiveSection(id);
        setHoverSrc(null); setCursor((c) => ({ ...c, show: false }));
        if (id === "top") { if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" }); }
        else scrollToSection(id);
      });
      // 4 — on the sources section, drive the cursor across two rows to reveal grading cards
      if (id === "sources") {
        const rows = cur.sources;
        const a = rows[0]?.i, b = rows[1]?.i;
        at(t + 1400, () => { cursorToSource(a); });
        at(t + 1750, () => setHoverSrc(a));
        at(t + 4600, () => { setHoverSrc(null); cursorToSource(b); });
        at(t + 4950, () => setHoverSrc(b));
        at(t + 7800, () => { setHoverSrc(null); setCursor((c) => ({ ...c, show: false })); });
      }
      t += dwellFor(id);
    });

    // 5 — advance to the next investigation, loop
    at(t + 1400, () => { const next = (idx + 1) % INVESTIGATIONS.length; setInvIdx(next); run(next); });
  };

  React.useEffect(() => {
    const start = setTimeout(() => run(0), 500);
    return () => { clearTimeout(start); clearTimers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showReport = phase === "report";
  const v = inv.visual;

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

          <div className="pv-chrome">
            <div className="pv-lights"><span/><span/><span/></div>
            <div className="pv-urlbar"><Icon name="lock" size={11}/> app.sidney.satorusgroup.com<span className="pv-url-path">/investigations</span></div>
          </div>

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
                <span className="pv-avatar">HA</span>
                <div className="pv-side-user"><span className="n">Harry Alderman</span><span className="o">Satorus</span></div>
              </div>
            </aside>

            <main className="pv-main" ref={mainRef}>
              <div className="pv-doc">
                <div className="pv-back"><Icon name="arrow" size={13} className="pv-back-arrow"/> Investigations</div>
                <div className="pv-doc-head"><h1 className="pv-doc-title">{inv.title}</h1></div>
                <div className="pv-doc-meta">
                  <span className={`pv-status ${showReport ? "final" : "inv"}`}>
                    <span className="pv-status-dot"/>{showReport ? "Finalised" : "Investigating"}
                  </span>
                  <span className="pv-meta-x">{inv.type}</span>
                  <span className="pv-meta-x">{inv.written}</span>
                  <span className="pv-meta-x">{inv.stats.references} sources</span>
                  {inv.note && <span className="pv-meta-note">{inv.note}</span>}
                </div>

                <div className="pv-tabs">
                  <span className="pv-tab active">Report</span>
                  <span className="pv-tab">Sources</span>
                  <span className="pv-tab">Dossier</span>
                  <span className="pv-tab">Thread</span>
                </div>

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
                          <span className="pv-progress-label"><span className="pv-spin"/>{inv.stages[stageIdx]}…</span>
                          <span className="pv-progress-pct">{progress}%</span>
                        </div>
                        <div className="pv-progress-track"><span className="pv-progress-fill" style={{ width: `${progress}%` }}/></div>
                        <div className="pv-stagelist">
                          {inv.stages.map((s, i) => (
                            <div key={s} className={`pv-stage ${i < stageIdx ? "done" : i === stageIdx ? "curr" : ""}`}>
                              <span className="pv-stage-dot"/>{s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {showReport && (
                  <div className="pv-report">
                    <span className="pv-timesaved"><Icon name="zap" size={12}/>{inv.timeSaved}</span>

                    <section ref={(el) => (secRefs.current.summary = el)} className={`pv-sec ${activeSection === "summary" ? "focus" : ""}`}>
                      <div className="pv-sec-label">Executive summary</div>
                      <p className="pv-lead">{inv.summary}</p>
                    </section>

                    <section ref={(el) => (secRefs.current.judgments = el)} className={`pv-sec pv-box ${activeSection === "judgments" ? "focus" : ""}`}>
                      <div className="pv-box-h"><Icon name="crosshair" size={14}/> Key judgments</div>
                      <ul className="pv-judgments">
                        {inv.judgments.map((j, i) => (
                          <li key={i}>
                            <span className="pv-j-num">{String(i + 1).padStart(2, "0")}</span>
                            <div className="pv-j-body"><p>{j.text}</p><Confidence level={j.level}/></div>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {inv.sections.map((sec) => (
                      <section key={sec.id} ref={(el) => (secRefs.current[sec.id] = el)} className={`pv-sec pv-box ${activeSection === sec.id ? "focus" : ""}`}>
                        <div className="pv-box-h">{sec.h}</div>
                        <div className="pv-prose">{sec.blocks.map((b, i) => <Block key={i} b={b}/>)}</div>
                      </section>
                    ))}

                    <section ref={(el) => (secRefs.current.entities = el)} className={`pv-sec pv-box ${activeSection === "entities" ? "focus" : ""}`}>
                      <div className="pv-box-h"><Icon name="network" size={14}/> Entities</div>
                      <div className="pv-ent-label">Primary</div>
                      <div className="pv-ent-list">
                        {inv.entities.primary.map((e) => (
                          <div key={e.name} className="pv-ent">
                            <span className="pv-ent-name">{e.name}</span>
                            <span className="pv-ent-role">{e.role}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pv-ent-label" style={{ marginTop: 16 }}>Secondary</div>
                      <div className="pv-ent-chips">
                        {inv.entities.secondary.map((s) => <span key={s} className="pv-chip">{s}</span>)}
                      </div>
                    </section>

                    <section ref={(el) => (secRefs.current.geo = el)} className={`pv-sec pv-box ${activeSection === "geo" ? "focus" : ""}`}>
                      <div className="pv-box-h"><Icon name={v.icon} size={14}/> {v.label} <span className="pv-box-count">{inv.stats.geolocations}</span></div>
                      <div className="pv-map">
                        <div className="pv-map-grid" aria-hidden="true"/>
                        {v.type === "network" && (
                          <svg className="pv-net-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            {v.nodes.map((n, i) => (
                              <line key={i} x1={v.center.x} y1={v.center.y} x2={n.x} y2={n.y}/>
                            ))}
                          </svg>
                        )}
                        {v.type === "network" && (
                          <div className="pv-pin center" style={{ left: `${v.center.x}%`, top: `${v.center.y}%` }}>
                            <span className="pv-pin-dot"/><span className="pv-pin-label strong">{v.center.label}</span>
                          </div>
                        )}
                        {(v.pins || v.nodes).map((g, i) => (
                          <div key={i} className={`pv-pin ${g.kind}`} style={{ left: `${g.x}%`, top: `${g.y}%` }}>
                            <span className="pv-pin-ring"/><span className="pv-pin-dot"/>
                            <span className="pv-pin-label">{g.label}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section ref={(el) => (secRefs.current.sources = el)} className={`pv-sec pv-box ${activeSection === "sources" ? "focus" : ""}`}>
                      <div className="pv-box-h"><Icon name="newspaper" size={14}/> Graded sources <span className="pv-box-count">{inv.stats.references}</span></div>
                      <div className="pv-grade-dist">
                        {Object.entries(inv.grades).map(([g, n]) => (
                          <span key={g} className="pv-grade-dist-item"><Grade g={g}/><span className="pv-grade-n">{n}</span></span>
                        ))}
                        <span className="pv-grade-avg">avg {inv.gradeAvg} · profile: {inv.profile}</span>
                      </div>
                      <div className="pv-src-list">
                        {inv.sources.map((s) => (
                          <div
                            key={s.i}
                            ref={(el) => (srcRefs.current[s.i] = el)}
                            className={`pv-src ${hoverSrc === s.i ? "hover" : ""}`}
                          >
                            <span className="pv-src-i">{s.i}</span>
                            <div className="pv-src-body">
                              <div className="pv-src-top">
                                <span className="pv-src-name">{s.name}</span>
                                {s.grade === "DARK"
                                  ? <span className="pv-grade dark">UNVERIFIED</span>
                                  : <Grade g={s.grade}/>}
                                <span className="pv-src-date">{s.date}</span>
                              </div>
                              <div className="pv-src-title">{s.title}</div>
                              <div className="pv-src-insight">{s.insight}</div>
                            </div>

                            {/* Source-grading logic card, revealed on hover */}
                            {hoverSrc === s.i && (
                              <div className="pv-gradecard">
                                <div className="pv-gc-head">
                                  <span className="pv-gc-name">{s.name}</span>
                                  {s.grade === "DARK"
                                    ? <span className="pv-grade dark">UNVERIFIED</span>
                                    : <span className="pv-gc-score"><Grade g={s.grade}/><b>{s.composite}</b><i>/100</i></span>}
                                </div>
                                {s.factors ? (
                                  <div className="pv-gc-factors">
                                    {Object.entries(s.factors).map(([k, val]) => (
                                      <div key={k} className="pv-gc-factor">
                                        <span className="pv-gc-fk">{k}</span>
                                        <span className="pv-gc-bar"><span className="pv-gc-fill" style={{ width: `${val}%` }}/></span>
                                        <span className="pv-gc-fv">{val}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="pv-gc-dark">Dark-web retrieval · no independent corroboration. Treated as IS organisational output.</div>
                                )}
                                <div className="pv-gc-tags">
                                  <span className="pv-gc-tag"><em>Bias</em>{s.bias}</span>
                                  <span className="pv-gc-tag"><em>Voice</em>{s.voice}</span>
                                </div>
                              </div>
                            )}
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

      {/* Fake presentation cursor (lives outside the scaled stage → viewport coords) */}
      <div className={`pv-cursor ${cursor.show ? "show" : ""}`} style={{ left: cursor.x, top: cursor.y }} aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 3l14 7-6 1.5-2.2 6z" fill="#fff" stroke="#0a0f1a" strokeWidth="1.3" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
};
