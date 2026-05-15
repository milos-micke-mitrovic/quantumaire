export type TrustBadge =
  | "FACT"
  | "ESTABLISHED_THEORY"
  | "PROBABLE_THEORY"
  | "SPECULATIVE";

export type Category =
  | "COSMOS"
  | "MICRO_WORLD"
  | "HUMAN_MIND"
  | "ANCIENT_HISTORY";

export type Locale = "en" | "sr";

export interface GlossaryTerm {
  /** Translation key inside `glossary.*` */
  key: string;
}

export interface ImagePlaceholder {
  /** Path inside /public, e.g. /images/quark.webp */
  src: string;
  /** Aspect ratio used while waiting for the asset */
  aspect: "square" | "wide" | "portrait";
  /** Translation key for the alt text */
  altKey: string;
  /** Short Gemini-friendly prompt — surfaced in IMAGE_PROMPTS.md */
  geminiPrompt: string;
}

export interface Source {
  /** Publisher / site label, e.g. "Wikipedia", "Britannica", "NASA". */
  label: string;
  /** Canonical URL of the page that describes this stop. */
  url: string;
}

export interface Stop {
  id: string;
  /** Translation key prefix: stops.{id}.{name|tagline|body|*} */
  i18nKey: string;
  /** Size in meters. Conceptual stops (mind, dark energy) use null. */
  sizeMeters: number | null;
  /** Order of appearance in the journey (micro → macro). */
  order: number;
  badge: TrustBadge;
  category: Category;
  /** Tailwind accent class used for the stop's signature color (text-*). */
  accent: string;
  /** Tailwind accent class used for the stop's signature glow (shadow-*). */
  accentGlow: string;
  image: ImagePlaceholder;
  /** Glossary keys revealed in TruthSection tooltips. */
  glossary: string[];
  /** External references shown at the bottom of the stop page. */
  sources?: Source[];
  /**
   * Distance from Earth in metres. Optional — only used for macro/cosmic
   * stops where the distance is part of what makes the object interesting.
   */
  distanceFromEarthMeters?: number;
  /**
   * Override the dot label on the distance slider. Useful when the canonical
   * stop name ("Solar System") is less meaningful in a distance context than
   * a positional phrase ("Edge of the Solar System"). The dot still links to
   * the canonical stop page. Translation key, e.g. "stops.solar_system.distanceName".
   */
  distanceNameKey?: string;
  /**
   * Override the auto-picked reference for the "real scale" visual on the
   * stop detail page. `pickReference` chooses by nearest log-size, which is
   * sometimes wrong conceptually (e.g. UY Scuti is best compared to the
   * Sun, not Earth's orbit). Stops can pin a specific reference id here.
   */
  preferredReferenceId?: string;
}

export interface ScaleComparison {
  /** What "1 grain of sand" actually represents in meters in reality. */
  grainEqualsMeters: number;
  /** Diameter of a grain of sand in meters. */
  grainSizeMeters: number;
}
