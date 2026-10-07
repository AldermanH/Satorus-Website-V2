/* Demo page (/demo)
   One step: the HubSpot Meetings calendar is the primary element and loads
   straight away. Pitch sits on the left on desktop; on phones the heading
   comes first, then the calendar, then the rest of the pitch.

   Below the calendar, "Prefer we get in touch?" opens a short contact form
   that posts to the HubSpot Forms API (HUBSPOT_ENDPOINT below). Field names
   map to HubSpot's standard internal names (firstname, lastname, email,
   company, jobtitle) plus one custom property (demo_request_details).

   Vercel events: demo_page_viewed (mount), demo_form_submitted (form
   accepted by HubSpot), demo_booked (the meetings iframe posts
   { meetingBookSucceeded: true } to the parent window), demo_cta_clicked
   (calendar opened in a new tab). */
import React from "react";
import { track } from "@vercel/analytics/react";
import { Icon } from "./Components.jsx";
import { UTM_KEYS, getUtm } from "./utm.js";

// HubSpot submission target. Both IDs are public — they ship in the bundle and
// are visible in the network tab; HubSpot designed them to be exposed on the
// client. Endpoint is region-agnostic — portal ID routes to the right region.
const HUBSPOT_PORTAL_ID = "147032466";
const HUBSPOT_FORM_ID   = "f5f8a158-35fa-484e-9f59-7e24582fb73f";
const HUBSPOT_ENDPOINT  = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

// HubSpot Meetings booking page (EU1 portal).
const MEETINGS_BASE = "https://meetings-eu1.hubspot.com/harry-alderman";

// The meetings app posts two kinds of message to its parent window
// (checked against HubSpot's MeetingsPublic bundle, Oct 2026):
//   { meetingBookSucceeded: true, meetingsPayload } once a slot is booked
//   { height: <px> } whenever its content height changes
// Only trust messages from HubSpot's own origins.
const isHubSpotOrigin = (origin) => /^https:\/\/([a-z0-9-]+\.)*hubspot\.com$/i.test(origin);

const WHAT_TO_EXPECT = [
  "A short chat about how your team researches today",
  "Sidney run live on a question you bring",
  "Time for questions with a Satorus founder",
];

const TRUST = [
  "Backed by University of Cambridge",
  "UK Founded",
];

function meetingsUrl() {
  const params = new URLSearchParams({ embed: "true" });
  // Forward utm_* onto the widget URL; HubSpot records them on the contact.
  const utm = getUtm();
  for (const key of UTM_KEYS) if (utm[key]) params.set(key, utm[key]);
  return `${MEETINGS_BASE}?${params.toString()}`;
}

/* Split a single "Name" field into HubSpot's firstname / lastname. */
function splitName(full) {
  const parts = full.trim().split(/\s+/);
  return { firstname: parts[0] || "", lastname: parts.slice(1).join(" ") };
}

const ContactForm = () => {
  const [status, setStatus] = React.useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("submitting");
    setErrorMsg("");
    const { name = "", ...rest } = Object.fromEntries(new FormData(form).entries());
    const data = { ...splitName(name), ...rest };

    // Drop empty optional fields so HubSpot doesn't store empty strings on
    // the contact record. pageUri carries any ?utm_* params, which HubSpot
    // picks up for source attribution.
    const fields = Object.entries(data)
      .filter(([, value]) => value && value.trim() !== "")
      .map(([name, value]) => ({ name, value: value.trim() }));

    try {
      const res = await fetch(HUBSPOT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          context: {
            pageUri: window.location.href,
            pageName: document.title,
          },
        }),
      });

      if (!res.ok) {
        // HubSpot returns 400 with { errors: [{ message }] } for validation
        // failures (bad email format, free-mail domain blocked).
        let msg = "Something went wrong. Please try again, or email harry@satorusgroup.com directly.";
        try {
          const body = await res.json();
          if (body?.errors?.length) {
            msg = body.errors.map(e => e.message).join(" ");
          } else if (body?.message) {
            msg = body.message;
          }
        } catch { /* response wasn't JSON; use default msg */ }
        setErrorMsg(msg);
        setStatus("error");
        return;
      }

      const utm = getUtm();
      track("demo_form_submitted", {
        utm_source:   utm.utm_source   ?? null,
        utm_campaign: utm.utm_campaign ?? null,
        utm_content:  utm.utm_content  ?? null,
      });
      setStatus("success");
      form.reset();
    } catch {
      // Network failure (offline, CORS, etc.)
      setErrorMsg("Couldn't reach the server. Check your connection and try again, or email harry@satorusgroup.com directly.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="dr-contact-done" role="status">
        <span className="dr-contact-done-i"><Icon name="check" size={16}/></span>
        <div>
          <div className="dr-contact-done-h">Thanks. We'll be in touch.</div>
          <p className="dr-contact-done-p">Expect an email from a Satorus founder within one working day.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="dr-form dr-contact-form" onSubmit={handleSubmit}>
      <div className="dr-row">
        <div className="dr-field">
          <label className="dr-label required" htmlFor="dr-name">Name</label>
          <input className="dr-input" id="dr-name" name="name" type="text" autoComplete="name" required/>
        </div>
      </div>

      <div className="dr-row split">
        <div className="dr-field">
          <label className="dr-label required" htmlFor="dr-email">Work email</label>
          <input className="dr-input" id="dr-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" required/>
        </div>
        <div className="dr-field">
          <label className="dr-label required" htmlFor="dr-company">Company</label>
          <input className="dr-input" id="dr-company" name="company" type="text" autoComplete="organization" required/>
        </div>
      </div>

      <div className="dr-row">
        <div className="dr-field">
          <label className="dr-label" htmlFor="dr-jobtitle">Job title</label>
          <input className="dr-input" id="dr-jobtitle" name="jobtitle" type="text" autoComplete="organization-title"/>
        </div>
      </div>

      <div className="dr-row">
        <div className="dr-field">
          <label className="dr-label" htmlFor="dr-message">How can Sidney help?</label>
          <textarea className="dr-textarea" id="dr-message" name="demo_request_details" rows="3" placeholder="Even a sentence helps us prepare."/>
          <span className="dr-hint">Anything you share stays between us.</span>
        </div>
      </div>

      {status === "error" && (
        <div className="dr-error" role="alert">
          <Icon name="alert" size={14}/>
          <span>{errorMsg}</span>
        </div>
      )}

      <button type="submit" className="btn btn-primary dr-submit" disabled={status === "submitting"} style={{ height: 44, padding: "0 22px" }}>
        {status === "submitting" ? "Sending…" : <>Get in touch <Icon name="arrow" size={14}/></>}
      </button>

      <p className="dr-fineprint">
        By submitting, you agree to be contacted by Satorus about Sidney. We
        won't add you to a marketing list. See our <a href="/legal/privacy">privacy policy</a>.
      </p>
    </form>
  );
};

export const DemoPage = () => {
  const [contactOpen, setContactOpen] = React.useState(false);
  const [booked, setBooked] = React.useState(false);
  const [frameHeight, setFrameHeight] = React.useState(null);
  const url = React.useMemo(meetingsUrl, []);

  // Landing event for the Vercel dashboard: which source/campaign/creative
  // brought this visitor to the demo page. Fires once per mount. Missing
  // params are sent as null so the event still shows up for direct traffic.
  React.useEffect(() => {
    const utm = getUtm();
    track("demo_page_viewed", {
      utm_source:   utm.utm_source   ?? null,
      utm_campaign: utm.utm_campaign ?? null,
      utm_content:  utm.utm_content  ?? null,
    });
  }, []);

  // Booking confirmation + iframe auto-height from the meetings embed.
  React.useEffect(() => {
    let bookedOnce = false;
    const onMessage = (e) => {
      if (!isHubSpotOrigin(e.origin) || !e.data || typeof e.data !== "object") return;
      if (e.data.meetingBookSucceeded && !bookedOnce) {
        bookedOnce = true;
        const utm = getUtm();
        track("demo_booked", {
          utm_source:   utm.utm_source   ?? null,
          utm_campaign: utm.utm_campaign ?? null,
          utm_content:  utm.utm_content  ?? null,
        });
        setBooked(true);
      }
      if (typeof e.data.height === "number" && e.data.height > 0) {
        setFrameHeight(Math.ceil(e.data.height));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section className="dr-page">
      <div className="dr-grid dr-grid-cal">
        <header className="dr-head">
          <div className="dr-pitch-label">Book a demo</div>
          <h1 className="dr-pitch-h">
            See Sidney run on a question <em>that matters to your team.</em>
          </h1>
          <p className="dr-pitch-sub">
            30 minutes with a Satorus founder. Pick a time that suits you and
            bring a real question. We'll run it through Sidney live.
          </p>
        </header>

        <div className="dr-cal">
          <div className="dr-meetings">
            <iframe
              src={url}
              title="Book a Sidney demo"
              className="dr-meetings-frame"
              style={frameHeight ? { height: frameHeight } : undefined}
              allow="clipboard-write"
            />
          </div>
          <p className="dr-meetings-fallback">
            Calendar not loading? <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => track("demo_cta_clicked")}>Open it in a new tab <Icon name="arrow" size={12}/></a>
          </p>

          {!booked && (
            <div className="dr-contact">
              <button
                type="button"
                className="dr-contact-toggle"
                aria-expanded={contactOpen}
                aria-controls="dr-contact-panel"
                onClick={() => setContactOpen(o => !o)}
              >
                <span>
                  <span className="dr-contact-toggle-h">Prefer we get in touch?</span>
                  <span className="dr-contact-toggle-p">Leave your details and we'll email you within one working day.</span>
                </span>
                <Icon name="chevdown" size={16} className={contactOpen ? "dr-chev open" : "dr-chev"}/>
              </button>
              <div id="dr-contact-panel" hidden={!contactOpen}>
                <ContactForm/>
              </div>
            </div>
          )}
        </div>

        <aside className="dr-details">
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
      </div>
    </section>
  );
};
