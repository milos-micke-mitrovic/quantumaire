"use client";

import clsx from "clsx";
import { useI18n } from "@/lib/i18n";
import { formatLightTime, formatMeters, formatTemperature } from "@/lib/scale";
import { useTempUnit, useUnits } from "@/lib/units";
import type { Stop } from "@/lib/types";

interface StopValuesCardProps {
  stop: Stop;
}

/**
 * Pure-data card: size, distance from Earth, temperature. One row per
 * value, no comparison, no visual. Renders nothing if the stop has none
 * of these axes (abstract phenomena like dark matter, dark energy, DID).
 */
export function StopValuesCard({ stop }: StopValuesCardProps) {
  const { t } = useI18n();
  const { units } = useUnits();
  const { tempUnit } = useTempUnit();

  const hasSize = stop.sizeMeters !== null && stop.sizeMeters > 0;
  const hasDistance =
    typeof stop.distanceFromEarthMeters === "number" &&
    stop.distanceFromEarthMeters > 0;
  const hasTemp = typeof stop.temperatureKelvin === "number";
  const insideNote =
    !hasDistance && stop.insideNoteKey ? t(stop.insideNoteKey) : null;
  // Things we sit inside (Solar System, Laniakea, …) carry a positional
  // label like "Edge of the Solar System" — clearer than "from Earth".
  const distanceLabel = stop.distanceNameKey
    ? t(stop.distanceNameKey)
    : t("common.distanceFromEarth");
  const statCount =
    (hasSize ? 1 : 0) +
    (hasDistance || insideNote ? 1 : 0) +
    (hasTemp ? 1 : 0);

  if (statCount === 0) return null;

  return (
    <section
      aria-label={t("common.quickFacts")}
      className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-6 sm:px-8 sm:py-7"
    >
      <dl
        className={clsx(
          "grid gap-5",
          statCount >= 2 && "sm:grid-cols-2",
          statCount >= 3 && "lg:grid-cols-3"
        )}
      >
        {hasSize && (
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.size")}
            </dt>
            <dd className="mt-2 whitespace-nowrap font-mono text-base text-cosmos-plasma sm:text-lg">
              {formatMeters(stop.sizeMeters!, t, units)}
            </dd>
          </div>
        )}
        {insideNote && (
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.distanceFromEarth")}
            </dt>
            <dd className="mt-2 text-sm leading-snug text-cosmos-plasma sm:text-base">
              {insideNote}
            </dd>
          </div>
        )}
        {hasDistance && (
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {distanceLabel}
            </dt>
            <dd className="mt-2 whitespace-nowrap font-mono text-base text-cosmos-plasma sm:text-lg">
              {formatMeters(stop.distanceFromEarthMeters!, t, units)}
              {formatLightTime(stop.distanceFromEarthMeters, t) && (
                <span
                  title={t("common.lightTime.hint")}
                  className="mt-1 block font-sans text-xs text-cosmos-star/55"
                >
                  {formatLightTime(stop.distanceFromEarthMeters, t)}
                </span>
              )}
            </dd>
          </div>
        )}
        {hasTemp && (
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.temperature")}
            </dt>
            <dd className="mt-2 whitespace-nowrap font-mono text-base text-cosmos-plasma sm:text-lg">
              {formatTemperature(stop.temperatureKelvin!, t, tempUnit)}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
