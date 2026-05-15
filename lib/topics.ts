import type { Source } from "./types";

/**
 * General concept pages that contextualise the journey stops.
 *
 * Where a stop is "the Sun" or "a neutron star" — a specific object — a
 * topic is "stars" as a class, with intro / classification / lifecycle /
 * extremes content. Topics link out to the relevant stops in the journey.
 *
 * Each topic owns:
 *   - a stable slug used in the URL
 *   - an i18n prefix that owns `title`, `tagline`, `intro`, plus N
 *     `sectionXHeading` / `sectionXBody` pairs (X = 1..sectionCount)
 *   - a list of related stop IDs (rendered as cards)
 *   - a list of external sources (rendered the same way as stop sources)
 *   - a Tailwind accent class for the heading colour
 */
export interface Topic {
  slug: string;
  i18nKey: string;
  sectionCount: number;
  relatedStopIds: string[];
  sources: Source[];
  accent: string;
}

export const TOPICS: Topic[] = [
  {
    slug: "stars",
    i18nKey: "topics.stars",
    sectionCount: 5,
    relatedStopIds: ["sun", "proxima_centauri", "uy_scuti", "neutron_star", "supermassive_black_hole"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Star" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Stellar_classification" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Main_sequence" },
    ],
    accent: "text-cosmos-nova",
  },
  {
    slug: "planets",
    i18nKey: "topics.planets",
    sectionCount: 4,
    relatedStopIds: ["earth", "jupiter", "solar_system"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Planet" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Exoplanet" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Habitable_zone" },
    ],
    accent: "text-cosmos-aurora",
  },
  {
    slug: "black-holes",
    i18nKey: "topics.blackHoles",
    sectionCount: 5,
    relatedStopIds: ["neutron_star", "supermassive_black_hole"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Black_hole" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hawking_radiation" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Sagittarius_A*" },
    ],
    accent: "text-cosmos-ember",
  },
  {
    slug: "nebulae",
    i18nKey: "topics.nebulae",
    sectionCount: 4,
    relatedStopIds: ["sun", "neutron_star"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Nebula" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Planetary_nebula" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Supernova_remnant" },
    ],
    accent: "text-cosmos-plasma",
  },
  {
    slug: "moons",
    i18nKey: "topics.moons",
    sectionCount: 4,
    relatedStopIds: ["moon", "earth", "jupiter", "solar_system"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Natural_satellite" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Ganymede_(moon)" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Moons_of_Jupiter" },
    ],
    accent: "text-cosmos-star",
  },
  {
    slug: "big-bang",
    i18nKey: "topics.bigBang",
    sectionCount: 4,
    relatedStopIds: ["observable_universe", "dark_energy"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Big_Bang" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Cosmic_microwave_background" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Cosmic_inflation" },
    ],
    accent: "text-cosmos-nova",
  },
  {
    slug: "supernova",
    i18nKey: "topics.supernova",
    sectionCount: 4,
    relatedStopIds: ["neutron_star", "supermassive_black_hole"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Supernova" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Type_Ia_supernova" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/SN_1054" },
    ],
    accent: "text-cosmos-ember",
  },
  {
    slug: "time",
    i18nKey: "topics.time",
    sectionCount: 4,
    relatedStopIds: ["supermassive_black_hole", "observable_universe"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Time_dilation" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Special_relativity" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/General_relativity" },
    ],
    accent: "text-cosmos-aurora",
  },
  {
    slug: "distances",
    i18nKey: "topics.distances",
    sectionCount: 4,
    relatedStopIds: ["moon", "sun", "voyager1", "proxima_centauri", "milky_way", "andromeda", "laniakea_supercluster", "observable_universe"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Cosmic_distance_ladder" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Proxima_Centauri" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hubble%27s_law" },
    ],
    accent: "text-cosmos-plasma",
  },
];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}
