import Link from "next/link";
import { tServer } from "@/lib/i18n-server";
import {
  SPACECRAFT,
  SPEED_OF_LIGHT_KM_S,
  kmPerHour,
  roundFriendly,
  yearsPerLightYear,
} from "@/lib/spacecraft";
import type { Locale } from "@/lib/types";

/**
 * Server-rendered table: our fastest / farthest spacecraft, their speed and
 * how many years each would need to cross a single light-year. Plain HTML
 * table so the numbers are crawlable text.
 */
export function SpacecraftSpeeds({
  locale,
  highlightId,
}: {
  locale: Locale;
  highlightId?: string;
}) {
  const t = (key: string, vars?: Record<string, string | number>) =>
    tServer(locale, key, vars);
  const loc = t("common.numberLocale");
  const int = (n: number) => Math.round(n).toLocaleString(loc);

  return (
    <section
      aria-labelledby="spacecraft-heading"
      className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-10"
    >
      <h2
        id="spacecraft-heading"
        className="font-display text-xl font-semibold tracking-tight text-cosmos-star sm:text-2xl"
      >
        {t("spacecraft.heading")}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-cosmos-star/75 sm:text-base">
        {t("spacecraft.intro")}
      </p>

      <div className="-mx-2 mt-6 overflow-x-auto px-2">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.18em] text-cosmos-star/55">
              <th scope="col" className="py-2 pr-3 font-medium">
                {t("spacecraft.colCraft")}
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                {t("spacecraft.colLaunched")}
              </th>
              <th scope="col" className="py-2 pr-3 text-right font-medium">
                {t("spacecraft.colSpeed")}
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                {t("spacecraft.colLightYear")}
              </th>
            </tr>
          </thead>
          <tbody>
            {SPACECRAFT.map((c) => {
              const name = t(`spacecraft.craft.${c.id}.name`);
              const highlighted = c.stopId && c.stopId === highlightId;
              return (
                <tr
                  key={c.id}
                  className={
                    highlighted
                      ? "border-b border-white/5 bg-cosmos-aurora/10"
                      : "border-b border-white/5"
                  }
                >
                  <td className="py-3 pr-3 align-top">
                    {c.stopId && !highlighted ? (
                      <Link
                        href={`/${locale}/stop/${c.stopId}`}
                        className="font-medium text-cosmos-star underline decoration-cosmos-aurora/40 decoration-dotted underline-offset-4 hover:text-cosmos-aurora"
                      >
                        {name}
                      </Link>
                    ) : (
                      <span className="font-medium text-cosmos-star">
                        {name}
                      </span>
                    )}
                    <span className="mt-0.5 block text-xs text-cosmos-star/55">
                      {t(`spacecraft.craft.${c.id}.status`)}
                    </span>
                  </td>
                  <td className="py-3 pr-3 align-top font-mono text-cosmos-star/80">
                    {c.launchYear ?? "—"}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-3 text-right align-top font-mono text-cosmos-plasma">
                    {int(roundFriendly(kmPerHour(c.speedKmS)))} km/h
                    <span className="block text-xs text-cosmos-star/50">
                      {c.speedKmS.toLocaleString(loc)} km/s
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 text-right align-top font-mono text-cosmos-nova">
                    {t("spacecraft.years", {
                      years: int(roundFriendly(yearsPerLightYear(c.speedKmS))),
                    })}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="py-3 pr-3 align-top">
                <span className="font-medium text-cosmos-star">
                  {t("spacecraft.light.name")}
                </span>
                <span className="mt-0.5 block text-xs text-cosmos-star/55">
                  {t("spacecraft.light.status")}
                </span>
              </td>
              <td className="py-3 pr-3 align-top font-mono text-cosmos-star/80">
                —
              </td>
              <td className="whitespace-nowrap py-3 pr-3 text-right align-top font-mono text-cosmos-plasma">
                {int(roundFriendly(kmPerHour(SPEED_OF_LIGHT_KM_S)))} km/h
                <span className="block text-xs text-cosmos-star/50">
                  {int(SPEED_OF_LIGHT_KM_S)} km/s
                </span>
              </td>
              <td className="whitespace-nowrap py-3 text-right align-top font-mono text-cosmos-nova">
                {t("spacecraft.oneYear")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-cosmos-star/50">
        {t("spacecraft.footnote")}
      </p>
    </section>
  );
}
