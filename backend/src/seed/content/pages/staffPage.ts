import { localizeUk, localizeEn } from '../../locale';

export const getStaffPageUk = () => ({
  page_title: localizeUk('Команда seed v2'),
  page_subtitle: localizeUk('Сторінка-обгортка для колекції Staff Member. Імена та посади — з Strapi, не з коду.'),
  leadership_section_title: localizeUk('Керівний склад (seed)'),
  teachers_section_title: localizeUk('Ментори та викладачі (seed)'),
  teachers_section_subtitle_template: localizeUk('{count} осіб у демо-наборі'),
  administration_section_title: localizeUk('Офіс та супровід (seed)'),
  cta_title: localizeUk('Хочете в демо-команду?'),
  cta_text: localizeUk('Надішліть тестове резюме — це лише перевірка CMS, не реальний найм.'),
});

export const getStaffPageEn = () => ({
  page_title: localizeEn('Team seed v2'),
  page_subtitle: localizeEn('Wrapper page for Staff Member collection. Names and roles come from Strapi, not code.'),
  leadership_section_title: localizeEn('Leadership (seed)'),
  teachers_section_title: localizeEn('Mentors and teachers (seed)'),
  teachers_section_subtitle_template: localizeEn('{count} people in demo set'),
  administration_section_title: localizeEn('Office and support (seed)'),
  cta_title: localizeEn('Join the demo team?'),
  cta_text: localizeEn('Send a test CV — CMS check only, not a real hiring process.'),
});
