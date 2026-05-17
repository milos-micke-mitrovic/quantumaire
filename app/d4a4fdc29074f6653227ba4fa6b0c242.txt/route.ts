export const dynamic = "force-static";

/**
 * IndexNow key file — Bing/Yandex/Seznam verify ownership by fetching
 * `{host}/{key}.txt` and expecting the file body to equal the key.
 *
 * Spec: https://www.indexnow.org/documentation
 *
 * The key value is also baked into `/api/indexnow` calls so a single
 * POST notifies every IndexNow-compatible engine at once.
 */
export function GET() {
  return new Response("d4a4fdc29074f6653227ba4fa6b0c242", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
