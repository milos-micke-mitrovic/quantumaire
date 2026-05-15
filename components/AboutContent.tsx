"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { TrustBadge } from "@/lib/types";
import { Badge } from "./Badge";

const BADGES: TrustBadge[] = [
  "FACT",
  "ESTABLISHED_THEORY",
  "PROBABLE_THEORY",
  "SPECULATIVE",
];

const BADGE_BODY_KEYS: Record<TrustBadge, string> = {
  FACT: "about.badgeFactBody",
  ESTABLISHED_THEORY: "about.badgeEstablishedBody",
  PROBABLE_THEORY: "about.badgeProbableBody",
  SPECULATIVE: "about.badgeSpeculativeBody",
};

export function AboutContent() {
  const { t } = useI18n();

  return (
    <main className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("common.about")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-cosmos-star sm:text-5xl">
          <span className="bg-aurora-gradient bg-clip-text text-transparent">
            {t("about.title")}
          </span>
        </h1>
        <p className="mt-3 text-lg text-cosmos-star/80">
          {t("about.tagline")}
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
      >
        <p className="text-base leading-relaxed text-cosmos-star/85 sm:text-[17px]">
          {t("about.intro")}
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
      >
        <h2 className="font-display text-2xl font-semibold tracking-tight text-cosmos-plasma sm:text-3xl">
          {t("about.scaleHeading")}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-cosmos-star/80 sm:text-[17px]">
          {t("about.scaleBody")}
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
      >
        <h2 className="font-display text-2xl font-semibold tracking-tight text-cosmos-nova sm:text-3xl">
          {t("about.badgesHeading")}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-cosmos-star/80 sm:text-[17px]">
          {t("about.badgesIntro")}
        </p>

        <dl className="mt-6 space-y-5">
          {BADGES.map((b) => (
            <div
              key={b}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5"
            >
              <dt className="sm:w-44 shrink-0">
                <Badge type={b} />
              </dt>
              <dd className="text-sm leading-relaxed text-cosmos-star/80 sm:text-[15px]">
                {t(BADGE_BODY_KEYS[b])}
              </dd>
            </div>
          ))}
        </dl>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
      >
        <h2 className="font-display text-2xl font-semibold tracking-tight text-cosmos-aurora sm:text-3xl">
          {t("about.editorialHeading")}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-cosmos-star/80 sm:text-[17px]">
          {t("about.editorialBody")}
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
      >
        <h2 className="font-display text-2xl font-semibold tracking-tight text-cosmos-ember sm:text-3xl">
          {t("about.languagesHeading")}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-cosmos-star/80 sm:text-[17px]">
          {t("about.languagesBody")}
        </p>
      </motion.section>
    </main>
  );
}
