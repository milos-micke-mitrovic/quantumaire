"use client";

import Link from "next/link";
import { m as motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import {
  getReference,
  isRoundReference,
  isRoundStop,
  pickReference,
  referenceLabelKey,
  sizeLabelKey,
  type Reference,
} from "@/lib/references";
import { formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import type { Stop } from "@/lib/types";

/**
 * Map of reference ids to the stop id they correspond to. The reference
 * list intentionally includes things like "hair" and "grain of sand" that
 * are not stops, but a few references (Sun, Earth) *are* real stops in
 * the journey. For those we render the reference name as a Link to the
 * matching stop page instead of plain text.
 */
const REFERENCE_TO_STOP_ID: Record<string, string> = {
  sun: "sun",
  earthDiameter: "earth",
  moonDistance: "moon",
  eiffelTower: "eiffel_tower",
  everest: "mount_everest",
};

interface StopComparisonCardProps {
  stop: Stop;
}

const VIEW = 400;
const CENTER = VIEW / 2;
const FRAME_R = VIEW * 0.38;
const MIN_DOT_R = 3;

interface VisualData {
  reference: Reference;
  stopIsBigger: boolean;
  dotR: number;
  /** Smaller size as a fraction of the bigger one (0–1]. */
  fraction: number;
  /** Circles only when both objects are round; otherwise length bars. */
  shape: "circles" | "bars";
}

const BAR_X = 12;
const BAR_W = VIEW - BAR_X * 2;
const BAR_H = 34;

function computeVisual(stop: Stop): VisualData | null {
  if (stop.sizeMeters === null || stop.sizeMeters <= 0) return null;
  const reference =
    (stop.preferredReferenceId && getReference(stop.preferredReferenceId)) ||
    pickReference(stop.sizeMeters, "size", { excludeNearSelf: true });
  if (!reference) return null;
  const stopSize = stop.sizeMeters;
  const refSize = reference.meters;
  const stopIsBigger = stopSize >= refSize;
  const ratio = Math.max(stopSize, refSize) / Math.min(stopSize, refSize);
  const sameSize = Math.abs(ratio - 1) < 0.001;
  const trueDotR = FRAME_R / ratio;
  const isToScale = trueDotR >= MIN_DOT_R;
  if (sameSize || !isToScale) return null;
  return {
    reference,
    stopIsBigger,
    dotR: Math.max(MIN_DOT_R, trueDotR),
    fraction: 1 / ratio,
    shape: isRoundStop(stop) && isRoundReference(reference.id) ? "circles" : "bars",
  };
}

/**
 * Visual comparison card: a true-scale drawing (circles for round things,
 * length bars for everything else) pairing the stop against
 * the nearest meaningful *size* reference. Renders nothing when the stop
 * has no measurable size, or when the ratio is too extreme to draw
 * honestly (a quark next to a galaxy would just be one circle).
 */
export function StopComparisonCard({ stop }: StopComparisonCardProps) {
  const { t, locale } = useI18n();
  const { units } = useUnits();
  const visual = computeVisual(stop);
  if (!visual) return null;

  const stopName = t(`${stop.i18nKey}.name`);
  const refName = t(`referenceLabels.${visual.reference.id}`);
  const refStopId = REFERENCE_TO_STOP_ID[visual.reference.id];
  const refStopHref = refStopId ? `/${locale}/stop/${refStopId}` : null;
  const dotCx = CENTER;
  const dotCy = CENTER - FRAME_R * 0.5;

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
      aria-label={`${stopName} vs ${refName}`}
      className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 px-5 py-3 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-cosmos-star/65">
          {stopName} <span aria-hidden>—</span> {refNameNode}
        </p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("common.comparePage.drawnToScale")}
        </p>
      </header>

      <div className="flex flex-col items-center gap-6 px-5 py-6 sm:flex-row sm:items-center sm:gap-8 sm:px-8">
        <div
          className={`w-full shrink-0 ${visual.shape === "circles" ? "max-w-[220px]" : "max-w-[300px]"}`}
        >
          {visual.shape === "circles" ? (
            <svg
              viewBox={`0 0 ${VIEW} ${VIEW}`}
              className="block h-auto w-full"
              role="img"
              aria-label={`${stopName} vs ${refName}`}
            >
              <defs>
                <radialGradient
                  id={`compare-frame-${stop.id}`}
                  cx="50%"
                  cy="38%"
                  r="65%"
                >
                  <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#1a1245" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#03030a" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              <motion.circle
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: FRAME_R, opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                cx={CENTER}
                cy={CENTER}
                fill={`url(#compare-frame-${stop.id})`}
                stroke="rgba(124,92,255,0.55)"
                strokeWidth="2.5"
              />
              <motion.circle
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: visual.dotR, opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
                cx={dotCx}
                cy={dotCy}
                fill="#f0abfc"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth={Math.max(0.8, visual.dotR * 0.06)}
              />
            </svg>
          ) : (
            // Lengths, not shapes: two bars from a common start line, the
            // longer one full width, the shorter one to true scale.
            <svg
              viewBox={`0 0 ${VIEW} 200`}
              className="block h-auto w-full"
              role="img"
              aria-label={`${stopName} vs ${refName}`}
            >
              <line
                x1={BAR_X}
                x2={BAR_X}
                y1={30}
                y2={170}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2"
              />
              <motion.rect
                initial={{ width: 0 }}
                animate={{ width: BAR_W }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                x={BAR_X}
                y={50}
                height={BAR_H}
                rx={6}
                fill="rgba(124,92,255,0.45)"
                stroke="rgba(124,92,255,0.8)"
                strokeWidth="2"
              />
              <motion.rect
                initial={{ width: 0 }}
                animate={{ width: Math.max(MIN_DOT_R, BAR_W * visual.fraction) }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
                x={BAR_X}
                y={116}
                height={BAR_H}
                rx={Math.min(6, (BAR_W * visual.fraction) / 2)}
                fill="#f0abfc"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </div>

        <ul className="grid w-full gap-4 text-sm">
          <li className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-cosmos-aurora ring-2 ring-cosmos-aurora/30"
            />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-sm text-cosmos-star sm:text-base">
                {visual.stopIsBigger ? stopName : refNameNode}
              </span>
              <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.22em] text-cosmos-star/50">
                {t(visual.stopIsBigger ? sizeLabelKey(stop) : referenceLabelKey(visual.reference))}
              </span>
              <span className="mt-0.5 block whitespace-nowrap font-mono text-[11px] text-cosmos-plasma sm:text-xs">
                {formatMeters(
                  visual.stopIsBigger
                    ? stop.sizeMeters!
                    : visual.reference.meters,
                  t,
                  units
                )}
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-cosmos-nova ring-2 ring-cosmos-nova/30"
            />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-sm text-cosmos-star sm:text-base">
                {visual.stopIsBigger ? refNameNode : stopName}
              </span>
              <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.22em] text-cosmos-star/50">
                {t(visual.stopIsBigger ? referenceLabelKey(visual.reference) : sizeLabelKey(stop))}
              </span>
              <span className="mt-0.5 block whitespace-nowrap font-mono text-[11px] text-cosmos-plasma sm:text-xs">
                {formatMeters(
                  visual.stopIsBigger
                    ? visual.reference.meters
                    : stop.sizeMeters!,
                  t,
                  units
                )}
              </span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
