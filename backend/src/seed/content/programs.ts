export interface SeedProgram {
  program_code: string;
  title: string;
  category: 'qualification' | 'master' | 'pre-university' | 'retraining';
  duration: number;
  duration_unit: 'weeks' | 'months' | 'years';
  format: 'online' | 'offline' | 'mixed';
  credits?: number;
  certificate?: string;
  group_size?: number;
  description: string;
  target_audience?: string;
  start_date?: string;
  price?: number;
  outcomes?: string[];
  modules?: { title: string; hours: number }[];
  faq?: { q: string; a: string }[];
  status: 'active';
}

const mk = (
  program_code: string,
  title: string,
  category: SeedProgram['category'],
  duration: number,
  duration_unit: SeedProgram['duration_unit'],
  format: SeedProgram['format'],
  description: string,
  extra: Partial<SeedProgram> = {}
): SeedProgram => ({
  program_code,
  title,
  category,
  duration,
  duration_unit,
  format,
  description,
  certificate: 'Демо-посвідчення seed v2',
  group_size: 16,
  start_date: '2026-09-01',
  price: 4200,
  target_audience: 'Фахівці та студенти (демо-аудиторія)',
  outcomes: ['Розуміти структуру програми в Strapi', 'Бачити мітку (new) після seed', 'Редагувати контент без деплою'],
  modules: [
    { title: 'Модуль 1: Вступ', hours: 12 },
    { title: 'Модуль 2: Практика', hours: 24 },
    { title: 'Модуль 3: Підсумок', hours: 12 },
  ],
  faq: [
    { q: 'Звідки цей текст?', a: 'З колекції Program у Strapi — seed v2.' },
    { q: 'Чи реальний курс?', a: 'Ні, це демо-дані для перевірки CMS.' },
  ],
  status: 'active',
  ...extra,
});

export const seedPrograms: SeedProgram[] = [
  mk('q1', 'UX-лабораторія: інтерфейси', 'qualification', 6, 'weeks', 'mixed', 'Демо-курс UX — код q1. Перевірте картку на /qualification.', { credits: 6, price: 3900 }),
  mk('q2', 'Аналітика даних: старт', 'qualification', 2, 'months', 'online', 'SQL, таблиці, базові дашборди — seed v2.', { price: 4500 }),
  mk('q3', 'Agile-фасилітація', 'qualification', 1, 'months', 'offline', 'Scrum, Kanban, фасилітація зустрічей.', { format: 'offline', price: 3200 }),
  mk('q4', 'Кіберггієна для освітян', 'qualification', 3, 'weeks', 'online', 'Паролі, фішинг, захист даних.', { credits: 4 }),
  mk('q5', 'ESG в закладах освіти', 'qualification', 1, 'months', 'mixed', 'Сталий розвиток у школах та ВНЗ.'),
  mk('q6', 'Медіаграмотність 2.0', 'qualification', 2, 'weeks', 'online', 'Фейки, джерела, критичне читання.'),
  mk('q7', 'Комунікація в кризах', 'qualification', 1, 'months', 'mixed', 'Публічні виступи та кризові брифінги.'),
  mk('q8', 'AI-асистенти в роботі', 'qualification', 3, 'weeks', 'online', 'ChatGPT, Copilot, політики використання.', { price: 2800 }),
  mk('r1', 'Юридична перекваліфікація (інтенсив)', 'retraining', 14, 'months', 'mixed', 'Друга вища — демо-трек r1.', { duration_unit: 'months', duration: 14, price: 28000 }),
  mk('r2', 'Digital marketing з нуля', 'retraining', 10, 'months', 'online', 'SMM, контент, аналітика кампаній.', { duration: 10 }),
  mk('r3', 'HR analytics', 'retraining', 12, 'months', 'mixed', 'Метрики персоналу та People Analytics.', { duration: 12 }),
  mk('m1', 'Магістр: продуктовий менеджмент', 'master', 2, 'years', 'mixed', 'Магістерський трек m1 — seed v2.', { duration_unit: 'years', certificate: 'Демо-диплом магістра' }),
  mk('m2', 'Магістр: data science', 'master', 2, 'years', 'online', 'ML basics, Python, етика даних.', { duration_unit: 'years' }),
  mk('p1', 'НМТ: Математика (інтенсив)', 'pre-university', 4, 'months', 'offline', 'Предмет p1 — звʼязок з pre-university-group math.', { price: 950, group_size: 10 }),
  mk('p2', 'НМТ: Історія України', 'pre-university', 4, 'months', 'online', 'Предмет p2 — онлайн-формат.', { format: 'online', price: 820 }),
  mk('p3', 'НМТ: Англійська мова', 'pre-university', 4, 'months', 'online', 'Предмет p3 — B1+.', { format: 'online', price: 990 }),
  mk('p4', 'НМТ: Біологія', 'pre-university', 4, 'months', 'offline', 'Предмет p4 — лабораторні модулі.', { format: 'offline' }),
  mk('p5', 'НМТ: Фізика', 'pre-university', 4, 'months', 'offline', 'Предмет p5 — задачі НМТ.', { format: 'offline' }),
];
