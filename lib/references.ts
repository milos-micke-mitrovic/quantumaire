/**
 * Scale-adaptive reference objects.
 *
 * The grain-of-sand metaphor works as the journey-wide brand frame, but for
 * per-stop comparisons it only makes sense on macro scales. A quark
 * compared to a grain of sand is just bigger numbers — not bigger insight.
 *
 * `REFERENCES` is a curated list of everyday objects spanning the full
 * journey. For any given length we pick the closest reference in log space
 * and show "N× bigger / smaller than [reference]", which gives users
 * something tangible at their scale.
 *
 * Reference identifiers map to `references.<id>` in the translation files.
 */

/**
 * Whether a reference is the *size* of an object (a diameter, width, or
 * length) or the *distance* between objects (Earth–Moon, 1 AU, etc.).
 *
 * Different stop comparisons need different kinds. The "Real scale" panel
 * comparing Jupiter's diameter to something should pick a *size* reference,
 * not the Earth–Moon distance.
 */
export type ReferenceKind = "size" | "distance";

export interface Reference {
  id: string;
  /** True real-world value in metres (a diameter or a distance). */
  meters: number;
  kind: ReferenceKind;
}

export const REFERENCES: Reference[] = [
  { id: "hair", meters: 8e-5, kind: "size" }, // 80 µm — width of human hair
  { id: "grainOfSand", meters: 5e-4, kind: "size" }, // 0.5 mm — Quantumaire's anchor
  { id: "coin", meters: 2.5e-2, kind: "size" }, // 2.5 cm — a coin
  { id: "person", meters: 1.7, kind: "size" }, // average adult height
  { id: "footballPitch", meters: 105, kind: "size" }, // length
  { id: "eiffelTower", meters: 330, kind: "size" }, // height
  { id: "everest", meters: 8848, kind: "size" }, // height
  { id: "earthDiameter", meters: 1.2742e7, kind: "size" }, // Earth — diameter
  { id: "moonDistance", meters: 3.844e8, kind: "distance" }, // Earth–Moon distance
  { id: "sun", meters: 1.39e9, kind: "size" }, // Sun — diameter
  { id: "au", meters: 1.496e11, kind: "distance" }, // 1 AU — Earth–Sun distance
  // Real cosmic destinations instead of "1 light-year" (a unit isn't a
  // useful comparison target — "53 million× farther than 1 light-year"
  // just restates the number).
  { id: "proximaCentauri", meters: 4.014e16, kind: "distance" }, // 4.24 ly — nearest star
  { id: "galacticCenter", meters: 2.46e20, kind: "distance" }, // ~26,000 ly — Milky Way centre
  { id: "andromedaDistance", meters: 2.4e22, kind: "distance" }, // ~2.5M ly — Andromeda galaxy
];

/** Look up a single reference by id. */
export function getReference(id: string): Reference | undefined {
  return REFERENCES.find((r) => r.id === id);
}

export type ComparisonMode = "aboutThe" | "biggerThan" | "smallerThan";

export interface ScaleComparison {
  reference: Reference;
  factor: number;
  mode: ComparisonMode;
}

/**
 * A purely-qualitative placement of a length — used when we want a vivid
 * comparison without showing any big numerical factor. The phrasing reads
 * like "between a hair and a grain of sand" instead of "800 K× smaller".
 */
export type QualitativeMode =
  | "aboutThe"
  | "between"
  | "smallerThanAll"
  | "biggerThanAll";

export interface QualitativePosition {
  mode: QualitativeMode;
  /** Anchor reference for `aboutThe` / single-sided modes. */
  reference?: Reference;
  /** Lower bracket reference for `between` mode. */
  lower?: Reference;
  /** Upper bracket reference for `between` mode. */
  upper?: Reference;
}

/**
 * Pick a "between two references" or "about a reference" placement for any
 * length, without ever showing a factor. Returns `null` for non-positive
 * input.
 */
export function describePosition(meters: number): QualitativePosition | null {
  if (!Number.isFinite(meters) || meters <= 0) return null;

  // Closest in log space → if very close, just say "about the size of X".
  const closest = pickReference(meters);
  const logDiff = Math.log10(meters) - Math.log10(closest.meters);
  if (Math.abs(logDiff) < 0.3) {
    return { mode: "aboutThe", reference: closest };
  }

  // Otherwise locate the two refs the value sits between, in ascending order.
  const sorted = [...REFERENCES].sort((a, b) => a.meters - b.meters);
  let lower: Reference | undefined;
  let upper: Reference | undefined;
  for (const r of sorted) {
    if (r.meters <= meters) lower = r;
    if (r.meters >= meters && !upper) upper = r;
  }
  if (lower && upper && lower !== upper) {
    return { mode: "between", lower, upper };
  }
  if (!lower && upper) {
    return { mode: "smallerThanAll", reference: upper };
  }
  if (lower && !upper) {
    return { mode: "biggerThanAll", reference: lower };
  }
  return { mode: "aboutThe", reference: closest };
}

/**
 * Pick the reference whose log size is closest to `meters`. Optionally
 * restrict to a specific kind ("size" or "distance"); when the kind
 * filter rejects all references, falls back to the full set so the panel
 * still has *something* to compare against.
 *
 * Pass `opts.excludeNearSelf: true` to skip any reference that's
 * essentially the same value as the input. Useful for the visual-
 * comparison panel: the Sun stop matches the "sun" reference exactly,
 * which would show the same number twice — with this flag the picker
 * falls through to the next-closest reference (Earth, 109× smaller),
 * giving a comparison that actually tells the viewer something.
 */
const SELF_MATCH_LOG_THRESHOLD = 0.05;

export function pickReference(
  meters: number,
  kind?: ReferenceKind,
  opts?: { excludeNearSelf?: boolean }
): Reference {
  const pool = kind ? REFERENCES.filter((r) => r.kind === kind) : REFERENCES;
  const candidates = pool.length > 0 ? pool : REFERENCES;
  let best: Reference | null = null;
  let bestDiff = Infinity;
  const inputLog = Math.log10(meters);
  for (const r of candidates) {
    const diff = Math.abs(inputLog - Math.log10(r.meters));
    if (opts?.excludeNearSelf && diff < SELF_MATCH_LOG_THRESHOLD) continue;
    if (diff < bestDiff) {
      bestDiff = diff;
      best = r;
    }
  }
  return best ?? candidates[0];
}

/**
 * Compare a length to the best-fit reference and return the data needed to
 * render a human-readable line.
 *
 * Returns `null` for non-finite or non-positive inputs. The caller should
 * treat that as "abstract — no comparison".
 */
export function compareToReference(meters: number): ScaleComparison | null {
  if (!Number.isFinite(meters) || meters <= 0) return null;
  const reference = pickReference(meters);
  const ratio = meters / reference.meters;
  // Within ±0.3 log decades → call it "about the same size".
  if (Math.abs(Math.log10(ratio)) < 0.18) {
    return { reference, factor: 1, mode: "aboutThe" };
  }
  if (ratio >= 1) {
    return { reference, factor: ratio, mode: "biggerThan" };
  }
  return { reference, factor: 1 / ratio, mode: "smallerThan" };
}

/**
 * Format a numeric factor for human reading.
 *
 * - < 1,000 → plain (e.g. "850", "10.5", "1.5")
 * - 1,000 – 999,999 → comma-grouped (e.g. "1,880")
 * - 1 million – 999 billion → spelled out via translator (e.g. "1.88 million")
 * - 1 trillion – 999 trillion → spelled out (e.g. "2.7 trillion")
 * - >= 10¹⁵ → scientific notation (e.g. "1.5 × 10¹⁵")
 *
 * `t` is an optional translation function used to localise the unit
 * names. When omitted, English defaults are used.
 */
export function formatFactor(
  factor: number,
  t?: (key: string) => string
): string {
  const tr = t ?? defaultTranslator;
  if (!Number.isFinite(factor) || factor < 0) return String(factor);

  if (factor >= 1e15) {
    const exp = Math.floor(Math.log10(factor));
    const mantissa = factor / Math.pow(10, exp);
    return `${mantissa.toPrecision(3)} × 10${toSuperscript(exp)}`;
  }
  if (factor >= 1e12) {
    return `${(factor / 1e12).toPrecision(3)} ${tr("common.numberTrillion")}`;
  }
  if (factor >= 1e9) {
    return `${(factor / 1e9).toPrecision(3)} ${tr("common.numberBillion")}`;
  }
  if (factor >= 1e6) {
    return `${(factor / 1e6).toPrecision(3)} ${tr("common.numberMillion")}`;
  }
  if (factor >= 1000) return Math.round(factor).toLocaleString("en-US");
  if (factor >= 100) return factor.toFixed(0);
  if (factor >= 10) return factor.toFixed(1);
  return factor.toFixed(2);
}

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

function toSuperscript(n: number): string {
  return String(n)
    .split("")
    .map((ch) => SUPERSCRIPTS[ch] ?? ch)
    .join("");
}

const DEFAULT_LABELS: Record<string, string> = {
  "common.numberMillion": "million",
  "common.numberBillion": "billion",
  "common.numberTrillion": "trillion",
};

function defaultTranslator(key: string): string {
  return DEFAULT_LABELS[key] ?? key;
}
