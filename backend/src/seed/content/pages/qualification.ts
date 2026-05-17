import { localizeUk, localizeEn } from '../../locale';
import { qualificationPageEn } from '../../translate';

export const getQualificationUk = () => ({
  page_title: localizeUk('Підвищення кваліфікації'),
  page_intro: localizeUk('Оберіть програму для професійного розвитку та отримайте сертифікат державного зразка. Ми пропонуємо курси для освітян, психологів, держслужбовців та інших фахівців.'),
});

export const getQualificationEn = () => ({
  page_title: localizeEn(qualificationPageEn.page_title),
  page_intro: localizeEn(qualificationPageEn.page_intro),
});
