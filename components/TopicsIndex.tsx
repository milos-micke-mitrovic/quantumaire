"use client";

import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { TOPICS } from "@/lib/topics";

export function TopicsIndex() {
  const { t, locale } = useI18n();

  return (
    <main className="relative mx-auto w-full max-w-5xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.header>

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((topic, i) => (
          <motion.article
            key={topic.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.04 }}
          >
            <Link
              href={`/${locale}/topics/${topic.slug}`}
              className={clsx(
                "group block h-full overflow-hidden rounded-3xl border border-white/10",
                "bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent",
                "p-6 transition-colors duration-200 hover:border-white/20"
              )}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
                {t("topicsIndex.title")}
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
          </motion.article>
        ))}
      </section>
    </main>
  );
}
