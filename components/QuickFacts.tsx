"use client";

import { useI18n } from "@/lib/i18n";
import type { Stop } from "@/lib/types";

/**
 * We try fact1…fact8 and render any that resolve to actual translated
 * strings. `t()` returns the key itself when missing, so we filter those
 * out and show however many real facts each stop happens to have.
 */
const POSSIBLE_FACT_KEYS = [
  "fact1",
  "fact2",
  "fact3",
  "fact4",
  "fact5",
  "fact6",
  "fact7",
  "fact8",
] as const;

interface QuickFactsProps {
  stop: Stop;
}

export function QuickFacts({ stop }: QuickFactsProps) {
  const { t } = useI18n();
  const facts = POSSIBLE_FACT_KEYS.map((k) => {
    const fullKey = `${stop.i18nKey}.facts.${k}`;
    const value = t(fullKey);
    return { k, value, present: value !== fullKey };
  }).filter((f) => f.present);

  if (facts.length === 0) return null;

  return (
    <section
      aria-label={t("common.quickFacts")}
      className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
    >
      <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
        {t("common.quickFacts")}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {facts.map(({ k, value }) => (
          <li
            key={k}
            className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-sm leading-relaxed text-cosmos-star/85 sm:text-[15px]"
          >
            <span
              aria-hidden
              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cosmos-plasma"
            />
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
