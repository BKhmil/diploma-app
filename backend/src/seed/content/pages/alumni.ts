import { localizeUk, localizeEn } from '../../locale';
import { alumniPageEn } from '../../translate';

export const getAlumniUk = () => ({
  hero_badge_text: localizeUk('Більше 50 000 випускників з 1995 року'),
  hero_title: localizeUk('Наші випускники по всій Україні та за кордоном'),
  hero_subtitle: localizeUk("Дізнайтесь, як навчання в ЦНО ДНУ змінило кар'єру і життя наших слухачів."),
  cta_title: localizeUk('Станьте нашим випускником'),
  cta_description: localizeUk('Приєднайтесь до спільноти 50 000+ фахівців, що обрали ЦНО ДНУ для свого розвитку.'),
  employment_section_title: localizeUk('Де працюють наші випускники'),
  employment_section_subtitle: localizeUk('Карта працевлаштування'),
  achievements_section_title: localizeUk('Наші досягнення'),
  hero_stats: [
    { value: '50 000+', label: localizeUk('Всього випускників'), order: 1 },
    { value: '2 500+', label: localizeUk('Щорічно'), order: 2 },
    { value: '98%', label: localizeUk('Задоволені навчанням'), order: 3 },
    { value: '87%', label: localizeUk("Підвищили кар'єру"), order: 4 },
  ],
  employment_items: [
    { icon_key: 'education', value: '62%', label: localizeUk('Заклади освіти'), sub: localizeUk('школи, ЗВО, ліцеї'), order: 1 },
    { icon_key: 'business', value: '25%', label: localizeUk('Підприємства та бізнес'), sub: localizeUk('після перепідготовки'), order: 2 },
    { icon_key: 'government', value: '13%', label: localizeUk('Держструктури'), sub: localizeUk('та громадські організації'), order: 3 },
  ],
  achievement_items: [
    { icon_key: 'programs', title: localizeUk('120+ програм'), description: localizeUk('Від короткострокових курсів до магістерських програм'), order: 1 },
    { icon_key: 'budget', title: localizeUk('90% бюджет'), description: localizeUk('Наших НМТ-випускників вступають на бюджетну форму'), order: 2 },
    { icon_key: 'partners', title: localizeUk('200+ партнерів'), description: localizeUk('Роботодавці та організації співпрацюють з центром'), order: 3 },
  ],
});

export const getAlumniEn = () => ({
  hero_badge_text: localizeEn(alumniPageEn.hero_badge_text),
  hero_title: localizeEn(alumniPageEn.hero_title),
  hero_subtitle: localizeEn(alumniPageEn.hero_subtitle),
  cta_title: localizeEn(alumniPageEn.cta_title),
  cta_description: localizeEn(alumniPageEn.cta_description),
  employment_section_title: localizeEn(alumniPageEn.employment_section_title),
  employment_section_subtitle: localizeEn(alumniPageEn.employment_section_subtitle),
  achievements_section_title: localizeEn(alumniPageEn.achievements_section_title),
  hero_stats: [
    { value: '50,000+', label: localizeEn('Total Graduates'), order: 1 },
    { value: '2,500+', label: localizeEn('Annually'), order: 2 },
    { value: '98%', label: localizeEn('Satisfied with studies'), order: 3 },
    { value: '87%', label: localizeEn('Advanced their careers'), order: 4 },
  ],
  employment_items: [
    { icon_key: 'education', value: '62%', label: localizeEn('Educational Institutions'), sub: localizeEn('schools, universities, lyceums'), order: 1 },
    { icon_key: 'business', value: '25%', label: localizeEn('Enterprises and Business'), sub: localizeEn('after retraining'), order: 2 },
    { icon_key: 'government', value: '13%', label: localizeEn('Government Structures'), sub: localizeEn('and public organizations'), order: 3 },
  ],
  achievement_items: [
    { icon_key: 'programs', title: localizeEn('120+ programs'), description: localizeEn('From short courses to master\'s programs'), order: 1 },
    { icon_key: 'budget', title: localizeEn('90% budget-funded'), description: localizeEn('Of our NMT graduates enroll in state-funded places'), order: 2 },
    { icon_key: 'partners', title: localizeEn('200+ partners'), description: localizeEn('Employers and organizations cooperate with the center'), order: 3 },
  ],
});
