/* Direction A — Use cases, Product features, Team, CTA, Footer */
import React from "react";
import { Icon, BrandLockup } from "./Components.jsx";

/* Use cases — Stripe-style bento with six cards on a 12-col asymmetric grid.
   Row 1: hero query+brief (8) · source grading (4)
   Row 2: dark-web feed (4)    · geopolitical network (8)
   Row 3: handle resolve (5)   · protective brief (7)
   Selective outer corner rounding makes the six cards read as one unified
   intel-cockpit panel rather than six floating tiles. */

// Card 01 visual — query input above a structured brief output
const QueryBriefVisual = () => (
  <div className="a-bento-query">
    <div className="a-bento-query-input">
      <Icon name="sparkle" size={14}/>
      <div className="a-bento-query-text">
        What is the current sanctions exposure for maritime shipping routes through the Strait of Hormuz?
      </div>
      <div className="a-bento-query-kbd"><span className="kbd">⌘</span><span className="kbd">↵</span></div>
    </div>
    <div className="a-bento-brief-out">
      <div className="a-bento-brief-section">
        <div className="a-bento-brief-h">Assessment</div>
        <p>Moderate-to-high exposure across three corridor routes. Six sanctioned vessels currently transiting; STS activity concentrated around Bandar Abbas approach lanes.</p>
      </div>
      <div className="a-bento-brief-section">
        <div className="a-bento-brief-h">Key findings</div>
        <ol>
          <li><span className="n">01</span>Three new SDN designations in past 30 days</li>
          <li><span className="n">02</span>STS transfer activity up 22% Q4 vs Q3</li>
          <li><span className="n">03</span>Two HK brokerages added to OFAC list</li>
        </ol>
      </div>
      <div className="a-bento-brief-section">
        <div className="a-bento-brief-h">Source table</div>
        <ul className="a-bento-brief-srcs">
          <li><span className="g g-ap">A+</span>OFAC SDN List<span className="t">Live</span></li>
          <li><span className="g g-a">A</span>MarineTraffic AIS<span className="t">Live</span></li>
          <li><span className="g g-bp">B+</span>Sentinel-1 SAR<span className="t">26 Apr</span></li>
        </ul>
      </div>
    </div>
  </div>
);

// Card 02 visual — three source cards with grades and factor breakdown
const SOURCES = [
  { name: "OFAC SDN List", grade: "A+", factors: "Factual A+ · Authority A+ · Bias A+" },
  { name: "Reuters",       grade: "A",  factors: "Factual A+ · Authority A · Bias B+"  },
  { name: "Telegraph",     grade: "B+", factors: "Factual A · Authority B+ · Bias C"   },
  { name: "TASS",          grade: "C",  factors: "Factual C · Authority B · Bias D"    },
];

const SourceGradingVisual = () => (
  <div className="a-bento-grades">
    {SOURCES.map(s => (
      <div key={s.name} className="a-bento-grade-row">
        <div className={`a-bento-grade-letter g-${s.grade.replace("+", "p").toLowerCase()}`}>{s.grade}</div>
        <div className="a-bento-grade-body">
          <div className="a-bento-grade-name">{s.name}</div>
          <div className="a-bento-grade-factors">{s.factors}</div>
        </div>
      </div>
    ))}
  </div>
);

// Card 03 visual — live dark-web standing watch (terminal feed)
const WATCH_LOG = [
  { t: "14:02", src: "ramp4u",         msg: "@user mention · acme.com",   sev: "low" },
  { t: "13:48", src: "LockBit board",  msg: "no new posts",                sev: "ok"  },
  { t: "13:31", src: "doxbin mirror",  msg: "selector match (1)",          sev: "mid" },
  { t: "13:14", src: "xss.is",         msg: "escrow rep updated",          sev: "ok"  },
  { t: "12:57", src: "paste · ghost",  msg: "clean",                       sev: "ok"  },
];

const WatchFeedVisual = () => (
  <div className="a-bento-feed">
    <div className="a-bento-feed-head">
      <span className="dot"/>Live · 40 boards
      <span className="hits">0 actionable · 7d</span>
    </div>
    {WATCH_LOG.map((row, i) => (
      <div key={i} className="a-bento-feed-row">
        <span className="t">{row.t}</span>
        <span className="src">{row.src}</span>
        <span className="msg">{row.msg}</span>
        <span className={`sev ${row.sev}`}>{row.sev.toUpperCase()}</span>
      </div>
    ))}
  </div>
);

// Card 04 visual — geopolitical network of regions and entities, one node flagged red
const GEO_NODES = [
  { id: "uk",   x: 22, y: 18, kind: "region", label: "UK / EU" },
  { id: "us",   x: 12, y: 42, kind: "region", label: "US / NA" },
  { id: "gcc",  x: 56, y: 38, kind: "region", label: "GCC" },
  { id: "iran", x: 70, y: 28, kind: "flag",   label: "Iran" },
  { id: "hk",   x: 86, y: 52, kind: "region", label: "HK / SEA" },
  { id: "sng",  x: 90, y: 78, kind: "region", label: "Singapore" },
  { id: "afr",  x: 38, y: 78, kind: "region", label: "E. Africa" },
  { id: "ru",   x: 50, y: 14, kind: "region", label: "Russia" },
];
const GEO_EDGES = [
  ["uk", "gcc"], ["us", "gcc"], ["gcc", "iran"], ["iran", "hk"], ["hk", "sng"],
  ["gcc", "afr"], ["ru", "iran"], ["uk", "ru"], ["us", "hk"], ["gcc", "hk"],
];

const GeoNetworkVisual = () => {
  const map = Object.fromEntries(GEO_NODES.map(n => [n.id, n]));
  return (
    <div className="a-bento-geo">
      <svg className="a-bento-geo-net" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {GEO_EDGES.map(([a, b], i) => {
          const A = map[a], B = map[b];
          const flagged = A.kind === "flag" || B.kind === "flag";
          return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={flagged ? "flag" : ""}/>;
        })}
        {GEO_NODES.map(n => (
          <circle key={n.id} cx={n.x} cy={n.y} r={n.kind === "flag" ? 2.6 : 2} className={n.kind}/>
        ))}
      </svg>
      {GEO_NODES.map(n => (
        <span
          key={n.id}
          className={`a-bento-geo-label ${n.kind}`}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          {n.label}
        </span>
      ))}
    </div>
  );
};

// Card 05 visual — handle in, verified identity out
const HandleResolveVisual = () => (
  <div className="a-bento-handle">
    <div className="a-bento-handle-input">
      <div className="lbl">Leaked handle</div>
      <div className="val">@rcherryuk</div>
      <div className="meta">Telegram · 2,341 msgs</div>
    </div>
    <div className="a-bento-handle-arrow"><Icon name="arrow" size={14}/></div>
    <div className="a-bento-handle-match">
      <div className="lbl">Resolved · 93%</div>
      <div className="val">Robert Cherry</div>
      <div className="bar"><span style={{width: "93%"}}/></div>
      <div className="meta">Birmingham · ex-councillor · 12 sources</div>
    </div>
  </div>
);

// Card 06 visual — protective brief preview, ready to print
const BriefVisual = () => (
  <div className="a-bento-brief">
    <div className="head">
      <span className="dot"/>Confidential · Brief
      <span className="time">14:23</span>
    </div>
    <div className="risk">
      <span className="risk-l">Risk</span>
      <span className="pip on"/><span className="pip on"/><span className="pip on"/><span className="pip"/><span className="pip"/>
      <span className="risk-r">Moderate</span>
    </div>
    <ul className="bullets">
      <li>Venue verified · access cleared</li>
      <li>Route 12 · 3 protest events historic</li>
      <li>No prior incidents at site · 90d</li>
      <li>Hospital 1.2km · response cleared</li>
    </ul>
    <div className="rec"><Icon name="arrow" size={11}/> Recommend cleared with route 12</div>
  </div>
);

const BENTO = [
  {
    id: "core",  num: "01", tag: "How it works",          span: "a-bento-1",
    h: "Ask a hard question. Get a finished brief.",
    visual: <QueryBriefVisual/>,
  },
  {
    id: "trust", num: "02", tag: "Trust layer",           span: "a-bento-2",
    h: "Every source scored. No exceptions.",
    visual: <SourceGradingVisual/>,
  },
  {
    id: "dark",  num: "03", tag: "Dark web",              span: "a-bento-3",
    h: "Surface web is half the picture.",
    p: "Continuous monitoring across ransom boards, forums, paste sites, and Telegram channels. Alerts graded and triaged before they reach your team.",
    visual: <WatchFeedVisual/>,
  },
  {
    id: "geo",   num: "04", tag: "Geopolitical intelligence", span: "a-bento-4",
    h: "Track instability before it hits your supply chain.",
    p: "Ask about a country, a corridor, a commodity, or a supplier. Get an assessment graded by source quality and structured for the board.",
    visual: <GeoNetworkVisual/>,
  },
  {
    id: "ident", num: "05", tag: "Investigations",        span: "a-bento-5",
    h: "A username in. A verified identity out.",
    p: "Cross-lingual resolution across 12M+ records. Every match confidence-scored with citable sources.",
    visual: <HandleResolveVisual/>,
  },
  {
    id: "prot",  num: "06", tag: "Executive protection",  span: "a-bento-6",
    h: "Your principal lands in four hours. The brief is ready now.",
    p: "Venue, route, and regional risk. Every finding sourced, every recommendation backed by evidence. One page.",
    visual: <BriefVisual/>,
  },
];

export const UseCasesA = () => (
  <section className="a-section" id="use-cases">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">Use cases</div>
          <h2 className="a-section-h">
            Your analysts find information.
            <br/>
            <em>Sidney makes sense of it.</em>
          </h2>
        </div>
      </div>

      <div className="a-bento">
        {BENTO.map(b => (
          <article key={b.id} className={`a-bento-card ${b.span}`}>
            <header className="a-bento-meta">
              <span className="a-bento-num">{b.num}</span>
              <span className="a-bento-tag">{b.tag}</span>
            </header>
            <h3 className="a-bento-h">{b.h}</h3>
            {b.p && <p className="a-bento-p">{b.p}</p>}
            <div className="a-bento-visual">{b.visual}</div>
          </article>
        ))}
      </div>

      <div className="a-bento-cta">
        <p className="a-bento-cta-line">See Sidney work on a question that matters to your team.</p>
        <a href="/demo" className="btn btn-primary">Request a demo <Icon name="arrow" size={14}/></a>
      </div>
    </div>
  </section>
);

const FEATURES = [
  { i: "sparkle", h: "Agent orchestration", p: "A fleet of specialist agents — OSINT, registry, dark-web, maritime — coordinated by a planner that decides what evidence is still missing.", tags: ["Planner", "9 agents", "MCP"] },
  { i: "network", h: "Knowledge graph", p: "Every entity, relationship, and source stored as a queryable graph. Re-use findings across investigations without redoing the work.", tags: ["Graph", "Postgres · Neo4j"] },
  { i: "branch", h: "Evidence chain", p: "Each claim retains the URL, retrieval timestamp, hash, and archived snapshot. Editable confidence. Nothing opaque.", tags: ["Citations", "SHA-256"] },
  { i: "eye", h: "Dark-web reach", p: "Resident crawlers with vetted forum personas, purpose-built Tor routing, and 40+ monitored ransom boards.", tags: ["Tor", "40 boards"] },
  { i: "chart", h: "Analyst workspace", p: "Command-bar first. Keyboard navigation. Annotation, pinning, case files, drafts. Designed to get out of the way.", tags: ["⌘K", "Keyboard-first"] },
  { i: "lock", h: "Deployment", p: "SOC 2 Type II, ISO 27001 in progress. Air-gapped deployment for sensitive engagements. UK-based team, EU data residency.", tags: ["SOC 2", "Air-gap"] },
];

export const ProductA = () => (
  <section className="a-section" id="product">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">The platform · Sidney</div>
          <h2 className="a-section-h">An intelligence workstation, not <em>another chat window.</em></h2>
        </div>
        <p className="a-section-p">Sidney is the interface analysts live in. Agents plan the investigation; the workspace gives you the tools to interrogate, annotate, and ship it.</p>
      </div>
      <div className="a-product-grid">
        {FEATURES.map(f => (
          <div key={f.h} className="a-feat">
            <div className="a-feat-i"><Icon name={f.i} size={18}/></div>
            <div className="a-feat-h">{f.h}</div>
            <p className="a-feat-p">{f.p}</p>
            <div className="a-feat-meta">{f.tags.map(t => <span key={t} className="a-tag">{t}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* Team — four founders in a single row + two compact advisor cards beneath.
   Founders carry a monogram avatar (initials), name, mono-uppercase title, two
   bio lines (institutional pedigree, then one human detail), and a subtle
   LinkedIn link. Advisors are visually lighter — no photo, single bio line, half
   the height — so they read as trust signals rather than competing feature
   cards. All six tiles share selective outer-corner rounding so they read as
   one unified panel. */

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"/>
  </svg>
);

const FOUNDERS = [
  {
    n: "JA", name: "Jack Alderman", role: "Co-founder & CEO", span: "a-team-1",
    line1: "Cambridge. Advised a former UK Secretary of State on foreign policy and national security.",
    line2: "Co-designed Sidney's foundational architecture.",
  },
  {
    n: "BM", name: "Beth Martin-Board", role: "Co-founder & COO", span: "a-team-2",
    line1: "Led on-the-ground intelligence operations in Iraq. Founded her own intelligence consultancy. Scaled a PE-backed business to £58M.",
    line2: "Referenced in national press for expertise on terrorism and Syria policy.",
  },
  {
    n: "HA", name: "Harry Alderman", role: "Co-founder & CCO", span: "a-team-3",
    line1: "Led AI agent projects for Dyson, Samsung, and PayPal. Fastest-promoted salesperson at a billion-dollar SaaS company.",
    line2: "Previously co-founded a music venture with 10B+ streams and a Grammy win.",
  },
  {
    n: "EH", name: "Elsa Hu", role: "Co-founder & CTO", span: "a-team-4",
    line1: "VP at BlackRock. 7 years engineering algorithmic trading systems and AI-driven data platforms. MSc Software Engineering, Oxford.",
    line2: "Lead architect and sole engineer of Sidney's intelligence engine.",
  },
];

const ADVISORS = [
  {
    name: "David Claridge", role: "Intelligence & Market Entry Advisor", span: "a-team-5",
    line: "Former CEO of Risk Advisory Group and founder of Dragonfly Intelligence, acquired by Dow Jones.",
  },
  {
    name: "Jesse Wald", role: "Intelligence Advisor", span: "a-team-6",
    line: "16 years at the CIA.",
  },
];

export const TeamA = () => (
  <section className="a-section" id="company">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">Team</div>
          <h2 className="a-section-h">
            Built by operators.
            <br/>
            <em>Not observers.</em>
          </h2>
        </div>
      </div>

      <div className="a-team-grid">
        {FOUNDERS.map(p => (
          <article key={p.name} className={`a-team-card a-team-founder ${p.span}`}>
            <div className="a-team-head">
              <div className="a-team-pic large">{p.n}</div>
              <div className="a-team-id">
                <div className="a-team-name">{p.name}</div>
                <div className="a-team-role">{p.role}</div>
              </div>
              <a className="a-team-li" aria-label={`${p.name} on LinkedIn`}><LinkedInIcon/></a>
            </div>
            <div className="a-team-bio">
              <div className="a-team-bio-line">{p.line1}</div>
              <div className="a-team-bio-line">{p.line2}</div>
            </div>
          </article>
        ))}
        {ADVISORS.map(a => (
          <article key={a.name} className={`a-team-card a-team-advisor ${a.span}`}>
            <div className="a-team-head">
              <div className="a-team-id">
                <div className="a-team-name">{a.name}</div>
                <div className="a-team-role">{a.role}</div>
              </div>
              <a className="a-team-li" aria-label={`${a.name} on LinkedIn`}><LinkedInIcon/></a>
            </div>
            <div className="a-team-bio-line">{a.line}</div>
          </article>
        ))}
      </div>

    </div>
  </section>
);

export const CtaA = () => (
  <section className="a-cta">
    <div className="a-cta-inner">
      <h2 className="a-cta-h">The work is <em>serious.</em><br/>The tool should be too.</h2>
      <p className="a-cta-p">See Sidney run against a brief of your choosing. 30 minutes with a Satorus analyst, no slides.</p>
      <div className="a-cta-ctas">
        <a href="/demo" className="btn btn-primary" style={{ height: 42, padding: "0 20px"}}>Request a demo <Icon name="arrow" size={14}/></a>
        <button className="btn btn-ghost" style={{ height: 42, padding: "0 18px"}}>Read a sample report</button>
      </div>
    </div>
  </section>
);

export const FooterA = () => (
  <footer className="a-foot">
    <div className="a-foot-row">
      <div className="a-foot-col">
        <BrandLockup size={20}/>
        <p className="a-foot-about">Satorus Group builds AI agents for intelligence investigations. Named after <em>satori</em>, the Japanese term for a sudden moment of enlightenment.</p>
      </div>
      <div className="a-foot-col">
        <div className="a-foot-h">Product</div>
        <a className="a-foot-l">Sidney</a>
        <a className="a-foot-l">Dark-web module</a>
        <a className="a-foot-l">Changelog</a>
        <a className="a-foot-l">Roadmap</a>
      </div>
      <div className="a-foot-col">
        <div className="a-foot-h">Use cases</div>
        <a className="a-foot-l">Geopolitical</a>
        <a className="a-foot-l">Journalism</a>
        <a className="a-foot-l">Dark-web monitoring</a>
        <a className="a-foot-l">Threat assessment</a>
      </div>
      <div className="a-foot-col">
        <div className="a-foot-h">Company</div>
        <a className="a-foot-l">About</a>
        <a className="a-foot-l">Careers</a>
        <a className="a-foot-l">Press</a>
        <a className="a-foot-l">Contact</a>
      </div>
      <div className="a-foot-col">
        <div className="a-foot-h">Trust</div>
        <a className="a-foot-l">Security</a>
        <a className="a-foot-l">Privacy</a>
        <a className="a-foot-l">Terms</a>
        <a className="a-foot-l">SOC 2 report</a>
      </div>
    </div>
    <div className="a-foot-bot">
      <div>© 2026 Satorus Group Ltd · Company no. 14528991 · London</div>
      <div style={{display:"flex", alignItems:"center", gap:10}}>
        <span style={{color:"var(--sidney-primary)"}}>●</span> All systems operational
      </div>
    </div>
  </footer>
);

