"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category, Stop } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { FilterableStopGrid } from "./FilterableStopGrid";

interface CategoryViewProps {
  category: Category;
  stops: Stop[];
}

export function CategoryView({ category, stops }: CategoryViewProps) {
  const { t, locale } = useI18n();

  return (
    <main className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <div className="mb-6">
        <Link
          href={`/${locale}#journey`}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-cosmos-star/70 transition-colors hover:text-cosmos-star"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" />
          </svg>
          {t("common.returnHome")}
        </Link>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("common.category")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          <span className="bg-aurora-gradient bg-clip-text text-transparent">
            {t(`categories.${category}`)}
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-cosmos-star/80">
          {t(`categories.${category}.description`)}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-cosmos-star/70">
          {t(`categories.${category}.intro`)}
        </p>
        <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.22em] text-cosmos-star/45">
          {t("common.stopsInCategory", { count: stops.length })}
        </p>
      </motion.header>

      <div className="mt-10">
        <FilterableStopGrid stops={stops} />
      </div>
    </main>
  );
}
