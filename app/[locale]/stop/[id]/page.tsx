import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { StopDetail } from "@/components/StopDetail";
import { EverydayScale } from "@/components/EverydayScale";
import { SpacecraftSpeeds } from "@/components/SpacecraftSpeeds";
import { StopSizeFaq } from "@/components/StopSizeFaq";
import { SiteFooter } from "@/components/SiteFooter";
import {
  STOPS,
  getNeighbors,
  getRelatedStops,
  getStop,
} from "@/lib/content";
import { pickDictionary, tServer, tServerOptional } from "@/lib/i18n-server";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  LOCALES,
  SITE_MODIFIED,
  SITE_URL,
  fitDescription,
  faqJsonLd,
  stopJsonLd,
} from "@/lib/seo";
import {
  buildSizeFaq,
  capFirst,
  sizeSummary,
  subjectName,
  titleCase,
} from "@/lib/sizeFaq";
import type { Locale } from "@/lib/types";
import { I18nExtend } from "@/lib/i18n";
import { getSources } from "@/lib/sources";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}


/** Stops that show the "how fast are our spacecraft?" table. */
const SPACECRAFT_STOPS = new Set(["voyager1", "light_year"]);
/** Only the generated pages exist; anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  const out: Array<{ locale: string; id: string }> = [];
  for (const locale of LOCALES) {
    for (const stop of STOPS) {
      out.push({ locale, id: stop.id });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const stop = getStop(id);
  if (!stop) return {};
  if (!LOCALES.includes(locale as Locale)) return {};
  const typed = locale as Locale;

  const tagline = tServer(typed, `${stop.i18nKey}.tagline`);
  const body = tServer(typed, `${stop.i18nKey}.body`);
  const size = sizeSummary(stop, typed);
  const tail = tServer(typed, "sizeFaq.metaTail");
  // The "compare to a human, Earth…" tail is skipped on those two pages.
  const withTail = stop.id !== "earth" && stop.id !== "human";
  const description =
    tServerOptional(typed, `${stop.i18nKey}.metaDescription`) ??
    (size
      ? fitDescription([size, tagline, ...(withTail ? [tail] : [])])
      : fitDescription([tagline, body]));

  const title =
    stop.sizeMeters !== null
      ? tServer(typed, "sizeFaq.title", {
          name: titleCase(subjectName(stop, typed)),
          Name: capFirst(subjectName(stop, typed)),
        })
      : tServer(typed, `${stop.i18nKey}.seoTitle`);

  return buildPageMetadata({
    locale: typed,
    path: `stop/${stop.id}`,
    title,
    description,
    image: `${SITE_URL}/${typed}/stop/${stop.id}/opengraph-image/${stop.id}`,
    imageAlt: tServer(typed, stop.image.altKey),
  });
}

export default async function StopPage({ params }: PageProps) {
  const { locale, id } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typed = locale as Locale;

  const stop = getStop(id);
  if (!stop) notFound();

  const { prev, next } = getNeighbors(stop.id);
  const related = getRelatedStops(stop, 3);

  const name = tServer(typed, `${stop.i18nKey}.name`);
  const tagline = tServer(typed, `${stop.i18nKey}.tagline`);
  const body = tServer(typed, `${stop.i18nKey}.body`);
  const altText = tServer(typed, stop.image.altKey);
  const facts = ["fact1", "fact2", "fact3", "fact4"].map((k) =>
    tServer(typed, `${stop.i18nKey}.facts.${k}`)
  );
  const sizeFaq = buildSizeFaq(stop, typed);

  return (
    <>
      <JsonLd
        data={[
          stopJsonLd(stop, typed, {
            name,
            description: tagline,
            body,
            altText,
            facts,
            relatedStopUrls: related.map((r) =>
              absoluteUrl(typed, `stop/${r.id}`)
            ),
          }),
          breadcrumbJsonLd(typed, [
            { name: tServer(typed, "common.title"), path: "" },
            { name, path: `stop/${stop.id}` },
          ]),
          faqJsonLd(sizeFaq),
        ]}
      />
      <I18nExtend
        dictionary={pickDictionary(typed, [
          stop.i18nKey,
          ...stop.glossary.map((g) => `glossary.${g}`),
        ])}
      >
      <StopDetail
        stop={stop}
        prev={prev}
        next={next}
        related={related}
        lastUpdated={SITE_MODIFIED}
        sources={getSources(stop.id)}
      >
        <EverydayScale stop={stop} locale={typed} />
        <StopSizeFaq
          locale={typed}
          heading={tServer(typed, "sizeFaq.heading", {
            Name: capFirst(subjectName(stop, typed)),
          })}
          items={sizeFaq}
        />
        {SPACECRAFT_STOPS.has(stop.id) && (
          <SpacecraftSpeeds locale={typed} highlightId={stop.id} />
        )}
      </StopDetail>
      </I18nExtend>
      <SiteFooter locale={typed} />
    </>
  );
}
