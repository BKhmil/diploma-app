import { localizeUk, localizeEn } from '../../locale';
import { retrainingPageEn } from '../../translate';

export const getRetrainingUk = () => ({
  page_title: localizeUk('Перепідготовка та Магістратура'),
  page_intro: localizeUk("Здобудьте нову спеціальність або підвищте свій освітній рівень. Ми пропонуємо програми перепідготовки та магістерські програми для вашого кар'єрного зростання."),
  admission_docs_retraining: [
    { text: localizeUk('Заява на ім\'я ректора'), order: 1 },
    { text: localizeUk('Копія паспорта та ІПН'), order: 2 },
    { text: localizeUk('Копія диплома про вищу освіту'), order: 3 },
    { text: localizeUk('4 фотокартки 3х4'), order: 4 },
  ],
  admission_docs_master: [
    { text: localizeUk('Заява на ім\'я ректора'), order: 1 },
    { text: localizeUk('Копія паспорта та ІПН'), order: 2 },
    { text: localizeUk('Копія диплома про вищу освіту'), order: 3 },
    { text: localizeUk('4 фотокартки 3х4'), order: 4 },
    { text: localizeUk('Результати ЄВІ/ЄФВВ'), order: 5 },
  ],
  important_dates: [
    { label: localizeUk('Початок прийому документів:'), value: localizeUk('1 липня 2026'), order: 1 },
    { label: localizeUk('Вступні випробування:'), value: localizeUk('серпень 2026'), order: 2 },
    { label: localizeUk('Початок навчання:'), value: localizeUk('1 вересня 2026'), order: 3 },
  ],
});

export const getRetrainingEn = () => ({
  page_title: localizeEn(retrainingPageEn.page_title),
  page_intro: localizeEn(retrainingPageEn.page_intro),
  admission_docs_retraining: [
    { text: localizeEn('Application addressed to the rector'), order: 1 },
    { text: localizeEn('Copy of passport and tax ID'), order: 2 },
    { text: localizeEn('Copy of higher education diploma'), order: 3 },
    { text: localizeEn('4 photos 3x4'), order: 4 },
  ],
  admission_docs_master: [
    { text: localizeEn('Application addressed to the rector'), order: 1 },
    { text: localizeEn('Copy of passport and tax ID'), order: 2 },
    { text: localizeEn('Copy of higher education diploma'), order: 3 },
    { text: localizeEn('4 photos 3x4'), order: 4 },
    { text: localizeEn('EVI/EFVV results'), order: 5 },
  ],
  important_dates: [
    { label: localizeEn('Document acceptance starts:'), value: localizeEn('July 1, 2026'), order: 1 },
    { label: localizeEn('Entrance exams:'), value: localizeEn('August 2026'), order: 2 },
    { label: localizeEn('Studies begin:'), value: localizeEn('September 1, 2026'), order: 3 },
  ],
});
