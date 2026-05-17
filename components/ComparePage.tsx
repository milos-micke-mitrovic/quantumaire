"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { STOPS, getStop } from "@/lib/content";
import { formatMeters, formatTemperature } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import { formatFactor } from "@/lib/references";
import type { Stop } from "@/lib/types";
import { Badge } from "./Badge";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { ScaleVisual } from "./ScaleVisual";

type Mode = "size" | "distance" | "temperature";
const MODES: readonly Mode[] = ["size", "distance", "temperature"] as const;

function isMode(value: string | null): value is Mode {
  return value === "size" || value === "distance" || value === "temperature";
}

function valueOf(stop: Stop, mode: Mode): number | null {
  if (mode === "size") return stop.sizeMeters;
  if (mode === "distance") return stop.distanceFromEarthMeters ?? null;
  return stop.temperatureKelvin ?? null;
}

function eligibleStops(mode: Mode): Stop[] {
  return STOPS.filter((s) => {
    const v = valueOf(s, mode);
    return v !== null && v !== undefined && Number.isFinite(v) && v > 0;
  });
}

const DEFAULTS: Record<Mode, [string, string]> = {
  size: ["quark", "earth"],
  distance: ["moon", "sun"],
  temperature: ["earth", "sun"],
};

interface PickerProps {
  label: string;
  selectedId: string;
  mode: Mode;
  onChange: (id: string) => void;
}

function StopPicker({ label, selectedId, mode, onChange }: PickerProps) {
  const { t } = useI18n();
  const { units } = useUnits();
  const stops = useMemo(() => eligibleStops(mode), [mode]);
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
          {stops.map((s) => {
            const v = valueOf(s, mode)!;
            const valueText =
              mode === "temperature"
                ? formatTemperature(v)
                : formatMeters(v, t, units);
            return (
              <option key={s.id} value={s.id}>
                {t(`${s.i18nKey}.name`)} · {valueText}
              </option>
            );
          })}
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
  mode: Mode;
}

function CompareCard({ stop, label, mode }: CompareCardProps) {
  const { t, locale } = useI18n();
  const { units } = useUnits();
  const v = valueOf(stop, mode);
  const valueText =
    v === null
      ? t("common.abstract")
      : mode === "temperature"
        ? formatTemperature(v)
        : formatMeters(v, t, units);
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
        <span>{valueText}</span>
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

const RATIO_LINE_KEYS: Record<
  Mode,
  { bigger: string; smaller: string; same: string }
> = {
  size: {
    bigger: "common.comparePage.timesAsBig",
    smaller: "common.comparePage.timesSmaller",
    same: "common.comparePage.same",
  },
  distance: {
    bigger: "common.comparePage.timesAsFar",
    smaller: "common.comparePage.timesCloser",
    same: "common.comparePage.sameDistance",
  },
  temperature: {
    bigger: "common.comparePage.timesHotter",
    smaller: "common.comparePage.timesColder",
    same: "common.comparePage.sameTemperature",
  },
};

export function ComparePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();

  const modeParam = params.get("mode");
  const mode: Mode = isMode(modeParam) ? modeParam : "size";
  const [defaultA, defaultB] = DEFAULTS[mode];

  // If the stop chosen for the current mode lacks the relevant data, fall
  // back to the mode's default rather than render a broken comparison.
  const requestedA = params.get("a") ?? defaultA;
  const requestedB = params.get("b") ?? defaultB;
  const a = useMemo(() => {
    const s = getStop(requestedA);
    if (s && valueOf(s, mode) !== null) return s;
    return getStop(defaultA)!;
  }, [requestedA, mode, defaultA]);
  const b = useMemo(() => {
    const s = getStop(requestedB);
    if (s && valueOf(s, mode) !== null) return s;
    return getStop(defaultB)!;
  }, [requestedB, mode, defaultB]);

  const setPair = useCallback(
    (nextA: string, nextB: string, nextMode: Mode = mode) => {
      const sp = new URLSearchParams();
      sp.set("a", nextA);
      sp.set("b", nextB);
      sp.set("mode", nextMode);
      router.replace(`?${sp.toString()}`, { scroll: false });
    },
    [router, mode]
  );

  const swap = useCallback(() => setPair(b.id, a.id), [a.id, b.id, setPair]);

  const onModeChange = useCallback(
    (nextMode: Mode) => {
      // Try to keep the current pair if both still have data; otherwise
      // fall back to that mode's defaults.
      const aOK =
        valueOf(a, nextMode) !== null && valueOf(a, nextMode) !== undefined;
      const bOK =
        valueOf(b, nextMode) !== null && valueOf(b, nextMode) !== undefined;
      const [da, db] = DEFAULTS[nextMode];
      setPair(aOK ? a.id : da, bOK ? b.id : db, nextMode);
    },
    [a, b, setPair]
  );

  const aValue = valueOf(a, mode);
  const bValue = valueOf(b, mode);

  const aName = t(`${a.i18nKey}.name`);
  const bName = t(`${b.i18nKey}.name`);

  const ratioKeys = RATIO_LINE_KEYS[mode];
  let ratioLine: string;
  let ratioBig: string;
  if (aValue === null || bValue === null) {
    ratioLine = t("common.comparePage.noData");
    ratioBig = "—";
  } else {
    const ratio = bValue / aValue;
    if (Math.abs(ratio - 1) < 0.001) {
      ratioLine = t(ratioKeys.same, { a: aName, b: bName });
      ratioBig = "1×";
    } else if (ratio >= 1) {
      ratioBig = `${formatFactor(ratio, t)}×`;
      ratioLine = t(ratioKeys.bigger, {
        a: aName,
        b: bName,
        factor: formatFactor(ratio, t),
      });
    } else {
      ratioBig = `${formatFactor(1 / ratio, t)}×`;
      ratioLine = t(ratioKeys.smaller, {
        a: aName,
        b: bName,
        factor: formatFactor(1 / ratio, t),
      });
    }
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
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-cosmos-star/70">
          {t("common.comparePage.intro")}
        </p>
      </motion.header>

      {/* Mode selector — Size / Distance / Temperature. */}
      <section className="mt-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("common.comparePage.modeLabel")}
        </p>
        <div
          role="group"
          aria-label={t("common.comparePage.modeLabel")}
          className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1"
        >
          {MODES.map((m) => {
            const active = m === mode;
            const labelKey =
              m === "size"
                ? "common.comparePage.modeSize"
                : m === "distance"
                  ? "common.comparePage.modeDistance"
                  : "common.comparePage.modeTemperature";
            return (
              <button
                key={m}
                type="button"
                aria-pressed={active}
                onClick={() => onModeChange(m)}
                className={clsx(
                  "rounded-full px-3 py-1 text-xs font-medium tracking-wider transition-colors",
                  active
                    ? "bg-aurora-gradient text-cosmos-void shadow-glow"
                    : "text-cosmos-star/70 hover:text-cosmos-star"
                )}
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <StopPicker
          label={t("common.comparePage.chooseA")}
          selectedId={a.id}
          mode={mode}
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
          mode={mode}
          onChange={(id) => setPair(a.id, id)}
        />
      </section>

      {/* Visual only makes sense when both sides have a size — i.e. in size mode. */}
      {mode === "size" && <ScaleVisual a={a} b={b} />}

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

      {/* Stop cards — supporting context. */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <CompareCard stop={a} label={t("common.comparePage.openStopA")} mode={mode} />
        <CompareCard stop={b} label={t("common.comparePage.openStopB")} mode={mode} />
      </section>
    </main>
  );
}
