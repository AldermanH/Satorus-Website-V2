/* Direction A — homepage sections below the hero, in page order:
   Proof band → (LiveDemoA, in SiteA-Hero.jsx) → How it works → Source
   grading → Video analysis → Use cases → Security and data → Team →
   Final CTA. Footer at the end.

   Positioning: Sidney compresses the discovery phase of an investigation
   or threat assessment into minutes and hands analysts a graded, referenced
   starting base to build on. It is not pitched as a finished client
   deliverable.

   Customer outcomes are anonymised by role and sector only. No customer
   names or logos anywhere on the site. */
import React from "react";
import { Icon, BrandLockup } from "./Components.jsx";

/* Product screenshot. `crop` frames one rectangle of the image, given in
   source pixels ({ x, y, w, h }) on the 1600×890 guide screenshots, so the
   relevant detail stays legible at small sizes. `crop.m` is an optional
   separate rectangle for phones. */
const SHOT_W = 1600, SHOT_H = 890;
const cropVars = ({ x, y, w, h }, prefix) => ({
  [`--${prefix}-ar`]: `${w} / ${h}`,
  [`--${prefix}-w`]: `${(SHOT_W / w) * 100}%`,
  [`--${prefix}-l`]: `${(-x / w) * 100}%`,
  [`--${prefix}-t`]: `${(-y / h) * 100}%`,
});

const Shot = ({ src, alt, caption, crop }) => {
  const style = crop ? { ...cropVars(crop, "c"), ...cropVars(crop.m ?? crop, "m") } : undefined;
  return (
    <figure className="a-shot">
      <div className={crop ? "a-shot-frame a-shot-crop" : "a-shot-frame"} style={style}>
        <img src={src} alt={alt} width={SHOT_W} height={SHOT_H} loading="lazy" decoding="async"/>
      </div>
      {caption && <figcaption className="a-shot-cap">{caption}</figcaption>}
    </figure>
  );
};

/* ───── a) Proof band ───── */

const OUTCOMES = [
  {
    metric: "Under 30 min",
    detail: "for a weekly regional forecast that used to take about half a day.",
    who: "Corporate security and travel-risk provider",
  },
  {
    metric: "An hour a day",
    detail: "saved on daily social media checks.",
    who: "UK investigations firm",
  },
  {
    metric: "3 months",
    detail: "is how long an analyst spent on an event security report that Sidney matched.",
    who: "Security consultancy",
  },
];

export const ProofA = () => (
  <section className="a-section a-proof" aria-labelledby="proof-h">
    <div className="container">
      <div className="a-proof-head">
        <div className="a-section-label">In use today</div>
        <p id="proof-h" className="a-proof-lede">
          Sidney compresses the discovery phase of an investigation into
          minutes. Here is what that looks like for current customers.
        </p>
      </div>
      <ul className="a-proof-grid">
        {OUTCOMES.map(o => (
          <li key={o.who} className="a-proof-item">
            <div className="a-proof-metric">{o.metric}</div>
            <p className="a-proof-detail">{o.detail}</p>
            <div className="a-proof-who">{o.who}</div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ───── c) How it works ───── */

const STEPS = [
  {
    h: "Sidney plans the investigation",
    p: "Describe what you need in plain language. Sidney turns it into a research plan and asks clarifying questions before it starts, so the scope is right first time.",
    shot: { src: "/assets/guide/home.webp", alt: "Sidney home screen with workflows for Deep Research, Due Diligence, Digital Footprints and Video Analysis", crop: { x: 300, y: 388, w: 610, h: 458 } },
  },
  {
    h: "It researches and grades every source",
    p: "Surface, deep and dark web, social media and video. Sources are collected fresh and every one is graded for reliability.",
    shot: { src: "/assets/guide/sources.webp", alt: "Sources tab listing news and social media sources, with media analysis of an image", crop: { x: 555, y: 300, w: 680, h: 510 } },
  },
  {
    h: "You get a sourced first draft",
    p: "Key judgments with confidence levels and citations you can open. Build on it, re-run it, or schedule it as a recurring report.",
    shot: { src: "/assets/guide/key-judgments.webp", alt: "Report key judgments with numbered citations and confidence levels", crop: { x: 580, y: 20, w: 720, h: 540 } },
  },
];

export const HowItWorksA = () => (
  <section className="a-section" id="product">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">How it works</div>
          <h2 className="a-section-h">From question to <em>sourced first draft.</em></h2>
        </div>
        <p className="a-section-p">Sidney does the discovery work that usually eats the first days of an investigation. Your analysts start from a graded, referenced base instead of a blank page.</p>
      </div>
      <ol className="a-steps">
        {STEPS.map((s, i) => (
          <li key={s.h} className="a-step">
            <Shot {...s.shot}/>
            <div className="a-step-n">0{i + 1}</div>
            <h3 className="a-step-h">{s.h}</h3>
            <p className="a-step-p">{s.p}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/* ───── d) Source grading ───── */

const GRADING_POINTS = [
  {
    h: "Every claim is cited",
    p: "Each judgment links to the sources behind it. Open a citation to see where it came from.",
  },
  {
    h: "Every source is rated, with its reasoning shown",
    p: "Sidney grades each source on attribution, authority, editorial standards and track record, and shows you why. If you disagree with a grade, you can see exactly what it rests on.",
  },
  {
    h: "Confidence sits on each judgment",
    p: "Key judgments carry a confidence level, so you can see at a glance where the evidence is strong and where it is thin.",
  },
];

export const GradingA = () => (
  <section className="a-section" id="source-grading">
    <div className="container">
      <div className="a-split">
        <div className="a-split-copy">
          <div className="a-section-label">Source grading</div>
          <h2 className="a-section-h">Every claim cited. <em>Every source graded.</em></h2>
          <p className="a-split-p">
            A general AI chatbot gives you an answer. Sidney shows you how far
            to trust it.
          </p>
          <ul className="a-points">
            {GRADING_POINTS.map(g => (
              <li key={g.h} className="a-point">
                <span className="a-point-i"><Icon name="check" size={14}/></span>
                <div>
                  <div className="a-point-h">{g.h}</div>
                  <p className="a-point-p">{g.p}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="a-split-media">
          <Shot
            src="/assets/guide/key-judgments.webp"
            alt="A source grading popover rating a news outlet B+, generally reliable, with the reasons listed"
            caption="Open any citation to see the source's grade and the reasoning behind it."
            crop={{ x: 600, y: 230, w: 800, h: 600, m: { x: 846, y: 296, w: 360, h: 528 } }}
          />
        </div>
      </div>
    </div>
  </section>
);

/* ───── e) Video analysis ───── */

const VIDEO_CAPS = [
  { i: "globe",     h: "Transcription and translation", p: "Speech is transcribed verbatim and translated. Both versions are kept." },
  { i: "file",      h: "On-screen text",                p: "Captions, banners and signs are read and translated." },
  { i: "eye",       h: "Visual scene description",      p: "What is in frame is described: people, equipment, places and markings." },
  { i: "branch",    h: "A sourced report you can question", p: "Findings come back as a report you can ask follow-up questions of." },
];

export const VideoA = () => (
  <section className="a-section" id="video-analysis">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">Video analysis · New</div>
          <h2 className="a-section-h">Give Sidney a video. <em>Question what it finds.</em></h2>
        </div>
        <p className="a-section-p">Paste a link or upload a file. Sidney works through what is said, what is shown and what is written on screen, then writes a sourced report.</p>
      </div>
      <div className="a-video-shots">
        <Shot
          src="/assets/guide/video-analysis.webp"
          alt="Video Analysis set-up screen with options for speech, visual scenes and on-screen text"
          caption="Choose what to analyse: speech, visual scenes and on-screen text."
          crop={{ x: 320, y: 250, w: 900, h: 562, m: { x: 370, y: 420, w: 620, h: 465 } }}
        />
        <Shot
          src="/assets/guide/sources.webp"
          alt="Media analysis of a social media image, with on-screen Arabic text and a list of visible weapons"
          caption="Images and clips in social media sources are analysed too, and checked against their captions."
          crop={{ x: 555, y: 360, w: 720, h: 450, m: { x: 560, y: 360, w: 600, h: 450 } }}
        />
      </div>
      <ul className="a-caps">
        {VIDEO_CAPS.map(c => (
          <li key={c.h} className="a-cap">
            <div className="a-feat-i"><Icon name={c.i} size={18}/></div>
            <div className="a-cap-h">{c.h}</div>
            <p className="a-cap-p">{c.p}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ───── f) Use cases — what is proven today ───── */

const USE_CASES = [
  {
    h: "Geopolitical and conflict monitoring",
    p: "Track how a conflict or political situation is developing, who is driving it and where it is heading.",
    q: "Map current zones of instability along the Pakistan-Afghanistan border. Break down by sub-region.",
  },
  {
    h: "Threat and travel-risk assessment",
    p: "Assess the security environment for a location, event or trip before your people are on the ground.",
    q: "Assess the security environment for a corporate delegation visiting Lagos in Q3.",
  },
  {
    h: "Crisis monitoring",
    p: "Get a sourced picture of a fast-moving incident in minutes, then re-run it as the situation changes.",
    q: "Summarise reporting on the Red Sea shipping attacks since Monday. Separate confirmed incidents from claims.",
  },
  {
    h: "Recurring regional reporting",
    p: "Schedule the same question daily or weekly. Sources are collected fresh on every run, so each report reflects the latest picture.",
    q: "Weekly security forecast for the Sahel: incidents, actors and outlook for the next seven days.",
  },
];

export const UseCasesA = () => (
  <section className="a-section" id="use-cases">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">Use cases</div>
          <h2 className="a-section-h">Where teams use Sidney <em>today.</em></h2>
        </div>
      </div>

      <div className="a-uc-grid a-uc-grid-4">
        {USE_CASES.map(uc => (
          <article key={uc.h} className="a-uc-card now">
            <h3 className="a-uc-h">{uc.h}</h3>
            <p className="a-uc-desc">{uc.p}</p>
            <div className="a-uc-queries">
              <div className="a-uc-queries-h">Example query</div>
              <div className="a-uc-query">
                <Icon name="sparkle" size={12}/>
                <span>"{uc.q}"</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="a-uc-also">
        Sidney also has dedicated workflows for due diligence and digital footprints.
      </p>
    </div>
  </section>
);

/* ───── g) Security and data ─────
   Allowed claims only. Do not add certifications (ISO 27001 etc.), SSO or
   MFA here until they actually exist. */

const SECURITY = [
  { i: "globe",   h: "Hosted in the UK",          p: "Sidney runs on Google Cloud in London." },
  { i: "shield",  h: "Never used for training",   p: "Customer data is never used to train models." },
  { i: "lock",    h: "Private by default",        p: "Users can't see each other's investigations." },
  { i: "zap",     h: "Fresh on every run",        p: "Sources are collected fresh each time. Nothing is served from a cache." },
  { i: "x",       h: "Permanent deletion",        p: "Investigations can be permanently deleted." },
  { i: "network", h: "Configurable sources",      p: "Choose which data sources each report can use." },
];

export const SecurityA = () => (
  <section className="a-section" id="security">
    <div className="container">
      <div className="a-section-head">
        <div>
          <div className="a-section-label">Security and data</div>
          <h2 className="a-section-h">Built for <em>sensitive work.</em></h2>
        </div>
        <p className="a-section-p">
          Our <a className="a-inline-link" href="/legal/msa">Master Services Agreement</a> and <a className="a-inline-link" href="/legal/dpa">Data Processing Agreement</a> are published in full.
        </p>
      </div>
      <ul className="a-sec-grid">
        {SECURITY.map(s => (
          <li key={s.h} className="a-sec-item">
            <span className="a-sec-i"><Icon name={s.i} size={16}/></span>
            <div>
              <div className="a-sec-h">{s.h}</div>
              <p className="a-sec-p">{s.p}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ───── h) Team ─────
   Aggregated credentials as a numbered manifest (editorial / intel-document
   feel, not a bordered SaaS CTA card). Names to follow. The page's closing
   CTA now lives in FinalCtaA below. */

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
          </div>
          <ol className="a-finale-list">
            {CREDENTIALS.map((c, i) => <li key={i}>{c}</li>)}
          </ol>
        </div>
      </div>
    </div>
  </section>
);

/* ───── i) Final CTA ───── */
export const FinalCtaA = () => (
  <section className="a-section a-final-cta">
    <div className="container">
      <div className="a-imagine">
        <h2 className="a-imagine-h">
          See Sidney work on a question that <em>matters to your team.</em>
        </h2>
        <p className="a-final-cta-p">30 minutes with a founder. Pick a time straight from the calendar.</p>
        <a href="/demo" className="btn btn-primary a-imagine-cta">
          Book a demo <Icon name="arrow" size={14}/>
        </a>
      </div>
    </div>
  </section>
);

/* ───── Footer ───── */
export const FooterA = () => (
  <footer className="a-foot">
    <div className="a-foot-row">
      <div className="a-foot-col a-foot-brand">
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
        <div className="a-foot-h">Legal</div>
        <a className="a-foot-l" href="/legal/privacy">Privacy policy</a>
        <a className="a-foot-l" href="/legal/msa">Master Services Agreement</a>
        <a className="a-foot-l" href="/legal/dpa">Data Processing Agreement</a>
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
