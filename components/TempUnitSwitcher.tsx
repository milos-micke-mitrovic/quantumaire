"use client";

import { useI18n } from "@/lib/i18n";
import { useTempUnit, type TempUnit } from "@/lib/units";
import { ToggleGroup, type ToggleOption } from "./ToggleGroup";

const TEMP_OPTIONS: ReadonlyArray<ToggleOption<TempUnit>> = [
  { value: "C", label: "°C" },
  { value: "F", label: "°F" },
  { value: "K", label: "K" },
];

/**
 * Toggle for the preferred temperature scale (°C / °F / K). Persisted in
 * localStorage like the km/mi switch.
 */
export function TempUnitSwitcher({ fullWidth }: { fullWidth?: boolean }) {
  const { t } = useI18n();
  const { tempUnit, setTempUnit } = useTempUnit();
  return (
    <ToggleGroup
      label={t("common.temperatureUnit")}
      options={TEMP_OPTIONS}
      value={tempUnit}
      onChange={setTempUnit}
      fullWidth={fullWidth}
    />
  );
}
