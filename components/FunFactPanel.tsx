"use client";

import { useI18n } from "@/lib/i18n";

interface FunFactPanelProps {
  /** Stop's i18n prefix — used to look up `<prefix>.funFact`. */
  i18nKey: string;
}

/**
 * "Did you know?" callout — one surprising line per stop. Hand-written per
 * stop in the translation files; renders nothing for stops without a
 * `funFact` translation.
 */
export function FunFactPanel({ i18nKey }: FunFactPanelProps) {
  const { t } = useI18n();
  const key = `${i18nKey}.funFact`;
  const fact = t(key);
  if (fact === key) return null;

  return (
    <section
      aria-label={t("comparison.didYouKnow")}
      className="relative mt-8 overflow-hidden rounded-3xl border border-cosmos-aurora/30 bg-gradient-to-br from-cosmos-aurora/[0.08] via-cosmos-plasma/[0.04] to-transparent p-6 backdrop-blur-sm sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cosmos-aurora/15 blur-3xl"
      />
      <div className="relative flex items-start gap-3">
        <div
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-aurora-gradient shadow-glow"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-cosmos-void"
            aria-hidden
          >
            <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
            <path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
            <path d="M5 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/60">
            {t("comparison.didYouKnow")}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-cosmos-star/90 sm:text-[15px]">
            {fact}
          </p>
        </div>
      </div>
    </section>
  );
}
