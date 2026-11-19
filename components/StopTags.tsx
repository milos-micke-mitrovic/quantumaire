"use client";

import clsx from "clsx";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { tagHref } from "@/lib/tags";

interface StopTagsProps {
  tags?: string[];
  /** Optional className tweaks. */
  className?: string;
  /** Visual size. `sm` for cards, `md` for the stop detail header. */
  size?: "sm" | "md";
}

/**
 * Small horizontal row of object-type tags ("Planet", "Star", "Black hole",
 * "Galaxy", …). Different from the FACT/THEORY/SPECULATIVE trust badge —
 * these tell you *what kind* of object the stop is, at a glance, without
 * having to read the body.
 *
 * Renders nothing if the stop has no tags.
 */
export function StopTags({ tags, className, size = "sm" }: StopTagsProps) {
  const { t, locale } = useI18n();
  if (!tags || tags.length === 0) return null;
  return (
    <span
      className={clsx(
        "inline-flex flex-wrap items-center gap-1.5",
        className
      )}
    >
      {tags.map((id) => {
        const cls = clsx(
          "inline-flex items-center rounded-full border border-cosmos-aurora/30 bg-cosmos-aurora/10 font-medium text-cosmos-plasma",
          size === "sm"
            ? "px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]"
            : "px-2.5 py-1 text-[11px] uppercase tracking-[0.18em]"
        );
        // Tags with their own collection page link to it.
        const href = tagHref(id, locale);
        return href ? (
          <Link
            key={id}
            href={href}
            className={clsx(
              cls,
              "transition-colors hover:border-cosmos-plasma/60 hover:bg-cosmos-aurora/20 hover:text-cosmos-plasma focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60"
            )}
          >
            {t(`tags.${id}`)}
          </Link>
        ) : (
          <span key={id} className={cls}>
            {t(`tags.${id}`)}
          </span>
        );
      })}
    </span>
  );
}
