import { localizeUk, localizeEn } from '../../locale';

export const getNotFoundUk = () => ({
  title: localizeUk('Сторінку не знайдено — seed v2'),
  description: localizeUk('Цей демо-текст приходить з single type not-found-page у Strapi. Перевірте, чи всі посилання ведуть на існуючі маршрути.'),
  search_label: localizeUk('Спробуйте знайти програму:'),
  search_placeholder: localizeUk('Введіть назву курсу (демо)...'),
  popular_links_title: localizeUk('Корисні розділи (seed):'),
  popular_links: [
    { label: localizeUk('Головна (демо)'), path: '/', order: 1 },
    { label: localizeUk('Програми (демо)'), path: '/programs', order: 2 },
    { label: localizeUk('Контакти (демо)'), path: '/contacts', order: 3 },
    { label: localizeUk('Подати заявку (демо)'), path: '/apply', order: 4 },
  ],
});

export const getNotFoundEn = () => ({
  title: localizeEn('Page not found — seed v2'),
  description: localizeEn('This demo copy comes from the not-found-page single type in Strapi. Check that all links point to valid routes.'),
  search_label: localizeEn('Try finding a program:'),
  search_placeholder: localizeEn('Type a course name (demo)...'),
  popular_links_title: localizeEn('Useful sections (seed):'),
  popular_links: [
    { label: localizeEn('Home (demo)'), path: '/', order: 1 },
    { label: localizeEn('Programs (demo)'), path: '/programs', order: 2 },
    { label: localizeEn('Contacts (demo)'), path: '/contacts', order: 3 },
    { label: localizeEn('Apply (demo)'), path: '/apply', order: 4 },
  ],
});
