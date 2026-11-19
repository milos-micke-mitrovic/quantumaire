"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

/** Section ids in page order; only the ones present on the page show. */
const SECTION_IDS = [
  "numbers",
  "story",
  "facts",
  "everyday",
  "spacecraft",
  "qa",
  "sources",
  "journey-map",
  "related",
] as const;

/**
 * Sticky "on this page" chips for the stop page. Highlights the section in
 * view, scrolls the active chip into view on narrow screens, and writes the
 * section to the URL hash so prev/next stop links can keep it (someone
 * reading only "At everyday scale" can hop stop to stop and land there).
 */
export function StopSectionNav() {
  const { t } = useI18n();
  const [present, setPresent] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = SECTION_IDS.filter((id) => document.getElementById(id));
    // Defer: sections are only known after the page has rendered.
    const raf = requestAnimationFrame(() => setPresent(ids));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band just under the sticky bars counts as "being read".
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  // Keep the active chip visible in the horizontally scrolling bar.
  useEffect(() => {
    if (!active) return;
    const bar = barRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (!bar || !chip) return;
    const left = chip.offsetLeft - bar.clientWidth / 2 + chip.offsetWidth / 2;
    bar.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  if (present.length < 3) return null;

  return (
    <nav
      aria-label={t("common.sections.label")}
      className="sticky top-[57px] z-30 -mx-5 mt-6 border-y border-white/5 bg-cosmos-void/85 backdrop-blur-md sm:mx-0 sm:rounded-full sm:border print:hidden"
    >
      <div
        ref={barRef}
        className="flex gap-1 overflow-x-auto px-3 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {present.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            data-chip={id}
            aria-current={active === id ? "location" : undefined}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
              history.replaceState(null, "", `#${id}`);
              setActive(id);
            }}
            className={clsx(
              "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors",
              active === id
                ? "bg-white/[0.1] text-cosmos-star"
                : "text-cosmos-star/60 hover:text-cosmos-star"
            )}
          >
            {t(`common.sections.${id}`)}
          </a>
        ))}
      </div>
    </nav>
  );
}
