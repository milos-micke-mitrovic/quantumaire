import { ImageResponse } from "next/og";
import { logoSvg } from "@/lib/logo";

/** The OG font has no superscript minus; spell powers of ten as "10^-35". */
function ogSafe(text: string): string {
  const sup = "⁻⁰¹²³⁴⁵⁶⁷⁸⁹";
  const plain = "-0123456789";
  return text.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) =>
    "^" + [...m].map((c) => plain[sup.indexOf(c)]).join("")
  );
}

const LOGO_PX = 48;
const LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg())}`;
import { STOPS, getStop } from "@/lib/content";
import { LOCALES } from "@/lib/seo";
import { tServer } from "@/lib/i18n-server";
import { formatMeters } from "@/lib/scale";
import type { Locale } from "@/lib/types";

export const alt = "Quantumaire stop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const stop = getStop(params.id);
  if (!stop) return [{ id: "default", alt, size, contentType }];
  return [{ id: stop.id, alt: stop.id, size, contentType }];
}

const BADGE_COLORS: Record<string, string> = {
  FACT: "#22d3ee",
  ESTABLISHED_THEORY: "#a78bfa",
  PROBABLE_THEORY: "#fbbf24",
  SPECULATIVE: "#fb7185",
};

export default async function Image({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const stop = getStop(params.id) ?? STOPS[0];
  const locale = (LOCALES.includes(params.locale as Locale)
    ? (params.locale as Locale)
    : "en");

  const name = tServer(locale, `${stop.i18nKey}.name`);
  const tagline = tServer(locale, `${stop.i18nKey}.tagline`);
  const category = tServer(locale, `categories.${stop.category}`);
  const badge = tServer(locale, `badges.${stop.badge}`);
  const badgeColor = BADGE_COLORS[stop.badge] ?? "#c084fc";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background:
            "radial-gradient(ellipse at 80% 0%, #1a1245 0%, #0a0a1f 50%, #03030a 100%)",
          color: "#e0f2fe",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(224,242,254,0.7)",
          }}
        >
          <img src={LOGO_DATA_URI} width={LOGO_PX} height={LOGO_PX} alt="" />
          Quantumaire · {category}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: badgeColor,
              padding: "10px 18px",
              borderRadius: 9999,
              border: `1px solid ${badgeColor}66`,
              alignSelf: "flex-start",
              background: `${badgeColor}14`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: badgeColor,
              }}
            />
            {badge}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 96,
              lineHeight: 1.05,
              fontWeight: 600,
              background: "linear-gradient(180deg,#ffffff 0%,#e0f2fe 45%,#c4b5fd 100%)",
              backgroundClip: "text",
              color: "transparent",
              maxWidth: 1040,
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(224,242,254,0.82)",
              maxWidth: 1040,
            }}
          >
            {tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(224,242,254,0.55)",
          }}
        >
          <span style={{ textTransform: "none", letterSpacing: 1 }}>
            {stop.sizeMeters !== null
              ? ogSafe(formatMeters(stop.sizeMeters, (k) => tServer(locale, k)))
              : tServer(locale, "common.abstract")}
          </span>
          <span>quantumaire · {locale.toUpperCase()}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
