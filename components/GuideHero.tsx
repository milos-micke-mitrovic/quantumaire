"use client";

import clsx from "clsx";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { imageAlt } from "@/lib/imageAlt";
import { localizeCredit } from "@/lib/text";
import type { Stop } from "@/lib/types";

interface GuideHeroProps {
  stop: Stop;
}

/**
 * Wide banner for a guide, borrowing a topic's licensed image. Square and
 * portrait pictures (planet discs, the M87* ring) are shown whole over a
 * blurred copy of themselves instead of being cropped to the banner.
 */
export function GuideHero({ stop }: GuideHeroProps) {
  const { t, locale } = useI18n();
  const { image } = stop;
  const wide = image.aspect === "wide";
  const alt = imageAlt(t, image.altKey);

  return (
    <figure className="mt-8">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-cosmos-night/40 sm:aspect-[2/1]">
        {!wide && (
          <Image
            src={image.src}
            alt=""
            aria-hidden
            fill
            // Same URL as the preloaded image below, so eager costs nothing
            // extra — and this larger blurred copy is the page's LCP element.
            loading="eager"
            sizes="(min-width: 768px) 704px, calc(100vw - 2.5rem)"
            className="scale-110 object-cover opacity-50 blur-2xl"
          />
        )}
        <Image
          src={image.src}
          alt={alt}
          fill
          preload
          fetchPriority="high"
          sizes="(min-width: 768px) 704px, calc(100vw - 2.5rem)"
          className={clsx(wide ? "object-cover" : "object-contain")}
        />
      </div>
      {image.credit && (
        <figcaption className="mt-2 text-right text-[11px] leading-snug text-cosmos-star/55">
          {t("topicView.heroCredit", { credit: localizeCredit(image.credit, locale) })}
        </figcaption>
      )}
    </figure>
  );
}
