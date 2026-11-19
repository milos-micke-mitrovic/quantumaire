"use client";

import clsx from "clsx";
import { useI18n } from "@/lib/i18n";
import type { Stop } from "@/lib/types";

interface Highlight {
  key: string;
  label: string;
  text: string;
  icon: string;
  accent?: boolean;
}

/**
 * The stop's short "angles" — size picture, distance picture, mass and a
 * fun fact — as compact tiles inside the main article card, instead of
 * four separate full-width panels that read like repetition.
 */
export function StopHighlights({ stop }: { stop: Stop }) {
  const { t } = useI18n();
  const get = (suffix: string) => {
    const key = `${stop.i18nKey}.${suffix}`;
    const v = t(key);
    return v && v !== key ? v : null;
  };

  const narrative =
    get("narrative") ?? (stop.sizeMeters === null ? t("comparison.abstract") : null);
  const items: Highlight[] = [
    narrative && { key: "picture", label: t("comparison.pictureThis"), text: narrative, icon: "◉" },
    get("ifDistance") && { key: "distance", label: t("comparison.ifDistance"), text: get("ifDistance")!, icon: "↔" },
    get("massNarrative") && { key: "mass", label: t("comparison.byWeight"), text: get("massNarrative")!, icon: "⚖" },
    get("funFact") && { key: "fun", label: t("comparison.didYouKnow"), text: get("funFact")!, icon: "✦", accent: true },
  ].filter(Boolean) as Highlight[];

  if (items.length === 0) return null;
  const odd = items.length % 2 === 1;

  return (
    <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
      {items.map((h, i) => (
        <div
          key={h.key}
          className={clsx(
            "rounded-2xl border p-4",
            h.accent
              ? "border-cosmos-aurora/30 bg-cosmos-aurora/[0.07]"
              : "border-white/10 bg-white/[0.025]",
            // Let the last tile span both columns when the count is odd.
            odd && i === items.length - 1 && "sm:col-span-2"
          )}
        >
          <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
            <span
              aria-hidden
              className={clsx(
                "text-sm leading-none",
                h.accent ? "text-cosmos-nova" : "text-cosmos-plasma"
              )}
            >
              {h.icon}
            </span>
            {h.label}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-cosmos-star/85 sm:text-[15px]">
            {h.text}
          </p>
        </div>
      ))}
    </div>
  );
}
