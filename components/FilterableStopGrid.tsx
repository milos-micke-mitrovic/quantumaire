"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Stop, TrustBadge } from "@/lib/types";
import { StopCard } from "./StopCard";

interface FilterableStopGridProps {
  stops: Stop[];
}

const ALL = "ALL" as const;
type Filter = typeof ALL | TrustBadge;

const FILTERS: Filter[] = [
  ALL,
  "FACT",
  "ESTABLISHED_THEORY",
  "PROBABLE_THEORY",
  "SPECULATIVE",
];

const PILL_STYLES: Record<Filter, { active: string; idle: string }> = {
  ALL: {
    active: "bg-aurora-gradient text-cosmos-void shadow-glow",
    idle: "text-cosmos-star/70 hover:text-cosmos-star",
  },
  FACT: {
    active: "bg-badge-fact/20 text-badge-fact ring-1 ring-badge-fact/40",
    idle: "text-cosmos-star/70 hover:text-cosmos-star",
  },
  ESTABLISHED_THEORY: {
    active:
      "bg-badge-established/20 text-badge-established ring-1 ring-badge-established/40",
    idle: "text-cosmos-star/70 hover:text-cosmos-star",
  },
  PROBABLE_THEORY: {
    active:
      "bg-badge-probable/20 text-badge-probable ring-1 ring-badge-probable/40",
    idle: "text-cosmos-star/70 hover:text-cosmos-star",
  },
  SPECULATIVE: {
    active:
      "bg-badge-speculative/20 text-badge-speculative ring-1 ring-badge-speculative/40",
    idle: "text-cosmos-star/70 hover:text-cosmos-star",
  },
};

export function FilterableStopGrid({ stops }: FilterableStopGridProps) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>(ALL);

  const visible = useMemo(() => {
    if (filter === ALL) return stops;
    return stops.filter((s) => s.badge === filter);
  }, [stops, filter]);

  return (
    <div>
      <div
        role="group"
        aria-label={t("common.filter")}
        className="mb-6 flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5"
      >
        {FILTERS.map((f) => {
          const isActive = filter === f;
          const label =
            f === ALL ? t("common.filterAll") : t(`badges.${f}`);
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={isActive}
              className={clsx(
                "rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors",
                isActive ? PILL_STYLES[f].active : PILL_STYLES[f].idle
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-10 text-center text-sm text-cosmos-star/55">
          {t("common.searchEmpty")}
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((stop, i) => (
            <StopCard key={stop.id} stop={stop} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
