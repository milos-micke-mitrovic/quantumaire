import { describe, expect, it } from "vitest";
import { GLOSSARY_KEYS } from "@/lib/glossary";
import { tServer } from "@/lib/i18n-server";

describe("glossary registry", () => {
  it("contains at least 40 entries", () => {
    expect(GLOSSARY_KEYS.length).toBeGreaterThanOrEqual(40);
  });

  it("every English glossary term has a term + definition", () => {
    for (const key of GLOSSARY_KEYS) {
      const term = tServer("en", `glossary.${key}.term`);
      const definition = tServer("en", `glossary.${key}.definition`);
      expect(term).not.toBe(`glossary.${key}.term`);
      expect(definition).not.toBe(`glossary.${key}.definition`);
      expect(definition.length).toBeGreaterThan(8);
    }
  });

  it("every glossary key is also translated to Serbian", () => {
    for (const key of GLOSSARY_KEYS) {
      const term = tServer("sr", `glossary.${key}.term`);
      const definition = tServer("sr", `glossary.${key}.definition`);
      expect(term).not.toBe(`glossary.${key}.term`);
      expect(definition).not.toBe(`glossary.${key}.definition`);
    }
  });
});
