import { localizeUk, localizeEn } from '../../locale';

export const getPartnersPageUk = () => ({
  page_title: localizeUk('Партнери seed v2'),
  page_intro: localizeUk('Заголовки — partners-page; логотипи — колекція Partner.'),
  educational_section_title: localizeUk('Освітні партнери (seed)'),
  educational_section_subtitle: localizeUk('type: university | organization'),
  enterprise_section_title: localizeUk('Бізнес-партнери (seed)'),
  enterprise_section_subtitle: localizeUk('type: employer'),
  benefits_section_title: localizeUk('Чому співпрацювати (seed)'),
  cta_title: localizeUk('Стати демо-партнером'),
  cta_text: localizeUk('Це тестовий CTA — реальні домовленості не укладаються.'),
  stats: [
    { value: '14', label: localizeUk('Партнерів у seed'), icon_key: 'handshake', order: 1 },
    { value: '6', label: localizeUk('Бізнес-кейсів'), icon_key: 'building', order: 2 },
    { value: '5', label: localizeUk('ВНЗ'), icon_key: 'graduation', order: 3 },
    { value: '3', label: localizeUk('НУО'), icon_key: 'school', order: 4 },
  ],
  benefits: [
    { title: localizeUk('Спільні курси'), description: localizeUk('Контент з partners-page benefits'), order: 1 },
    { title: localizeUk('Стажування'), description: localizeUk('Демо-опис стажування'), order: 2 },
    { title: localizeUk('Звіти для HR'), description: localizeUk('Демо-опис звітності'), order: 3 },
  ],
});

export const getPartnersPageEn = () => ({
  page_title: localizeEn('Partners seed v2'),
  page_intro: localizeEn('Headings from partners-page; logos from Partner collection.'),
  educational_section_title: localizeEn('Education partners (seed)'),
  educational_section_subtitle: localizeEn('type: university | organization'),
  enterprise_section_title: localizeEn('Business partners (seed)'),
  enterprise_section_subtitle: localizeEn('type: employer'),
  benefits_section_title: localizeEn('Why partner (seed)'),
  cta_title: localizeEn('Become a demo partner'),
  cta_text: localizeEn('Test CTA only — no real agreements.'),
  stats: [
    { value: '14', label: localizeEn('Partners in seed'), icon_key: 'handshake', order: 1 },
    { value: '6', label: localizeEn('Business cases'), icon_key: 'building', order: 2 },
    { value: '5', label: localizeEn('HEIs'), icon_key: 'graduation', order: 3 },
    { value: '3', label: localizeEn('NGOs'), icon_key: 'school', order: 4 },
  ],
  benefits: [
    { title: localizeEn('Joint courses'), description: localizeEn('Copy from partners-page benefits'), order: 1 },
    { title: localizeEn('Internships'), description: localizeEn('Demo internship description'), order: 2 },
    { title: localizeEn('HR reports'), description: localizeEn('Demo reporting description'), order: 3 },
  ],
});
