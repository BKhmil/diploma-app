import { NewsItem } from '../types';

export const news: NewsItem[] = [
  {
    id: '1',
    date: '2026-02-20',
    title: 'Відкрито набір на курси підвищення кваліфікації для педагогів',
    summary: 'Запрошуємо педагогічних працівників закладів освіти на нові програми професійного розвитку.',
    category: 'announcement',
    imageUrl: 'https://picsum.photos/seed/news1/800/600'
  },
  {
    id: '2',
    date: '2026-02-15',
    title: 'День відкритих дверей у Центрі неперервної освіти',
    summary: 'Запрошуємо всіх бажаючих ознайомитися з нашими програмами та поспілкуватися з викладачами.',
    category: 'event',
    imageUrl: 'https://picsum.photos/seed/news2/800/600'
  },
  {
    id: '3',
    date: '2026-02-10',
    title: 'Нова програма: Штучний інтелект у бізнесі',
    summary: 'Запускаємо курс для підприємців, які хочуть інтегрувати AI у свої бізнес-процеси.',
    category: 'news',
    imageUrl: 'https://picsum.photos/seed/news3/800/600'
  }
];
