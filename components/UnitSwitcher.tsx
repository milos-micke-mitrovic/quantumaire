"use client";

import { useI18n } from "@/lib/i18n";
import { useUnits, type UnitSystem } from "@/lib/units";
import { ToggleGroup } from "./ToggleGroup";

/**
 * Toggle between metric (km) and imperial (mi) for the macro-scale numbers
 * across the site. Stored in localStorage, so the choice persists across
 * navigation and tabs.
 */
export function UnitSwitcher({ fullWidth }: { fullWidth?: boolean }) {
  const { t } = useI18n();
  const { units, setUnits } = useUnits();
  return (
    <ToggleGroup<UnitSystem>
      label={t("common.units")}
      options={[
        { value: "metric", label: t("common.unitMetricShort") },
        { value: "imperial", label: t("common.unitImperialShort") },
      ]}
      value={units}
      onChange={setUnits}
      fullWidth={fullWidth}
    />
  );
}
