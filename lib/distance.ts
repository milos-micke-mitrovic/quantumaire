import { pickReference, type Reference } from "./references";
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

/** The familiar distance a topic's distance from Earth is compared with. */
export function computeDistance(stop: Stop): DistanceVisual | null {
  if (
    typeof stop.distanceFromEarthMeters !== "number" ||
    stop.distanceFromEarthMeters <= 0
  ) {
    return null;
  }
  const distance = stop.distanceFromEarthMeters;
  const reference = pickReference(distance, "distance", {
    excludeNearSelf: true,
  });
  if (!reference) return null;
  if (Math.abs(Math.log10(distance) - Math.log10(reference.meters)) < 0.05) {
    return null;
  }
  const stopFarther = distance > reference.meters;
  const ratio = stopFarther
    ? distance / reference.meters
    : reference.meters / distance;
  return { reference, ratio, stopFarther };
}
