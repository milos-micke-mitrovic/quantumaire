/**
 * Geometry for the log-scale explorer track.
 *
 * Values are placed on a log₁₀ axis, but any empty stretch wider than
 * `maxGapDecades` between two neighbouring values is squeezed down to that
 * width (and reported as a "gap" so the UI can draw a break marker), so a
 * lone outlier like the Planck length doesn't leave a third of the track
 * empty.
 */

export interface AxisGap {
  /** Track positions (0–1) of the two values either side of the break. */
  from: number;
  to: number;
  /** Real number of decades the break stands for. */
  decades: number;
}

export interface Axis {
  /** Track position (0–1) for each input value, same order. */
  positions: number[];
  gaps: AxisGap[];
  /** Position for an arbitrary value, or null if it falls outside the
   *  plotted range or inside a compressed gap (where it would mislead). */
  map: (value: number) => number | null;
}

export function buildAxis(
  values: number[],
  {
    maxGapDecades = 3,
    start = 0.02,
    end = 0.98,
  }: { maxGapDecades?: number; start?: number; end?: number } = {}
): Axis {
  const logs = values.map((v) => Math.log10(v));
  const compressed: number[] = [];
  const isGap: boolean[] = [];
  let acc = 0;
  logs.forEach((l, i) => {
    if (i === 0) {
      compressed.push(0);
      isGap.push(false);
      return;
    }
    const d = l - logs[i - 1];
    const gap = d > maxGapDecades;
    acc += gap ? maxGapDecades : Math.max(0, d);
    compressed.push(acc);
    isGap.push(gap);
  });
  const total = acc;
  const toPos = (c: number) =>
    total === 0 ? (start + end) / 2 : start + ((end - start) * c) / total;
  const positions = compressed.map(toPos);

  const gaps: AxisGap[] = [];
  for (let i = 1; i < logs.length; i++) {
    if (isGap[i]) {
      gaps.push({
        from: positions[i - 1],
        to: positions[i],
        decades: logs[i] - logs[i - 1],
      });
    }
  }

  const map = (value: number): number | null => {
    if (!(value > 0) || logs.length === 0) return null;
    const l = Math.log10(value);
    if (l < logs[0] || l > logs[logs.length - 1]) return null;
    for (let i = 1; i < logs.length; i++) {
      if (l <= logs[i]) {
        if (isGap[i]) return null;
        const span = logs[i] - logs[i - 1];
        const f = span === 0 ? 0 : (l - logs[i - 1]) / span;
        return toPos(compressed[i - 1] + f * (compressed[i] - compressed[i - 1]));
      }
    }
    return positions[positions.length - 1];
  };

  return { positions, gaps, map };
}

/**
 * Spread dots that would overlap into up to `maxLanes` rows. Greedy, left to
 * right: each dot takes the first lane whose previous dot is at least
 * `minGap` away, else the lane with the most room.
 */
export function assignLanes(
  positions: number[],
  minGap = 0.018,
  maxLanes = 3
): number[] {
  const last = Array<number>(maxLanes).fill(-Infinity);
  return positions.map((p) => {
    let lane = last.findIndex((l) => p - l >= minGap);
    if (lane === -1) lane = last.indexOf(Math.min(...last));
    last[lane] = p;
    return lane;
  });
}

/** Drop ticks whose labels would collide with the previous visible one. */
export function thinTicks<T extends { pos: number }>(
  ticks: T[],
  minGap = 0.07
): T[] {
  const out: T[] = [];
  for (const tick of ticks) {
    if (out.length === 0 || tick.pos - out[out.length - 1].pos >= minGap) {
      out.push(tick);
    }
  }
  return out;
}

const SUPERSCRIPT: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻",
};

/** 20 → "×10²⁰" — label for a compressed gap. */
export function gapLabel(decades: number): string {
  const exp = String(Math.round(decades));
  return `×10${[...exp].map((c) => SUPERSCRIPT[c] ?? c).join("")}`;
}
