"use client";

import clsx from "clsx";
import { useI18n } from "@/lib/i18n";
import { useTempUnit, type TempUnit } from "@/lib/units";

export const TEMP_OPTIONS: Array<{ value: TempUnit; label: string }> = [
  { value: "C", label: "°C" },
  { value: "F", label: "°F" },
  { value: "K", label: "K" },
];

/**
 * Header toggle for the preferred temperature scale (°C / °F / K).
 * Persisted in localStorage like the km/mi switch.
 */
export function TempUnitSwitcher({ className }: { className?: string }) {
  const { t } = useI18n();
  const { tempUnit, setTempUnit } = useTempUnit();
  return (
    <div
      role="group"
      aria-label={t("common.temperatureUnit")}
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md",
        className
      )}
    >
      {TEMP_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={opt.value === tempUnit}
          onClick={() => setTempUnit(opt.value)}
          className={clsx(
            "min-h-9 flex-1 rounded-full px-2.5 py-1 text-xs font-medium tracking-wider transition-colors",
            opt.value === tempUnit
              ? "bg-aurora-gradient text-cosmos-void shadow-glow"
              : "text-cosmos-star/70 hover:text-cosmos-star"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
