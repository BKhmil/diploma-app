import { syncPrograms, syncStaff, syncPartners, syncGraduates, syncDocuments, syncPreUniversitySubjects, syncNews } from './sync/collections';
import { syncHomePage, syncAboutPage, syncAlumniPage, syncQualificationPage, syncRetrainingPage, syncPartnersPage, syncPreUniversityPage, syncContactInfo, syncApplyPage, syncProgramsPage, syncStaffPage, syncDocumentsPage, syncNotFoundPage, syncSiteSettings } from './sync/singleTypes';

export async function runSeedSync(strapi: any) {
  strapi.log.info('[seed] Starting seed sync...');

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
    strapi.log.info('[seed] Syncing pre-university subjects...');
    await syncPreUniversitySubjects(strapi);
  } catch (e) { strapi.log.warn(`[seed] pre-university subjects failed: ${e}`); }

  try {
    strapi.log.info('[seed] Syncing news...');
    await syncNews(strapi);
  } catch (e) { strapi.log.warn(`[seed] news failed: ${e}`); }

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

  strapi.log.info('[seed] Seed sync complete.');
}
