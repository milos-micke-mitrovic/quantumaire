import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "sr"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "en";

function pickLocale(req: NextRequest): Locale {
  const stored = req.cookies.get("quantumaire-locale")?.value as
    | Locale
    | undefined;
  if (stored && LOCALES.includes(stored)) return stored;

  const header = req.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .find((tag) =>
      LOCALES.some((l) => tag === l || tag.startsWith(`${l}-`))
    );
  if (preferred) {
    const match = LOCALES.find(
      (l) => preferred === l || preferred.startsWith(`${l}-`)
    );
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}

/**
 * Two jobs:
 *
 * 1. On bare `/`, redirect to the visitor's preferred `/${locale}` based on
 *    the cookie or Accept-Language header.
 *
 * 2. On every other page, forward the request pathname to the server-rendered
 *    root layout via an `x-pathname` header so it can emit the correct
 *    `<html lang>` server-side (Next.js doesn't expose the URL to the root
 *    layout otherwise).
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect bare root to a locale.
  if (pathname === "/") {
    const locale = pickLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // For everything else, set x-pathname and forward.
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    // Run on every page request; exclude static assets, Next.js internals,
    // and any path with a file extension we don't render through Next.
    "/((?!_next/|api/|.*\\.(?:ico|svg|png|jpg|jpeg|webp|gif|avif|woff2?|ttf|eot|css|js|json|map|txt|xml)$).*)",
  ],
};
