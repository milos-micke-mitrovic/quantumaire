"use client";

import clsx from "clsx";
import type { TrustBadge } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { Tooltip } from "./Tooltip";

const STYLES: Record<TrustBadge, string> = {
  FACT:
    "bg-badge-fact/10 text-badge-fact ring-badge-fact/40 shadow-[0_0_25px_rgba(34,211,238,0.25)]",
  ESTABLISHED_THEORY:
    "bg-badge-established/10 text-badge-established ring-badge-established/40 shadow-[0_0_25px_rgba(167,139,250,0.3)]",
  PROBABLE_THEORY:
    "bg-badge-probable/10 text-badge-probable ring-badge-probable/40 shadow-[0_0_25px_rgba(251,191,36,0.3)]",
  SPECULATIVE:
    "bg-badge-speculative/10 text-badge-speculative ring-badge-speculative/40 shadow-[0_0_25px_rgba(251,113,133,0.3)]",
};

interface BadgeProps {
  type: TrustBadge;
  /** Show a tooltip explaining what this badge means. */
  withTooltip?: boolean;
  className?: string;
}

export function Badge({ type, withTooltip = true, className }: BadgeProps) {
  const { t } = useI18n();
  const label = t(`badges.${type}`);
  const tooltip = t(`badges.${type}.tooltip`);

  const pill = (
    <span
      role="status"
      aria-label={`${label} — ${tooltip}`}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        "text-[11px] font-medium uppercase tracking-[0.16em]",
        "ring-1 backdrop-blur-sm",
        STYLES[type],
        className
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft"
        aria-hidden
      />
      {label}
    </span>
  );

  if (!withTooltip) return pill;
  return <Tooltip content={tooltip}>{pill}</Tooltip>;
}
