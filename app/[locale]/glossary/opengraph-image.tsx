import { renderOgCard, OG_SIZE } from "@/lib/ogCard";
import { tServer } from "@/lib/i18n-server";
import { LOCALES } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const alt = "Quantumaire";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateImageMetadata() {
  return LOCALES.map((locale) => ({ id: locale, alt, size, contentType }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  const locale = (
    LOCALES.includes(resolved.locale as Locale) ? resolved.locale : "en"
  ) as Locale;
  return renderOgCard({
    eyebrow: tServer(locale, "common.title"),
    title: tServer(locale, "common.glossary"),
    subtitle: tServer(locale, "seo.glossaryDescription"),
    footer: `quantumaire · ${locale.toUpperCase()}`,
  });
}
