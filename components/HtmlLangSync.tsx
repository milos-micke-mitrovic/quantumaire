"use client";

import { useEffect } from "react";

interface HtmlLangSyncProps {
  /** BCP-47 language tag — e.g. "en" or "sr-Latn-RS". */
  lang: string;
}

/**
 * Syncs `<html lang>` to the active locale on the client. The root layout
 * renders `<html lang="en">` as the SSR default; this effect updates it to
 * the per-locale BCP-47 tag once the locale layout mounts, so screen
 * readers and JS-aware crawlers announce the right language.
 */
export function HtmlLangSync({ lang }: HtmlLangSyncProps) {
  useEffect(() => {
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);
  return null;
}
