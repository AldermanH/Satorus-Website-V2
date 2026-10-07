/* Homepage explainer graphics. Each one makes a single point for its
   section, built from the site's own tokens instead of product
   screenshots (which were too dense to read at section size).

   Content inside the graphics is illustrative: no customer names, no real
   outlet names. Each graphic is a role="img" figure with an aria-label that
   says what it shows, so its inner text is decorative for screen readers.

   Static by design: the homepage motion budget belongs to the hero and the
   live demo. */
import React from "react";
import { Icon } from "./Components.jsx";

/* Confidence pips, matching the live demo's finding header. */
const Pips = ({ n, of = 4, label }) => (
  <span className="g-conf">
    {Array.from({ length: of }, (_, i) => (
      <span key={i} className={i < n ? "a-finding-pip on" : "a-finding-pip"}/>
    ))}
    {label && <span className="g-conf-label">{label}</span>}
  </span>
);

const Grade = ({ g, lg }) => (
  <span className={`g-grade g-grade-${g.replace("+", "p").toLowerCase()}${lg ? " lg" : ""}`}>{g}</span>
);

const Cite = ({ n, on }) => <span className={on ? "a-cite g-cite-on" : "a-cite"}>{n}</span>;

/* ───── How it works · 01: the brief becomes a plan, with a question first ───── */
export const GfxPlan = () => (
  <figure className="a-gfx g-plan" role="img" aria-label="A brief about a delegation visiting Lagos. Sidney asks a clarifying question, then lays out a four-step research plan.">
    <div className="g-query">
      <Icon name="sparkle" size={12}/>
      <span>Assess the security environment for a corporate delegation visiting Lagos in Q3.</span>
    </div>
    <div className="g-ask">
      <div className="g-label g-label-accent">Sidney asks</div>
      <p>Which areas will the delegation stay and meet in, and are road moves planned?</p>
    </div>
    <div className="g-label">Research plan</div>
    <ol className="g-steps">
      <li><span className="g-dot"/>Recent incidents near the planned locations</li>
      <li><span className="g-dot"/>Protest and political calendar for Q3</li>
      <li><span className="g-dot"/>Kidnap and crime trends, Lagos State</li>
      <li><span className="g-dot"/>Road, airport and medical access</li>
    </ol>
  </figure>
);

/* ───── How it works · 02: collection across source types, graded on arrival ───── */
const COLLECTION = [
  { i: "globe",   l: "Surface web",  n: 42, g: ["A", "B+", "B"] },
  { i: "search",  l: "Deep web",     n: 11, g: ["B+", "B"] },
  { i: "lock",    l: "Dark web",     n: 6,  g: ["C", "C"] },
  { i: "network", l: "Social media", n: 23, g: ["B", "C"] },
  { i: "film",    l: "Video",        n: 3,  g: ["B+"] },
];

export const GfxResearch = () => (
  <figure className="a-gfx g-research" role="img" aria-label="Sources collected across surface web, deep web, dark web, social media and video, each with a reliability grade.">
    <div className="g-head">
      <div className="g-label">Collected this run</div>
      <span className="g-count">85 sources</span>
    </div>
    <ul className="g-rows">
      {COLLECTION.map(r => (
        <li key={r.l} className="g-row">
          <span className="g-row-i"><Icon name={r.i} size={13}/></span>
          <span className="g-row-l">{r.l}</span>
          <span className="g-row-n">{r.n}</span>
          <span className="g-row-g">{r.g.map((g, i) => <Grade key={i} g={g}/>)}</span>
        </li>
      ))}
    </ul>
    <div className="g-foot"><span className="g-live"/>Collected fresh. Every source graded.</div>
  </figure>
);

/* ───── How it works · 03: a sourced first draft you keep working on ───── */
export const GfxDraft = () => (
  <figure className="a-gfx g-draft" role="img" aria-label="A first draft of key judgments, each with citations and a confidence level, with options to edit, re-run or schedule it weekly.">
    <div className="g-head">
      <div className="g-label">Key judgments</div>
      <span className="g-chip">First draft</span>
    </div>
    <ul className="g-judgments">
      <li>
        <p>Protest activity is likely to rise ahead of the planned fuel price review.<Cite n="3"/><Cite n="7"/></p>
        <Pips n={3} label="Medium-high"/>
      </li>
      <li>
        <p>Victoria Island and Ikoyi remain the lowest-risk areas to stay.<Cite n="2"/><Cite n="5"/></p>
        <Pips n={4} label="High"/>
      </li>
      <li>
        <p>Avoid road moves after dark on the Lekki-Epe corridor.<Cite n="4"/><Cite n="9"/></p>
        <Pips n={3} label="Medium-high"/>
      </li>
    </ul>
    <div className="g-actions">
      <span className="g-btn"><Icon name="file" size={12}/>Edit</span>
      <span className="g-btn"><Icon name="refresh" size={12}/>Re-run</span>
      <span className="g-btn"><Icon name="clock" size={12}/>Schedule weekly</span>
    </div>
  </figure>
);

/* ───── Source grading: open a citation, see the grade and the reasons ───── */
export const GfxGrading = () => (
  <figure className="a-gfx g-grading" role="img" aria-label="A judgment with a High-confidence rating. One of its citations is open, showing the source graded B+, generally reliable, with the reasons for the grade.">
    <div className="g-label">Key judgment</div>
    <p className="g-claim">
      The provincial governor's office has confirmed that the command post will move to the coastal district.<Cite n="3" on/><Cite n="5"/><Cite n="6"/>
    </p>
    <Pips n={4} label="High confidence"/>

    <div className="g-pop">
      <div className="g-pop-head">
        <div>
          <div className="g-pop-src">Regional news outlet</div>
          <div className="g-pop-meta">Portuguese-language daily · 2 Jul 2026</div>
        </div>
        <Grade g="B+" lg/>
      </div>
      <div className="g-pop-verdict">B+ · Generally reliable</div>
      <ul className="g-reasons">
        <li className="plus">Strong attribution: claims linked to named officials and documents</li>
        <li className="plus">Established outlet with editorial standards</li>
        <li className="plus">High press-freedom environment</li>
        <li className="neutral">No third-party credibility record, so a neutral default is applied</li>
      </ul>
    </div>
  </figure>
);

/* ───── Video analysis: one clip, four kinds of evidence, then questions ───── */

// Deterministic waveform so the graphic renders identically every time.
const WAVE = Array.from({ length: 64 }, (_, i) =>
  Math.round(22 + 60 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.17 + 1.2)))
);

export const GfxVideo = () => (
  <figure className="a-gfx g-video" role="img" aria-label="A video clip of a press conference. Sidney transcribes and translates the Arabic speech, reads the on-screen text, describes the scene, and answers a follow-up question with a citation.">
    <div className="g-video-main">
      <div className="g-frame">
        <div className="g-frame-scene" aria-hidden="true">
          <span className="g-sil g-sil-vehicle"/>
          <span className="g-sil g-sil-flag"/>
          <span className="g-sil g-sil-person"/>
          <span className="g-sil g-sil-podium"/>
        </div>
        <span className="g-box" style={{ left: "37%", top: "14%", width: "24%", height: "60%" }}><span>Person · speaking</span></span>
        <span className="g-box" style={{ left: "66%", top: "10%", width: "13%", height: "34%" }}><span>Flag</span></span>
        <span className="g-box" style={{ left: "5%", top: "40%", width: "24%", height: "28%" }}><span>Armoured vehicle</span></span>
        <div className="g-lower">
          <span className="g-lower-tag" lang="ar">عاجل</span>
          <span className="g-lower-t" lang="ar" dir="rtl">مؤتمر صحفي لوزير الداخلية</span>
          <span className="g-box g-box-text"><span>On-screen text</span></span>
        </div>
      </div>
      <div className="g-timeline">
        <div className="g-wave" aria-hidden="true">
          {WAVE.map((h, i) => (
            <span key={i} className={i >= 22 && i < 31 ? "on" : undefined} style={{ height: `${h}%` }}/>
          ))}
          <span className="g-playhead" style={{ left: "35.5%" }}/>
        </div>
        <span className="g-tc">01:42 / 06:18</span>
      </div>
    </div>

    <div className="g-video-side">
      <div className="g-card">
        <div className="g-label g-label-accent"><Icon name="globe" size={11}/>Speech · Arabic, translated</div>
        <p className="g-ar" lang="ar" dir="rtl">سنعيد فتح المعبر الشمالي الأسبوع المقبل</p>
        <p className="g-en">"We will reopen the northern crossing next week."</p>
        <div className="g-meta">Speaker 1 · segment S3</div>
      </div>
      <div className="g-card">
        <div className="g-label g-label-accent"><Icon name="file" size={11}/>On-screen text</div>
        <dl className="g-pairs">
          <dt lang="ar">عاجل</dt><dd>Breaking</dd>
          <dt lang="ar" dir="rtl">مؤتمر صحفي لوزير الداخلية</dt><dd>Press conference by the interior minister</dd>
        </dl>
      </div>
      <div className="g-card">
        <div className="g-label g-label-accent"><Icon name="eye" size={11}/>Visual scene</div>
        <ul className="g-bullets">
          <li>Speaker at a podium with a cluster of microphones</li>
          <li>National flag behind the speaker</li>
          <li>Armoured vehicle parked at the left of the frame</li>
        </ul>
      </div>
    </div>

    <div className="g-ask-row">
      <div className="g-q"><Icon name="search" size={12}/>Does the speaker give a date for the reopening?</div>
      <div className="g-a">No exact date. He says "next week" and does not commit to a day.<Cite n="S3"/></div>
    </div>
  </figure>
);
