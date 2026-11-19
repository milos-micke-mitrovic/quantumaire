"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { STOPS } from "@/lib/content";
import { m as motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function GlossaryView({ keys }: { keys: string[] }) {
  const { t, locale } = useI18n();

  // Reverse index: which topics use each term (glossary → topics links).
  const usedIn = useMemo(() => {
    const map = new Map<string, typeof STOPS>();
    for (const s of STOPS) {
      for (const g of s.glossary) map.set(g, [...(map.get(g) ?? []), s]);
    }
    return map;
  }, []);
  const [query, setQuery] = useState("");
  // Term the visitor arrived at (#g-<key>). Read from the hash ourselves:
  // CSS :target doesn't update on client-side (pushState) navigation.
  const [focusKey, setFocusKey] = useState<string | null>(null);
  useEffect(() => {
    const read = () => {
      const m = /^#g-(.+)$/.exec(window.location.hash);
      const key = m ? decodeURIComponent(m[1]) : null;
      setFocusKey(key);
      if (key) {
        requestAnimationFrame(() =>
          document
            .getElementById(`g-${key}`)
            ?.scrollIntoView({ block: "center", behavior: "smooth" })
        );
      }
    };
    const raf = requestAnimationFrame(read);
    window.addEventListener("hashchange", read);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", read);
    };
  }, []);

  const entries = useMemo(() => {
    return keys.map((key) => ({
      key,
      term: t(`glossary.${key}.term`),
      definition: t(`glossary.${key}.definition`),
    })).sort((a, b) => a.term.localeCompare(b.term));
  }, [keys, t]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return entries;
    return entries.filter(
      (e) =>
        normalize(e.term).includes(q) || normalize(e.definition).includes(q)
    );
  }, [entries, query]);

  return (
    <main className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("common.glossary")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          <span className="bg-aurora-gradient bg-clip-text text-transparent">
            {t("common.glossaryPage.title")}
          </span>
        </h1>
        <p className="mt-3 text-base text-cosmos-star/80 sm:text-lg">
          {t("common.glossaryPage.tagline", { count: entries.length })}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-cosmos-star/70">
          {t("common.glossaryPage.intro")}
        </p>
      </motion.header>

      <div className="mt-8">
        <label htmlFor="glossary-filter" className="sr-only">
          {t("common.glossaryPage.filterPlaceholder")}
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-cosmos-plasma/70 focus-within:ring-2 focus-within:ring-cosmos-aurora/40">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 text-cosmos-star/55"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            id="glossary-filter"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("common.glossaryPage.filterPlaceholder")}
            className="w-full bg-transparent text-sm text-cosmos-star placeholder:text-cosmos-star/55 focus:outline-none"
          />
        </div>
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-cosmos-star/55">
            {t("common.searchEmpty")}
          </p>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.key}
              id={`g-${entry.key}`}
              className={
                entry.key === focusKey
                  ? "scroll-mt-24 rounded-2xl border border-cosmos-plasma/70 bg-cosmos-aurora/[0.12] p-4 shadow-glow transition-colors"
                  : "scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-sm transition-colors"
              }
            >
              <dt className="font-display text-base font-semibold tracking-tight text-cosmos-plasma">
                {entry.term}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-cosmos-star/80">
                {entry.definition}
              </dd>
              {(usedIn.get(entry.key)?.length ?? 0) > 0 && (
                <dd className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-cosmos-star/55">
                    {t("common.glossaryPage.usedIn")}
                  </span>
                  {usedIn.get(entry.key)!.map((s) => (
                    <Link
                      key={s.id}
                      href={`/${locale}/stop/${s.id}`}
                      className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-cosmos-star/75 transition-colors hover:border-white/25 hover:text-cosmos-star"
                    >
                      {t(`${s.i18nKey}.name`)}
                    </Link>
                  ))}
                </dd>
              )}
            </div>
          ))
        )}
      </dl>
    </main>
  );
}
