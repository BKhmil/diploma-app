import { localizeUk, localizeEn } from '../../locale';
import { aboutPageEn } from '../../translate';

export const getAboutUk = () => ({
  page_title: localizeUk('Про Центр неперервної освіти'),
  page_subtitle: localizeUk('Дніпровський національний університет ім. Олеся Гончара'),
  mission_heading: localizeUk('Наша місія'),
  history: localizeUk('З 1995 року Центр неперервної освіти готує фахівців у різних галузях, надаючи якісну освіту та документи державного зразка. Рішенням вченої ради університету створено підрозділ перепідготовки та підвищення кваліфікації фахівців.'),
  structure_description: localizeUk('Центр включає відділи підвищення кваліфікації, перепідготовки, довузівської підготовки та магістерські програми. Наша структура забезпечує комплексний підхід до неперервної освіти.'),
  mission_checklist: [
    { text: localizeUk('Забезпечення якісної освіти відповідно до державних стандартів') },
    { text: localizeUk('Підтримка безперервного навчання впродовж всього життя') },
    { text: localizeUk('Співпраця з роботодавцями та громадськими організаціями') },
    { text: localizeUk('Розвиток інноваційних форм навчання') },
  ],
  timeline_items: [
    { year: '1995', title: localizeUk('Заснування центру'), description: localizeUk('Рішенням вченої ради університету створено підрозділ перепідготовки та підвищення кваліфікації фахівців.'), order: 1 },
    { year: '2005', title: localizeUk('Перший диплом магістра'), description: localizeUk('Розпочато видачу дипломів магістра за програмами перепідготовки. Перший випуск — 48 магістрів.'), order: 2 },
    { year: '2012', title: localizeUk('Програми НМТ-підготовки'), description: localizeUk('Запущені перші підготовчі курси для абітурієнтів. Понад 200 учнів у першому наборі.'), order: 3 },
    { year: '2018', title: localizeUk('Запуск онлайн-навчання'), description: localizeUk('Впроваджено дистанційну форму навчання через сучасну LMS-платформу. Перший повністю онлайн-курс.'), order: 4 },
    { year: '2024', title: localizeUk('Цифрова трансформація'), description: localizeUk('Запущено оновлений сайт, система онлайн-подачі заявок та цифровий кабінет слухача.'), order: 5 },
  ],
  leadership_items: [
    { name: localizeUk('Кравченко Валентина Олегівна'), role: localizeUk('Директор ЦНО'), degree: localizeUk('д-р пед. наук, проф.'), photo_url: 'https://i.pravatar.cc/200?img=47', order: 1 },
    { name: localizeUk('Білоус Іван Петрович'), role: localizeUk('Заступник директора'), degree: localizeUk('канд. пед. наук, доц.'), photo_url: 'https://i.pravatar.cc/200?img=12', order: 2 },
    { name: localizeUk('Мороз Ольга Сергіївна'), role: localizeUk('Зав. відділу підвищення кваліфікації'), degree: localizeUk('канд. пед. наук'), photo_url: 'https://i.pravatar.cc/200?img=44', order: 3 },
    { name: localizeUk('Ткаченко Руслан Миколайович'), role: localizeUk('Зав. відділу перепідготовки'), degree: localizeUk('канд. юрид. наук'), photo_url: 'https://i.pravatar.cc/200?img=15', order: 4 },
  ],
});

export const getAboutEn = () => ({
  page_title: localizeEn(aboutPageEn.page_title),
  page_subtitle: localizeEn(aboutPageEn.page_subtitle),
  mission_heading: localizeEn(aboutPageEn.mission_heading),
  history: localizeEn(aboutPageEn.history),
  structure_description: localizeEn(aboutPageEn.structure_description),
  mission_checklist: [
    { text: localizeEn('Ensuring quality education according to state standards') },
    { text: localizeEn('Supporting continuous learning throughout life') },
    { text: localizeEn('Cooperation with employers and public organizations') },
    { text: localizeEn('Development of innovative forms of learning') },
  ],
  timeline_items: [
    { year: '1995', title: localizeEn('Center Founded'), description: localizeEn('By decision of the university academic council, the department for retraining and professional development was established.'), order: 1 },
    { year: '2005', title: localizeEn('First Master\'s Degree'), description: localizeEn('Master\'s degrees began to be issued for retraining programs. First graduation — 48 masters.'), order: 2 },
    { year: '2012', title: localizeEn('NMT Preparation Programs'), description: localizeEn('First preparatory courses for applicants were launched. Over 200 students in the first cohort.'), order: 3 },
    { year: '2018', title: localizeEn('Online Learning Launch'), description: localizeEn('Distance learning was introduced through a modern LMS platform. First fully online course.'), order: 4 },
    { year: '2024', title: localizeEn('Digital Transformation'), description: localizeEn('Updated website, online application system, and digital student cabinet launched.'), order: 5 },
  ],
  leadership_items: [
    { name: localizeEn('Valentyna Kravchenko'), role: localizeEn('CNE Director'), degree: localizeEn('Dr. of Pedagogical Sciences, Prof.'), photo_url: 'https://i.pravatar.cc/200?img=47', order: 1 },
    { name: localizeEn('Ivan Bilous'), role: localizeEn('Deputy Director'), degree: localizeEn('PhD in Pedagogical Sciences, Assoc. Prof.'), photo_url: 'https://i.pravatar.cc/200?img=12', order: 2 },
    { name: localizeEn('Olha Moroz'), role: localizeEn('Head of Professional Development Department'), degree: localizeEn('PhD in Pedagogical Sciences'), photo_url: 'https://i.pravatar.cc/200?img=44', order: 3 },
    { name: localizeEn('Ruslan Tkachenko'), role: localizeEn('Head of Retraining Department'), degree: localizeEn('PhD in Legal Sciences'), photo_url: 'https://i.pravatar.cc/200?img=15', order: 4 },
  ],
});
