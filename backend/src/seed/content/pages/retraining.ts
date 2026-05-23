import { localizeUk, localizeEn } from '../../locale';

export const getRetrainingUk = () => ({
  page_title: localizeUk('Перекваліфікація seed v2'),
  page_intro: localizeUk('Сторінка retraining-page + програми category retraining/master з колекції Program.'),
  admission_heading_retraining: localizeUk('Друга вища (seed)'),
  admission_heading_master: localizeUk('Магістерський трек (seed)'),
  documents_label: localizeUk('Документи (seed):'),
  dates_label: localizeUk('Дати (seed):'),
  empty_state_text: localizeUk('Немає програм у Strapi для цього фільтра — перевірте колекцію Program.'),
  admission_docs_retraining: [
    { text: localizeUk('Заява (демо)'), order: 1 },
    { text: localizeUk('Паспорт + ІПН'), order: 2 },
    { text: localizeUk('Диплом ВО'), order: 3 },
  ],
  admission_docs_master: [
    { text: localizeUk('Заява (демо)'), order: 1 },
    { text: localizeUk('Паспорт + ІПН'), order: 2 },
    { text: localizeUk('Диплом + мотиваційний лист'), order: 3 },
    { text: localizeUk('Результати ЄВІ (за потреби)'), order: 4 },
  ],
  important_dates: [
    { label: localizeUk('Прийом документів:'), value: localizeUk('01.08.2026'), order: 1 },
    { label: localizeUk('Співбесіда:'), value: localizeUk('20.08.2026'), order: 2 },
    { label: localizeUk('Старт:'), value: localizeUk('15.09.2026'), order: 3 },
  ],
});

export const getRetrainingEn = () => ({
  page_title: localizeEn('Retraining seed v2'),
  page_intro: localizeEn('retraining-page single type + Program collection (retraining/master).'),
  admission_heading_retraining: localizeEn('Second degree (seed)'),
  admission_heading_master: localizeEn('Master track (seed)'),
  documents_label: localizeEn('Documents (seed):'),
  dates_label: localizeEn('Dates (seed):'),
  empty_state_text: localizeEn('No programs in Strapi for this filter — check Program collection.'),
  admission_docs_retraining: [
    { text: localizeEn('Application (demo)'), order: 1 },
    { text: localizeEn('Passport + tax ID'), order: 2 },
    { text: localizeEn('Higher education diploma'), order: 3 },
  ],
  admission_docs_master: [
    { text: localizeEn('Application (demo)'), order: 1 },
    { text: localizeEn('Passport + tax ID'), order: 2 },
    { text: localizeEn('Diploma + motivation letter'), order: 3 },
    { text: localizeEn('EVI results (if required)'), order: 4 },
  ],
  important_dates: [
    { label: localizeEn('Documents:'), value: localizeEn('Aug 1, 2026'), order: 1 },
    { label: localizeEn('Interview:'), value: localizeEn('Aug 20, 2026'), order: 2 },
    { label: localizeEn('Start:'), value: localizeEn('Sep 15, 2026'), order: 3 },
  ],
});
