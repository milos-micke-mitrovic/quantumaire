"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * Error boundary for `/[locale]/*` routes. Renders inside the locale layout
 * so the I18nProvider is still mounted and translations are available.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, locale } = useI18n();

  useEffect(() => {
    // Surface the error in the console for the user during testing.
    // Replace with a real error reporter (Sentry, etc.) when one is wired up.

    console.error("Quantumaire error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-cosmos-ember">
        500
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-cosmos-star sm:text-4xl">
        {t("common.error.title")}
      </h1>
      <p className="mt-3 text-cosmos-star/70">
        {t("common.error.body")}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-aurora-gradient px-5 py-2.5 text-sm font-medium text-cosmos-void shadow-glow"
        >
          {t("common.error.retry")}
        </button>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-cosmos-star/85 hover:text-cosmos-star"
        >
          {t("common.returnHome")}
        </Link>
      </div>
      {error.digest && (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-cosmos-star/40">
          ref · {error.digest}
        </p>
      )}
    </main>
  );
}
