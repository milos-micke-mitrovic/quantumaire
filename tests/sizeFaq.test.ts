import { describe, expect, it } from "vitest";
import { getStop } from "@/lib/content";
import {
  buildSizeFaq,
  formatRatio,
  sizeSummary,
  subjectName,
  titleCase,
} from "@/lib/sizeFaq";

describe("formatRatio", () => {
  it("formats small, medium, worded and exponent ratios", () => {
    expect(formatRatio(3.94, "en")).toBe("3.9");
    expect(formatRatio(123456, "en")).toBe("120,000");
    expect(formatRatio(7.5e6, "en")).toBe("7.5 million");
    expect(formatRatio(1e18, "en")).toBe("10¹⁸");
  });
});

describe("buildSizeFaq", () => {
  it("phrases English questions with natural subjects", () => {
    const faq = buildSizeFaq(getStop("atom")!, "en");
    expect(faq[0].q).toBe("How big is an atom?");
    expect(faq[0].a.startsWith("An atom measures about 100 pm")).toBe(true);
    expect(faq.every((f) => !/\{\w+\}/.test(f.q + f.a))).toBe(true);
  });

  it("skips the grain-of-sand question for Earth itself", () => {
    const faq = buildSizeFaq(getStop("earth")!, "en");
    expect(faq.some((f) => f.q.includes("grain of sand"))).toBe(false);
  });

  it("asks 'what is it?' and certainty for size-less stops", () => {
    const faq = buildSizeFaq(getStop("dark_energy")!, "en");
    expect(faq.map((f) => f.q)).toEqual([
      "What Is Dark Energy?",
      "How certain is what we know about Dark Energy?",
    ]);
    expect(sizeSummary(getStop("dark_energy")!, "en")).toBeNull();
  });

  it("asks distance, temperature and Earth comparison when data exists", () => {
    const faq = buildSizeFaq(getStop("sun")!, "en");
    const qs = faq.map((f) => f.q);
    expect(qs).toContain("How far is the Sun from Earth?");
    expect(qs).toContain("How hot is the Sun?");
    expect(qs).toContain("How big is the Sun compared to Earth?");
    expect(faq.find((f) => f.q.startsWith("How far"))!.a).toMatch(/light-minutes/);
    expect(buildSizeFaq(getStop("earth")!, "en").some((f) => f.q.includes("compared to Earth"))).toBe(false);
  });

  it("leaves no unfilled placeholders in Serbian", () => {
    for (const id of ["quark", "earth", "sun", "voyager1", "andromeda", "observable_universe", "mpd"]) {
      const faq = buildSizeFaq(getStop(id)!, "sr");
      expect(faq.every((f) => !/\{\w+\}/.test(f.q + f.a))).toBe(true);
    }
  });
});

describe("subjects", () => {
  it("uses English phrases only for English", () => {
    expect(subjectName(getStop("atom")!, "en")).toBe("an atom");
    expect(subjectName(getStop("sun")!, "sr")).toBe("Sunce");
  });

  it("title-cases while keeping inner articles lowercase", () => {
    expect(titleCase("an atom")).toBe("an Atom");
    expect(titleCase("the observable universe")).toBe("the Observable Universe");
    expect(titleCase("Halley's Comet")).toBe("Halley's Comet");
  });
});
