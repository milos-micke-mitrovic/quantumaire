/* eslint-disable @next/next/no-html-link-for-pages -- crossing into a
   locale root layout needs a full page load, which plain <a> gives. */
import type { Metadata } from "next";
import { bodyFont as body, displayFont as display } from "@/lib/fonts";
import "./globals.css";


export const metadata: Metadata = {
  title: "404 — Quantumaire",
  robots: { index: false },
};

/**
 * Global 404 for URLs that match no route at all (the app has one root
 * layout per locale, so there is no shared layout to wrap a normal
 * not-found page). Localised 404s live at `[locale]/not-found.tsx`; this
 * one shows both languages side by side.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="relative min-h-screen bg-cosmos-void font-body text-cosmos-star antialiased">
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
        <a
          href="/en"
          className="inline-flex items-center gap-2 rounded-full bg-aurora-gradient px-5 py-2.5 text-sm font-medium text-cosmos-void shadow-glow"
        >
          Back to the home page
        </a>
        <a
          href="/sr"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-cosmos-star/85 hover:text-cosmos-star"
        >
          Nazad na početnu
        </a>
      </div>
    </main>
      </body>
    </html>
  );
}
