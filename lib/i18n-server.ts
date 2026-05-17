import en from "@/locales/en.json";
import sr from "@/locales/sr.json";
import type { Locale } from "./types";

type Dictionary = Record<string, unknown>;

const DICTIONARIES: Record<Locale, Dictionary> = {
  en: en as Dictionary,
  sr: sr as Dictionary,
};

const DEFAULT_LOCALE: Locale = "en";

function walkPath(dict: Dictionary, parts: string[]): unknown {
  let cur: unknown = dict;
  for (const part of parts) {
    if (cur && typeof cur === "object" && part in (cur as Dictionary)) {
      cur = (cur as Dictionary)[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

function resolveKey(dict: Dictionary, key: string): string | undefined {
  const parts = key.split(".");
  const deep = walkPath(dict, parts);
  if (typeof deep === "string") return deep;

  // Fallback: some keys are stored flat with literal dots (e.g.
  // `categories.MICRO_WORLD.description` is one flat key under `categories`).
  // Walk a shrinking prefix, then look up the remainder as a literal key.
  for (let i = parts.length - 1; i > 0; i--) {
    const head = walkPath(dict, parts.slice(0, i));
    const tail = parts.slice(i).join(".");
    if (head && typeof head === "object" && tail in (head as Dictionary)) {
      const val = (head as Dictionary)[tail];
      if (typeof val === "string") return val;
    }
  }
  return undefined;
}

function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{${name}}`
  );
}

/**
 * Server-safe translator. Use from `generateMetadata`, OG image routes,
 * sitemap/llms.txt builders, and any other server component.
 */
export function tServer(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string {
  const dict = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
  const fallback = DICTIONARIES[DEFAULT_LOCALE];
  const resolved = resolveKey(dict, key) ?? resolveKey(fallback, key) ?? key;
  return interpolate(resolved, vars);
}
