import { localizeUk, localizeEn } from '../../locale';

export const getAlumniUk = () => ({
  hero_badge_text: localizeUk('Демо-спільнота seed v2'),
  hero_title: localizeUk('Історії випускників з CMS'),
  hero_subtitle: localizeUk('Картки — колекція Graduate; заголовки — alumni-page single type.'),
  graduate_year_template: localizeUk('Випуск {year} · seed'),
  current_position_label: localizeUk('Зараз:'),
  cta_title: localizeUk('Долучитись до демо-спільноти'),
  cta_description: localizeUk('Текст CTA з Strapi — перевірте alumni-page в адмінці.'),
  testimonials_section_title: localizeUk('Відгуки (колекція Graduate)'),
  testimonials_section_subtitle: localizeUk('Поле story у кожному записі'),
  employment_section_title: localizeUk('Куди йдуть випускники (seed)'),
  employment_section_subtitle: localizeUk('Компонент employment_items'),
  achievements_section_title: localizeUk('Цифри досягнень (seed)'),
  hero_stats: [
    { value: '120', label: localizeUk('Демо-випускників'), order: 1 },
    { value: '24', label: localizeUk('Нових історій/рік'), order: 2 },
    { value: '96%', label: localizeUk('Задоволення (seed)'), order: 3 },
    { value: '71%', label: localizeUk('Карʼєрний стрибок'), order: 4 },
  ],
  employment_items: [
    { icon_key: 'education', value: '40%', label: localizeUk('Освіта'), sub: localizeUk('школи та ВНЗ'), order: 1 },
    { icon_key: 'business', value: '45%', label: localizeUk('Бізнес'), sub: localizeUk('стартапи та IT'), order: 2 },
    { icon_key: 'government', value: '15%', label: localizeUk('Держава'), sub: localizeUk('НУО та громади'), order: 3 },
  ],
  achievement_items: [
    { icon_key: 'programs', title: localizeUk('42 програми'), description: localizeUk('У демо-каталозі Program'), order: 1 },
    { icon_key: 'budget', title: localizeUk('80% бюджет'), description: localizeUk('Демо-метрика НМТ-блоку'), order: 2 },
    { icon_key: 'partners', title: localizeUk('14 партнерів'), description: localizeUk('Колекція Partner'), order: 3 },
  ],
});

export const getAlumniEn = () => ({
  hero_badge_text: localizeEn('Demo community seed v2'),
  hero_title: localizeEn('Alumni stories from CMS'),
  hero_subtitle: localizeEn('Cards from Graduate collection; headings from alumni-page single type.'),
  graduate_year_template: localizeEn('Class of {year} · seed'),
  current_position_label: localizeEn('Now:'),
  cta_title: localizeEn('Join the demo community'),
  cta_description: localizeEn('CTA copy from Strapi — check alumni-page in admin.'),
  testimonials_section_title: localizeEn('Testimonials (Graduate collection)'),
  testimonials_section_subtitle: localizeEn('story field on each entry'),
  employment_section_title: localizeEn('Where alumni go (seed)'),
  employment_section_subtitle: localizeEn('employment_items component'),
  achievements_section_title: localizeEn('Achievement numbers (seed)'),
  hero_stats: [
    { value: '120', label: localizeEn('Demo alumni'), order: 1 },
    { value: '24', label: localizeEn('New stories/year'), order: 2 },
    { value: '96%', label: localizeEn('Satisfaction (seed)'), order: 3 },
    { value: '71%', label: localizeEn('Career jump'), order: 4 },
  ],
  employment_items: [
    { icon_key: 'education', value: '40%', label: localizeEn('Education'), sub: localizeEn('schools and HEIs'), order: 1 },
    { icon_key: 'business', value: '45%', label: localizeEn('Business'), sub: localizeEn('startups and IT'), order: 2 },
    { icon_key: 'government', value: '15%', label: localizeEn('Public sector'), sub: localizeEn('NGOs and communities'), order: 3 },
  ],
  achievement_items: [
    { icon_key: 'programs', title: localizeEn('42 programs'), description: localizeEn('In demo Program catalog'), order: 1 },
    { icon_key: 'budget', title: localizeEn('80% budget'), description: localizeEn('Demo NMT metric'), order: 2 },
    { icon_key: 'partners', title: localizeEn('14 partners'), description: localizeEn('Partner collection'), order: 3 },
  ],
});
