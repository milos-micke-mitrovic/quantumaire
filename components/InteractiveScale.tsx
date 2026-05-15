"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { formatMeters, logPosition } from "@/lib/scale";
import type { Stop } from "@/lib/types";

interface InteractiveScaleProps {
  stops: Stop[];
}

/**
 * Horizontal log-scale slider. Only stops with a concrete size are plotted
 * (abstract stops — MPD, dark matter, dark energy — would lie about their
 * place on a size axis, so they are excluded here and surfaced only in the
 * card grid below the slider).
 *
 * Hovering or focusing a dot previews the stop; clicking navigates to the
 * dedicated stop page.
 */
export function InteractiveScale({ stops }: InteractiveScaleProps) {
  const { t, locale } = useI18n();

  const sizedStops = useMemo(
    () =>
      stops.filter(
        (s): s is Stop & { sizeMeters: number } =>
          s.sizeMeters !== null && s.sizeMeters > 0
      ),
    [stops]
  );

  const [hoveredIdx, setHoveredIdx] = useState(0);

  const positions = useMemo(
    () => sizedStops.map((s) => logPosition(s.sizeMeters, -18, 27)),
    [sizedStops]
  );

  if (sizedStops.length === 0) return null;
  const active = sizedStops[Math.min(hoveredIdx, sizedStops.length - 1)];

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
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
            {t("common.size")}
          </p>
          <p className="mt-1 font-mono text-sm text-cosmos-plasma">
            {formatMeters(active.sizeMeters)}
          </p>
        </div>
      </header>

      <div className="relative h-16">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-cosmos-aurora/30 via-cosmos-plasma/60 to-cosmos-nova/30" />

        {/* Major-magnitude ticks only — half as many DOM nodes. */}
        {Array.from({ length: 16 }, (_, i) => i * 3 - 18).map((exp) => {
          const pct = ((exp + 18) / 45) * 100;
          return (
            <span
              key={exp}
              aria-hidden
              style={{ left: `${pct}%` }}
              className="absolute top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-white/15"
            />
          );
        })}

        {sizedStops.map((stop, idx) => {
          const pct = positions[idx] * 100;
          const isActive = idx === hoveredIdx;
          return (
            <Link
              key={stop.id}
              href={`/${locale}/stop/${stop.id}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onFocus={() => setHoveredIdx(idx)}
              aria-label={`${t(`${stop.i18nKey}.name`)} — ${formatMeters(stop.sizeMeters)}`}
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

      {/* Order-of-magnitude axis labels — every six tick units (10⁶ apart),
          so the log nature of the scale is visible at a glance. */}
      <div className="relative mt-2 h-4">
        {[-18, -12, -6, 0, 6, 12, 18, 24].map((exp) => {
          const pct = ((exp + 18) / 45) * 100;
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
        {t("common.scaleLegend")}
      </p>
    </section>
  );
}

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
