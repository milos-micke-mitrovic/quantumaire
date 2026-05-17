"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { useBookmarks } from "@/lib/bookmarks";
import { STOPS } from "@/lib/content";
import { StopCard } from "./StopCard";

export function FavoritesView() {
  const { t, locale } = useI18n();
  const { bookmarks } = useBookmarks();

  const saved = useMemo(
    () => STOPS.filter((s) => bookmarks.has(s.id)),
    [bookmarks]
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <header className="mb-8 max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("common.bookmarksTitle")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-cosmos-star sm:text-4xl">
          {t("common.bookmarksTitle")}
        </h1>
        <p className="mt-3 text-sm text-cosmos-star/70 sm:text-base">
          {t("common.bookmarksTagline")}
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-sm text-cosmos-star/75">
            {t("common.bookmarksEmpty")}
          </p>
          <Link
            href={`/${locale}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-aurora-gradient px-5 py-2 text-sm font-medium text-cosmos-void shadow-glow transition-transform hover:-translate-y-0.5"
          >
            {t("common.begin")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((stop, i) => (
            <StopCard key={stop.id} stop={stop} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
