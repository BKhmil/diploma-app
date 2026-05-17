import React, { createContext, useContext, useEffect, useState } from 'react';
import { programs as initialPrograms } from '../data/programs';
import { Program } from '../types';
import { getPrograms } from '../services/strapi';
import { useLanguage } from './LanguageContext';

interface ProgramsContextValue {
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
}

const ProgramsContext = createContext<ProgramsContextValue | null>(null);

export function ProgramsProvider({ children }: { children: React.ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const { locale } = useLanguage();

  useEffect(() => {
    let mounted = true;
    getPrograms(locale)
      .then((items) => {
        if (mounted && items.length > 0) {
          setPrograms(items);
        }
      })
      .catch(() => {
        // Keep static fallback when backend is unavailable.
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
