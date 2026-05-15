"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { VisitedCounter } from "./VisitedCounter";

export function SiteFooter() {
  const { t, locale } = useI18n();
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-2 text-xs text-cosmos-star/55 sm:px-8 print:hidden">
      <div className="mx-auto mb-6 h-px max-w-3xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
          <p className="text-center sm:text-left">{t("common.footer")}</p>
          <VisitedCounter />
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
          <Link
            href={`/${locale}/about`}
            className="transition-colors hover:text-cosmos-star"
          >
            {t("common.about")}
          </Link>
          <span aria-hidden className="h-3 w-px bg-white/15" />
          <Link
            href={`/${locale}/glossary`}
            className="transition-colors hover:text-cosmos-star"
          >
            {t("common.glossary")}
          </Link>
          <span aria-hidden className="h-3 w-px bg-white/15" />
          <Link
            href={`/${locale}/tools/scale`}
            className="transition-colors hover:text-cosmos-star"
          >
            {t("common.tools")}
          </Link>
          <span aria-hidden className="h-3 w-px bg-white/15" />
          <a
            href="/llms.txt"
            className="transition-colors hover:text-cosmos-star"
            rel="noopener"
          >
            llms.txt
          </a>
          <span aria-hidden className="h-3 w-px bg-white/15" />
          <a
            href="/sitemap.xml"
            className="transition-colors hover:text-cosmos-star"
            rel="noopener"
          >
            Sitemap
          </a>
        </nav>
      </div>
      <p className="mt-4 text-center font-mono uppercase tracking-[0.22em] text-cosmos-star/35 sm:text-left">
        © {new Date().getFullYear()} · {t("common.title")}
      </p>
    </footer>
  );
}
