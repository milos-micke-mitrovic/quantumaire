"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { formatMeters, logPosition } from "@/lib/scale";

/**
 * Distance-axis sibling of `InteractiveScale`. Plots every stop that has a
 * `distanceFromEarthMeters` value on a logarithmic axis from ~10⁸ m (Moon
 * distance) to ~10²⁷ m (cosmic horizon).
 *
 * Hover preview + click to open the dedicated stop page.
 */

const MIN_EXP = 8;
const MAX_EXP = 27;
const SPAN = MAX_EXP - MIN_EXP;

const SUPERSCRIPTS: Record<string, string> = {
  "-": "⁻",
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

function toSuperscript(n: number): string {
  return String(n)
    .split("")
    .map((ch) => SUPERSCRIPTS[ch] ?? ch)
    .join("");
}

export function DistanceScale() {
  const { t, locale } = useI18n();

  const distantStops = useMemo(
    () =>
      STOPS.filter(
        (
          s
        ): s is typeof s & {
          distanceFromEarthMeters: number;
        } =>
          typeof s.distanceFromEarthMeters === "number" &&
          s.distanceFromEarthMeters > 0
      ).sort(
        (a, b) => a.distanceFromEarthMeters - b.distanceFromEarthMeters
      ),
    []
  );

  const [hoveredIdx, setHoveredIdx] = useState(0);

  const positions = useMemo(
    () =>
      distantStops.map((s) =>
        logPosition(s.distanceFromEarthMeters, MIN_EXP, MAX_EXP)
      ),
    [distantStops]
  );

  if (distantStops.length === 0) return null;
  const active = distantStops[Math.min(hoveredIdx, distantStops.length - 1)];

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
            {t(`${active.i18nKey}.name`)}
          </h3>
          <p className="mt-1 text-xs leading-snug text-cosmos-star/70 sm:text-sm">
            {t(`${active.i18nKey}.tagline`)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
            {t("common.distance")}
          </p>
          <p className="mt-1 font-mono text-sm text-cosmos-plasma">
            {formatMeters(active.distanceFromEarthMeters)}
          </p>
        </div>
      </header>

      <div className="relative h-16">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-cosmos-aurora/30 via-cosmos-plasma/60 to-cosmos-nova/30" />

        {/* Tick marks every 3 orders of magnitude. */}
        {Array.from(
          { length: Math.floor(SPAN / 3) + 1 },
          (_, i) => MIN_EXP + i * 3
        ).map((exp) => {
          const pct = ((exp - MIN_EXP) / SPAN) * 100;
          return (
            <span
              key={exp}
              aria-hidden
              style={{ left: `${pct}%` }}
              className="absolute top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-white/15"
            />
          );
        })}

        {distantStops.map((stop, idx) => {
          const pct = positions[idx] * 100;
          const isActive = idx === hoveredIdx;
          return (
            <Link
              key={stop.id}
              href={`/${locale}/stop/${stop.id}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onFocus={() => setHoveredIdx(idx)}
              aria-label={`${t(`${stop.i18nKey}.name`)} — ${formatMeters(stop.distanceFromEarthMeters)}`}
              style={{ left: `${pct}%` }}
              className="group/dot absolute top-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            >
              <span
                className={clsx(
                  "block rounded-full ring-1 ring-white/20 transition-all duration-150",
                  isActive
                    ? "h-4 w-4 bg-cosmos-nova"
                    : "h-2.5 w-2.5 bg-cosmos-star/70 group-hover/dot:scale-125 group-hover/dot:bg-cosmos-plasma"
                )}
              />
            </Link>
          );
        })}
      </div>

      {/* Order-of-magnitude axis labels — every six tick units. */}
      <div className="relative mt-2 h-4">
        {[MIN_EXP, 12, 16, 20, 24, MAX_EXP].map((exp) => {
          const pct = ((exp - MIN_EXP) / SPAN) * 100;
          return (
            <span
              key={exp}
              aria-hidden
              style={{ left: `${pct}%` }}
              className="absolute -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-cosmos-star/40"
            >
              10{toSuperscript(exp)} m
            </span>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-cosmos-star/55">
        {t("common.distanceLegend")}
      </p>
    </section>
  );
}
