import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BetweenFinder } from "@/components/BetweenFinder";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
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
    path: "tools/between",
    title: tServer(typed, "common.betweenTool.title"),
    description: tServer(typed, "common.betweenTool.tagline"),
  });
}

export default async function BetweenPage({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": absoluteUrl(typed, "tools/between"),
    name: tServer(typed, "common.betweenTool.title"),
    description: tServer(typed, "common.betweenTool.tagline"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl(typed, "") },
  };

  return (
    <>
      <JsonLd
        data={[
          ld,
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "common.betweenTool.title"), path: "tools/between" },
          ]),
        ]}
      />
      <BetweenFinder />
      <SiteFooter />
    </>
  );
}
