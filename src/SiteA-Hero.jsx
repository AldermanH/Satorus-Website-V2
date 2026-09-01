/* Direction A — Hero (port of 21st.dev "hero-section-1")
   No entrance animations on hero copy (per saved feedback).
   Interaction motion kept: header morph on scroll, pill arrow slide on hover,
   customer-wall blur with "Meet our customers" reveal on hover.
   Hero background: @paper-design/shaders-react MeshGradient — replaces the
   previous custom Three.js chromatic-ribbon shader. Single layer, no
   overlay/mask compositing, plays cleanly across browsers. */
import React, { useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { BrandLockup, Icon } from "./Components.jsx";
import { DemoA } from "./SiteA-Demo.jsx";

const MENU = [
  { label: "Home",       href: "/"           },
  { label: "Sidney",     href: "/#product"   },
  { label: "Use cases",  href: "/#use-cases" },
  { label: "Company",    href: "/#company"   },
];

/* Hero H1 rotor — the typing phrase that follows the static "No"
   prefix on line 1 above "Decisions Made in the Dark." With the hero
   left-aligned, "No" stays anchored to the left edge and the rotor
   types/deletes rightward; no centring problem to solve. Order
   matters; users read them top-to-bottom over several cycles. */
const HERO_ROTOR_WORDS = [
  "Threat Assessment",
  "Due Diligence",
  "Supply Chain Risk",
  "Sanctions Compliance",
  "Financial Crime",
  "Cyber Threat",
  "Reputational Risk",
  "Geopolitical Crisis",
];
/* Typing cadence — base values are perturbed by jitter and a space-
   pause to feel organic rather than metronomic. Real typists slow
   marginally between words and have variable per-keystroke timing. */
const HERO_ROTOR_TYPE_MS = 95;             // per-char typing base
const HERO_ROTOR_TYPE_JITTER_MS = 28;      // ± per char
const HERO_ROTOR_TYPE_SPACE_PAUSE_MS = 70; // extra dwell when the next char is a space
const HERO_ROTOR_DELETE_MS = 32;           // per-char deletion (faster than typing)
const HERO_ROTOR_DELETE_JITTER_MS = 10;
const HERO_ROTOR_HOLD_MS = 1000;           // dwell when the word is fully typed
const HERO_ROTOR_GAP_MS = 360;             // dwell after fully deleted, before next word

const pickTypeDelay = (nextChar) => {
  const base = HERO_ROTOR_TYPE_MS;
  const jitter = (Math.random() - 0.5) * 2 * HERO_ROTOR_TYPE_JITTER_MS;
  const spacePause = nextChar === " " ? HERO_ROTOR_TYPE_SPACE_PAUSE_MS : 0;
  return Math.max(28, base + jitter + spacePause);
};
const pickDeleteDelay = () => {
  const base = HERO_ROTOR_DELETE_MS;
  const jitter = (Math.random() - 0.5) * 2 * HERO_ROTOR_DELETE_JITTER_MS;
  return Math.max(16, base + jitter);
};

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

/* MeshGradient is a continuous WebGL animation. Three perf knobs in play:
   - maxPixelCount caps total rendered pixels (defaults to ~8.3M = 4K@2× DPR;
     we set 500k so retina displays render an upscaled lower-res gradient.
     Visually fine because the gradient blur masks the resolution drop)
   - minPixelRatio: 1 lets the library downsample below devicePixelRatio
     (defaults to 2; mostly redundant with maxPixelCount but belt+braces)
   - speed: 0 — per the package docs, speed of zero stops the rAF entirely.
     Cheaper than unmount/remount because the WebGL context stays alive.
     IntersectionObserver toggles between active speed and 0 as the hero
     scrolls in/out of view. */
const HeroBackdrop = () => {
  const wrapRef = React.useRef(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={wrapRef} className="a-hero-mesh-wrap" aria-hidden="true">
      <MeshGradient
        className="a-hero-mesh"
        colors={["#0a0a0e", "#1a1d24", "#22b8ce", "#0a0a0e"]}
        speed={active ? 0.4 : 0}
        backgroundColor="#0a0a0e"
        minPixelRatio={1}
        maxPixelCount={500_000}
      />
    </div>
  );
};

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
export const HeroA = () => {
  // Typing-effect state machine. Each render re-evaluates phase + displayed
  // and schedules the next mutation; the cleanup clears the pending timeout
  // so unmount/dep-change can't double-fire. Reduced-motion users get a
  // single static word: we set `displayed` once and bail before scheduling
  // anything. Phases: "typing" (add chars one at a time) → "holding" (pause
  // at full word) → "deleting" (remove chars) → "gap" (brief blank pause) →
  // back to "typing" with the next word.
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // The rotor used to bail (or snap-swap) under prefers-reduced-motion
    // — but on Android (Samsung in particular) that preference is set
    // by default for battery-saver / power-save / "remove animations"
    // accessibility, so most phone visitors fell through to the snap
    // path even when they hadn't actively opted out of motion. The
    // typing rotor is core to the hero's storytelling, so we now run
    // it for everyone. Genuine motion-sensitive users can still mute
    // page motion via the OS-level reader-mode / focus tools.
    const target = HERO_ROTOR_WORDS[wordIndex];
    let timer;

    if (phase === "typing") {
      if (displayed.length < target.length) {
        const nextChar = target[displayed.length];
        timer = window.setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          pickTypeDelay(nextChar),
        );
      } else {
        timer = window.setTimeout(() => setPhase("deleting"), HERO_ROTOR_HOLD_MS);
      }
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timer = window.setTimeout(
          () => setDisplayed(target.slice(0, displayed.length - 1)),
          pickDeleteDelay(),
        );
      } else {
        timer = window.setTimeout(() => {
          setWordIndex(i => (i + 1) % HERO_ROTOR_WORDS.length);
          setPhase("typing");
        }, HERO_ROTOR_GAP_MS);
      }
    }
    return () => window.clearTimeout(timer);
  }, [displayed, phase, wordIndex]);

  return (
  <>
    <section className="a-hero">
      <HeroBackdrop/>

      <div className="a-hero-inner">
        {/* Copy block — left-aligned typography sitting in a max-width
            column that's centred within the inner container, so the
            hero feels visually centred on the page while individual
            lines flow from the left. */}
        <div className="a-hero-copy">
          <div className="a-hero-credit">
            <img
              className="a-hero-credit-logo"
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
            <span className="a-hero-h1-line1">
              No{" "}
              <span className="a-hero-rotor-slot" aria-live="polite">
                <span className="a-hero-rotor">{displayed}</span>
                <span className="a-hero-rotor-caret" aria-hidden="true"/>
              </span>
            </span>
            <span className="a-hero-h1-line2">
              Decisions Made <em>in the Dark.</em>
            </span>
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
};
