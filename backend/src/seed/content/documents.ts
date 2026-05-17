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
    title: 'Ліцензія МОН України на провадження освітньої діяльності',
    meta: 'Серія АА №123456 · Дійсна до 2028 · Оновлено: 15.06.2023',
    description: 'Основний дозвільний документ на здійснення освітньої діяльності.',
    type: 'license',
    doc_category: 'licenses',
  },
  {
    document_code: 'lic-002',
    title: 'Свідоцтво про акредитацію',
    meta: 'Серія НД №789012 · Оновлено: 22.03.2022',
    description: 'Підтвердження якості освітніх програм від акредитаційних органів.',
    type: 'license',
    doc_category: 'licenses',
  },
  {
    document_code: 'reg-001',
    title: 'Положення про Центр неперервної освіти ДНУ',
    meta: 'Затверджено вченою радою ДНУ · 2022',
    description: 'Основний внутрішній нормативний документ Центру.',
    type: 'regulation',
    doc_category: 'regulations',
  },
  {
    document_code: 'reg-002',
    title: 'Статут ДНУ ім. Олеся Гончара',
    meta: 'Зареєстровано МОН України · Редакція 2021',
    description: 'Основний установчий документ університету.',
    type: 'regulation',
    doc_category: 'regulations',
  },
  {
    document_code: 'reg-003',
    title: 'Порядок зарахування слухачів на навчання',
    meta: 'Затверджено директором ЦНО · 2023',
    description: 'Правила і процедури зарахування на освітні програми.',
    type: 'regulation',
    doc_category: 'regulations',
  },
  {
    document_code: 'prg-001',
    title: 'Навч. програма: Педагогічна майстерність (120 год.)',
    meta: 'ПК · Затверджено 2024',
    description: 'Офіційна навчальна програма курсу підвищення кваліфікації.',
    type: 'other',
    doc_category: 'programs',
  },
  {
    document_code: 'smp-001',
    title: 'Заява на вступ — форма для підвищення кваліфікації',
    meta: 'Форма для заповнення',
    description: 'Бланк заяви для подачі на курси підвищення кваліфікації.',
    type: 'application',
    doc_category: 'samples',
  },
  {
    document_code: 'smp-002',
    title: 'Договір про надання освітніх послуг',
    meta: 'Зразок договору (контракт)',
    description: 'Типова форма договору між слухачем та Центром.',
    type: 'contract',
    doc_category: 'samples',
  },
];

export const documentsEnTranslations: Record<string, Partial<SeedDocument>> = {
  'lic-001': { title: 'Ministry of Education License for Educational Activities', meta: 'Series AA No.123456 · Valid until 2028 · Updated: 15.06.2023', description: 'Main permit document for conducting educational activities.' },
  'lic-002': { title: 'Accreditation Certificate', meta: 'Series ND No.789012 · Updated: 22.03.2022', description: 'Quality confirmation of educational programs from accreditation bodies.' },
  'reg-001': { title: 'Regulations on the DNU Center for Lifelong Education', meta: 'Approved by DNU Academic Council · 2022', description: 'Main internal regulatory document of the Center.' },
  'reg-002': { title: 'Charter of Oles Honchar Dnipro National University', meta: 'Registered with Ministry of Education · 2021 Edition', description: 'Main founding document of the university.' },
  'reg-003': { title: 'Procedure for Enrollment of Students', meta: 'Approved by CNE Director · 2023', description: 'Rules and procedures for enrollment in educational programs.' },
  'prg-001': { title: 'Curriculum: Pedagogical Excellence (120 hrs)', meta: 'PD · Approved 2024', description: 'Official curriculum for the professional development course.' },
  'smp-001': { title: 'Application Form for Professional Development', meta: 'Form to fill in', description: 'Application form for professional development courses.' },
  'smp-002': { title: 'Educational Services Contract', meta: 'Sample contract', description: 'Standard contract form between the student and the Center.' },
};
