import type { Core, UID } from '@strapi/strapi';
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

/** Upsert a single-type in uk and en, keeping both locales on one documentId. */
async function upsertSingleType(
	strapi: Core.Strapi,
	uid: UID.ContentType,
	ukData: Record<string, unknown>,
	enData: Record<string, unknown>
) {
	const svc = strapi.documents(uid);

	// Find existing uk document
	const existingUk = await strapi.db.query(uid).findOne({ where: { locale: 'uk' } }) as { documentId?: string } | null;

	let documentId: string;

	if (existingUk?.documentId) {
		documentId = existingUk.documentId;
		// Update uk locale
		await svc.update({ documentId, locale: 'uk', data: ukData } as Parameters<typeof svc.update>[0]);
	} else {
		// Create uk locale — this is the "primary" locale that generates the documentId
		const created = await svc.create({ locale: 'uk', data: ukData } as Parameters<typeof svc.create>[0]);
		documentId = created.documentId;
	}

	// Link en to the same document. update() creates the locale if it's missing;
	// create() would make a separate, unlinked entry.
	try {
		await svc.update({ documentId, locale: 'en', data: enData } as Parameters<typeof svc.update>[0]);
	} catch (err) {
		strapi.log.warn(`[seed] Failed to upsert en locale for ${uid}: ${String(err)}`);
	}
}

export async function syncHomePage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::home-page.home-page', getHomeUk(), getHomeEn());
}

export async function syncAboutPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::about-page.about-page', getAboutUk(), getAboutEn());
}

export async function syncAlumniPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::alumni-page.alumni-page', getAlumniUk(), getAlumniEn());
}

export async function syncQualificationPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::qualification-page.qualification-page', getQualificationUk(), getQualificationEn());
}

export async function syncRetrainingPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::retraining-page.retraining-page', getRetrainingUk(), getRetrainingEn());
}

export async function syncPartnersPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::partners-page.partners-page', getPartnersPageUk(), getPartnersPageEn());
}

export async function syncPreUniversityPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::pre-university-page.pre-university-page', getPreUniversityPageUk(), getPreUniversityPageEn());
}

export async function syncContactInfo(strapi: Core.Strapi) {
	const MAP_URL = 'https://maps.google.com/maps?width=100%25&height=600&hl=uk&q=48.434606,35.034614+(ДНУ%20ім.%20Олеся%20Гончара)&t=&z=16&ie=UTF8&iwloc=&output=embed';

	const baseUk = getContactUk();
	const baseEn = getContactEn();

	const ukData = { ...baseUk, map_embed_url: baseUk.map_embed_url || MAP_URL };
	const enData = { ...baseEn, map_embed_url: baseEn.map_embed_url || MAP_URL };

	await upsertSingleType(strapi, 'api::contact-info.contact-info', ukData, enData);
}

export async function syncApplyPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::apply-page.apply-page', getApplyUk(), getApplyEn());
}

export async function syncProgramsPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::programs-page.programs-page', getProgramsPageUk(), getProgramsPageEn());
}

export async function syncStaffPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::staff-page.staff-page', getStaffPageUk(), getStaffPageEn());
}

export async function syncDocumentsPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::documents-page.documents-page', getDocumentsPageUk(), getDocumentsPageEn());
}

export async function syncNotFoundPage(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::not-found-page.not-found-page', getNotFoundUk(), getNotFoundEn());
}

export async function syncSiteSettings(strapi: Core.Strapi) {
	await upsertSingleType(strapi, 'api::site-settings.site-settings', getSiteSettingsUk(), getSiteSettingsEn());
}
