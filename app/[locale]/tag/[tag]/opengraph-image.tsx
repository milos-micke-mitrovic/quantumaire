import { renderOgCard, OG_SIZE } from "@/lib/ogCard";
import { tServer } from "@/lib/i18n-server";
import { LOCALES } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const alt = "Quantumaire";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { tag } = await params;
  // Called once with empty params while Next collects page data.
  return [{ id: tag ?? "default", alt, size, contentType }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const resolved = await params;
  const locale = (
    LOCALES.includes(resolved.locale as Locale) ? resolved.locale : "en"
  ) as Locale;
  const t = (key: string) => tServer(locale, key);
  const tag = resolved.tag;
  return renderOgCard({
    eyebrow: t("tagPages.eyebrow"),
    title: t(`tagPages.${tag}.title`),
    subtitle: t(`tagPages.${tag}.intro`),
    footer: `quantumaire · ${locale.toUpperCase()}`,
  });
}
