/* Direction A — Hero (port of 21st.dev "hero-section-1")
   No entrance animations on hero copy (per saved feedback).
   Interaction motion kept: header morph on scroll, pill arrow slide on hover,
   customer-wall blur with "Meet our customers" reveal on hover. */
import React, { useEffect, useState } from "react";
import { BrandLockup, Icon } from "./Components.jsx";
import { DemoA } from "./SiteA-Demo.jsx";
import WebGLShader from "./WebGLShader.jsx";

const MENU = [
  { label: "Sidney",     href: "/#product"   },
  { label: "Use cases",  href: "/#use-cases" },
  { label: "Company",    href: "/#company"   },
];

const CUSTOMERS = [
  { name: "BBC",                   src: "/assets/customer-bbc.svg",         h: 22 },
  { name: "Dow Jones",             src: "/assets/customer-dow-jones.svg",   h: 18 },
  { name: "Al Jazeera",            src: "/assets/customer-al-jazeera.png",  h: 28 },
  { name: "Oxfam",                 src: "/assets/customer-oxfam.svg",       h: 28 },
  { name: "GardaWorld",            src: "/assets/customer-gardaworld.png",  h: 24 },
  { name: "Deloitte",              src: "/assets/customer-deloitte.svg",    h: 18 },
];

/* Flat track of duplicated logos. Each logo carries its own trailing gap
   (margin-right in CSS), so `translateX(-50%)` lands exactly on a set boundary.
   For that loop to look seamless at any viewport width, ONE HALF of the track
   must be wider than the viewport — otherwise the animation runs past the right
   edge and you see blank space. 6 CUSTOMERS × ~150px ≈ 900px per copy, so we
   repeat 6 times total (3 per half ≈ 2700px) to safely cover any desktop. */
const MARQUEE_LOGOS = Array.from({ length: 6 }, () => CUSTOMERS).flat();

// ───────── Sticky header — morphs into a pill on scroll ─────────
export const NavA = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="a-hh-shell">
      <nav
        className={`a-hh${scrolled ? " scrolled" : ""}`}
        data-state={open ? "active" : ""}
        aria-label="Primary"
      >
        <div className="a-hh-inner">
          <div className="a-hh-row">
            <div className="a-hh-brand">
              <a href="/" aria-label="Home"><BrandLockup size={28}/></a>
            </div>

            <button
              type="button"
              className="a-hh-mobile-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(o => !o)}
            >
              <Icon name={open ? "x" : "menu"} size={22}/>
            </button>

            <ul className="a-hh-menu">
              {MENU.map(item => (
                <li key={item.label}>
                  <a className="a-hh-link" href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>

            <div className="a-hh-actions">
              <ul className="a-hh-menu-mobile">
                {MENU.map(item => (
                  <li key={item.label}>
                    <a className="a-hh-link" href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
                  </li>
                ))}
              </ul>
              <div className="a-hh-buttons">
                <a href="/demo" className="btn btn-primary" style={{ height: 34 }}>
                  Request a demo <Icon name="arrow" size={14}/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

// ───────── Hero — full-screen text + shader; the demo lives in its own section below ─────────
export const HeroA = () => (
  <>
    <section className="a-hero">
      {/* Angled spotlight beams (decorative; lg+ only) */}
      <div className="a-hero-spotlight" aria-hidden="true">
        <div className="a-hero-spot a-hero-spot-1"/>
        <div className="a-hero-spot a-hero-spot-2"/>
        <div className="a-hero-spot a-hero-spot-3"/>
      </div>

      {/* Backdrop: two animated WebGL shaders — one with beams below the hero
          glowing up, the other a vertical mirror with beams above glowing down.
          Bottom-edge fade is handled by the .a-hero::after afterglow. */}
      <div className="a-hero-bg" aria-hidden="true">
        <WebGLShader className="a-hero-shader a-hero-shader-top" xScale={1.2} yScale={0.6} distortion={0.55}/>
        <WebGLShader className="a-hero-shader a-hero-shader-bottom" xScale={1.2} yScale={0.6} distortion={0.55}/>
      </div>

      <div className="a-hero-inner">
        <div
          className="a-hero-pill a-hero-pill-static"
          role="group"
          aria-label="Backed by the University of Cambridge"
        >
          <img
            className="a-hero-pill-logo"
            src="/assets/cambridge-arms.svg"
            alt=""
            aria-hidden="true"
            width="18"
            height="21"
            loading="lazy"
          />
          <span>Backed by the University of Cambridge</span>
        </div>

        <h1 className="a-hero-h1">
          No Serious Decision<br/>
          Made <em>in the Dark.</em>
        </h1>

        <p className="a-hero-sub">
          Sidney runs the investigation. You make the call. Every claim sourced.
          Nothing asserted beyond the evidence.
        </p>

        <div className="a-hero-ctas">
          <a href="/demo" className="btn btn-primary a-hero-cta-primary">
            Request a demo <Icon name="arrow" size={14}/>
          </a>
          <a className="btn btn-plain a-hero-cta-secondary" href="/#live-demo">
            Watch Sidney run
          </a>
        </div>
      </div>
    </section>

    {/* Live demo — the first scroll target after the hero */}
    <section className="a-section a-hero-demo" id="live-demo">
      <div className="container">
        <div className="a-section-head">
          <div>
            <div className="a-section-label">The product · live</div>
            <h2 className="a-section-h">Watch an investigation <em>assemble itself.</em></h2>
          </div>
          <p className="a-section-p">Real query. Real subject. Watch Sidney turn raw information into finished intelligence.</p>
        </div>
        <div className="a-hero-mockup-wrap">
          <div className="a-hero-mockup-fade" aria-hidden="true"/>
          <div className="a-hero-mockup a-hero-mockup-live">
            <DemoA/>
          </div>
        </div>
      </div>
    </section>

    {/* Trusted-by marquee — disabled until we have real customer logos to show.
        Un-comment the block below to restore it. JSX, CSS (.a-marquee* rules
        in site-a.css), customer SVGs in public/assets/, and the CUSTOMERS /
        MARQUEE_LOGOS constants above are all still in place. */}
    {/*
    <div className="a-marquee" aria-labelledby="trusted-by-label">
      <p id="trusted-by-label" className="a-marquee-label">
        Trusted by investigations desks, audit firms &amp; protective-intelligence teams
      </p>
      <div className="a-marquee-viewport">
        <div className="a-marquee-track" aria-hidden="true">
          {MARQUEE_LOGOS.map((c, i) => (
            <img
              key={`${c.name}-${i}`}
              className="a-marquee-logo"
              src={c.src}
              alt=""
              style={{ height: c.h }}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>
    </div>
    */}
  </>
);
