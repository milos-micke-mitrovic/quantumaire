"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import type { Stop } from "@/lib/types";
import { ScaleExplorer, type ExplorerItem } from "./ScaleExplorer";

const LY = 9.4607304725808e15;
const TICKS = [1e-15, 1e-12, 1e-9, 1e-6, 1e-3, 1, 1e3, 1e6, 1e9, 1e12, LY, LY * 1e3, LY * 1e6, LY * 1e9];
/** Every power of ten for the zoomed-in track: metres up to 10¹⁵, then light-years. */
const FINE_TICKS = [
  ...Array.from({ length: 31 }, (_, i) => 10 ** (i - 15)),
  ...Array.from({ length: 11 }, (_, i) => LY * 10 ** i),
];

interface InteractiveScaleProps {
  stops: Stop[];
  /** Stop to pre-select and mark as "you are here". */
  highlightStopId?: string;
}

/** Size view of the scale explorer: every stop with a measurable size. */
export function InteractiveScale({ stops, highlightStopId }: InteractiveScaleProps) {
  const { t } = useI18n();
  const { units } = useUnits();

  const items = useMemo<ExplorerItem[]>(
    () =>
      stops
        .filter((s) => s.sizeMeters !== null && s.sizeMeters > 0)
        .sort((a, b) => (a.sizeMeters as number) - (b.sizeMeters as number))
        .map((s) => ({ stop: s, value: s.sizeMeters as number })),
    [stops]
  );

  return (
    <ScaleExplorer
      items={items}
      valueLabel={t("common.size")}
      formatValue={(v) => formatMeters(v, t, units)}
      stepKey="common.explorer.stepSize"
      ticks={TICKS.map((v) => ({ value: v, label: formatMeters(v, t, units) }))}
      fineTicks={FINE_TICKS.map((v) => ({ value: v, label: formatMeters(v, t, units) }))}
      legend={t("common.scaleLegend")}
      highlightStopId={highlightStopId}
    />
  );
}
