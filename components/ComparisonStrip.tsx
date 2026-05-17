"use client";

import { useI18n } from "@/lib/i18n";
import { formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";

interface ComparisonStripProps {
  /** Real-world meters of the stop, or null if abstract. */
  sizeMeters: number | null;
  /** Stop's i18n prefix — used to look up `<prefix>.narrative`. */
  i18nKey: string;
}

/**
 * Inline scale comparison shown inside the stop header.
 *
 * Every stop owns a hand-written `narrative` translation that paints a
 * vivid scale-up metaphor ("If an atom were a marble, a hair would be
 * wider than a city"). This component just displays that line — the heavy
 * lifting is in the translation files, where the imagery is curated.
 */
export function ComparisonStrip({
  sizeMeters,
  i18nKey,
}: ComparisonStripProps) {
  const { t } = useI18n();
  const { units } = useUnits();
  const narrativeKey = `${i18nKey}.narrative`;
  const narrative = t(narrativeKey);
  const hasNarrative = narrative !== narrativeKey;
  const line = hasNarrative
    ? narrative
    : sizeMeters === null
      ? t("comparison.abstract")
      : "";

  return (
    <div className="mt-5 flex flex-wrap items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <div
        aria-hidden
        className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-cosmos-night/60"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cosmos-nova shadow-[0_0_8px_rgba(240,171,252,0.8)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("comparison.pictureThis")}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-cosmos-star/85">
          {line}
        </p>
      </div>
      {sizeMeters !== null && (
        <span className="mt-1 font-mono text-xs text-cosmos-plasma">
          {formatMeters(sizeMeters, t, units)}
        </span>
      )}
    </div>
  );
}
