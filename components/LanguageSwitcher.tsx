"use client";

import clsx from "clsx";
import { SUPPORTED_LOCALES, useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const LABELS: Record<Locale, string> = {
  en: "EN",
  sr: "SR",
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("common.language")}
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md"
    >
      {SUPPORTED_LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={l === locale}
          onClick={() => setLocale(l)}
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-medium tracking-wider transition-colors",
            l === locale
              ? "bg-aurora-gradient text-cosmos-void shadow-glow"
              : "text-cosmos-star/70 hover:text-cosmos-star"
          )}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
