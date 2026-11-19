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

function startsWithLocale(pathname: string): boolean {
  for (const l of LOCALES) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) return true;
  }
  return false;
}

/**
 * Runs as edge `middleware.ts` rather than Next 16's `proxy.ts`: proxy is
 * pinned to the Node runtime, which OpenNext on Cloudflare Workers can't run.
 *
 * Jobs (in order): canonical-host redirect and locale prefixing. Any path
 * missing a locale prefix (`/`, `/foo`, `/typo`, …) is redirected to
 * `/${locale}${pathname}` based on the visitor's cookie or Accept-Language,
 * so unknown URLs 404 in the visitor's language via `[locale]/not-found.tsx`
 * instead of falling through to the bilingual `app/global-not-found.tsx`.
 */
const CANONICAL_HOST = "quantumaire.space";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Canonical origin: https://quantumaire.space (Vercel used to do this).
  // www and plain http get a permanent redirect so Google sees one copy.
  const host = req.headers.get("host") ?? "";
  const proto =
    req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  if (host === `www.${CANONICAL_HOST}` || (host === CANONICAL_HOST && proto === "http")) {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  if (!startsWithLocale(pathname)) {
    const locale = pickLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on every page request; exclude static assets, Next.js internals,
    // and any path with a file extension we don't render through Next.
    "/((?!_next/|api/|.*\\.(?:ico|svg|png|jpg|jpeg|webp|gif|avif|woff2?|ttf|eot|css|js|json|map|txt|xml|webmanifest)$).*)",
  ],
};
