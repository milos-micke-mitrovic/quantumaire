"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

export interface ComboOption {
  id: string;
  name: string;
  /** Right-aligned detail, e.g. the size. */
  detail?: string;
  image?: string;
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

/**
 * Searchable picker (ARIA combobox): type to filter, ↑/↓ + Enter to pick,
 * Esc or click outside to close. Replaces native <select>s that grew too
 * long to scroll through.
 */
export function StopCombobox({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ComboOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const { t } = useI18n();
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const selected = options.find((o) => o.id === value);
  const results = useMemo(() => {
    const q = normalize(query.trim());
    return q ? options.filter((o) => normalize(o.name).includes(q)) : options;
  }, [options, query]);

  // Close on click outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openList = () => {
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.id === value)));
    setOpen(true);
  };
  const pick = (o: ComboOption) => {
    onChange(o.id);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) pick(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <label
        htmlFor={id}
        className="block text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55"
      >
        {label}
      </label>
      <div className="relative mt-2">
        {selected?.image && !open && (
          <span className="pointer-events-none absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 overflow-hidden rounded-lg">
            <Image src={selected.image} alt="" fill sizes="32px" className="object-cover" />
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${id}-${results[active].id}` : undefined}
          autoComplete="off"
          value={open ? query : (selected?.name ?? "")}
          placeholder={open ? t("common.comboSearch") : undefined}
          onFocus={openList}
          onClick={() => !open && openList()}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={clsx(
            "w-full rounded-2xl border border-white/10 bg-cosmos-night/40 py-3 pr-24 text-base text-cosmos-star placeholder:text-cosmos-star/40 focus:border-cosmos-aurora/60 focus:outline-none",
            selected?.image && !open ? "pl-12" : "pl-4"
          )}
        />
        {!open && selected?.detail && (
          <span className="pointer-events-none absolute right-9 top-1/2 -translate-y-1/2 font-mono text-xs text-cosmos-star/50">
            {selected.detail}
          </span>
        )}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={clsx(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cosmos-star/55 transition-transform",
            open && "rotate-180"
          )}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-white/10 bg-cosmos-deep p-1.5 shadow-glow"
        >
          {results.length === 0 ? (
            <li className="px-3 py-4 text-center text-sm text-cosmos-star/55">
              {t("common.searchEmpty")}
            </li>
          ) : (
            results.map((o, i) => (
              <li
                key={o.id}
                id={`${id}-${o.id}`}
                data-idx={i}
                role="option"
                aria-selected={o.id === value}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(o);
                }}
                className={clsx(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5",
                  i === active ? "bg-white/[0.08]" : "",
                  o.id === value && "text-cosmos-plasma"
                )}
              >
                {o.image && (
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-cosmos-void">
                    <Image src={o.image} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate text-sm">{o.name}</span>
                {o.detail && (
                  <span className="shrink-0 font-mono text-[11px] text-cosmos-star/50">
                    {o.detail}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
