import { describe, expect, it } from "vitest";
import { fitDescription } from "@/lib/seo";

describe("fitDescription", () => {
  it("keeps whole sentences within the limit", () => {
    const out = fitDescription(["First sentence here.", "Second one is here. Third is long ".repeat(10)], 60);
    expect(out).toBe("First sentence here. Second one is here.");
    expect(out.length).toBeLessThanOrEqual(60);
  });
  it("adds a full stop to a piece without one", () => {
    expect(fitDescription(["A tagline", "Body."])).toBe("A tagline. Body.");
  });
  it("word-clips when whole sentences would leave a stub", () => {
    const out = fitDescription(["word ".repeat(60)], 50);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(50);
  });
});

import en from "@/locales/en.json";
import sr from "@/locales/sr.json";
import { STOPS } from "@/lib/content";
import { TOPICS } from "@/lib/topics";

describe("search titles", () => {
  for (const [locale, dict] of [["en", en], ["sr", sr]] as const) {
    it(`${locale}: every idea topic and guide has a seoTitle ≤ 60 chars`, () => {
      const stops = dict.stops as Record<string, { seoTitle?: string }>;
      for (const s of STOPS.filter((x) => x.sizeMeters === null)) {
        const title = stops[s.id]?.seoTitle ?? "";
        expect(title.length, s.id).toBeGreaterThan(20);
        expect(title.length, s.id).toBeLessThanOrEqual(60);
      }
      const topics = dict.topics as Record<string, { seoTitle?: string }>;
      for (const t of TOPICS) {
        const title = topics[t.i18nKey.split(".")[1]]?.seoTitle ?? "";
        expect(title.length, t.slug).toBeGreaterThan(20);
        expect(title.length, t.slug).toBeLessThanOrEqual(60);
      }
    });
  }
});
