import React from "react";
import { NavA, HeroA } from "./SiteA-Hero.jsx";
import { ProductA, UseCasesA, TeamA, FooterA } from "./SiteA-Sections.jsx";
import { DemoPage } from "./SiteA-DemoPage.jsx";
import { ShowcaseA } from "./SiteA-Showcase.jsx";
import { ReportVizA } from "./SiteA-ReportViz.jsx";
import { CareersPage, JobPage } from "./SiteA-Careers.jsx";
import { GuidePage } from "./SiteA-Guide.jsx";

/* Tiny path-based router. Public pages: /, /demo, /careers, /careers/<slug>;
   hidden: /showcase, /report-viz. If we add many more we
   can swap this for React Router without touching the consumers — they all
   navigate via <a href="/..."> anchors which the global click interceptor
   below catches and turns into client-side pushState navigation.

   Hash links (e.g. /#use-cases): the interceptor handles them too. The path
   gets set to / (so the home page mounts if we were on /demo); a layout
   effect then scrolls to the requested anchor once the page has rendered. */

function scrollToHashOrTop() {
  const hash = window.location.hash;
  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
  }
  window.scrollTo(0, 0);
}

function useRoute() {
  const [path, setPath] = React.useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "/"
  );
  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = React.useCallback((to) => {
    const currentFull = window.location.pathname + window.location.hash;
    if (to === currentFull) {
      // Same exact URL. If it's a no-hash link (e.g. Home), still scroll
      // to top — that matches what the user expects when clicking Home
      // from a page they're already scrolled down on. Hash-targeted
      // re-clicks stay no-op.
      if (!to.includes("#")) window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.history.pushState({}, "", to);
    const newPath = window.location.pathname;
    if (newPath !== path) {
      // Path is changing — the layout effect on [path] in App will handle
      // scroll-to-hash-or-top once the new page renders.
      setPath(newPath);
    } else {
      // Same path, hash-only change — scroll immediately.
      scrollToHashOrTop();
    }
  }, [path]);
  return { path, navigate };
}

export default function App() {
  const { path, navigate } = useRoute();

  // After every path change, scroll to the URL hash if there is one (so a
  // click on /#company from /demo lands at the team section, not at the top
  // of the homepage). useLayoutEffect runs after DOM mutations but before
  // paint — the new page's sections are already in the DOM by then.
  React.useLayoutEffect(() => {
    scrollToHashOrTop();
  }, [path]);

  // /showcase (launch-event TV loop), /report-viz (engineering prototype) and
  // /careers and /guide (direct-link only, not linked from the site) are
  // hidden routes.
  // Keep them out of search: set
  // <meta name="robots" content="noindex"> while one is active, and remove it
  // again when navigating away.
  React.useEffect(() => {
    const isShowcase = path === "/showcase" || path === "/report-viz" || path === "/careers" || path.startsWith("/careers/") || path === "/guide";
    let meta = document.querySelector('meta[name="robots"][data-showcase]');
    if (isShowcase && !meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, nofollow";
      meta.dataset.showcase = "1";
      document.head.appendChild(meta);
    } else if (!isShowcase && meta) {
      meta.remove();
    }
  }, [path]);

  // Catch clicks on internal anchors and route via pushState instead of
  // letting the browser do a full page reload.
  React.useEffect(() => {
    const onClick = (e) => {
      // Honour cmd/ctrl-click (open in new tab) and target="_blank"
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const link = e.target.closest('a[href^="/"]');
      if (!link || link.target === "_blank") return;
      const href = link.getAttribute("href");
      if (!href) return;
      // /legal/* pages are static HTML served from public/, not SPA routes —
      // let the browser do a full navigation.
      if (href === "/legal" || href.startsWith("/legal/")) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  // Hidden launch-event display — full viewport, no site nav or footer.
  if (path === "/showcase") {
    return <ShowcaseA/>;
  }

  // Hidden engineering prototype — report visualisations test piece.
  if (path === "/report-viz") {
    return <ReportVizA/>;
  }

  return (
    <div style={{ minHeight: "100%", background: "var(--sidney-bg)" }}>
      <NavA/>
      <main id="main">
        {path === "/demo" ? (
          <DemoPage/>
        ) : path === "/careers" || path === "/careers/" ? (
          <CareersPage/>
        ) : path.startsWith("/careers/") ? (
          <JobPage slug={path.slice("/careers/".length).replace(/\/+$/, "")}/>
        ) : path === "/guide" || path === "/guide/" ? (
          <GuidePage/>
        ) : (
          <>
            <HeroA/>
            <ProductA/>
            <UseCasesA/>
            <TeamA/>
          </>
        )}
      </main>
      <FooterA/>
    </div>
  );
}
