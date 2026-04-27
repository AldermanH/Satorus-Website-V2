/* Shared components for website */
export const SatorusMark = ({ size = 24, color = "currentColor", spin = false, className = "" }) => (
  <svg width={size} height={(size * 141) / 153} viewBox="0 0 153 141" fill="none"
       className={className} style={{ animation: spin ? "sidneySpinSlow 4s linear infinite" : undefined, display: "block" }}>
    <path fillRule="evenodd" clipRule="evenodd"
      d="M25.7539 76.5424C10.7156 70.9597 0 56.4812 0 39.5C0 17.6848 17.6848 0 39.5 0C52.6359 0 64.2742 6.41206 71.4556 16.277C45.2626 23.9083 26.0659 47.9595 25.7539 76.5424ZM25.7539 76.5424C25.7513 76.778 25.75 77.0138 25.75 77.25C25.75 112.32 54.1799 140.75 89.25 140.75C124.32 140.75 152.75 112.32 152.75 77.25C152.75 42.1799 124.32 13.75 89.25 13.75C83.0728 13.75 77.1017 14.632 71.4556 16.277C76.2007 22.7951 79 30.8206 79 39.5C79 61.3152 61.3152 79 39.5 79C34.666 79 30.0348 78.1316 25.7539 76.5424Z"
      fill={color}/>
  </svg>
);

export const Icon = ({ name, size = 16, stroke = 1.6, className = "" }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    arrow: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    chevdown: <path d="m6 9 6 6 6-6"/>,
    check: <path d="M20 6 9 17l-5-5"/>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>,
    doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></>,
    network: <><circle cx="12" cy="12" r="2"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/><path d="m6 6 4 4M18 6l-4 4M6 18l4-4M18 18l-4-4"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    alert: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>,
    branch: <><circle cx="6" cy="3" r="3"/><path d="M6 21V6M18 9a9 9 0 0 1-12 6"/><circle cx="18" cy="6" r="3"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    sparkle: <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 15 4-6 4 3 5-8"/></>,
    dot: <circle cx="12" cy="12" r="5"/>,
    newspaper: <><path d="M4 4h14v16H6a2 2 0 0 1-2-2z"/><path d="M18 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2"/><path d="M8 8h6M8 12h6M8 16h4"/></>,
    crosshair: <><circle cx="12" cy="12" r="10"/><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4"/></>,
    chevright: <path d="m9 18 6-6-6-6"/>,
    menu: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
};

// Satorus brand-lockup — single SVG containing mark + Palantir-style wordmark, white.
// `size` is interpreted as the lockup's height in px; width auto-scales (~4× the height).
export const BrandLockup = ({ size = 22 }) => (
  <img
    src="/assets/satorus-logo.svg"
    alt="Satorus"
    style={{ height: size, width: "auto", display: "block" }}
  />
);

