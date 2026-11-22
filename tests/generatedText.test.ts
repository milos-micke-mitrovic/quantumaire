import { describe, expect, it } from "vitest";
import { SIZED_STOPS, getStop } from "@/lib/content";
import { getPair } from "@/lib/comparePairs";
import { describePair } from "@/lib/comparePairText";
import { computeDistance } from "@/lib/distance";
import { getDictionary } from "@/lib/i18n-server";
import { formatMeters } from "@/lib/scale";
import { tServer } from "@/lib/i18n-server";
import { buildSizeFaq } from "@/lib/sizeFaq";

const text = (id: string, locale: "en" | "sr" = "en") =>
  buildSizeFaq(getStop(id)!, locale)
    .map((f) => `${f.q} ${f.a}`)
    .join("\n");

describe("size FAQ reads sensibly", () => {
  it("skips near-equal neighbours of an unrelated kind", () => {
    expect(text("mariana_trench")).not.toMatch(/Halley/);
    expect(text("halley")).not.toMatch(/Mariana/);
    // Related near-equals stay: planets, two tall things.
    expect(text("uranus")).toMatch(/One step down is Neptune/);
    expect(text("statue_of_liberty")).toMatch(/General Sherman tree .* shorter/);
  });

  it("says taller / deeper for heights and depths", () => {
    expect(text("eiffel_tower")).toMatch(/times taller than a 1\.7 m human/);
    expect(text("mariana_trench")).toMatch(/times deeper than a 1\.7 m human is tall/);
    expect(text("mount_everest")).toMatch(/wider than Mount Everest is tall/);
  });

  it("drops grain-of-sand and Earth comparisons that shrink to specks", () => {
    expect(text("mount_everest")).not.toMatch(/grain of sand/);
    expect(text("gaia_bh1")).not.toMatch(/grain of sand/);
    expect(text("pluto")).toMatch(/grain of sand/);
    expect(text("iss")).not.toMatch(/compared to Earth/);
    expect(text("blue_whale")).not.toMatch(/compared to Earth/);
  });

  it("writes Serbian common nouns in lower case mid-sentence", () => {
    expect(text("atom", "sr")).toMatch(/veći nego atom\./);
    expect(text("atom", "sr")).toMatch(/Korak niže: atomsko jezgro/);
    expect(text("human", "sr")).not.toMatch(/10⁰/);
  });

  it("has a subject for every sized topic in both locales", () => {
    for (const locale of ["en", "sr"] as const) {
      const subjects = (getDictionary(locale).sizeFaq as { subjects: Record<string, string> })
        .subjects;
      for (const s of SIZED_STOPS) expect(subjects[s.id], `${locale} ${s.id}`).toBeTruthy();
    }
  });
});

describe("Serbian number words agree", () => {
  it("93 milijarde, 21 milijarda, 15 milijardi", () => {
    const tr = (k: string) => tServer("sr", k);
    expect(formatMeters(8.8e26, tr)).toBe("93 milijarde sg");
    expect(formatMeters(15e12, tr)).toBe("15 milijardi km");
    expect(formatMeters(21e12, tr)).toBe("21 milijarda km");
  });
});

describe("distance context", () => {
  it("always says farther, and skips topics nearer than every reference", () => {
    expect(computeDistance(getStop("iss")!)).toBeNull();
    expect(computeDistance(getStop("moon")!)).toBeNull();
    const venus = computeDistance(getStop("venus")!)!;
    expect(venus.reference.id).toBe("moonDistance");
    expect(computeDistance(getStop("betelgeuse")!)!.reference.id).toBe("proximaCentauri");
  });
});

describe("compare pair pages", () => {
  it("compares two heights as taller and says where temperatures apply", () => {
    const [a, b] = getPair("burj-khalifa-vs-eiffel-tower")!;
    const en = describePair("en", a, b);
    expect(en.lines[0]).toMatch(/2\.5 times taller than the Eiffel Tower/);
    const [j, s] = getPair("jupiter-vs-saturn")!;
    expect(describePair("en", j, s).lines.join(" ")).toMatch(/cloud tops/);
  });

  it("compares a depth with a height as deeper-than-tall", () => {
    const [m, e] = getPair("mariana-trench-vs-mount-everest")!;
    expect(describePair("en", m, e).lines[0]).toMatch(/1\.2 times deeper than Mount Everest is tall: the Mariana Trench goes down 11 km/);
  });

  it("compares two lengths as longer", () => {
    const [t, w] = getPair("titanic-vs-blue-whale")!;
    const en = describePair("en", t, w);
    expect(en.lines[0]).toMatch(/11 times longer than a blue whale: the Titanic is 269 m long/);
    expect(en.faqQ).toBe("How much longer is the Titanic than a blue whale?");
    expect(describePair("sr", t, w).lines[0]).toMatch(/duže nego plavi kit\. Dužina/);
  });

  it("does not compare an 'edge of' distance", () => {
    const [ton, ss] = getPair("ton-618-vs-solar-system")!;
    expect(describePair("en", ton, ss).lines.join(" ")).not.toMatch(/From Earth/);
  });
});

describe("distance answers", () => {
  it("gives light travel time in years for stars, and names edges", () => {
    expect(text("sirius")).toMatch(/its light takes about 8\.6 years to reach us/);
    expect(text("solar_system")).toMatch(/The edge of the Solar System is about 1\.59 ly from Earth\./);
    expect(text("ton_618")).not.toMatch(/years to reach us/);
  });

  it("names neighbours of the same kind (no moon next to a river)", () => {
    expect(text("titan")).toMatch(/One step up is Mars/);
    expect(text("olympus_mons")).not.toMatch(/Halley|Gaia/);
    expect(text("great_red_spot")).not.toMatch(/Great Wall/);
    // Human-scale things still compare across kinds.
    expect(text("james_webb")).toMatch(/One step down is a giraffe/);
    expect(text("titanic")).toMatch(/One step up is the Eiffel Tower/);
  });

  it("says taller-than-long for small lengths", () => {
    expect(text("ant")).toMatch(/340 times taller than an ant is long/);
  });

  it("doesn't name a same-kind topic 10¹⁸ times away as a neighbour", () => {
    expect(text("great_wall")).not.toMatch(/Sloan/);
    // The directly adjacent topic is always named, however far.
    expect(text("planck_length")).toMatch(/One step up is a quark/);
  });

  it("agrees Serbian scale words with decimals", () => {
    expect(text("betelgeuse", "sr")).toMatch(/1,06 milijarde km/);
    expect(text("sloan_great_wall", "sr")).toMatch(/1,37 milijarde sg/);
    expect(text("sloan_great_wall")).toMatch(/about 1 billion ly from Earth/);
  });

  it("uses measure-specific wording for lengths", () => {
    expect(text("great_wall")).toMatch(/1\.7 times longer than Earth is wide/);
    expect(text("amazon_river")).toMatch(/is about 6,400 km long/);
    expect(text("giraffe")).toMatch(/A giraffe stands about 5\.5 m tall/);
  });
});
