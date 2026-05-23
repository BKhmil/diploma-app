export interface SeedDocument {
  document_code: string;
  title: string;
  meta?: string;
  description?: string;
  type: 'license' | 'regulation' | 'contract' | 'application' | 'certificate' | 'other';
  doc_category: 'licenses' | 'regulations' | 'programs' | 'samples';
}

export const seedDocuments: SeedDocument[] = [
  {
    document_code: 'lic-001',
    title: 'Демо-ліцензія seed v2 на освітню діяльність',
    meta: 'Серія SEED-001 · Демо · 2026',
    description: 'Документ колекції Document — категорія licenses.',
    type: 'license',
    doc_category: 'licenses',
  },
  {
    document_code: 'lic-002',
    title: 'Демо-сертифікат якості програм',
    meta: 'Серія SEED-002 · 2026',
    description: 'Другий запис licenses для превʼю на About.',
    type: 'license',
    doc_category: 'licenses',
  },
  {
    document_code: 'reg-001',
    title: 'Регламент демо-центру seed v2',
    meta: 'Затверджено демо-радою · 2026',
    description: 'Категорія regulations.',
    type: 'regulation',
    doc_category: 'regulations',
  },
  {
    document_code: 'reg-002',
    title: 'Політика академічної доброчесності (демо)',
    meta: 'Версія 2.0 · seed',
    description: 'Ще один regulation для списку на /documents.',
    type: 'regulation',
    doc_category: 'regulations',
  },
  {
    document_code: 'reg-003',
    title: 'Порядок зарахування слухачів (демо)',
    meta: 'ЦНО seed v2 · 2026',
    description: 'Правила демо-набору.',
    type: 'regulation',
    doc_category: 'regulations',
  },
  {
    document_code: 'prg-001',
    title: 'Силабус: UX-лабораторія (72 год.)',
    meta: 'Program q1 · seed',
    description: 'Категорія programs — навчальний план.',
    type: 'other',
    doc_category: 'programs',
  },
  {
    document_code: 'smp-001',
    title: 'Заявка на навчання — демо-форма',
    meta: 'Зразок PDF',
    description: 'Категорія samples.',
    type: 'application',
    doc_category: 'samples',
  },
  {
    document_code: 'smp-002',
    title: 'Договір освітніх послуг — демо',
    meta: 'Зразок договору',
    description: 'Другий sample для UI.',
    type: 'contract',
    doc_category: 'samples',
  },
];

export const documentsEnTranslations: Record<string, Partial<SeedDocument>> = {
  'lic-001': {
    title: 'Seed v2 demo license for educational activities',
    meta: 'Series SEED-001 · Demo · 2026',
    description: 'Document collection entry — licenses category.',
  },
  'lic-002': {
    title: 'Demo program quality certificate',
    meta: 'Series SEED-002 · 2026',
    description: 'Second licenses entry for About preview.',
  },
  'reg-001': {
    title: 'Seed v2 demo center regulations',
    meta: 'Approved by demo council · 2026',
    description: 'Regulations category.',
  },
  'reg-002': {
    title: 'Academic integrity policy (demo)',
    meta: 'Version 2.0 · seed',
    description: 'Another regulation for /documents list.',
  },
  'reg-003': {
    title: 'Student enrollment procedure (demo)',
    meta: 'CLE seed v2 · 2026',
    description: 'Demo intake rules.',
  },
  'prg-001': {
    title: 'Syllabus: UX Lab (72 hrs)',
    meta: 'Program q1 · seed',
    description: 'Programs category — curriculum.',
  },
  'smp-001': {
    title: 'Study application — demo form',
    meta: 'Sample PDF',
    description: 'Samples category.',
  },
  'smp-002': {
    title: 'Educational services contract — demo',
    meta: 'Sample contract',
    description: 'Second sample for UI.',
  },
};
