"use client";

import { useI18n } from "@/lib/i18n";

interface IfDistancePanelProps {
  /** Stop's i18n prefix — used to look up `<prefix>.ifDistance`. */
  i18nKey: string;
}

/**
 * Optional "if you scaled the distance" thought-experiment panel.
 * Renders nothing when the stop has no `ifDistance` translation.
 *
 * Sibling to `ComparisonStrip` (which handles the size-based "if"). This
 * one paints the distance-based version: "If the Earth–Sun distance were
 * the width of a coffee cup, the nearest other star would be three
 * kilometres away."
 */
export function IfDistancePanel({ i18nKey }: IfDistancePanelProps) {
  const { t } = useI18n();
  const key = `${i18nKey}.ifDistance`;
  const line = t(key);
  if (line === key || !line) return null;

  return (
    <div className="mt-3 flex flex-wrap items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <div
        aria-hidden
        className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-cosmos-night/60"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cosmos-aurora shadow-[0_0_8px_rgba(124,92,255,0.8)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("comparison.ifDistance")}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-cosmos-star/85">
          {line}
        </p>
      </div>
    </div>
  );
}
