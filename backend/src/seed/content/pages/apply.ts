import { localizeUk, localizeEn } from '../../locale';

export const getApplyUk = () => ({
  hero_title: localizeUk('Онлайн-заявка seed v2'),
  hero_subtitle: localizeUk('Заповніть демо-форму: менеджер звʼяжеться протягом 24 годин (тестовий сценарій).'),
  success_title: localizeUk('Демо-заявку збережено'),
  success_message: localizeUk('Це повідомлення з apply-page у Strapi. Реальна відправка також йде в колекцію Applications.'),
  next_steps_title: localizeUk('Наступні кроки (seed):'),
  next_steps: [
    { n: 1, title: localizeUk('Дзвінок координатора'), description: localizeUk('Уточнюємо програму та формат навчання'), order: 1 },
    { n: 2, title: localizeUk('Пакет документів'), description: localizeUk('Надсилаємо перелік і шаблони на email'), order: 2 },
    { n: 3, title: localizeUk('Старт навчання'), description: localizeUk('Ви отримуєте доступ до LMS-демо'), order: 3 },
  ],
  documents_title: localizeUk('Документи для демо-набору'),
  documents_required: [
    { text: localizeUk('Скан паспорта (1–2 стор.)'), order: 1 },
    { text: localizeUk('ІПН (копія)'), order: 2 },
    { text: localizeUk('Освітній документ (копія)'), order: 3 },
    { text: localizeUk('Фото 3×4 (цифрове)'), order: 4 },
  ],
  nmt_note: localizeUk('Для демо-НМТ: додайте довідку з школи (необовʼязково в тесті)'),
  legal_consent_text: localizeUk('Демо-згода: обробка даних лише для тестування адмін-панелі Strapi.'),
  sidebar_contacts_title: localizeUk('Питання? (seed)'),
});

export const getApplyEn = () => ({
  hero_title: localizeEn('Online application seed v2'),
  hero_subtitle: localizeEn('Fill the demo form: a manager will call within 24 hours (test scenario).'),
  success_title: localizeEn('Demo application saved'),
  success_message: localizeEn('This message is from apply-page in Strapi. Real submissions also go to Applications.'),
  next_steps_title: localizeEn('Next steps (seed):'),
  next_steps: [
    { n: 1, title: localizeEn('Coordinator call'), description: localizeEn('We confirm program and study format'), order: 1 },
    { n: 2, title: localizeEn('Document pack'), description: localizeEn('We email checklist and templates'), order: 2 },
    { n: 3, title: localizeEn('Study start'), description: localizeEn('You get access to the LMS demo'), order: 3 },
  ],
  documents_title: localizeEn('Documents for demo intake'),
  documents_required: [
    { text: localizeEn('Passport scan (pages 1–2)'), order: 1 },
    { text: localizeEn('Tax ID copy'), order: 2 },
    { text: localizeEn('Education document copy'), order: 3 },
    { text: localizeEn('Photo 3×4 (digital)'), order: 4 },
  ],
  nmt_note: localizeEn('For demo NMT: add school certificate (optional in test)'),
  legal_consent_text: localizeEn('Demo consent: data processed only for Strapi admin testing.'),
  sidebar_contacts_title: localizeEn('Questions? (seed)'),
});
