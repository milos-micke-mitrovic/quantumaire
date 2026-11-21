import clsx from "clsx";
import Link from "next/link";
import { Fragment } from "react";
import { tServer } from "@/lib/i18n-server";
import type { Topic } from "@/lib/topics";
import type { Locale } from "@/lib/types";
import { STOPS } from "@/lib/content";
import { getStopsByTag } from "@/lib/tags";
import { parseInline, type Run } from "@/lib/inlineMarkdown";
import { linkTopicNames, type Segment } from "@/lib/topicLinks";
import { DistanceScale } from "./DistanceScale";
import { GuideHero } from "./GuideHero";
import { GuideKeyNumbers } from "./GuideKeyNumbers";
import { Sources } from "./Sources";
import { StopCard } from "./StopCard";

interface TopicViewProps {
  topic: Topic;
  locale: Locale;
}

/**
 * Server component: the guide text, links and layout render to HTML and
 * never hydrate; only the hero, key numbers, cards and scale are client
 * islands.
 */
export function TopicView({ topic, locale }: TopicViewProps) {
  const t = (key: string) => tServer(locale, key);

  const title = t(`${topic.i18nKey}.title`);
  const tagline = t(`${topic.i18nKey}.tagline`);
  const intro = t(`${topic.i18nKey}.intro`);

  const sections = Array.from({ length: topic.sectionCount }, (_, i) => ({
    heading: t(`${topic.i18nKey}.section${i + 1}Heading`),
    body: t(`${topic.i18nKey}.section${i + 1}Body`),
  }));

  // **bold** / *italic* runs first, then topic names inside each run link
  // to their topic pages, each name once per guide.
  const names = STOPS.map((s) => ({ id: s.id, name: t(`${s.i18nKey}.name`) }));
  const seen = new Set<string>();
  const linked = [intro, ...sections.map((s) => s.body)].map((text) =>
    parseInline(text).map((run) => ({
      ...run,
      segments: linkTopicNames(run.text, names, seen, locale),
    }))
  );
  const renderSegments = (segments: Segment[]) =>
    segments.map((seg, k) =>
      typeof seg === "string" ? (
        <Fragment key={k}>{seg}</Fragment>
      ) : (
        <Link
          key={k}
          href={`/${locale}/stop/${seg.id}`}
          className="text-cosmos-star underline decoration-cosmos-plasma/50 decoration-dotted underline-offset-4 transition-colors hover:text-cosmos-plasma"
        >
          {seg.text}
        </Link>
      )
    );
  const renderLinked = (runs: (Run & { segments: Segment[] })[]) =>
    runs.map((run, k) =>
      run.bold ? (
        <strong key={k} className="font-semibold text-cosmos-star">
          {renderSegments(run.segments)}
        </strong>
      ) : run.italic ? (
        <em key={k}>{renderSegments(run.segments)}</em>
      ) : (
        <Fragment key={k}>{renderSegments(run.segments)}</Fragment>
      )
    );

  // Guides that cover a tag list every topic with it (that guide *is* the
  // tag's page), then any extra hand-picked related topics.
  const tagged = topic.tag ? getStopsByTag(topic.tag) : [];
  const related = [
    ...tagged,
    ...topic.relatedStopIds
      .map((id) => STOPS.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .filter((s) => !tagged.includes(s)),
  ];

  const hero = STOPS.find((s) => s.id === topic.heroStopId);

  return (
    <main className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <nav
        aria-label={t("common.breadcrumb")}
        className="mb-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cosmos-star/55"
      >
        <Link href={`/${locale}`} className="transition-colors hover:text-cosmos-star">
          {t("common.title")}
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/${locale}/topics`} className="transition-colors hover:text-cosmos-star">
          {t("topicsIndex.title")}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-cosmos-star/80">{title}</span>
      </nav>

      <header className="animate-rise">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("topicsIndex.title")}
        </p>
        <h1
          className={clsx(
            "mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl",
            topic.accent
          )}
        >
          <span className="bg-aurora-gradient bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-cosmos-star/80 sm:text-lg">
          {tagline}
        </p>
      </header>

      {hero && <GuideHero stop={hero} />}

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("topicView.intro")}
        </p>
        <p className="mt-3 text-base leading-relaxed text-cosmos-star/85 sm:text-[17px]">
          {renderLinked(linked[0])}
        </p>
      </section>

      <GuideKeyNumbers topic={topic} />

      {/* The Distances topic gets an interactive distance slider —
          a parallel to the size slider on the journey home page. */}
      {topic.slug === "distances" && (
        <div className="mt-8">
          <DistanceScale />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {sections.map((section, i) => (
          <section
            key={i}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-sm sm:p-8"
          >
            <h2 className="font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl">
              {section.heading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-cosmos-star/85 sm:text-[17px]">
              {renderLinked(linked[i + 1])}
            </p>
          </section>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl">
            {t("topicView.relatedStops")}
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {related.map((stop, i) => (
              <StopCard key={stop.id} stop={stop} index={i} />
            ))}
          </div>
        </section>
      )}

      {topic.sources.length > 0 && (
        <div className="mt-2">
          <Sources sources={topic.sources} />
        </div>
      )}
    </main>
  );
}
