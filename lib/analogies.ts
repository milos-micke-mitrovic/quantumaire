/**
 * Everyday-scale analogies: "if an atom were a marble, a human would be
 * about as long as the Earth–Moon distance". Computed, not hand-written, so
 * every pairing is numerically honest: we scale stop A to a familiar object,
 * apply the same factor to stop B, and only keep the pairing if B lands
 * close to another familiar object.
 */
import type { Stop } from "./types";

export interface Familiar {
  /** i18n key suffix: analogy.items.<id> */
  id: string;
  meters: number;
  /** Lower = more intuitive; used to rank candidate pairings. */
  rank: number;
}

/** Things people can picture by size. */
export const FAMILIAR_SIZES: Familiar[] = [
  { id: "hair", meters: 8e-5, rank: 2 },
  { id: "sand", meters: 5e-4, rank: 1 },
  { id: "ant", meters: 4e-3, rank: 1 },
  { id: "marble", meters: 0.015, rank: 0 },
  { id: "golfBall", meters: 0.043, rank: 1 },
  { id: "football", meters: 0.22, rank: 0 },
  { id: "car", meters: 4.5, rank: 0 },
  { id: "bus", meters: 12, rank: 1 },
  { id: "pitch", meters: 105, rank: 0 },
  { id: "eiffel", meters: 330, rank: 0 },
  { id: "burj", meters: 828, rank: 1 },
  { id: "manhattan", meters: 21_600, rank: 1 },
  { id: "london", meters: 50_000, rank: 1 },
  { id: "france", meters: 1_000_000, rank: 1 },
  { id: "usa", meters: 4_500_000, rank: 1 },
  { id: "earth", meters: 12_742_000, rank: 0 },
  { id: "earthMoon", meters: 384_400_000, rank: 1 },
  { id: "sun", meters: 1_392_700_000, rank: 1 },
  { id: "earthSun", meters: 1.496e11, rank: 1 },
];

/** Distances people can picture. */
export const FAMILIAR_DISTANCES: Familiar[] = [
  { id: "step", meters: 0.75, rank: 0 },
  { id: "room", meters: 5, rank: 1 },
  { id: "pitch", meters: 105, rank: 0 },
  { id: "walk", meters: 800, rank: 0 },
  { id: "marathon", meters: 42_195, rank: 0 },
  { id: "londonParis", meters: 344_000, rank: 1 },
  { id: "nyLa", meters: 3_940_000, rank: 1 },
  { id: "aroundEarth", meters: 40_075_000, rank: 1 },
  { id: "earthMoon", meters: 384_400_000, rank: 1 },
];

/** Reference distances a stop's distance is scaled against. */
export const DISTANCE_REFS: Array<{ id: string; meters: number }> = [
  { id: "earthMoon", meters: 384_400_000 },
  { id: "earthSun", meters: 1.496e11 },
  { id: "lightYear", meters: 9.4607304725808e15 },
  { id: "proxima", meters: 4.0175e16 },
];

export interface Analogy {
  kind: "size" | "distance";
  /** Left side of row 1: a stop id (size) or a DISTANCE_REFS id. */
  fromId: string;
  fromIsStop: boolean;
  fromObject: Familiar;
  /** Left side of row 2: a stop id. */
  toId: string;
  toObject: Familiar;
  /** Scale factor applied to everything (>1 enlarges, <1 shrinks). */
  factor: number;
  /** How far the exact result is from toObject (1 = exact). */
  closeness: number;
}

const MAX_MISS = Math.log10(1.5); // accept within ×1.5

/** Starting objects must be something you can hold or see, up to a planet. */
const START_IDS = new Set([
  "hair", "sand", "ant", "marble", "golfBall", "football", "car", "bus",
  "pitch", "eiffel", "burj", "earth",
]);

function bestMatch(target: number, pool: Familiar[], exclude: Set<string>) {
  let best: { f: Familiar; miss: number } | null = null;
  for (const f of pool) {
    if (exclude.has(f.id)) continue;
    const miss = Math.abs(Math.log10(target / f.meters));
    if (miss <= MAX_MISS && (!best || miss + f.rank * 0.05 < best.miss + best.f.rank * 0.05)) {
      best = { f, miss };
    }
  }
  return best;
}

/**
 * Topics people already have a feel for. The second row of an analogy
 * ("…and then X would be the size of Y") only helps if X is one of these —
 * "Pluto ≈ the Eiffel Tower" teaches nothing, since nobody pictures Pluto.
 */
export const FAMILIAR_STOP_IDS = new Set([
  "atom",
  "dna",
  "virus",
  "bacterium",
  "cell",
  "red_blood_cell",
  "human",
  "blue_whale",
  "pyramid",
  "statue_of_liberty",
  "eiffel_tower",
  "burj_khalifa",
  "mount_everest",
  "moon",
  "earth",
  "jupiter",
  "sun",
  "solar_system",
  "milky_way",
  "observable_universe",
]);

/** Familiar items that are themselves this stop (avoid "Earth = Earth"). */
const SAME_AS_STOP: Record<string, string> = {
  earth: "earth",
  sun: "sun",
  eiffel_tower: "eiffel",
  burj_khalifa: "burj",
};

function sizeAnalogy(
  stop: Stop & { sizeMeters: number },
  others: Array<Stop & { sizeMeters: number }>,
  direction: "up" | "down"
): Analogy | null {
  let best: (Analogy & { score: number }) | null = null;
  for (const other of others) {
    if (other.id === stop.id || !FAMILIAR_STOP_IDS.has(other.id)) continue;
    const ratio = other.sizeMeters / stop.sizeMeters;
    if (direction === "up" ? ratio < 50 : ratio > 1 / 50) continue;
    if (direction === "up" ? ratio > 1e9 : ratio < 1e-9) continue;
    for (const a of FAMILIAR_SIZES) {
      if (!START_IDS.has(a.id) || SAME_AS_STOP[stop.id] === a.id) continue;
      const factor = a.meters / stop.sizeMeters;
      const exclude = new Set([a.id]);
      if (SAME_AS_STOP[other.id]) exclude.add(SAME_AS_STOP[other.id]);
      const m = bestMatch(other.sizeMeters * factor, FAMILIAR_SIZES, exclude);
      if (!m) continue;
      // Prefer intuitive objects, a near-exact match, and a mid-sized jump
      // (around ×10⁴) that is dramatic but still easy to picture.
      const jump = Math.abs(Math.log10(Math.abs(ratio)) - (direction === "up" ? 4 : -4));
      const score = a.rank + m.f.rank + m.miss * 4 + jump * 0.15;
      if (!best || score < best.score) {
        best = {
          kind: "size",
          fromId: stop.id,
          fromIsStop: true,
          fromObject: a,
          toId: other.id,
          toObject: m.f,
          factor,
          closeness: (other.sizeMeters * factor) / m.f.meters,
          score,
        };
      }
    }
  }
  if (!best) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { score, ...rest } = best;
  return rest;
}

function distanceAnalogy(stop: Stop): Analogy | null {
  const d = stop.distanceFromEarthMeters;
  if (typeof d !== "number" || d <= 0) return null;
  let best: (Analogy & { score: number }) | null = null;
  for (const ref of DISTANCE_REFS) {
    const ratio = d / ref.meters;
    if (ratio < 3 || ratio > 1e6) continue;
    for (const a of FAMILIAR_DISTANCES) {
      const factor = a.meters / ref.meters;
      const m = bestMatch(d * factor, FAMILIAR_DISTANCES, new Set([a.id]));
      if (!m) continue;
      const score = a.rank + m.f.rank + m.miss * 4;
      if (!best || score < best.score) {
        best = {
          kind: "distance",
          fromId: ref.id,
          fromIsStop: false,
          fromObject: a,
          toId: stop.id,
          toObject: m.f,
          factor,
          closeness: (d * factor) / m.f.meters,
          score,
        };
      }
    }
  }
  if (!best) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { score, ...rest } = best;
  return rest;
}

/** Up to three analogies for a stop: bigger, smaller, and distance. */
export function buildAnalogies(stop: Stop, all: Stop[]): Analogy[] {
  const sized = all.filter(
    (s): s is Stop & { sizeMeters: number } =>
      s.sizeMeters !== null && s.sizeMeters > 0
  );
  const out: Analogy[] = [];
  if (stop.sizeMeters !== null && stop.sizeMeters > 0) {
    const self = stop as Stop & { sizeMeters: number };
    const up = sizeAnalogy(self, sized, "up");
    const down = sizeAnalogy(self, sized, "down");
    if (up) out.push(up);
    if (down) out.push(down);
  }
  const dist = distanceAnalogy(stop);
  if (dist) out.push(dist);
  return out;
}
