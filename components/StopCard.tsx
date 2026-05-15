"use client";

import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Stop } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { categorySlug } from "@/lib/content";
import { formatMeters } from "@/lib/scale";
import { useVisited } from "@/lib/visited";
import { Badge } from "./Badge";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface StopCardProps {
  stop: Stop;
  index: number;
}

export function StopCard({ stop, index }: StopCardProps) {
  const { t, locale } = useI18n();
  const { visited } = useVisited();
  const isVisited = visited.has(stop.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.3, ease: "easeOut", delay: (index % 6) * 0.02 }}
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10",
        "bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent",
        "p-5 transition-colors duration-200",
        "hover:border-white/20"
      )}
    >
      <Link
        href={`/${locale}/stop/${stop.id}`}
        aria-label={`${t("common.openStop")} — ${t(`${stop.i18nKey}.name`)}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60 rounded-2xl"
      >
        <div className="relative">
          <ImagePlaceholder
            image={stop.image}
            aspect="square"
            className="mb-4"
          />
          {isVisited && (
            <span
              aria-label={t("common.visited.marker")}
              title={t("common.visited.marker")}
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cosmos-deep/85 text-cosmos-nova shadow-glow backdrop-blur-sm"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5"
                aria-hidden
              >
                <path d="M20.285 6.708a1 1 0 0 0-1.414-1.414L9 15.165 5.129 11.293a1 1 0 1 0-1.414 1.414l4.578 4.578a1 1 0 0 0 1.414 0L20.285 6.708z" />
              </svg>
            </span>
          )}
        </div>

        <div className="flex items-start justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-cosmos-star/55">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="text-right">
            <span className="block">
              {stop.sizeMeters !== null
                ? formatMeters(stop.sizeMeters)
                : t("common.abstract")}
            </span>
            {stop.distanceFromEarthMeters !== undefined &&
              stop.distanceFromEarthMeters > 0 && (
                <span className="mt-0.5 block text-cosmos-star/40">
                  {t("common.awayFromEarth", {
                    value: formatMeters(stop.distanceFromEarthMeters),
                  })}
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

      <div className="relative mt-auto flex items-center justify-between pt-4">
        <Badge type={stop.badge} withTooltip={false} />
        <Link
          href={`/${locale}/category/${categorySlug(stop.category)}`}
          className="rounded-full px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-cosmos-star/55 transition-colors hover:bg-white/[0.06] hover:text-cosmos-star focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60"
        >
          {t(`categories.${stop.category}`)}
        </Link>
      </div>
    </motion.article>
  );
}
