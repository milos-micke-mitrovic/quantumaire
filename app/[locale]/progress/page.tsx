import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgressView } from "@/components/ProgressView";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { STOPS } from "@/lib/content";
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
    path: "progress",
    title: tServer(typed, "common.progress.title"),
    description: tServer(typed, "common.progress.tagline", {
      count: 0,
      total: STOPS.length,
    }),
    // The progress page is personal — don't ask AI engines to index per-user
    // values, but the page URL itself can still be discovered via the site.
    index: false,
  });
}

export default async function ProgressPageRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(typed, "progress"),
    name: tServer(typed, "common.progress.title"),
    description: tServer(typed, "common.progress.tagline", {
      count: 0,
      total: STOPS.length,
    }),
    inLanguage: typed === "sr" ? "sr-Latn-RS" : "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl(typed, ""),
    },
  };

  return (
    <>
      <JsonLd
        data={[
          ld,
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "common.progress.title"), path: "progress" },
          ]),
        ]}
      />
      <ProgressView />
      <SiteFooter />
    </>
  );
}
