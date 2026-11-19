"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { getStop } from "@/lib/content";
import { formatLightTime, formatMeters, formatTemperature } from "@/lib/scale";
import type { KeyNumber, Topic } from "@/lib/topics";
import { useTempUnit, useUnits } from "@/lib/units";

interface GuideKeyNumbersProps {
  topic: Topic;
}

const METRIC_LABEL = {
  size: "common.size",
  distance: "common.distanceFromEarth",
  temperature: "common.temperature",
} as const;

/**
 * "Key numbers" table at the top of a guide. Topic-backed rows read the
 * same data as the topic pages (and follow the km/mi and °C/°F/K
 * switches); text rows are written per guide in the locale files.
 */
export function GuideKeyNumbers({ topic }: GuideKeyNumbersProps) {
  const { t, locale } = useI18n();
  const { units } = useUnits();
  const { tempUnit } = useTempUnit();

  if (topic.keyNumbers.length === 0) return null;

  const row = (kn: KeyNumber, i: number) => {
    if ("text" in kn) {
      return (
        <tr key={i} className="border-t border-white/10 first:border-t-0">
          <th scope="row" className="py-3 pr-4 text-left align-top text-sm font-normal text-cosmos-star/85">
            {t(`${topic.i18nKey}.keyNumber${kn.text}Label`)}
          </th>
          <td className="py-3 text-right align-top font-mono text-sm text-cosmos-plasma sm:text-base">
            {t(`${topic.i18nKey}.keyNumber${kn.text}Value`)}
          </td>
        </tr>
      );
    }
    const stop = getStop(kn.stopId);
    if (!stop) return null;
    const meters =
      kn.value === "size" ? stop.sizeMeters : stop.distanceFromEarthMeters;
    // Things we sit inside are measured to a point ("Edge of the
    // observable universe") — name that point instead of the object.
    const name =
      kn.value === "distance" && stop.distanceNameKey
        ? t(stop.distanceNameKey)
        : t(`${stop.i18nKey}.name`);
    const value =
      kn.value === "temperature"
        ? formatTemperature(stop.temperatureKelvin, t, tempUnit)
        : formatMeters(meters ?? null, t, units);
    const lightTime =
      kn.value === "distance" ? formatLightTime(meters, t) : null;
    return (
      <tr key={i} className="border-t border-white/10 first:border-t-0">
        <th scope="row" className="py-3 pr-4 text-left align-top font-normal">
          <Link
            href={`/${locale}/stop/${stop.id}`}
            className="text-sm text-cosmos-star underline decoration-cosmos-plasma/40 decoration-dotted underline-offset-4 transition-colors hover:text-cosmos-plasma"
          >
            {name}
          </Link>
          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-cosmos-star/55">
            {t(METRIC_LABEL[kn.value])}
          </span>
        </th>
        <td className="py-3 text-right align-top font-mono text-sm text-cosmos-plasma sm:text-base">
          {value}
          {lightTime && (
            <span className="mt-0.5 block font-sans text-xs text-cosmos-star/55">
              {lightTime}
            </span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <section
      aria-labelledby="key-numbers"
      className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-5 sm:px-8 sm:py-6"
    >
      <h2
        id="key-numbers"
        className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55"
      >
        {t("common.keyNumbers")}
      </h2>
      <table className="mt-2 w-full border-collapse">
        <tbody>{topic.keyNumbers.map(row)}</tbody>
      </table>
    </section>
  );
}
