"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { STOPS, getStop } from "@/lib/content";
import { formatMeters } from "@/lib/scale";
import { formatFactor } from "@/lib/references";
import type { Stop } from "@/lib/types";
import { Badge } from "./Badge";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { ScaleVisual } from "./ScaleVisual";

const DEFAULT_A = "quark";
const DEFAULT_B = "earth";

interface PickerProps {
  label: string;
  selectedId: string;
  onChange: (id: string) => void;
}

// Only stops with a concrete size can be visually compared. Abstract stops
// (DID, dark matter, dark energy) are excluded from the pickers.
const COMPARABLE_STOPS = STOPS.filter(
  (s) => s.sizeMeters !== null && s.sizeMeters > 0
);

function StopPicker({ label, selectedId, onChange }: PickerProps) {
  const { t } = useI18n();
  return (
    <label className="block">
      <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
        {label}
      </span>
      <div className="relative mt-2">
        <select
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-cosmos-night/40 py-3 pl-4 pr-10 text-base text-cosmos-star focus:border-cosmos-aurora/60 focus:outline-none"
        >
          {COMPARABLE_STOPS.map((s) => (
            <option key={s.id} value={s.id}>
              {t(`${s.i18nKey}.name`)}
              {s.sizeMeters !== null ? ` · ${formatMeters(s.sizeMeters, t)}` : ""}
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
    </label>
  );
}

interface CompareCardProps {
  stop: Stop;
  label: string;
}

function CompareCard({ stop, label }: CompareCardProps) {
  const { t, locale } = useI18n();
  return (
    <Link
      href={`/${locale}/stop/${stop.id}`}
      aria-label={`${label} — ${t(`${stop.i18nKey}.name`)}`}
      className={clsx(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10",
        "bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-5",
        "transition-colors hover:border-white/20"
      )}
    >
      <ImagePlaceholder image={stop.image} className="mb-4" />
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-cosmos-star/55">
        <span>{label}</span>
        <span>
          {stop.sizeMeters !== null
            ? formatMeters(stop.sizeMeters, t)
            : t("common.abstract")}
        </span>
      </div>
      <h3
        className={clsx(
          "mt-3 font-display text-xl font-semibold tracking-tight sm:text-2xl",
          stop.accent
        )}
      >
        {t(`${stop.i18nKey}.name`)}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-cosmos-star/70">
        {t(`${stop.i18nKey}.tagline`)}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <Badge type={stop.badge} withTooltip={false} />
        <span className="text-[11px] uppercase tracking-[0.18em] text-cosmos-star/55">
          {t(`categories.${stop.category}`)}
        </span>
      </div>
    </Link>
  );
}

export function ComparePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();

  const aId = params.get("a") ?? DEFAULT_A;
  const bId = params.get("b") ?? DEFAULT_B;

  const a = useMemo(() => getStop(aId) ?? getStop(DEFAULT_A)!, [aId]);
  const b = useMemo(() => getStop(bId) ?? getStop(DEFAULT_B)!, [bId]);

  const setPair = useCallback(
    (nextA: string, nextB: string) => {
      const sp = new URLSearchParams();
      sp.set("a", nextA);
      sp.set("b", nextB);
      router.replace(`?${sp.toString()}`, { scroll: false });
    },
    [router]
  );

  const swap = useCallback(() => setPair(b.id, a.id), [a.id, b.id, setPair]);

  // Compute ratio b/a — null if either side is abstract or zero.
  const ratio = (() => {
    if (a.sizeMeters === null || b.sizeMeters === null) return null;
    if (a.sizeMeters === 0 || b.sizeMeters === 0) return null;
    return b.sizeMeters / a.sizeMeters;
  })();

  const aName = t(`${a.i18nKey}.name`);
  const bName = t(`${b.i18nKey}.name`);

  let ratioLine: string;
  let ratioBig: string;
  if (a.sizeMeters === null && b.sizeMeters === null) {
    ratioLine = t("common.comparePage.bothAbstract");
    ratioBig = "—";
  } else if (a.sizeMeters === null || b.sizeMeters === null) {
    ratioLine = t("common.comparePage.oneAbstract");
    ratioBig = "—";
  } else if (ratio === null || Math.abs(ratio - 1) < 0.001) {
    ratioLine = t("common.comparePage.same", { a: aName, b: bName });
    ratioBig = "1×";
  } else if (ratio >= 1) {
    ratioBig = `${formatFactor(ratio, t)}×`;
    ratioLine = t("common.comparePage.timesAsBig", {
      a: aName,
      b: bName,
      factor: formatFactor(ratio, t),
    });
  } else {
    ratioBig = `${formatFactor(1 / ratio, t)}×`;
    ratioLine = t("common.comparePage.timesSmaller", {
      a: aName,
      b: bName,
      factor: formatFactor(1 / ratio, t),
    });
  }

  return (
    <main className="relative mx-auto w-full max-w-5xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("common.compare")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          <span className="bg-aurora-gradient bg-clip-text text-transparent">
            {t("common.comparePage.title")}
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-cosmos-star/80 sm:text-lg">
          {t("common.comparePage.tagline")}
        </p>
      </motion.header>

      <section className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <StopPicker
          label={t("common.comparePage.chooseA")}
          selectedId={a.id}
          onChange={(id) => setPair(id, b.id)}
        />
        <div className="flex items-end justify-center sm:items-center">
          <button
            type="button"
            onClick={swap}
            aria-label={t("common.comparePage.swap")}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-cosmos-star transition-colors hover:bg-white/[0.1]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M7 16V4M7 4l-3 3M7 4l3 3" />
              <path d="M17 8v12M17 20l-3-3M17 20l3-3" />
            </svg>
          </button>
        </div>
        <StopPicker
          label={t("common.comparePage.chooseB")}
          selectedId={b.id}
          onChange={(id) => setPair(a.id, id)}
        />
      </section>

      <ScaleVisual a={a} b={b} />

      {/* Narrative (imaginary visualisation) — speaks plainly, no big number. */}
      <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-cosmos-star/85 sm:text-lg">
        {ratioLine}
      </p>

      {/* Exact number sits below, as supporting data. */}
      {ratioBig !== "—" && (
        <p className="mt-2 text-center text-[11px] font-mono uppercase tracking-[0.22em] text-cosmos-star/45">
          {t("common.comparePage.ratio")} · {ratioBig}
        </p>
      )}

      {/* Stop cards — supporting context, no centre column. */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <CompareCard stop={a} label={t("common.comparePage.openStopA")} />
        <CompareCard stop={b} label={t("common.comparePage.openStopB")} />
      </section>
    </main>
  );
}
