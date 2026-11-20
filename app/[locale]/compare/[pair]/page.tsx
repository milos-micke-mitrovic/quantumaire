import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ComparePage } from "@/components/ComparePage";
import { ComparePairLinks } from "@/components/ComparePairLinks";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPARE_PAIRS, getPair, pairSlug } from "@/lib/comparePairs";
import { describePair } from "@/lib/comparePairText";
import { I18nExtend } from "@/lib/i18n";
import { pickDictionary, tServer } from "@/lib/i18n-server";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
  LOCALES,
  SITE_URL,
} from "@/lib/seo";
import type { Locale, Stop } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    COMPARE_PAIRS.map((p) => ({ locale, pair: pairSlug(p) }))
  );
}

interface PageProps {
  params: Promise<{ locale: string; pair: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, pair } = await params;
  const stops = getPair(pair);
  if (!stops || !LOCALES.includes(locale as Locale)) return {};
  const typed = locale as Locale;
  const d = describePair(typed, stops[0], stops[1]);
  return buildPageMetadata({
    locale: typed,
    path: `compare/${pair}`,
    title: d.title,
    description: d.description,
    image: `${SITE_URL}/${typed}/compare/og?a=${stops[1].id}&b=${stops[0].id}`,
  });
}

export default async function ComparePairPage({ params }: PageProps) {
  const { locale, pair } = await params;
  const stops = getPair(pair);
  if (!stops || !LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;
  const [first, second] = stops;
  const d = describePair(typed, first, second);

  const topicLink = (s: Stop) => (
    <Link
      href={`/${typed}/stop/${s.id}`}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20"
    >
      <span className="block font-display text-lg text-cosmos-star">
        {tServer(typed, `${s.i18nKey}.name`)} →
      </span>
      <span className="mt-1 block text-sm text-cosmos-star/70">
        {tServer(typed, `${s.i18nKey}.tagline`)}
      </span>
    </Link>
  );

  const header = (
    <header>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
        <Link href={`/${typed}/compare`} className="hover:text-cosmos-star">
          {tServer(typed, "common.compare")}
        </Link>
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        <span className="bg-aurora-gradient bg-clip-text text-transparent">
          {d.title}
        </span>
      </h1>
      <div className="mt-5 max-w-2xl space-y-2 text-base leading-relaxed text-cosmos-star/80 sm:text-lg">
        {d.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
        {topicLink(first)}
        {topicLink(second)}
      </div>
      <p className="mt-6 text-sm text-cosmos-star/60">
        {tServer(typed, "common.comparePage.pairTry")}
      </p>
    </header>
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name: tServer(typed, "common.compare"), path: "compare" },
            { name: d.title, path: `compare/${pair}` },
          ]),
          faqJsonLd([{ q: d.faqQ, a: d.lines.join(" ") }]),
        ]}
      />
      {/* The tool reads ?a=&b= on the client; the HTML ships the summary. */}
      <Suspense fallback={<main className="mx-auto w-full max-w-5xl px-5 pb-12 pt-12 sm:px-8 sm:pt-16">{header}</main>}>
        <I18nExtend
          dictionary={pickDictionary(typed, [`stops.${first.id}.image`, `stops.${second.id}.image`])}
        >
          <ComparePage
            initialA={second.id}
            initialB={first.id}
            basePath={`/${typed}/compare`}
            header={header}
          />
        </I18nExtend>
      </Suspense>
      <ComparePairLinks locale={typed} exclude={pair} />
      <SiteFooter locale={typed} />
    </>
  );
}
