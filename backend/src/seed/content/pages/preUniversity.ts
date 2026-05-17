import { localizeUk, localizeEn } from '../../locale';
import { preUniversityPageEn } from '../../translate';

export const getPreUniversityPageUk = () => ({
  hero_title: localizeUk('Ефективна підготовка до НМТ'),
  hero_subtitle: localizeUk('Підготуйтесь до національного мультипредметного тесту з провідними викладачами ДНУ. Малі групи, індивідуальний підхід, гарантований результат.'),
  nmt_exam_date: '2026-05-28',
  bundle_title: localizeUk('Комплекс: Математика + Українська мова'),
  bundle_description: localizeUk('Інтенсивна підготовка одразу з двох предметів НМТ. Заощаджуйте до 30% від повної ціни.'),
  steps: [
    { n: 1, title: localizeUk('Записуєтесь'), description: localizeUk('Заповнюєте заявку на сайті або телефонуєте до центру'), order: 1 },
    { n: 2, title: localizeUk('Пробне заняття'), description: localizeUk('Перше заняття безкоштовне — переконайтесь особисто'), order: 2 },
    { n: 3, title: localizeUk('Складаєте НМТ'), description: localizeUk('Маєте знання та впевненість для успішного результату'), order: 3 },
  ],
});

export const getPreUniversityPageEn = () => ({
  hero_title: localizeEn(preUniversityPageEn.hero_title),
  hero_subtitle: localizeEn(preUniversityPageEn.hero_subtitle),
  nmt_exam_date: '2026-05-28',
  bundle_title: localizeEn(preUniversityPageEn.bundle_title),
  bundle_description: localizeEn(preUniversityPageEn.bundle_description),
  steps: [
    { n: 1, title: localizeEn('Sign Up'), description: localizeEn('Fill out the application on the website or call the center'), order: 1 },
    { n: 2, title: localizeEn('Trial Lesson'), description: localizeEn('The first lesson is free — see for yourself'), order: 2 },
    { n: 3, title: localizeEn('Take the NMT'), description: localizeEn('You have the knowledge and confidence for a successful result'), order: 3 },
  ],
});
