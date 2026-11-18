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

  it("only asks the certainty question for size-less stops", () => {
    expect(buildSizeFaq(getStop("dark_energy")!, "en")).toHaveLength(1);
    expect(sizeSummary(getStop("dark_energy")!, "en")).toBeNull();
  });

  it("leaves no unfilled placeholders in Serbian", () => {
    for (const id of ["quark", "earth", "observable_universe", "mpd"]) {
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
