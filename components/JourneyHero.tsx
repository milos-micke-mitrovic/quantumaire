"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export function JourneyHero() {
  const { t } = useI18n();

  return (
    <section className="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-cosmic-gradient opacity-90"
      />
      {/* Soft static glow — no parallax transform, no blur-3xl. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40%] -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22]"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,255,0.55), rgba(192,132,252,0.18) 45%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-cosmos-star/70 backdrop-blur"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-cosmos-nova animate-pulse-soft"
          />
          {t("common.title")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cosmos-star sm:text-6xl"
        >
          <span className="bg-aurora-gradient bg-clip-text text-transparent">
            {t("common.tagline")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cosmos-star/75 sm:text-lg"
        >
          {t("common.subtagline")}
        </motion.p>

        <motion.a
          href="#journey"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-aurora-gradient px-6 py-3 text-sm font-medium text-cosmos-void shadow-glow transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-nova/70"
        >
          {t("common.begin")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
