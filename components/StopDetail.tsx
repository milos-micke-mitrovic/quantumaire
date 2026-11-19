"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import clsx from "clsx";
import type { Stop } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { formatFactor } from "@/lib/references";
import { categorySlug } from "@/lib/content";
import { useMarkVisited } from "@/lib/visited";
import { Badge } from "./Badge";
import { BookmarkButton } from "./BookmarkButton";
import { GlossaryTerm } from "./GlossaryTerm";
import { JourneyMinimap } from "./JourneyMinimap";
import { LightboxImage } from "./LightboxImage";
import { LinkedBody } from "./LinkedBody";
import { KeyboardNav } from "./KeyboardNav";
import { ShareBar } from "./ShareBar";
import { QuickFacts } from "./QuickFacts";
import { Sources } from "./Sources";
import { StopCard } from "./StopCard";
import { StopComparisonCard } from "./StopComparisonCard";
import { StopGuides } from "./StopGuides";
import { StopHighlights } from "./StopHighlights";
import { StopSectionNav } from "./StopSectionNav";
import { StopTags } from "./StopTags";
import { StopValuesCard } from "./StopValuesCard";
import { Fragment, type ReactNode } from "react";

interface StopDetailProps {
  stop: Stop;
  prev: Stop | null;
  next: Stop | null;
  related: Stop[];
  /** Build-time ISO date (YYYY-MM-DD) for the "last updated" footer line. */
  lastUpdated: string;
  /** Server-rendered content slotted after the quick facts (e.g. size FAQ). */
  children?: ReactNode;
}

export function StopDetail({
  stop,
  prev,
  next,
  related,
  lastUpdated,
  children,
}: StopDetailProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  useMarkVisited(stop.id);

  // Carry the current section (#everyday, #qa, …) over to the prev/next
  // stop, so a reader following one section can hop stop to stop.
  const keepSectionHash = (e: React.MouseEvent, href: string) => {
    const hash = window.location.hash;
    if (!hash || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    router.push(href + hash);
  };

  return (
    <main className="relative mx-auto w-full max-w-5xl px-5 pb-32 pt-10 sm:px-8">
      <KeyboardNav
        prevHref={prev ? `/${locale}/stop/${prev.id}` : undefined}
        nextHref={next ? `/${locale}/stop/${next.id}` : undefined}
      />
      <nav
        aria-label={t("common.breadcrumb")}
        className="mb-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cosmos-star/55"
      >
        <Link
          href={`/${locale}`}
          className="transition-colors hover:text-cosmos-star"
        >
          {t("common.title")}
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/${locale}/category/${categorySlug(stop.category)}`}
          className="transition-colors hover:text-cosmos-star"
        >
          {t(`categories.${stop.category}`)}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-cosmos-star/80">
          {t(`${stop.i18nKey}.name`)}
        </span>
      </nav>

      <div className="mb-6">
        <Link
          href={`/${locale}#journey`}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-cosmos-star/70 transition-colors hover:text-cosmos-star"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" />
          </svg>
          {t("common.returnHome")}
        </Link>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={clsx(
          "relative overflow-hidden rounded-3xl border border-white/10 bg-cosmos-deep/55 p-6 backdrop-blur-sm sm:p-10",
          stop.accentGlow
        )}
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cosmos-star/70">
                {t(`categories.${stop.category}`)}
              </span>
              <StopTags tags={stop.tags} size="md" />
              <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cosmos-star/55">
                {t("common.minRead", {
                  minutes: Math.max(
                    1,
                    Math.round(
                      t(`${stop.i18nKey}.body`).split(/\s+/).length / 200
                    )
                  ),
                })}
              </span>
            </div>

            <h1
              className={clsx(
                "mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl",
                stop.accent
              )}
            >
              {t(`${stop.i18nKey}.name`)}
            </h1>
            <p className="mt-3 text-base text-cosmos-star/80 sm:text-lg">
              {t(`${stop.i18nKey}.tagline`)}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 print:hidden">
              <BookmarkButton stopId={stop.id} size="md" />
              <ShareBar title={t(`${stop.i18nKey}.name`)} />
              {stop.id !== "earth" && (
                <Link
                  href={`/${locale}/compare?a=${stop.id}&b=earth`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cosmos-star/75 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden
                  >
                    <path d="M7 16V4M7 4l-3 3M7 4l3 3" />
                    <path d="M17 8v12M17 20l-3-3M17 20l3-3" />
                  </svg>
                  {t("common.compare")}
                </Link>
              )}
            </div>
          </div>

          <div>
            <LightboxImage image={stop.image} priority />
          </div>
        </div>
      </motion.header>

      <StopSectionNav key={stop.id} />
      <StopValuesCard stop={stop} />
      <StopComparisonCard stop={stop} />

      <motion.section
        id="story"
        data-section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-10"
      >
        <div className="mb-4">
          <Badge type={stop.badge} />
        </div>
        <LinkedBody
          body={t(`${stop.i18nKey}.body`)}
          glossaryKeys={stop.glossary}
          className="text-base leading-relaxed text-cosmos-star/85 sm:text-[17px]"
        />

        <StopHighlights stop={stop} />

        {stop.glossary.length > 0 && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.glossary")}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              {stop.glossary.map((g, i) => (
                <Fragment key={g}>
                  <GlossaryTerm termKey={g} />
                  {i < stop.glossary.length - 1 && (
                    <span aria-hidden className="text-cosmos-star/30">
                      ·
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </motion.section>


      <QuickFacts stop={stop} />

      <StopGuides stop={stop} />

      {children}

      {stop.sources && stop.sources.length > 0 && (
        <Sources sources={stop.sources} />
      )}

      <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-cosmos-star/40">
        {t("common.lastUpdated", { date: lastUpdated })}
      </p>

      <JourneyMinimap stopId={stop.id} />

      {related.length > 0 && (
        <section id="related" data-section className="mt-12 print:hidden">
          <h2 className="font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl">
            {t("common.relatedStops")}
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <StopCard key={r.id} stop={r} index={i} />
            ))}
          </div>
        </section>
      )}

      <nav
        className="mt-10 grid gap-3 sm:grid-cols-2"
        aria-label={t("common.stopNavigation")}
      >
        {prev ? (
          <NavCard
            stop={prev}
            current={stop}
            dir="prev"
            onNavigate={keepSectionHash}
          />
        ) : (
          <span aria-hidden />
        )}
        {next ? (
          <NavCard
            stop={next}
            current={stop}
            dir="next"
            onNavigate={keepSectionHash}
          />
        ) : (
          <span aria-hidden />
        )}
      </nav>
    </main>
  );
}

/**
 * Previous / next card with a thumbnail on the inner side (opposite the
 * text) and a one-line hint: how much bigger or smaller it is, or its
 * category for ideas without a size.
 */
function NavCard({
  stop,
  current,
  dir,
  onNavigate,
}: {
  stop: Stop;
  current: Stop;
  dir: "prev" | "next";
  onNavigate: (e: React.MouseEvent, href: string) => void;
}) {
  const { t, locale } = useI18n();
  const href = `/${locale}/stop/${stop.id}`;
  const isNext = dir === "next";

  let hint = t(`categories.${stop.category}`);
  if (stop.sizeMeters && current.sizeMeters) {
    const ratio = stop.sizeMeters / current.sizeMeters;
    if (ratio >= 1.15) hint = t("common.navBigger", { factor: formatFactor(ratio, t) });
    else if (ratio <= 1 / 1.15)
      hint = t("common.navSmaller", { factor: formatFactor(1 / ratio, t) });
  }

  const arrow = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={clsx(
        "h-4 w-4 shrink-0 text-cosmos-star/60 transition-transform",
        isNext ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"
      )}
      aria-hidden
    >
      <path d={isNext ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} strokeLinecap="round" />
    </svg>
  );
  const thumb = (
    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-cosmos-void sm:h-16 sm:w-16">
      <Image
        src={stop.image.src}
        alt=""
        fill
        sizes="64px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </span>
  );
  const text = (
    <span className={clsx("min-w-0 flex-1", isNext ? "text-right" : "text-left")}>
      <span className="block text-[10px] uppercase tracking-[0.22em] text-cosmos-star/55">
        {t(isNext ? "common.next" : "common.prev")}
      </span>
      <span className="mt-1 block truncate font-display text-sm text-cosmos-star sm:text-base">
        {t(`${stop.i18nKey}.name`)}
      </span>
      <span className="mt-0.5 block truncate text-xs text-cosmos-star/50">
        {hint}
      </span>
    </span>
  );

  return (
    <Link
      href={href}
      onClick={(e) => onNavigate(e, href)}
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.05] sm:gap-4 sm:p-4"
    >
      {isNext ? (
        <>
          {thumb}
          {text}
          {arrow}
        </>
      ) : (
        <>
          {arrow}
          {text}
          {thumb}
        </>
      )}
    </Link>
  );
}
