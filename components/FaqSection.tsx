import { tServer } from "@/lib/i18n-server";
import type { Locale } from "@/lib/types";

interface FaqSectionProps {
  locale: Locale;
}

const FAQ_INDICES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/**
 * Visible FAQ block, mirroring the same Q&A pairs that feed the FAQPage
 * JSON-LD. Server-rendered, native `<details>/<summary>` so it works
 * without JS, stays accessible by default, and Google can index every
 * answer even when collapsed.
 */
export function FaqSection({ locale }: FaqSectionProps) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mx-auto w-full max-w-3xl px-5 pb-16 sm:px-8 sm:pb-20"
    >
      <header className="mb-8 max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cosmos-star/55">
          {tServer(locale, "home.faq.heading")}
        </p>
        <h2
          id="faq-heading"
          className="mt-3 font-display text-2xl font-semibold tracking-tight text-cosmos-star sm:text-3xl"
        >
          {tServer(locale, "home.faq.heading")}
        </h2>
        <p className="mt-2 text-sm text-cosmos-star/70 sm:text-base">
          {tServer(locale, "home.faq.tagline")}
        </p>
      </header>

      <dl className="space-y-3">
        {FAQ_INDICES.map((i) => {
          const q = tServer(locale, `home.faq.q${i}`);
          const a = tServer(locale, `home.faq.a${i}`);
          return (
            <details
              key={i}
              className="group rounded-2xl border border-white/10 bg-white/[0.025] open:bg-white/[0.04]"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left text-base font-medium text-cosmos-star marker:hidden [&::-webkit-details-marker]:hidden">
                <dt className="flex-1 leading-snug">{q}</dt>
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-cosmos-star/60 transition-transform group-open:rotate-45"
                >
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="h-3 w-3"
                  >
                    <path d="M6 1.5v9M1.5 6h9" />
                  </svg>
                </span>
              </summary>
              <dd className="px-5 pb-5 text-sm leading-relaxed text-cosmos-star/80 sm:text-[15px]">
                {a}
              </dd>
            </details>
          );
        })}
      </dl>
    </section>
  );
}
