"use client";

import clsx from "clsx";
import Link from "next/link";
import type { Stop } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { categorySlug } from "@/lib/content";
import { formatLightTime, formatMeters, formatTemperature } from "@/lib/scale";
import { useTempUnit, useUnits } from "@/lib/units";
import { useVisited } from "@/lib/visited";
import { BookmarkButton } from "./BookmarkButton";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { StopTags } from "./StopTags";

interface StopCardProps {
  stop: Stop;
  index: number;
  /** `sizes` for the card image; shelves pass their fixed card width. */
  sizes?: string;
  /** Wait until the card is near the viewport before loading its image. */
  deferImage?: boolean;
}

const GRID_SIZES =
  "(min-width: 1024px) 300px, (min-width: 640px) 45vw, calc(100vw - 4.5rem)";

export function StopCard({ stop, index, sizes = GRID_SIZES, deferImage = false }: StopCardProps) {
  const { t, locale } = useI18n();
  const { tempUnit } = useTempUnit();
  const { visited } = useVisited();
  const isVisited = visited.has(stop.id);

  return (
    <article
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10",
        "bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent",
        "p-5 transition-colors duration-200",
        "hover:border-white/20"
      )}
    >
      <Link
        href={`/${locale}/stop/${stop.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60 rounded-2xl"
      >
        <div className="relative">
          <ImagePlaceholder
            image={stop.image}
            aspect="square"
            className="mb-4"
            defer={deferImage}
            sizes={sizes}
          />
          {isVisited && (
            <span
              title={t("common.visited.marker")}
              className="absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cosmos-deep/85 text-cosmos-nova shadow-glow backdrop-blur-sm"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5"
                aria-hidden
              >
                <path d="M20.285 6.708a1 1 0 0 0-1.414-1.414L9 15.165 5.129 11.293a1 1 0 1 0-1.414 1.414l4.578 4.578a1 1 0 0 0 1.414 0L20.285 6.708z" />
              </svg>
              <span className="sr-only">{t("common.visited.marker")}</span>
            </span>
          )}
        </div>

        <div className="flex items-start justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-cosmos-star/55">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="flex flex-col items-end gap-1 text-right">
            {stop.sizeMeters !== null ? (
              <span className="inline-flex items-baseline gap-2">
                <span className="text-cosmos-star/55">{t("common.size")}</span>
                <span className="text-cosmos-star/85">
                  <CardLength meters={stop.sizeMeters} />
                </span>
              </span>
            ) : (
              <span className="text-cosmos-star/55">{t("common.abstract")}</span>
            )}
            {stop.distanceFromEarthMeters !== undefined &&
              stop.distanceFromEarthMeters > 0 && (
                <span className="inline-flex items-baseline gap-2">
                  <span className="text-cosmos-star/55">
                    {t("common.distanceShort")}
                  </span>
                  <span className="text-cosmos-star/85">
                    <CardLength meters={stop.distanceFromEarthMeters} />
                  </span>
                </span>
              )}
            {stop.temperatureKelvin !== undefined && (
              <span className="inline-flex items-baseline gap-2">
                <span className="text-cosmos-star/55">
                  {t("common.temperatureShort")}
                </span>
                <span className="text-cosmos-star/85">
                  {formatTemperature(stop.temperatureKelvin, t, tempUnit)}
                </span>
              </span>
            )}
          </span>
        </div>

        <h3
          className={clsx(
            "mt-3 font-display text-lg font-semibold tracking-tight sm:text-xl",
            stop.accent
          )}
        >
          {t(`${stop.i18nKey}.name`)}
        </h3>
        <p className="mt-1.5 text-sm leading-snug text-cosmos-star/75">
          {t(`${stop.i18nKey}.tagline`)}
        </p>
      </Link>

      <div className="relative mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <StopTags tags={stop.tags} size="sm" />
        <Link
          href={`/${locale}/category/${categorySlug(stop.category)}`}
          className="rounded-full px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-cosmos-star/55 transition-colors hover:bg-white/[0.06] hover:text-cosmos-star focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60"
        >
          {t(`categories.${stop.category}`)}
        </Link>
      </div>
      {/* Sibling of the link (not nested in it), over the image corner. */}
      <div className="absolute right-7 top-7 z-10">
        <BookmarkButton stopId={stop.id} size="sm" />
      </div>
    </article>
  );
}

/**
 * Length on a card. From a billion km up to the light-year range, light-time
 * ("≈ 5.8 light-days") is easier to picture than "150 billion km"; the exact
 * figure stays in the tooltip and on the stop page.
 */
function CardLength({ meters }: { meters: number }) {
  const { t } = useI18n();
  const { units } = useUnits();
  const exact = formatMeters(meters, t, units);
  const light = meters >= 1e12 ? formatLightTime(meters, t) : null;
  return light ? <span title={exact}>{light}</span> : <>{exact}</>;
}
