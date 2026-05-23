export interface SeedPartner {
  name: string;
  type: 'employer' | 'university' | 'organization' | 'other';
  city?: string;
  agreement?: string;
  description?: string;
}

export const seedPartners: SeedPartner[] = [
  { name: 'PixelForge Studio', type: 'employer', city: 'Дніпро', agreement: 'Демо-договір UX', description: 'Спільна UX-лабораторія та стажування.' },
  { name: 'DataRiver Analytics', type: 'employer', city: 'Київ', agreement: 'Демо-договір Data', description: 'Практикуми з SQL та BI.' },
  { name: 'GreenLoop NGO', type: 'organization', city: 'Львів', agreement: 'Меморандум ESG', description: 'Курси сталого розвитку для НУО.' },
  { name: 'CloudNine IT', type: 'employer', city: 'Дніпро', agreement: 'Хмарний трек', description: 'Менторство DevOps та cloud.' },
  { name: 'AgileHub Dnipro', type: 'employer', city: 'Дніпро', agreement: 'Scrum-співпраця', description: 'Корпоративні Agile-інтенсиви.' },
  { name: 'North Star University', type: 'university', city: 'Харків', agreement: 'Академічний обмін', description: 'Взаємне визнання модулів.' },
  { name: 'River Tech College', type: 'university', city: 'Запоріжжя', agreement: 'Коледж-партнер', description: 'Підготовка до ВНЗ.' },
  { name: 'City Lab School', type: 'organization', city: 'Дніпро', agreement: 'НМТ-партнер', description: 'Спільні мок-іспити.' },
  { name: 'Open Civic Lab', type: 'organization', city: 'Дніпро', agreement: 'Громадський проєкт', description: 'Курси для волонтерів.' },
  { name: 'FinEdge Bank', type: 'employer', city: 'Київ', agreement: 'Фінансова грамотність', description: 'Перекваліфікація в аналітику.' },
  { name: 'MedNova Clinic', type: 'employer', city: 'Дніпро', agreement: 'Охорона праці', description: 'Soft skills для медперсоналу.' },
  { name: 'LogiStream', type: 'employer', city: 'Одеса', agreement: 'Логістика 4.0', description: 'Цифрові інструменти ланцюга поставок.' },
  { name: 'EduBridge Network', type: 'university', city: 'Київ', agreement: 'Мережа ВНЗ', description: 'Спільний каталог програм seed v2.' },
  { name: 'Youth Code Camp', type: 'organization', city: 'Дніпро', agreement: 'IT-табір', description: 'Підліткові модулі програмування.' },
];

export const partnersEnTranslations: Record<string, Partial<SeedPartner>> = {
  'PixelForge Studio': { name: 'PixelForge Studio', city: 'Dnipro', agreement: 'Demo UX agreement', description: 'Joint UX lab and internships.' },
  'DataRiver Analytics': { name: 'DataRiver Analytics', city: 'Kyiv', agreement: 'Demo Data agreement', description: 'SQL and BI practicums.' },
  'GreenLoop NGO': { name: 'GreenLoop NGO', city: 'Lviv', agreement: 'ESG memorandum', description: 'Sustainability courses for NGOs.' },
  'CloudNine IT': { name: 'CloudNine IT', city: 'Dnipro', agreement: 'Cloud track', description: 'DevOps and cloud mentoring.' },
  'AgileHub Dnipro': { name: 'AgileHub Dnipro', city: 'Dnipro', agreement: 'Scrum partnership', description: 'Corporate Agile intensives.' },
  'North Star University': { name: 'North Star University', city: 'Kharkiv', agreement: 'Academic exchange', description: 'Mutual module recognition.' },
  'River Tech College': { name: 'River Tech College', city: 'Zaporizhzhia', agreement: 'College partner', description: 'University prep pathway.' },
  'City Lab School': { name: 'City Lab School', city: 'Dnipro', agreement: 'NMT partner', description: 'Joint mock exams.' },
  'Open Civic Lab': { name: 'Open Civic Lab', city: 'Dnipro', agreement: 'Civic project', description: 'Courses for volunteers.' },
  'FinEdge Bank': { name: 'FinEdge Bank', city: 'Kyiv', agreement: 'Financial literacy', description: 'Retraining into analytics.' },
  'MedNova Clinic': { name: 'MedNova Clinic', city: 'Dnipro', agreement: 'Workplace safety', description: 'Soft skills for medical staff.' },
  'LogiStream': { name: 'LogiStream', city: 'Odesa', agreement: 'Logistics 4.0', description: 'Digital supply chain tools.' },
  'EduBridge Network': { name: 'EduBridge Network', city: 'Kyiv', agreement: 'HEI network', description: 'Shared seed v2 program catalog.' },
  'Youth Code Camp': { name: 'Youth Code Camp', city: 'Dnipro', agreement: 'IT camp', description: 'Teen programming modules.' },
};
