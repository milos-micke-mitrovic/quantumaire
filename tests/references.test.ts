import { describe, expect, it } from "vitest";
import {
  REFERENCES,
  compareToReference,
  formatFactor,
  pickReference,
} from "@/lib/references";

describe("pickReference", () => {
  it("picks 'hair' for cellular sizes", () => {
    expect(pickReference(8e-5).id).toBe("hair");
  });

  it("picks 'grainOfSand' near 0.5 mm", () => {
    expect(pickReference(5e-4).id).toBe("grainOfSand");
  });

  it("picks 'person' near 1.7 m", () => {
    expect(pickReference(1.7).id).toBe("person");
  });

  it("picks 'everest' for ~10 km", () => {
    expect(pickReference(1e4).id).toBe("everest");
  });

  it("picks 'au' for inner solar system scale", () => {
    expect(pickReference(1e11).id).toBe("au");
  });
});

describe("compareToReference", () => {
  it("returns null for non-positive input", () => {
    expect(compareToReference(0)).toBeNull();
    expect(compareToReference(-1)).toBeNull();
    expect(compareToReference(Number.POSITIVE_INFINITY)).toBeNull();
  });

  it("calls a near-match 'aboutThe'", () => {
    const result = compareToReference(5.1e-4);
    expect(result?.mode).toBe("aboutThe");
    expect(result?.reference.id).toBe("grainOfSand");
  });

  it("returns biggerThan for objects larger than the closest reference", () => {
    // 10 metres → closest reference is 'person' (1.7 m) → biggerThan 5.88×
    const result = compareToReference(10);
    expect(result?.mode).toBe("biggerThan");
    expect(result?.reference.id).toBe("person");
    expect(result?.factor).toBeCloseTo(10 / 1.7, 2);
  });

  it("returns smallerThan for objects smaller than the closest reference", () => {
    // 1 µm → smaller than nearest reference (hair @ 80 µm)
    const result = compareToReference(1e-6);
    expect(result?.mode).toBe("smallerThan");
    expect(result?.reference.id).toBe("hair");
  });
});

describe("formatFactor", () => {
  it("renders thousands with comma grouping, no suffix", () => {
    expect(formatFactor(1_500)).toBe("1,500");
  });

  it("spells out millions", () => {
    expect(formatFactor(2_500_000)).toMatch(/million$/);
  });

  it("spells out billions", () => {
    expect(formatFactor(3_000_000_000)).toMatch(/billion$/);
  });

  it("spells out trillions", () => {
    expect(formatFactor(2.7e12)).toMatch(/trillion$/);
  });

  it("uses scientific notation above 10¹⁵", () => {
    expect(formatFactor(1.5e15)).toMatch(/× 10/);
  });

  it("honours a translator for the unit word", () => {
    const translator = (key: string): string => {
      if (key === "common.numberMillion") return "miliona";
      return key;
    };
    expect(formatFactor(2_500_000, translator)).toMatch(/miliona$/);
  });
});

describe("REFERENCES list", () => {
  it("is sorted by ascending meters", () => {
    for (let i = 1; i < REFERENCES.length; i++) {
      expect(REFERENCES[i].meters).toBeGreaterThan(REFERENCES[i - 1].meters);
    }
  });

  it("has unique ids", () => {
    const ids = new Set(REFERENCES.map((r) => r.id));
    expect(ids.size).toBe(REFERENCES.length);
  });
});
