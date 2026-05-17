export interface Program {
  id: string;
  title: string;
  category: 'qualification' | 'master' | 'pre-university' | 'retraining';
  duration: string;
  format: 'online' | 'offline' | 'mixed';
  credits?: number;
  description: string;
  targetAudience?: string;
  startDate?: string;
  price?: string;
  // Detail page fields
  certificate?: string;
  groupSize?: number;
  outcomes?: string[];
  modules?: { title: string; hours: number }[];
  faq?: { q: string; a: string }[];
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  category: 'news' | 'announcement' | 'event';
  imageUrl: string;
}
