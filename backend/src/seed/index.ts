import { syncPrograms, syncStaff, syncPartners, syncGraduates, syncDocuments, syncPreUniversitySubjects } from './sync/collections';
import { syncHomePage, syncAboutPage, syncAlumniPage, syncQualificationPage, syncRetrainingPage, syncPartnersPage, syncPreUniversityPage, syncContactInfo } from './sync/singleTypes';

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

  strapi.log.info('[seed] Seed sync complete.');
}
