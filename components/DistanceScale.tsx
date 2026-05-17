"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import type { Stop } from "@/lib/types";

/**
 * Distance-axis sibling of `InteractiveScale`. Dots are evenly spaced —
 * position encodes ordinal rank (nearest → farthest from Earth), not real
 * distance ratios. The journey starts at Earth (leftmost anchor) and ends
 * at the cosmic horizon.
 *
 * Tapping a dot previews the stop; the `Open stop` link in the header is
 * the navigation affordance.
 */

type DistanceItem = {
  stop: Stop;
  isOrigin: boolean;
};

interface DistanceScaleProps {
  highlightStopId?: string;
}

export function DistanceScale({ highlightStopId }: DistanceScaleProps = {}) {
  const { t, locale } = useI18n();
  const { units } = useUnits();

  const items = useMemo<DistanceItem[]>(() => {
    const distant = STOPS.filter(
      (s): s is Stop & { distanceFromEarthMeters: number } =>
        typeof s.distanceFromEarthMeters === "number" &&
        s.distanceFromEarthMeters > 0
    )
      .sort((a, b) => a.distanceFromEarthMeters - b.distanceFromEarthMeters)
      .map<DistanceItem>((s) => ({ stop: s, isOrigin: false }));

    const earth = STOPS.find((s) => s.id === "earth");
    return earth ? [{ stop: earth, isOrigin: true }, ...distant] : distant;
  }, []);

  const highlightIdx = useMemo(
    () =>
      highlightStopId
        ? items.findIndex((it) => it.stop.id === highlightStopId)
        : -1,
    [highlightStopId, items]
  );

  const [activeIdx, setActiveIdx] = useState(
    highlightIdx >= 0 ? highlightIdx : 0
  );

  if (items.length === 0) return null;
  const active = items[Math.min(activeIdx, items.length - 1)];
  const lastIdx = items.length - 1;
  const activeDistanceLabel = active.isOrigin
    ? t("common.here")
    : formatMeters(active.stop.distanceFromEarthMeters as number, t, units);
  const activeName = t(
    active.stop.distanceNameKey ?? `${active.stop.i18nKey}.name`
  );

  return (
    <section
      aria-label={t("topics.distances.title")}
      className="relative w-full rounded-3xl border border-white/10 bg-cosmos-deep/60 px-4 py-6 sm:px-8 sm:py-7"
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
            {t("common.distanceFromEarth")}
          </p>
          <h3 className="mt-1 font-display text-lg text-cosmos-star sm:text-xl">
            {activeName}
          </h3>
          <p className="mt-1 text-xs leading-snug text-cosmos-star/70 sm:text-sm">
            {t(`${active.stop.i18nKey}.tagline`)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.distance")}
            </p>
            <p className="mt-1 font-mono text-sm text-cosmos-plasma">
              {activeDistanceLabel}
            </p>
          </div>
          <Link
            href={`/${locale}/stop/${active.stop.id}`}
            className="inline-flex items-center gap-1 rounded-full border border-cosmos-aurora/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-cosmos-aurora transition-colors hover:border-cosmos-plasma hover:text-cosmos-plasma focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-plasma/60"
          >
            {t("common.openStop")}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      <div className="-mx-4 overflow-x-auto pb-3 sm:mx-0 sm:overflow-visible sm:pb-0 [scrollbar-width:thin]">
        <div
          className="relative h-12 mx-4 sm:mx-0 min-w-[var(--scale-min)] sm:min-w-0"
          style={
            { "--scale-min": `${items.length * 44}px` } as React.CSSProperties
          }
        >
          <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-cosmos-aurora/30 via-cosmos-plasma/60 to-cosmos-nova/30" />

          {items.map((item, idx) => {
            const pct = lastIdx === 0 ? 50 : (idx / lastIdx) * 100;
            const isActive = idx === activeIdx;
            const isHighlighted = idx === highlightIdx;
            const distanceForLabel = item.isOrigin
              ? t("common.here")
              : formatMeters(item.stop.distanceFromEarthMeters as number, t, units);
            const itemName = t(
              item.stop.distanceNameKey ?? `${item.stop.i18nKey}.name`
            );
            return (
              <button
                key={item.stop.id}
                type="button"
                onFocus={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                aria-label={`${itemName} — ${distanceForLabel}`}
                aria-pressed={isActive}
                aria-current={isHighlighted ? "location" : undefined}
                style={{ left: `${pct}%` }}
                className="group/dot absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 focus:outline-none sm:p-1.5"
              >
                <span
                  className={clsx(
                    "block rounded-full transition-all duration-150",
                    isHighlighted
                      ? "h-5 w-5 bg-cosmos-aurora ring-2 ring-cosmos-aurora/60 ring-offset-2 ring-offset-cosmos-deep"
                      : isActive
                        ? "h-4 w-4 bg-cosmos-nova ring-1 ring-white/20"
                        : item.isOrigin
                          ? "h-3 w-3 bg-cosmos-aurora/80 ring-1 ring-cosmos-aurora/60 group-hover/dot:scale-125"
                          : "h-3 w-3 bg-cosmos-star/70 ring-1 ring-white/20 group-hover/dot:scale-125 group-hover/dot:bg-cosmos-plasma"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-cosmos-star/55">
        {t("common.distanceLegend")}
      </p>
    </section>
  );
}
