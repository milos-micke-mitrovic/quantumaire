"use client";

import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { Topic } from "@/lib/topics";
import { STOPS } from "@/lib/content";
import { DistanceScale } from "./DistanceScale";
import { Sources } from "./Sources";
import { StopCard } from "./StopCard";

interface TopicViewProps {
  topic: Topic;
}

export function TopicView({ topic }: TopicViewProps) {
  const { t, locale } = useI18n();

  const title = t(`${topic.i18nKey}.title`);
  const tagline = t(`${topic.i18nKey}.tagline`);
  const intro = t(`${topic.i18nKey}.intro`);

  const sections = Array.from({ length: topic.sectionCount }, (_, i) => ({
    heading: t(`${topic.i18nKey}.section${i + 1}Heading`),
    body: t(`${topic.i18nKey}.section${i + 1}Body`),
  }));

  const related = topic.relatedStopIds
    .map((id) => STOPS.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

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

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.header>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("topicView.intro")}
        </p>
        <p className="mt-3 text-base leading-relaxed text-cosmos-star/85 sm:text-[17px]">
          {intro}
        </p>
      </section>

      {/* The Distances topic gets an interactive distance slider —
          a parallel to the size slider on the journey home page. */}
      {topic.slug === "distances" && (
        <div className="mt-8">
          <DistanceScale />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {sections.map((section, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-sm sm:p-8"
          >
            <h2 className="font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl">
              {section.heading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-cosmos-star/85 sm:text-[17px]">
              {section.body}
            </p>
          </motion.section>
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
