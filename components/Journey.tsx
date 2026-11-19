"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { STOPS } from "@/lib/content";
import { DistanceScale } from "./DistanceScale";
import { CategoryShelves } from "./CategoryShelves";
import { InteractiveScale } from "./InteractiveScale";
import { TemperatureScale } from "./TemperatureScale";
import { ToggleGroup } from "./ToggleGroup";

const VIEW_LABEL = {
  size: "common.viewBySize",
  distance: "common.viewByDistance",
  temperature: "common.viewByTemperature",
} as const;

type ScaleView = "size" | "distance" | "temperature";

/**
 * Lean journey:
 * - heading
 * - a slider, viewable two ways: by size (default) or by distance from Earth
 * - one horizontally scrolling shelf of stop cards per category
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

      <ToggleGroup
        label={t("common.scale")}
        options={(["size", "distance", "temperature"] as const).map((v) => ({ value: v, label: t(VIEW_LABEL[v]) }))}
        value={view}
        onChange={setView}
        size="sm"
        caps
        className="mb-4"
      />

      <div className="mb-12">
        {view === "size" ? (
          <InteractiveScale stops={STOPS} />
        ) : view === "distance" ? (
          <DistanceScale />
        ) : (
          <TemperatureScale />
        )}
      </div>

      <CategoryShelves />
    </section>
  );
}
