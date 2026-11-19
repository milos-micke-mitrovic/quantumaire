import { renderOgCard, OG_SIZE } from "@/lib/ogCard";
import { tServer } from "@/lib/i18n-server";
import { LOCALES } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { getTopic } from "@/lib/topics";

export const alt = "Quantumaire";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  // Called once with empty params while Next collects page data.
  return [{ id: slug ?? "default", alt, size, contentType }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolved = await params;
  const locale = (
    LOCALES.includes(resolved.locale as Locale) ? resolved.locale : "en"
  ) as Locale;
  const t = (key: string) => tServer(locale, key);
  const topic = getTopic(resolved.slug);
  const key = topic?.i18nKey ?? "topicsIndex";
  return renderOgCard({
    eyebrow: t("topicsIndex.title"),
    title: t(`${key}.title`),
    subtitle: t(`${key}.tagline`),
    footer: `quantumaire · ${locale.toUpperCase()}`,
  });
}
