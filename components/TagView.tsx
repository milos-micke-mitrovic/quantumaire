"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { TAG_PAGES } from "@/lib/tags";
import type { Stop } from "@/lib/types";
import { StopCard } from "./StopCard";

/** Listing page for one tag: heading, intro, cards, links to other tags. */
export function TagView({ tag, stops }: { tag: string; stops: Stop[] }) {
  const { t, locale } = useI18n();
  return (
    <main className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <nav
        aria-label={t("common.breadcrumb")}
        className="mb-6 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cosmos-star/55"
      >
        <Link href={`/${locale}`} className="hover:text-cosmos-star">
          {t("common.title")}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-cosmos-star/80">{t(`tags.${tag}`)}</span>
      </nav>

      <header className="max-w-3xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("tagPages.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-cosmos-star sm:text-5xl">
          {t(`tagPages.${tag}.title`)}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-cosmos-star/75 sm:text-lg">
          {t(`tagPages.${tag}.intro`)}
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cosmos-star/55">
          {t("common.stopsInCategory", { count: stops.length })}
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stops.map((s, i) => (
          <StopCard key={s.id} stop={s} index={i} />
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("tagPages.more")}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {TAG_PAGES.filter((x) => x !== tag).map((x) => (
            <Link
              key={x}
              href={`/${locale}/tag/${x}`}
              className="rounded-full border border-cosmos-aurora/30 bg-cosmos-aurora/10 px-3 py-1 text-xs text-cosmos-plasma transition-colors hover:bg-cosmos-aurora/20"
            >
              {t(`tagPages.${x}.short`)}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
