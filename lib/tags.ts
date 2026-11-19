import { STOPS } from "./content";
import type { Stop } from "./types";

/**
 * Tags that get their own page (/[locale]/tag/[tag]). Only tags shared by
 * at least two topics — a one-item list would be a thin page — and not
 * "cosmos", which duplicates the Cosmos category.
 */
export const TAG_PAGES: string[] = (() => {
  const counts = new Map<string, number>();
  for (const s of STOPS) for (const t of s.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([tag, n]) => n >= 2 && tag !== "cosmos")
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
})();

export function hasTagPage(tag: string): boolean {
  return TAG_PAGES.includes(tag);
}

/** Topics with a tag: sized ones smallest → largest, then the rest. */
export function getStopsByTag(tag: string): Stop[] {
  const tagged = STOPS.filter((s) => (s.tags ?? []).includes(tag));
  const sized = tagged
    .filter((s) => s.sizeMeters !== null && s.sizeMeters > 0)
    .sort((a, b) => (a.sizeMeters as number) - (b.sizeMeters as number));
  const rest = tagged.filter((s) => !(s.sizeMeters !== null && s.sizeMeters > 0));
  return [...sized, ...rest];
}
