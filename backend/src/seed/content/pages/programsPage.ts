import { localizeUk, localizeEn } from '../../locale';

export const getProgramsPageUk = () => ({
  page_title: localizeUk('Бібліотека програм seed v2'),
  page_intro: localizeUk('Повний каталог з колекції Program. Кожен запис має (new) у текстових полях після повторного seed.'),
  search_placeholder: localizeUk('Шукати: UX, Data, НМТ, Agile...'),
  popular_tags_title: localizeUk('Швидкі фільтри (seed):'),
  popular_tags: [
    { text: localizeUk('UX-дизайн'), query: localizeUk('UX'), order: 1 },
    { text: localizeUk('Аналітика даних'), query: localizeUk('Data'), order: 2 },
    { text: localizeUk('Agile'), query: localizeUk('Agile'), order: 3 },
    { text: localizeUk('НМТ-блок'), query: localizeUk('НМТ'), order: 4 },
  ],
  empty_state_text: localizeUk('Нічого не знайдено — змініть запит або очистіть фільтр (демо-повідомлення з programs-page).'),
});

export const getProgramsPageEn = () => ({
  page_title: localizeEn('Program library seed v2'),
  page_intro: localizeEn('Full catalog from the Program collection. Each entry has (new) on text fields after re-seed.'),
  search_placeholder: localizeEn('Search: UX, Data, NMT, Agile...'),
  popular_tags_title: localizeEn('Quick filters (seed):'),
  popular_tags: [
    { text: localizeEn('UX design'), query: localizeEn('UX'), order: 1 },
    { text: localizeEn('Data analytics'), query: localizeEn('Data'), order: 2 },
    { text: localizeEn('Agile'), query: localizeEn('Agile'), order: 3 },
    { text: localizeEn('NMT block'), query: localizeEn('NMT'), order: 4 },
  ],
  empty_state_text: localizeEn('Nothing found — change query or clear filter (demo message from programs-page).'),
});
