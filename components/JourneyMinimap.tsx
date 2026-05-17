"use client";

import clsx from "clsx";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { DistanceScale } from "./DistanceScale";
import { InteractiveScale } from "./InteractiveScale";
import { TemperatureScale } from "./TemperatureScale";

type Tab = "size" | "distance" | "temperature";

interface JourneyMinimapProps {
  stopId: string;
}

/**
 * Stop-page "you are here" widget. Renders all three journey sliders
 * (size / distance from Earth / temperature) in a tab toggle, with the
 * current stop's dot highlighted in the aurora accent so you can see at a
 * glance where this stop sits on each axis.
 *
 * Each tab is hidden when the current stop has no data for that axis —
 * e.g. an atom has no distance-from-Earth, an idea has no size, so those
 * tabs disappear rather than render an empty highlight.
 */
export function JourneyMinimap({ stopId }: JourneyMinimapProps) {
  const { t } = useI18n();
  const stop = STOPS.find((s) => s.id === stopId);

  // Decide which tabs are meaningful for this specific stop.
  const sizeAvailable = !!(stop && stop.sizeMeters !== null && stop.sizeMeters > 0);
  const distanceAvailable = !!(
    stop &&
    typeof stop.distanceFromEarthMeters === "number" &&
    stop.distanceFromEarthMeters > 0
  );
  const temperatureAvailable = !!(
    stop && typeof stop.temperatureKelvin === "number"
  );

  const available: Tab[] = [];
  if (sizeAvailable) available.push("size");
  if (distanceAvailable) available.push("distance");
  if (temperatureAvailable) available.push("temperature");

  const [tab, setTab] = useState<Tab>(available[0] ?? "size");
  if (available.length === 0) return null;

  return (
    <section
      aria-labelledby={`journey-minimap-${stopId}-heading`}
      className="mt-12"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id={`journey-minimap-${stopId}-heading`}
          className="font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl"
        >
          {t("common.journeyMinimap.heading")}
        </h2>
        <p className="text-[11px] uppercase tracking-[0.18em] text-cosmos-star/55">
          {t("common.journeyMinimap.youAreHere")}
        </p>
      </div>

      <div
        role="group"
        aria-label={t("common.scale")}
        className="mb-4 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1"
      >
        {available.map((v) => {
          const isActive = tab === v;
          const labelKey =
            v === "size"
              ? "common.viewBySize"
              : v === "distance"
                ? "common.viewByDistance"
                : "common.viewByTemperature";
          return (
            <button
              key={v}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTab(v)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors",
                isActive
                  ? "bg-aurora-gradient text-cosmos-void shadow-glow"
                  : "text-cosmos-star/70 hover:text-cosmos-star"
              )}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>

      {tab === "size" && sizeAvailable && (
        <InteractiveScale stops={STOPS} highlightStopId={stopId} />
      )}
      {tab === "distance" && distanceAvailable && (
        <DistanceScale highlightStopId={stopId} />
      )}
      {tab === "temperature" && temperatureAvailable && (
        <TemperatureScale highlightStopId={stopId} />
      )}
    </section>
  );
}
