import { getHomeUk, getHomeEn } from '../content/pages/home';
import { getAboutUk, getAboutEn } from '../content/pages/about';
import { getAlumniUk, getAlumniEn } from '../content/pages/alumni';
import { getQualificationUk, getQualificationEn } from '../content/pages/qualification';
import { getRetrainingUk, getRetrainingEn } from '../content/pages/retraining';
import { getPartnersPageUk, getPartnersPageEn } from '../content/pages/partners';
import { getPreUniversityPageUk, getPreUniversityPageEn } from '../content/pages/preUniversity';
import { getContactUk, getContactEn } from '../content/pages/contact';
import { getApplyUk, getApplyEn } from '../content/pages/apply';
import { getProgramsPageUk, getProgramsPageEn } from '../content/pages/programsPage';
import { getStaffPageUk, getStaffPageEn } from '../content/pages/staffPage';
import { getDocumentsPageUk, getDocumentsPageEn } from '../content/pages/documentsPage';
import { getNotFoundUk, getNotFoundEn } from '../content/pages/notFound';
import { getSiteSettingsUk, getSiteSettingsEn } from '../content/pages/siteSettings';
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
  const MAP_URL = 'https://maps.google.com/maps?width=100%25&height=600&hl=uk&q=48.434606,35.034614+(ДНУ%20ім.%20Олеся%20Гончара)&t=&z=16&ie=UTF8&iwloc=&output=embed';

  const query = strapi.db.query('api::contact-info.contact-info');
  const ukRow = await query.findOne({ where: { locale: 'uk' } });
  const enRow = await query.findOne({ where: { locale: 'en' } });

  const baseUk = getContactUk();
  const baseEn = getContactEn();

  const ukData = {
    ...baseUk,
    map_embed_url: baseUk.map_embed_url || MAP_URL,
  };

  const enData = {
    ...baseEn,
    map_embed_url: baseEn.map_embed_url || MAP_URL,
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

export async function syncApplyPage(strapi: any) {
  await upsertSingleType(strapi, 'api::apply-page.apply-page', getApplyUk(), getApplyEn());
}

export async function syncProgramsPage(strapi: any) {
  await upsertSingleType(strapi, 'api::programs-page.programs-page', getProgramsPageUk(), getProgramsPageEn());
}

export async function syncStaffPage(strapi: any) {
  await upsertSingleType(strapi, 'api::staff-page.staff-page', getStaffPageUk(), getStaffPageEn());
}

export async function syncDocumentsPage(strapi: any) {
  await upsertSingleType(strapi, 'api::documents-page.documents-page', getDocumentsPageUk(), getDocumentsPageEn());
}

export async function syncNotFoundPage(strapi: any) {
  await upsertSingleType(strapi, 'api::not-found-page.not-found-page', getNotFoundUk(), getNotFoundEn());
}

export async function syncSiteSettings(strapi: any) {
  await upsertSingleType(strapi, 'api::site-settings.site-settings', getSiteSettingsUk(), getSiteSettingsEn());
}
