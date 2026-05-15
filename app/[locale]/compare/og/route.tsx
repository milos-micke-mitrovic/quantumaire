import { ImageResponse } from "next/og";
import { getStop } from "@/lib/content";
import { tServer } from "@/lib/i18n-server";
import { LOCALES } from "@/lib/seo";
import { formatMeters } from "@/lib/scale";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatFactor(factor: number): string {
  if (factor >= 1e9) return `${(factor / 1e9).toFixed(1)} B`;
  if (factor >= 1e6) return `${(factor / 1e6).toFixed(1)} M`;
  if (factor >= 1e3) return `${(factor / 1e3).toFixed(1)} K`;
  if (factor >= 100) return factor.toFixed(0);
  if (factor >= 10) return factor.toFixed(1);
  return factor.toFixed(2);
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

  let ratioBig = "—";
  if (a.sizeMeters !== null && b.sizeMeters !== null && a.sizeMeters > 0) {
    const r = b.sizeMeters / a.sizeMeters;
    if (Math.abs(r - 1) < 0.001) ratioBig = "1×";
    else if (r >= 1) ratioBig = `${formatFactor(r)}×`;
    else ratioBig = `1 / ${formatFactor(1 / r)}`;
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
                ? formatMeters(a.sizeMeters, (k) => tServer(typed, k))
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
                ? formatMeters(b.sizeMeters, (k) => tServer(typed, k))
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
