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
    name: 'Кравченко Валентина Олегівна',
    position: 'Директор ЦНО',
    degree: 'д-р пед. наук, проф.',
    experience: 25,
    email: 'direktor@dnu.dp.ua',
    programs_count: 8,
    tags: ['Освіта дорослих', 'Менеджмент'],
    role: 'management',
  },
  {
    name: 'Білоус Іван Петрович',
    position: 'Заступник директора',
    degree: 'канд. пед. наук, доц.',
    experience: 18,
    email: 'zastupnyk@dnu.dp.ua',
    programs_count: 5,
    tags: ['Педагогіка', 'Адміністрування'],
    role: 'management',
  },
  {
    name: 'Мороз Ольга Сергіївна',
    position: 'Завідувач відділу підвищення кваліфікації',
    degree: 'канд. пед. наук',
    experience: 12,
    email: 'pk@dnu.dp.ua',
    programs_count: 12,
    tags: ['ПК', 'Методологія'],
    role: 'management',
  },
  {
    name: 'Ткаченко Руслан Миколайович',
    position: 'Завідувач відділу перепідготовки',
    degree: 'канд. юрид. наук',
    experience: 10,
    email: 'mags@dnu.dp.ua',
    programs_count: 6,
    tags: ['Перепідготовка', 'Право'],
    role: 'management',
  },
  {
    name: 'Петренко Анна Василівна',
    position: 'канд. психол. наук, доцент',
    department: 'Кафедра психології',
    experience: 15,
    email: 'petrenko.a@dnu.dp.ua',
    programs_count: 5,
    tags: ['Психологія', 'Педагогіка', 'Тренінги'],
    role: 'teachers',
  },
  {
    name: 'Гончаренко Дмитро Федорович',
    position: 'д-р екон. наук, проф.',
    department: 'Кафедра менеджменту',
    experience: 22,
    email: 'goncharenko.d@dnu.dp.ua',
    programs_count: 3,
    tags: ['Менеджмент', 'Фінанси', 'Бізнес'],
    role: 'teachers',
  },
  {
    name: 'Коваль Світлана Іванівна',
    position: 'Вчитель математики вищої категорії',
    department: 'Ліцей №15 м. Дніпра',
    experience: 19,
    email: 'koval.s@dnu.dp.ua',
    programs_count: 1,
    tags: ['НМТ Математика', 'Алгебра', 'Геометрія'],
    role: 'teachers',
  },
  {
    name: 'Назаренко Олексій Борисович',
    position: 'канд. філол. наук, доцент',
    department: 'Кафедра української мови',
    experience: 14,
    email: 'nazarenko.o@dnu.dp.ua',
    programs_count: 2,
    tags: ['Українська мова', 'НМТ Мова', 'Літературознавство'],
    role: 'teachers',
  },
  {
    name: 'Шевченко Марина Андріївна',
    position: 'канд. пед. наук',
    department: 'Кафедра педагогіки',
    experience: 11,
    email: 'shevchenko.m@dnu.dp.ua',
    programs_count: 4,
    tags: ['НУШ', 'Інклюзивна освіта', 'Дидактика'],
    role: 'teachers',
  },
  {
    name: 'Лисенко Ярослав Михайлович',
    position: 'канд. іст. наук, доцент',
    department: 'Кафедра історії',
    experience: 16,
    email: 'lysenko.y@dnu.dp.ua',
    programs_count: 2,
    tags: ['Історія України', 'НМТ Історія'],
    role: 'teachers',
  },
  {
    name: 'Харченко Оксана Вікторівна',
    position: 'Головний бухгалтер',
    experience: 8,
    email: 'buh@dnu.dp.ua',
    tags: ['Фінанси', 'Бухгалтерія'],
    role: 'administration',
  },
  {
    name: 'Сидоренко Тетяна Григорівна',
    position: 'Менеджер з прийому',
    experience: 5,
    email: 'priem@dnu.dp.ua',
    tags: ['Прийом', 'Документи'],
    role: 'administration',
  },
];

export const staffEnTranslations: Record<string, Partial<SeedStaff>> = {
  'direktor@dnu.dp.ua': { position: 'Director of CNE', degree: 'Dr. of Pedagogical Sciences, Prof.', tags: ['Adult Education', 'Management'] },
  'zastupnyk@dnu.dp.ua': { position: 'Deputy Director', degree: 'PhD in Pedagogical Sciences, Assoc. Prof.', tags: ['Pedagogy', 'Administration'] },
  'pk@dnu.dp.ua': { position: 'Head of Professional Development Department', degree: 'PhD in Pedagogical Sciences', tags: ['PD', 'Methodology'] },
  'mags@dnu.dp.ua': { position: 'Head of Retraining Department', degree: 'PhD in Legal Sciences', tags: ['Retraining', 'Law'] },
  'petrenko.a@dnu.dp.ua': { position: 'PhD in Psychology, Associate Professor', department: 'Department of Psychology', tags: ['Psychology', 'Pedagogy', 'Training'] },
  'goncharenko.d@dnu.dp.ua': { position: 'Dr. of Economic Sciences, Professor', department: 'Department of Management', tags: ['Management', 'Finance', 'Business'] },
  'koval.s@dnu.dp.ua': { position: 'Mathematics Teacher, Highest Category', department: 'Lyceum No. 15, Dnipro', tags: ['NMT Mathematics', 'Algebra', 'Geometry'] },
  'nazarenko.o@dnu.dp.ua': { position: 'PhD in Philology, Associate Professor', department: 'Department of Ukrainian Language', tags: ['Ukrainian Language', 'NMT Language', 'Literary Studies'] },
  'shevchenko.m@dnu.dp.ua': { position: 'PhD in Pedagogical Sciences', department: 'Department of Pedagogy', tags: ['NUS', 'Inclusive Education', 'Didactics'] },
  'lysenko.y@dnu.dp.ua': { position: 'PhD in Historical Sciences, Associate Professor', department: 'Department of History', tags: ['History of Ukraine', 'NMT History'] },
  'buh@dnu.dp.ua': { position: 'Chief Accountant', tags: ['Finance', 'Accounting'] },
  'priem@dnu.dp.ua': { position: 'Admissions Manager', tags: ['Admissions', 'Documents'] },
};
