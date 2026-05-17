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
    name: 'Андрій Коваленко',
    program: 'Педагогічна майстерність',
    year: '2024',
    rating: 5,
    story: 'Курс «Педагогічна майстерність» дав мені нові інструменти роботи з дітьми. Дуже практичний, без зайвої теорії.',
    is_featured: false,
  },
  {
    name: 'Марія Сидоренко',
    program: 'НМТ Математика',
    year: '2024',
    rating: 5,
    story: 'Підготувалась до НМТ на 187 балів! Викладач пояснив теми, з якими не могла розібратись два роки.',
    is_featured: false,
  },
  {
    name: 'Руслан Бондаренко',
    program: 'Менеджмент організацій (магістр)',
    position: 'Керівник відділу',
    year: '2023',
    rating: 4,
    story: 'Після здобуття диплома магістра з менеджменту мене підвищили до керівника відділу. Диплом ДНУ — це авторитет.',
    is_featured: false,
  },
  {
    name: 'Ірина Мороз',
    program: 'Інклюзивна освіта',
    year: '2024',
    rating: 5,
    story: 'Курс допоміг зрозуміти специфіку роботи з дітьми з особливими потребами. Рекомендую всім педагогам.',
    is_featured: false,
  },
  {
    name: 'Василь Ткаченко',
    program: 'Охорона праці в освіті',
    year: '2024',
    rating: 5,
    story: 'Отримав сертифікат вчасно до атестації. Навчання онлайн — зручно, без відриву від роботи.',
    is_featured: false,
  },
  {
    name: 'Наталія Захаренко',
    program: 'Право (перепідготовка)',
    position: 'Юрист',
    organization: 'приватна юридична фірма',
    year: '2023',
    rating: 5,
    story: 'Якісна юридична освіта за доступну ціну. Тепер працюю юристом у приватній фірмі.',
    is_featured: false,
  },
  {
    name: 'Олег Савченко',
    program: 'Публічне управління та адміністрування',
    position: 'Начальник відділу',
    organization: 'Дніпровська міська рада',
    year: '2022',
    rating: 5,
    story: 'Програма публічного управління дала мені системний погляд на роботу в держслужбі. Рекомендую всім, хто прагне кар\'єрного зростання в органах влади.',
    is_featured: true,
  },
];

export const graduatesEnTranslations: Record<string, { story?: string; position?: string; organization?: string; program?: string }> = {
  'Андрій Коваленко': {
    program: 'Pedagogical Excellence',
    story: 'The Pedagogical Excellence course gave me new tools for working with children. Very practical, no unnecessary theory.',
  },
  'Марія Сидоренко': {
    program: 'NMT Mathematics',
    story: 'I scored 187 on the NMT! The teacher explained topics I hadn\'t understood for two years.',
  },
  'Руслан Бондаренко': {
    program: 'Organizational Management (Master\'s)',
    position: 'Department Head',
    story: 'After receiving my master\'s degree in management, I was promoted to department head. A DNU diploma carries real authority.',
  },
  'Ірина Мороз': {
    program: 'Inclusive Education',
    story: 'The course helped me understand the specifics of working with children with special needs. I recommend it to all educators.',
  },
  'Василь Ткаченко': {
    program: 'Occupational Safety in Education',
    story: 'I received my certificate just in time for attestation. Online learning is convenient, without interrupting work.',
  },
  'Наталія Захаренко': {
    program: 'Law (Retraining)',
    position: 'Lawyer',
    organization: 'private law firm',
    story: 'Quality legal education at an affordable price. I now work as a lawyer at a private firm.',
  },
  'Олег Савченко': {
    program: 'Public Administration and Management',
    position: 'Department Head',
    organization: 'Dnipro City Council',
    story: 'The public administration program gave me a systematic view of civil service work. I recommend it to everyone aiming for career growth in government.',
  },
};
