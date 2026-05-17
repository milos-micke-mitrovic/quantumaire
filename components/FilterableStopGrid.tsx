"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Stop } from "@/lib/types";
import { StopCard } from "./StopCard";

interface FilterableStopGridProps {
  stops: Stop[];
}

const ALL = "ALL" as const;
type Filter = typeof ALL | string;

/**
 * Card grid with a chip row that filters by object-type tag (planet, star,
 * black-hole, biology, …). The tag list is built from whatever tags
 * actually appear on the visible stops, so the filter never shows a chip
 * that would match zero results.
 */
export function FilterableStopGrid({ stops }: FilterableStopGridProps) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>(ALL);

  // Build the chip list from the stops in play, sorted by frequency so
  // the most common tags surface first.
  const availableTags = useMemo<string[]>(() => {
    const counts = new Map<string, number>();
    for (const s of stops) {
      for (const tag of s.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([id]) => id);
  }, [stops]);

  const visible = useMemo(() => {
    if (filter === ALL) return stops;
    return stops.filter((s) => (s.tags ?? []).includes(filter));
  }, [stops, filter]);

  return (
    <div>
      <div
        role="group"
        aria-label={t("common.filter")}
        className="mb-6 flex flex-wrap items-center gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-1.5"
      >
        <button
          type="button"
          onClick={() => setFilter(ALL)}
          aria-pressed={filter === ALL}
          className={clsx(
            "rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors",
            filter === ALL
              ? "bg-aurora-gradient text-cosmos-void shadow-glow"
              : "text-cosmos-star/70 hover:text-cosmos-star"
          )}
        >
          {t("common.filterAll")}
        </button>
        {availableTags.map((tagId) => {
          const isActive = filter === tagId;
          return (
            <button
              key={tagId}
              type="button"
              onClick={() => setFilter(tagId)}
              aria-pressed={isActive}
              className={clsx(
                "rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors",
                isActive
                  ? "bg-cosmos-aurora/20 text-cosmos-aurora ring-1 ring-cosmos-aurora/40"
                  : "text-cosmos-star/70 hover:text-cosmos-star"
              )}
            >
              {t(`tags.${tagId}`)}
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
