/* Demo request page (/demo)
   Two-column layout: pitch + what-to-expect on the left, form on the right.
   Field names match HubSpot's standard internal names (firstname, lastname,
   email, company, jobtitle, numemployees, industry, message) so wiring the
   form to a HubSpot endpoint later is a one-line change in handleSubmit. */
import React from "react";
import { Icon } from "./Components.jsx";

const TEAM_SIZES = [
  { v: "",        l: "Select team size" },
  { v: "1-10",    l: "1–10" },
  { v: "11-50",   l: "11–50" },
  { v: "51-200",  l: "51–200" },
  { v: "201-1000",l: "201–1,000" },
  { v: "1000+",   l: "1,000+" },
];

const INDUSTRIES = [
  { v: "",                              l: "Select industry" },
  { v: "Financial Services",            l: "Financial Services" },
  { v: "Insurance",                     l: "Insurance" },
  { v: "Legal",                         l: "Legal" },
  { v: "Consulting",                    l: "Consulting / Professional Services" },
  { v: "Government & Defense",          l: "Government & Defense" },
  { v: "Media & Journalism",            l: "Media & Journalism" },
  { v: "Energy",                        l: "Energy" },
  { v: "Maritime & Shipping",           l: "Maritime & Shipping" },
  { v: "NGO / Non-profit",              l: "NGO / Non-profit" },
  { v: "Other",                         l: "Other" },
];

const WHAT_TO_EXPECT = [
  "A 5-minute brief on your current intelligence workflow",
  "A live walkthrough of Sidney running on a question you bring",
  "15 minutes of Q&A with a Satorus founder",
  "A short follow-up with a sample report — even if you don't move forward",
];

const TRUST = [
  "Backed by University of Cambridge",
  "UK Founded · EU residency",
];

export const DemoPage = () => {
  const [status, setStatus] = React.useState("idle"); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Placeholder: log + simulate success. Replace with HubSpot Forms API call:
    //   await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       fields: Object.entries(data).map(([name, value]) => ({ name, value })),
    //       context: { pageUri: window.location.href, pageName: document.title },
    //     }),
    //   });
    console.log("[demo request]", data);
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
    form.reset();
  };

  if (status === "success") {
    return (
      <section className="dr-page">
        <div className="dr-success-wrap">
          <div className="dr-success">
            <div className="dr-success-icon"><Icon name="check" size={28}/></div>
            <h2 className="dr-success-h">Request received.</h2>
            <p className="dr-success-p">
              A Satorus analyst will be in touch within one working day to set up
              your live brief. Check your inbox — including the spam folder — for
              a confirmation from <strong>harry@satorusgroup.com</strong>.
            </p>
            <a href="/" className="btn btn-ghost dr-success-back">← Back to the homepage</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dr-page">
      <div className="dr-grid">
        <aside className="dr-pitch">
          <div className="dr-pitch-label">Request a demo</div>
          <h1 className="dr-pitch-h">
            See Sidney run against a brief that <em>matters to your team.</em>
          </h1>
          <p className="dr-pitch-sub">
            30 minutes with a Satorus analyst. No slides, no BDR. We'll run your
            real intelligence question through the platform live — so you can
            judge Sidney on what you're actually trying to do.
          </p>

          <div className="dr-expect">
            <div className="dr-expect-h">What to expect</div>
            <ul className="dr-expect-list">
              {WHAT_TO_EXPECT.map((t, i) => (
                <li key={i} className="dr-expect-item">
                  <span className="check"><Icon name="check" size={14}/></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="dr-trust">
            {TRUST.map((t) => (
              <span key={t} className="dr-trust-item">
                <span className="dot"/>{t}
              </span>
            ))}
          </div>
        </aside>

        <form className="dr-form" onSubmit={handleSubmit} noValidate>
          <div className="dr-form-h">Tell us a bit about you</div>
          <p className="dr-form-sub">
            Takes about 60 seconds. We'll be in touch within one working day.
          </p>

          <div className="dr-row split">
            <div className="dr-field">
              <label className="dr-label required" htmlFor="dr-firstname">First name</label>
              <input className="dr-input" id="dr-firstname" name="firstname" type="text" autoComplete="given-name" required/>
            </div>
            <div className="dr-field">
              <label className="dr-label required" htmlFor="dr-lastname">Last name</label>
              <input className="dr-input" id="dr-lastname" name="lastname" type="text" autoComplete="family-name" required/>
            </div>
          </div>

          <div className="dr-row">
            <div className="dr-field">
              <label className="dr-label required" htmlFor="dr-email">Work email</label>
              <input className="dr-input" id="dr-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" required/>
              <span className="dr-hint">Please use your work address — we don't accept demos via personal email.</span>
            </div>
          </div>

          <div className="dr-row split">
            <div className="dr-field">
              <label className="dr-label required" htmlFor="dr-company">Company</label>
              <input className="dr-input" id="dr-company" name="company" type="text" autoComplete="organization" required/>
            </div>
            <div className="dr-field">
              <label className="dr-label required" htmlFor="dr-jobtitle">Job title</label>
              <input className="dr-input" id="dr-jobtitle" name="jobtitle" type="text" autoComplete="organization-title" required/>
            </div>
          </div>

          <div className="dr-row split">
            <div className="dr-field">
              <label className="dr-label" htmlFor="dr-numemployees">Team size</label>
              <select className="dr-select" id="dr-numemployees" name="numemployees" defaultValue="">
                {TEAM_SIZES.map(o => <option key={o.v} value={o.v} disabled={o.v === ""}>{o.l}</option>)}
              </select>
            </div>
            <div className="dr-field">
              <label className="dr-label" htmlFor="dr-industry">Industry</label>
              <select className="dr-select" id="dr-industry" name="industry" defaultValue="">
                {INDUSTRIES.map(o => <option key={o.v} value={o.v} disabled={o.v === ""}>{o.l}</option>)}
              </select>
            </div>
          </div>

          <div className="dr-row">
            <div className="dr-field">
              <label className="dr-label" htmlFor="dr-message">How would you like Sidney to help you?</label>
              <textarea className="dr-textarea" id="dr-message" name="message" rows="4" placeholder="Optional. Even a sentence helps us prepare."/>
              <span className="dr-hint">Confidentiality goes without saying — anything you share stays between us.</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary dr-submit" disabled={status === "submitting"} style={{ height: 44, padding: "0 22px" }}>
            {status === "submitting" ? "Submitting…" : <>Request a demo <Icon name="arrow" size={14}/></>}
          </button>

          <p className="dr-fineprint">
            By submitting, you agree to be contacted by Satorus about your demo
            request. We won't add you to a marketing list. See our <a href="#privacy">privacy policy</a>.
          </p>
        </form>
      </div>
    </section>
  );
};
