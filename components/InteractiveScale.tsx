"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import type { Stop } from "@/lib/types";

interface InteractiveScaleProps {
  stops: Stop[];
  /**
   * Optional stop id to highlight as "you are here". When set, that dot
   * gets a distinct treatment and the slider starts with it pre-selected.
   */
  highlightStopId?: string;
}

/**
 * Horizontal stop selector. Only stops with a concrete size are plotted —
 * abstract stops (MPD, dark matter, dark energy) live in the card grid
 * below.
 *
 * Dots are evenly spaced regardless of magnitude; their visual position
 * encodes ordinal rank (smallest → largest), not real ratios. Tapping or
 * focusing a dot previews the stop; the explicit `Open stop` link in the
 * header is the navigation affordance.
 */
export function InteractiveScale({
  stops,
  highlightStopId,
}: InteractiveScaleProps) {
  const { t, locale } = useI18n();
  const { units } = useUnits();

  const sizedStops = useMemo(
    () =>
      stops
        .filter(
          (s): s is Stop & { sizeMeters: number } =>
            s.sizeMeters !== null && s.sizeMeters > 0
        )
        .sort((a, b) => a.sizeMeters - b.sizeMeters),
    [stops]
  );

  const highlightIdx = useMemo(
    () =>
      highlightStopId
        ? sizedStops.findIndex((s) => s.id === highlightStopId)
        : -1,
    [highlightStopId, sizedStops]
  );

  const [activeIdx, setActiveIdx] = useState(
    highlightIdx >= 0 ? highlightIdx : 0
  );

  if (sizedStops.length === 0) return null;
  const active = sizedStops[Math.min(activeIdx, sizedStops.length - 1)];
  const lastIdx = sizedStops.length - 1;

  return (
    <section
      aria-label={t("common.scale")}
      className="relative w-full rounded-3xl border border-white/10 bg-cosmos-deep/60 px-4 py-6 sm:px-8 sm:py-7"
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
            {t("common.scale")}
          </p>
          <h3 className="mt-1 font-display text-lg text-cosmos-star sm:text-xl">
            {t(`${active.i18nKey}.name`)}
          </h3>
          <p className="mt-1 text-xs leading-snug text-cosmos-star/70 sm:text-sm">
            {t(`${active.i18nKey}.tagline`)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.size")}
            </p>
            <p className="mt-1 font-mono text-sm text-cosmos-plasma">
              {formatMeters(active.sizeMeters, t, units)}
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

      <div className="-mx-4 overflow-x-auto pb-3 sm:mx-0 sm:overflow-visible sm:pb-0 [scrollbar-width:thin]">
        <div
          className="relative h-12 mx-4 sm:mx-0 min-w-[var(--scale-min)] sm:min-w-0"
          style={
            {
              "--scale-min": `${sizedStops.length * 44}px`,
            } as React.CSSProperties
          }
        >
          <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-cosmos-aurora/30 via-cosmos-plasma/60 to-cosmos-nova/30" />

          {sizedStops.map((stop, idx) => {
            const pct = lastIdx === 0 ? 50 : (idx / lastIdx) * 100;
            const isActive = idx === activeIdx;
            const isHighlighted = idx === highlightIdx;
            return (
              <button
                key={stop.id}
                type="button"
                onFocus={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                aria-label={`${t(`${stop.i18nKey}.name`)} — ${formatMeters(stop.sizeMeters, t, units)}`}
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
                        : "h-3 w-3 bg-cosmos-star/70 ring-1 ring-white/20 group-hover/dot:scale-125 group-hover/dot:bg-cosmos-plasma"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-cosmos-star/55">
        {t("common.scaleLegend")}
      </p>
    </section>
  );
}
