"use client";

import { useI18n } from "@/lib/i18n";

/**
 * Skip link — visually hidden until keyboard-focused, then springs into view
 * at the top-left. Lets keyboard and screen-reader users jump past the
 * sticky header straight to the page's main content (each page wraps its
 * primary `<main>` with id="main-content").
 */
export function SkipToContent() {
  const { t } = useI18n();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-aurora-gradient focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-cosmos-void focus:shadow-glow"
    >
      {t("common.skipToContent")}
    </a>
  );
}
