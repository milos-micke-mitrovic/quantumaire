import { COMPARISON } from "./content";

/**
 * Quantumaire's "grain of sand" reference.
 *
 * If Earth (diameter 12,742 km) shrinks to a single 0.5 mm grain of sand,
 * every other object in the universe shrinks by the same factor.
 *
 *   scaleFactor = grainSizeMeters / grainEqualsMeters
 */
export const SCALE_FACTOR =
  COMPARISON.grainSizeMeters / COMPARISON.grainEqualsMeters;

/** Convert real-world meters to "Quantumaire grain-scale" meters. */
export function toGrainScale(meters: number): number {
  return meters * SCALE_FACTOR;
}

/**
 * Format an arbitrary length in meters into a human-readable string.
 *
 * Sub-metre values use SI prefixes (fm, pm, nm, µm, mm).
 * Earth-and-up uses kilometres with comma grouping, then "million km" /
 * "billion km" once kilometres become unwieldy, then light-years for
 * anything bigger. Scientific notation is avoided in the UI.
 *
 * Pass an optional `t` for localised unit words ("million" / "miliona").
 */
export function formatMeters(
  meters: number | null,
  t?: (key: string) => string
): string {
  if (meters === null || !Number.isFinite(meters)) return "—";
  const abs = Math.abs(meters);
  if (abs === 0) return "0 m";

  const tr = t ?? defaultMetersTranslator;

  if (abs < 1e-12) return `${(meters * 1e15).toPrecision(3)} fm`;
  if (abs < 1e-9) return `${(meters * 1e12).toPrecision(3)} pm`;
  if (abs < 1e-6) return `${(meters * 1e9).toPrecision(3)} nm`;
  if (abs < 1e-3) return `${(meters * 1e6).toPrecision(3)} µm`;
  if (abs < 1) return `${(meters * 1e3).toPrecision(3)} mm`;
  if (abs < 1e3) return `${meters.toPrecision(3)} m`;

  // Kilometres with comma grouping up to 1,000,000 km (= 1e9 m).
  if (abs < 1e9) {
    const km = meters / 1e3;
    const digits = Math.abs(km) < 10 ? 1 : 0;
    return `${km.toLocaleString("en-US", { maximumFractionDigits: digits })} km`;
  }

  // Beyond a million km, switch to "million km" / "billion km" — much
  // friendlier than ten-digit numbers, and never scientific notation.
  if (abs < 1e12) {
    return `${(meters / 1e9).toPrecision(3)} ${tr("common.numberMillion")} km`;
  }
  if (abs < 1e15) {
    return `${(meters / 1e12).toPrecision(3)} ${tr("common.numberBillion")} km`;
  }

  // Light-year regime — keep growing into million / billion / trillion ly
  // rather than letting toPrecision switch to scientific notation.
  const ly = meters / 9.4607304725808e15;
  if (Math.abs(ly) < 1e3) return `${ly.toPrecision(3)} ly`;
  if (Math.abs(ly) < 1e6) {
    return `${Math.round(ly).toLocaleString("en-US")} ly`;
  }
  if (Math.abs(ly) < 1e9) {
    return `${(ly / 1e6).toPrecision(3)} ${tr("common.numberMillion")} ly`;
  }
  if (Math.abs(ly) < 1e12) {
    return `${(ly / 1e9).toPrecision(3)} ${tr("common.numberBillion")} ly`;
  }
  return `${(ly / 1e12).toPrecision(3)} ${tr("common.numberTrillion")} ly`;
}

const DEFAULT_METERS_LABELS: Record<string, string> = {
  "common.numberMillion": "million",
  "common.numberBillion": "billion",
};

function defaultMetersTranslator(key: string): string {
  return DEFAULT_METERS_LABELS[key] ?? key;
}

/**
 * Render a size relative to a 0.5 mm grain of sand.
 * Returns a multiplier — e.g. "12,000× a grain of sand" or "1/500 of a grain".
 */
export function compareToGrain(meters: number | null): {
  factor: number;
  mode: "times" | "fraction" | "equal" | "none";
} {
  if (meters === null) return { factor: 0, mode: "none" };
  const scaled = toGrainScale(meters);
  const ratio = scaled / COMPARISON.grainSizeMeters;
  if (Math.abs(ratio - 1) < 0.001) return { factor: 1, mode: "equal" };
  if (ratio >= 1) return { factor: ratio, mode: "times" };
  return { factor: 1 / ratio, mode: "fraction" };
}

/** Get a log10 position useful for slider/progress UIs. */
export function logPosition(
  meters: number | null,
  minExp = -18,
  maxExp = 27
): number {
  if (meters === null || meters <= 0) return 0;
  const exp = Math.log10(meters);
  return Math.min(1, Math.max(0, (exp - minExp) / (maxExp - minExp)));
}
