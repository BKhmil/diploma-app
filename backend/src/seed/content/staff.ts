export interface SeedStaff {
  name: string;
  position: string;
  degree?: string;
  department?: string;
  experience?: number;
  email?: string;
  programs_count?: number;
  tags?: string[];
  role: 'management' | 'teachers' | 'administration';
}

export const seedStaff: SeedStaff[] = [
  {
    name: 'Олена Seedenko',
    position: 'Директор демо-центру',
    degree: 'к.т.н.',
    experience: 14,
    email: 'direktor@dnu.dp.ua',
    programs_count: 6,
    tags: ['Стратегія', 'CMS'],
    role: 'management',
  },
  {
    name: 'Максим Demochuk',
    position: 'Заступник з навчання',
    degree: 'к.е.н.',
    experience: 11,
    email: 'zastupnyk@dnu.dp.ua',
    programs_count: 4,
    tags: ['Операції', 'Якість'],
    role: 'management',
  },
  {
    name: 'Ірина Strapina',
    position: 'Керівник коротких програм',
    degree: 'к.пед.н.',
    experience: 9,
    email: 'pk@dnu.dp.ua',
    programs_count: 10,
    tags: ['Qualification', 'UX'],
    role: 'management',
  },
  {
    name: 'Павло Contentov',
    position: 'Керівник перекваліфікації',
    degree: 'к.ю.н.',
    experience: 8,
    email: 'mags@dnu.dp.ua',
    programs_count: 5,
    tags: ['Retraining', 'Master'],
    role: 'management',
  },
  {
    name: 'Аліса Pixelova',
    position: 'Ментор UX-дизайну',
    degree: 'м.диз.',
    experience: 6,
    email: 'petrenko.a@dnu.dp.ua',
    programs_count: 3,
    tags: ['UX', 'Figma'],
    role: 'teachers',
  },
  {
    name: 'Денис Databenko',
    position: 'Ментор аналітики',
    degree: 'к.ф.-м.н.',
    experience: 7,
    email: 'goncharenko.d@dnu.dp.ua',
    programs_count: 4,
    tags: ['Data', 'SQL'],
    role: 'teachers',
  },
  {
    name: 'Софія Agileva',
    position: 'Ментор Agile',
    degree: 'MBA demo',
    experience: 5,
    email: 'koval.s@dnu.dp.ua',
    programs_count: 2,
    tags: ['Scrum', 'Kanban'],
    role: 'teachers',
  },
  {
    name: 'Тарас Nmtchenko',
    position: 'Викладач НМТ-блоку',
    degree: 'к.пед.н.',
    experience: 12,
    email: 'nazarenko.o@dnu.dp.ua',
    programs_count: 6,
    tags: ['НМТ', 'Математика'],
    role: 'teachers',
  },
  {
    name: 'Юлія Cloudova',
    position: 'Ментор хмарних технологій',
    degree: 'к.т.н.',
    experience: 4,
    email: 'shevchenko.m@dnu.dp.ua',
    programs_count: 2,
    tags: ['Cloud', 'DevOps'],
    role: 'teachers',
  },
  {
    name: 'Кирило Greenko',
    position: 'Ментор сталого розвитку',
    degree: 'к.біол.н.',
    experience: 5,
    email: 'lysenko.y@dnu.dp.ua',
    programs_count: 1,
    tags: ['ESG', 'Green'],
    role: 'teachers',
  },
  {
    name: 'Наталія Officeva',
    position: 'Головний бухгалтер (демо)',
    experience: 10,
    email: 'buh@dnu.dp.ua',
    tags: ['Фінанси'],
    role: 'administration',
  },
  {
    name: 'Віктор Priemov',
    position: 'Менеджер приймальної (демо)',
    experience: 3,
    email: 'priem@dnu.dp.ua',
    tags: ['Вступ', 'CRM'],
    role: 'administration',
  },
];

export const staffEnTranslations: Record<string, Partial<SeedStaff>> = {
  'direktor@dnu.dp.ua': {
    name: 'Olena Seedenko',
    position: 'Demo center director',
    degree: 'PhD tech',
    tags: ['Strategy', 'CMS'],
  },
  'zastupnyk@dnu.dp.ua': {
    name: 'Maksym Demochuk',
    position: 'Academic deputy',
    degree: 'PhD econ',
    tags: ['Operations', 'Quality'],
  },
  'pk@dnu.dp.ua': {
    name: 'Iryna Strapina',
    position: 'Short programs lead',
    degree: 'PhD ped',
    tags: ['Qualification', 'UX'],
  },
  'mags@dnu.dp.ua': {
    name: 'Pavlo Contentov',
    position: 'Retraining lead',
    degree: 'PhD law',
    tags: ['Retraining', 'Master'],
  },
  'petrenko.a@dnu.dp.ua': {
    name: 'Alisa Pixelova',
    position: 'UX design mentor',
    degree: 'MA design',
    tags: ['UX', 'Figma'],
  },
  'goncharenko.d@dnu.dp.ua': {
    name: 'Denys Databenko',
    position: 'Analytics mentor',
    degree: 'PhD math',
    tags: ['Data', 'SQL'],
  },
  'koval.s@dnu.dp.ua': {
    name: 'Sofia Agileva',
    position: 'Agile mentor',
    degree: 'MBA demo',
    tags: ['Scrum', 'Kanban'],
  },
  'nazarenko.o@dnu.dp.ua': {
    name: 'Taras Nmtchenko',
    position: 'NMT block teacher',
    degree: 'PhD ped',
    tags: ['NMT', 'Math'],
  },
  'shevchenko.m@dnu.dp.ua': {
    name: 'Yulia Cloudova',
    position: 'Cloud mentor',
    degree: 'PhD tech',
    tags: ['Cloud', 'DevOps'],
  },
  'lysenko.y@dnu.dp.ua': {
    name: 'Kyrylo Greenko',
    position: 'Sustainability mentor',
    degree: 'PhD bio',
    tags: ['ESG', 'Green'],
  },
  'buh@dnu.dp.ua': {
    name: 'Natalia Officeva',
    position: 'Chief accountant (demo)',
    tags: ['Finance'],
  },
  'priem@dnu.dp.ua': {
    name: 'Viktor Priemov',
    position: 'Admissions manager (demo)',
    tags: ['Intake', 'CRM'],
  },
};
