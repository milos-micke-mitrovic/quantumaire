import { NextResponse, type NextRequest } from "next/server";

/**
 * Forward the request pathname to the server-rendered layout via an
 * `x-pathname` header. Without this, Next.js doesn't expose the URL to
 * the root layout — so the root can't pick the right `<html lang>` until
 * after hydration. With this header in place, the root layout reads the
 * locale segment server-side and emits the correct BCP-47 tag in SSR.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    // Run on every page request; exclude static assets, Next.js internals,
    // and the OG image / api routes where the header isn't useful.
    "/((?!_next/|api/|.*\\.(?:ico|svg|png|jpg|jpeg|webp|gif|avif|woff2?|ttf|eot|css|js|json|map|txt|xml)$).*)",
  ],
};
