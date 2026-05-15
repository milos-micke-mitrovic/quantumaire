import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  STOPS,
  categoryFromSlug,
  categorySlug,
  getNeighbors,
  getRelatedStops,
  getStop,
  getStopsByCategory,
} from "@/lib/content";

describe("content registry", () => {
  it("has at least 20 stops", () => {
    expect(STOPS.length).toBeGreaterThanOrEqual(20);
  });

  it("has 4 categories defined", () => {
    expect(CATEGORIES).toHaveLength(4);
  });

  it("sorts stops by ascending order field", () => {
    for (let i = 1; i < STOPS.length; i++) {
      expect(STOPS[i].order).toBeGreaterThanOrEqual(STOPS[i - 1].order);
    }
  });

  it("has unique stop IDs", () => {
    const ids = new Set(STOPS.map((s) => s.id));
    expect(ids.size).toBe(STOPS.length);
  });

  it("every stop has 1+ glossary terms and a non-empty image", () => {
    for (const s of STOPS) {
      expect(s.glossary.length).toBeGreaterThan(0);
      expect(s.image.src).toMatch(/^\/images\//);
    }
  });
});

describe("category helpers", () => {
  it("categorySlug + categoryFromSlug round-trip", () => {
    for (const cat of CATEGORIES) {
      expect(categoryFromSlug(categorySlug(cat))).toBe(cat);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(categoryFromSlug("nope")).toBeUndefined();
  });

  it("getStopsByCategory returns only matching stops", () => {
    for (const cat of CATEGORIES) {
      const stops = getStopsByCategory(cat);
      expect(stops.length).toBeGreaterThan(0);
      for (const s of stops) {
        expect(s.category).toBe(cat);
      }
    }
  });
});

describe("stop lookups", () => {
  it("getStop finds a known stop", () => {
    expect(getStop("quark")?.id).toBe("quark");
  });

  it("getStop returns undefined for unknown IDs", () => {
    expect(getStop("not-a-real-stop")).toBeUndefined();
  });

  it("getNeighbors returns prev=null for the first stop", () => {
    const first = STOPS[0];
    const { prev } = getNeighbors(first.id);
    expect(prev).toBeNull();
  });

  it("getNeighbors returns next=null for the last stop", () => {
    const last = STOPS[STOPS.length - 1];
    const { next } = getNeighbors(last.id);
    expect(next).toBeNull();
  });

  it("getRelatedStops returns up to N items, never the stop itself", () => {
    const start = STOPS[Math.floor(STOPS.length / 2)];
    const related = getRelatedStops(start, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    for (const r of related) {
      expect(r.id).not.toBe(start.id);
    }
  });
});
