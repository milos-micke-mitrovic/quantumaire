import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/FaqSection";
import { JourneyHero } from "@/components/JourneyHero";
import { Journey } from "@/components/Journey";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { tServer } from "@/lib/i18n-server";
import {
  buildPageMetadata,
  faqJsonLd,
  itemListJsonLd,
  LOCALES,
} from "@/lib/seo";
import type { Locale } from "@/lib/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) return {};
  const typed = locale as Locale;
  return buildPageMetadata({
    locale: typed,
    path: "",
    title: `${tServer(typed, "common.title")} — ${tServer(typed, "common.tagline")}`,
    description: tServer(typed, "common.subtagline"),
    imageAlt: tServer(typed, "common.tagline"),
  });
}

const FAQ_INDICES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export default async function LocaleHome({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const faqItems = FAQ_INDICES.map((i) => ({
    q: tServer(typed, `home.faq.q${i}`),
    a: tServer(typed, `home.faq.a${i}`),
  }));

  return (
    <main className="relative">
      <JsonLd
        data={[itemListJsonLd(typed), faqJsonLd(faqItems)]}
      />
      <JourneyHero />
      <Journey />
      <FaqSection locale={typed} />
      <SiteFooter />
    </main>
  );
}
