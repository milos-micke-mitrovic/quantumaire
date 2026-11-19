import Link from "next/link";
import { COMPARE_PAIRS, pairSlug } from "@/lib/comparePairs";
import { getStop } from "@/lib/content";
import { tServer } from "@/lib/i18n-server";
import type { Locale } from "@/lib/types";

/** Server-rendered list of the curated pair pages (crawlable links). */
export function ComparePairLinks({
  locale,
  exclude,
}: {
  locale: Locale;
  exclude?: string;
}) {
  const name = (id: string) => tServer(locale, `${getStop(id)!.i18nKey}.name`);
  const pairs = COMPARE_PAIRS.filter((p) => pairSlug(p) !== exclude);
  return (
    <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
      <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-cosmos-star/55">
        {tServer(locale, "common.comparePage.popular")}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {pairs.map((p) => (
          <li key={pairSlug(p)}>
            <Link
              href={`/${locale}/compare/${pairSlug(p)}`}
              className="inline-flex min-h-10 items-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-cosmos-star/80 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
            >
              {name(p[0])} vs {name(p[1])}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
