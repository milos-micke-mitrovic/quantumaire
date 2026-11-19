import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlossaryView } from "@/components/GlossaryView";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { GLOSSARY_KEYS } from "@/lib/glossary";
import { pickDictionary, tServer } from "@/lib/i18n-server";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  LOCALES,
  ogImageUrl,
  SITE_NAME,
} from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { I18nExtend } from "@/lib/i18n";

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
    path: "glossary",
    image: ogImageUrl(typed, "glossary", typed),
    title: tServer(typed, "seo.glossary"),
    description: tServer(typed, "seo.glossaryDescription", {
      count: GLOSSARY_KEYS.length,
    }),
  });
}

export default async function GlossaryPage({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": absoluteUrl(typed, "glossary"),
    name: tServer(typed, "common.glossaryPage.title"),
    inLanguage: typed === "sr" ? "sr-Latn-RS" : "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl(typed, ""),
    },
    hasDefinedTerm: GLOSSARY_KEYS.map((key) => ({
      "@type": "DefinedTerm",
      "@id": `${absoluteUrl(typed, "glossary")}#g-${key}`,
      name: tServer(typed, `glossary.${key}.term`),
      description: tServer(typed, `glossary.${key}.definition`),
      inDefinedTermSet: absoluteUrl(typed, "glossary"),
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          definedTermSet,
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            {
              name: tServer(typed, "common.glossaryPage.title"),
              path: "glossary",
            },
          ]),
        ]}
      />
      <I18nExtend dictionary={pickDictionary(typed, ["glossary"])}>
        <GlossaryView keys={GLOSSARY_KEYS} />
      </I18nExtend>
      <SiteFooter locale={typed} />
    </>
  );
}
