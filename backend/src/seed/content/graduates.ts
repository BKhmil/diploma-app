export interface SeedGraduate {
  name: string;
  program?: string;
  position?: string;
  organization?: string;
  year?: string;
  rating: number;
  story: string;
  is_featured: boolean;
}

export const seedGraduates: SeedGraduate[] = [
  {
    name: 'Катерина Pixelova',
    program: 'UX-лабораторія',
    year: '2025',
    rating: 5,
    story: 'Після курсу зібрала портфоліо з трьома кейсами — це демо-відгук seed v2 з колекції Graduate.',
    is_featured: true,
  },
  {
    name: 'Олег Databenko',
    program: 'Аналітика даних',
    year: '2025',
    rating: 5,
    story: 'SQL і дашборди тепер у щоденній роботі. Текст story — з Strapi, не з React.',
    is_featured: true,
  },
  {
    name: 'Марта Agileva',
    program: 'Agile-фасилітація',
    position: 'Scrum Master',
    organization: 'AgileHub Dnipro',
    year: '2024',
    rating: 4,
    story: 'Демо-історія про фасилітацію спринтів.',
    is_featured: false,
  },
  {
    name: 'Ігор Cloudov',
    program: 'Хмарні технології',
    position: 'Junior DevOps',
    year: '2024',
    rating: 5,
    story: 'Перейшов з підтримки в інфраструктуру — seed v2.',
    is_featured: false,
  },
  {
    name: 'Анна Greenko',
    program: 'ESG в освіті',
    organization: 'GreenLoop NGO',
    year: '2023',
    rating: 5,
    story: 'Запустила шкільний eco-проєкт — контент з Graduate.',
    is_featured: false,
  },
  {
    name: 'Влад Nmtchenko',
    program: 'НМТ: Математика',
    year: '2025',
    rating: 5,
    story: 'Демо-бал 192 — перевірка блоку випускників на /alumni.',
    is_featured: false,
  },
];

export const graduatesEnTranslations: Record<string, { story?: string; position?: string; organization?: string; program?: string }> = {
  'Катерина Pixelova': {
    program: 'UX Lab',
    story: 'After the course I built a portfolio with three cases — seed v2 demo review from Graduate collection.',
  },
  'Олег Databenko': {
    program: 'Data Analytics',
    story: 'SQL and dashboards are now daily work. story text is from Strapi, not React.',
  },
  'Марта Agileva': {
    program: 'Agile Facilitation',
    position: 'Scrum Master',
    organization: 'AgileHub Dnipro',
    story: 'Demo story about facilitating sprints.',
  },
  'Ігор Cloudov': {
    program: 'Cloud Technologies',
    position: 'Junior DevOps',
    story: 'Moved from support to infrastructure — seed v2.',
  },
  'Анна Greenko': {
    program: 'ESG in Education',
    organization: 'GreenLoop NGO',
    story: 'Launched a school eco project — content from Graduate.',
  },
  'Влад Nmtchenko': {
    program: 'NMT: Mathematics',
    story: 'Demo score 192 — check alumni block on /alumni.',
  },
};
