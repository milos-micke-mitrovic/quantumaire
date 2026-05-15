import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScaleCalculator } from "@/components/ScaleCalculator";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
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
    path: "tools/scale",
    title: tServer(typed, "common.scaleTool.title"),
    description: tServer(typed, "common.scaleTool.tagline"),
  });
}

export default async function ScaleToolPage({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": absoluteUrl(typed, "tools/scale"),
    name: tServer(typed, "common.scaleTool.title"),
    description: tServer(typed, "common.scaleTool.tagline"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (browser)",
    inLanguage: typed === "sr" ? "sr-Latn-RS" : "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl(typed, ""),
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <JsonLd
        data={[
          softwareLd,
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "common.tools"), path: "tools/scale" },
            { name: tServer(typed, "common.scaleTool.title"), path: "tools/scale" },
          ]),
        ]}
      />
      <ScaleCalculator />
      <SiteFooter />
    </>
  );
}
