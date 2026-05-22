import { NewsItem, Program } from '../types';

export const HERO_SLIDES = [
  {
    id: 1,
    title: "Навчання протягом життя",
    subtitle: "Центр неперервної освіти ДНУ ім. О. Гончара",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    cta: "Обрати програму",
    link: "/qualification"
  },
  {
    id: 2,
    title: "Підготовка до НМТ та вступу",
    subtitle: "Якісна підготовка до успішного складання іспитів",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    cta: "Дізнатись більше",
    link: "/pre-university"
  }
];

export const KEY_DIRECTIONS = [
  {
    id: 'qualification',
    title: 'Підвищення кваліфікації',
    description: 'Короткострокові курси для фахівців різних галузей. Отримайте нові навички та сертифікат.',
    icon: 'BookOpen',
    link: '/qualification',
    color: 'bg-blue-50 text-dnu-blue'
  },
  {
    id: 'retraining',
    title: 'Перепідготовка',
    description: 'Здобуття нової професії або другої вищої освіти. Диплом державного зразка.',
    icon: 'RefreshCw',
    link: '/retraining',
    color: 'bg-yellow-50 text-yellow-700'
  },
  {
    id: 'pre-university',
    title: 'Вступникам (НМТ)',
    description: 'Курси підготовки до НМТ, ЄВІ та ЄФВВ. Гарантія якісної підготовки до вступу.',
    icon: 'GraduationCap',
    link: '/pre-university',
    color: 'bg-green-50 text-green-700'
  },
  {
    id: 'internship',
    title: 'Стажування',
    description: 'Програми стажування для викладачів та науковців. Обмін досвідом та підвищення майстерності.',
    icon: 'Briefcase',
    link: '/internship',
    color: 'bg-purple-50 text-purple-700'
  }
];

export const PROGRAMS: Program[] = [
  {
    id: '1',
    title: 'Психологія стресу та резильєнтність',
    category: 'qualification',
    duration: 2,
    format: 'online',
    credits: 2,
    description: 'Курс спрямований на розвиток навичок подолання стресу та формування психологічної стійкості.',
    targetAudience: 'Психологи, соціальні працівники, педагоги',
    price: 3500
  },
  {
    id: '2',
    title: 'Сучасні методики викладання іноземних мов',
    category: 'qualification',
    duration: 1,
    format: 'mixed',
    credits: 1.5,
    description: 'Огляд новітніх підходів до викладання англійської та німецької мов у закладах середньої освіти.',
    targetAudience: 'Вчителі іноземних мов',
    price: 2800
  },
  {
    id: '3',
    title: 'Основи проєктного менеджменту в освіті',
    category: 'qualification',
    duration: 1,
    format: 'online',
    credits: 1,
    description: 'Навчіться керувати освітніми проєктами, від ідеї до реалізації та звітності.',
    targetAudience: 'Керівники закладів освіти, методисти',
    price: 2000
  },
  {
    id: '4',
    title: 'Публічне управління та адміністрування',
    category: 'retraining',
    duration: 18,
    format: 'mixed',
    description: 'Здобуття ступеня магістра за спеціальністю "Публічне управління та адміністрування".',
    targetAudience: 'Державні службовці, посадові особи місцевого самоврядування',
    price: 1500
  },
  {
    id: '5',
    title: 'Підготовка до НМТ: Математика',
    category: 'pre-university',
    duration: 8,
    format: 'offline',
    description: 'Поглиблений курс математики для підготовки до національного мультипредметного тесту.',
    targetAudience: 'Учні 11 класів',
    price: 1200
  },
  {
    id: '6',
    title: 'Підготовка до НМТ: Історія України',
    category: 'pre-university',
    duration: 8,
    format: 'online',
    description: 'Систематизація знань з історії України для успішного складання НМТ.',
    targetAudience: 'Учні 11 класів',
    price: 1000
  }
];
export const LATEST_NEWS: NewsItem[] = [
  {
    id: '1',
    date: '2023-10-15',
    title: 'Відкрито набір на курси підготовки до НМТ-2024',
    summary: 'Запрошуємо учнів 11 класів на підготовчі курси з математики, української мови та історії України.',
    category: 'announcement',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca28497b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    date: '2023-10-10',
    title: 'Успішне завершення курсів підвищення кваліфікації для педагогів',
    summary: 'Більше 50 вчителів шкіл міста отримали сертифікати про підвищення кваліфікації.',
    category: 'news',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    date: '2023-09-25',
    title: 'Нова програма: "Психологія стресу та резильєнтність"',
    summary: 'Запускаємо актуальний курс для психологів та соціальних працівників.',
    category: 'announcement',
    imageUrl: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];
