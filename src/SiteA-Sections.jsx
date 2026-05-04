/* Direction A — Product features, Use-cases CTA, Team teaser, Big CTA, Footer */
import React from "react";
import { Icon, BrandLockup } from "./Components.jsx";

/* ───── Product features ───── */

const FEATURES = [
  {
    i: "sparkle", h: "Your analyst",
    p: "Sidney receives a query, plans the investigation, researches, collects, analyses, and synthesises. One query in, intelligence out. Repeatedly queryable.",
  },
  {
    i: "branch", h: "Auditable evidence",
    p: "Every claim in every report is sourced and traceable directly within the platform. Nothing opaque. Nothing asserted without evidence.",
  },
  {
    i: "chart", h: "Source grading",
    p: "An algorithm that assesses source reliability across multiple layers, adjusting its emphasis based on the investigation type. Sidney doesn't just cite sources. It evaluates them.",
  },
  {
    i: "globe", h: "Coverage",
    p: "From surface to dark web, Sidney pulls from the sources that matter, not just the ones that are easy to reach.",
  },
  {
    i: "lock", h: "Your context",
    p: "Upload internal data and have Sidney weave it into the analysis. The platform is secure, allowing it to handle what you'd never put into a third-party tool.",
  },
  {
    i: "file", h: "Your house style",
    p: "Upload your own report templates and Sidney writes to them. No reformatting, no copy-pasting into your deliverable.",
  },
];

export const ProductA = () => (
  <section className="a-section" id="product">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">The platform · Sidney</div>
          <h2 className="a-section-h">Your intelligence analyst. <em>Not another dashboard.</em></h2>
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
    </div>
  </section>
);

/* ───── Use-cases slot — open invitation, no enumerated list ─────
   Listing specific use cases lets visitors disqualify themselves ("we're not
   one of those"). Inviting them to imagine their own works harder. */
export const UseCasesA = () => (
  <section className="a-section" id="use-cases">
    <div className="container">
      <div className="a-imagine">
        <h2 className="a-imagine-h">
          See Sidney work on a question that <em>matters to your team.</em>
        </h2>
        <a href="/demo" className="btn btn-primary a-imagine-cta">
          Request a demo <Icon name="arrow" size={14}/>
        </a>
      </div>
    </div>
  </section>
);

/* ───── Team — credential teaser, no individual cards ─────
   Aggregated highlight reel rather than per-person bios. The collective
   credentials speak louder than four parallel cards. */
export const TeamA = () => (
  <section className="a-section" id="company">
    <div className="container">
      <div className="a-team-hero">
        <div className="a-section-label">Team</div>
        <p className="a-team-hero-bio">
          Led on-the-ground intelligence operations in Iraq. Advised on foreign
          policy at the heart of government. Spent decades in the CIA. Led teams
          building agentic AI platforms at BlackRock. Advised governments and
          multinationals on geopolitical risk across five continents.
        </p>
        <h2 className="a-team-hero-h">We built the platform we wished existed.</h2>
        <a href="/demo" className="btn btn-primary a-team-hero-cta">
          See the platform in action <Icon name="arrow" size={14}/>
        </a>
      </div>
    </div>
  </section>
);

/* ───── Big closing CTA ───── */
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

/* ───── Footer ───── */
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
