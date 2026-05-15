import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/CategoryView";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import {
  CATEGORIES,
  categoryFromSlug,
  categorySlug,
  getStopsByCategory,
} from "@/lib/content";
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
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const out: Array<{ locale: string; slug: string }> = [];
  for (const locale of LOCALES) {
    for (const cat of CATEGORIES) {
      out.push({ locale, slug: categorySlug(cat) });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!LOCALES.includes(locale as Locale)) return {};
  const category = categoryFromSlug(slug);
  if (!category) return {};
  const typed = locale as Locale;

  const name = tServer(typed, `categories.${category}`);
  const description = tServer(typed, `categories.${category}.description`);

  return buildPageMetadata({
    locale: typed,
    path: `category/${slug}`,
    title: tServer(typed, "common.exploreCategory", { category: name }),
    description,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const typed = locale as Locale;
  const stops = getStopsByCategory(category);
  const name = tServer(typed, `categories.${category}`);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(typed, `category/${slug}`),
    name,
    description: tServer(typed, `categories.${category}.description`),
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
            { name, path: `category/${slug}` },
          ]),
        ]}
      />
      <CategoryView category={category} stops={stops} />
      <SiteFooter />
    </>
  );
}
