"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { useVisited } from "@/lib/visited";

export function VisitedCounter() {
  const { t, locale } = useI18n();
  const { visited } = useVisited();
  const count = visited.size;
  if (count === 0) return null;

  return (
    <Link
      href={`/${locale}/progress`}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cosmos-star/75 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
      aria-live="polite"
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-cosmos-nova shadow-[0_0_8px_rgba(240,171,252,0.8)]"
      />
      {t("common.visited.count", { count, total: STOPS.length })}
    </Link>
  );
}
