"use client";

import clsx from "clsx";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { TOPICS, type Topic } from "@/lib/topics";
import { getStopsByTag } from "@/lib/tags";

// The broad "how big / how small" guides answer the most common searches,
// so they lead; the subject guides follow in their usual order.
const START_HERE = [
  "how-big-is-the-universe",
  "planet-sizes-compared",
  "smallest-things-in-the-universe",
  "largest-things-in-the-universe",
];
const ORDERED = [
  ...START_HERE.map((slug) => TOPICS.find((t) => t.slug === slug)!).filter(Boolean),
  ...TOPICS.filter((t) => !START_HERE.includes(t.slug)),
];

/** Same list the guide page shows: its tag's topics plus hand-picked ones. */
function topicCount(topic: Topic): number {
  const ids = new Set(topic.tag ? getStopsByTag(topic.tag).map((s) => s.id) : []);
  topic.relatedStopIds.forEach((id) => ids.add(id));
  return ids.size;
}

export function TopicsIndex() {
  const { t, locale } = useI18n();

  return (
    <main className="relative mx-auto w-full max-w-5xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <header className="animate-rise">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("topicsIndex.title")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          <span className="bg-aurora-gradient bg-clip-text text-transparent">
            {t("topicsIndex.title")}
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-cosmos-star/80 sm:text-lg">
          {t("topicsIndex.tagline")}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-cosmos-star/70">
          {t("topicsIndex.intro")}
        </p>
      </header>

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ORDERED.map((topic) => (
          <article key={topic.slug}>
            <Link
              href={`/${locale}/topics/${topic.slug}`}
              className={clsx(
                "group block h-full overflow-hidden rounded-3xl border border-white/10",
                "bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent",
                "p-6 transition-colors duration-200 hover:border-white/20"
              )}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
                {t("common.stopsInCategory", { count: topicCount(topic) })}
              </p>
              <h3
                className={clsx(
                  "mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl",
                  topic.accent
                )}
              >
                {t(`${topic.i18nKey}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-snug text-cosmos-star/75 sm:text-[15px]">
                {t(`${topic.i18nKey}.tagline`)}
              </p>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
