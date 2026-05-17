"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { formatMeters } from "@/lib/scale";
import { useUnits } from "@/lib/units";
import type { Stop } from "@/lib/types";

interface ScaleVisualProps {
  a: Stop;
  b: Stop;
}

const VIEW = 600;
const CENTER = VIEW / 2;
const BIGGER_R = VIEW * 0.36; // 216
const MIN_SMALLER_R = 3.5; // never disappear

/**
 * True-proportional size comparison between two stops.
 *
 * The bigger stop renders as a glowing aurora frame; the smaller one as a
 * nova dot positioned inside, at the radius the proportion demands. When
 * the smaller circle would be smaller than `MIN_SMALLER_R` pixels we clamp
 * to the minimum and surface "not to scale" so the visual is never
 * misleading.
 *
 * If either side is abstract (no meters), we render a polite note instead.
 */
export function ScaleVisual({ a, b }: ScaleVisualProps) {
  const { t } = useI18n();
  const { units } = useUnits();

  if (a.sizeMeters === null || b.sizeMeters === null) {
    return (
      <section className="mt-10 rounded-3xl border border-white/10 bg-cosmos-deep/55 px-4 py-6 sm:px-8 sm:py-7">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("common.comparePage.visualHeading")}
        </h2>
        <p className="mt-3 text-sm text-cosmos-star/65">
          {t("common.comparePage.needsBothSized")}
        </p>
      </section>
    );
  }

  const aSize = a.sizeMeters;
  const bSize = b.sizeMeters;
  const ratio = Math.max(aSize, bSize) / Math.min(aSize, bSize);
  const bigger = aSize >= bSize ? a : b;
  const smaller = aSize >= bSize ? b : a;
  const biggerSide: "A" | "B" = aSize >= bSize ? "A" : "B";
  const smallerSide: "A" | "B" = biggerSide === "A" ? "B" : "A";

  const trueSmallerR = BIGGER_R / ratio;
  const smallerR = Math.max(MIN_SMALLER_R, trueSmallerR);
  const isToScale = trueSmallerR >= MIN_SMALLER_R;
  const isSameSize = Math.abs(ratio - 1) < 0.001;

  // Smaller circle sits in the upper-centre area of the bigger one — close to
  // the rim but not touching it, so the size relationship reads cleanly.
  const smallerCx = CENTER;
  const smallerCy = CENTER - BIGGER_R * 0.45;

  const biggerName = t(`${bigger.i18nKey}.name`);
  const smallerName = t(`${smaller.i18nKey}.name`);

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-cosmos-deep/55 px-4 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
          {t("common.comparePage.visualHeading")}
        </h2>
        {isToScale && (
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/45">
            {t("common.comparePage.drawnToScale")}
          </p>
        )}
      </div>

      {!isToScale ? (
        <p className="mx-auto mt-5 max-w-md text-center text-sm leading-relaxed text-cosmos-star/70">
          {t("common.comparePage.tooExtreme")}
        </p>
      ) : (
      <div className="mx-auto mt-5 w-full max-w-[480px]">
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`${biggerName} vs ${smallerName}`}
        >
          <defs>
            <radialGradient id="bigger-grad" cx="50%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#1a1245" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#03030a" stopOpacity="0.1" />
            </radialGradient>
            <filter id="smaller-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Bigger — aurora frame */}
          <motion.circle
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: BIGGER_R, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            cx={CENTER}
            cy={CENTER}
            fill="url(#bigger-grad)"
            stroke="rgba(124,92,255,0.55)"
            strokeWidth="2"
          />

          {/* Smaller — nova dot */}
          {!isSameSize && (
            <motion.circle
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: smallerR, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              cx={smallerCx}
              cy={smallerCy}
              fill="#f0abfc"
              filter="url(#smaller-glow)"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth={Math.max(0.8, smallerR * 0.05)}
            />
          )}

          {/* Tick line from smaller dot to its label */}
          {!isSameSize && (
            <line
              x1={smallerCx + smallerR + 6}
              y1={smallerCy}
              x2={smallerCx + smallerR + 60}
              y2={smallerCy}
              stroke="rgba(240,171,252,0.45)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}
        </svg>
      </div>
      )}

      <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-full bg-cosmos-aurora ring-2 ring-cosmos-aurora/30"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-cosmos-star/55">
              {biggerSide}
            </span>
            <span className="mt-0.5 block truncate font-display text-base text-cosmos-star">
              {biggerName}
            </span>
            <span className="mt-0.5 block font-mono text-xs text-cosmos-plasma">
              {formatMeters(bigger.sizeMeters, t, units)}
            </span>
          </span>
        </li>
        <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-full bg-cosmos-nova ring-2 ring-cosmos-nova/30"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-cosmos-star/55">
              {smallerSide}
            </span>
            <span className="mt-0.5 block truncate font-display text-base text-cosmos-star">
              {smallerName}
            </span>
            <span className="mt-0.5 block font-mono text-xs text-cosmos-plasma">
              {formatMeters(smaller.sizeMeters, t, units)}
            </span>
          </span>
        </li>
      </ul>
    </section>
  );
}
