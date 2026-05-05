/* Direction A — Product features (with embedded demo CTA), Team finale, Footer */
import React from "react";
import { Icon, BrandLockup } from "./Components.jsx";

/* ───── Product features ───── */

const FEATURES = [
  {
    i: "sparkle", h: "Your Analyst",
    p: "Sidney receives a query, plans the investigation, researches, collects, analyses, and synthesises. One query in, intelligence out. Repeatedly queryable.",
  },
  {
    i: "branch", h: "Auditable Evidence",
    p: "Every claim in every report is sourced and traceable directly within the platform. Nothing opaque. Nothing asserted without evidence.",
  },
  {
    i: "chart", h: "Source Grading",
    p: "An algorithm that assesses source reliability across multiple layers, adjusting its emphasis based on the investigation type. Sidney doesn't just cite sources. It evaluates them.",
  },
  {
    i: "globe", h: "Coverage",
    p: "From surface to dark web, Sidney pulls from the sources that matter, not just the ones that are easy to reach.",
  },
  {
    i: "lock", h: "Your Context",
    p: "Upload internal data and have Sidney weave it into the analysis. The platform is secure, allowing it to handle what you'd never put into a third-party tool.",
  },
  {
    i: "file", h: "Your House Style",
    p: "Upload your own report templates and Sidney writes to them. No reformatting, no copy-pasting into your deliverable.",
  },
];

export const ProductA = () => (
  <section className="a-section" id="product">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">The platform · Sidney</div>
          <h2 className="a-section-h"><em>Your intelligence analyst.</em> Not another dashboard.</h2>
        </div>
        <p className="a-section-p">Sidney closes the gap between data collection and decision-ready intelligence. Planning, researching, analysing, and reporting in minutes.</p>
      </div>
      <div className="a-product-grid">
        {FEATURES.map(f => (
          <div key={f.h} className="a-feat">
            <div className="a-feat-i"><Icon name={f.i} size={18}/></div>
            <div className="a-feat-h">{f.h}</div>
            <p className="a-feat-p">{f.p}</p>
          </div>
        ))}
      </div>

      {/* In-section CTA after the features grid. */}
      <div className="a-imagine">
        <h3 className="a-imagine-h">
          See Sidney work on a question that <em>matters to your team.</em>
        </h3>
        <a href="/demo" className="btn btn-primary a-imagine-cta">
          Request a demo <Icon name="arrow" size={14}/>
        </a>
      </div>
    </div>
  </section>
);

/* ───── Use cases — NOW / DEVELOPING / ON THE HORIZON ─────
   Three-stage maturity grid. Each stage shows a status pill, a description,
   and two example queries (formatted like Sidney command-bar inputs) so the
   visitor sees the kind of question each stage answers, not just the
   capability category. Status colour signals where the stage sits — primary
   cyan for live, warn amber for in-build, muted for planned. */

const USE_CASES = [
  {
    status: "Now",
    cls: "now",
    desc: "Sidney runs intelligence investigations end to end. You ask a question. Sidney plans the research, pulls from surface, deep, and dark web sources, grades everything it touches, and delivers finished intelligence in your house style. Crisis monitoring, country risk, and threat assessment.",
    queries: [
      "Map current zones of instability along the Pakistan-Afghanistan border. Break down by sub-region.",
      "Assess the security environment for a corporate delegation visiting Lagos in Q3.",
    ],
  },
  {
    status: "Developing",
    cls: "developing",
    desc: "Same architecture, extending into due diligence, sanctions screening, financial crime, and reputational risk. The research patterns shift. The source grading adjusts dynamically. The pipeline is the same.",
    queries: [
      "Run due diligence on Anadine Capital Group. Flag sanctions exposure and beneficial ownership opacity.",
      "Investigate Stefan Horvat. Cross-reference corporate filings, adverse media, and politically exposed persons databases across Central and Eastern Europe.",
    ],
  },
  {
    status: "On the horizon",
    cls: "horizon",
    desc: "Supply chain risk and cyber threat intelligence. Same platform, same rigour, new territory.",
    queries: [
      "Map our tier-two rare earth suppliers. Flag concentration risk in jurisdictions under active export controls.",
      "Identify APT infrastructure targeting European energy operators. Cross-reference dark web and Mandarin-language threat channels.",
    ],
  },
];

export const UseCasesA = () => (
  <section className="a-section" id="use-cases">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">Use cases</div>
          <h2 className="a-section-h">One platform. <em>Every investigation.</em></h2>
        </div>
      </div>

      {/* Maturity rail — visualises the progression between stages with a
          gradient line and status dots. Hidden on mobile; the in-card
          status pills take over there. */}
      <div className="a-uc-rail" aria-hidden="true">
        {USE_CASES.map(uc => (
          <div key={uc.status} className={`a-uc-rail-step ${uc.cls}`}>
            <span className="dot"/>
            <span className="label">{uc.status}</span>
          </div>
        ))}
      </div>

      <div className="a-uc-grid">
        {USE_CASES.map(uc => (
          <article key={uc.status} className={`a-uc-card ${uc.cls}`}>
            <div className="a-uc-status">
              <span className="dot"/>
              <span>{uc.status}</span>
            </div>
            <p className="a-uc-desc">{uc.desc}</p>
            <div className="a-uc-queries">
              <div className="a-uc-queries-h">Example queries</div>
              {uc.queries.map((q, i) => (
                <div key={i} className="a-uc-query">
                  <Icon name="sparkle" size={12}/>
                  <span>"{q}"</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ───── Team — page finale ─────
   Aggregated credentials as a numbered manifest (editorial / intel-document
   feel, not a bordered SaaS CTA card), then the tagline, then the action.
   This replaces the previous "The work is serious." Big CTA. */

const CREDENTIALS = [
  "Led on-the-ground intelligence operations in Iraq.",
  "Advised on foreign policy at the heart of government.",
  "Spent decades in the CIA.",
  "Led teams building agentic AI platforms at BlackRock.",
  "Advised governments and multinationals on geopolitical risk across five continents.",
];

export const TeamA = () => (
  <section className="a-section a-finale" id="company">
    <div className="container">
      <div className="a-finale-inner">
        <div className="a-section-label a-finale-label">Team</div>
        <div className="a-finale-content">
          <div className="a-finale-left">
            <h2 className="a-finale-h">We built the platform we wished existed.</h2>
            <a href="/demo" className="btn btn-primary a-finale-cta">
              See the platform in action <Icon name="arrow" size={14}/>
            </a>
          </div>
          <ol className="a-finale-list">
            {CREDENTIALS.map((c, i) => <li key={i}>{c}</li>)}
          </ol>
        </div>
      </div>
    </div>
  </section>
);

/* ───── Footer ───── */
export const FooterA = () => (
  <footer className="a-foot">
    <div className="a-foot-row">
      <div className="a-foot-col">
        <BrandLockup size={20}/>
        <p className="a-foot-about">Satorus Group builds AI agents for intelligence investigations. Named after <em>satori</em>, the Japanese term for a sudden moment of enlightenment.</p>
      </div>
      <div className="a-foot-col">
        <div className="a-foot-h">Site</div>
        <a className="a-foot-l" href="/">Home</a>
        <a className="a-foot-l" href="/#product">Sidney</a>
        <a className="a-foot-l" href="/#use-cases">Use cases</a>
        <a className="a-foot-l" href="/#company">Company</a>
        <a className="a-foot-l" href="/demo">Request a demo</a>
      </div>
      <div className="a-foot-col">
        <div className="a-foot-h">Connect</div>
        <a
          className="a-foot-l"
          href="https://www.linkedin.com/company/satorus-group"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </div>
    <div className="a-foot-bot">
      <div>© 2026 Satorus Group Ltd · London</div>
      <div style={{display:"flex", alignItems:"center", gap:10}}>
        <span style={{color:"var(--sidney-primary)"}}>●</span> All systems operational
      </div>
    </div>
  </footer>
);
