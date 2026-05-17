"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import {
  formatFactor,
  pickReference,
  type Reference,
} from "@/lib/references";
import { formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import type { Stop } from "@/lib/types";

interface StopDistanceCardProps {
  stop: Stop;
}

/** Distance references that correspond to a real journey stop. */
const REFERENCE_TO_STOP_ID: Record<string, string> = {
  moonDistance: "moon",
  au: "sun",
};

interface DistanceVisual {
  reference: Reference;
  ratio: number;
  stopFarther: boolean;
}

function computeDistance(stop: Stop): DistanceVisual | null {
  if (
    typeof stop.distanceFromEarthMeters !== "number" ||
    stop.distanceFromEarthMeters <= 0
  ) {
    return null;
  }
  const distance = stop.distanceFromEarthMeters;
  const reference = pickReference(distance, "distance", {
    excludeNearSelf: true,
  });
  if (!reference) return null;
  if (Math.abs(Math.log10(distance) - Math.log10(reference.meters)) < 0.05) {
    return null;
  }
  const stopFarther = distance > reference.meters;
  const ratio = stopFarther
    ? distance / reference.meters
    : reference.meters / distance;
  return { reference, ratio, stopFarther };
}

/**
 * Distance-comparison card. Two stat blocks side by side (reference and
 * current stop) with the ratio in the middle as the visual hook.
 *
 * No log axis bar — that misled the eye, because at log scale the
 * reference appears almost at the stop's position even when the ratio is
 * 5× or 10×. A clear ratio in big type, with the two named distances
 * flanking it, conveys the comparison honestly at any scale.
 */
export function StopDistanceCard({ stop }: StopDistanceCardProps) {
  const { t, locale } = useI18n();
  const { units } = useUnits();
  const visual = computeDistance(stop);
  if (!visual) return null;

  const stopName = t(`${stop.i18nKey}.name`);
  const refName = t(`referenceLabels.${visual.reference.id}`);
  const refStopId = REFERENCE_TO_STOP_ID[visual.reference.id];
  const refStopHref = refStopId ? `/${locale}/stop/${refStopId}` : null;
  const ratioFactor = formatFactor(visual.ratio, t);
  const ratioLabelKey = visual.stopFarther
    ? "common.distanceCompare.fartherLabel"
    : "common.distanceCompare.closerLabel";
  const sentenceKey = visual.stopFarther
    ? "common.distanceCompare.farther"
    : "common.distanceCompare.closer";

  const refNameNode = refStopHref ? (
    <Link
      href={refStopHref}
      className="text-cosmos-star underline decoration-cosmos-aurora/40 decoration-dotted underline-offset-4 transition-colors hover:text-cosmos-aurora focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60 rounded-sm"
    >
      {refName}
    </Link>
  ) : (
    refName
  );

  return (
    <section
      aria-label={`${stopName} distance vs ${refName}`}
      className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
    >
      <header className="border-b border-white/10 px-5 py-3 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-cosmos-star/65">
          {stopName} <span aria-hidden>—</span> {refNameNode}{" "}
          <span className="text-cosmos-star/40">
            <span aria-hidden>·</span> {t("common.distanceFromEarth")}
          </span>
        </p>
      </header>

      <div className="grid items-center gap-6 px-5 py-7 sm:grid-cols-[1fr_auto_1fr] sm:gap-8 sm:px-8">
        {/* Reference */}
        <div className="text-center sm:text-right">
          <div className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-cosmos-aurora ring-2 ring-cosmos-aurora/30"
            />
            <span className="font-display text-base text-cosmos-star sm:text-lg">
              {refNameNode}
            </span>
          </div>
          <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.22em] text-cosmos-star/50">
            {t("common.distanceFromEarth")}
          </p>
          <p className="mt-1 whitespace-nowrap font-mono text-sm text-cosmos-plasma sm:text-[15px]">
            {formatMeters(visual.reference.meters, t, units)}
          </p>
        </div>

        {/* Ratio (the actual visual hook) */}
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-4xl font-semibold text-cosmos-nova sm:text-5xl">
            {ratioFactor}
            <span className="text-cosmos-star/60">×</span>
          </p>
          <p className="mt-1 max-w-[10rem] text-[10px] font-medium uppercase tracking-[0.18em] text-cosmos-star/55">
            {t(ratioLabelKey)}
          </p>
        </div>

        {/* Current stop */}
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-cosmos-nova ring-2 ring-cosmos-nova/30"
            />
            <span className="font-display text-base text-cosmos-star sm:text-lg">
              {stopName}
            </span>
          </div>
          <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.22em] text-cosmos-star/50">
            {t("common.distanceFromEarth")}
          </p>
          <p className="mt-1 whitespace-nowrap font-mono text-sm text-cosmos-plasma sm:text-[15px]">
            {formatMeters(stop.distanceFromEarthMeters!, t, units)}
          </p>
        </div>
      </div>

      <p className="border-t border-white/10 px-5 py-4 text-center text-sm leading-relaxed text-cosmos-star/80 sm:px-8">
        {t(sentenceKey, {
          stop: stopName,
          factor: ratioFactor,
          reference: refName,
        })}
      </p>
    </section>
  );
}
