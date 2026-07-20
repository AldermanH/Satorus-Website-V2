/* Structured visualisation blocks — /report-viz prototype
   ─────────────────────────────────────────────────────────────────────────
   These are the JSON blocks the Sidney pipeline would emit alongside the
   prose report (same pattern as the existing `geolocations` array — the only
   structured block the pipeline emits today). The renderer treats them as
   deterministic inputs: fixed templates, no per-report design variation.

   Every block carries a `provenance` flag for honesty in the demo:
     "payload"  — present in `report example.json` verbatim
     "derived"  — computable from the payload with no pipeline change
     "authored" — hand-written for this prototype from the report's prose;
                  in production the writer agent emits it (new `write_report`
                  params in backend/src/graph/tools/writer.py)

   All content is drawn from the Cabo Delgado report ("report example.json").
   Probability bands, risk scores and tier gates are analyst-style
   illustrations consistent with the report text — the report itself grades
   the baseline trajectory "Medium confidence" and leaves triggers to the
   client, so numbers here are for demonstrating the component contract. */

export const REPORT_META = {
  // The payload has no generation timestamp; latest event cited is 9 Jul 2026.
  generated: "2026-07-14",
  generatedLabel: "Generated 14 July 2026 · 08:12 UTC",
};

export const BLOCKS = {
  /* ── 1. Scenario outlook ─────────────────────────────────────────────── */
  scenarios: {
    block: "scenarios",
    provenance: "authored",
    horizon: "6–12 months",
    items: [
      {
        name: "Baseline: managed instability",
        p_low: 55, p_high: 60,
        severity: "baseline",
        orthogonal: false,
        summary:
          "Continued low-to-medium tempo (~10–12 events/fortnight), dry-season spikes, southward expeditions; enclave holds under the RDF umbrella.",
        indicators: [
          "ACLED events under 15 per fortnight",
          "No incident inside Palma district",
          "Rwandan posture and basing unchanged",
          "Displacement flows below June 2026 peak",
        ],
      },
      {
        name: "Downside: security-architecture erosion",
        p_low: 20, p_high: 25,
        severity: "downside",
        orthogonal: false,
        summary:
          "Bilateral RDF funding falters or a drawdown begins; FADM cannot hold the vacuum; corridor ambush and IED tempo rises across the arc.",
        indicators: [
          "RDF rotation, drawdown or basing change",
          "September Joint Commission yields Russian equipment deal",
          "EUMAM-MOZ lapses without successor after 31 Dec 2026",
        ],
      },
      {
        name: "Upside: consolidation & commercial unlock",
        p_low: 10, p_high: 15,
        severity: "upside",
        orthogonal: false,
        summary:
          "Total dispute settles, Exxon FID lands on time, tempo declines through the wet season; services demand broadens beyond the enclave.",
        indicators: [
          "Development plan approved / dispute settled",
          "Exxon Rovuma FID confirmed in September",
          "IMF programme agreed on manageable terms",
        ],
      },
      {
        name: "Tail: mass-casualty resurgence",
        p_low: 5, p_high: 10,
        severity: "tail",
        orthogonal: false,
        summary:
          "Return to the 2020–2022 phase: a set-piece assault on a district town or the Palma–Afungi perimeter; report judges this low-to-moderate.",
        indicators: [
          "Any incident inside Palma district",
          "Fighter-strength signals trending to upper (~3,000) bound",
          "Propaganda naming European contractors or personnel",
        ],
      },
      {
        name: "Reputational-legal crystallisation",
        p_low: 30, p_high: 40,
        severity: "downside",
        orthogonal: true,
        summary:
          "ECCHR complaint or consortium reporting escalates into formal proceedings or insurer/regulator action — can occur under any security scenario.",
        indicators: [
          "French criminal complaint advances to instruction",
          "New Forbidden Stories / UNFPA publication cycle",
          "Insurer or home-regulator due-diligence demands",
        ],
      },
    ],
  },

  /* ── 2. Timeline ─────────────────────────────────────────────────────── */
  timeline: {
    block: "timeline",
    provenance: "authored", // every event is dated in the report prose
    window: { start: "2026-01-01", end: "2027-01-31" },
    events: [
      { date: "2026-01-29", label: "Onshore construction restart at Afungi", category: "commercial" },
      { date: "2026-04-14", label: "10 Tanzanian insurgents captured, Nangade", category: "security" },
      { date: "2026-04-26", label: "Ravia gemstone mine raid, Meluco", category: "security" },
      { date: "2026-04-30", label: "Meza village assault, Ancuabe", category: "security" },
      { date: "2026-05-20", label: "Fishing vessels seized off Pangane", category: "security" },
      { date: "2026-05-25", label: "Mortar attack on military position, Macomia", category: "security" },
      { date: "2026-05-31", label: "EU Peace Facility funding for RDF ends", category: "political" },
      { date: "2026-06-10", label: "IOM: 21,658 displaced from Ancuabe", category: "humanitarian" },
      { date: "2026-06-18", label: "Insurgent movement on N14, Chiure–Quissanga", category: "security" },
      { date: "2026-07-03", label: "N380 cement-truck ambush, Muidumbe", category: "security" },
      { date: "2026-07-07", label: "IS claims attack on FADM personnel", category: "security" },
      { date: "2026-07-09", label: "Russian offer of military assistance, Maputo", category: "political" },
    ],
    forward_triggers: [
      { date: "2026-09", precision: "month", label: "Mozambique–Russia Joint Commission", category: "political" },
      { date: "2026-09", precision: "month", label: "Expected ExxonMobil Rovuma FID", category: "commercial" },
      { date: "2026-12-31", precision: "day", label: "EUMAM-MOZ mandate expiry", category: "political" },
      { date: null, precision: "undated", label: "Total–Mozambique cost-dispute resolution", window: "inside 6–12 month horizon", category: "commercial" },
      { date: null, precision: "undated", label: "IMF programme decision", window: "inside 6–12 month horizon", category: "commercial" },
    ],
    bands: [
      { from: "2026-06-01", to: "2026-10-31", label: "Dry-season spike window", category: "security" },
    ],
  },

  /* ── 3. Risk matrix ──────────────────────────────────────────────────── */
  risk_matrix: {
    block: "risk_matrix",
    provenance: "authored", // labels/summaries condensed from payload risk_factors[]
    scale: { likelihood: [1, 5], impact: [1, 5] },
    risks: [
      { id: "R1",  label: "Corridor ambush & IED (N380/N14)",   likelihood: 4, impact: 4,
        summary: "Inland ambush, IED emplacement and extortion on the Pemba–Afungi road corridor — highest-likelihood physical threat." },
      { id: "R2",  label: "Coastal small-boat raiding",          likelihood: 3, impact: 3,
        summary: "Vessel hijack-for-ransom along the northern coastline; no dedicated naval patrol in the Channel." },
      { id: "R3",  label: "RDF funding cliff",                   likelihood: 2, impact: 5,
        summary: "~6,300 Rwandan troops irreplaceable on the horizon, bilaterally funded on undisclosed terms." },
      { id: "R4",  label: "Expatriate kidnap on ground movement", likelihood: 2, impact: 5,
        summary: "Ideologically motivated abduction outside the perimeter — propaganda or execution more plausible than negotiation." },
      { id: "R5",  label: "Insurgent self-financing persists",   likelihood: 5, impact: 2,
        summary: "Mine raids, coastal ransom and untraced mobile money — kinetic pressure alone will not disrupt it." },
      { id: "R6",  label: "Propaganda targeting of operators",   likelihood: 4, impact: 2,
        summary: "Explicit Al-Naba framing of foreign LNG operators as targets; restart likely renews infrastructure messaging." },
      { id: "R7",  label: "Reputational & legal contagion",      likelihood: 3, impact: 4,
        summary: "ECCHR French criminal complaint and Forbidden Stories / UNFPA allegations around TotalEnergies-adjacent actors." },
      { id: "R8",  label: "Commercial: dispute → FID slip",      likelihood: 3, impact: 4,
        summary: "USD 2bn cost dispute intersecting the expected September Exxon FID; breakdown depresses services demand." },
      { id: "R9",  label: "Humanitarian deterioration",          likelihood: 4, impact: 2,
        summary: "662,000 displaced, appeal 27% funded, 25 districts IPC-3 — feeds recruitment and coerced compliance." },
      { id: "R10", label: "Early-warning degradation",           likelihood: 3, impact: 2,
        summary: "Shrinking independent media and state coercion of journalists raise reliance on host-nation channels." },
      { id: "R11", label: "2021-style mass-casualty resurgence", likelihood: 1, impact: 5,
        summary: "Set-piece assault on Palma/Afungi; assessed low-to-moderate likelihood over the window." },
    ],
  },

  /* ── 4. Phased roadmap (stage-gate) ─────────────────────────────────── */
  phased_plan: {
    block: "phased_plan",
    provenance: "authored", // the report leaves trigger points to the client
    axis_months: 12,
    tiers: [
      {
        name: "Tier 1 · Assessment & liaison",
        window: "months 0–3", start: 0, end: 3,
        actions: [
          "Pemba-based country liaison only; no routine road movement north of Metuge",
          "Enclave familiarisation via the Pemba–Afungi air bridge",
          "KFR insurance and proof-of-life review against the ideological-abduction profile",
          "Stand up indicator monitoring (ACLED tempo, displacement, RDF posture)",
        ],
        gate_to_next: [
          "RDF bilateral funding terms disclosed or visibly stable",
          "ACLED under 15 events/fortnight sustained for 8 weeks",
          "No incident inside Palma district",
        ],
      },
      {
        name: "Tier 2 · Enclave-based rotation",
        window: "months 3–6", start: 3, end: 6,
        actions: [
          "Afungi-resident technical staff under the operator security umbrella",
          "All personnel movement by air; no N380 ground moves",
          "Local-hire vetting and duress protocols reflecting state-actor coercion risk",
        ],
        gate_to_next: [
          "Development plan approved / cost dispute settled",
          "Dry season passes without a sustained spike",
          "No ISM/Al-Naba messaging naming European contractors",
        ],
      },
      {
        name: "Tier 3 · Scaled operations",
        window: "months 6–12", start: 6, end: 12,
        actions: [
          "Broader rotations and managed logistics under convoy risk assessment",
          "Community-facing engagement aligned with reputational-exposure controls",
          "Quarterly re-assessment against the scenario indicator set",
        ],
        gate_to_next: null,
      },
    ],
  },

  /* ── 5. Source composition ──────────────────────────────────────────── */
  source_composition: {
    block: "source_composition",
    // Counts are real (57 news sources, 7 social citations S1–S7, 0 dark-web).
    // The A–D split is illustrative: this payload's sources[] carry no grades,
    // but the production API already returns `source_grading.grade_distribution`
    // (backend/src/graph/flow.py) — currently rendered nowhere.
    provenance: "derived",
    types: [
      { type: "news",    count: 57, extends_only: false },
      { type: "social",  count: 7,  extends_only: true },
      { type: "darkweb", count: 0,  extends_only: true, note: "searched — no relevant posts (DarkOwl coverage gaps; ISM routes via IS-central Al-Naba)" },
    ],
    grade_distribution: { "A": 9, "B+": 17, "B": 22, "C": 8, "D": 1 },
    average_score: 71,
    profile_used: "geopolitical_crisis",
  },

  /* ── 6. Geo operational overlay ─────────────────────────────────────── */
  geo: {
    block: "geo",
    provenance: "authored", // points come from the payload; overlays are authored
    // Geometry is deliberately coarse — smoothed lines through named waypoint
    // towns and district-level polygons, labelled approximate. [lat, lng]
    // order matches the existing pipeline; the Mapbox layer flips to [lng, lat].
    areas: [
      {
        label: "ISM coastal enclave (assessed)",
        kind: "threat_area",
        polygon: [
          [-11.35, 40.35], [-11.55, 40.56], [-12.05, 40.60], [-12.40, 40.50],
          [-12.35, 40.12], [-11.90, 40.02], [-11.50, 40.08],
        ],
        context: "Consolidated preaching-and-coercion zone between Mocímboa da Praia and Quissanga (~100 × 50 km).",
      },
    ],
    routes: [
      {
        label: "N380 corridor",
        kind: "contested_route",
        line: [
          [-12.97, 40.52], [-12.75, 40.30], [-12.45, 40.18], [-12.24, 40.13],
          [-11.90, 40.00], [-11.65, 39.98], [-11.45, 40.18], [-11.35, 40.35],
          [-10.95, 40.40], [-10.77, 40.47], [-10.83, 40.55],
        ],
        context: "Pemba–Afungi road axis; recurrent IED emplacement and ambush in Macomia and Mocímboa districts.",
      },
      {
        label: "N14 approach",
        kind: "monitored_route",
        line: [ [-13.48, 39.72], [-12.99, 39.85], [-12.70, 40.15], [-12.44, 40.49] ],
        context: "Chiure–Quissanga axis; insurgent movement reported 18 June 2026.",
      },
    ],
    movements: [
      {
        label: "Southward expeditionary drift",
        from: [-12.24, 40.13], to: [-13.40, 39.78],
        context: "Two-month expeditions into Ancuabe/Chiure mining districts, returning to Macomia bases.",
      },
    ],
  },
};

/* Category + severity colour assignments (validated against the dark card
   surface #141924 and white with scripts/validate_palette.js — see
   report-viz.css for the token definitions). */
export const CATEGORY_META = {
  security:     { label: "Security" },
  political:    { label: "Political" },
  commercial:   { label: "Commercial" },
  humanitarian: { label: "Humanitarian" },
};
