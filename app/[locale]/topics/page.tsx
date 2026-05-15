import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { TopicsIndex } from "@/components/TopicsIndex";
import { TOPICS } from "@/lib/topics";
import { tServer } from "@/lib/i18n-server";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  LOCALES,
  SITE_NAME,
} from "@/lib/seo";
import type { Locale } from "@/lib/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) return {};
  const typed = locale as Locale;
  return buildPageMetadata({
    locale: typed,
    path: "topics",
    title: tServer(typed, "topicsIndex.title"),
    description: tServer(typed, "topicsIndex.tagline"),
  });
}

export default async function TopicsHubPage({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl(typed, "topics"),
    name: tServer(typed, "topicsIndex.title"),
    description: tServer(typed, "topicsIndex.tagline"),
    inLanguage: typed === "sr" ? "sr-Latn-RS" : "en",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl(typed, "") },
    itemListElement: TOPICS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(typed, `topics/${t.slug}`),
      name: tServer(typed, `${t.i18nKey}.title`),
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          itemList,
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "topicsIndex.title"), path: "topics" },
          ]),
        ]}
      />
      <TopicsIndex />
      <SiteFooter />
    </>
  );
}
