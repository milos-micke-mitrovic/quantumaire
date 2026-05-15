"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

/**
 * Locale-scoped 404. Rendered when notFound() fires inside `/[locale]/...`.
 * Client component so it can read the active locale from context without
 * forcing the rest of the tree to be dynamic.
 */
export default function LocaleNotFound() {
  const { t, locale } = useI18n();

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-cosmos-star/55">
        {t("common.notFound.label")}
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-cosmos-star sm:text-4xl">
        {t("common.notFound.title")}
      </h1>
      <p className="mt-3 text-cosmos-star/70">
        {t("common.notFound.body")}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-aurora-gradient px-5 py-2.5 text-sm font-medium text-cosmos-void shadow-glow"
      >
        {t("common.notFound.home")}
      </Link>
    </main>
  );
}
