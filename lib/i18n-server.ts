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

/** Like tServer, but undefined when the key exists in neither locale. */
export function tServerOptional(
  locale: Locale,
  key: string
): string | undefined {
  const dict = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
  return resolveKey(dict, key) ?? resolveKey(DICTIONARIES[DEFAULT_LOCALE], key);
}

/** The full dictionary for a locale (server-side use only). */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * Copy only the given paths out of a locale's dictionary. Paths are dotted
 * and `*` matches every key at that level, e.g. `stops.*.name`. A path that
 * ends on an object copies the whole subtree.
 */
export function pickDictionary(locale: Locale, paths: string[]): Dictionary {
  const src = getDictionary(locale);
  const out: Dictionary = {};
  const put = (parts: string[], value: unknown) => {
    let cur = out;
    parts.slice(0, -1).forEach((p) => {
      if (!cur[p] || typeof cur[p] !== "object") cur[p] = {};
      cur = cur[p] as Dictionary;
    });
    cur[parts[parts.length - 1]] = value;
  };
  const walk = (node: unknown, rest: string[], trail: string[]) => {
    if (rest.length === 0) {
      if (node !== undefined) put(trail, node);
      return;
    }
    if (!node || typeof node !== "object") return;
    const [head, ...tail] = rest;
    const keys = head === "*" ? Object.keys(node as Dictionary) : [head];
    for (const k of keys) walk((node as Dictionary)[k], tail, [...trail, k]);
  };
  for (const path of paths) walk(src, path.split("."), []);
  return out;
}

/**
 * Top-level sections the client never needs on every page: long-form text
 * is added per page with <I18nExtend> (see BASE_CLIENT_PATHS).
 */
const PAGE_ONLY_SECTIONS = new Set([
  "stops",
  "topics",
  "glossary",
  "about",
  "home",
  "sizeFaq",
  "seo",
  "faq",
]);

/**
 * What the layout ships to the browser on every page: UI strings plus the
 * short per-topic text that cards, search and menus show.
 */
export function baseClientPaths(locale: Locale): string[] {
  const sections = Object.keys(getDictionary(locale)).filter(
    (k) => !PAGE_ONLY_SECTIONS.has(k)
  );
  return [
    ...sections,
    "stops.*.name",
    "stops.*.tagline",
    "stops.*.image",
    "stops.*.distanceName",
    "stops.*.insideNote",
    "topics.*.title",
    "topics.*.tagline",
    "glossary.*.term",
  ];
}

export function getClientDictionary(locale: Locale): Dictionary {
  return pickDictionary(locale, baseClientPaths(locale));
}
