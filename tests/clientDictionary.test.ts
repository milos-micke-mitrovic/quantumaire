import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getClientDictionary, pickDictionary } from "@/lib/i18n-server";
import { STOPS } from "@/lib/content";

function has(dict: Record<string, unknown>, key: string): boolean {
  // Same lookup as lib/i18n.tsx: nested path, or a flat key with dots.
  const parts = key.split(".");
  for (let i = parts.length; i > 0; i--) {
    let cur: unknown = dict;
    for (const p of parts.slice(0, i)) {
      cur = cur && typeof cur === "object" ? (cur as Record<string, unknown>)[p] : undefined;
    }
    if (i === parts.length && typeof cur === "string") return true;
    const tail = parts.slice(i).join(".");
    if (cur && typeof cur === "object" && typeof (cur as Record<string, unknown>)[tail] === "string")
      return true;
  }
  return false;
}

/** Literal t("…") keys used by client components. */
function clientLiteralKeys(): string[] {
  const keys = new Set<string>();
  for (const file of readdirSync("components")) {
    const src = readFileSync(join("components", file), "utf8");
    if (!src.startsWith('"use client"')) continue;
    for (const m of src.matchAll(/\bt\(\s*"([a-zA-Z0-9_.]+)"/g)) keys.add(m[1]);
  }
  return [...keys];
}

// Sections that pages add with <I18nExtend> (about, glossary, topics, stops).
const PAGE_SCOPED = /^(about|glossary|topics|stops)\./;

describe("client dictionary", () => {
  for (const locale of ["en", "sr"] as const) {
    const base = getClientDictionary(locale);

    it(`${locale}: every literal client key is in the base dictionary`, () => {
      const missing = clientLiteralKeys().filter(
        (k) => !PAGE_SCOPED.test(k) && !has(base, k)
      );
      expect(missing).toEqual([]);
    });

    it(`${locale}: base has names/taglines but not long text`, () => {
      for (const stop of STOPS) {
        expect(has(base, `${stop.i18nKey}.name`), stop.id).toBe(true);
        expect(has(base, `${stop.i18nKey}.body`), stop.id).toBe(false);
      }
      // ~200 chars per topic (name + tagline); raised from 60,000 at 107 topics.
      expect(JSON.stringify(base).length).toBeLessThan(64_000);
    });
  }

  it("pickDictionary copies subtrees and wildcards", () => {
    const d = pickDictionary("en", ["stops.atom", "glossary.*.term"]);
    expect(has(d, "stops.atom.body")).toBe(true);
    expect(has(d, "stops.quark.name")).toBe(false);
    expect(has(d, "glossary.quark.term")).toBe(true);
    expect(has(d, "glossary.quark.definition")).toBe(false);
  });
});

describe("client dictionary fallback", () => {
  it("fills a key missing in Serbian with the English text", () => {
    // sizeFaq.subjects exists only in English (see lib/sizeFaq.ts).
    const d = pickDictionary("sr", ["sizeFaq.subjects.atom", "stops.atom.name"]);
    expect(has(d, "sizeFaq.subjects.atom")).toBe(true);
    expect((d.stops as Record<string, Record<string, string>>).atom.name).toBe("Atom");
  });
});
