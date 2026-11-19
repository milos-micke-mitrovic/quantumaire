"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { guidesForStop } from "@/lib/topics";
import type { Stop } from "@/lib/types";

/** Links from a topic page to the long-form guides that cover it. */
export function StopGuides({ stop }: { stop: Stop }) {
  const { t, locale } = useI18n();
  const guides = guidesForStop(stop.id, stop.tags ?? []);
  if (guides.length === 0) return null;
  return (
    <section
      id="guides"
      data-section
      aria-labelledby="guides-heading"
      className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
    >
      <h2
        id="guides-heading"
        className="font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl"
      >
        {t("common.inGuides")}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/${locale}/topics/${g.slug}`}
            className="group rounded-2xl border border-white/10 bg-cosmos-deep/50 p-4 transition-colors hover:border-white/20"
          >
            <span className="block font-display text-base text-cosmos-star group-hover:text-cosmos-plasma">
              {t(`${g.i18nKey}.title`)} <span aria-hidden>→</span>
            </span>
            <span className="mt-1 block text-sm text-cosmos-star/60">
              {t(`${g.i18nKey}.tagline`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
