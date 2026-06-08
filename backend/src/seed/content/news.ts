import { localizeUk, localizeEn } from '../locale';

export interface SeedNewsItem {
  news_key: string;
  date: string;
  category: 'news' | 'announcement' | 'event';
  is_pinned: boolean;
  title: string;
  excerpt: string;
  content: string;
}

export const seedNews: SeedNewsItem[] = [
  {
    news_key: 'news-001',
    date: '2026-04-01',
    category: 'announcement',
    is_pinned: true,
    title: 'Відкрито демо-набір seed v2',
    excerpt: 'Оголошення з колекції News — перевірте поля title, excerpt, content у Strapi.',
    content: 'Це перша демо-новина seed v2.\n\nУсі текстові поля редагуються в адмінці.\n\nРедагуйте в Content Manager → News.',
  },
  {
    news_key: 'news-002',
    date: '2026-04-15',
    category: 'event',
    is_pinned: false,
    title: 'День відкритих дверей CMS',
    excerpt: 'Подія для перевірки категорії event та блоку новин на головній.',
    content: 'Демо-подія seed v2.\n\nДата: 25 квітня 2026\nМісце: віртуальний кампус\n\nЗапис не обовʼязковий — це тестовий контент.',
  },
  {
    news_key: 'news-003',
    date: '2026-05-01',
    category: 'news',
    is_pinned: false,
    title: 'Запуск програми «UX-лабораторія»',
    excerpt: 'Новина про нову програму в каталозі Program (код q1 після оновлення seed).',
    content: 'Демо-новина про UX-лабораторію.\n\nПеревірте звʼязок: Home → news preview → News collection.\n\nКонтент повністю з Strapi.',
  },
];

export interface SeedNewsTranslation {
  title: string;
  excerpt: string;
  content: string;
}

export const newsEnTranslations: Record<string, SeedNewsTranslation> = {
  'news-001': {
    title: 'Demo intake seed v2 is open',
    excerpt: 'Announcement from News collection — check title, excerpt, content in Strapi.',
    content: 'This is the first seed v2 demo news item.\n\nAll text fields are edited in the admin.\n\nEdit in Content Manager → News.',
  },
  'news-002': {
    title: 'CMS open day',
    excerpt: 'Event to verify event category and home news preview.',
    content: 'Seed v2 demo event.\n\nDate: April 25, 2026\nPlace: virtual campus\n\nRegistration optional — test content only.',
  },
  'news-003': {
    title: 'UX Lab program launch',
    excerpt: 'News about a new Program catalog entry (code q1 after seed update).',
    content: 'Demo news about UX Lab.\n\nCheck flow: Home → news preview → News collection.\n\nContent is fully from Strapi.',
  },
};
