"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, STOPS, categorySlug } from "@/lib/content";
import { useVisited } from "@/lib/visited";

export function ProgressView() {
  const { t, locale } = useI18n();
  const { visited, reset } = useVisited();
  const router = useRouter();

  const total = STOPS.length;
  const count = visited.size;
  const ratio = total === 0 ? 0 : count / total;

  const perCategory = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const all = STOPS.filter((s) => s.category === cat);
      const done = all.filter((s) => visited.has(s.id));
      return {
        cat,
        all: all.length,
        done: done.length,
        ratio: all.length === 0 ? 0 : done.length / all.length,
      };
    });
  }, [visited]);

  const remaining = useMemo(
    () => STOPS.filter((s) => !visited.has(s.id)),
    [visited]
  );

  const onRandomUnvisited = () => {
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    router.push(`/${locale}/stop/${pick.id}`);
  };

  const onReset = () => {
    if (window.confirm(t("common.visited.confirmReset"))) {
      reset();
    }
  };

  return (
    <main className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("common.title")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          <span className="bg-aurora-gradient bg-clip-text text-transparent">
            {t("common.progress.title")}
          </span>
        </h1>
        <p className="mt-3 text-base text-cosmos-star/80 sm:text-lg">
          {t("common.progress.tagline", { count, total })}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-cosmos-star/70">
          {t("common.progress.intro")}
        </p>
      </motion.header>

      <section
        aria-label={t("common.progress.tagline", { count, total })}
        className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
      >
        <div className="flex items-end justify-between">
          <p className="font-mono text-4xl text-cosmos-star sm:text-5xl">
            <span className="bg-aurora-gradient bg-clip-text text-transparent">
              {count}
            </span>
            <span className="ml-2 text-cosmos-star/45">/ {total}</span>
          </p>
          <p className="font-mono text-base text-cosmos-plasma">
            {Math.round(ratio * 100)}%
          </p>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-aurora-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {count === 0 && (
          <p className="mt-5 text-sm text-cosmos-star/65">
            {t("common.progress.empty")}
          </p>
        )}
        {count === total && (
          <p className="mt-5 text-sm text-cosmos-nova">
            {t("common.progress.complete")}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRandomUnvisited}
            disabled={remaining.length === 0}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              remaining.length === 0
                ? "border border-white/10 bg-white/[0.04] text-cosmos-star/40"
                : "bg-aurora-gradient text-cosmos-void shadow-glow hover:-translate-y-0.5"
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M21 7l-9 4-9-4 9-4z" />
              <path d="M21 7v10l-9 4-9-4V7" />
            </svg>
            {t("common.progress.openRandom")}
          </button>
          {count > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-cosmos-star/75 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
            >
              {t("common.visited.reset")}
            </button>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("common.progress.categoryBreakdown")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {perCategory.map(({ cat, all, done, ratio: r }) => (
            <Link
              key={cat}
              href={`/${locale}/category/${categorySlug(cat)}`}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-white/20"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-display text-base font-semibold text-cosmos-star">
                    {t(`categories.${cat}`)}
                  </p>
                  <p className="font-mono text-xs text-cosmos-plasma">
                    {done} / {all}
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-aurora-gradient"
                    initial={{ width: 0 }}
                    animate={{ width: `${r * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {remaining.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
            {t("common.progress.remaining")}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {remaining.map((stop) => (
              <li key={stop.id}>
                <Link
                  href={`/${locale}/stop/${stop.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span className="truncate text-cosmos-star/85">
                    {t(`${stop.i18nKey}.name`)}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-cosmos-star/45">
                    {t(`categories.${stop.category}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
