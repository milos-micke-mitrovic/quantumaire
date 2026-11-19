"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { formatLightTime, formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import { ScaleExplorer, type ExplorerItem } from "./ScaleExplorer";

const C = 299_792_458;
const LY = 9.4607304725808e15;

interface DistanceScaleProps {
  highlightStopId?: string;
}

/**
 * Distance view of the scale explorer: Earth as the origin anchor, then
 * every stop with a known distance, out to the cosmic horizon.
 */
export function DistanceScale({ highlightStopId }: DistanceScaleProps = {}) {
  const { t } = useI18n();
  const { units } = useUnits();

  const items = useMemo<ExplorerItem[]>(() => {
    const distant = STOPS.filter(
      (s) =>
        typeof s.distanceFromEarthMeters === "number" &&
        s.distanceFromEarthMeters > 0
    )
      .sort(
        (a, b) =>
          (a.distanceFromEarthMeters as number) -
          (b.distanceFromEarthMeters as number)
      )
      .map<ExplorerItem>((s) => ({
        stop: s,
        value: s.distanceFromEarthMeters as number,
        name: s.distanceNameKey ? t(s.distanceNameKey) : undefined,
      }));
    const earth = STOPS.find((s) => s.id === "earth");
    return earth ? [{ stop: earth, value: null }, ...distant] : distant;
  }, [t]);

  const ticks = [
    { value: C, label: t("common.explorer.lightSecond") },
    { value: C * 60, label: t("common.explorer.lightMinute") },
    { value: C * 3600, label: t("common.explorer.lightHour") },
    { value: C * 86400, label: t("common.explorer.lightDay") },
    { value: LY, label: formatMeters(LY, t, units) },
    { value: LY * 1e3, label: formatMeters(LY * 1e3, t, units) },
    { value: LY * 1e6, label: formatMeters(LY * 1e6, t, units) },
    { value: LY * 1e9, label: formatMeters(LY * 1e9, t, units) },
  ];

  return (
    <ScaleExplorer
      items={items}
      valueLabel={t("common.distanceFromEarth")}
      formatValue={(v) => formatMeters(v, t, units)}
      formatSubValue={(v) => formatLightTime(v, t)}
      stepKey="common.explorer.stepDistance"
      ticks={ticks}
      legend={t("common.distanceLegend")}
      highlightStopId={highlightStopId}
      originLabel={t("common.here")}
    />
  );
}
