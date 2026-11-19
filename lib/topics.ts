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
  /**
   * Tag this guide fully covers. Its page then lists every topic with the
   * tag, tag chips link here, and there is no separate /tag/ page.
   */
  tag?: string;
  /** Topic page this guide expands on (shown as a link from that page). */
  stopId?: string;
  sources: Source[];
  accent: string;
  /** Topic whose (licensed, credited) image is the guide's hero. */
  heroStopId: string;
  /** Rows of the "Key numbers" table, in order. */
  keyNumbers: KeyNumber[];
}

/**
 * A key-numbers row: either a value read from a topic's data (so it
 * matches the topic page and follows the unit switches), or a
 * hand-written pair `${i18nKey}.keyNumber{n}Label` / `…Value` for numbers
 * no topic carries (ages, rates, thresholds).
 */
export type KeyNumber =
  | { stopId: string; value: "size" | "distance" | "temperature" }
  | { text: number };

export const TOPICS: Topic[] = [
  {
    slug: "stars",
    tag: "star",
    i18nKey: "topics.stars",
    sectionCount: 5,
    relatedStopIds: ["sun", "proxima_centauri", "sirius", "betelgeuse", "uy_scuti", "neutron_star", "supermassive_black_hole"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Star" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Stellar_classification" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Main_sequence" },
      { label: "Britannica", url: "https://www.britannica.com/science/star-astronomy" },
    ],
    heroStopId: "sun",
    keyNumbers: [
      { stopId: "sun", value: "size" },
      { stopId: "sun", value: "temperature" },
      { stopId: "uy_scuti", value: "size" },
      { stopId: "neutron_star", value: "size" },
      { stopId: "proxima_centauri", value: "distance" },
    ],
    accent: "text-cosmos-nova",
  },
  {
    slug: "planets",
    i18nKey: "topics.planets",
    sectionCount: 4,
    relatedStopIds: ["earth", "mars", "olympus_mons", "jupiter", "great_red_spot", "asteroid_belt", "ceres", "solar_system"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Planet" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Exoplanet" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Habitable_zone" },
      { label: "Britannica", url: "https://www.britannica.com/science/planet" },
    ],
    heroStopId: "saturn",
    keyNumbers: [
      { stopId: "mercury", value: "size" },
      { stopId: "earth", value: "size" },
      { stopId: "jupiter", value: "size" },
      { stopId: "venus", value: "temperature" },
      { stopId: "neptune", value: "distance" },
    ],
    accent: "text-cosmos-aurora",
  },
  {
    slug: "black-holes",
    tag: "black-hole",
    i18nKey: "topics.blackHoles",
    sectionCount: 5,
    relatedStopIds: ["neutron_star", "supermassive_black_hole"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Black_hole" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hawking_radiation" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Sagittarius_A*" },
      { label: "Britannica", url: "https://www.britannica.com/science/black-hole" },
    ],
    heroStopId: "m87_black_hole",
    keyNumbers: [
      { stopId: "gaia_bh1", value: "distance" },
      { stopId: "gaia_bh1", value: "size" },
      { stopId: "supermassive_black_hole", value: "size" },
      { stopId: "m87_black_hole", value: "size" },
      { stopId: "ton_618", value: "size" },
    ],
    accent: "text-cosmos-ember",
  },
  {
    slug: "nebulae",
    tag: "nebula",
    i18nKey: "topics.nebulae",
    sectionCount: 4,
    relatedStopIds: ["orion_nebula", "crab_nebula", "sun", "neutron_star"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Nebula" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Planetary_nebula" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Supernova_remnant" },
      { label: "Britannica", url: "https://www.britannica.com/science/nebula" },
    ],
    heroStopId: "orion_nebula",
    keyNumbers: [
      { stopId: "orion_nebula", value: "size" },
      { stopId: "orion_nebula", value: "distance" },
      { stopId: "crab_nebula", value: "size" },
      { text: 1 },
      { text: 2 },
      { text: 3 },
      { text: 4 },
    ],
    accent: "text-cosmos-plasma",
  },
  {
    slug: "moons",
    tag: "satellite",
    i18nKey: "topics.moons",
    sectionCount: 4,
    relatedStopIds: ["moon", "titan", "europa", "earth", "jupiter", "solar_system"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Natural_satellite" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Ganymede_(moon)" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Moons_of_Jupiter" },
    ],
    heroStopId: "moon",
    keyNumbers: [
      { stopId: "moon", value: "size" },
      { stopId: "moon", value: "distance" },
      { stopId: "moon", value: "temperature" },
      { stopId: "titan", value: "size" },
      { stopId: "europa", value: "size" },
      { stopId: "jupiter", value: "size" },
    ],
    accent: "text-cosmos-star",
  },
  {
    slug: "big-bang",
    stopId: "big_bang",
    i18nKey: "topics.bigBang",
    sectionCount: 4,
    relatedStopIds: ["big_bang", "observable_universe", "dark_energy"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Big_Bang" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Cosmic_microwave_background" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Cosmic_inflation" },
      { label: "Britannica", url: "https://www.britannica.com/science/big-bang-model" },
    ],
    heroStopId: "big_bang",
    keyNumbers: [
      { text: 1 },
      { text: 2 },
      { text: 3 },
      { stopId: "observable_universe", value: "size" },
    ],
    accent: "text-cosmos-nova",
  },
  {
    slug: "supernova",
    i18nKey: "topics.supernova",
    sectionCount: 4,
    relatedStopIds: ["crab_nebula", "large_magellanic_cloud", "betelgeuse", "neutron_star", "supermassive_black_hole"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Supernova" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Type_Ia_supernova" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/SN_1054" },
      { label: "Britannica", url: "https://www.britannica.com/science/supernova" },
    ],
    heroStopId: "neutron_star",
    keyNumbers: [
      { text: 1 },
      { text: 2 },
      { text: 3 },
      { stopId: "neutron_star", value: "size" },
      { stopId: "neutron_star", value: "temperature" },
    ],
    accent: "text-cosmos-ember",
  },
  {
    slug: "time",
    stopId: "time_dilation",
    i18nKey: "topics.time",
    sectionCount: 4,
    relatedStopIds: ["supermassive_black_hole", "observable_universe"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Time_dilation" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Special_relativity" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/General_relativity" },
      { label: "Britannica", url: "https://www.britannica.com/science/relativity" },
    ],
    heroStopId: "time_dilation",
    keyNumbers: [
      { text: 1 },
      { text: 2 },
      { text: 3 },
      { text: 4 },
    ],
    accent: "text-cosmos-aurora",
  },
  {
    slug: "distances",
    i18nKey: "topics.distances",
    sectionCount: 4,
    relatedStopIds: ["light_year", "moon", "sun", "voyager1", "proxima_centauri", "sirius", "milky_way", "large_magellanic_cloud", "andromeda", "laniakea_supercluster", "observable_universe"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Cosmic_distance_ladder" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Proxima_Centauri" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hubble%27s_law" },
    ],
    heroStopId: "milky_way",
    keyNumbers: [
      { stopId: "moon", value: "distance" },
      { stopId: "sun", value: "distance" },
      { stopId: "voyager1", value: "distance" },
      { stopId: "proxima_centauri", value: "distance" },
      { stopId: "andromeda", value: "distance" },
      { stopId: "observable_universe", value: "distance" },
    ],
    accent: "text-cosmos-plasma",
  },
  {
    slug: "how-big-is-the-universe",
    i18nKey: "topics.howBigIsTheUniverse",
    sectionCount: 5,
    relatedStopIds: ["earth", "sun", "light_year", "milky_way", "andromeda", "laniakea_supercluster", "observable_universe", "dark_energy"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Observable_universe" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Shape_of_the_universe" },
      { label: "ESA", url: "https://www.esa.int/Science_Exploration/Space_Science/Planck" },
      { label: "NASA", url: "https://science.nasa.gov/universe/overview/" },
      { label: "Britannica", url: "https://www.britannica.com/science/universe" },
    ],
    heroStopId: "observable_universe",
    keyNumbers: [
      { stopId: "observable_universe", value: "size" },
      { stopId: "laniakea_supercluster", value: "size" },
      { stopId: "milky_way", value: "size" },
      { stopId: "andromeda", value: "distance" },
      { stopId: "light_year", value: "size" },
    ],
    accent: "text-cosmos-nova",
  },
  {
    slug: "planet-sizes-compared",
    tag: "planet",
    i18nKey: "topics.planetSizesCompared",
    sectionCount: 5,
    relatedStopIds: ["mercury", "venus", "earth", "moon", "mars", "jupiter", "great_red_spot", "saturn", "uranus", "neptune", "pluto", "ceres", "sun"],
    sources: [
      { label: "NASA", url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/" },
      { label: "NASA", url: "https://science.nasa.gov/solar-system/" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/List_of_Solar_System_objects_by_size" },
      { label: "Britannica", url: "https://www.britannica.com/science/planet" },
    ],
    heroStopId: "solar_system",
    keyNumbers: [
      { stopId: "sun", value: "size" },
      { stopId: "jupiter", value: "size" },
      { stopId: "earth", value: "size" },
      { stopId: "mercury", value: "size" },
      { stopId: "pluto", value: "size" },
    ],
    accent: "text-cosmos-aurora",
  },
  {
    slug: "smallest-things-in-the-universe",
    i18nKey: "topics.smallestThingsInTheUniverse",
    sectionCount: 5,
    relatedStopIds: ["quark", "proton", "atom", "water_molecule", "dna", "virus", "bacterium", "red_blood_cell", "cell", "pollen_grain", "human"],
    sources: [
      { label: "Physics Letters B (ZEUS, 2016)", url: "https://doi.org/10.1016/j.physletb.2016.04.007" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Planck_units" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Proton_radius_puzzle" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Elementary_particle" },
      { label: "Britannica", url: "https://www.britannica.com/science/atom" },
    ],
    heroStopId: "atom",
    keyNumbers: [
      { stopId: "planck_length", value: "size" },
      { stopId: "quark", value: "size" },
      { stopId: "proton", value: "size" },
      { stopId: "atom", value: "size" },
      { stopId: "virus", value: "size" },
    ],
    accent: "text-cosmos-plasma",
  },
  {
    slug: "largest-things-in-the-universe",
    i18nKey: "topics.largestThingsInTheUniverse",
    sectionCount: 6,
    relatedStopIds: ["uy_scuti", "betelgeuse", "ton_618", "phoenix_a", "supermassive_black_hole", "milky_way", "galaxy_cluster", "laniakea_supercluster", "observable_universe"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/List_of_largest_stars" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/List_of_most_massive_black_holes" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/List_of_largest_cosmic_structures" },
      { label: "Nature (Tully et al., 2014)", url: "https://doi.org/10.1038/nature13674" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hercules%E2%80%93Corona_Borealis_Great_Wall" },
    ],
    heroStopId: "laniakea_supercluster",
    keyNumbers: [
      { stopId: "uy_scuti", value: "size" },
      { stopId: "ton_618", value: "size" },
      { stopId: "milky_way", value: "size" },
      { stopId: "laniakea_supercluster", value: "size" },
      { stopId: "observable_universe", value: "size" },
    ],
    accent: "text-cosmos-ember",
  },
  {
    slug: "tallest-buildings-and-structures",
    i18nKey: "topics.tallestStructures",
    sectionCount: 4,
    relatedStopIds: ["statue_of_liberty", "pyramid", "eiffel_tower", "burj_khalifa", "general_sherman", "giraffe", "mount_everest"],
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/History_of_the_world%27s_tallest_buildings" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/List_of_tallest_buildings" },
      { label: "CTBUH — Height criteria", url: "https://www.ctbuh.org/resource/height" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hyperion_%28tree%29" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Jeddah_Tower" },
    ],
    heroStopId: "burj_khalifa",
    keyNumbers: [
      { stopId: "statue_of_liberty", value: "size" },
      { stopId: "pyramid", value: "size" },
      { text: 1 },
      { stopId: "eiffel_tower", value: "size" },
      { stopId: "burj_khalifa", value: "size" },
      { stopId: "mount_everest", value: "size" },
    ],
    accent: "text-badge-fact",
  },
  {
    slug: "human-body-by-size",
    i18nKey: "topics.humanBodyBySize",
    sectionCount: 4,
    relatedStopIds: ["human", "cell", "red_blood_cell", "bacterium", "virus", "dna", "water_molecule", "atom"],
    sources: [
      { label: "Sender, Fuchs & Milo (PLOS Biology, 2016)", url: "https://doi.org/10.1371/journal.pbio.1002533" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Human_body" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Cell_%28biology%29" },
    ],
    heroStopId: "red_blood_cell",
    keyNumbers: [
      { stopId: "human", value: "size" },
      { text: 1 },
      { text: 2 },
      { stopId: "red_blood_cell", value: "size" },
      { text: 3 },
      { stopId: "dna", value: "size" },
    ],
    accent: "text-cosmos-aurora",
  },
];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

/** Guide that fully covers a tag, if any. */
export function guideForTag(tag: string): Topic | undefined {
  return TOPICS.find((t) => t.tag === tag);
}

/** Guides that include a topic page (related list, its tag, or stopId). */
export function guidesForStop(stopId: string, tags: string[] = []): Topic[] {
  return TOPICS.filter(
    (t) =>
      t.stopId === stopId ||
      t.relatedStopIds.includes(stopId) ||
      (t.tag !== undefined && tags.includes(t.tag))
  );
}
