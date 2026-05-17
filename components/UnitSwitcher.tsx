"use client";

import clsx from "clsx";
import { useI18n } from "@/lib/i18n";
import { useUnits, type UnitSystem } from "@/lib/units";

const OPTIONS: Array<{ value: UnitSystem; labelKey: string }> = [
  { value: "metric", labelKey: "common.unitMetricShort" },
  { value: "imperial", labelKey: "common.unitImperialShort" },
];

/**
 * Header-mounted toggle between metric (km) and imperial (mi) for the
 * macro-scale numbers across the site. Stored in localStorage, so the
 * choice persists across navigation and tabs.
 */
export function UnitSwitcher() {
  const { t } = useI18n();
  const { units, setUnits } = useUnits();
  return (
    <div
      role="group"
      aria-label={t("common.units")}
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={opt.value === units}
          onClick={() => setUnits(opt.value)}
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-medium tracking-wider transition-colors",
            opt.value === units
              ? "bg-aurora-gradient text-cosmos-void shadow-glow"
              : "text-cosmos-star/70 hover:text-cosmos-star"
          )}
        >
          {t(opt.labelKey)}
        </button>
      ))}
    </div>
  );
}
