import { ImageResponse } from "next/og";
import { logoSvg } from "./logo";
import { fitDescription } from "./seo";

/**
 * Shared 1200×630 Open Graph card for guides, categories, tags and tool
 * pages (stop pages have their own richer card). Satori lacks superscript
 * glyphs, so powers of ten are spelled "10^-35".
 */
export const OG_SIZE = { width: 1200, height: 630 };

const LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg())}`;

export function ogSafe(text: string): string {
  const sup = "⁻⁰¹²³⁴⁵⁶⁷⁸⁹";
  const plain = "-0123456789";
  return text.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) =>
    "^" + [...m].map((c) => plain[sup.indexOf(c)]).join("")
  );
}

export function renderOgCard({
  eyebrow,
  title,
  subtitle,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer: string;
}): ImageResponse {
  const sub = subtitle ? ogSafe(fitDescription([subtitle], 190)) : "";
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
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori */}
          <img src={LOGO_DATA_URI} width={48} height={48} alt="" />
          {ogSafe(eyebrow)}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: title.length > 40 ? 60 : 72,
            lineHeight: 1.08,
            fontWeight: 600,
            background:
              "linear-gradient(180deg,#ffffff 0%,#e0f2fe 45%,#c4b5fd 100%)",
            backgroundClip: "text",
            color: "transparent",
            maxWidth: 1040,
          }}
        >
          {ogSafe(title)}
        </div>
        {sub && (
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.35,
              color: "rgba(224,242,254,0.8)",
              maxWidth: 1000,
            }}
          >
            {sub}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            display: "flex",
            fontSize: 20,
            color: "rgba(224,242,254,0.55)",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {footer}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
