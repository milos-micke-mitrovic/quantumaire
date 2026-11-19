import Link from "next/link";
import { STOPS } from "@/lib/content";
import { buildAnalogies, type Analogy } from "@/lib/analogies";
import { tServer } from "@/lib/i18n-server";
import { formatFactor } from "@/lib/references";
import { formatMeters } from "@/lib/scale";
import type { Locale, Stop } from "@/lib/types";

/**
 * "At everyday scale" — computed analogies that map a stop (and one of its
 * neighbours) onto familiar objects at the same scale factor. Rendered on
 * the server so the comparisons are crawlable text.
 */
export function EverydayScale({ stop, locale }: { stop: Stop; locale: Locale }) {
  const analogies = buildAnalogies(stop, STOPS);
  if (analogies.length === 0) return null;
  const t = (key: string, vars?: Record<string, string | number>) =>
    tServer(locale, key, vars);
  const tr = (key: string) => tServer(locale, key);
  const stopName = (id: string) => {
    const s = STOPS.find((x) => x.id === id);
    return s ? t(`${s.i18nKey}.name`) : id;
  };

  return (
    <section
      aria-labelledby="everyday-heading"
      className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
    >
      <h2
        id="everyday-heading"
        className="font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl"
      >
        {t("analogy.heading")}
      </h2>
      <p className="mt-2 text-sm text-cosmos-star/65">{t("analogy.intro")}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {analogies.map((a, i) => (
          <AnalogyCard
            key={i}
            a={a}
            locale={locale}
            stopId={stop.id}
            t={t}
            tr={tr}
            stopName={stopName}
          />
        ))}
      </div>
    </section>
  );
}

function AnalogyCard({
  a,
  locale,
  stopId,
  t,
  tr,
  stopName,
}: {
  a: Analogy;
  locale: Locale;
  stopId: string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tr: (key: string) => string;
  stopName: (id: string) => string;
}) {
  const factorText =
    a.factor >= 1
      ? t("analogy.enlarge", { factor: formatFactor(a.factor, tr) })
      : t("analogy.shrink", { factor: formatFactor(1 / a.factor, tr) });

  const fromLabel =
    a.kind === "size"
      ? stopName(a.fromId)
      : t(`analogy.refs.${a.fromId}`);
  const toLabel =
    a.kind === "size"
      ? stopName(a.toId)
      : t("analogy.fromEarth", { name: stopName(a.toId) });

  const nameNode = (id: string, label: string, isStop: boolean) =>
    isStop && id !== stopId ? (
      <Link
        href={`/${locale}/stop/${id}`}
        className="underline decoration-cosmos-aurora/40 decoration-dotted underline-offset-4 hover:text-cosmos-aurora"
      >
        {label}
      </Link>
    ) : (
      <span>{label}</span>
    );

  const row = (
    left: React.ReactNode,
    sign: string,
    objId: string,
    objMeters: number,
    highlight: boolean
  ) => (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1.3fr)] items-baseline gap-2 py-2">
      <span
        className={
          highlight
            ? "font-medium text-cosmos-star"
            : "text-cosmos-star/80"
        }
      >
        {left}
      </span>
      <span aria-hidden className="font-mono text-cosmos-star/40">
        {sign}
      </span>
      <span className="text-cosmos-plasma">
        {t(`analogy.items.${objId}`)}
        <span className="ml-1.5 whitespace-nowrap font-mono text-[11px] text-cosmos-star/45">
          {formatMeters(objMeters, tr)}
        </span>
      </span>
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-cosmos-deep/50 px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cosmos-star/45">
        {factorText}
      </p>
      <div className="mt-1 divide-y divide-white/5 text-sm">
        {row(
          nameNode(a.fromId, fromLabel, a.fromIsStop),
          "=",
          a.fromObject.id,
          a.fromObject.meters,
          a.fromId === stopId
        )}
        {row(
          nameNode(a.toId, toLabel, true),
          "≈",
          a.toObject.id,
          a.toObject.meters,
          a.toId === stopId
        )}
      </div>
    </div>
  );
}
