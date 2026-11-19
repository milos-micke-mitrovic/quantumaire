"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { formatTemperature } from "@/lib/scale";
import { useTempUnit } from "@/lib/units";
import { ScaleExplorer, type ExplorerItem } from "./ScaleExplorer";

const TICKS_K = [10, 100, 273.15, 1e3, 1e4, 1e5, 1e6, 1e7];

interface TemperatureScaleProps {
  highlightStopId?: string;
}

/**
 * Temperature view of the scale explorer: stops with one meaningful
 * temperature, coldest to hottest, on a log-kelvin axis.
 */
export function TemperatureScale({ highlightStopId }: TemperatureScaleProps = {}) {
  const { t } = useI18n();
  const { tempUnit } = useTempUnit();

  const items = useMemo<ExplorerItem[]>(
    () =>
      STOPS.filter(
        (s) => typeof s.temperatureKelvin === "number" && s.temperatureKelvin > 0
      )
        .sort(
          (a, b) => (a.temperatureKelvin as number) - (b.temperatureKelvin as number)
        )
        .map((s) => ({ stop: s, value: s.temperatureKelvin as number })),
    []
  );

  return (
    <ScaleExplorer
      items={items}
      valueLabel={t("common.temperature")}
      formatValue={(v) => formatTemperature(v, t, tempUnit)}
      stepKey="common.explorer.stepTemp"
      ticks={TICKS_K.map((v) => ({
        value: v,
        label: formatTemperature(v, t, tempUnit),
      }))}
      legend={t("common.temperatureLegend")}
      highlightStopId={highlightStopId}
    />
  );
}
