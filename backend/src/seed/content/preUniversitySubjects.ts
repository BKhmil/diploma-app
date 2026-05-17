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
  { subject_key: 'math', name: 'НМТ-Математика (основна група)', subject: 'Математика', description: 'Алгебра, геометрія, елементи аналізу. Поглиблений курс.', format: 'onsite', icon_emoji: '📐', price_hint: 'від 2 800 грн', is_popular: true },
  { subject_key: 'ukr', name: 'НМТ-Українська мова (основна група)', subject: 'Українська мова', description: 'Орфографія, синтаксис, текст. Підготовка до завдань тесту.', format: 'onsite', icon_emoji: '📖', price_hint: 'від 2 500 грн', is_popular: true },
  { subject_key: 'chem', name: 'НМТ-Хімія', subject: 'Хімія', description: 'Неорганічна та органічна хімія. Задачі та теорія.', format: 'onsite', icon_emoji: '🧪', price_hint: 'від 2 500 грн', is_popular: false },
  { subject_key: 'bio', name: 'НМТ-Біологія', subject: 'Біологія', description: 'Ботаніка, зоологія, анатомія людини, генетика.', format: 'onsite', icon_emoji: '🔬', price_hint: 'від 2 500 грн', is_popular: false },
  { subject_key: 'phys', name: 'НМТ-Фізика', subject: 'Фізика', description: 'Механіка, електрика, термодинаміка, оптика.', format: 'onsite', icon_emoji: '⚛️', price_hint: 'від 2 500 грн', is_popular: false },
  { subject_key: 'geo', name: 'НМТ-Географія', subject: 'Географія', description: 'Фізична і соціальна географія України та світу.', format: 'online', icon_emoji: '🌍', price_hint: 'від 2 200 грн', is_popular: false },
  { subject_key: 'hist', name: 'НМТ-Історія України', subject: 'Історія України', description: 'Від давніх часів до сьогодення. Аналіз документів.', format: 'online', icon_emoji: '🏛', price_hint: 'від 2 200 грн', is_popular: false },
  { subject_key: 'eng', name: 'НМТ-Англійська мова', subject: 'Англійська мова', description: 'Граматика, читання, говоріння. Рівень B1–B2.', format: 'online', icon_emoji: '🌐', price_hint: 'від 3 000 грн', is_popular: false },
];

export const preUniversityEnTranslations: Record<string, Partial<SeedPreUniversitySubject>> = {
  math: { name: 'NMT Mathematics (main group)', subject: 'Mathematics', description: 'Algebra, geometry, calculus fundamentals. Advanced course.' },
  ukr: { name: 'NMT Ukrainian Language (main group)', subject: 'Ukrainian Language', description: 'Orthography, syntax, text analysis. Test preparation.' },
  chem: { name: 'NMT Chemistry', subject: 'Chemistry', description: 'Inorganic and organic chemistry. Problems and theory.' },
  bio: { name: 'NMT Biology', subject: 'Biology', description: 'Botany, zoology, human anatomy, genetics.' },
  phys: { name: 'NMT Physics', subject: 'Physics', description: 'Mechanics, electricity, thermodynamics, optics.' },
  geo: { name: 'NMT Geography', subject: 'Geography', description: 'Physical and social geography of Ukraine and the world.' },
  hist: { name: 'NMT History of Ukraine', subject: 'History of Ukraine', description: 'From ancient times to the present. Document analysis.' },
  eng: { name: 'NMT English Language', subject: 'English Language', description: 'Grammar, reading, speaking. Level B1–B2.' },
};
