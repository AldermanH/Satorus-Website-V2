/* Showcase content — the investigation the /showcase loop plays.
   ─────────────────────────────────────────────────────────────────────────
   Shaped after the product's report export (`report example.json`: title ·
   investigation_type · report_summary · report_detailed_analysis (markdown) ·
   geolocations · sources …) plus the structured visual blocks the pipeline
   emits alongside the prose (`src/report-blocks.js`), the reasoning graph the
   Graph tab renders, and the multimodal source cards the Sources tab renders.

   The Report tab renders `report_md` as the product does (## sections in
   collapsible boxes, [n] citations, confidence pills) and anchors each entry
   of `visuals` under the first ## heading that starts with `heading`.
   `stops` / `sourceStops` are the choreography: where the loop pauses while
   reading, for how long, and what it clicks there.

   To swap in a new report: replace the entries below.

   Content rule: geopolitical examples may use real report content; social
   posts are organisational / OSINT-aggregator output, never a profile of a
   private individual.                                                       */
import report from "../report example.json";
import { BLOCKS } from "./report-blocks.js";

const CABO = {
  id: "inv-2026-0714-cd",
  title: "Cabo Delgado Security & Political Risk: LNG Re-entry Assessment, 6–12 Months",
  investigation_type: "GEOPOLITICAL_ANALYSIS",
  profile: "geopolitical_crisis",
  generated: "Generated 14 July 2026 · 08:12 UTC",
  versionDate: "14 Jul 2026, 08:12",
  today: "2026-07-14",
  timeSaved: "≈ 21 hrs saved",
  query:
    "Assess the security and political risk environment in Cabo Delgado, Mozambique, for a European energy-services client considering re-entry to support LNG operations over the next 6–12 months.",

  /* Product stepper (lib/investigationProgress.ts) — weights drive the bar. */
  steps: [
    { key: "plan",     label: "Plan",     w: 8 },
    { key: "clarify",  label: "Clarify",  w: 5 },
    { key: "research", label: "Research", w: 22 },
    { key: "grade",    label: "Grade",    w: 5 },
    { key: "analyse",  label: "Analyse",  w: 35 },
    { key: "write",    label: "Write",    w: 24 },
  ],

  /* ── Reasoning graph (Graph tab · InvestigationGraph: React Flow + dagre LR) ──
     Node order = build order during the run. `step` = stepper step it belongs to. */
  graph: {
    nodes: [
      { id: "root", kind: "investigation", col: 0, row: 2.5, title: "Cabo Delgado LNG re-entry assessment", sub: "GEOPOLITICAL_ANALYSIS · 7 branches", step: 0 },
      { id: "b1", kind: "branch", col: 1, row: 0.4, meta: "14 src", title: "Insurgency trajectory — tempo, spread, strategic shift", step: 2 },
      { id: "b2", kind: "branch", col: 1, row: 1.8, meta: "9 src",  title: "Security-force posture and funding fragility", step: 2 },
      { id: "b3", kind: "branch", col: 1, row: 3.2, meta: "8 src",  title: "Pemba–Afungi logistics: road, maritime, air", step: 2 },
      { id: "b4", kind: "branch", col: 1, row: 4.6, meta: "5 src",  title: "Online and dark-web indicators", flag: "HIGH_STALENESS_RISK", step: 2 },
      { id: "e1", kind: "evidence", col: 3, row: 0,   grade: "A",  score: 91, title: "Cabo Delgado fortnightly update — early June 2026", domain: "acleddata.com", step: 3 },
      { id: "f1", kind: "finding",  col: 2, row: 0.7, meta: "3 cite", title: "ISM tempo steady at 10–12 events per fortnight", sub: "FACT · High", x: "−", step: 4 },
      { id: "e2", kind: "evidence", col: 3, row: 1.1, grade: "B+", score: 77, title: "N380 cement-truck ambush, Muidumbe", domain: "clubofmozambique.com", step: 3 },
      { id: "f2", kind: "finding",  col: 2, row: 1.7, meta: "3 cite", title: "Southward drift into the Ancuabe–Chiure arc", sub: "FACT · High", x: "+3", step: 4 },
      { id: "e3", kind: "evidence", col: 3, row: 2.2, grade: "A",  score: 89, title: "Mozambique relies on Rwanda's troops: what happens if they leave?", domain: "issafrica.org", step: 3 },
      { id: "c1", kind: "causal",   col: 2, row: 2.7, meta: "2 cite", title: "EPF funding lapse → RDF drawdown risk", sub: "Peace Facility tranche expired May 2026; bilateral terms undisclosed", step: 4 },
      { id: "e4", kind: "evidence", col: 3, row: 3.3, grade: "A",  score: 83, title: "Rwandan troops in Mozambique for solidarity, not money — Makolo", domain: "reuters.com", step: 3 },
      { id: "f3", kind: "finding",  col: 2, row: 3.7, meta: "3 cite", title: "N380 corridor is the highest-likelihood attack surface", sub: "ASSESSMENT · Medium", x: "−", step: 4 },
      { id: "e5", kind: "evidence", col: 3, row: 4.4, grade: "S",  title: "Al-Naba exclusive — spoils of the Namabo camp attack", domain: "x.com · @war_noir", step: 3 },
      { id: "f4", kind: "finding",  col: 2, row: 4.7, meta: "2 cite", title: "Al-Naba names foreign LNG operators as targets", sub: "FACT · Medium-High", x: "+1", step: 4 },
      { id: "e6", kind: "evidence", col: 3, row: 5.5, grade: "D",  title: "IS-mirror forum thread — Wilayah Muzambiq release", domain: "dark web · onion masked", step: 3 },
      { id: "s1", kind: "synthesis", col: 2, row: 5.6, title: "Synthesis", sub: "Enclave holds; the single point of failure is bilateral RDF funding", step: 5 },
    ],
    edges: [
      ["root", "b1"], ["root", "b2"], ["root", "b3"], ["root", "b4"],
      ["b1", "f1"], ["b1", "f2"], ["b2", "c1"], ["b3", "f3"], ["b4", "f4"],
      ["f1", "e1"], ["f2", "e2"], ["c1", "e3"], ["c1", "e4"], ["f3", "e2"], ["f4", "e5"], ["f4", "e6"],
      ["b1", "s1", "dashed"], ["b2", "s1", "dashed"], ["b3", "s1", "dashed"], ["b4", "s1", "dashed"],
    ],
  },

  /* Payload — straight from the export. */
  report_summary: report.report_summary,
  report_md: report.report_detailed_analysis,
  primary_entities: report.primary_entities,
  geolocations: report.geolocations,

  /* Structured blocks + where the writer anchored them. */
  blocks: {
    geo: { ...BLOCKS.geo, frame: { latN: -10.3, latS: -14.1, lngC: 40.55 }, popup: "Afungi peninsula (Mozambique LNG site)" },
    timeline: BLOCKS.timeline,
    scenarios: BLOCKS.scenarios,
    risk_matrix: BLOCKS.risk_matrix,
    phased_plan: BLOCKS.phased_plan,
    source_composition: {
      ...BLOCKS.source_composition,
      types: [
        { type: "news",    count: 57, extends_only: false },
        { type: "social",  count: 7,  extends_only: true },
        { type: "darkweb", count: 8,  extends_only: true },
      ],
    },
  },
  visuals: [
    { heading: "Insurgency Trajectory", block: "timeline",    label: "Timeline" },
    { heading: "Logistics Risk",        block: "geo",         label: "Operational picture" },
    { heading: "Outlook",               block: "scenarios",   label: "Scenario outlook" },
    { heading: "Outlook",               block: "risk_matrix", label: "Risk matrix" },
    { heading: "Outlook",               block: "phased_plan", label: "Phased roadmap" },
  ],

  /* Reading choreography — Report tab. */
  stops: [
    { at: "top",                    dwell: 2200 },
    { at: "sec:Key Judgments",      dwell: 2700 },
    { at: "sec:Situation Overview", dwell: 4200, click: 4 },
    { at: "vis:timeline",           dwell: 5000 },
    { at: "vis:geo",                dwell: 7800 },
    { at: "vis:scenarios",          dwell: 3000 },
    { at: "vis:risk_matrix",        dwell: 3000 },
    { at: "vis:phased_plan",        dwell: 2600 },
  ],
  /* Reading choreography — Sources tab. */
  sourceStops: [
    { at: "top",      dwell: 1600 },
    { at: "src:S1",   dwell: 4200, expand: "S1" },
    { at: "src:dark", dwell: 4800, hi: "D1" },
  ],

  /* ── News sources (graded) ── */
  sources: [
    { i: 4, name: "ACLED", title: "Cabo Delgado fortnightly conflict update — early June 2026", date: "12 Jun 2026", grade: "A", composite: 91, domain: "acleddata.com",
      factors: { "Factual reliability": 94, "Source authority": 95, "Bias & objectivity": 90, "Attribution quality": 86 }, bias: "CENTER", voice: "Data",
      insight: "Anchors the tempo (10–12 events per fortnight) and southward-drift findings; 11 events, eight dead in the fortnight." },
    { i: 22, name: "Institute for Security Studies", title: "Mozambique relies on Rwanda's troops to fight terrorism: what happens if they leave?", date: "14 Apr 2026", grade: "A", composite: 89, domain: "issafrica.org",
      factors: { "Factual reliability": 90, "Source authority": 92, "Bias & objectivity": 86, "Attribution quality": 88 }, bias: "CENTER", voice: "Analytical",
      insight: "Scenario analysis on Rwandan withdrawal options, including the limits of a Tanzanian backstop." },
    { i: 28, name: "Reuters", title: "Rwandan Troops in Mozambique for Solidarity, Not Money — Makolo", date: "03 Apr 2026", grade: "A", composite: 83, domain: "reuters.com",
      factors: { "Factual reliability": 85, "Source authority": 82, "Bias & objectivity": 80, "Attribution quality": 84 }, bias: "CENTER", voice: "Reporting",
      insight: "Kigali's public refusal to seek further EPF funds and the implicit invitation to LNG operators." },
    { i: 39, name: "Daily Maverick", title: "Blood Will Flow — oil giant Total's callous role in a Mozambican massacre", date: "19 Mar 2026", grade: "B+", composite: 77, domain: "dailymaverick.co.za",
      factors: { "Factual reliability": 78, "Source authority": 74, "Bias & objectivity": 68, "Attribution quality": 82 }, bias: "LEFT-CENTER", voice: "Investigative",
      insight: "Establishes TotalEnergies' financial arrangement with Mozambican forces and the legal-exposure baseline." },
    { i: 3, name: "Mozambique Exposed", title: "Insurgentes em Cabo Delgado continuam a ter financiamento próprio", date: "10 Jun 2026", grade: "A", composite: 81, domain: "mozambiqueexposed.org",
      factors: { "Factual reliability": 84, "Source authority": 78, "Bias & objectivity": 80, "Attribution quality": 83 }, bias: "CENTER", voice: "Investigative",
      insight: "Consortium finding that ISM is sustained primarily by local revenue — gold raids, KFR and mobile-money rails." },
    { i: 34, name: "AFP", title: "Mozambique troops kill at least 13 fishermen in insurgent-hit area", date: "17 Mar 2026", grade: "B", composite: 67, domain: "afp.com",
      factors: { "Factual reliability": 72, "Source authority": 70, "Bias & objectivity": 74, "Attribution quality": 58 }, bias: "CENTER", voice: "Reporting",
      insight: "Wire establishing the March 2026 fishermen-killing at the core of the friendly-force misidentification risk." },
  ],

  /* ── Social-media sources (multimodal media analysis) ── */
  social_note: "Public social-media posts; unverified and not independently corroborated. Engagement is not credibility.",
  social_sources: [
    {
      i: "S1", platform: "x", handle: "@war_noir", date: "2026-06-26",
      url: "https://x.com/war_noir/status/2070589931072737705",
      media: "image", verdict: "CAPTION CONSISTENT", verdictTone: "ok",
      summary: "Photograph of seized military weaponry and ammunition, including rifles and RPGs, laid on a black tarp outdoors.",
      assessment: "The image depicts the specific weapon types and location mentioned in the caption and Arabic text.",
      sections: [
        { h: "On-screen text", items: ["WAR NOIR", "خاص النبأ (EN: Al-Naba Exclusive)", "غنائم الهجوم على معسكر الجيش الموزمبيقي في قرية (نامابو) في (ماكوميا) (EN: Spoils of the attack on the Mozambican Army camp in the village of (Namabo) in (Macomia))"] },
        { h: "Visual", items: ["Array of 4 RPG-7 launchers with wooden grips.", "Multiple rows of green 82mm mortar bombs with tail fins.", "DZGI-40 HEI air-burst RPG projectiles and PG-7 variant warheads.", "Approximately 6 AK-pattern rifles and stacked magazines.", "Several long belts of machine gun ammunition.", "Al-Naba news graphic branding and 'WAR NOIR' watermark."] },
      ],
    },
    {
      i: "S2", platform: "telegram", handle: "@RoaaGroup", channel: "t.me/RoaaGroup · IS-mirror channel", date: "2026-05-06",
      url: "https://t.me/RoaaGroup/48213",
      media: "video", length: "0:46", verdict: "CLAIM UNVERIFIED", verdictTone: "warn", chips: ["12 keyframes", "Transcript AR → EN"],
      summary: "Handheld footage of a small armed group moving on foot along a dirt track through miombo woodland; IS-style branding overlay and nasheed audio track.",
      assessment: "Vegetation, road surface and roofing are consistent with Macomia district, but no unique landmark allows independent geolocation.",
      sections: [
        { h: "Transcript", items: ["[0:04] «By the grace of God the soldiers of the Caliphate attacked a barracks of the Mozambican army…»", "[0:31] «…the spoils were taken and the apostates fled into the bush.»"] },
        { h: "Keyframes", items: ["Armed group of 6–8, AK-pattern rifles, one PKM-type machine gun.", "Burning structure with corrugated roofing; no identifiable signage.", "Captured vehicle — Toyota pickup, registration plate obscured."] },
      ],
    },
    {
      i: "S3", platform: "telegram", handle: "@cabo_alerts", channel: "t.me/cabo_alerts · community repost (WhatsApp voice note)", date: "2026-06-19",
      url: "https://t.me/cabo_alerts/1187",
      media: "audio", length: "1:12", verdict: "CORROBORATING INDICATOR", verdictTone: "warn", chips: ["PT / Kimwani → EN", "2 speakers"],
      summary: "Voice note describing a stop on the N380 near Xitaxi; trucks reported turning back toward Pemba.",
      assessment: "Consistent with the 6 June EN380 ambush reporting [4]; speaker identity and recording time are unverified. Treated as a corroborating indicator, not evidence.",
      sections: [
        { h: "Transcript", items: ["[0:00] Speaker 1 — «They are at the crossing near Xitaxi since this morning, the trucks turned back.»", "[0:38] Speaker 2 — «The military passed at six, nobody has come after.»"] },
      ],
    },
  ],

  /* ── Dark-web sources ── */
  dark_note: "Dark-web retrieval via DarkOwl. Onion addresses are masked. Treated as organisational output, never independent observation.",
  dark_sources: [
    {
      i: "D1", forum: "IS-supporter forum · board: Africa", date: "2026-06-30", retrieved: "Retrieved 30 Jun 2026 · DarkOwl",
      thread: "Wilayah Muzambiq — new release (Namabo)", replies: 14,
      excerpt: "Re-post of the Al-Naba #549 spoils graphic with 14 replies; no operational detail beyond the published claim.",
      analysis: ["No mention of Afungi, TotalEnergies or any named European contractor.", "Content is IS organisational output mirrored, not independent observation.", "Coverage gap: Signal and closed Telegram groups are not indexed."],
    },
    {
      i: "D2", forum: "Marketplace listing · access broker", date: "2026-06-22", retrieved: "Retrieved 23 Jun 2026 · DarkOwl",
      thread: "Mozambique LNG contractor rosters — “site access” listing",
      excerpt: "Vendor offers purported contractor rosters and Afungi access documentation; the sample is a 2019 public tender PDF.",
      analysis: ["Sample matches a publicly available document — no evidence of a genuine breach.", "Flagged for the client's credential-exposure watch."],
    },
    {
      i: "D3", forum: "IS-supporter forum · board: Media", date: "2026-06-18", retrieved: "Retrieved 19 Jun 2026 · DarkOwl",
      thread: "Al-Naba #548 — Portuguese translation thread", replies: 6,
      excerpt: "Portuguese translation of the weekly with recruitment-facing framing of the Macomia operations.",
      analysis: ["Translation activity is a weak indicator of Lusophone audience targeting; no operational content."],
    },
    {
      i: "D4", forum: "Ransomware leak-site mirror", date: "2026-06-11", retrieved: "Retrieved 12 Jun 2026 · DarkOwl",
      thread: "Claimed exfiltration — Pemba-based transport contractor",
      excerpt: "Leak-site listing naming a Pemba logistics contractor; 2.1 GB sample, unverified.",
      analysis: ["Contractor sits in the N380 corridor supply chain; monitoring for credential spill affecting convoy scheduling."],
    },
    {
      i: "D5", forum: "IS-supporter forum · board: Africa", date: "2026-06-04", retrieved: "Retrieved 05 Jun 2026 · DarkOwl",
      thread: "Wilayah Muzambiq — Nangade claim (repost)", replies: 11,
      excerpt: "Repost of the 4 June claim with commentary; no new imagery or targeting language.",
      analysis: ["Consistent with the recorded 4 June event [4]; adds nothing beyond the published claim."],
    },
    {
      i: "D6", forum: "Credentials forum · combo lists", date: "2026-05-28", retrieved: "Retrieved 29 May 2026 · DarkOwl",
      thread: "Combo list — .co.mz domains (340 entries)",
      excerpt: "Credential combo list containing 340 .co.mz addresses; 0 matches against the client watchlist.",
      analysis: ["Negative result — retained for the exposure baseline only."],
    },
    {
      i: "D7", forum: "IS-supporter forum · board: Africa", date: "2026-05-20", retrieved: "Retrieved 21 May 2026 · DarkOwl",
      thread: "Quiterajo navy engagement — video re-upload", replies: 9,
      excerpt: "Re-upload of the RoaaGroup video with mirrored links; 9 replies, none adding detail.",
      analysis: ["Duplicate of [S2]; not counted as independent corroboration."],
    },
    {
      i: "D8", forum: "Paste site · onion mirror", date: "2026-05-14", retrieved: "Retrieved 15 May 2026 · DarkOwl",
      thread: "FADM unit rotations — alleged internal memo",
      excerpt: "Alleged FADM rotation memo in Portuguese; formatting inconsistent with genuine FADM documents.",
      analysis: ["Assessed likely fabricated; excluded from the force-posture assessment."],
    },
  ],
};

export const INVESTIGATIONS = [CABO];
