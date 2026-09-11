/* UTM pass-through.

   Reads utm_* params from the page URL once and keeps them in memory for the
   life of the SPA session (no cookies, no storage). The router appends them
   to every internal navigation so a visitor who lands on /?utm_source=x and
   clicks "Request a demo" arrives at /demo?utm_source=x — where the demo page
   forwards them to the HubSpot meetings embed and the Vercel custom event,
   and the form's pageUri carries them to the HubSpot contact record. */

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];

// Sticky: once a key is seen on any URL it survives navigations that drop it.
const captured = {};

function readFromUrl(search) {
  const out = {};
  const sp = new URLSearchParams(search || "");
  for (const key of UTM_KEYS) {
    const v = sp.get(key);
    if (v && v.trim()) out[key] = v.trim().slice(0, 255); // Vercel caps property values at 255 chars
  }
  return out;
}

/* Current UTM set: whatever is on the URL right now, merged over anything
   captured earlier in this session. */
export function getUtm() {
  if (typeof window !== "undefined") {
    Object.assign(captured, readFromUrl(window.location.search));
  }
  return { ...captured };
}

/* Append the captured UTM params to a URL. Accepts a same-origin href
   ("/demo", "/#use-cases", "/demo?x=1") or an absolute URL string. Params
   already present on the target are left as they are. Returns the same shape
   it was given: a path+search+hash string for internal hrefs, a full URL
   string for absolute ones. */
export function withUtm(href) {
  const utm = getUtm();
  if (!Object.keys(utm).length) return href;
  const isAbsolute = /^[a-z][a-z0-9+.-]*:/i.test(href);
  const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  let url;
  try {
    url = new URL(href, base);
  } catch {
    return href;
  }
  for (const [k, v] of Object.entries(utm)) {
    if (!url.searchParams.has(k)) url.searchParams.set(k, v);
  }
  return isAbsolute ? url.toString() : url.pathname + url.search + url.hash;
}
