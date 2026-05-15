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
  "HUMAN_MIND",
  "ANCIENT_HISTORY",
  "COSMOS",
];

const SLUG_BY_CATEGORY: Record<Category, string> = {
  MICRO_WORLD: "micro-world",
  HUMAN_MIND: "human-mind",
  ANCIENT_HISTORY: "ancient-history",
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

export function getNeighbors(id: string): {
  prev: Stop | null;
  next: Stop | null;
} {
  const idx = STOPS.findIndex((s) => s.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? STOPS[idx - 1] : null,
    next: idx < STOPS.length - 1 ? STOPS[idx + 1] : null,
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
