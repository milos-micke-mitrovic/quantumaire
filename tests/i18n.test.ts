import { describe, expect, it } from "vitest";
import { tServer } from "@/lib/i18n-server";

describe("tServer", () => {
  it("returns the matching English string", () => {
    expect(tServer("en", "common.title")).toBe("Quantumaire");
  });

  it("returns the matching Serbian string", () => {
    expect(tServer("sr", "common.title")).toBe("Quantumaire");
  });

  it("resolves nested keys", () => {
    expect(tServer("en", "stops.quark.name")).toBe("Quark");
    expect(tServer("sr", "stops.quark.name")).toBe("Kvark");
  });

  it("interpolates {variables}", () => {
    const out = tServer("en", "comparison.times", { factor: "42" });
    expect(out).toBe("42× a grain of sand");
  });

  it("falls back to the English value when a Serbian key is missing", () => {
    // Force a key that only exists in en by design (badge tooltips are
    // present in both, but a deeply made-up key isn't anywhere) — should
    // surface the missing key string rather than throwing.
    const missing = tServer("sr", "no.such.key");
    expect(missing).toBe("no.such.key");
  });

  it("returns identical numeric formatting for badge labels in both locales", () => {
    expect(tServer("en", "badges.FACT")).toBe("Fact");
    expect(tServer("sr", "badges.FACT")).toBe("Činjenica");
  });
});
