/** Lower-case and strip diacritics, so "Merkur" matches "merkur" and "č" ≈ "c". */
export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
