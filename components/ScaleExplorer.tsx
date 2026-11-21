"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { formatFactor } from "@/lib/references";
import { assignLanes, buildAxis, gapLabel, thinTicks } from "@/lib/scaleAxis";
import type { Category, Stop } from "@/lib/types";
import { prefersReducedMotion } from "@/lib/motion";

export interface ExplorerItem {
  stop: Stop;
  /** Plotted value (> 0), or null for an origin anchor (e.g. Earth = here). */
  value: number | null;
  /** Optional override for the dot / heading name. */
  name?: string;
}

export interface ExplorerTick {
  value: number;
  label: string;
}

interface ScaleExplorerProps {
  items: ExplorerItem[];
  /** Uppercase eyebrow above the name, e.g. "Size". */
  valueLabel: string;
  formatValue: (value: number) => string;
  /** Secondary line under the value (light-time for distances). */
  formatSubValue?: (value: number) => string | null;
  /** i18n keys for "{factor}× bigger than {name}" and "about the same as". */
  stepKey: string;
  ticks: ExplorerTick[];
  /** Denser ticks (e.g. every power of ten) used when zoomed in. */
  fineTicks?: ExplorerTick[];
  legend: string;
  highlightStopId?: string;
  /** Label for a null-valued origin item. */
  originLabel?: string;
  maxGapDecades?: number;
}

export const CATEGORY_DOT: Record<Category, string> = {
  MICRO_WORLD: "bg-cyan-300",
  EARTH: "bg-emerald-300",
  HUMANKIND: "bg-amber-300",
  PHYSICS: "bg-pink-300",
  COSMOS: "bg-cosmos-plasma",
};

const LANE_OFFSET_PX = [0, -15, 15];

/** Track width multipliers; zoom controls show only on crowded scales. */
const ZOOM_LEVELS = [1, 2.5, 6];
const ZOOM_MIN_ITEMS = 30;

/**
 * Interactive log-scale explorer shared by the size, distance and
 * temperature views. Dots sit at their true log position (long empty
 * stretches compressed and marked), colour-coded by category; the card on
 * top previews the selected stop with its image, value and the step from
 * the previous stop.
 */
/**
 * Percent with 6 significant digits — what the browser keeps when it parses
 * a style attribute, so server HTML and client props hydrate identically.
 */
const pct = (f: number) => `${Number((f * 100).toPrecision(6))}%`;

export function ScaleExplorer({
  items,
  valueLabel,
  formatValue,
  formatSubValue,
  stepKey,
  ticks,
  fineTicks,
  legend,
  highlightStopId,
  originLabel,
  maxGapDecades = 6,
}: ScaleExplorerProps) {
  // Unique per instance: two explorers can show the same topic.
  const uid = useId();
  const { t, locale } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const hasOrigin = items.length > 0 && items[0].value === null;
  const plotted = hasOrigin ? items.slice(1) : items;

  const axis = useMemo(
    () =>
      buildAxis(
        plotted.map((it) => it.value as number),
        { maxGapDecades, start: hasOrigin ? 0.07 : 0.015, end: 0.985 }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, maxGapDecades]
  );

  const positions = useMemo(
    () => (hasOrigin ? [0.015, ...axis.positions] : axis.positions),
    [axis, hasOrigin]
  );
  const [zoomIdx, setZoomIdx] = useState(0);
  const zoom = ZOOM_LEVELS[zoomIdx];
  const canZoom = items.length >= ZOOM_MIN_ITEMS;
  // A wider track needs less room between dots (in track fractions).
  const lanes = useMemo(
    () => assignLanes(positions, 0.018 / zoom),
    [positions, zoom]
  );

  const visibleTicks = useMemo(
    () =>
      thinTicks(
        (zoom > 1 && fineTicks ? fineTicks : ticks)
          .map((tk) => ({ ...tk, pos: axis.map(tk.value) }))
          .filter((tk): tk is ExplorerTick & { pos: number } => tk.pos !== null)
          .sort((a, b) => a.pos - b.pos),
        0.075 / zoom
      ),
    [ticks, fineTicks, axis, zoom]
  );

  const categories = useMemo(() => {
    const seen = new Set<Category>();
    for (const it of items) seen.add(it.stop.category);
    return (Object.keys(CATEGORY_DOT) as Category[]).filter((c) => seen.has(c));
  }, [items]);

  const highlightIdx = highlightStopId
    ? items.findIndex((it) => it.stop.id === highlightStopId)
    : -1;
  const [activeIdx, setActiveIdx] = useState(Math.max(0, highlightIdx));
  const idx = Math.min(activeIdx, items.length - 1);

  // Keep the selected dot in view when the track scrolls (mobile).
  useEffect(() => {
    const scroller = scrollRef.current;
    const track = trackRef.current;
    if (!scroller || !track || scroller.scrollWidth <= scroller.clientWidth) {
      return;
    }
    const x = positions[idx] * track.offsetWidth;
    scroller.scrollTo({
      left: x - scroller.clientWidth / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [idx, positions, zoom]);

  if (items.length === 0) return null;
  const active = items[idx];
  const activeName = active.name ?? t(`${active.stop.i18nKey}.name`);
  const nameOf = (it: ExplorerItem) => it.name ?? t(`${it.stop.i18nKey}.name`);

  const prev = idx > 0 ? items[idx - 1] : null;
  let step: string | null = null;
  if (active.value !== null && prev && prev.value !== null && prev.value > 0) {
    const ratio = active.value / prev.value;
    step =
      ratio < 1.15
        ? t(`${stepKey}Same`, { name: nameOf(prev) })
        : t(stepKey, { factor: formatFactor(ratio, t), name: nameOf(prev) });
  }
  const sub =
    active.value !== null && formatSubValue
      ? formatSubValue(active.value)
      : null;

  const go = (next: number) =>
    setActiveIdx(Math.max(0, Math.min(items.length - 1, next)));

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowLeft: idx - 1,
      ArrowRight: idx + 1,
      Home: 0,
      End: items.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(items.length - 1, map[e.key]));
    setActiveIdx(next);
    trackRef.current
      ?.querySelector<HTMLButtonElement>(`[data-idx="${next}"]`)
      ?.focus({ preventScroll: true });
  };

  return (
    <section
      aria-label={valueLabel}
      className="relative w-full rounded-3xl border border-white/10 bg-cosmos-deep/60 p-4 sm:p-7"
    >
      {/* Preview card */}
      <div className="grid grid-cols-[auto_1fr] gap-4 sm:grid-cols-[auto_1fr_auto] sm:gap-6">
        <Link
          href={`/${locale}/stop/${active.stop.id}`}
          tabIndex={-1}
          aria-hidden
          className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-cosmos-void sm:h-28 sm:w-28"
        >
          <Image
            key={active.stop.id}
            src={active.stop.image.src}
            alt=""
            fill
            sizes="112px"
            className="object-cover"
          />
        </Link>

        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
            <span
              aria-hidden
              className={clsx(
                "h-2 w-2 rounded-full",
                CATEGORY_DOT[active.stop.category]
              )}
            />
            {t(`categories.${active.stop.category}`)}
          </p>
          <h3 className="mt-1 font-display text-lg text-cosmos-star sm:text-2xl">
            {activeName}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-cosmos-star/70 sm:text-sm">
            {t(`${active.stop.i18nKey}.tagline`)}
          </p>
        </div>

        <div className="col-span-2 flex flex-wrap items-end justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-start sm:text-right">
          <div aria-live="polite">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
              {valueLabel}
            </p>
            <p className="mt-1 font-mono text-base text-cosmos-plasma sm:text-lg">
              {active.value === null ? originLabel : formatValue(active.value)}
            </p>
            {sub && (
              <p className="text-[11px] text-cosmos-star/50">{sub}</p>
            )}
          </div>
          <Link
            href={`/${locale}/stop/${active.stop.id}`}
            className="inline-flex items-center gap-1 rounded-full border border-cosmos-aurora/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-cosmos-plasma transition-colors hover:border-cosmos-plasma hover:text-cosmos-star focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-plasma/60"
          >
            {t("common.openStop")}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Step + prev/next */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
        <p className="min-w-0 text-xs text-cosmos-star/65 sm:text-sm">
          {step ? (
            <>
              <span aria-hidden className="mr-1.5 text-cosmos-nova">↑</span>
              {step}
            </>
          ) : (
            <span className="text-cosmos-star/55">{legend}</span>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
            aria-label={t("common.prev")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cosmos-star/75 transition-colors hover:bg-white/[0.06] hover:text-cosmos-star disabled:opacity-30"
          >
            <span aria-hidden>←</span>
          </button>
          <span className="w-14 text-center font-mono text-[11px] text-cosmos-star/55">
            {idx + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            disabled={idx === items.length - 1}
            aria-label={t("common.next")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cosmos-star/75 transition-colors hover:bg-white/[0.06] hover:text-cosmos-star disabled:opacity-30"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      {/* Track */}
      <div
        ref={scrollRef}
        className="-mx-4 mt-2 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0"
      >
        <div
          ref={trackRef}
          role="listbox"
          aria-label={valueLabel}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="relative h-[124px] w-[calc(var(--zoom)*100%)] min-w-[calc(var(--zoom)*52rem)] lg:min-w-0"
          style={{ "--zoom": zoom } as React.CSSProperties}
        >
          {/* baseline */}
          <div className="absolute inset-x-0 top-[62px] h-px bg-gradient-to-r from-cyan-300/30 via-cosmos-plasma/50 to-cosmos-nova/30" />

          {/* ticks */}
          {visibleTicks.map((tk) => (
            <div
              key={tk.label}
              aria-hidden
              className="absolute top-[86px] -translate-x-1/2"
              style={{ left: pct(tk.pos) }}
            >
              <div className="mx-auto -mt-[24px] h-[8px] w-px bg-white/25" />
              <p className="mt-[16px] whitespace-nowrap font-mono text-[9px] text-cosmos-star/55">
                {tk.label}
              </p>
            </div>
          ))}

          {/* compressed gaps */}
          {axis.gaps.map((g) => (
            <div
              key={`${g.from}-${g.to}`}
              aria-hidden
              className="absolute top-[56px] h-3"
              style={{
                left: `calc(${pct(g.from)} + 8px)`,
                width: `calc(${(g.to - g.from) * 100}% - 16px)`,
              }}
            >
              <div className="h-full border-x border-white/20 bg-[repeating-linear-gradient(90deg,transparent_0_3px,#0a0a1f_3px_6px)]" />
              <p
                title={t("common.explorer.gapHint")}
                className="mt-[22px] whitespace-nowrap text-center font-mono text-[9px] text-cosmos-star/55"
              >
                ⋯ {gapLabel(g.decades)} ⋯
              </p>
            </div>
          ))}

          {/* active label */}
          <div
            aria-hidden
            className={clsx(
              "pointer-events-none absolute top-0 whitespace-nowrap rounded-full bg-cosmos-nova/15 px-2 py-0.5 text-[11px] font-medium text-cosmos-nova transition-[left] duration-200",
              positions[idx] < 0.08
                ? "translate-x-[-12px]"
                : positions[idx] > 0.92
                  ? "-translate-x-[calc(100%-12px)]"
                  : "-translate-x-1/2"
            )}
            style={{ left: pct(positions[idx]) }}
          >
            {activeName}
          </div>

          {/* dots */}
          {items.map((it, i) => {
            const isActive = i === idx;
            const isHighlighted = i === highlightIdx;
            const name = nameOf(it);
            return (
              <button
                key={it.stop.id + i}
                id={`${uid}-dot-${it.stop.id}`}
                data-idx={i}
                type="button"
                role="option"
                aria-selected={isActive}
                aria-current={isHighlighted ? "location" : undefined}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveIdx(i)}
                aria-label={`${name} — ${it.value === null ? originLabel : formatValue(it.value)}`}
                className="group/dot absolute -translate-x-1/2 -translate-y-1/2 p-2 focus:outline-none"
                style={{
                  left: pct(positions[i]),
                  top: `${62 + LANE_OFFSET_PX[lanes[i]]}px`,
                }}
              >
                <span
                  className={clsx(
                    "block rounded-full transition-transform duration-150",
                    CATEGORY_DOT[it.stop.category],
                    isActive
                      ? "h-4 w-4 ring-2 ring-white/80 ring-offset-2 ring-offset-cosmos-deep"
                      : isHighlighted
                        ? "h-3.5 w-3.5 ring-2 ring-cosmos-aurora ring-offset-1 ring-offset-cosmos-deep"
                        : "h-2.5 w-2.5 opacity-75 group-hover/dot:scale-150 group-hover/dot:opacity-100 group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-white/70"
                  )}
                />
                {!isActive && (
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-cosmos-void/90 px-1.5 py-0.5 text-[10px] text-cosmos-star group-hover/dot:block">
                    {name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* legend + zoom */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] uppercase tracking-[0.16em] text-cosmos-star/50">
          {categories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5">
              <span aria-hidden className={clsx("h-2 w-2 rounded-full", CATEGORY_DOT[c])} />
              {t(`categories.${c}`)}
            </span>
          ))}
        </div>
        {canZoom && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomIdx((z) => Math.max(0, z - 1))}
              disabled={zoomIdx === 0}
              aria-label={t("common.explorer.zoomOut")}
              title={t("common.explorer.zoomOut")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg leading-none text-cosmos-star/75 transition-colors hover:bg-white/[0.06] hover:text-cosmos-star disabled:opacity-30"
            >
              <span aria-hidden>−</span>
            </button>
            <span className="w-10 text-center font-mono text-[11px] text-cosmos-star/55">
              {zoom}×
            </span>
            <button
              type="button"
              onClick={() => setZoomIdx((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1))}
              disabled={zoomIdx === ZOOM_LEVELS.length - 1}
              aria-label={t("common.explorer.zoomIn")}
              title={t("common.explorer.zoomIn")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg leading-none text-cosmos-star/75 transition-colors hover:bg-white/[0.06] hover:text-cosmos-star disabled:opacity-30"
            >
              <span aria-hidden>+</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
