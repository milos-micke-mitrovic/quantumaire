import raw from "@/content/sources.json";
import type { Source } from "./types";

/**
 * External references per topic id (content/sources.json). Kept out of
 * content/stops.json so they don't ship in the client bundle with STOPS;
 * the stop page passes them to StopDetail as a prop.
 */
const SOURCES = raw as Record<string, Source[]>;

export function getSources(stopId: string): Source[] {
  return SOURCES[stopId] ?? [];
}
