"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { formatTemperature } from "@/lib/scale";
import type { Stop } from "@/lib/types";

/**
 * Temperature-axis sibling of `InteractiveScale` / `DistanceScale`.
 *
 * Dots are evenly spaced — position encodes ordinal rank (coldest →
 * hottest), not real temperature ratios. Only stops with a populated
 * `temperatureKelvin` value appear: macro objects with a single canonical
 * temperature. Abstract stops, micro-world particles, and exotic objects
 * with non-uniform or undefined temperatures are skipped.
 */
interface TemperatureScaleProps {
  highlightStopId?: string;
}

export function TemperatureScale({
  highlightStopId,
}: TemperatureScaleProps = {}) {
  const { t, locale } = useI18n();

  const items = useMemo<Stop[]>(() => {
    return STOPS.filter(
      (s): s is Stop & { temperatureKelvin: number } =>
        typeof s.temperatureKelvin === "number" && s.temperatureKelvin >= 0
    ).sort((a, b) => a.temperatureKelvin - b.temperatureKelvin);
  }, []);

  const highlightIdx = useMemo(
    () =>
      highlightStopId
        ? items.findIndex((it) => it.id === highlightStopId)
        : -1,
    [highlightStopId, items]
  );

  const [activeIdx, setActiveIdx] = useState(
    highlightIdx >= 0 ? highlightIdx : 0
  );

  if (items.length === 0) return null;
  const active = items[Math.min(activeIdx, items.length - 1)];
  const lastIdx = items.length - 1;
  const activeTempLabel = formatTemperature(active.temperatureKelvin);
  const activeName = t(`${active.i18nKey}.name`);

  return (
    <section
      aria-label={t("common.temperature")}
      className="relative w-full rounded-3xl border border-white/10 bg-cosmos-deep/60 px-4 py-6 sm:px-8 sm:py-7"
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
            {t("common.temperature")}
          </p>
          <h3 className="mt-1 font-display text-lg text-cosmos-star sm:text-xl">
            {activeName}
          </h3>
          <p className="mt-1 text-xs leading-snug text-cosmos-star/70 sm:text-sm">
            {t(`${active.i18nKey}.tagline`)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.temperature")}
            </p>
            <p className="mt-1 font-mono text-sm text-cosmos-plasma">
              {activeTempLabel}
            </p>
          </div>
          <Link
            href={`/${locale}/stop/${active.id}`}
            className="inline-flex items-center gap-1 rounded-full border border-cosmos-aurora/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-cosmos-aurora transition-colors hover:border-cosmos-plasma hover:text-cosmos-plasma focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-plasma/60"
          >
            {t("common.openStop")}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      <div className="relative h-12">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-cosmos-aurora/30 via-cosmos-plasma/60 to-cosmos-nova/30" />

        {items.map((item, idx) => {
          const pct = lastIdx === 0 ? 50 : (idx / lastIdx) * 100;
          const isActive = idx === activeIdx;
          const isHighlighted = idx === highlightIdx;
          const tempForLabel = formatTemperature(item.temperatureKelvin);
          const itemName = t(`${item.i18nKey}.name`);
          return (
            <button
              key={item.id}
              type="button"
              onFocus={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(idx)}
              aria-label={`${itemName} — ${tempForLabel}`}
              aria-pressed={isActive}
              aria-current={isHighlighted ? "location" : undefined}
              style={{ left: `${pct}%` }}
              className="group/dot absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 focus:outline-none"
            >
              <span
                className={clsx(
                  "block rounded-full transition-all duration-150",
                  isHighlighted
                    ? "h-5 w-5 bg-cosmos-aurora ring-2 ring-cosmos-aurora/60 ring-offset-2 ring-offset-cosmos-deep"
                    : isActive
                      ? "h-4 w-4 bg-cosmos-nova ring-1 ring-white/20"
                      : "h-2.5 w-2.5 bg-cosmos-star/70 ring-1 ring-white/20 group-hover/dot:scale-125 group-hover/dot:bg-cosmos-plasma"
                )}
              />
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-cosmos-star/55">
        {t("common.temperatureLegend")}
      </p>
    </section>
  );
}
