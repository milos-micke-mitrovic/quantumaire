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

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }
  if (pathname !== "/") return NextResponse.next();

  const locale = pickLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};
