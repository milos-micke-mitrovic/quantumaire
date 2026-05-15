import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutContent } from "@/components/AboutContent";
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
    path: "about",
    title: tServer(typed, "about.title"),
    description: tServer(typed, "about.intro").slice(0, 300),
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const aboutPageLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": absoluteUrl(typed, "about"),
    name: tServer(typed, "about.title"),
    description: tServer(typed, "about.intro"),
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
          aboutPageLd,
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "about.title"), path: "about" },
          ]),
        ]}
      />
      <AboutContent />
      <SiteFooter />
    </>
  );
}
