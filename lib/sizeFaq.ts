import { SIZED_STOPS } from "./content";
import {
  formatLightTime,
  formatMeters,
  formatTemperature,
  scaled,
  toGrainScale,
} from "./scale";
import { getDictionary, tServer, tServerOptional } from "./i18n-server";
import { areRelated, sizeMeasure } from "./references";
import { capFirst } from "./text";
import type { Locale, Stop } from "./types";

/**
 * Per-stop "size & scale" Q&A, generated from content data.
 *
 * These pairs are phrased the way people actually search ("How big is …?",
 * "… compared to a human") and feed both the visible FAQ block on each stop
 * page and its FAQPage JSON-LD, so the two never drift apart.
 */

const HUMAN_M = 1.7;
const EARTH_M = 12_742_000;
const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

export interface SizeFaqLink {
  id: string;
  name: string;
}

export interface SizeFaqItem {
  q: string;
  a: string;
  /** Stops mentioned in the answer, rendered as internal links. */
  links?: SizeFaqLink[];
}

/** Stops with a physical size, smallest first. */
const SIZED: Stop[] = SIZED_STOPS;

const LIGHT_YEAR_M = 9.4607304725808e15;

/** Light travel time in years for a distance: "8.6", "548", "2.5 million". */
function lightYears(meters: number, locale: Locale): string {
  const ly = meters / LIGHT_YEAR_M;
  const loc = locale === "sr" ? "sr-Latn-RS" : "en-US";
  if (ly >= 1e6) return scaled(ly / 1e6, "common.numberMillion", (k) => tServer(locale, k), loc);
  // Same precision as formatMeters, so "5,866 ly" reads "5,866 years".
  const n = Number(ly.toPrecision(ly < 1e3 ? 3 : 4));
  return n.toLocaleString(loc);
}

/** Key suffix for measure-specific wording (a1Height, a1plainDepth…). */
const MEASURE_SUFFIX = { height: "Height", depth: "Depth", length: "Length", size: "" } as const;

/** Neighbours closer than this are only named when they are related. */
const NEAR_EQUAL = 1.15;
/** Below this two sizes are the same number: never name one as a neighbour. */
const MIN_NAMED_RATIO = 1.01;
/** Same-kind neighbours further than this are "far" (see neighbour()). */
const FAR_NEIGHBOUR = 10;
/**
 * Skipping past closer topics to a same-kind one this far away isn't naming a
 * neighbour (Great Wall of China → Sloan Great Wall, 10¹⁸×). The directly
 * adjacent topic is always fine (Planck length → quark).
 */
const MAX_NEIGHBOUR = 1e6;
/** Below this size, any two things can be pictured side by side. */
const HUMAN_SCALE_MAX = 1e3;
/** Below this, Earth-as-a-grain-of-sand shrinks things to invisible specks. */
const MIN_GRAIN_METERS = 1e-5;
/** Below this, "Earth is 600,000 times wider than X" says nothing. */
const MIN_EARTH_COMPARE_METERS = 1e3;

/** What a size measures: a whole shape, a vertical extent, or a length. */
function measureKind(stop: Stop): "shape" | "vertical" | "length" {
  const m = sizeMeasure(stop);
  return m === "size" ? "shape" : m === "length" ? "length" : "vertical";
}

/**
 * The nearest topic below (`step = -1`) or above (`+1`) on the size scale
 * that is worth naming next to this one: the same kind of measure (a moon's
 * diameter next to a planet's, not next to a river's length; a volcano's
 * height next to a mountain's, not next to a comet) or a shared tag.
 * Near-equal neighbours of a different kind are skipped too.
 */
function neighbour(rank: number, step: -1 | 1): Stop | null {
  const self = SIZED[rank];
  const ratioTo = (other: Stop) =>
    Math.max(other.sizeMeters!, self.sizeMeters!) / Math.min(other.sizeMeters!, self.sizeMeters!);
  let nearest: Stop | null = null;
  let preferred: Stop | null = null;
  for (let i = rank + step; i >= 0 && i < SIZED.length; i += step) {
    const other = SIZED[i];
    const ratio = ratioTo(other);
    if (ratio > MAX_NEIGHBOUR && i !== rank + step) break;
    const sameKind = measureKind(self) === measureKind(other);
    // "1.02 times bigger" only reads well between two of the same measure
    // (Uranus/Neptune, two heights) — not a rocket's height vs a station's width.
    // Exact ties (mitochondrion and bacterium, both 2 µm) would read
    // "about 1 times bigger" — never name them.
    const nearOk =
      ratio >= NEAR_EQUAL || (ratio >= MIN_NAMED_RATIO && sameKind && areRelated(self, other));
    if (!nearest && nearOk) nearest = other;
    const sharedTag = (self.tags ?? []).some((tag) => (other.tags ?? []).includes(tag));
    if (nearOk && (sharedTag || sameKind)) {
      preferred = other;
      break;
    }
  }
  // Things you could stand side by side (a giraffe and the Webb telescope,
  // the Titanic and the Eiffel Tower) compare fine across kinds; fall back to
  // the plain nearest one when the same-kind neighbour is far away.
  const humanScale = (s: Stop) => s.sizeMeters! < HUMAN_SCALE_MAX;
  if (
    nearest &&
    humanScale(self) &&
    humanScale(nearest) &&
    (!preferred || ratioTo(preferred) > FAR_NEIGHBOUR)
  ) {
    return nearest;
  }
  return preferred;
}

function numberFormat(locale: Locale): Intl.NumberFormat {
  return new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : "en-US", {
    maximumFractionDigits: 0,
  });
}

/** "4.2", "350", "12,000", "3.4 million", "10²¹". */
export function formatRatio(ratio: number, locale: Locale): string {
  const nf = numberFormat(locale);
  if (ratio < 10) {
    // 1.03 must not round to "1 times bigger".
    return new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : "en-US", {
      maximumFractionDigits: ratio < 1.1 ? 2 : 1,
    }).format(ratio);
  }
  if (ratio < 1e6) return nf.format(Number(ratio.toPrecision(2)));
  const scales: Array<[number, string]> = [
    [1e12, "common.numberTrillion"],
    [1e9, "common.numberBillion"],
    [1e6, "common.numberMillion"],
  ];
  if (ratio < 1e15) {
    for (const [base, key] of scales) {
      if (ratio >= base) {
        // Two significant figures: "17 billion", "7.5 million".
        const m = Number((ratio / base).toPrecision(2));
        return scaled(m, key, (k) => tServer(locale, k), locale === "sr" ? "sr-Latn-RS" : "en-US");
      }
    }
  }
  const exp = Math.round(Math.log10(ratio));
  const sup = String(exp)
    .split("")
    .map((d) => SUPERSCRIPT[Number(d)])
    .join("");
  return `10${sup}`;
}

function scientific(meters: number, locale: Locale): string {
  const exp = Math.floor(Math.log10(meters));
  const mantissa = meters / 10 ** exp;
  const sup = String(Math.abs(exp))
    .split("")
    .map((d) => SUPERSCRIPT[Number(d)])
    .join("");
  const m = Number(mantissa.toPrecision(2));
  const ms = m.toLocaleString(locale === "sr" ? "sr-Latn-RS" : "en-US");
  return `${m === 1 ? "" : `${ms} × `}10${exp < 0 ? "⁻" : ""}${sup}`;
}

/**
 * How the stop reads mid-sentence ("an atom", "the Sun"). English has a
 * per-stop `sizeFaq.subjects` map; other locales fall back to the name.
 */
export function subjectName(stop: Stop, locale: Locale): string {
  const name = tServer(locale, `${stop.i18nKey}.name`);
  // Read the locale's own map: tServer would fall back to English subjects.
  const subjects = (getDictionary(locale).sizeFaq as { subjects?: Record<string, string> })
    ?.subjects;
  return subjects?.[stop.id] ?? name;
}

/** Mid-title casing: "an atom" → "an Atom", "the observable universe" → "the Observable Universe". */
export function titleCase(s: string): string {
  return s.replace(/(^|\s)([a-z])/g, (m, sp: string, ch: string, i: number) => {
    const word = s.slice(i + sp.length).split(/\s/)[0];
    return ["a", "an", "the"].includes(word) ? m : sp + ch.toUpperCase();
  });
}

export { capFirst } from "./text";

/**
 * Page title for a topic: a hand-written `seoTitle` wins (ideas always have
 * one; sized topics may, e.g. "How Deep Is the Mariana Trench?"), otherwise
 * sized topics get the generic "How Big Is X? Size & Scale Compared".
 */
export function stopTitle(stop: Stop, locale: Locale): string {
  const custom = tServerOptional(locale, `${stop.i18nKey}.seoTitle`);
  if (custom || stop.sizeMeters === null) return custom ?? tServer(locale, `${stop.i18nKey}.seoTitle`);
  return tServer(locale, "sizeFaq.title", {
    name: titleCase(subjectName(stop, locale)),
    Name: capFirst(subjectName(stop, locale)),
  });
}

export function buildSizeFaq(stop: Stop, locale: Locale): SizeFaqItem[] {
  const name = subjectName(stop, locale);
  const Name = capFirst(name);
  const t = (key: string, vars?: Record<string, string | number>) =>
    tServer(locale, key, { name, Name, ...vars });
  const tm = (key: string) => tServer(locale, key);
  const items: SizeFaqItem[] = [];
  const size = stop.sizeMeters;

  // Ideas (no size): lead with "What is X?" — the question in the topic's
  // search title, answered by its meta summary.
  if (size === null) {
    const seoTitle = tServerOptional(locale, `${stop.i18nKey}.seoTitle`);
    const summary = tServerOptional(locale, `${stop.i18nKey}.metaDescription`);
    const question = seoTitle?.match(/^[^?]+\?/)?.[0];
    if (question && summary) items.push({ q: question, a: summary });
  }

  if (size !== null) {
    const rank = SIZED.findIndex((s) => s.id === stop.id);

    // "(≈ 8.4 × 10¹ m)" adds nothing to "83.8 m": powers of ten only for
    // the very small and the very large.
    const plain = size >= 1e-2 && size < 1e5;
    items.push({
      q: t("sizeFaq.q1", { name }),
      // "stands about 330 m tall", "is about 11 km deep", "measures about…"
      a: t(`sizeFaq.${plain ? "a1plain" : "a1"}${MEASURE_SUFFIX[sizeMeasure(stop)]}`, {
        name,
        size: formatMeters(size, tm),
        sci: scientific(size, locale),
        rank: rank + 1,
        total: SIZED.length,
      }),
    });

    if (stop.id !== "human") {
      const bigger = size > HUMAN_M;
      const ratio = bigger ? size / HUMAN_M : HUMAN_M / size;
      const measure = sizeMeasure(stop);
      const key = !bigger
        ? measure === "length"
          ? "sizeFaq.a2smallerLong"
          : "sizeFaq.a2smaller"
        : measure === "height"
          ? "sizeFaq.a2taller"
          : measure === "depth"
            ? "sizeFaq.a2deeper"
            : measure === "length"
              ? "sizeFaq.a2longer"
              : "sizeFaq.a2bigger";
      items.push({
        q: t("sizeFaq.q2", { name }),
        a: t(key, {
          name,
          ratio: formatRatio(ratio, locale),
        }),
        links: [{ id: "human", name: t("stops.human.name") }],
      });
    }

    const smaller = neighbour(rank, -1);
    const larger = neighbour(rank, 1);
    const parts: string[] = [];
    const links: SizeFaqLink[] = [];
    if (smaller) {
      const sName = t(`${smaller.i18nKey}.name`);
      const tall = sizeMeasure(stop) === "height" && sizeMeasure(smaller) === "height";
      parts.push(
        t(tall ? "sizeFaq.a3smallerTall" : "sizeFaq.a3smaller", {
          other: subjectName(smaller, locale),
          otherSize: formatMeters(smaller.sizeMeters, tm),
          ratio: formatRatio(size / (smaller.sizeMeters as number), locale),
        })
      );
      links.push({ id: smaller.id, name: sName });
    } else if (rank === 0) {
      parts.push(t("sizeFaq.a3smallest", { name }));
    }
    if (larger) {
      const lName = t(`${larger.i18nKey}.name`);
      const tall = sizeMeasure(stop) === "height" && sizeMeasure(larger) === "height";
      parts.push(
        t(tall ? "sizeFaq.a3largerTall" : "sizeFaq.a3larger", {
          other: subjectName(larger, locale),
          otherSize: formatMeters(larger.sizeMeters, tm),
          ratio: formatRatio((larger.sizeMeters as number) / size, locale),
        })
      );
      links.push({ id: larger.id, name: lName });
    } else if (rank === SIZED.length - 1) {
      parts.push(t("sizeFaq.a3largest", { name }));
    }
    if (parts.length > 0) items.push({ q: t("sizeFaq.q3", { name }), a: parts.join(" "), links });

    if (toGrainScale(size) >= MIN_GRAIN_METERS && stop.id !== "earth") {
      items.push({
        q: t("sizeFaq.q4", { name }),
        a: t("sizeFaq.a4", {
          name,
          grain: formatMeters(toGrainScale(size), tm),
        }),
      });
    }
  }

  if (size !== null && stop.id !== "earth" && size >= MIN_EARTH_COMPARE_METERS) {
    const bigger = size > EARTH_M;
    const measure = sizeMeasure(stop);
    const key = bigger
      ? measure === "length"
        ? "sizeFaq.a8longer"
        : measure === "height"
          ? "sizeFaq.a8taller"
          : "sizeFaq.a8bigger"
      : measure === "height"
        ? "sizeFaq.a8tall"
        : measure === "depth"
          ? "sizeFaq.a8deep"
          : measure === "length"
            ? "sizeFaq.a8long"
            : "sizeFaq.a8smaller";
    items.push({
      q: t("sizeFaq.q8", { name }),
      a: t(key, {
        ratio: formatRatio(bigger ? size / EARTH_M : EARTH_M / size, locale),
      }),
      links: [{ id: "earth", name: t("stops.earth.name") }],
    });
  }

  const distance = stop.distanceFromEarthMeters;
  if (typeof distance === "number" && distance > 0) {
    const lightTime = formatLightTime(distance, tm);
    const q = t("sizeFaq.q6", { name });
    // An idea topic whose search question is already this one (Voyager 1).
    // Measured to an edge ("Edge of the Solar System"): name that place —
    // nothing's light "takes 1.6 years" to reach us from the Solar System.
    const placeName = stop.distanceNameKey ? tServer(locale, stop.distanceNameKey) : null;
    // English template adds "The": "The edge of the Solar System is…".
    const place =
      placeName && locale === "en" ? placeName.charAt(0).toLowerCase() + placeName.slice(1) : placeName;
    if (!items.some((i) => i.q.toLowerCase() === q.toLowerCase())) items.push({
      q,
      a: place
        ? t("sizeFaq.a6edge", { place, distance: formatMeters(distance, tm) })
        : lightTime
        ? t("sizeFaq.a6", { distance: formatMeters(distance, tm), lightTime })
        : distance >= LIGHT_YEAR_M && distance < 1e7 * LIGHT_YEAR_M
          ? // "its light takes about 8.6 years to reach us" — but not for
            // cosmological distances, where expansion breaks that reading.
            t("sizeFaq.a6years", { distance: formatMeters(distance, tm), years: lightYears(distance, locale) })
          : // Under one light-second (the ISS): no light-time worth quoting.
            t(distance < 3e8 ? "sizeFaq.a6near" : "sizeFaq.a6far", { distance: formatMeters(distance, tm) }),
    });
  }

  if (typeof stop.temperatureKelvin === "number") {
    const noteKey = `${stop.i18nKey}.temperatureNote`;
    const note = tServer(locale, noteKey);
    const temperatureNote = note === noteKey ? null : note;
    items.push({
      q: t("sizeFaq.q7", { name }),
      a: temperatureNote
        ? t("sizeFaq.a7where", {
            temp: formatTemperature(stop.temperatureKelvin, tm),
            note: temperatureNote,
          })
        : t("sizeFaq.a7", { temp: formatTemperature(stop.temperatureKelvin, tm) }),
    });
  }

  items.push({
    q: t("sizeFaq.q5", { name }),
    a: t("sizeFaq.a5", {
      name,
      badge: t(`badges.${stop.badge}`),
      tooltip: t(`badges.${stop.badge}.tooltip`),
    }),
  });

  return items;
}

/** One-line size summary for meta descriptions, or null for size-less stops. */
export function sizeSummary(stop: Stop, locale: Locale): string | null {
  if (stop.sizeMeters === null) return null;
  return tServer(locale, "sizeFaq.metaSize", {
    Name: capFirst(subjectName(stop, locale)),
    size: formatMeters(stop.sizeMeters, (k) => tServer(locale, k)),
  });
}
