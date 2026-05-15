"use client";

import { useI18n } from "@/lib/i18n";
import type { Stop } from "@/lib/types";

const FACT_KEYS = ["fact1", "fact2", "fact3", "fact4"] as const;

interface QuickFactsProps {
  stop: Stop;
}

export function QuickFacts({ stop }: QuickFactsProps) {
  const { t } = useI18n();
  return (
    <section
      aria-label={t("common.quickFacts")}
      className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
    >
      <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
        {t("common.quickFacts")}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {FACT_KEYS.map((k) => (
          <li
            key={k}
            className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-sm leading-relaxed text-cosmos-star/85 sm:text-[15px]"
          >
            <span
              aria-hidden
              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cosmos-plasma"
            />
            <span>{t(`${stop.i18nKey}.facts.${k}`)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
