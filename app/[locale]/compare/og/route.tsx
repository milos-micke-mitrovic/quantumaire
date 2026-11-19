import { ImageResponse } from "next/og";
import { getStop } from "@/lib/content";
import { tServer } from "@/lib/i18n-server";
import { LOCALES } from "@/lib/seo";
import { formatFactor } from "@/lib/references";
import { formatMeters } from "@/lib/scale";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Satori's font lacks superscripts: "10¹⁵" → "10^15". */
function ogSafe(text: string): string {
  const sup = "⁻⁰¹²³⁴⁵⁶⁷⁸⁹";
  const plain = "-0123456789";
  return text.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) =>
    "^" + [...m].map((c) => plain[sup.indexOf(c)]).join("")
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const typed: Locale = (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "en";

  const url = new URL(req.url);
  const aId = url.searchParams.get("a") ?? "quark";
  const bId = url.searchParams.get("b") ?? "earth";
  const a = getStop(aId) ?? getStop("quark")!;
  const b = getStop(bId) ?? getStop("earth")!;

  const aName = tServer(typed, `${a.i18nKey}.name`);
  const bName = tServer(typed, `${b.i18nKey}.name`);

  // How many times bigger the bigger one is ("11×", "3.5×") — never
  // "1 / 3.55" or "11.0×"; the sizes under each name show which is which.
  let ratioBig = "—";
  if (a.sizeMeters !== null && b.sizeMeters !== null && a.sizeMeters > 0 && b.sizeMeters > 0) {
    const r = Math.max(a.sizeMeters, b.sizeMeters) / Math.min(a.sizeMeters, b.sizeMeters);
    ratioBig = r < 1.001 ? "1×" : `${ogSafe(formatFactor(r, (k) => tServer(typed, k)))}×`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "70px 80px",
          background:
            "radial-gradient(ellipse at top, #1a1245 0%, #0a0a1f 55%, #03030a 100%)",
          color: "#e0f2fe",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(224,242,254,0.7)",
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
          Quantumaire · {tServer(typed, "common.compare")}
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            marginTop: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "rgba(224,242,254,0.55)",
              }}
            >
              A
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 600,
                lineHeight: 1.05,
                marginTop: 8,
                background: "linear-gradient(135deg,#7c5cff,#c084fc)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {aName}
            </div>
            <div
              style={{
                fontSize: 22,
                marginTop: 12,
                color: "rgba(224,242,254,0.7)",
                fontFamily: "monospace",
              }}
            >
              {a.sizeMeters !== null
                ? ogSafe(formatMeters(a.sizeMeters, (k) => tServer(typed, k)))
                : tServer(typed, "common.abstract")}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 20,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "rgba(224,242,254,0.55)",
              }}
            >
              {tServer(typed, "common.ratio")}
            </div>
            <div
              style={{
                fontSize: 92,
                fontWeight: 700,
                marginTop: 6,
                background: "linear-gradient(135deg,#c084fc,#f0abfc)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {ratioBig}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              textAlign: "right",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: 22,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "rgba(224,242,254,0.55)",
              }}
            >
              B
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 600,
                lineHeight: 1.05,
                marginTop: 8,
                background: "linear-gradient(135deg,#f0abfc,#fb7185)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {bName}
            </div>
            <div
              style={{
                fontSize: 22,
                marginTop: 12,
                color: "rgba(224,242,254,0.7)",
                fontFamily: "monospace",
              }}
            >
              {b.sizeMeters !== null
                ? ogSafe(formatMeters(b.sizeMeters, (k) => tServer(typed, k)))
                : tServer(typed, "common.abstract")}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(224,242,254,0.5)",
          }}
        >
          <span>{tServer(typed, "common.comparePage.tagline")}</span>
          <span>quantumaire · {typed.toUpperCase()}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
