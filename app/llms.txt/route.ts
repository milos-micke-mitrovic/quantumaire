import { CATEGORIES, STOPS, categorySlug } from "@/lib/content";
import { TOPICS } from "@/lib/topics";
import { tServer } from "@/lib/i18n-server";
import { formatMeters, formatTemperature } from "@/lib/scale";
import { LOCALES, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * `/llms.txt` — the emerging convention for surfacing a site to LLM-based
 * search and answer engines. Plaintext, Markdown-flavoured, pointed at the
 * pages an LLM should ingest to answer questions about the site.
 *
 * Spec: https://llmstxt.org
 */
export function GET() {
  const lines: string[] = [];
  lines.push("# Quantumaire");
  lines.push("");
  lines.push(
    "> An interactive educational journey from the smallest subatomic particles to the largest structures in the observable universe. Every stop carries a transparent trust badge (Fact, Established Theory, Probable Theory, Speculative)."
  );
  lines.push("");
  lines.push(
    "Quantumaire helps readers build intuition for the scale of the universe by anchoring every object to a single reference: if Earth were a 0.5 mm grain of sand, how big would everything else be?"
  );
  lines.push("");

  for (const locale of LOCALES) {
    const langLabel = locale === "en" ? "English" : "Serbian";
    lines.push(`## ${langLabel} (${locale})`);
    lines.push("");
    lines.push(`- [Journey home](${SITE_URL}/${locale})`);
    lines.push(
      `- [About Quantumaire](${SITE_URL}/${locale}/about) — methodology, trust badges, and editorial stance`
    );
    lines.push(
      `- [Glossary](${SITE_URL}/${locale}/glossary) — every term defined in one place`
    );
    lines.push(
      `- [Scale calculator](${SITE_URL}/${locale}/tools/scale) — type any length and see it shrunk to grain-scale`
    );
    lines.push(
      `- [Compare two stops](${SITE_URL}/${locale}/compare) — pick any two stops and see their scale ratio`
    );
    lines.push(
      `- [Topics](${SITE_URL}/${locale}/topics) — concept pages explaining stars, planets, and black holes`
    );
    lines.push("");
    lines.push(`### Topic pages (${locale})`);
    lines.push("");
    for (const topic of TOPICS) {
      const name = tServer(locale, `${topic.i18nKey}.title`);
      const tag = tServer(locale, `${topic.i18nKey}.tagline`);
      lines.push(
        `- [${name}](${SITE_URL}/${locale}/topics/${topic.slug}) — ${tag}`
      );
    }
    lines.push("");
    lines.push(`### Categories (${locale})`);
    lines.push("");
    for (const cat of CATEGORIES) {
      const slug = categorySlug(cat);
      const name = tServer(locale, `categories.${cat}`);
      const desc = tServer(locale, `categories.${cat}.description`);
      lines.push(
        `- [${name}](${SITE_URL}/${locale}/category/${slug}) — ${desc}`
      );
    }
    lines.push("");
    lines.push(`### Stops (${locale})`);
    lines.push("");
    for (const stop of STOPS) {
      const name = tServer(locale, `${stop.i18nKey}.name`);
      const tag = tServer(locale, `${stop.i18nKey}.tagline`);
      const url = `${SITE_URL}/${locale}/stop/${stop.id}`;
      const facts: string[] = [];
      if (typeof stop.sizeMeters === "number") {
        facts.push(`size ${formatMeters(stop.sizeMeters)}`);
      }
      if (typeof stop.distanceFromEarthMeters === "number") {
        facts.push(
          `distance from Earth ${formatMeters(stop.distanceFromEarthMeters)}`
        );
      }
      if (typeof stop.temperatureKelvin === "number") {
        facts.push(`temperature ${formatTemperature(stop.temperatureKelvin)}`);
      }
      const factSuffix = facts.length > 0 ? ` (${facts.join("; ")})` : "";
      lines.push(
        `- [${name}](${url}) — ${tag}${factSuffix} [${stop.badge}]`
      );
    }
    lines.push("");
  }

  lines.push("## Trust badges");
  lines.push("");
  lines.push("- **Fact** — directly measured or observed.");
  lines.push(
    "- **Established theory** — well-tested framework that fits the evidence."
  );
  lines.push(
    "- **Probable theory** — best current explanation, still being refined."
  );
  lines.push(
    "- **Speculative** — idea worth taking seriously, but not yet proven."
  );
  lines.push("");
  lines.push("## Optional");
  lines.push("");
  lines.push(
    `- [Full text](${SITE_URL}/llms-full.txt) — every stop's complete body, narrative, key facts, and sources in both locales`
  );
  lines.push(`- [Sitemap](${SITE_URL}/sitemap.xml)`);
  lines.push(`- [Robots](${SITE_URL}/robots.txt)`);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
