import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

const FAQ_KEYS = [
  {
    q: "What is Quantumaire?",
    a: "An interactive educational journey from the smallest known particles to the observable universe, with the trustworthiness of every claim transparently labelled as Fact, Established Theory, Probable Theory, or Speculative.",
  },
  {
    q: "How big is Earth compared to a quark?",
    a: "Roughly 25 orders of magnitude — Earth's diameter is about 1.27 × 10⁷ m, a quark is no larger than 10⁻¹⁸ m. Quantumaire uses a 0.5 mm grain of sand as a stand-in for Earth so the rest of the universe becomes intuitive.",
  },
  {
    q: "What is dark matter?",
    a: "An invisible form of matter whose gravity holds galaxies together. We map it through gravitational lensing, but its particle nature is unknown.",
  },
  {
    q: "What is dark energy?",
    a: "A still-unexplained energy that appears to be accelerating the expansion of the universe. It accounts for roughly 68% of the total energy of the cosmos.",
  },
  {
    q: "What languages does Quantumaire support?",
    a: "English and Serbian. Every stop has equivalent canonical URLs in both languages.",
  },
];

export default async function LocaleHome({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  return (
    <main className="relative">
      <JsonLd
        data={[itemListJsonLd(typed), faqJsonLd(FAQ_KEYS)]}
      />
      <JourneyHero />
      <Journey />
      <SiteFooter />
    </main>
  );
}
