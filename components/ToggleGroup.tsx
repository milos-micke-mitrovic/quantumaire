"use client";

import clsx from "clsx";

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  /** `lang` of the label (language names). */
  lang?: string;
}

interface ToggleGroupProps<T extends string> {
  options: ReadonlyArray<ToggleOption<T>>;
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
  /** Stretch to the container width with equal-width segments (drawer). */
  fullWidth?: boolean;
  /** "md" = 40 px header controls, "sm" = 36 px inline controls. */
  size?: "md" | "sm";
  /** Uppercase labels, horizontally scrollable when space runs out. */
  caps?: boolean;
  className?: string;
}

/**
 * The pill segmented control used for every exclusive choice: km/mi,
 * °C/°F/K, EN/SR, compare mode. One button per option, `aria-pressed`
 * on the active one.
 */
export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  fullWidth,
  size = "md",
  caps,
  className,
}: ToggleGroupProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={clsx(
        "items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md",
        size === "md" ? "h-10" : "h-9",
        fullWidth ? "flex w-full" : "inline-flex",
        caps && "max-w-full overflow-x-auto [scrollbar-width:none]",
        className
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          lang={opt.lang}
          aria-pressed={opt.value === value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            "h-full rounded-full px-3 font-medium transition-colors",
            caps
              ? "shrink-0 whitespace-nowrap text-[11px] uppercase tracking-[0.12em] sm:px-4 sm:text-xs sm:tracking-[0.18em]"
              : "text-xs tracking-wider",
            fullWidth && "flex-1",
            opt.value === value
              ? "bg-aurora-gradient text-cosmos-void shadow-glow"
              : "text-cosmos-star/70 hover:text-cosmos-star"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
