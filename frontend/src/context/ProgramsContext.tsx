import React, { createContext, useContext, useEffect, useState } from 'react';
import { Program } from '../types';
import { getPrograms } from '../services/strapi';
import { useLanguage } from './LanguageContext';

interface ProgramsContextValue {
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
}

const ProgramsContext = createContext<ProgramsContextValue | null>(null);

export function ProgramsProvider({ children }: { children: React.ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const { locale } = useLanguage();

  useEffect(() => {
    let mounted = true;
    getPrograms(locale)
      .then((items) => {
        if (mounted) {
          setPrograms(items);
        }
      })
      .catch(() => {
        if (mounted) setPrograms([]);
      });

    return () => {
      mounted = false;
    };
  }, [locale]);

  return (
    <ProgramsContext.Provider value={{ programs, setPrograms }}>
      {children}
    </ProgramsContext.Provider>
  );
}

export function usePrograms() {
  const ctx = useContext(ProgramsContext);
  if (!ctx) throw new Error('usePrograms must be used inside ProgramsProvider');
  return ctx;
}
