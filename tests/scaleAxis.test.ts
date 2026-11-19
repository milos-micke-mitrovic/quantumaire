import { describe, expect, it } from "vitest";
import { assignLanes, buildAxis, gapLabel, thinTicks } from "@/lib/scaleAxis";

describe("buildAxis", () => {
  it("spaces values by log and spans start..end", () => {
    const { positions, gaps } = buildAxis([1, 10, 100], {
      start: 0,
      end: 1,
    });
    expect(positions).toEqual([0, 0.5, 1]);
    expect(gaps).toEqual([]);
  });

  it("compresses big empty stretches and reports them", () => {
    // 1e-35 → 1e-15 is 20 decades; capped at 3.
    const { positions, gaps } = buildAxis([1e-35, 1e-15, 1e-12], {
      start: 0,
      end: 1,
      maxGapDecades: 3,
    });
    expect(positions[1]).toBeCloseTo(0.5);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].decades).toBeCloseTo(20);
  });

  it("maps ticks inside real segments, not inside gaps or outside", () => {
    const { map } = buildAxis([1e-35, 1e-15, 1e-9], {
      start: 0,
      end: 1,
      maxGapDecades: 10,
    });
    expect(map(1e-12)).toBeCloseTo(13 / 16);
    expect(map(1e-25)).toBeNull();
    expect(map(1)).toBeNull();
  });
});

describe("assignLanes", () => {
  it("keeps spaced dots on lane 0 and stacks crowded ones", () => {
    expect(assignLanes([0, 0.1, 0.2])).toEqual([0, 0, 0]);
    expect(assignLanes([0.5, 0.505, 0.51])).toEqual([0, 1, 2]);
  });
});

describe("thinTicks / gapLabel", () => {
  it("drops colliding ticks", () => {
    const out = thinTicks([{ pos: 0 }, { pos: 0.03 }, { pos: 0.1 }]);
    expect(out.map((t) => t.pos)).toEqual([0, 0.1]);
  });

  it("labels gaps with superscripts", () => {
    expect(gapLabel(19.8)).toBe("×10²⁰");
  });
});
