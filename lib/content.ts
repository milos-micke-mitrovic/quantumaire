import raw from "@/content/stops.json";
import type { Category, ScaleComparison, Stop } from "./types";

interface ContentFile {
  comparison: ScaleComparison;
  stops: Stop[];
}

const content = raw as ContentFile;

export const STOPS: Stop[] = [...content.stops].sort(
  (a, b) => a.order - b.order
);

export const COMPARISON: ScaleComparison = content.comparison;

export const CATEGORIES: Category[] = [
  "MICRO_WORLD",
  "EARTH",
  "HUMAN_MIND",
  "ANCIENT_HISTORY",
  "PHYSICS",
  "COSMOS",
];

const SLUG_BY_CATEGORY: Record<Category, string> = {
  MICRO_WORLD: "micro-world",
  HUMAN_MIND: "human-mind",
  ANCIENT_HISTORY: "ancient-history",
  EARTH: "life-and-earth",
  PHYSICS: "forces-and-spacetime",
  COSMOS: "cosmos",
};

const CATEGORY_BY_SLUG: Record<string, Category> = Object.fromEntries(
  (Object.entries(SLUG_BY_CATEGORY) as Array<[Category, string]>).map(
    ([cat, slug]) => [slug, cat]
  )
);

export function categorySlug(category: Category): string {
  return SLUG_BY_CATEGORY[category];
}

export function categoryFromSlug(slug: string): Category | undefined {
  return CATEGORY_BY_SLUG[slug];
}

export function getStopsByCategory(category: Category): Stop[] {
  return STOPS.filter((s) => s.category === category);
}

export function getStop(id: string): Stop | undefined {
  return STOPS.find((s) => s.id === id);
}

/**
 * Reading order for previous/next: every topic with a size, smallest to
 * largest, then the size-less ideas grouped by category. (The `order`
 * field slots ideas between objects, which made "next" jump from Atom to
 * Quantum entanglement to DNA.)
 */
export type SizedStop = Stop & { sizeMeters: number };

/** Topics with a physical size, smallest first (shared by every scale tool). */
export const SIZED_STOPS: SizedStop[] = STOPS.filter(
  (s): s is SizedStop => s.sizeMeters !== null && s.sizeMeters > 0
).sort((a, b) => a.sizeMeters - b.sizeMeters);

export const NAV_ORDER: Stop[] = (() => {
  const sized = SIZED_STOPS;
  const rank = (c: Category) => CATEGORIES.indexOf(c);
  const ideas = STOPS.filter((s) => !(s.sizeMeters !== null && s.sizeMeters > 0))
    .slice()
    .sort((a, b) => rank(a.category) - rank(b.category) || a.order - b.order);
  return [...sized, ...ideas];
})();

export function getNeighbors(id: string): {
  prev: Stop | null;
  next: Stop | null;
} {
  const idx = NAV_ORDER.findIndex((s) => s.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? NAV_ORDER[idx - 1] : null,
    next: idx < NAV_ORDER.length - 1 ? NAV_ORDER[idx + 1] : null,
  };
}

export function getRelatedStops(stop: Stop, limit = 3): Stop[] {
  const sameCat = STOPS.filter(
    (s) => s.category === stop.category && s.id !== stop.id
  );
  const others = STOPS.filter(
    (s) => s.category !== stop.category && s.id !== stop.id
  );
  // Prefer same-category. Within same-category, sort by proximity in scale.
  const stopExp =
    stop.sizeMeters !== null && stop.sizeMeters > 0
      ? Math.log10(stop.sizeMeters)
      : 0;
  const byProximity = sameCat.sort((a, b) => {
    const ax =
      a.sizeMeters !== null && a.sizeMeters > 0
        ? Math.abs(Math.log10(a.sizeMeters) - stopExp)
        : Infinity;
    const bx =
      b.sizeMeters !== null && b.sizeMeters > 0
        ? Math.abs(Math.log10(b.sizeMeters) - stopExp)
        : Infinity;
    return ax - bx;
  });

  // Fill from neighbours-in-order if same-category isn't enough.
  const neighbourFill = others.sort(
    (a, b) => Math.abs(a.order - stop.order) - Math.abs(b.order - stop.order)
  );
  return [...byProximity, ...neighbourFill].slice(0, limit);
}
