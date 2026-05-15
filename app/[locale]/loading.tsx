"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function LocaleLoading() {
  const { t } = useI18n();
  return (
    <main className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <div
        aria-hidden
        className="relative h-12 w-12"
      >
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-cosmos-aurora/30 border-t-cosmos-nova"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
        <span className="absolute inset-[6px] rounded-full bg-cosmos-aurora/25 blur-md" />
      </div>
      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.32em] text-cosmos-star/55">
        {t("common.loading")}
      </p>
    </main>
  );
}
