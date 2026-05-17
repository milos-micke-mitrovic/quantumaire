"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { ImagePlaceholder as ImagePlaceholderType } from "@/lib/types";

interface Props {
  image: ImagePlaceholderType;
  /** Display priority (above-the-fold images). */
  priority?: boolean;
  className?: string;
  /** Override the source aspect — useful in grids that need uniform tiles. */
  aspect?: ImagePlaceholderType["aspect"];
}

const ASPECTS: Record<ImagePlaceholderType["aspect"], string> = {
  square: "aspect-square",
  wide: "aspect-[16/9]",
  portrait: "aspect-[3/4]",
};

/**
 * Renders the artwork if it exists in /public, otherwise shows a labelled
 * placeholder so we can ship the layout before the assets land.
 *
 * Falls back to placeholder when next/image errors (404 in /public).
 */
export function ImagePlaceholder({
  image,
  priority,
  className,
  aspect,
}: Props) {
  const { t } = useI18n();
  const [missing, setMissing] = useState(false);
  const alt = t(image.altKey);
  const aspectKey = aspect ?? image.aspect;

  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-cosmos-night/40 backdrop-blur-sm",
        ASPECTS[aspectKey],
        className
      )}
    >
      {!missing && (
        <Image
          src={image.src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IGZpbGw9IiMwYTA4MTUiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4="
          onError={() => setMissing(true)}
        />
      )}

      {missing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(124,92,255,0.18),transparent_70%)] p-6 text-center">
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-cosmos-deep/50 text-cosmos-plasma"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" />
            </svg>
          </span>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cosmos-star/70">
            {alt}
          </p>
          <p className="max-w-[28ch] text-[11px] leading-snug text-cosmos-star/45">
            {image.src}
          </p>
        </div>
      )}
    </div>
  );
}
