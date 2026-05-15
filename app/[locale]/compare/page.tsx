import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ComparePage } from "@/components/ComparePage";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { tServer } from "@/lib/i18n-server";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  LOCALES,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import { getStop } from "@/lib/content";
import type { Locale } from "@/lib/types";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) return {};
  const typed = locale as Locale;

  const sp = await searchParams;
  const aId = sp.a && getStop(sp.a) ? sp.a : "quark";
  const bId = sp.b && getStop(sp.b) ? sp.b : "earth";
  const aName = tServer(typed, `stops.${aId}.name`);
  const bName = tServer(typed, `stops.${bId}.name`);

  const title = `${aName} vs ${bName} · ${tServer(
    typed,
    "common.comparePage.title"
  )}`;

  const ogImage = `${SITE_URL}/${typed}/compare/og?a=${encodeURIComponent(
    aId
  )}&b=${encodeURIComponent(bId)}`;

  return buildPageMetadata({
    locale: typed,
    path: "compare",
    title,
    description: tServer(typed, "common.comparePage.tagline"),
    image: ogImage,
    imageAlt: `${aName} vs ${bName}`,
  });
}

export default async function ComparePageRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": absoluteUrl(typed, "compare"),
    name: tServer(typed, "common.comparePage.title"),
    description: tServer(typed, "common.comparePage.tagline"),
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
          ld,
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "common.compare"), path: "compare" },
          ]),
        ]}
      />
      <Suspense fallback={null}>
        <ComparePage />
      </Suspense>
      <SiteFooter />
    </>
  );
}
