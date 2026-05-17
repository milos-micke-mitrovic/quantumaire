"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getReference, pickReference } from "@/lib/references";
import { formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import type { Stop } from "@/lib/types";

interface StopScaleVsReferenceProps {
  stop: Stop;
}

const VIEW = 400;
const CENTER = VIEW / 2;
const FRAME_R = VIEW * 0.38; // 152
const MIN_DOT_R = 3;

/**
 * Compact, real-scale circle comparison between the current stop and the
 * closest everyday reference object (hair, grain of sand, person, etc).
 *
 * The bigger of the two becomes the aurora frame; the smaller becomes a
 * nova dot drawn at its true proportional radius — clamped to a visible
 * minimum and labelled "not to scale" when the ratio is too extreme.
 *
 * Returns null for abstract stops (no measurable size).
 */
export function StopScaleVsReference({ stop }: StopScaleVsReferenceProps) {
  const { t } = useI18n();
  const { units } = useUnits();
  if (stop.sizeMeters === null || stop.sizeMeters <= 0) return null;

  // Honour the stop's explicit reference choice when set, otherwise
  // auto-pick the closest reference by log size.
  const reference =
    (stop.preferredReferenceId && getReference(stop.preferredReferenceId)) ||
    pickReference(stop.sizeMeters);
  const stopName = t(`${stop.i18nKey}.name`);
  const refName = t(`references.${reference.id}`);

  const stopSize = stop.sizeMeters;
  const refSize = reference.meters;
  const stopIsBigger = stopSize >= refSize;
  const ratio = Math.max(stopSize, refSize) / Math.min(stopSize, refSize);
  const sameSize = Math.abs(ratio - 1) < 0.001;

  // True-scale radius for the smaller item.
  const trueDotR = FRAME_R / ratio;
  const isToScale = trueDotR >= MIN_DOT_R;

  // If we can't draw this honestly, don't draw it at all — the narrative
  // beneath already conveys the scale. Skip the whole panel.
  if (!isToScale) return null;

  // If the auto-picked reference is essentially the same size as the stop
  // itself (e.g. the Sun stop vs the "sun" reference, or the Earth stop vs
  // the "earthDiameter" reference) the panel would show the same name and
  // number twice. Skip it — the data is true, but the comparison is empty.
  if (sameSize) return null;

  const dotR = Math.max(MIN_DOT_R, trueDotR);

  // Dot sits inside the frame at top-centre, separated from the rim.
  const dotCx = CENTER;
  const dotCy = CENTER - FRAME_R * 0.5;

  return (
    <section
      className="mt-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4 sm:px-5"
      aria-label={`${stopName} vs ${refName}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("comparison.realScale")}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/45">
          {t("common.comparePage.drawnToScale")}
        </p>
      </div>

      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="w-full max-w-[180px] shrink-0">
          <svg
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className="block h-auto w-full"
            role="img"
            aria-label={`${stopName} compared to ${refName}`}
          >
            <defs>
              <radialGradient id={`frame-grad-${stop.id}`} cx="50%" cy="38%" r="65%">
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
              fill={`url(#frame-grad-${stop.id})`}
              stroke="rgba(124,92,255,0.55)"
              strokeWidth="2.5"
            />
            {!sameSize && (
              <motion.circle
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: dotR, opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
                cx={dotCx}
                cy={dotCy}
                fill="#f0abfc"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth={Math.max(0.8, dotR * 0.06)}
              />
            )}
          </svg>
        </div>

        <ul className="grid w-full gap-2 text-sm sm:gap-2.5">
          <li className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-cosmos-aurora ring-2 ring-cosmos-aurora/30"
            />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-sm text-cosmos-star">
                {stopIsBigger ? stopName : refName}
              </span>
              <span className="block font-mono text-[11px] text-cosmos-plasma">
                {formatMeters(stopIsBigger ? stopSize : refSize, t, units)}
              </span>
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-cosmos-nova ring-2 ring-cosmos-nova/30"
            />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-sm text-cosmos-star">
                {stopIsBigger ? refName : stopName}
              </span>
              <span className="block font-mono text-[11px] text-cosmos-plasma">
                {formatMeters(stopIsBigger ? refSize : stopSize, t, units)}
              </span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
