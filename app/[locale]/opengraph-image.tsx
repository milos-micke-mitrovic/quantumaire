import { ImageResponse } from "next/og";
import { LOCALES } from "@/lib/seo";
import { tServer } from "@/lib/i18n-server";
import type { Locale } from "@/lib/types";

export const alt = "Quantumaire — From quarks to the observable universe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata() {
  return LOCALES.map((locale) => ({ id: locale, alt, size, contentType }));
}

export default async function Image({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (LOCALES.includes(params.locale as Locale)
    ? (params.locale as Locale)
    : "en");
  const title = tServer(locale, "common.title");
  const tagline = tServer(locale, "common.tagline");
  const subtagline = tServer(locale, "common.subtagline");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(ellipse at top left, #1a1245 0%, #0a0a1f 55%, #03030a 100%)",
          color: "#e0f2fe",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#c084fc",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: "linear-gradient(135deg,#7c5cff,#f0abfc)",
            }}
          />
          {title}
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 88,
            lineHeight: 1.05,
            fontWeight: 600,
            background: "linear-gradient(135deg,#7c5cff,#c084fc,#f0abfc)",
            backgroundClip: "text",
            color: "transparent",
            maxWidth: 980,
          }}
        >
          {tagline}
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            lineHeight: 1.35,
            color: "rgba(224,242,254,0.8)",
            maxWidth: 980,
          }}
        >
          {subtagline}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            display: "flex",
            gap: 12,
            fontSize: 20,
            color: "rgba(224,242,254,0.55)",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          quantumaire · {locale.toUpperCase()}
        </div>
      </div>
    ),
    { ...size }
  );
}
