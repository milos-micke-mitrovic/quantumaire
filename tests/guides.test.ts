import { describe, expect, it } from "vitest";
import { TOPICS } from "@/lib/topics";
import { getStop } from "@/lib/content";
import en from "@/locales/en.json";
import sr from "@/locales/sr.json";

type Dict = Record<string, unknown>;
const lookup = (d: Dict, key: string) =>
  key.split(".").reduce<unknown>((n, k) => (n as Dict | undefined)?.[k], d);

describe("guide pages", () => {
  it.each(TOPICS.map((t) => [t.slug, t] as const))(
    "%s has a hero image and valid key numbers",
    (_slug, topic) => {
      const hero = getStop(topic.heroStopId);
      expect(hero, "hero topic exists").toBeDefined();
      expect(hero!.image.src).toMatch(/\.webp$/);
      expect(topic.keyNumbers.length).toBeGreaterThanOrEqual(3);
      for (const kn of topic.keyNumbers) {
        if ("text" in kn) {
          for (const d of [en, sr] as Dict[]) {
            for (const part of ["Label", "Value"]) {
              const v = lookup(d, `${topic.i18nKey}.keyNumber${kn.text}${part}`);
              expect(typeof v === "string" && v.length > 0, `${topic.slug} text row ${kn.text}${part}`).toBe(true);
            }
          }
        } else {
          const stop = getStop(kn.stopId);
          expect(stop, kn.stopId).toBeDefined();
          const v =
            kn.value === "size"
              ? stop!.sizeMeters
              : kn.value === "distance"
                ? stop!.distanceFromEarthMeters
                : stop!.temperatureKelvin;
          expect(typeof v, `${kn.stopId} ${kn.value}`).toBe("number");
        }
      }
    }
  );
});
