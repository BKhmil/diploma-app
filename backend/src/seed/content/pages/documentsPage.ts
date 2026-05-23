import { localizeUk, localizeEn } from '../../locale';

export const getDocumentsPageUk = () => ({
  page_title: localizeUk('Реєстр документів seed v2'),
  page_subtitle: localizeUk('Заголовки сторінки — з documents-page; файли — з колекції Document.'),
  samples_warning: localizeUk('Увага: частина PDF — демо-заглушки для перевірки завантаження в Strapi Media Library.'),
  category_labels: [
    { key: 'licenses', label: localizeUk('Ліцензії (seed)'), order: 1 },
    { key: 'regulations', label: localizeUk('Регламенти (seed)'), order: 2 },
    { key: 'programs', label: localizeUk('Силабуси (seed)'), order: 3 },
    { key: 'samples', label: localizeUk('Зразки (seed)'), order: 4 },
    { key: 'other', label: localizeUk('Інше (seed)'), order: 5 },
  ],
});

export const getDocumentsPageEn = () => ({
  page_title: localizeEn('Document registry seed v2'),
  page_subtitle: localizeEn('Page headings from documents-page; files from Document collection.'),
  samples_warning: localizeEn('Note: some PDFs are demo placeholders to test Strapi Media Library uploads.'),
  category_labels: [
    { key: 'licenses', label: localizeEn('Licenses (seed)'), order: 1 },
    { key: 'regulations', label: localizeEn('Regulations (seed)'), order: 2 },
    { key: 'programs', label: localizeEn('Syllabi (seed)'), order: 3 },
    { key: 'samples', label: localizeEn('Samples (seed)'), order: 4 },
    { key: 'other', label: localizeEn('Other (seed)'), order: 5 },
  ],
});
