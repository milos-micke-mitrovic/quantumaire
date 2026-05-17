"use client";

import clsx from "clsx";
import { useI18n } from "@/lib/i18n";
import { formatMeters, formatTemperature } from "@/lib/scale";
import { useUnits } from "@/lib/units";
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

  const hasSize = stop.sizeMeters !== null && stop.sizeMeters > 0;
  const hasDistance =
    typeof stop.distanceFromEarthMeters === "number" &&
    stop.distanceFromEarthMeters > 0;
  const hasTemp = typeof stop.temperatureKelvin === "number";
  const statCount =
    (hasSize ? 1 : 0) + (hasDistance ? 1 : 0) + (hasTemp ? 1 : 0);

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
        {hasDistance && (
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.distanceFromEarth")}
            </dt>
            <dd className="mt-2 whitespace-nowrap font-mono text-base text-cosmos-plasma sm:text-lg">
              {formatMeters(stop.distanceFromEarthMeters!, t, units)}
            </dd>
          </div>
        )}
        {hasTemp && (
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.temperature")}
            </dt>
            <dd className="mt-2 whitespace-nowrap font-mono text-base text-cosmos-plasma sm:text-lg">
              {formatTemperature(stop.temperatureKelvin!)}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
