"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { describePosition, formatFactor } from "@/lib/references";
import { formatLightTime, numberLocale } from "@/lib/scale";
import { StopCombobox } from "./StopCombobox";
import { SIZED_STOPS } from "@/lib/content";

interface Unit {
  id: string;
  symbol: string;
  meters: number;
}

/** Input units, small to large. Names/descriptions live in i18n. */
const UNITS: Unit[] = [
  { id: "fm", symbol: "fm", meters: 1e-15 },
  { id: "nm", symbol: "nm", meters: 1e-9 },
  { id: "um", symbol: "µm", meters: 1e-6 },
  { id: "mm", symbol: "mm", meters: 1e-3 },
  { id: "cm", symbol: "cm", meters: 1e-2 },
  { id: "m", symbol: "m", meters: 1 },
  { id: "km", symbol: "km", meters: 1e3 },
  { id: "mi", symbol: "mi", meters: 1609.344 },
  { id: "au", symbol: "AU", meters: 1.495978707e11 },
  { id: "ly", symbol: "ly", meters: 9.4607304725808e15 },
  { id: "pc", symbol: "pc", meters: 3.085677581491367e16 },
  { id: "mpc", symbol: "Mpc", meters: 3.085677581491367e22 },
];

/** The rows of the "same length in every unit" table. */
const OUTPUT_IDS = ["m", "km", "mi", "au", "ly", "pc"];

/** One-tap examples. */
const PRESETS: Array<{ id: string; value: string; unit: string }> = [
  { id: "au", value: "1", unit: "au" },
  { id: "ly", value: "1", unit: "ly" },
  { id: "pc", value: "1", unit: "pc" },
  { id: "moon", value: "384400", unit: "km" },
  { id: "proxima", value: "4.24", unit: "ly" },
  { id: "marathon", value: "42.195", unit: "km" },
];

const SUP = "⁻⁰¹²³⁴⁵⁶⁷⁸⁹";
const PLAIN = "-0123456789";

/** Readable number: grouped digits in a sane range, else a × 10ⁿ. */
function fmtNum(n: number, loc: string): string {
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e-3 && abs < 1e12) {
    return n.toLocaleString(loc, { maximumSignificantDigits: 4 });
  }
  const exp = Math.floor(Math.log10(abs));
  const mant = n / 10 ** exp;
  const sup = String(exp)
    .split("")
    .map((c) => SUP[PLAIN.indexOf(c)])
    .join("");
  return `${mant.toLocaleString(loc, { maximumSignificantDigits: 3 })} × 10${sup}`;
}

const sizedStops = () => SIZED_STOPS;

export function ScaleCalculator() {
  const { t, locale } = useI18n();
  const loc = numberLocale(t);
  const [raw, setRaw] = useState("1");
  const [unitId, setUnitId] = useState("au");

  const unit = UNITS.find((u) => u.id === unitId) ?? UNITS[5];
  const value = Number(raw.replace(/\s/g, "").replace(",", "."));
  const meters = Number.isFinite(value) && value > 0 ? value * unit.meters : 0;

  const unitOptions = UNITS.map((u) => ({
    id: u.id,
    name: `${u.symbol} — ${t(`common.converter.units.${u.id}.name`)}`,
    detail: t(`common.converter.units.${u.id}.hint`),
  }));

  // Plain-language comparison against the reference list.
  const pos = meters > 0 ? describePosition(meters) : null;
  let comparison: string | null = null;
  if (pos?.mode === "aboutThe" && pos.reference) {
    comparison = t("comparison.aboutThe", { reference: t(`references.${pos.reference.id}`) });
  } else if (pos?.mode === "between" && pos.lower && pos.upper) {
    comparison = t("comparison.qualitativeBetween", {
      lower: t(`references.${pos.lower.id}`),
      upper: t(`references.${pos.upper.id}`),
    });
  } else if (pos?.mode === "smallerThanAll" && pos.reference) {
    comparison = t("comparison.qualitativeSmallerThanAll", {
      reference: t(`references.${pos.reference.id}`),
    });
  } else if (pos?.mode === "biggerThanAll" && pos.reference) {
    comparison = t("comparison.qualitativeBiggerThanAll", {
      reference: t(`references.${pos.reference.id}`),
    });
  }

  // Nearest topics on either side.
  const { smaller, bigger } = useMemo(() => {
    if (!meters) return { smaller: null, bigger: null };
    const list = sizedStops();
    let smaller: (typeof list)[number] | null = null;
    let bigger: (typeof list)[number] | null = null;
    for (const s of list) {
      if (s.sizeMeters <= meters) smaller = s;
      else {
        bigger = s;
        break;
      }
    }
    return { smaller, bigger };
  }, [meters]);

  const lightTime = meters ? formatLightTime(meters, t) : null;

  return (
    <main className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <header>
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {t("common.tools")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-cosmos-star sm:text-5xl">
          {t("common.converter.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-cosmos-star/75 sm:text-lg">
          {t("common.converter.tagline")}
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <label
              htmlFor="conv-input"
              className="block text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55"
            >
              {t("common.converter.amount")}
            </label>
            <input
              id="conv-input"
              type="text"
              inputMode="decimal"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-cosmos-night/40 px-4 py-3 font-mono text-xl text-cosmos-star focus:border-cosmos-aurora/60 focus:outline-none focus:ring-2 focus:ring-cosmos-aurora/40"
            />
          </div>
          <StopCombobox
            label={t("common.converter.unit")}
            options={unitOptions}
            value={unitId}
            onChange={setUnitId}
            showSelectedDetail={false}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setRaw(p.value);
                setUnitId(p.unit);
              }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-cosmos-star/75 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
            >
              {t(`common.converter.presets.${p.id}`)}
            </button>
          ))}
        </div>
      </section>

      {meters > 0 ? (
        <>
          <section
            aria-label={t("common.converter.allUnits")}
            className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7"
          >
            <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.converter.allUnits")}
            </h2>
            <dl className="mt-3 grid gap-x-6 sm:grid-cols-2">
              {OUTPUT_IDS.map((id) => {
                const u = UNITS.find((x) => x.id === id)!;
                return (
                  <div
                    key={id}
                    className="flex items-baseline justify-between gap-3 border-b border-white/5 py-2.5"
                  >
                    <dt className="text-sm text-cosmos-star/65">
                      {t(`common.converter.units.${id}.name`)}
                    </dt>
                    <dd className="text-right font-mono text-sm text-cosmos-plasma">
                      {fmtNum(meters / u.meters, loc)} {u.symbol}
                    </dd>
                  </div>
                );
              })}
              {lightTime && (
                <div className="flex items-baseline justify-between gap-3 border-b border-white/5 py-2.5 sm:col-span-2">
                  <dt className="text-sm text-cosmos-star/65">
                    {t("common.converter.lightTime")}
                  </dt>
                  <dd className="text-right font-mono text-sm text-cosmos-nova">{lightTime}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="mt-5 grid gap-4 sm:grid-cols-2">
            {comparison && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:col-span-2 sm:p-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
                  {t("common.converter.comparedTo")}
                </p>
                <p className="mt-2 text-lg text-cosmos-star">{comparison}</p>
              </div>
            )}
            {[smaller, bigger].map((s, i) =>
              s ? (
                <Link
                  key={s.id}
                  href={`/${locale}/stop/${s.id}`}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 sm:p-6"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
                    {t(i === 0 ? "common.converter.nextSmaller" : "common.converter.nextBigger")}
                  </p>
                  <p className="mt-2 font-display text-xl text-cosmos-star group-hover:text-cosmos-plasma">
                    {t(`${s.i18nKey}.name`)}
                  </p>
                  <p className="mt-1 text-sm text-cosmos-star/60">
                    {i === 0
                      ? t("common.converter.timesBigger", {
                          factor: formatFactor(meters / s.sizeMeters, t),
                        })
                      : t("common.converter.timesSmaller", {
                          factor: formatFactor(s.sizeMeters / meters, t),
                        })}
                  </p>
                </Link>
              ) : null
            )}
          </section>
        </>
      ) : (
        <p className="mt-6 text-center text-sm text-cosmos-star/55">
          {t("common.converter.enterValue")}
        </p>
      )}
    </main>
  );
}
