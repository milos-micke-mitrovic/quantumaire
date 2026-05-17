"use client";

import clsx from "clsx";
import type { MouseEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { useBookmarks } from "@/lib/bookmarks";

interface BookmarkButtonProps {
  stopId: string;
  /** Use a slightly larger button — for stop detail header rather than cards. */
  size?: "sm" | "md";
  className?: string;
}

export function BookmarkButton({
  stopId,
  size = "sm",
  className,
}: BookmarkButtonProps) {
  const { t } = useI18n();
  const { bookmarks, toggle } = useBookmarks();
  const active = bookmarks.has(stopId);

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    // When mounted inside a card-wide Link, don't navigate on bookmark toggle.
    e.preventDefault();
    e.stopPropagation();
    toggle(stopId);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={
        active ? t("common.bookmarkRemove") : t("common.bookmarkAdd")
      }
      className={clsx(
        "inline-flex items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60",
        size === "md" ? "h-10 w-10" : "h-8 w-8",
        active
          ? "border-cosmos-nova/60 bg-cosmos-nova/15 text-cosmos-nova"
          : "border-white/10 bg-white/[0.04] text-cosmos-star/65 hover:border-white/20 hover:text-cosmos-star",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"}
        aria-hidden
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
