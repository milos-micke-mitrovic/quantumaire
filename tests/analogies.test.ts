import { describe, expect, it } from "vitest";
import { STOPS } from "@/lib/content";
import { buildAnalogies, FAMILIAR_STOP_IDS } from "@/lib/analogies";

describe("buildAnalogies", () => {
  it("gives sized stops a bigger and a smaller comparison", () => {
    const human = STOPS.find((s) => s.id === "human")!;
    const a = buildAnalogies(human, STOPS);
    expect(a.filter((x) => x.kind === "size").length).toBe(2);
  });

  it("only keeps pairings within ×1.5 of the familiar object", () => {
    for (const s of STOPS) {
      for (const a of buildAnalogies(s, STOPS)) {
        expect(a.closeness).toBeGreaterThan(1 / 1.51);
        expect(a.closeness).toBeLessThan(1.51);
      }
    }
  });

  it("only scales well-known topics in the second row (no \"Pluto ≈ …\")", () => {
    for (const s of STOPS) {
      for (const a of buildAnalogies(s, STOPS)) {
        if (a.kind === "size") expect(FAMILIAR_STOP_IDS.has(a.toId)).toBe(true);
      }
    }
  });

  it("never pairs a topic with itself as the familiar object", () => {
    const self: Record<string, string> = {
      earth: "earth",
      sun: "sun",
      eiffel_tower: "eiffel",
      burj_khalifa: "burj",
    };
    for (const s of STOPS) {
      for (const a of buildAnalogies(s, STOPS)) {
        if (a.kind !== "size") continue;
        expect(a.fromObject.id).not.toBe(self[a.fromId]);
        expect(a.toObject.id).not.toBe(self[a.toId]);
      }
    }
  });

  it("adds a distance comparison for Voyager 1", () => {
    const v = STOPS.find((s) => s.id === "voyager1")!;
    expect(buildAnalogies(v, STOPS).some((a) => a.kind === "distance")).toBe(true);
  });

  it("returns nothing for abstract stops", () => {
    const g = STOPS.find((s) => s.id === "gravity")!;
    expect(buildAnalogies(g, STOPS)).toEqual([]);
  });
});
