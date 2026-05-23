export interface SeedPreUniversitySubject {
  subject_key: string;
  name: string;
  subject: string;
  description?: string;
  format: 'onsite' | 'online';
  icon_emoji?: string;
  price_hint?: string;
  is_popular?: boolean;
}

export const seedPreUniversitySubjects: SeedPreUniversitySubject[] = [
  { subject_key: 'math', name: 'НМТ: Математика (seed)', subject: 'Математика', description: 'Алгебра та геометрія — демо-опис з pre-university-group.', format: 'onsite', icon_emoji: '📐', price_hint: 'від 950 грн/міс', is_popular: true },
  { subject_key: 'ukr', name: 'НМТ: Українська мова (seed)', subject: 'Українська мова', description: 'Мова та текст — колекція Strapi.', format: 'onsite', icon_emoji: '📖', price_hint: 'від 900 грн/міс', is_popular: true },
  { subject_key: 'chem', name: 'НМТ: Хімія (seed)', subject: 'Хімія', description: 'Демо-предмет хімії.', format: 'onsite', icon_emoji: '🧪', price_hint: 'від 880 грн/міс', is_popular: false },
  { subject_key: 'bio', name: 'НМТ: Біологія (seed)', subject: 'Біологія', description: 'Демо-предмет біології.', format: 'onsite', icon_emoji: '🔬', price_hint: 'від 880 грн/міс', is_popular: false },
  { subject_key: 'phys', name: 'НМТ: Фізика (seed)', subject: 'Фізика', description: 'Демо-предмет фізики.', format: 'onsite', icon_emoji: '⚛️', price_hint: 'від 880 грн/міс', is_popular: false },
  { subject_key: 'geo', name: 'НМТ: Географія (seed)', subject: 'Географія', description: 'Онлайн-формат — seed v2.', format: 'online', icon_emoji: '🌍', price_hint: 'від 820 грн/міс', is_popular: false },
  { subject_key: 'hist', name: 'НМТ: Історія (seed)', subject: 'Історія України', description: 'Пакет з pre-university-page bundle.', format: 'online', icon_emoji: '🏛', price_hint: 'від 820 грн/міс', is_popular: true },
  { subject_key: 'eng', name: 'НМТ: Англійська (seed)', subject: 'Англійська мова', description: 'Рівень B1+ — демо.', format: 'online', icon_emoji: '🌐', price_hint: 'від 990 грн/міс', is_popular: false },
];

export const preUniversityEnTranslations: Record<string, Partial<SeedPreUniversitySubject>> = {
  math: { name: 'NMT: Mathematics (seed)', subject: 'Mathematics', description: 'Algebra and geometry — demo copy from pre-university-group.' },
  ukr: { name: 'NMT: Ukrainian (seed)', subject: 'Ukrainian Language', description: 'Language and text — Strapi collection.' },
  chem: { name: 'NMT: Chemistry (seed)', subject: 'Chemistry', description: 'Demo chemistry subject.' },
  bio: { name: 'NMT: Biology (seed)', subject: 'Biology', description: 'Demo biology subject.' },
  phys: { name: 'NMT: Physics (seed)', subject: 'Physics', description: 'Demo physics subject.' },
  geo: { name: 'NMT: Geography (seed)', subject: 'Geography', description: 'Online format — seed v2.' },
  hist: { name: 'NMT: History (seed)', subject: 'History of Ukraine', description: 'Bundle with pre-university-page.' },
  eng: { name: 'NMT: English (seed)', subject: 'English', description: 'B1+ level — demo.' },
};
