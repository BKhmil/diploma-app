import { localizeUk, localizeEn } from '../../locale';
import { homePageEn } from '../../translate';

export const getHomeUk = () => ({
  hero_badge_text: localizeUk('Дніпровський національний університет імені Олеся Гончара'),
  hero_title: localizeUk('Ваш розвиток — наша спеціальність'),
  hero_subtitle: localizeUk('Якісна післядипломна освіта, підвищення кваліфікації та підготовка до вступу. Станьте затребуваним фахівцем разом з лідером освіти регіону.'),
  mission: localizeUk('Якісна післядипломна освіта для професійного розвитку.'),
  stats_graduates: 1000,
  stats_programs: 50,
  stats_years: 25,
  quality_section_title: localizeUk('Якісна освіта з гарантією результату'),
  quality_section_description: localizeUk('Центр є офіційним структурним підрозділом Дніпровського національного університету імені Олеся Гончара. Ми забезпечуємо високі стандарти навчання та надаємо документи державного зразка.'),
  bottom_cta_title: localizeUk('Готові почати?'),
  bottom_cta_description: localizeUk('Оберіть програму та зробіть перший крок до свого професійного зростання.'),
  quality_bullets: [
    { text: localizeUk('Понад 50 активних програм щорічно') },
    { text: localizeUk('Документи про освіту державного зразка') },
    { text: localizeUk('Гнучкий графік навчання (онлайн/офлайн)') },
    { text: localizeUk('Викладачі-практики та професори ДНУ') },
  ],
  direction_cards: [
    { title: localizeUk('Здобути нові навички'), description: localizeUk('Підвищення кваліфікації для фахівців. Сучасні програми та сертифікати державного зразка.'), link_path: '/qualification', icon_key: 'trending_up', order: 1 },
    { title: localizeUk('Змінити професію'), description: localizeUk('Магістратура та програми перепідготовки. Отримайте нову спеціальність на базі вищої освіти.'), link_path: '/retraining', icon_key: 'briefcase', order: 2 },
    { title: localizeUk('Вступити до ВНЗ'), description: localizeUk('Ефективна підготовка до складання НМТ, ЄВІ, ЄФВВ. Заняття з провідними викладачами ДНУ.'), link_path: '/pre-university', icon_key: 'award', order: 3 },
  ],
  admissions_cards: [
    { title: localizeUk('Набір відкрито'), description: localizeUk('Приймаємо заявки на всі програми підвищення кваліфікації'), date_label: localizeUk('Старт: березень 2026'), order: 1 },
    { title: localizeUk('Вступна кампанія'), description: localizeUk('Подача документів на програми перепідготовки та магістратуру'), date_label: localizeUk('Старт: 1 липня 2026'), order: 2 },
    { title: localizeUk('НМТ-підготовка'), description: localizeUk('Підготовчі курси для абітурієнтів'), date_label: localizeUk('НМТ: 28 травня 2026'), order: 3 },
  ],
});

export const getHomeEn = () => ({
  hero_badge_text: localizeEn(homePageEn.hero_badge_text),
  hero_title: localizeEn(homePageEn.hero_title),
  hero_subtitle: localizeEn(homePageEn.hero_subtitle),
  mission: localizeEn(homePageEn.mission),
  stats_graduates: 1000,
  stats_programs: 50,
  stats_years: 25,
  quality_section_title: localizeEn(homePageEn.quality_section_title),
  quality_section_description: localizeEn(homePageEn.quality_section_description),
  bottom_cta_title: localizeEn(homePageEn.bottom_cta_title),
  bottom_cta_description: localizeEn(homePageEn.bottom_cta_description),
  quality_bullets: [
    { text: localizeEn('More than 50 active programs annually') },
    { text: localizeEn('State-recognized educational documents') },
    { text: localizeEn('Flexible schedule (online/offline)') },
    { text: localizeEn('Practitioner teachers and DNU professors') },
  ],
  direction_cards: [
    { title: localizeEn('Gain New Skills'), description: localizeEn('Professional development for specialists. Modern programs and state-standard certificates.'), link_path: '/qualification', icon_key: 'trending_up', order: 1 },
    { title: localizeEn('Change Careers'), description: localizeEn('Master\'s programs and retraining. Get a new specialty based on your higher education.'), link_path: '/retraining', icon_key: 'briefcase', order: 2 },
    { title: localizeEn('Enter University'), description: localizeEn('Effective NMT, EVI, EFVV preparation. Classes with leading DNU lecturers.'), link_path: '/pre-university', icon_key: 'award', order: 3 },
  ],
  admissions_cards: [
    { title: localizeEn('Enrollment Open'), description: localizeEn('Accepting applications for all professional development programs'), date_label: localizeEn('Start: March 2026'), order: 1 },
    { title: localizeEn('Admission Campaign'), description: localizeEn('Submitting documents for retraining and master\'s programs'), date_label: localizeEn('Start: July 1, 2026'), order: 2 },
    { title: localizeEn('NMT Preparation'), description: localizeEn('Preparatory courses for applicants'), date_label: localizeEn('NMT: May 28, 2026'), order: 3 },
  ],
});
