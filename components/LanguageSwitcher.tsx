"use client";

import { SUPPORTED_LOCALES, useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { ToggleGroup } from "./ToggleGroup";

const LOCALE_OPTIONS = SUPPORTED_LOCALES.map((l) => ({
  value: l,
  label: l.toUpperCase(),
  lang: l === "sr" ? "sr-Latn" : "en",
}));

export function LanguageSwitcher({ fullWidth }: { fullWidth?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <ToggleGroup<Locale>
      label={t("common.language")}
      options={LOCALE_OPTIONS}
      value={locale}
      onChange={setLocale}
      fullWidth={fullWidth}
    />
  );
}
