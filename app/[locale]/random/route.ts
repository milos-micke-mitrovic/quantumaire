import { redirect } from "next/navigation";
import { STOPS } from "@/lib/content";
import { LOCALES } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * `/[locale]/random` — picks a random stop on every visit and redirects to
 * it. Route handler instead of a page so there's no client render between
 * arrival and redirect.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const safeLocale: Locale = (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "en";
  const stop = STOPS[Math.floor(Math.random() * STOPS.length)];
  redirect(`/${safeLocale}/stop/${stop.id}`);
}
