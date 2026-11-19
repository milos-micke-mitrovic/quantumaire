/**
 * How fast our fastest and farthest spacecraft move, and how long each would
 * need to cover a single light-year at that speed.
 *
 * Speeds are heliocentric (relative to the Sun) for deep-space probes, the
 * peak perihelion speed for Parker Solar Probe, and orbital speed for the
 * ISS. Sources: NASA/JPL mission pages, Wikipedia.
 */

export const LIGHT_YEAR_KM = 9.4607304725808e12;
const SECONDS_PER_YEAR = 365.25 * 86400;
export const SPEED_OF_LIGHT_KM_S = 299_792.458;

export interface Spacecraft {
  /** i18n key suffix: spacecraft.craft.<id>.{name,status} */
  id: string;
  launchYear: number | null;
  speedKmS: number;
  /** Journey stop to link to, when the craft has its own page. */
  stopId?: string;
}

export const SPACECRAFT: Spacecraft[] = [
  { id: "parker", launchYear: 2018, speedKmS: 191.2 },
  { id: "voyager1", launchYear: 1977, speedKmS: 17.0, stopId: "voyager1" },
  { id: "voyager2", launchYear: 1977, speedKmS: 15.4 },
  { id: "newHorizons", launchYear: 2006, speedKmS: 13.7 },
  { id: "pioneer10", launchYear: 1972, speedKmS: 12.0 },
  { id: "pioneer11", launchYear: 1973, speedKmS: 11.4 },
  { id: "iss", launchYear: 1998, speedKmS: 7.66 },
];

export function kmPerHour(speedKmS: number): number {
  return speedKmS * 3600;
}

/** Years needed to travel one light-year at a constant speed. */
export function yearsPerLightYear(speedKmS: number): number {
  return LIGHT_YEAR_KM / speedKmS / SECONDS_PER_YEAR;
}

/** Round to a friendly number: 17,630 → 17,600; 1,569 → 1,570. */
export function roundFriendly(n: number): number {
  if (n < 100) return Math.round(n);
  const mag = 10 ** (Math.floor(Math.log10(n)) - 2);
  return Math.round(n / mag) * mag;
}
