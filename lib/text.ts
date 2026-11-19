/** Lower-case and strip diacritics, so "Merkur" matches "merkur" and "č" ≈ "c". */
export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

/** Uppercase the first letter, for sentence-initial subjects. */
export function capFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
