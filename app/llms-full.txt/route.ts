import { CATEGORIES, STOPS, categorySlug } from "@/lib/content";
import { tServer } from "@/lib/i18n-server";
import { formatMeters, formatTemperature } from "@/lib/scale";
import { LOCALES, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * `/llms-full.txt` — extended companion to `/llms.txt` carrying the full
 * body text of every stop, so an LLM can answer detailed questions without
 * crawling each page individually. Pair-listed in `/llms.txt`.
 *
 * Convention: https://llmstxt.org/#optional
 */
export function GET() {
  const lines: string[] = [];
  lines.push("# Quantumaire — full text");
  lines.push("");
  lines.push(
    "> Complete body text of every journey stop, in both English and Serbian (Latin), with size / distance / temperature / trust-badge metadata. Designed for LLM answer engines."
  );
  lines.push("");
  lines.push(
    "Quantumaire's reference: if Earth were a 0.5 mm grain of sand, the Moon is a smaller speck 1.5 cm away and the Sun is a billiard ball roughly 6 m off. Every stop scales by the same factor."
  );
  lines.push("");

  for (const locale of LOCALES) {
    const langLabel = locale === "en" ? "English" : "Serbian (Latin)";
    lines.push(`## ${langLabel}`);
    lines.push("");

    for (const category of CATEGORIES) {
      const catName = tServer(locale, `categories.${category}`);
      const catDesc = tServer(locale, `categories.${category}.description`);
      const catStops = STOPS.filter((s) => s.category === category);
      if (catStops.length === 0) continue;

      lines.push(`### ${catName}`);
      lines.push("");
      lines.push(`> ${catDesc}`);
      lines.push("");
      lines.push(
        `Category index: ${SITE_URL}/${locale}/category/${categorySlug(category)}`
      );
      lines.push("");

      for (const stop of catStops) {
        const name = tServer(locale, `${stop.i18nKey}.name`);
        const tagline = tServer(locale, `${stop.i18nKey}.tagline`);
        const body = tServer(locale, `${stop.i18nKey}.body`);
        const url = `${SITE_URL}/${locale}/stop/${stop.id}`;

        lines.push(`#### ${name}`);
        lines.push("");
        lines.push(`*${tagline}*`);
        lines.push("");

        const facts: string[] = [];
        if (typeof stop.sizeMeters === "number") {
          facts.push(`- Size: ${formatMeters(stop.sizeMeters)}`);
        }
        if (typeof stop.distanceFromEarthMeters === "number") {
          facts.push(
            `- Distance from Earth: ${formatMeters(stop.distanceFromEarthMeters)}`
          );
        }
        if (typeof stop.temperatureKelvin === "number") {
          facts.push(
            `- Temperature: ${formatTemperature(stop.temperatureKelvin)}`
          );
        }
        facts.push(`- Trust badge: ${stop.badge}`);
        facts.push(`- Category: ${catName}`);
        if (stop.tags && stop.tags.length > 0) {
          const tagLabels = stop.tags.map((t) =>
            tServer(locale, `tags.${t}`)
          );
          facts.push(`- Tags: ${tagLabels.join(", ")}`);
        }
        facts.push(`- URL: ${url}`);
        lines.push(facts.join("\n"));
        lines.push("");

        lines.push(body);
        lines.push("");

        const narrativeKey = `${stop.i18nKey}.narrative`;
        const narrative = tServer(locale, narrativeKey);
        if (narrative !== narrativeKey) {
          lines.push(`Narrative: ${narrative}`);
          lines.push("");
        }

        const factList: string[] = [];
        for (const k of ["fact1", "fact2", "fact3", "fact4", "fact5"]) {
          const key = `${stop.i18nKey}.facts.${k}`;
          const value = tServer(locale, key);
          if (value !== key) factList.push(value);
        }
        if (factList.length > 0) {
          lines.push("Key facts:");
          for (const f of factList) lines.push(`- ${f}`);
          lines.push("");
        }

        if (stop.sources && stop.sources.length > 0) {
          lines.push("Sources:");
          for (const src of stop.sources) lines.push(`- ${src.label}: ${src.url}`);
          lines.push("");
        }
      }
    }
  }

  lines.push("## Trust badges");
  lines.push("");
  lines.push(
    "- **FACT** — directly measured or observed."
  );
  lines.push(
    "- **ESTABLISHED_THEORY** — well-tested framework that fits the evidence."
  );
  lines.push(
    "- **PROBABLE_THEORY** — best current explanation, still being refined."
  );
  lines.push(
    "- **SPECULATIVE** — idea worth taking seriously, but not yet proven."
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
