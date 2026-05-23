/**
 * Integration tests — Single-type page endpoints
 *
 * Each single type is seeded on every Strapi startup, so all endpoints
 * should return HTTP 200 with a populated "data" object.
 *
 * Tested endpoints:
 *   /api/home-page
 *   /api/about-page
 *   /api/contact-info
 *   /api/site-settings
 *   /api/alumni-page
 *   /api/programs-page
 *   /api/staff-page
 *   /api/documents-page
 *   /api/apply-page
 *   /api/not-found-page
 */

import { api } from '../helpers/api';

// ─────────────────────────────────────────────────────────────────────────────
// Reusable suite that every single-type endpoint must pass
// ─────────────────────────────────────────────────────────────────────────────
function singleTypeSuite(
  label: string,
  path: string,
  requiredFields: string[] = []
) {
  describe(label, () => {
    it('returns HTTP 200', async () => {
      const { status } = await api(path);
      expect(status).toBe(200);
    });

    it('response has a non-null "data" object', async () => {
      const { body } = await api(path);
      expect(body.data).toBeDefined();
      expect(body.data).not.toBeNull();
    });

    if (requiredFields.length > 0) {
      it(`has the required fields: ${requiredFields.join(', ')}`, async () => {
        const { body } = await api(path);
        for (const field of requiredFields) {
          expect(body.data[field]).toBeDefined();
        }
      });
    }

    it('returns data for locale=uk', async () => {
      const { status, body } = await api(`${path}?locale=uk`);
      expect(status).toBe(200);
      expect(body.data).toBeDefined();
    });

    it('returns data for locale=en', async () => {
      const { status } = await api(`${path}?locale=en`);
      expect(status).toBe(200);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Single-type suites
// ─────────────────────────────────────────────────────────────────────────────

singleTypeSuite('GET /api/home-page', '/api/home-page', [
  'hero_title',
  'hero_subtitle',
]);

singleTypeSuite('GET /api/about-page', '/api/about-page', [
  'page_title',
  'page_subtitle',
]);

singleTypeSuite('GET /api/contact-info', '/api/contact-info', [
  'address',
  'phone',
  'email',
]);

singleTypeSuite('GET /api/site-settings', '/api/site-settings', [
  'footer_copyright_template',
]);

singleTypeSuite('GET /api/alumni-page', '/api/alumni-page', [
  'hero_title',
]);

singleTypeSuite('GET /api/programs-page', '/api/programs-page', [
  'page_title',
]);

singleTypeSuite('GET /api/staff-page', '/api/staff-page', [
  'page_title',
]);

singleTypeSuite('GET /api/documents-page', '/api/documents-page', [
  'page_title',
]);

singleTypeSuite('GET /api/apply-page', '/api/apply-page', [
  'hero_title',
]);

singleTypeSuite('GET /api/not-found-page', '/api/not-found-page', [
  'title',
]);

// ─────────────────────────────────────────────────────────────────────────────
// contact-info — field-level validation
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/contact-info — field validation', () => {
  let data: any;

  beforeAll(async () => {
    const { body } = await api('/api/contact-info?locale=uk');
    data = body.data;
  });

  it('phone is a non-empty string', () => {
    expect(typeof data.phone).toBe('string');
    expect(data.phone.trim().length).toBeGreaterThan(0);
  });

  it('email contains an @ symbol', () => {
    expect(typeof data.email).toBe('string');
    expect(data.email).toContain('@');
  });

  it('address is a non-empty string', () => {
    expect(typeof data.address).toBe('string');
    expect(data.address.trim().length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// home-page — component arrays
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/home-page — component arrays', () => {
  it('popular_tags is an array when populated', async () => {
    const { body } = await api('/api/home-page?populate[popular_tags]=*&locale=uk');
    if (body.data.popular_tags !== undefined) {
      expect(Array.isArray(body.data.popular_tags)).toBe(true);
    }
  });

  it('stats is an array when populated', async () => {
    const { body } = await api('/api/home-page?populate[stats]=*&locale=uk');
    if (body.data.stats !== undefined) {
      expect(Array.isArray(body.data.stats)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// alumni-page — component arrays
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/alumni-page — component arrays', () => {
  it('hero_stats is an array when populated', async () => {
    const { body } = await api('/api/alumni-page?populate[hero_stats]=*&locale=uk');
    if (body.data.hero_stats !== undefined) {
      expect(Array.isArray(body.data.hero_stats)).toBe(true);
    }
  });

  it('employment_items is an array when populated', async () => {
    const { body } = await api(
      '/api/alumni-page?populate[hero_stats]=*&populate[employment_items]=*&locale=uk'
    );
    if (body.data.employment_items !== undefined) {
      expect(Array.isArray(body.data.employment_items)).toBe(true);
    }
  });
});
