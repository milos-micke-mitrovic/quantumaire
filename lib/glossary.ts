import en from "@/locales/en.json";

type Dict = Record<string, unknown>;

/**
 * The full ordered list of glossary keys.
 *
 * Keys are language-agnostic — we enumerate from the English file, but the
 * same keys exist in every locale.
 */
export const GLOSSARY_KEYS: string[] = Object.keys(
  (en as Dict).glossary as Dict
);
