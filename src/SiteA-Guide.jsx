/* Sidney user guide (/guide)
   Web version of "Sidney by Satorus — User Guide". Unlisted: not linked from
   nav/footer, noindex (App.jsx) + robots Disallow. Reachable by direct link
   only — send it to trial users alongside their sign-in.

   Screenshots live in public/assets/guide/. A <Figure> hides itself if its
   image 404s, so the page never renders a broken frame while a screenshot
   is missing. Filenames:
     deep-research.webp     Research page with the brief box + source pills
     home.webp              Home dashboard (four investigation cards)
     key-judgments.webp     Report: Key Judgments with a source-grading popover
     sources.webp           Sources tab with a social post's media analysis
     digital-footprints.webp Digital Footprints intake
     due-diligence.webp     Due Diligence intake with scope presets
     video-analysis.webp    Video Analysis intake */
import React from "react";
import { Icon } from "./Components.jsx";

const SITE_TITLE = "Satorus Group — AI Agents for High Stakes Intelligence";
const SUPPORT_EMAIL = "support@satorusgroup.com";
const APP_URL = "https://sidney.satorusgroup.com/";

const SECTIONS = [
  { n: "01", id: "access",     t: "Accessing Sidney" },
  { n: "02", id: "sign-in",    t: "Signing in" },
  { n: "03", id: "home",       t: "Your home dashboard" },
  { n: "04", id: "prompt",     t: "Writing a good prompt" },
  { n: "05", id: "research",   t: "Starting a Deep Research investigation" },
  { n: "06", id: "sources",    t: "Choosing your sources" },
  { n: "07", id: "reading",    t: "Reading a Sidney report" },
  { n: "08", id: "other",      t: "The other investigation types" },
  { n: "09", id: "scheduled",  t: "Scheduled runs" },
  { n: "10", id: "tips",       t: "Quick tips" },
  { n: "11", id: "coverage",   t: "Due diligence coverage" },
  { n: "12", id: "security",   t: "Security and data handling" },
  { n: "13", id: "help",       t: "Need help?" },
];

/* ───── Small building blocks ───── */

const Section = ({ id, children }) => {
  const s = SECTIONS.find((x) => x.id === id);
  return (
    <section className="gd-section" id={id}>
      <h2 className="gd-h2"><span className="gd-n">{s.n}</span>{s.t}</h2>
      {children}
    </section>
  );
};

const Figure = ({ src, alt }) => {
  const [ok, setOk] = React.useState(true);
  if (!ok) return null;
  return (
    <figure className="gd-figure">
      <img src={`/assets/guide/${src}`} alt={alt} loading="lazy" decoding="async" onError={() => setOk(false)}/>
    </figure>
  );
};

const Rows = ({ items, wide = false }) => (
  <dl className={`gd-rows${wide ? " wide" : ""}`}>
    {items.map(([k, v], i) => (
      <div key={i} className="gd-row">
        <dt>{k}</dt>
        <dd>{v}</dd>
      </div>
    ))}
  </dl>
);

const Steps = ({ items }) => (
  <ol className="gd-steps">
    {items.map((it, i) => <li key={i}><span className="gd-step-n">{i + 1}</span><span>{it}</span></li>)}
  </ol>
);

const Callout = ({ label, tone, children }) => (
  <div className={`gd-callout${tone ? ` ${tone}` : ""}`}>
    {label && <div className="gd-callout-l">{label}</div>}
    {children}
  </div>
);

const Pill = ({ tone, children }) => <span className={`gd-pill ${tone}`}>{children}</span>;

/* ───── Page ───── */
export const GuidePage = () => {
  React.useEffect(() => {
    const prev = document.title;
    document.title = "Sidney user guide — Satorus Group";
    return () => { document.title = prev === "Sidney user guide — Satorus Group" ? SITE_TITLE : prev; };
  }, []);

  // Highlight the section in view in the sticky contents rail.
  const [active, setActive] = React.useState(SECTIONS[0].id);
  React.useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const obs = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <article className="gd">
      {/* Header */}
      <header className="gd-head">
        <div className="container">
          <div className="gd-head-inner">
            <div className="a-section-label">Sidney · User guide</div>
            <h1 className="gd-h1">Welcome to Sidney.</h1>
            <p className="gd-lede">
              Signing in, briefing an investigation, reading what comes back, and what
              Sidney can and cannot reach yet.
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="gd-grid">
          {/* Contents rail */}
          <nav className="gd-toc" aria-label="Contents">
            <div className="gd-toc-h">Contents</div>
            <ol>
              {SECTIONS.map((s) => (
                <li key={s.id} className={active === s.id ? "on" : ""}>
                  <a href={`#${s.id}`}><span className="gd-toc-n">{s.n}</span>{s.t}</a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Body */}
          <div className="gd-body">

            <Section id="access">
              <Callout label="Open in your browser">
                <a className="gd-url" href={APP_URL} target="_blank" rel="noopener noreferrer">{APP_URL}</a>
              </Callout>
            </Section>

            <Section id="sign-in">
              <div className="gd-cols">
                <Steps items={[
                  <>Select the <strong>Sign in</strong> tab and enter your email address and password.</>,
                  <>First time here? Choose the <strong>Sign up</strong> tab instead and register with your email.</>,
                  <>Click <strong>Sign in</strong>.</>,
                ]}/>
                <div>
                  <div className="gd-mini-h">A few things to note</div>
                  <ul className="gd-bullets">
                    <li>Prefer not to use a password? Click <strong>“Sign in with an email link instead”</strong> for a one-time link.</li>
                    <li>Forgotten your password? Use the <strong>“Forgot password?”</strong> link to reset it.</li>
                    <li>Sign-in is protected by reCAPTCHA and multi-factor authentication.</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section id="home">
              <p className="gd-p">
                Once signed in, you land on home: anything waiting on you, the four ways to
                start an investigation, and counters showing how many investigations
                are <span className="gd-ok">active</span>, <span className="gd-warn">in review</span>, and <span className="gd-ok">finished</span>.
              </p>
              <Figure src="home.webp" alt="Sidney home dashboard showing the four investigation types"/>
              <div className="gd-mini-h">The sidebar</div>
              <div className="gd-defs">
                {[
                  ["Home", "Your starting point and anything awaiting you."],
                  ["All Investigations", "Every investigation you’ve run, past and present."],
                  ["Projects", "Group related investigations by engagement."],
                  ["Research", "Deep Research on a region, event or narrative."],
                  ["Digital Footprints", "A person’s accounts and posts across platforms."],
                  ["Due Diligence", "A company’s ownership, sanctions and filings."],
                  ["Video Analysis", "One clip, speech or broadcast, transcribed and read."],
                ].map(([h, p]) => (
                  <div key={h} className="gd-def"><div className="gd-def-h">{h}</div><p>{p}</p></div>
                ))}
              </div>
            </Section>

            <Section id="prompt">
              <p className="gd-p">
                Sidney is not a database lookup. It works best when you brief it the way
                you would brief a colleague, or the way a client would brief you. Give it
                the situation, the decision it supports, and the areas you want covered.
              </p>
              <div className="gd-cols">
                <Callout label="Do" tone="ok">
                  <ul className="gd-bullets plain">
                    <li>Say what you already know. Withholding context to test Sidney only weakens the result.</li>
                    <li>Point it at a defined question. “Tell me about Nigeria” makes Sidney search everything, takes far longer and comes back thinner.</li>
                    <li>Set the frame: intended audience, length, jurisdictions, time period.</li>
                    <li>Upload your own documents if you have them. Sidney will use them as a knowledge base alongside what it collects.</li>
                  </ul>
                </Callout>
                <Callout label="Don’t" tone="alert">
                  <ul className="gd-bullets plain">
                    <li>Write a mega-prompt. A short brief in plain English beats two thousand words of instructions.</li>
                    <li>Tell it to grade sources, cite evidence or flag gaps. It does all three by default.</li>
                  </ul>
                </Callout>
              </div>
              <Callout label="A worked example" tone="primary">
                <p className="gd-quote">
                  “Assess the security and political risk environment in Cabo Delgado Province,
                  Mozambique for a European energy services client considering re-entry to support
                  natural gas operations over the next six to twelve months. Cover the current stage
                  and trajectory of the ISM insurgency, attack patterns and geographic spread, and
                  the government security posture. For an analyst audience.”
                </p>
              </Callout>
            </Section>

            <Section id="research">
              <Steps items={[
                <>Click the <strong>Deep Research</strong> card on home, or <strong>Research</strong> in the sidebar.</>,
                <>Write your brief. Choose <strong>Deep report</strong> for a sourced, versioned report, or <strong>Quick answer</strong> for a fast read.</>,
                <>Tick the source pills you want before sending, then <strong>Run the report</strong>.</>,
              ]}/>
              <Figure src="deep-research.webp" alt="Deep Research page with the brief box and source pills"/>
              <Callout label="Before the report appears" tone="primary">
                <p>
                  You approve the plan, then answer a few clarifying questions, before Sidney
                  collects and writes. While it runs you can leave the page — the investigation
                  appears under All Investigations and the counters update when it’s ready
                  for review.
                </p>
              </Callout>
            </Section>

            <Section id="sources">
              <p className="gd-p">
                Clearnet news and open web are always on. Everything else is a pill you tick
                before sending.
              </p>
              <div className="gd-pills">
                <Pill tone="news">Clearnet news</Pill><span className="gd-pill-note">always</span>
                <Pill tone="dark">Dark web</Pill><span className="gd-pill-note">+1</span>
                <Pill tone="social">Social media</Pill><span className="gd-pill-note">+2</span>
              </div>
              <Rows items={[
                [<span className="gd-dark-t">Dark web</span>, "Telegram, open and closed, plus forums, marketplaces, breach and info-stealer data."],
                [<span className="gd-social-t">Social media</span>, "X, Instagram, Facebook, TikTok and LinkedIn. Includes multimodal analysis, so Sidney reads the images, video and audio inside a post, not just the caption and comments."],
              ]}/>
              <p className="gd-p">
                Each pill adds time as well as credits. A full-data research run with everything
                ticked is <code>7 credits</code>.
              </p>
              <Callout label="Cost per workflow">
                <table className="gd-cost">
                  <tbody>
                    {[
                      ["Deep Research", null, 4],
                      ["Video Analysis", "per video", 3],
                      ["Digital Footprint", "per subject", 6],
                      ["Corporate Due Diligence", "per company", 8],
                    ].map(([n, unit, c]) => (
                      <tr key={n}>
                        <td>{n}{unit && <span className="gd-cost-unit"> · {unit}</span>}</td>
                        <td className="gd-cost-v">from {c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Callout>
              <p className="gd-p">
                One credit currency across the platform. Credits apply to whatever you run — any
                investigation type, any data source. Your balance sits next to <strong>Run the report</strong>.
              </p>
            </Section>

            <Section id="reading">
              <Rows wide items={[
                ["Key judgments", "Bottom line up front. The claims that matter most, each with a confidence level and direct source references. Hovering a source reference opens its grading breakdown."],
              ]}/>
              <Figure src="key-judgments.webp" alt="Key Judgments section of a report with a source-grading popover open"/>
              <Rows wide items={[
                ["Intelligence gaps and critical assumptions", "Sidney cannot assert anything beyond the evidence it retrieved, which makes it good at telling you what it could not find. Read this section. It flags sources it could not reach, the assumptions holding the assessment together, and where to dig next."],
                ["Key indicators to monitor", "What would shift the picture, and in which direction."],
                ["Source grading", <>News sources are graded against the specific claim they support, across <code>11</code> layers and around <code>80</code> factors: attribution quality, cross-corroboration, outlet funding and political leaning, press freedom in the country of origin. Grading is dynamic, so the same article can score differently in two reports. Dark web and social sources are not graded yet.</>],
                ["The sources tab", "Every source in full, broken down by type. For social posts you also get the media analysis: transcript, on-screen text, visual description and audio."],
              ]}/>
              <Figure src="sources.webp" alt="Sources tab showing a social-media post with its media analysis"/>
              <Rows wide items={[
                ["The reasoning trace", "Every branch Sidney investigated, what it found, its confidence, and the evidence behind it."],
                ["Map", "Anything that can be accurately geolocated is plotted. Anything Sidney cannot place precisely is left off rather than guessed."],
                ["Glossary", "Underlined terms expand into a definition."],
                ["Ask a follow-up", "Use the thread tab at the top of the report to question anything in it."],
              ]}/>
            </Section>

            <Section id="other">
              <p className="gd-p">
                Deep Research is the most developed part of Sidney and where most trials find the
                clearest value. Corporate Due Diligence and Digital Footprints are newer, and Video
                Analysis is newer still. They work, and your feedback on them shapes what we build
                next, but expect rougher edges.
              </p>

              <div className="gd-sub">
                <div className="gd-sub-eyebrow">Social intelligence</div>
                <h3 className="gd-h3">Digital Footprints <span className="gd-credits">from 6 credits</span></h3>
                <Figure src="digital-footprints.webp" alt="Digital Footprints intake form"/>
                <Rows wide items={[
                  ["You provide", "Name, aliases, email, phone, employer, location, known associates, with an optional natural-language focus."],
                  ["You get back", "Discovered and rejected accounts with confidence and matching evidence, content analysis, network associations, audience analysis, breach and info-stealer hits."],
                  ["Confirm or suspect", <>Mark a known profile <strong>Confirmed</strong> if you vouch for it and Sidney anchors the subject model on it; mark it <strong>Suspected</strong> and Sidney verifies before trusting it. The single biggest lever on output quality.</>],
                ]}/>
              </div>

              <div className="gd-sub">
                <div className="gd-sub-eyebrow">Corporate intelligence</div>
                <h3 className="gd-h3">Due Diligence <span className="gd-credits">from 8 credits</span></h3>
                <Figure src="due-diligence.webp" alt="Due Diligence intake form with scope presets"/>
                <Rows wide items={[
                  ["You provide", "Company name, registration number, jurisdiction, scope, with an optional natural-language focus."],
                  ["You get back", "Entity resolution, ownership and control, ultimate beneficial ownership, directors and key individuals, subsidiaries and affiliates, adverse media and litigation timeline, risk assessment, gap ledger."],
                  ["Scope it", "Start from a preset — Baseline KYB, Standard DD, Enhanced DD, Full Spectrum — then tune the modules. Each module becomes its own report section."],
                ]}/>
              </div>

              <div className="gd-sub">
                <div className="gd-sub-eyebrow">Media intelligence</div>
                <h3 className="gd-h3">Video Analysis <span className="gd-credits">from 3 credits</span></h3>
                <Figure src="video-analysis.webp" alt="Video Analysis intake form"/>
                <Rows wide items={[
                  ["You provide", "A link Sidney can reach, or a file from your machine, with an optional focus instruction."],
                  ["You get back", "Source attribution and framing, speaker separation, key entities, timestamped phrases grouped by category, assessment and key findings, notable quotes in the original language, full English transcript."],
                  ["Runtime", "A few minutes per video."],
                ]}/>
              </div>
            </Section>

            <Section id="scheduled">
              <p className="gd-p">
                Set an investigation to run on a schedule and Sidney scans for relevant
                developments and writes them up before you sit down.
              </p>
              <p className="gd-p">
                Scheduled runs build on prior collection rather than starting fresh each time, so
                a standing watch compounds instead of repeating itself. Useful for a region, an
                entity or a narrative you need to stay across rather than research once.
              </p>
            </Section>

            <Section id="tips">
              <Rows wide items={[
                ["Pin what’s live", "Pin the investigations you’re actively working on to keep them on your home screen."],
                ["Group by engagement", "Create a project to group related investigations — useful when one engagement covers multiple subjects."],
                ["Turn on notifications", "Accept the browser prompt and Sidney will tell you when your plan is ready and when the report is finished."],
                ["Don’t leave it hanging", "Two steps need you: approving the plan, and answering the clarifying questions. A run left waiting at either step will time out, so come back within the hour."],
                ["Read the colours", <>
                  Sources are colour coded in reports. Hover over any source to see the original
                  links, plus a source grading breakdown on news articles.
                  <span className="gd-pills inline"><Pill tone="news">News</Pill><Pill tone="dark">Dark web</Pill><Pill tone="social">Social media</Pill></span>
                </>],
                ["Expect these timings", <>Around <code>2 min</code> to a plan for your approval, roughly <code>30 sec</code> after approving to the clarifying questions, then around <code>20 min</code> on average to the final report.</>],
                ["Export anywhere", "All reports can be exported to PDF, Word or HTML. Click the three dots at the top of the report page and choose your format."],
                ["Check the sources", "Every claim in a Sidney report links back to its evidence, so you can verify anything before relying on it."],
              ]}/>
            </Section>

            <Section id="coverage">
              <p className="gd-p">For corporate due diligence, primary-source coverage currently stands as follows.</p>
              <Callout label="Covered" tone="ok">
                <Rows items={[
                  ["Europe", "Austria, Belgium, Croatia, Cyprus, Czech Republic, Denmark, Estonia, Finland, France (incl. Monaco), Germany, Greece, Ireland, Israel, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Romania, Slovakia, Spain, Sweden, Switzerland (incl. Liechtenstein), United Kingdom (incl. Guernsey, Jersey)."],
                  ["MEA", <>Comprehensive primary-source corporate data covering <strong>73</strong> countries, including all Arab nations, Iran, and sub-Saharan African markets.</>],
                ]}/>
              </Callout>
              <Callout label="In testing · near-term incorporation" tone="warn">
                <p className="gd-strong">China and the United States.</p>
              </Callout>
              <Callout label="Process being finalised" tone="muted">
                <p>Russia and the near abroad, Hong Kong, Singapore, South Korea, Vietnam, Thailand, Taiwan, Philippines, New Zealand, Malaysia, Japan, Indonesia, India, Australia, Canada, LATAM.</p>
              </Callout>
            </Section>

            <Section id="security">
              <Callout>
                <ul className="gd-bullets plain gd-security">
                  <li><strong>Model training</strong> — customer searches, investigations, uploaded data and generated outputs are never used to train Sidney or any underlying AI models.</li>
                  <li><strong>Internal access</strong> — Satorus personnel have no visibility into customer work.</li>
                  <li><strong>Hosting</strong> — client data is hosted on Google Cloud Platform in London and remains in the UK.</li>
                  <li><strong>Deletion</strong> — you can permanently delete your own investigations, and the deletion is not held in backups.</li>
                  <li><strong>Segregation</strong> — logical segregation between customer tenants.</li>
                  <li>Our information security programme is aligned to ISO 27001, with certification in progress.</li>
                </ul>
              </Callout>
            </Section>

            <Section id="help">
              <p className="gd-p">
                If you run into any issues — signing in, running investigations, or anything
                else — email us and we will get you unblocked quickly.
              </p>
              <a className="gd-support" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              <div className="gd-signoff">
                <img src="/assets/satorus-icon-cyan.svg" alt="" width="22" height="20"/>
                Happy investigating — the Sidney team
              </div>
            </Section>

            <a className="gd-top" href="#main">Back to top <Icon name="arrow" size={13}/></a>
          </div>
        </div>
      </div>
    </article>
  );
};
