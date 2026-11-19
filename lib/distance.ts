import { REFERENCES, type Reference } from "./references";
import type { Stop } from "./types";

/** Distance references that correspond to a real topic page. */
export const DISTANCE_REFERENCE_TO_STOP_ID: Record<string, string> = {
  moonDistance: "moon",
  au: "sun",
  proximaCentauri: "proxima_centauri",
  andromedaDistance: "andromeda",
};

export interface DistanceVisual {
  reference: Reference;
  ratio: number;
  stopFarther: boolean;
}

/** A reference must be at least this many times nearer to be worth naming. */
const MIN_RATIO = 1.5;

/**
 * The familiar distance a topic's distance from Earth is compared with:
 * the farthest reference that is still clearly nearer, so the line always
 * reads "129× farther than Proxima Centauri" — never "2.7× closer than"
 * (hard to picture) or "1.14× farther than the Sun" (says nothing).
 * Topics nearer than every reference (the ISS, the Moon) get no line.
 */
export function computeDistance(stop: Stop): DistanceVisual | null {
  const distance = stop.distanceFromEarthMeters;
  if (typeof distance !== "number" || distance <= 0) return null;
  let reference: Reference | null = null;
  for (const r of REFERENCES) {
    if (r.kind !== "distance" || r.meters * MIN_RATIO > distance) continue;
    if (!reference || r.meters > reference.meters) reference = r;
  }
  if (!reference) return null;
  return { reference, ratio: distance / reference.meters, stopFarther: true };
}
