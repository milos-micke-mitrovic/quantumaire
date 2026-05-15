"use client";

import clsx from "clsx";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { DistanceScale } from "./DistanceScale";
import { FilterableStopGrid } from "./FilterableStopGrid";
import { InteractiveScale } from "./InteractiveScale";

type ScaleView = "size" | "distance";

/**
 * Lean journey:
 * - heading
 * - a slider, viewable two ways: by size (default) or by distance from Earth
 * - a grid of all stop cards (filterable by trust badge)
 *
 * Detail content lives on `/[locale]/stop/[id]` — keeping it off the home
 * page avoids stacking dozens of `whileInView` motion elements and big
 * `backdrop-blur` panels during scroll.
 */
export function Journey() {
  const { t } = useI18n();
  const [view, setView] = useState<ScaleView>("size");

  return (
    <section
      id="journey"
      className="mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8"
    >
      <div className="mb-8 max-w-2xl">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-cosmos-star sm:text-3xl">
          {t("comparison.title")}
        </h2>
        <p className="mt-2 text-sm text-cosmos-star/70 sm:text-base">
          {t("comparison.subtitle")}
        </p>
      </div>

      <div
        role="group"
        aria-label={t("common.scale")}
        className="mb-4 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1"
      >
        {(["size", "distance"] as const).map((v) => {
          const isActive = view === v;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={isActive}
              onClick={() => setView(v)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors",
                isActive
                  ? "bg-aurora-gradient text-cosmos-void shadow-glow"
                  : "text-cosmos-star/70 hover:text-cosmos-star"
              )}
            >
              {v === "size"
                ? t("common.viewBySize")
                : t("common.viewByDistance")}
            </button>
          );
        })}
      </div>

      <div className="mb-12">
        {view === "size" ? (
          <InteractiveScale stops={STOPS} />
        ) : (
          <DistanceScale />
        )}
      </div>

      <FilterableStopGrid stops={STOPS} />
    </section>
  );
}
