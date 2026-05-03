import React from "react";
import { NavA, HeroA } from "./SiteA-Hero.jsx";
import { UseCasesA, ProductA, TeamA, CtaA, FooterA } from "./SiteA-Sections.jsx";
import { DemoPage } from "./SiteA-DemoPage.jsx";

/* Tiny path-based router. Two pages today (/ and /demo); if we add more we
   can swap this for React Router without touching the consumers — they all
   navigate via <a href="/..."> anchors which the global click interceptor
   below catches and turns into client-side pushState navigation. */
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
    if (to === window.location.pathname) return;
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);
  return { path, navigate };
}

export default function App() {
  const { path, navigate } = useRoute();

  // Catch clicks on internal anchors and route via pushState instead of
  // letting the browser do a full page reload.
  React.useEffect(() => {
    const onClick = (e) => {
      // Honour cmd/ctrl-click (open in new tab) and target="_blank"
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const link = e.target.closest('a[href^="/"]');
      if (!link) return;
      const href = link.getAttribute("href");
      // Skip hash links (let the browser scroll to anchors normally)
      if (!href || href.startsWith("/#") || link.target === "_blank") return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  return (
    <div style={{ minHeight: "100%", background: "var(--sidney-bg)" }}>
      <NavA/>
      <main id="main">
        {path === "/demo" ? (
          <DemoPage/>
        ) : (
          <>
            <HeroA/>
            <ProductA/>
            <UseCasesA/>
            <TeamA/>
            <CtaA/>
          </>
        )}
      </main>
      <FooterA/>
    </div>
  );
}
