"use client";

import { useI18n } from "@/lib/i18n";

interface MassStripProps {
  /** Stop's i18n prefix — used to look up `<prefix>.massNarrative`. */
  i18nKey: string;
}

/**
 * Renders the optional "By weight" narrative line for stops where mass
 * adds a meaningful second dimension (macro: stars, black holes, galaxies).
 * Returns null if the stop has no `massNarrative` translation — so micro
 * stops where mass isn't visceral simply skip this block.
 */
export function MassStrip({ i18nKey }: MassStripProps) {
  const { t } = useI18n();
  const narrativeKey = `${i18nKey}.massNarrative`;
  const narrative = t(narrativeKey);
  if (narrative === narrativeKey) return null;

  return (
    <div className="mt-3 flex flex-wrap items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <div
        aria-hidden
        className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-cosmos-night/60"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-cosmos-ember"
        >
          <path d="M12 2v3" />
          <path d="M5 6h14" />
          <path d="M7 6l-3 9a5 5 0 0 0 10 0L11 6" />
          <path d="M17 6l-3 9a5 5 0 0 0 10 0l-3-9" />
          <path d="M9 22h6" />
          <path d="M12 22V11" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("comparison.byWeight")}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-cosmos-star/85">
          {narrative}
        </p>
      </div>
    </div>
  );
}
