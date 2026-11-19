/**
 * The tiny bit of Markdown guide texts use: **bold** and *italic*.
 * A lone asterisk glued to a word (Sagittarius A*, M87*) is left alone.
 */
export interface Run {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

const PATTERN =
  /\*\*(?=\S)([^*]+?)(?<=\S)\*\*|(?<![\w*])\*(?=\S)([^*]+?)(?<=\S)\*(?![\w*])/g;

export function parseInline(text: string): Run[] {
  const runs: Run[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    const start = m.index ?? 0;
    if (start > last) runs.push({ text: text.slice(last, start) });
    runs.push(m[1] !== undefined ? { text: m[1], bold: true } : { text: m[2], italic: true });
    last = start + m[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last) });
  return runs;
}

/** Plain text for meta descriptions and JSON-LD. */
export function stripInline(text: string): string {
  return parseInline(text)
    .map((r) => r.text)
    .join("");
}
