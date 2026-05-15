"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { formatMeters } from "@/lib/scale";
import { describePosition } from "@/lib/references";

interface Unit {
  label: string;
  meters: number;
}

const UNITS: Unit[] = [
  { label: "fm", meters: 1e-15 },
  { label: "pm", meters: 1e-12 },
  { label: "nm", meters: 1e-9 },
  { label: "µm", meters: 1e-6 },
  { label: "mm", meters: 1e-3 },
  { label: "cm", meters: 1e-2 },
  { label: "m", meters: 1 },
  { label: "km", meters: 1e3 },
  { label: "AU", meters: 1.495978707e11 },
  { label: "ly", meters: 9.4607304725808e15 },
  { label: "pc", meters: 3.085677581491367e16 },
  { label: "Mpc", meters: 3.085677581491367e22 },
];

function nearestStop(meters: number) {
  if (!Number.isFinite(meters) || meters <= 0) return null;
  const target = Math.log10(meters);
  let best = null as null | { id: string; diff: number };
  for (const s of STOPS) {
    if (s.sizeMeters === null || s.sizeMeters <= 0) continue;
    const diff = Math.abs(Math.log10(s.sizeMeters) - target);
    if (!best || diff < best.diff) best = { id: s.id, diff };
  }
  if (!best || best.diff > 2.5) return null;
  return STOPS.find((s) => s.id === best!.id) ?? null;
}

export function ScaleCalculator() {
  const { t, locale } = useI18n();
  const [raw, setRaw] = useState("1.7");
  const [unitIdx, setUnitIdx] = useState(6); // "m"

  const value = Number(raw.replace(/,/g, "."));
  const unit = UNITS[unitIdx];
  const meters = Number.isFinite(value) && value > 0 ? value * unit.meters : 0;

  const pos = meters > 0 ? describePosition(meters) : null;
  let comparisonLine: string;
  if (!pos) {
    comparisonLine = t("comparison.abstract");
  } else if (pos.mode === "aboutThe" && pos.reference) {
    comparisonLine = t("comparison.aboutThe", {
      reference: t(`references.${pos.reference.id}`),
    });
  } else if (pos.mode === "between" && pos.lower && pos.upper) {
    comparisonLine = t("comparison.qualitativeBetween", {
      lower: t(`references.${pos.lower.id}`),
      upper: t(`references.${pos.upper.id}`),
    });
  } else if (pos.mode === "smallerThanAll" && pos.reference) {
    comparisonLine = t("comparison.qualitativeSmallerThanAll", {
      reference: t(`references.${pos.reference.id}`),
    });
  } else if (pos.mode === "biggerThanAll" && pos.reference) {
    comparisonLine = t("comparison.qualitativeBiggerThanAll", {
      reference: t(`references.${pos.reference.id}`),
    });
  } else {
    comparisonLine = t("comparison.abstract");
  }

  const near = useMemo(() => nearestStop(meters), [meters]);

  return (
    <main className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("common.tools")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          <span className="bg-aurora-gradient bg-clip-text text-transparent">
            {t("common.scaleTool.title")}
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-cosmos-star/80 sm:text-lg">
          {t("common.scaleTool.tagline")}
        </p>
      </motion.header>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div>
            <label
              htmlFor="scale-input"
              className="block text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55"
            >
              {t("common.scaleTool.inputLabel")}
            </label>
            <input
              id="scale-input"
              type="text"
              inputMode="decimal"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-cosmos-night/40 px-4 py-3 font-mono text-2xl text-cosmos-star focus:border-cosmos-aurora/60 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="scale-unit"
              className="block text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55"
            >
              {t("common.scaleTool.unitLabel")}
            </label>
            <div className="relative mt-2">
              <select
                id="scale-unit"
                value={unitIdx}
                onChange={(e) => setUnitIdx(Number(e.target.value))}
                className="h-[58px] w-full appearance-none rounded-2xl border border-white/10 bg-cosmos-night/40 pl-4 pr-10 font-mono text-base text-cosmos-star focus:border-cosmos-aurora/60 focus:outline-none"
              >
                {UNITS.map((u, i) => (
                  <option key={u.label} value={i}>
                    {u.label}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cosmos-star/55"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
            {t("common.scaleTool.yourValue")}
          </p>
          <p className="mt-2 font-mono text-2xl text-cosmos-star">
            {formatMeters(meters, t)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
            {t("comparison.comparedTo")}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={comparisonLine}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-2 text-base leading-snug text-cosmos-plasma"
            >
              {comparisonLine}
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("common.scaleTool.nearestStop")}
        </p>
        <AnimatePresence mode="wait">
          {near ? (
            <motion.div
              key={near.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mt-3 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <Link
                  href={`/${locale}/stop/${near.id}`}
                  className="font-display text-2xl font-semibold tracking-tight text-cosmos-nova hover:underline"
                >
                  {t(`${near.i18nKey}.name`)}
                </Link>
                <p className="mt-1 text-sm text-cosmos-star/75">
                  {t(`${near.i18nKey}.tagline`)}
                </p>
              </div>
              <span className="font-mono text-sm text-cosmos-plasma">
                {near.sizeMeters !== null
                  ? formatMeters(near.sizeMeters, t)
                  : t("common.abstract")}
              </span>
            </motion.div>
          ) : (
            <motion.p
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm text-cosmos-star/55"
            >
              {t("common.scaleTool.noNearest")}
            </motion.p>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
