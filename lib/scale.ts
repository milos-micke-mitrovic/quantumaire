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

/**
 * Three significant figures without trailing zeros (1.00 → "1", 93.0 → "93"),
 * in the locale's number style ("1.39" en / "1,39" sr).
 */
export function sig(n: number, locale = "en-US"): string {
  return Number(n.toPrecision(3)).toLocaleString(locale, {
    maximumFractionDigits: 20,
  });
}

/**
 * "93 billion" / "93 milijarde": a number plus its scale word, which in
 * Serbian agrees with whole numbers (1 milijarda, 2–4 milijarde, 5+
 * milijardi). Optional `<key>One` / `<key>Few` texts hold those forms.
 */
export function scaled(
  n: number,
  key: string,
  tr: (key: string) => string,
  loc: string
): string {
  const num = Number(n.toPrecision(3));
  let word = tr(key);
  if (Number.isInteger(num)) {
    const d = num % 10;
    const dd = num % 100;
    const form = d === 1 && dd !== 11 ? "One" : d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? "Few" : null;
    if (form) {
      const v = tr(`${key}${form}`);
      if (v && v !== `${key}${form}`) word = v;
    }
  }
  return `${sig(n, loc)} ${word}`;
}

/** BCP-47 tag for number formatting, taken from the active dictionary. */
export function numberLocale(tr: (key: string) => string): string {
  const loc = tr("common.numberLocale");
  return loc === "common.numberLocale" ? "en-US" : loc;
}
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
  const loc = numberLocale(tr);

  // Sub-metre: SI prefixes are universal across both systems.
  if (abs < 1e-18) {
    // Below an attometre (the Planck length) prefixes stop helping.
    const exp = Math.floor(Math.log10(abs));
    const sup = String(exp).replace(/[-0-9]/g, (c) => "⁻⁰¹²³⁴⁵⁶⁷⁸⁹"["-0123456789".indexOf(c)]);
    return `${sig(meters / 10 ** exp, loc)} × 10${sup} m`;
  }
  if (abs < 1e-12) return `${sig(meters * 1e15, loc)} fm`;
  if (abs < 1e-9) return `${sig(meters * 1e12, loc)} pm`;
  if (abs < 1e-6) return `${sig(meters * 1e9, loc)} nm`;
  if (abs < 1e-3) return `${sig(meters * 1e6, loc)} µm`;
  if (abs < 1) return `${sig(meters * 1e3, loc)} mm`;

  if (units === "imperial") {
    if (abs < 1e3) {
      const ft = meters / FOOT_M;
      return `${sig(ft, loc)} ft`;
    }
    if (abs < 1.609e9) {
      const mi = meters / MILE_M;
      const digits = Math.abs(mi) < 10 ? 1 : 0;
      return `${mi.toLocaleString(loc, { maximumFractionDigits: digits })} mi`;
    }
    if (abs < 1.609e12) {
      return `${scaled(meters / (1e6 * MILE_M), "common.numberMillion", tr, loc)} mi`;
    }
    if (abs < 1e15) {
      return `${scaled(meters / (1e9 * MILE_M), "common.numberBillion", tr, loc)} mi`;
    }
    // fall through to light-years
  } else {
    if (abs < 1e3) return `${sig(meters, loc)} m`;
    if (abs < 1e9) {
      const km = meters / 1e3;
      const digits = Math.abs(km) < 10 ? 1 : 0;
      return `${km.toLocaleString(loc, { maximumFractionDigits: digits })} km`;
    }
    if (abs < 1e12) {
      return `${scaled(meters / 1e9, "common.numberMillion", tr, loc)} km`;
    }
    if (abs < 1e15) {
      return `${scaled(meters / 1e12, "common.numberBillion", tr, loc)} km`;
    }
  }

  // Light-year regime — universal across both systems.
  const ly = meters / 9.4607304725808e15;
  if (Math.abs(ly) < 1e3) return `${sig(ly, loc)} ${tr("common.unitLightYear")}`;
  if (Math.abs(ly) < 1e6) {
    // Four significant figures: "105,700 ly" stays, "26,002 ly" → "26,000 ly".
    return `${Number(ly.toPrecision(4)).toLocaleString(loc)} ${tr("common.unitLightYear")}`;
  }
  if (Math.abs(ly) < 1e9) {
    return `${scaled(ly / 1e6, "common.numberMillion", tr, loc)} ${tr("common.unitLightYear")}`;
  }
  if (Math.abs(ly) < 1e12) {
    return `${scaled(ly / 1e9, "common.numberBillion", tr, loc)} ${tr("common.unitLightYear")}`;
  }
  return `${scaled(ly / 1e12, "common.numberTrillion", tr, loc)} ${tr("common.unitLightYear")}`;
}

const SPEED_OF_LIGHT = 299_792_458;

/**
 * Light-travel time for a distance, as a human-friendly hint shown next to
 * the distance itself: "≈ 1.28 light-seconds" (Moon), "≈ 8.32 light-minutes"
 * (Sun), "≈ 1 light-day" (Voyager 1). Returns null below one light-second
 * (no intuition gained) and from 1e15 m upward, where formatMeters already
 * speaks in light-years.
 */
export function formatLightTime(
  meters: number | null | undefined,
  t?: (key: string) => string
): string | null {
  if (typeof meters !== "number" || !Number.isFinite(meters)) return null;
  if (meters >= 1e15) return null;
  const seconds = Math.abs(meters) / SPEED_OF_LIGHT;
  if (seconds < 1) return null;
  const tr = t ?? defaultMetersTranslator;
  const loc = numberLocale(tr);

  let unit: "second" | "minute" | "hour" | "day";
  let value: number;
  if (seconds < 60) [unit, value] = ["second", seconds];
  else if (seconds < 3600) [unit, value] = ["minute", seconds / 60];
  else if (seconds < 86400 * 0.95) [unit, value] = ["hour", seconds / 3600];
  else [unit, value] = ["day", seconds / 86400];

  // Two significant figures is plenty for a "roughly" hint.
  const rounded = Number(value.toPrecision(2));
  const text = rounded.toLocaleString(loc, { maximumFractionDigits: 1 });
  const one = text === "1";
  return tr(`common.lightTime.${unit}${one ? "One" : ""}`).replace(
    "{value}",
    text
  );
}

/**
 * Format a temperature given in kelvin. Returns a string in the form
 * `5,772 K (≈ 5,500 °C)`. Below 1,000 K, both numbers are shown with the
 * 273.15 offset honestly; above 1,000 K, °C is rounded to the same level
 * of precision as K (the two scales are essentially identical at scale).
 *
 * Returns "—" for null / non-finite / negative inputs.
 */
export function formatTemperature(
  kelvin: number | null | undefined,
  t?: (key: string) => string,
  unit?: "C" | "F" | "K"
): string {
  const tr = t ?? defaultMetersTranslator;
  const loc = numberLocale(tr);
  if (
    kelvin === null ||
    kelvin === undefined ||
    !Number.isFinite(kelvin) ||
    kelvin < 0
  ) {
    return "—";
  }
  if (unit) return formatTemperatureIn(kelvin, unit, tr, loc);
  const celsius = kelvin - 273.15;
  const k = kelvin;

  // Below 1,000 K — show precise values; the K/°C difference matters here.
  if (k < 1000) {
    const kRounded = Math.round(k);
    const cRounded = Math.round(celsius);
    return `${kRounded.toLocaleString(loc)} K (${cRounded >= 0 ? "" : ""}${cRounded.toLocaleString(loc)} °C)`;
  }

  // Above 1,000 K — show both with rough rounding; at this scale K ≈ °C.
  if (k < 1e6) {
    const kRounded = Math.round(k / 100) * 100;
    const cRounded = Math.round(celsius / 100) * 100;
    return `${kRounded.toLocaleString(loc)} K (≈ ${cRounded.toLocaleString(loc)} °C)`;
  }

  // Millions of K — express in "million K", °C identical at this scale.
  if (k < 1e9) {
    const mK = k / 1e6;
    return `${scaled(mK, "common.numberMillion", tr, loc)} K (${tr("common.tempSameInC")})`;
  }

  // Billions and beyond.
  const bK = k / 1e9;
  return `${scaled(bK, "common.numberBillion", tr, loc)} K (${tr("common.tempSameInC")})`;
}

/**
 * Single-unit temperature in the visitor's preferred scale. Values under
 * 1,000 are exact to the degree; up to a million they round to the nearest
 * hundred; beyond that they switch to "million" / "billion" wording.
 */
function formatTemperatureIn(
  kelvin: number,
  unit: "C" | "F" | "K",
  tr: (key: string) => string,
  loc: string
): string {
  const value =
    unit === "K"
      ? kelvin
      : unit === "C"
        ? kelvin - 273.15
        : (kelvin - 273.15) * 1.8 + 32;
  const symbol = unit === "K" ? "K" : `°${unit}`;
  const abs = Math.abs(value);
  if (abs < 1000) return `${Math.round(value).toLocaleString(loc)} ${symbol}`;
  if (abs < 1e6) {
    return `${(Math.round(value / 100) * 100).toLocaleString(loc)} ${symbol}`;
  }
  if (abs < 1e9) {
    return `${scaled(value / 1e6, "common.numberMillion", tr, loc)} ${symbol}`;
  }
  return `${scaled(value / 1e9, "common.numberBillion", tr, loc)} ${symbol}`;
}

const DEFAULT_METERS_LABELS: Record<string, string> = {
  "common.numberMillion": "million",
  "common.numberBillion": "billion",
  "common.numberTrillion": "trillion",
  "common.unitLightYear": "ly",
  "common.tempSameInC": "≈ same in °C",
  "common.numberLocale": "en-US",
  "common.lightTime.secondOne": "≈ {value} light-second",
  "common.lightTime.second": "≈ {value} light-seconds",
  "common.lightTime.minuteOne": "≈ {value} light-minute",
  "common.lightTime.minute": "≈ {value} light-minutes",
  "common.lightTime.hourOne": "≈ {value} light-hour",
  "common.lightTime.hour": "≈ {value} light-hours",
  "common.lightTime.dayOne": "≈ {value} light-day",
  "common.lightTime.day": "≈ {value} light-days",
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
