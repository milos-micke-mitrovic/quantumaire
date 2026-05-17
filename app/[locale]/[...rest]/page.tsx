import { notFound } from "next/navigation";

/**
 * Catch-all under `[locale]` so any unmatched path (e.g. `/sr/tools/quiz`
 * after we delete that route) triggers `[locale]/not-found.tsx` — the
 * locale-aware 404 — instead of bubbling up to the root bilingual
 * `app/not-found.tsx`.
 */
export default function CatchAll(): never {
  notFound();
}
