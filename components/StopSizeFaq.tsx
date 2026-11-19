import Link from "next/link";
import type { SizeFaqItem } from "@/lib/sizeFaq";
import type { Locale } from "@/lib/types";

interface StopSizeFaqProps {
  locale: Locale;
  heading: string;
  items: SizeFaqItem[];
}

/**
 * Server-rendered "size & scale" Q&A for a stop. Always expanded (plain
 * headings + paragraphs) so every answer is visible text, and mirrors the
 * FAQPage JSON-LD emitted by the stop page.
 */
export function StopSizeFaq({ locale, heading, items }: StopSizeFaqProps) {
  if (items.length === 0) return null;
  return (
    <section
      id="qa"
      data-section
      aria-labelledby="size-faq-heading"
      className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-10"
    >
      <h2
        id="size-faq-heading"
        className="font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl"
      >
        {heading}
      </h2>
      <div className="mt-6 space-y-6">
        {items.map((item) => (
          <div key={item.q}>
            <h3 className="text-base font-medium text-cosmos-star">
              {item.q}
            </h3>
            <div className="mt-2 text-sm leading-relaxed text-cosmos-star/80 sm:text-base">
              {item.a}
              {item.links && item.links.length > 0 && (
                <span className="mt-2 flex flex-wrap gap-2">
                  {item.links.map((l) => (
                    <Link
                      key={l.id}
                      href={`/${locale}/stop/${l.id}`}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-cosmos-star/80 transition-colors hover:bg-white/[0.08] hover:text-cosmos-star"
                    >
                      {l.name} →
                    </Link>
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
