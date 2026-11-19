import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { TagView } from "@/components/TagView";
import { tServer, tServerOptional } from "@/lib/i18n-server";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  LOCALES,
  SITE_NAME,
} from "@/lib/seo";
import { getStopsByTag, hasTagPage, TAG_PAGES } from "@/lib/tags";
import type { Locale } from "@/lib/types";

interface PageProps {
  params: Promise<{ locale: string; tag: string }>;
}

/** Only the generated pages exist; anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => TAG_PAGES.map((tag) => ({ locale, tag })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, tag } = await params;
  if (!LOCALES.includes(locale as Locale) || !hasTagPage(tag)) return {};
  const typed = locale as Locale;
  return buildPageMetadata({
    locale: typed,
    path: `tag/${tag}`,
    title: tServer(typed, `tagPages.${tag}.seoTitle`),
    description:
      tServerOptional(typed, `tagPages.${tag}.metaDescription`) ??
      tServer(typed, `tagPages.${tag}.intro`),
  });
}

export default async function TagPage({ params }: PageProps) {
  const { locale, tag } = await params;
  if (!LOCALES.includes(locale as Locale) || !hasTagPage(tag)) notFound();
  const typed = locale as Locale;
  const stops = getStopsByTag(tag);
  const title = tServer(typed, `tagPages.${tag}.title`);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(typed, `tag/${tag}`),
    name: title,
    description: tServer(typed, `tagPages.${tag}.intro`),
    inLanguage: typed === "sr" ? "sr-Latn-RS" : "en",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl(typed, "") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: stops.length,
      itemListElement: stops.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(typed, `stop/${s.id}`),
        name: tServer(typed, `${s.i18nKey}.name`),
      })),
    },
  };

  return (
    <>
      <JsonLd
        data={[
          collectionLd,
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: title, path: `tag/${tag}` },
          ]),
        ]}
      />
      <TagView tag={tag} stops={stops} />
      <SiteFooter locale={typed} />
    </>
  );
}
