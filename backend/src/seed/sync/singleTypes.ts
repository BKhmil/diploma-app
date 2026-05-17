import { getHomeUk, getHomeEn } from '../content/pages/home';
import { getAboutUk, getAboutEn } from '../content/pages/about';
import { getAlumniUk, getAlumniEn } from '../content/pages/alumni';
import { getQualificationUk, getQualificationEn } from '../content/pages/qualification';
import { getRetrainingUk, getRetrainingEn } from '../content/pages/retraining';
import { getPartnersPageUk, getPartnersPageEn } from '../content/pages/partners';
import { getPreUniversityPageUk, getPreUniversityPageEn } from '../content/pages/preUniversity';
import { getContactUk, getContactEn } from '../content/pages/contact';
import { ensureLocaleSuffix } from '../locale';

async function upsertSingleType(
  strapi: any,
  uid: string,
  ukData: Record<string, any>,
  enData: Record<string, any>
) {
  const docService = strapi.documents(uid);

  // Find any existing row (draft or published) for each locale
  const ukRow = await strapi.db.query(uid).findOne({ where: { locale: 'uk' } });
  const enRow = await strapi.db.query(uid).findOne({ where: { locale: 'en' } });

  const ukDocumentId: string | undefined = ukRow?.document_id;
  const enDocumentId: string | undefined = enRow?.document_id;

  if (ukDocumentId) {
    await docService.update({ documentId: ukDocumentId, locale: 'uk', data: ukData });
    await docService.publish({ documentId: ukDocumentId, locale: 'uk' });
  } else {
    const created = await docService.create({ locale: 'uk', data: ukData });
    await docService.publish({ documentId: created.documentId, locale: 'uk' });
  }

  if (enDocumentId) {
    await docService.update({ documentId: enDocumentId, locale: 'en', data: enData });
    await docService.publish({ documentId: enDocumentId, locale: 'en' });
  } else {
    const created = await docService.create({ locale: 'en', data: enData });
    await docService.publish({ documentId: created.documentId, locale: 'en' });
  }
}

export async function syncHomePage(strapi: any) {
  await upsertSingleType(strapi, 'api::home-page.home-page', getHomeUk(), getHomeEn());
}

export async function syncAboutPage(strapi: any) {
  await upsertSingleType(strapi, 'api::about-page.about-page', getAboutUk(), getAboutEn());
}

export async function syncAlumniPage(strapi: any) {
  await upsertSingleType(strapi, 'api::alumni-page.alumni-page', getAlumniUk(), getAlumniEn());
}

export async function syncQualificationPage(strapi: any) {
  await upsertSingleType(strapi, 'api::qualification-page.qualification-page', getQualificationUk(), getQualificationEn());
}

export async function syncRetrainingPage(strapi: any) {
  await upsertSingleType(strapi, 'api::retraining-page.retraining-page', getRetrainingUk(), getRetrainingEn());
}

export async function syncPartnersPage(strapi: any) {
  await upsertSingleType(strapi, 'api::partners-page.partners-page', getPartnersPageUk(), getPartnersPageEn());
}

export async function syncPreUniversityPage(strapi: any) {
  await upsertSingleType(strapi, 'api::pre-university-page.pre-university-page', getPreUniversityPageUk(), getPreUniversityPageEn());
}

export async function syncContactInfo(strapi: any) {
  const fallbackUk = {
    address: 'пр. Науки, 72, м. Дніпро, 49010',
    phone: '+38 (056) 123-45-67',
    email: 'info@cno.dnu.edu.ua',
    working_hours: 'Пн-Пт: 9:00-17:00',
    map_embed_url: 'https://maps.google.com/maps?width=100%25&height=600&hl=uk&q=48.434606,35.034614+(ДНУ%20ім.%20Олеся%20Гончара)&t=&z=16&ie=UTF8&iwloc=&output=embed',
    facebook_url: '#',
    instagram_url: '#',
  };
  const fallbackEn = {
    address: '72 Nauky Ave, Dnipro, 49010',
    phone: '+38 (056) 123-45-67',
    email: 'info@cno.dnu.edu.ua',
    working_hours: 'Mon-Fri: 9:00-17:00',
    map_embed_url: fallbackUk.map_embed_url,
    facebook_url: '#',
    instagram_url: '#',
  };

  const ls = (v: string, locale: 'uk' | 'en') => ensureLocaleSuffix(v, locale) as string;
  const query = strapi.db.query('api::contact-info.contact-info');
  const ukRow = await query.findOne({ where: { locale: 'uk' } });
  const enRow = await query.findOne({ where: { locale: 'en' } });

  const pickStr = (preferred: unknown, fallback: string) =>
    typeof preferred === 'string' && preferred.trim() ? preferred : fallback;

  const ukData = {
    address: pickStr(ukRow?.address, fallbackUk.address),
    phone: pickStr(ukRow?.phone, fallbackUk.phone),
    email: pickStr(ukRow?.email, fallbackUk.email),
    working_hours: pickStr(ukRow?.working_hours, fallbackUk.working_hours),
    map_embed_url: pickStr(ukRow?.map_embed_url, fallbackUk.map_embed_url),
    facebook_url: pickStr(ukRow?.facebook_url, fallbackUk.facebook_url),
    instagram_url: pickStr(ukRow?.instagram_url, fallbackUk.instagram_url),
    contacts_page_title: ls(pickStr(ukRow?.contacts_page_title, 'Контакти'), 'uk'),
    contacts_page_subtitle: ls(pickStr(ukRow?.contacts_page_subtitle, "Маєте запитання? Зв'яжіться з нами будь-яким зручним способом або заповніть форму зворотного зв'язку."), 'uk'),
    secondary_phone: '+38 (097) 123-45-67',
    room_note: ls('Корпус 1, кімната 101', 'uk'),
    weekend_hours_note: ls('Сб-Нд: Вихідний', 'uk'),
    footer_about_title: ls(pickStr(ukRow?.footer_about_title, 'Центр неперервної освіти'), 'uk'),
    footer_about_description: ls(pickStr(ukRow?.footer_about_description, 'Сучасна освітня платформа Дніпровського національного університету імені Олеся Гончара. Ми створюємо можливості для навчання протягом усього життя.'), 'uk'),
    footer_nav_title: ls(pickStr(ukRow?.footer_nav_title, 'Навігація'), 'uk'),
    footer_nav_about_label: ls(pickStr(ukRow?.footer_nav_about_label, 'Про Центр'), 'uk'),
    footer_nav_qualification_label: ls(pickStr(ukRow?.footer_nav_qualification_label, 'Підвищення кваліфікації'), 'uk'),
    footer_nav_retraining_label: ls(pickStr(ukRow?.footer_nav_retraining_label, 'Перепідготовка'), 'uk'),
    footer_nav_pre_university_label: ls(pickStr(ukRow?.footer_nav_pre_university_label, 'Вступникам'), 'uk'),
    footer_nav_alumni_label: ls(pickStr(ukRow?.footer_nav_alumni_label, 'Випускники'), 'uk'),
    footer_contacts_title: ls(pickStr(ukRow?.footer_contacts_title, 'Контакти'), 'uk'),
    footer_social_title: ls(pickStr(ukRow?.footer_social_title, 'Ми в соцмережах'), 'uk'),
  };

  const enData = {
    address: pickStr(enRow?.address, fallbackEn.address),
    phone: pickStr(enRow?.phone, fallbackEn.phone),
    email: pickStr(enRow?.email, fallbackEn.email),
    working_hours: ls(pickStr(enRow?.working_hours, fallbackEn.working_hours), 'en'),
    map_embed_url: fallbackUk.map_embed_url,
    facebook_url: pickStr(enRow?.facebook_url, fallbackEn.facebook_url),
    instagram_url: pickStr(enRow?.instagram_url, fallbackEn.instagram_url),
    contacts_page_title: ls('Contacts', 'en'),
    contacts_page_subtitle: ls("Have questions? Contact us in any convenient way or fill out the feedback form.", 'en'),
    secondary_phone: '+38 (097) 123-45-67',
    room_note: ls('Building 1, Room 101', 'en'),
    weekend_hours_note: ls('Sat–Sun: Closed', 'en'),
    footer_about_title: ls(pickStr(enRow?.footer_about_title, 'Center for Lifelong Education'), 'en'),
    footer_about_description: ls(pickStr(enRow?.footer_about_description, 'A modern educational platform of Oles Honchar Dnipro National University. We create opportunities for lifelong learning.'), 'en'),
    footer_nav_title: ls(pickStr(enRow?.footer_nav_title, 'Navigation'), 'en'),
    footer_nav_about_label: ls(pickStr(enRow?.footer_nav_about_label, 'About the Center'), 'en'),
    footer_nav_qualification_label: ls(pickStr(enRow?.footer_nav_qualification_label, 'Professional Development'), 'en'),
    footer_nav_retraining_label: ls(pickStr(enRow?.footer_nav_retraining_label, 'Retraining'), 'en'),
    footer_nav_pre_university_label: ls(pickStr(enRow?.footer_nav_pre_university_label, 'For Applicants'), 'en'),
    footer_nav_alumni_label: ls(pickStr(enRow?.footer_nav_alumni_label, 'Alumni'), 'en'),
    footer_contacts_title: ls(pickStr(enRow?.footer_contacts_title, 'Contacts'), 'en'),
    footer_social_title: ls(pickStr(enRow?.footer_social_title, 'Follow Us'), 'en'),
  };

  const cUID = 'api::contact-info.contact-info';
  const cDoc = strapi.documents(cUID);
  const ukDocId: string | undefined = ukRow?.document_id;
  const enDocId: string | undefined = enRow?.document_id;

  if (ukDocId) {
    await cDoc.update({ documentId: ukDocId, locale: 'uk', data: ukData });
    await cDoc.publish({ documentId: ukDocId, locale: 'uk' });
  } else {
    const created = await cDoc.create({ locale: 'uk', data: ukData });
    await cDoc.publish({ documentId: created.documentId, locale: 'uk' });
  }

  if (enDocId) {
    await cDoc.update({ documentId: enDocId, locale: 'en', data: enData });
    await cDoc.publish({ documentId: enDocId, locale: 'en' });
  } else {
    const created = await cDoc.create({ locale: 'en', data: enData });
    await cDoc.publish({ documentId: created.documentId, locale: 'en' });
  }
}
