"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Tooltip } from "./Tooltip";

interface GlossaryTermProps {
  termKey: string;
}

export function GlossaryTerm({ termKey }: GlossaryTermProps) {
  const { t, locale } = useI18n();
  const term = t(`glossary.${termKey}.term`);
  const definition = t(`glossary.${termKey}.definition`);

  return (
    <Tooltip content={definition}>
      <Link
        href={`/${locale}/glossary#g-${termKey}`}
        className="inline-flex items-center text-cosmos-plasma underline decoration-cosmos-plasma/40 decoration-dotted underline-offset-4 transition-colors hover:text-cosmos-nova focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmos-void rounded-sm"
      >
        {term}
      </Link>
    </Tooltip>
  );
}
