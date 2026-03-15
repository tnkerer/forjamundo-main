import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from "react";
import { ptBR, type Translations } from "./locales/pt-BR";
import { en } from "./locales/en";

// ── Available locales ────────────────────────────────────────────────
export const locales = {
  "pt-BR": ptBR,
  "en": en,
} as const;

export type LocaleCode = keyof typeof locales;

// ── Context ──────────────────────────────────────────────────────────
interface I18nContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ── Storage key ──────────────────────────────────────────────────────
const STORAGE_KEY = "forjamundo-locale";

// ── Detect browser language ──────────────────────────────────────────
function detectBrowserLocale(): LocaleCode {
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "pt-BR";

  // Check for exact match
  if (browserLang in locales) {
    return browserLang as LocaleCode;
  }

  // Check for language prefix match (e.g., "pt" matches "pt-BR")
  const langPrefix = browserLang.split("-")[0];
  for (const code of Object.keys(locales) as LocaleCode[]) {
    if (code.startsWith(langPrefix)) {
      return code;
    }
  }

  // Default to Portuguese
  return "pt-BR";
}

// ── Provider ─────────────────────────────────────────────────────────
export const I18nProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in locales) {
      return stored as LocaleCode;
    }
    // Otherwise detect from browser
    return detectBrowserLocale();
  });

  const setLocale = (newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  };

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: locales[locale],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

// ── Hook ─────────────────────────────────────────────────────────────
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}

// ── Get all available locales for the toggle ─────────────────────────
export function getAvailableLocales() {
  return Object.entries(locales).map(([code, translations]) => ({
    code: code as LocaleCode,
    name: translations._meta.name,
    flag: translations._meta.flag,
  }));
}
