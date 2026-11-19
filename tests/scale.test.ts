import { describe, expect, it } from "vitest";
import {
  SCALE_FACTOR,
  compareToGrain,
  formatLightTime,
  formatTemperature,
  formatMeters,
  logPosition,
  toGrainScale,
} from "@/lib/scale";

describe("formatMeters", () => {
  it("returns em-dash for null", () => {
    expect(formatMeters(null)).toBe("—");
  });

  it("formats femtometres for ultra-small values", () => {
    expect(formatMeters(1e-15)).toMatch(/fm$/);
  });

  it("formats picometres", () => {
    expect(formatMeters(1e-12)).toMatch(/pm$/);
  });

  it("formats nanometres", () => {
    expect(formatMeters(2e-9)).toMatch(/nm$/);
  });

  it("formats micrometres", () => {
    expect(formatMeters(5e-6)).toMatch(/µm$/);
  });

  it("formats millimetres", () => {
    // 5 mm sits in the [1e-3, 1) bracket → reported as mm. (0.5 mm would
    // round down to µm by the function's thresholds — both are valid.)
    expect(formatMeters(5e-3)).toMatch(/mm$/);
  });

  it("formats metres", () => {
    expect(formatMeters(1.7)).toMatch(/m$/);
  });

  it("formats kilometres", () => {
    expect(formatMeters(20_000)).toMatch(/km$/);
  });

  it("renders Earth-scale distances in plain kilometres with commas", () => {
    expect(formatMeters(1.27e7)).toMatch(/km$/);
    expect(formatMeters(1.27e7)).toMatch(/12,7/);
  });

  it("uses 'million km' for inner-solar-system distances", () => {
    expect(formatMeters(1.39e9)).toMatch(/million km$/);
  });

  it("uses 'billion km' for outer-solar-system distances", () => {
    expect(formatMeters(2.4e12)).toMatch(/billion km$/);
  });

  it("uses light-years for cosmic scales", () => {
    expect(formatMeters(1e22)).toMatch(/ly$/);
  });

  it("never falls back to scientific notation in the UI range", () => {
    for (const v of [1.27e7, 1.39e9, 2.4e10, 2.4e12, 1.5e13, 1e21]) {
      expect(formatMeters(v)).not.toMatch(/e[+\-]/);
    }
  });
});

describe("toGrainScale + SCALE_FACTOR", () => {
  it("scales Earth diameter to roughly one grain (0.5 mm)", () => {
    const earthDiameter = 12_742_000;
    const scaled = toGrainScale(earthDiameter);
    expect(scaled).toBeCloseTo(0.0005, 6);
  });

  it("SCALE_FACTOR is the ratio grain / Earth", () => {
    expect(SCALE_FACTOR).toBeCloseTo(0.0005 / 12_742_000, 12);
  });
});

describe("compareToGrain", () => {
  it("returns none for abstract sizes", () => {
    expect(compareToGrain(null)).toEqual({ factor: 0, mode: "none" });
  });

  it("returns equal when scaled size matches a grain", () => {
    // Earth's diameter shrinks to one grain.
    const result = compareToGrain(12_742_000);
    expect(result.mode).toBe("equal");
  });

  it("returns times mode for big objects (Sun → many grains)", () => {
    const result = compareToGrain(1.39e9);
    expect(result.mode).toBe("times");
    expect(result.factor).toBeGreaterThan(1);
  });

  it("returns fraction mode for small objects (DNA)", () => {
    const result = compareToGrain(2e-9);
    expect(result.mode).toBe("fraction");
    expect(result.factor).toBeGreaterThan(1);
  });
});

describe("logPosition", () => {
  it("returns 0 for null", () => {
    expect(logPosition(null)).toBe(0);
  });

  it("returns 0 for non-positive", () => {
    expect(logPosition(0)).toBe(0);
  });

  it("places 1 m near the middle of a -18..27 range", () => {
    const p = logPosition(1, -18, 27);
    expect(p).toBeCloseTo(18 / 45, 5);
  });

  it("clamps below the min exponent", () => {
    expect(logPosition(1e-25, -18, 27)).toBe(0);
  });

  it("clamps above the max exponent", () => {
    expect(logPosition(1e30, -18, 27)).toBe(1);
  });
});

describe("formatMeters tidy output", () => {
  it("drops trailing zeros", () => {
    expect(formatMeters(1e-18)).toBe("0.001 fm");
    expect(formatMeters(1e-15)).toBe("1 fm");
    expect(formatMeters(2e-9)).toBe("2 nm");
    expect(formatMeters(1.7)).toBe("1.7 m");
    expect(formatMeters(8.8e26)).toBe("93 billion ly");
  });
});

describe("locale-aware numbers", () => {
  const sr = (k: string) =>
    ({
      "common.numberLocale": "sr-Latn-RS",
      "common.numberMillion": "miliona",
      "common.numberBillion": "milijardi",
      "common.unitLightYear": "sg",
    })[k] ?? k;

  it("uses Serbian separators when the dictionary says so", () => {
    expect(formatMeters(12742000, sr)).toBe("12.742 km");
    expect(formatMeters(1.39e9, sr)).toBe("1,39 miliona km");
    expect(formatMeters(12742000)).toBe("12,742 km");
  });
});

describe("formatLightTime", () => {
  const sr = (k: string) =>
    ({
      "common.numberLocale": "sr-Latn-RS",
      "common.lightTime.minute": "svetlost: ≈ {value} min",
      "common.lightTime.dayOne": "svetlost: ≈ {value} dan",
    })[k] ?? k;

  it("skips distances under a light-second and in the light-year regime", () => {
    expect(formatLightTime(1e6)).toBeNull();
    expect(formatLightTime(4e16)).toBeNull();
    expect(formatLightTime(null)).toBeNull();
  });

  it("picks a readable unit", () => {
    expect(formatLightTime(384_400_000)).toBe("≈ 1.3 light-seconds");
    expect(formatLightTime(1.496e11)).toBe("≈ 8.3 light-minutes");
    expect(formatLightTime(4.5e12)).toBe("≈ 4.2 light-hours");
    expect(formatLightTime(2.59e13)).toBe("≈ 1 light-day");
  });

  it("formats Serbian numbers", () => {
    expect(formatLightTime(1.496e11, sr)).toBe("svetlost: ≈ 8,3 min");
    expect(formatLightTime(2.59e13, sr)).toBe("svetlost: ≈ 1 dan");
  });
});

describe("formatTemperature in a chosen unit", () => {
  it("formats Celsius, Fahrenheit and kelvin", () => {
    expect(formatTemperature(5772, undefined, "C")).toBe("5,500 °C");
    expect(formatTemperature(5772, undefined, "F")).toBe("9,900 °F");
    expect(formatTemperature(5772, undefined, "K")).toBe("5,800 K");
    expect(formatTemperature(288, undefined, "C")).toBe("15 °C");
    expect(formatTemperature(288, undefined, "F")).toBe("59 °F");
    expect(formatTemperature(1.57e7, undefined, "C")).toBe("15.7 million °C");
  });
});
