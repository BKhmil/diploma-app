export interface Program {
  id: string;
  title: string;
  category: 'qualification' | 'master' | 'pre-university' | 'retraining';
  duration: number;
  duration_unit?: 'weeks' | 'months' | 'years';
  format: 'online' | 'offline' | 'mixed';
  credits?: number;
  description: string;
  targetAudience?: string;
  startDate?: string;
  price?: number;
  // Detail page fields
  certificate?: string;
  groupSize?: number;
  outcomes?: string[];
  modules?: { title: string; hours: number }[];
  faq?: { q: string; a: string }[];
  is_featured?: boolean;
}

export const formatDuration = (value: number | undefined, unit?: 'weeks' | 'months' | 'years'): string => {
  if (!value) return '—';
  const u = unit ?? 'months';
  if (u === 'weeks') return `${value} тиж.`;
  if (u === 'years') return `${value} р.`;
  return `${value} міс.`;
};

export const formatPrice = (price: number | undefined): string => {
  if (!price) return 'Безкоштовно';
  return `${price.toLocaleString('uk-UA')} грн`;
};

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  category: 'news' | 'announcement' | 'event';
  imageUrl: string;
}
