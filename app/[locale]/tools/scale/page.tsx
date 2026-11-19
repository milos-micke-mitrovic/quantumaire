import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScaleCalculator } from "@/components/ScaleCalculator";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { getDictionary, tServer } from "@/lib/i18n-server";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
  LOCALES,
  ogImageUrl,
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
    image: ogImageUrl(typed, "tools/scale", typed),
    title: tServer(typed, "seo.scaleTool"),
    description: tServer(typed, "seo.scaleToolDescription"),
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
    description: tServer(typed, "common.converter.tagline"),
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

  const faq = (
    (getDictionary(typed) as { common: { converter: { faq: Array<{ q: string; a: string }> } } })
      .common.converter.faq
  );

  return (
    <>
      <JsonLd
        data={[
          softwareLd,
          faqJsonLd(faq),
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "common.scaleTool.title"), path: "tools/scale" },
          ]),
        ]}
      />
      <ScaleCalculator />
      <section
        aria-labelledby="units-faq"
        className="mx-auto -mt-12 w-full max-w-3xl px-5 pb-20 sm:px-8"
      >
        <h2
          id="units-faq"
          className="font-display text-2xl font-semibold tracking-tight text-cosmos-star"
        >
          {tServer(typed, "common.converter.faqHeading")}
        </h2>
        <div className="mt-5 space-y-5">
          {faq.map((item) => (
            <div key={item.q}>
              <h3 className="text-base font-medium text-cosmos-star">{item.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cosmos-star/75 sm:text-base">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter locale={typed} />
    </>
  );
}
