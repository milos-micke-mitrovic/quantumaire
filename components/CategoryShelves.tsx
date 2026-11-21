"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, categorySlug, getStopsByCategory } from "@/lib/content";
import type { Category, Stop } from "@/lib/types";
import { CATEGORY_DOT } from "./ScaleExplorer";
import { StopCard } from "./StopCard";

/** Categories with fewer stops than this share one "more" shelf. */
const MIN_SHELF = 3;

/**
 * Shelf order: the site's core first (cosmos, the micro-world, the physics
 * that links them), then ancient and human stories, then Earth and life.
 */
const SHELF_ORDER: Category[] = [
  "COSMOS",
  "MICRO_WORLD",
  "PHYSICS",
  "HUMANKIND",
  "EARTH",
];

/** Life & Earth opens with the planet (Everest, the Mariana Trench, …);
 *  animals, kept as size yardsticks, come after. */
function shelfStops(c: Category): Stop[] {
  const stops = getStopsByCategory(c);
  if (c !== "EARTH") return stops;
  const isAnimal = (s: Stop) => s.tags?.includes("animal") ?? false;
  return [...stops.filter((s) => !isAnimal(s)), ...stops.filter(isAnimal)];
}

interface Shelf {
  key: string;
  title: string;
  description: string;
  href?: string;
  categories: Category[];
  stops: Stop[];
}

/**
 * Home-page catalogue: one horizontally scrollable row per category
 * instead of a single 50-card wall. Every stop is still linked from the
 * page; the rows just give it structure and keep the page short.
 */
export function CategoryShelves() {
  const { t, locale } = useI18n();

  const shelves = useMemo<Shelf[]>(() => {
    const ordered = SHELF_ORDER.filter((c) => CATEGORIES.includes(c));
    const big = ordered.filter(
      (c) => getStopsByCategory(c).length >= MIN_SHELF,
    );
    const small = ordered.filter(
      (c) => getStopsByCategory(c).length < MIN_SHELF,
    );
    const out: Shelf[] = big.map((c) => ({
      key: c,
      title: t(`categories.${c}`),
      description: t(`categories.${c}.description`),
      href: `/${locale}/category/${categorySlug(c)}`,
      categories: [c],
      stops: shelfStops(c),
    }));
    if (small.length > 0) {
      out.push({
        key: "more",
        title: t("common.shelves.moreTitle"),
        description: small.map((c) => t(`categories.${c}`)).join(" · "),
        categories: small,
        stops: small.flatMap((c) => getStopsByCategory(c)),
      });
    }
    return out;
  }, [t, locale]);

  return (
    <div className="space-y-12">
      {shelves.map((shelf) => (
        <section key={shelf.key} aria-labelledby={`shelf-${shelf.key}`}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div className="min-w-0 max-w-2xl">
              <h3
                id={`shelf-${shelf.key}`}
                className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl"
              >
                <span className="flex gap-1" aria-hidden>
                  {shelf.categories.map((c) => (
                    <span
                      key={c}
                      className={clsx(
                        "h-2.5 w-2.5 rounded-full",
                        CATEGORY_DOT[c],
                      )}
                    />
                  ))}
                </span>
                {shelf.href ? (
                  <Link
                    href={shelf.href}
                    className="transition-colors hover:text-cosmos-plasma"
                  >
                    {shelf.title}
                  </Link>
                ) : (
                  shelf.title
                )}
                <span className="font-mono text-sm font-normal text-cosmos-star/55">
                  {shelf.stops.length}
                </span>
              </h3>
              <p className="mt-1 text-sm text-cosmos-star/65">
                {shelf.href
                  ? shelf.description
                  : shelf.categories.map((c, i) => (
                      <span key={c}>
                        {i > 0 && " · "}
                        <Link
                          href={`/${locale}/category/${categorySlug(c)}`}
                          className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-cosmos-star"
                        >
                          {t(`categories.${c}`)}
                        </Link>
                      </span>
                    ))}
              </p>
            </div>
            {shelf.href && (
              <Link
                href={shelf.href}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cosmos-aurora/50 bg-cosmos-aurora/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-cosmos-plasma transition-colors hover:border-cosmos-plasma hover:bg-cosmos-aurora/20 hover:text-cosmos-nova"
              >
                {t("common.shelves.seeAll", { count: shelf.stops.length })}{" "}
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>

          <ShelfRow stops={shelf.stops} />
        </section>
      ))}
    </div>
  );
}

function ShelfRow({ stops }: { stops: Stop[] }) {
  const { t } = useI18n();
  const ref = useRef<HTMLUListElement>(null);
  // Arrows only make sense when the row overflows, and only in the
  // direction there is something left to see.
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        left: el.scrollLeft > 4,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);
  const scroll = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  const arrow =
    "absolute top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-cosmos-deep/90 text-cosmos-star shadow-glow backdrop-blur transition-colors hover:bg-cosmos-nebula sm:flex";
  return (
    <div className="relative">
      {edges.left && (
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={t("common.prev")}
          className={clsx(arrow, "left-2")}
        >
          <span aria-hidden>←</span>
        </button>
      )}
      <ul
        ref={ref}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:thin] sm:mx-0 sm:scroll-px-0 sm:px-0"
      >
        {stops.map((stop, i) => (
          <li
            key={stop.id}
            className="w-[78%] max-w-[300px] shrink-0 snap-start sm:w-[300px]"
          >
            <StopCard stop={stop} index={i} sizes="(min-width: 640px) 260px, 70vw" deferImage />
          </li>
        ))}
      </ul>
      {edges.right && (
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={t("common.next")}
          className={clsx(arrow, "right-2")}
        >
          <span aria-hidden>→</span>
        </button>
      )}
    </div>
  );
}
