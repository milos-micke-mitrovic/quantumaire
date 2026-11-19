import { tServer, tServerOptional } from "./i18n-server";
import { sizeMeasure } from "./references";
import { formatMeters, formatTemperature } from "./scale";
import { capFirst, formatRatio, subjectName } from "./sizeFaq";
import type { Locale, Stop } from "./types";

/** All the server-side sentences for one pair, in one locale. */
export function describePair(locale: Locale, a: Stop, b: Stop) {
  const tm = (key: string) => tServer(locale, key);
  const name = (s: Stop) => tServer(locale, `${s.i18nKey}.name`);
  // Titles use the bare names ("Burj Khalifa vs Eiffel Tower"); sentences
  // use the article-bearing subject ("the Eiffel Tower", "a blue whale").
  const aName = subjectName(a, locale);
  const bName = subjectName(b, locale);
  const vars = { a: aName, b: bName };
  const lines: string[] = [];
  let big = aName;
  let small = bName;
  let ratio = "1";
  // Two heights (Burj Khalifa vs Eiffel Tower) compare as "taller".
  const tall = sizeMeasure(a) === "height" && sizeMeasure(b) === "height";
  if (a.sizeMeters && b.sizeMeters) {
    const aBigger = a.sizeMeters >= b.sizeMeters;
    big = aBigger ? aName : bName;
    small = aBigger ? bName : aName;
    ratio = formatRatio(
      aBigger ? a.sizeMeters / b.sizeMeters : b.sizeMeters / a.sizeMeters,
      locale
    );
    lines.push(
      capFirst(tServer(locale, tall ? "common.comparePage.pairSizeTall" : "common.comparePage.pairSize", {
        ...vars,
        big,
        small,
        ratio,
        sizeA: formatMeters(a.sizeMeters, tm),
        sizeB: formatMeters(b.sizeMeters, tm),
      }))
    );
  }
  // A distance "to the edge of" something (the Solar System) is not how far
  // away the thing is, so it is not compared.
  const dist = (s: Stop) =>
    s.id === "earth" || s.distanceNameKey ? null : s.distanceFromEarthMeters;
  const distA = dist(a);
  const distB = dist(b);
  if (distA && distB) {
    lines.push(
      tServer(locale, "common.comparePage.pairDistance", {
        ...vars,
        distA: formatMeters(distA, tm),
        distB: formatMeters(distB, tm),
      })
    );
  }
  if (a.temperatureKelvin && b.temperatureKelvin) {
    // "165 K (−108 °C), cloud tops": say where each temperature applies.
    const temp = (s: Stop) => {
      const note = tServerOptional(locale, `${s.i18nKey}.temperatureNote`);
      const value = formatTemperature(s.temperatureKelvin!, tm);
      return note ? `${value}, ${note}` : value;
    };
    lines.push(
      tServer(locale, "common.comparePage.pairTemp", {
        ...vars,
        B: capFirst(bName),
        tempA: temp(a),
        tempB: temp(b),
      })
    );
  }
  return {
    // English titles keep the bare names ("Blue Whale vs Human"); Serbian
    // writes common nouns in lower case after the first ("Plavi kit i čovek").
    title: tServer(locale, "common.comparePage.pairTitle", {
      a: locale === "en" ? name(a) : capFirst(aName),
      b: locale === "en" ? name(b) : bName,
    }),
    description: capFirst(
      tServer(
        locale,
        tall
          ? "common.comparePage.pairDescriptionTall"
          : lines.length > 1
            ? "common.comparePage.pairDescription"
            : "common.comparePage.pairDescriptionSize",
        { big, small, ratio }
      )
    ),
    faqQ: capFirst(
      tServer(locale, tall ? "common.comparePage.pairFaqQTall" : "common.comparePage.pairFaqQ", {
        big,
        small,
      })
    ),
    lines,
  };
}
