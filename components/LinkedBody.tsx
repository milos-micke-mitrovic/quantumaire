"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { Tooltip } from "./Tooltip";

interface LinkedBodyProps {
  /** The raw body text from translations. */
  body: string;
  /** The stop's own glossary key list — only these terms get linked, not the whole 60-term glossary. */
  glossaryKeys: string[];
  /** Tailwind classes applied to the outer `<p>`. */
  className?: string;
}

interface Match {
  start: number;
  end: number;
  key: string;
  text: string;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Renders a stop's body paragraph with the first occurrence of each
 * curated glossary term wrapped in a tooltipped link to the glossary
 * entry. Matches word-start + any word-character suffix so common
 * inflections ("atoms", "atomic", Serbian "atoma") still link.
 *
 * Each term gets at most one inline link per body to keep the prose
 * readable; subsequent occurrences stay as plain text. The standalone
 * Glossary chip row at the bottom of the stop page still lists every
 * relevant term for users who want to skim them all.
 */
export function LinkedBody({ body, glossaryKeys, className }: LinkedBodyProps) {
  const { t, locale } = useI18n();

  const matches: Match[] = [];
  for (const key of glossaryKeys) {
    const term = t(`glossary.${key}.term`);
    if (!term || term.length < 2) continue;
    const re = new RegExp(`\\b${escapeRegex(term)}\\w*`, "i");
    const m = body.match(re);
    if (m && m.index !== undefined) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        key,
        text: m[0],
      });
    }
  }

  // Sort by position, drop any that overlap an earlier match.
  matches.sort((a, b) => a.start - b.start);
  const kept: Match[] = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      kept.push(m);
      lastEnd = m.end;
    }
  }

  if (kept.length === 0) {
    return <p className={className}>{body}</p>;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const m of kept) {
    if (m.start > cursor) {
      parts.push(
        <Fragment key={`text-${cursor}`}>{body.slice(cursor, m.start)}</Fragment>
      );
    }
    parts.push(
      <Tooltip key={`${m.key}-${m.start}`} content={t(`glossary.${m.key}.definition`)}>
        <Link
          href={`/${locale}/glossary#g-${m.key}`}
          className="text-cosmos-plasma underline decoration-cosmos-plasma/40 decoration-dotted underline-offset-4 transition-colors hover:text-cosmos-nova focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmos-void rounded-sm"
        >
          {m.text}
        </Link>
      </Tooltip>
    );
    cursor = m.end;
  }
  if (cursor < body.length) {
    parts.push(
      <Fragment key={`text-tail-${cursor}`}>{body.slice(cursor)}</Fragment>
    );
  }

  return <p className={className}>{parts}</p>;
}
