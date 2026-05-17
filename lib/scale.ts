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
 *
 * Pass `units: "imperial"` to render feet/miles at the macro scale instead of
 * metres/kilometres. Sub-metre lengths stay in SI (mm, µm, nm, pm, fm) in
 * both systems — those are scientific units, not metric/imperial. Above the
 * light-year threshold the unit is `ly` in both systems too.
 */
const MILE_M = 1609.344;
const FOOT_M = 0.3048;

export function formatMeters(
  meters: number | null,
  t?: (key: string) => string,
  units: "metric" | "imperial" = "metric"
): string {
  if (meters === null || !Number.isFinite(meters)) return "—";
  const abs = Math.abs(meters);
  if (abs === 0) return "0 m";

  const tr = t ?? defaultMetersTranslator;

  // Sub-metre: SI prefixes are universal across both systems.
  if (abs < 1e-12) return `${(meters * 1e15).toPrecision(3)} fm`;
  if (abs < 1e-9) return `${(meters * 1e12).toPrecision(3)} pm`;
  if (abs < 1e-6) return `${(meters * 1e9).toPrecision(3)} nm`;
  if (abs < 1e-3) return `${(meters * 1e6).toPrecision(3)} µm`;
  if (abs < 1) return `${(meters * 1e3).toPrecision(3)} mm`;

  if (units === "imperial") {
    if (abs < 1e3) {
      const ft = meters / FOOT_M;
      return `${ft.toPrecision(3)} ft`;
    }
    if (abs < 1.609e9) {
      const mi = meters / MILE_M;
      const digits = Math.abs(mi) < 10 ? 1 : 0;
      return `${mi.toLocaleString("en-US", { maximumFractionDigits: digits })} mi`;
    }
    if (abs < 1.609e12) {
      return `${(meters / (1e6 * MILE_M)).toPrecision(3)} ${tr("common.numberMillion")} mi`;
    }
    if (abs < 1e15) {
      return `${(meters / (1e9 * MILE_M)).toPrecision(3)} ${tr("common.numberBillion")} mi`;
    }
    // fall through to light-years
  } else {
    if (abs < 1e3) return `${meters.toPrecision(3)} m`;
    if (abs < 1e9) {
      const km = meters / 1e3;
      const digits = Math.abs(km) < 10 ? 1 : 0;
      return `${km.toLocaleString("en-US", { maximumFractionDigits: digits })} km`;
    }
    if (abs < 1e12) {
      return `${(meters / 1e9).toPrecision(3)} ${tr("common.numberMillion")} km`;
    }
    if (abs < 1e15) {
      return `${(meters / 1e12).toPrecision(3)} ${tr("common.numberBillion")} km`;
    }
  }

  // Light-year regime — universal across both systems.
  const ly = meters / 9.4607304725808e15;
  if (Math.abs(ly) < 1e3) return `${ly.toPrecision(3)} ${tr("common.unitLightYear")}`;
  if (Math.abs(ly) < 1e6) {
    return `${Math.round(ly).toLocaleString("en-US")} ${tr("common.unitLightYear")}`;
  }
  if (Math.abs(ly) < 1e9) {
    return `${(ly / 1e6).toPrecision(3)} ${tr("common.numberMillion")} ${tr("common.unitLightYear")}`;
  }
  if (Math.abs(ly) < 1e12) {
    return `${(ly / 1e9).toPrecision(3)} ${tr("common.numberBillion")} ${tr("common.unitLightYear")}`;
  }
  return `${(ly / 1e12).toPrecision(3)} ${tr("common.numberTrillion")} ${tr("common.unitLightYear")}`;
}

/**
 * Format a temperature given in kelvin. Returns a string in the form
 * `5,772 K (≈ 5,500 °C)`. Below 1,000 K, both numbers are shown with the
 * 273.15 offset honestly; above 1,000 K, °C is rounded to the same level
 * of precision as K (the two scales are essentially identical at scale).
 *
 * Returns "—" for null / non-finite / negative inputs.
 */
export function formatTemperature(kelvin: number | null | undefined): string {
  if (
    kelvin === null ||
    kelvin === undefined ||
    !Number.isFinite(kelvin) ||
    kelvin < 0
  ) {
    return "—";
  }
  const celsius = kelvin - 273.15;
  const k = kelvin;

  // Below 1,000 K — show precise values; the K/°C difference matters here.
  if (k < 1000) {
    const kRounded = Math.round(k);
    const cRounded = Math.round(celsius);
    return `${kRounded.toLocaleString("en-US")} K (${cRounded >= 0 ? "" : ""}${cRounded} °C)`;
  }

  // Above 1,000 K — show both with rough rounding; at this scale K ≈ °C.
  if (k < 1e6) {
    const kRounded = Math.round(k / 100) * 100;
    const cRounded = Math.round(celsius / 100) * 100;
    return `${kRounded.toLocaleString("en-US")} K (≈ ${cRounded.toLocaleString("en-US")} °C)`;
  }

  // Millions of K — express in "million K", °C identical at this scale.
  if (k < 1e9) {
    const mK = k / 1e6;
    return `${mK.toPrecision(3)} million K (≈ same in °C)`;
  }

  // Billions and beyond.
  const bK = k / 1e9;
  return `${bK.toPrecision(3)} billion K (≈ same in °C)`;
}

const DEFAULT_METERS_LABELS: Record<string, string> = {
  "common.numberMillion": "million",
  "common.numberBillion": "billion",
  "common.numberTrillion": "trillion",
  "common.unitLightYear": "ly",
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
