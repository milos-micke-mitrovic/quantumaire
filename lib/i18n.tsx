"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "./types";

export type Dictionary = Record<string, unknown>;

export const SUPPORTED_LOCALES: Locale[] = ["en", "sr"];
export const DEFAULT_LOCALE: Locale = "en";

const STORAGE_KEY = "quantumaire.locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

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
 * The provider is driven by the URL — `locale` is whatever segment is in the
 * current path. setLocale navigates to the equivalent path under the new
 * locale, so each language has its own canonical URL (good for SEO).
 *
 * The dictionary is passed in by the server layout so only the active
 * locale's strings reach the browser (not every locale bundled into JS).
 */
export function I18nProvider({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, locale);
    // <html lang> is set per locale by the [locale] root layout.
  }, [locale]);

  const setLocale = useCallback(
    (l: Locale) => {
      if (l === locale) return;
      const stripped = pathname.replace(/^\/(en|sr)(?=\/|$)/, "");
      const next = `/${l}${stripped || ""}` || `/${l}`;
      router.push(next);
    },
    [locale, pathname, router]
  );

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      return interpolate(resolveKey(dictionary, key) ?? key, vars);
    },
    [dictionary]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

