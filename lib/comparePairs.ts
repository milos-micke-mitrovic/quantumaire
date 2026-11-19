import { getStop } from "./content";
import type { Stop } from "./types";

/**
 * Curated, indexable comparisons: /[locale]/compare/<first>-vs-<second>.
 * Written the way people search ("jupiter vs earth"): the bigger or more
 * famous object first. Everything else stays on the interactive /compare.
 */
export const COMPARE_PAIRS: Array<[string, string]> = [
  ["jupiter", "earth"],
  ["sun", "earth"],
  ["earth", "moon"],
  ["uy_scuti", "sun"],
  ["milky_way", "andromeda"],
  ["earth", "mars"],
  ["venus", "earth"],
  ["jupiter", "saturn"],
  ["sun", "jupiter"],
  ["uranus", "neptune"],
  ["moon", "pluto"],
  ["earth", "pluto"],
  ["sun", "proxima_centauri"],
  ["supermassive_black_hole", "sun"],
  ["ton_618", "solar_system"],
  ["blue_whale", "human"],
  ["human", "tardigrade"],
  ["mount_everest", "human"],
  ["burj_khalifa", "eiffel_tower"],
  ["eiffel_tower", "pyramid"],
  ["general_sherman", "blue_whale"],
  ["bacterium", "virus"],
  ["atom", "proton"],
];

export const idToSlug = (id: string) => id.replace(/_/g, "-");

export function pairSlug([a, b]: [string, string]): string {
  return `${idToSlug(a)}-vs-${idToSlug(b)}`;
}

export function getPair(slug: string): [Stop, Stop] | null {
  const pair = COMPARE_PAIRS.find((p) => pairSlug(p) === slug);
  if (!pair) return null;
  const a = getStop(pair[0]);
  const b = getStop(pair[1]);
  return a && b ? [a, b] : null;
}
