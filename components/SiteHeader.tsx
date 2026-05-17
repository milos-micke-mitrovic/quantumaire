"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavMenu } from "./NavMenu";
import { Search } from "./Search";
import { UnitSwitcher } from "./UnitSwitcher";

export function SiteHeader() {
  const { t, locale } = useI18n();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-cosmos-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-aurora/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmos-void rounded-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            aria-hidden
            width={28}
            height={28}
            className="h-7 w-7 drop-shadow-[0_0_12px_rgba(124,92,255,0.5)]"
          />
          <span className="font-display text-base font-semibold tracking-wide text-cosmos-star">
            {t("common.title")}
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Search />
          <NavMenu />
          <UnitSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
