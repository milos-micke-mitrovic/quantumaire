"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import type { Stop } from "@/lib/types";

type SizedStop = Stop & { sizeMeters: number };

function isSized(s: Stop): s is SizedStop {
  return typeof s.sizeMeters === "number" && s.sizeMeters > 0;
}

export function BetweenFinder() {
  const { t, locale } = useI18n();
  const { units } = useUnits();
  const aId = useId();
  const bId = useId();

  const sizedSorted = useMemo(
    () => STOPS.filter(isSized).sort((a, b) => a.sizeMeters - b.sizeMeters),
    []
  );

  const [a, setA] = useState<string>(sizedSorted[0]?.id ?? "");
  const [b, setB] = useState<string>(
    sizedSorted[sizedSorted.length - 1]?.id ?? ""
  );

  const between = useMemo(() => {
    const aStop = sizedSorted.find((s) => s.id === a);
    const bStop = sizedSorted.find((s) => s.id === b);
    if (!aStop || !bStop) return [];
    const min = Math.min(aStop.sizeMeters, bStop.sizeMeters);
    const max = Math.max(aStop.sizeMeters, bStop.sizeMeters);
    return sizedSorted.filter((s) => s.sizeMeters >= min && s.sizeMeters <= max);
  }, [a, b, sizedSorted]);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:px-8">
      <header className="mb-6 max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("common.betweenTool.title")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-cosmos-star sm:text-4xl">
          {t("common.betweenTool.title")}
        </h1>
        <p className="mt-3 text-sm text-cosmos-star/70 sm:text-base">
          {t("common.betweenTool.tagline")}
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label htmlFor={aId} className="block">
            <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.betweenTool.from")}
            </span>
            <select
              id={aId}
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-cosmos-deep/70 px-3 py-2.5 text-sm text-cosmos-star focus:border-cosmos-aurora/60 focus:outline-none"
            >
              {sizedSorted.map((s) => (
                <option key={s.id} value={s.id}>
                  {t(`${s.i18nKey}.name`)} — {formatMeters(s.sizeMeters, t, units)}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor={bId} className="block">
            <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {t("common.betweenTool.to")}
            </span>
            <select
              id={bId}
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-cosmos-deep/70 px-3 py-2.5 text-sm text-cosmos-star focus:border-cosmos-aurora/60 focus:outline-none"
            >
              {sizedSorted.map((s) => (
                <option key={s.id} value={s.id}>
                  {t(`${s.i18nKey}.name`)} — {formatMeters(s.sizeMeters, t, units)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-cosmos-star/55">
          {t("common.betweenTool.foundCount", { count: between.length })}
        </p>
      </section>

      <ol className="mt-6 space-y-2">
        {between.map((s) => (
          <li key={s.id}>
            <Link
              href={`/${locale}/stop/${s.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/20"
            >
              <span className="flex flex-col">
                <span className="font-display text-sm text-cosmos-star sm:text-base">
                  {t(`${s.i18nKey}.name`)}
                </span>
                <span className="mt-0.5 text-xs text-cosmos-star/65">
                  {t(`${s.i18nKey}.tagline`)}
                </span>
              </span>
              <span className="shrink-0 whitespace-nowrap font-mono text-xs text-cosmos-plasma sm:text-sm">
                {formatMeters(s.sizeMeters, t, units)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
