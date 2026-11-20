/**
 * Alt text for a topic image. The long descriptions only ship on pages that
 * show an image large (topic, guide, pair pages add them via I18nExtend);
 * elsewhere — the interactive compare tool — the topic's name stands in.
 */
export function imageAlt(t: (key: string) => string, altKey: string): string {
  const alt = t(altKey);
  if (alt !== altKey) return alt;
  const nameKey = altKey.replace(/\.image\.alt$/, ".name");
  const name = t(nameKey);
  return name !== nameKey ? name : "";
}
