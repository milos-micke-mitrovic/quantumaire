import { CATEGORIES, STOPS, categorySlug } from "@/lib/content";
import { TOPICS } from "@/lib/topics";
import { LOCALES, SITE_URL } from "@/lib/seo";

const INDEXNOW_KEY = "d4a4fdc29074f6653227ba4fa6b0c242";
const INDEXNOW_HOST = new URL(SITE_URL).hostname;

/**
 * POST /api/indexnow — pushes the full URL list to IndexNow so Bing,
 * Yandex, Seznam, and Naver re-crawl us immediately instead of waiting
 * for their next scheduled visit. Safe to run after every deploy.
 *
 * Secured by `INDEXNOW_TRIGGER_SECRET` header. Idempotent — pinging the
 * same URLs again is a no-op.
 *
 * Spec: https://www.indexnow.org
 */
export async function POST(req: Request) {
  const secret = process.env.INDEXNOW_TRIGGER_SECRET;
  if (secret) {
    const provided = req.headers.get("x-indexnow-secret");
    if (provided !== secret) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const urlList = collectUrls();
  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const endpoints = [
    "https://api.indexnow.org/IndexNow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
    "https://searchadvisor.naver.com/indexnow",
  ];

  const results = await Promise.allSettled(
    endpoints.map((url) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      })
    )
  );

  const summary = endpoints.map((endpoint, i) => {
    const r = results[i];
    if (r.status === "fulfilled") {
      return { endpoint, status: r.value.status };
    }
    return { endpoint, status: "error", error: String(r.reason) };
  });

  return Response.json({
    submitted: urlList.length,
    host: INDEXNOW_HOST,
    results: summary,
  });
}

function collectUrls(): string[] {
  const out: string[] = [];
  for (const locale of LOCALES) {
    out.push(`${SITE_URL}/${locale}`);
    out.push(`${SITE_URL}/${locale}/about`);
    out.push(`${SITE_URL}/${locale}/glossary`);
    out.push(`${SITE_URL}/${locale}/compare`);
    out.push(`${SITE_URL}/${locale}/topics`);
    out.push(`${SITE_URL}/${locale}/tools/scale`);
    for (const stop of STOPS) {
      out.push(`${SITE_URL}/${locale}/stop/${stop.id}`);
    }
    for (const topic of TOPICS) {
      out.push(`${SITE_URL}/${locale}/topics/${topic.slug}`);
    }
    for (const cat of CATEGORIES) {
      out.push(`${SITE_URL}/${locale}/category/${categorySlug(cat)}`);
    }
  }
  return out;
}
