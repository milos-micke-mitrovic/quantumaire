/**
 * Quantumaire mark: three circles growing from one shared point — the same
 * thing at ever larger scales (particle → planet → cosmos) — plus a star. Hand-written SVG so it stays
 * crisp at 16 px and weighs a few hundred bytes.
 */
const GRADIENT = `<linearGradient id="qg" x1="8" y1="8" x2="58" y2="58" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#7c5cff"/><stop offset="1" stop-color="#f0abfc"/></linearGradient>`;

const MARK = `<circle cx="34" cy="30" r="22" fill="none" stroke="url(#qg)" stroke-width="4.5"/><circle cx="25.5" cy="38.5" r="10" fill="none" stroke="url(#qg)" stroke-width="3" opacity=".9"/><circle cx="21" cy="43" r="3.8" fill="#e0f2fe"/><path d="M47 13.5l1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3-3.3-1.2 3.3-1.2z" fill="#e0f2fe"/>`;

/** Transparent mark (header, inline use). */
export function logoSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>${GRADIENT}</defs>${MARK}</svg>`;
}

/**
 * App-icon version on the site's night background. `pad` shrinks the mark
 * toward the centre (maskable icons need a ~20% safe zone).
 */
export function iconSvg({ pad = 0, rounded = true }: { pad?: number; rounded?: boolean } = {}): string {
  const s = 1 - pad * 2;
  const offset = 64 * pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>${GRADIENT}<radialGradient id="bg" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#1a1245"/><stop offset="1" stop-color="#03030a"/></radialGradient></defs><rect width="64" height="64" rx="${rounded ? 14 : 0}" fill="url(#bg)"/><g transform="translate(${offset} ${offset}) scale(${s})">${MARK}</g></svg>`;
}
