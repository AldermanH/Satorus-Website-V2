import React from "react";
import { NavA, HeroA } from "./SiteA-Hero.jsx";
import { UseCasesA, ProductA, TeamA, CtaA, FooterA } from "./SiteA-Sections.jsx";

export default function App() {
  return (
    <div style={{ minHeight: "100%", background: "var(--sidney-bg)" }}>
      <NavA/>
      <main id="main">
        <HeroA/>
        <ProductA/>
        <UseCasesA/>
        <TeamA/>
        <CtaA/>
      </main>
      <FooterA/>
    </div>
  );
}
