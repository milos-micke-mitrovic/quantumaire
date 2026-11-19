"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export function JourneyHero() {
  const { t } = useI18n();

  return (
    <section className="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-24 sm:py-32">
      {/* Real sky: Webb's First Deep Field (NASA/ESA/CSA/STScI, public
          domain) — every smudge in it is a galaxy. Darkened toward the
          edges and behind the text so the headline stays readable. */}
      <Image
        src="/images/hero-deep-field.webp"
        alt=""
        aria-hidden
        fill
        preload
        fetchPriority="high"
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 48%, rgba(3,3,10,0.82), rgba(3,3,10,0.35) 70%, rgba(3,3,10,0.15)), linear-gradient(180deg, rgba(3,3,10,0.55) 0%, transparent 25%, transparent 70%, #03030a 100%)",
        }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <p
          className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-cosmos-star/70 backdrop-blur"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-cosmos-star animate-pulse-soft"
          />
          {t("common.title")}
        </p>

        <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cosmos-star sm:text-6xl">
          <span className="bg-[linear-gradient(180deg,#ffffff_0%,#e0f2fe_45%,#c4b5fd_100%)] bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(3,3,10,0.9)]">
            {t("common.tagline")}
          </span>
        </h1>

        <p
          className="animate-rise mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cosmos-star/85 sm:text-lg"
        >
          {t("common.subtagline")}
        </p>

        <a
          href="#journey"
          className="animate-fade-up [animation-delay:200ms] mt-9 inline-flex items-center gap-2 rounded-full bg-aurora-gradient px-6 py-3 text-sm font-medium text-cosmos-void shadow-glow transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-nova/70"
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
        </a>
      </div>
      <p className="absolute bottom-3 right-4 text-[10px] text-cosmos-star/60">
        {t("common.heroCredit")}
      </p>
    </section>
  );
}
