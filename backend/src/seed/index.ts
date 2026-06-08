import type { Core } from '@strapi/strapi';
import { syncPrograms, syncStaff, syncPartners, syncGraduates, syncDocuments, syncNews, syncPreUniversityGroups } from './sync/collections';
import {
	syncHomePage,
	syncAboutPage,
	syncAlumniPage,
	syncQualificationPage,
	syncRetrainingPage,
	syncPartnersPage,
	syncPreUniversityPage,
	syncContactInfo,
	syncApplyPage,
	syncProgramsPage,
	syncStaffPage,
	syncDocumentsPage,
	syncNotFoundPage,
	syncSiteSettings,
} from './sync/singleTypes';

const SEED_STORE_KEY = 'completed';
const SEED_PLUGIN_KEY = 'diploma-seed';

/**
 * Run the content seed exactly once per database.
 *
 * Gates:
 *   SEED_ON_FIRST_RUN=false  → disabled entirely (skip on every boot)
 *   SEED_FORCE=true          → always re-seed (override the "already done" marker)
 *
 * Non-destructive helpers (ensureUkLocale, ensurePublicPermissions, backfillI18nLocales)
 * live in backend/src/index.ts and run every boot — they are NOT gated here.
 */
export async function runSeedSync(strapi: Core.Strapi) {
	// Allow completely disabling the seeder via env
	if (process.env.SEED_ON_FIRST_RUN === 'false') {
		strapi.log.info('[seed] SEED_ON_FIRST_RUN=false — skipping content seed');
		return;
	}

	const force = process.env.SEED_FORCE === 'true';

	// Check the persistent marker stored in the Strapi core store (survives restarts)
	const store = strapi.store({ type: 'plugin', name: SEED_PLUGIN_KEY });
	const alreadySeeded = await store.get({ key: SEED_STORE_KEY });

	if (alreadySeeded && !force) {
		strapi.log.info('[seed] Already seeded — skipping (set SEED_FORCE=true to re-run)');
		return;
	}

	if (force) {
		strapi.log.info('[seed] SEED_FORCE=true — re-seeding content');
	} else {
		strapi.log.info('[seed] First run — seeding content...');
	}

	// Collections
	try {
		strapi.log.info('[seed] Syncing programs...');
		await syncPrograms(strapi);
	} catch (e) { strapi.log.warn(`[seed] programs failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing staff...');
		await syncStaff(strapi);
	} catch (e) { strapi.log.warn(`[seed] staff failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing partners...');
		await syncPartners(strapi);
	} catch (e) { strapi.log.warn(`[seed] partners failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing graduates...');
		await syncGraduates(strapi);
	} catch (e) { strapi.log.warn(`[seed] graduates failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing documents...');
		await syncDocuments(strapi);
	} catch (e) { strapi.log.warn(`[seed] documents failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing news...');
		await syncNews(strapi);
	} catch (e) { strapi.log.warn(`[seed] news failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing pre-university groups...');
		await syncPreUniversityGroups(strapi);
	} catch (e) { strapi.log.warn(`[seed] pre-university groups failed: ${e}`); }

	// Single types
	try {
		strapi.log.info('[seed] Syncing home page...');
		await syncHomePage(strapi);
	} catch (e) { strapi.log.warn(`[seed] home page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing about page...');
		await syncAboutPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] about page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing alumni page...');
		await syncAlumniPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] alumni page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing qualification page...');
		await syncQualificationPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] qualification page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing retraining page...');
		await syncRetrainingPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] retraining page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing partners page...');
		await syncPartnersPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] partners page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing pre-university page...');
		await syncPreUniversityPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] pre-university page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing contact info...');
		await syncContactInfo(strapi);
	} catch (e) { strapi.log.warn(`[seed] contact info failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing apply page...');
		await syncApplyPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] apply page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing programs page...');
		await syncProgramsPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] programs page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing staff page...');
		await syncStaffPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] staff page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing documents page...');
		await syncDocumentsPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] documents page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing not-found page...');
		await syncNotFoundPage(strapi);
	} catch (e) { strapi.log.warn(`[seed] not-found page failed: ${e}`); }

	try {
		strapi.log.info('[seed] Syncing site settings...');
		await syncSiteSettings(strapi);
	} catch (e) { strapi.log.warn(`[seed] site settings failed: ${e}`); }

	// Mark as seeded so future boots skip this
	await store.set({ key: SEED_STORE_KEY, value: true });
	strapi.log.info('[seed] Content seed complete. Future boots will skip (use SEED_FORCE=true to re-run).');
}
