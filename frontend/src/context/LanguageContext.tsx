import React, { createContext, useContext, useMemo, useState } from 'react';

export type AppLocale = 'uk' | 'en';

const STORAGE_KEY = 'app-locale';

interface LanguageContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const getInitialLocale = (): AppLocale => {
  const fallback = (import.meta.env.VITE_STRAPI_LOCALE || 'uk').toLowerCase();
  if (typeof window === 'undefined') {
    return fallback === 'en' ? 'en' : 'uk';
  }
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'uk' || saved === 'en') return saved;
  return fallback === 'en' ? 'en' : 'uk';
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(getInitialLocale);

  const setLocale = (nextLocale: AppLocale) => {
    setLocaleState(nextLocale);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    }
  };

  const toggleLocale = () => setLocale(locale === 'uk' ? 'en' : 'uk');

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
