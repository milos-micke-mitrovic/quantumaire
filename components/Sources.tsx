"use client";

import { useI18n } from "@/lib/i18n";
import type { Source } from "@/lib/types";

interface SourcesProps {
  sources: Source[];
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function Sources({ sources }: SourcesProps) {
  const { t } = useI18n();
  if (sources.length === 0) return null;

  return (
    <section
      aria-label={t("common.sources")}
      className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
    >
      <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
        {t("common.sources")}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {sources.map((src) => (
          <li key={src.url}>
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer external"
              title={t("common.openExternal")}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-white/20"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-[0.22em] text-cosmos-star/55">
                  {src.label}
                </span>
                <span className="mt-1 block truncate font-mono text-sm text-cosmos-plasma group-hover:text-cosmos-nova">
                  {hostFromUrl(src.url)}
                </span>
              </span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 text-cosmos-star/55 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
