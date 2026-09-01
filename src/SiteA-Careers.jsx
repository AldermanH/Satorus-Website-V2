/* Careers (/careers) and role pages (/careers/<slug>)
   Copy lives in careers-content.jsx. This file is layout only.

   /careers        — pitch, open-roles list (the point of the page, so it
                     sits directly under the header), how-we-work manifest.
   /careers/<slug> — the job description as a document: header with meta
                     chips, body sections, sticky apply rail on desktop.

   Applications go to a prefilled mailto (subject = role title) rather than
   a form — at founding-team size the founder reads every one, and it
   avoids standing up an ATS for a single role. */
import React from "react";
import { Icon } from "./Components.jsx";
import { ROLES, PRINCIPLES, APPLY_EMAIL, roleBySlug } from "./careers-content.jsx";

const SITE_TITLE = "Satorus Group — AI Agents for High Stakes Intelligence";

/* Set <title> for the duration of the page; restore the site default on
   unmount so navigating back to / doesn't leave a stale careers title. */
const useDocumentTitle = (title) => {
  React.useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => { document.title = prev === title ? SITE_TITLE : prev; };
  }, [title]);
};

const applyHref = (role) => {
  const subject = `Application: ${role.title}`;
  const body = [
    "Hi Satorus team,",
    "",
    "A few lines on what I've built and why this problem interests me:",
    "",
    "",
    "Links (GitHub / work / LinkedIn):",
    "",
    "",
    "CV attached.",
  ].join("\n");
  return `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const formatPosted = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

/* ───── Shared: role row (list page) ───── */
const RoleRow = ({ role }) => (
  <li className="cr-role">
    <a className="cr-role-link" href={`/careers/${role.slug}`}>
      <div className="cr-role-main">
        <span className="cr-role-title">{role.title}</span>
      </div>
      <div className="cr-role-meta">
        <span>{role.location}</span>
        <span className="cr-role-sep" aria-hidden="true">·</span>
        <span>{role.type}</span>
      </div>
      <span className="cr-role-arrow" aria-hidden="true"><Icon name="arrow" size={16}/></span>
    </a>
  </li>
);

/* ═══════════════════════════ /careers ═══════════════════════════ */
export const CareersPage = () => {
  useDocumentTitle("Careers — Satorus Group");
  const teams = [...new Set(ROLES.map((r) => r.team))];

  return (
    <>
      {/* Header — same register as the /demo pitch column, no hero chrome. */}
      <section className="cr-head">
        <div className="container">
          <div className="cr-head-inner">
            <div className="a-section-label">Careers</div>
            <h1 className="cr-h1">Small team. Live customers. <em>Hard problems.</em></h1>
            <p className="cr-lede">
              Satorus builds AI agents for intelligence investigations. We're a founding
              team in London, backed by the University of Cambridge, with a platform
              already carrying real customer workloads. We hire slowly and deliberately:
              a handful of people who want to own a system end to end, not a seat on
              a large team.
            </p>
          </div>
        </div>
      </section>

      {/* Open roles — directly under the header, full width. This is what
          the page is for; everything else is supporting copy. */}
      <section className="cr-section cr-roles-section" id="open-roles">
        <div className="container">
          {teams.map((team) => (
            <div key={team} className="cr-roles-group">
              <div className="cr-roles-group-h">
                <span>Open roles · {team}</span>
                <span className="cr-roles-count">{ROLES.filter((r) => r.team === team).length}</span>
              </div>
              <ul className="cr-roles-list">
                {ROLES.filter((r) => r.team === team).map((r) => <RoleRow key={r.slug} role={r}/>)}
              </ul>
            </div>
          ))}
          <p className="cr-roles-note">
            Nothing that fits? We still want to hear from people who've taken a system
            past the prototype. <a href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent("Open application")}`}>Write to us</a> and
            tell us what you'd build.
          </p>
        </div>
      </section>

      {/* How we work — numbered manifest, the same device as the Team finale
          so the page reads as the same document as the homepage. */}
      <section className="a-section cr-section" id="how-we-work">
        <div className="container">
          <div className="cr-split">
            <div className="cr-split-aside">
              <div className="a-section-label">How we work</div>
              <h2 className="cr-h2">The same rules the job descriptions are written to.</h2>
            </div>
            <ol className="cr-manifest">
              {PRINCIPLES.map((p) => (
                <li key={p.lead}>
                  <div className="cr-manifest-lead">{p.lead}</div>
                  <p className="cr-manifest-body">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
};

/* ═══════════════════════ /careers/<slug> ════════════════════════ */

/* Google JobPosting structured data. Injected into <head> while the role page
   is mounted; Google renders the SPA, so this is picked up. Stripped on
   unmount so it never leaks onto another route. */
const useJobPostingSchema = (role) => {
  React.useEffect(() => {
    if (!role) return;
    const textOf = (items) => items.map((it) => `${it.lead} ${it.body}`).join(" ");
    const description = [
      role.summary,
      ...role.sections.map((s) =>
        `${s.h}: ${s.items ? textOf(s.items) : s.groups.map((g) => `${g.h}: ${textOf(g.items)}`).join(" ")}`
      ),
    ].join("\n\n");
    const data = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      title: role.title,
      description,
      datePosted: role.posted,
      employmentType: role.type.toUpperCase().replace("-", "_"),
      hiringOrganization: {
        "@type": "Organization",
        name: "Satorus Group",
        sameAs: "https://www.satorusgroup.com",
        logo: "https://www.satorusgroup.com/assets/satorus-icon-cyan.svg",
      },
      jobLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressLocality: role.location, addressCountry: "GB" },
      },
      directApply: true,
      ...(role.closes ? { validThrough: `${role.closes}T23:59:59Z` } : {}),
      ...(role.salary ? {
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: role.salary.currency || "GBP",
          value: { "@type": "QuantitativeValue", minValue: role.salary.min, maxValue: role.salary.max, unitText: "YEAR" },
        },
      } : {}),
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.careers = "1";
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
    return () => el.remove();
  }, [role]);
};

const ItemList = ({ items }) => (
  <ul className="cr-items">
    {items.map((it) => (
      <li key={it.lead} className="cr-item">
        <span className="cr-item-lead">{it.lead}</span>{" "}
        <span className="cr-item-body">{it.body}</span>
      </li>
    ))}
  </ul>
);

const RoleNotFound = () => {
  useDocumentTitle("Role closed — Satorus Group");
  return (
    <section className="cr-head cr-notfound">
      <div className="container">
        <div className="cr-head-inner">
          <div className="a-section-label">Careers</div>
          <h1 className="cr-h1">That role is no longer open.</h1>
          <p className="cr-lede">
            It may have been filled or withdrawn. The current openings are listed
            on the careers page, and we still read every open application.
          </p>
          <a className="btn btn-primary cr-btn" href="/careers">
            See open roles <Icon name="arrow" size={14}/>
          </a>
        </div>
      </div>
    </section>
  );
};

export const JobPage = ({ slug }) => {
  const role = roleBySlug(slug);
  useDocumentTitle(role ? `${role.title} — Careers — Satorus Group` : "Role closed — Satorus Group");
  useJobPostingSchema(role);
  if (!role) return <RoleNotFound/>;

  const href = applyHref(role);
  const comp = role.salary
    ? `£${role.salary.min.toLocaleString("en-GB")}–£${role.salary.max.toLocaleString("en-GB")}`
    : null;
  const facts = [
    { k: "Location",   v: role.location },
    { k: "Type",       v: role.type },
    role.reportsTo && { k: "Reports to", v: role.reportsTo },
    comp && { k: "Salary", v: comp },
    { k: "Posted",     v: formatPosted(role.posted) },
  ].filter(Boolean);

  return (
    <article className="cr-job">
      {/* Header */}
      <header className="cr-job-head">
        <div className="container">
          <a className="cr-back" href="/careers">
            <Icon name="chevright" size={14} className="cr-back-chev"/> All roles
          </a>
          <div className="cr-job-head-row">
            <div className="cr-job-head-main">
              <div className="a-section-label">{role.team} · {role.location}</div>
              <h1 className="cr-job-h1">{role.title}</h1>
              <ul className="cr-chips" aria-label="Role details">
                <li className="cr-chip"><span className="dot"/>{role.type}</li>
                {role.reportsTo && <li className="cr-chip">Reports to {role.reportsTo}</li>}
                {comp && <li className="cr-chip">{comp}</li>}
              </ul>
            </div>
            <a className="btn btn-primary cr-btn cr-job-head-cta" href={href}>
              Apply for this role <Icon name="arrow" size={14}/>
            </a>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="cr-job-grid">
          {/* Body */}
          <div className="cr-job-body">
            <p className="cr-job-summary">{role.summary}</p>

            {role.sections.map((s) => (
              <section key={s.h} className="cr-job-section">
                <h2 className="cr-job-h2">{s.h}</h2>
                {s.intro && <p className="cr-job-p">{s.intro}</p>}
                {s.items && <ItemList items={s.items}/>}
                {s.groups && s.groups.map((g) => (
                  <div key={g.h} className="cr-job-group">
                    <h3 className="cr-job-h3">{g.h}</h3>
                    <ItemList items={g.items}/>
                  </div>
                ))}
              </section>
            ))}

            <section className="cr-job-section" id="how-to-apply">
              <h2 className="cr-job-h2">How to apply</h2>
              <p className="cr-job-p">
                Email <a className="cr-inline-link" href={href}>{APPLY_EMAIL}</a> with
                “{role.title}” in the subject. The button below prefills it. Include:
              </p>
              <ul className="cr-items cr-items-tight">
                <li className="cr-item"><span className="cr-item-body">A link to something you've built and shipped: a repo, a product, a write-up.</span></li>
                <li className="cr-item"><span className="cr-item-body">A CV or LinkedIn.</span></li>
                <li className="cr-item"><span className="cr-item-body">Three to five sentences on why this problem, in your own words.</span></li>
                <li className="cr-item"><span className="cr-item-body">Where you're based and your right to work in the UK.</span></li>
              </ul>
              <p className="cr-job-p">
                No cover letter. A founder reads every application, and we reply to all of them.
              </p>
              <div className="cr-job-foot">
                <a className="btn btn-primary cr-btn" href={href}>
                  Apply for this role <Icon name="arrow" size={14}/>
                </a>
                <a className="cr-job-foot-link" href="/careers">Back to all roles</a>
              </div>
            </section>
          </div>

          {/* Sticky rail — facts + apply. Collapses above the body on mobile. */}
          <aside className="cr-rail">
            <div className="cr-rail-card">
              <dl className="cr-facts">
                {facts.map((f) => (
                  <div key={f.k} className="cr-fact">
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
                {role.stack?.length > 0 && (
                  <div className="cr-fact">
                    <dt>Stack</dt>
                    <dd className="cr-fact-tags">{role.stack.map((t) => <span key={t} className="a-tag">{t}</span>)}</dd>
                  </div>
                )}
              </dl>
              <a className="btn btn-primary cr-btn cr-rail-cta" href={href}>
                Apply for this role <Icon name="arrow" size={14}/>
              </a>
              <p className="cr-rail-note">
                Questions before applying? <a href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Question: ${role.title}`)}`}>Ask us</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};
