export interface SeedPartner {
  name: string;
  type: 'employer' | 'university' | 'organization' | 'other';
  city?: string;
  agreement?: string;
  description?: string;
}

export const seedPartners: SeedPartner[] = [
  { name: 'Університет митної справи та фінансів', type: 'university', city: 'Дніпро', agreement: 'Меморандум про співпрацю', description: 'Спільні освітні програми та академічна мобільність.' },
  { name: 'Дніпровський державний технічний університет', type: 'university', city: 'Кам\'янське', agreement: 'Договір про співпрацю', description: 'Підвищення кваліфікації для викладачів.' },
  { name: 'Запорізький національний університет', type: 'university', city: 'Запоріжжя', agreement: 'Меморандум про співпрацю', description: 'Взаємне визнання результатів навчання.' },
  { name: 'Ліцей №100 м. Дніпра', type: 'organization', city: 'Дніпро', agreement: 'Підготовчі курси НМТ', description: 'Організація підготовчих курсів для абітурієнтів.' },
  { name: 'Криворізький державний педагогічний університет', type: 'university', city: 'Кривий Ріг', agreement: 'Договір про співпрацю', description: 'Спільні програми підвищення кваліфікації педагогів.' },
  { name: 'Навчально-науковий інститут неперервної освіти НПУ', type: 'university', city: 'Київ', agreement: 'Меморандум', description: 'Обмін досвідом у сфері неперервної освіти.' },
  { name: 'ДТЕК Дніпровські електромережі', type: 'employer', city: 'Дніпро', agreement: 'Договір про корпоративне навчання', description: 'Корпоративне навчання та підвищення кваліфікації персоналу.' },
  { name: 'Придніпровська залізниця', type: 'employer', city: 'Дніпро', agreement: 'Договір про підвищення кваліфікації', description: 'Програми перепідготовки для залізничників.' },
  { name: 'Дніпровська міська рада', type: 'organization', city: 'Дніпро', agreement: 'Меморандум про підготовку держслужбовців', description: 'Підготовка та перепідготовка муніципальних службовців.' },
  { name: 'Дніпропетровська обласна державна адміністрація', type: 'organization', city: 'Дніпро', agreement: 'Договір про підвищення кваліфікації', description: 'Навчання держслужбовців обласного рівня.' },
  { name: 'Obrii IT Cluster', type: 'employer', city: 'Дніпро', agreement: 'Договір про корпоративне навчання', description: 'Спільні програми цифрових навичок.' },
  { name: 'МРІЯ Агрохолдинг', type: 'employer', city: 'Дніпро', agreement: 'Договір про перепідготовку кадрів', description: 'Перенавчання та підвищення кваліфікації аграріїв.' },
  { name: 'АТ «Мотор Січ»', type: 'employer', city: 'Запоріжжя', agreement: 'Договір про корпоративне навчання', description: 'Технічна перепідготовка інженерних кадрів.' },
  { name: 'Центр зайнятості м. Дніпра', type: 'organization', city: 'Дніпро', agreement: 'Договір про перенавчання безробітних', description: 'Програми перенавчання для осіб, що шукають роботу.' },
];

export const partnersEnTranslations: Record<string, Partial<SeedPartner>> = {
  'Університет митної справи та фінансів': { name: 'University of Customs and Finance', city: 'Dnipro', agreement: 'Memorandum of Cooperation', description: 'Joint educational programs and academic mobility.' },
  'Дніпровський державний технічний університет': { name: 'Dnipro State Technical University', city: 'Kamianske', agreement: 'Cooperation Agreement', description: 'Professional development for teaching staff.' },
  'Запорізький національний університет': { name: 'Zaporizhzhia National University', city: 'Zaporizhzhia', agreement: 'Memorandum of Cooperation', description: 'Mutual recognition of learning outcomes.' },
  'Ліцей №100 м. Дніпра': { name: 'Lyceum No. 100, Dnipro', city: 'Dnipro', agreement: 'NMT Preparation Courses', description: 'Organizing preparatory courses for applicants.' },
  'Криворізький державний педагогічний університет': { name: 'Kryvyi Rih State Pedagogical University', city: 'Kryvyi Rih', agreement: 'Cooperation Agreement', description: 'Joint teacher professional development programs.' },
  'Навчально-науковий інститут неперервної освіти НПУ': { name: 'Institute of Continuing Education, NPU', city: 'Kyiv', agreement: 'Memorandum', description: 'Exchange of experience in continuing education.' },
  'ДТЕК Дніпровські електромережі': { name: 'DTEK Dnipro Electric Networks', city: 'Dnipro', agreement: 'Corporate Training Agreement', description: 'Corporate training and professional development.' },
  'Придніпровська залізниця': { name: 'Prydniprovska Railway', city: 'Dnipro', agreement: 'Professional Development Agreement', description: 'Retraining programs for railway workers.' },
  'Дніпровська міська рада': { name: 'Dnipro City Council', city: 'Dnipro', agreement: 'Civil Service Training Memorandum', description: 'Training and retraining of municipal employees.' },
  'Дніпропетровська обласна державна адміністрація': { name: 'Dnipropetrovsk Regional State Administration', city: 'Dnipro', agreement: 'Professional Development Agreement', description: 'Training of regional civil servants.' },
  'Obrii IT Cluster': { name: 'Obrii IT Cluster', city: 'Dnipro', agreement: 'Corporate Training Agreement', description: 'Joint digital skills programs.' },
  'МРІЯ Агрохолдинг': { name: 'MRIA Agroholding', city: 'Dnipro', agreement: 'Staff Retraining Agreement', description: 'Retraining and development of agricultural workers.' },
  'АТ «Мотор Січ»': { name: 'Motor Sich JSC', city: 'Zaporizhzhia', agreement: 'Corporate Training Agreement', description: 'Technical retraining for engineering staff.' },
  'Центр зайнятості м. Дніпра': { name: 'Dnipro Employment Center', city: 'Dnipro', agreement: 'Unemployed Retraining Agreement', description: 'Retraining programs for job seekers.' },
};
