import Link from "next/link";

/**
 * Static 404. Localised UI lives at `/[locale]/not-found.tsx`; this root
 * page handles paths that never matched a locale at all, so we just show
 * both languages side by side and let the user pick.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-cosmos-star/55">
        404
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-cosmos-star sm:text-4xl">
        Lost in the void
        <span className="mt-1 block text-base font-normal text-cosmos-star/55">
          Izgubljeni u praznini
        </span>
      </h1>
      <p className="mt-3 text-cosmos-star/70">
        The page you were looking for is somewhere past our cosmic horizon.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/en"
          className="inline-flex items-center gap-2 rounded-full bg-aurora-gradient px-5 py-2.5 text-sm font-medium text-cosmos-void shadow-glow"
        >
          Return to the journey
        </Link>
        <Link
          href="/sr"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-cosmos-star/85 hover:text-cosmos-star"
        >
          Nazad na putovanje
        </Link>
      </div>
    </main>
  );
}
