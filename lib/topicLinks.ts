/**
 * Finds topic names inside running text so guides can link them to their
 * topic pages. Case-sensitive (proper names are capitalised; "cell" in
 * prose stays plain), allows inflected endings ("Jupitera", "Saturnovi"),
 * and links each topic only once per page via the shared `seen` set.
 * English only takes plural endings: "Ants", but not "Anton".
 * Inside **bold** text the match ignores case: bold marks a deliberate
 * mention, and English names are Title Case ("Quantum Entanglement")
 * while prose writes "**quantum entanglement**".
 */
export interface TopicName {
  id: string;
  name: string;
}

export type Segment = string | { id: string; text: string };

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** "The Big Bang" → "Big Bang": the article rarely appears mid-sentence. */
function core(name: string): string {
  return name.replace(/^(The|the)\s+/, "");
}

export function linkTopicNames(
  text: string,
  names: TopicName[],
  seen: Set<string>,
  locale: string = "sr",
  bold: boolean = false
): Segment[] {
  const ending = locale === "en" ? "(?:s|es)?" : "\\p{L}{0,3}";
  type Hit = { start: number; end: number; id: string };
  const hits: Hit[] = [];
  // Longer names first so "Milky Way" wins over a shorter overlapping name.
  const ordered = [...names].sort((a, b) => core(b.name).length - core(a.name).length);
  for (const { id, name } of ordered) {
    // An alias (`linkName`) shares its id with the full name: link once.
    if (seen.has(id) || hits.some((h) => h.id === id)) continue;
    const n = core(name);
    if (n.length < 3) continue;
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegex(n)}${ending}(?![\\p{L}\\p{N}])`, bold ? "iu" : "u");
    const m = re.exec(text);
    if (!m) continue;
    const start = m.index;
    const end = start + m[0].length;
    if (hits.some((h) => start < h.end && end > h.start)) continue;
    hits.push({ start, end, id });
  }
  hits.sort((a, b) => a.start - b.start);
  const out: Segment[] = [];
  let cursor = 0;
  for (const h of hits) {
    seen.add(h.id);
    if (h.start > cursor) out.push(text.slice(cursor, h.start));
    out.push({ id: h.id, text: text.slice(h.start, h.end) });
    cursor = h.end;
  }
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}
