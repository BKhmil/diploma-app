/**
 * Integration tests — /api/programs
 *
 * Requires a running Strapi instance (default: http://localhost:1337).
 * Run with: npm run test:integration
 *
 * The Strapi bootstrap seeds ~18 programs on every fresh startup,
 * so these tests assert on that seeded state.
 */

import { api, post, del, STRAPI_URL } from '../helpers/api';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Checks whether Strapi is reachable before running the suite. */
async function checkReachable() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/programs`);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

const VALID_CATEGORIES = ['qualification', 'retraining', 'master', 'pre-university'];
const VALID_FORMATS = ['online', 'offline', 'mixed'];

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/programs
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/programs', () => {
  beforeAll(async () => {
    const ok = await checkReachable();
    if (!ok) {
      console.warn(
        `\n⚠  Strapi is not reachable at ${STRAPI_URL}. ` +
          'Start the Docker environment before running integration tests.\n'
      );
    }
  });

  it('returns HTTP 200', async () => {
    const { status } = await api('/api/programs');
    expect(status).toBe(200);
  });

  it('response has a "data" array and a "meta.pagination" object', async () => {
    const { body } = await api('/api/programs');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toBeDefined();
    expect(body.meta.pagination).toBeDefined();
  });

  it('seeded programs are present (expects >= 5 items)', async () => {
    const { body } = await api('/api/programs?pagination[pageSize]=100');
    expect(body.data.length).toBeGreaterThanOrEqual(5);
  });

  it('each program item has the required fields', async () => {
    const { body } = await api('/api/programs?pagination[pageSize]=100');
    for (const item of body.data) {
      // Strapi 5: fields are directly on the item (no nested "attributes")
      expect(typeof item.id).toBeDefined();
      expect(typeof item.title).toBe('string');
      expect(VALID_CATEGORIES).toContain(item.category);
      expect(typeof item.duration).toBe('number');
      expect(VALID_FORMATS).toContain(item.format);
    }
  });

  it('filters by category=qualification', async () => {
    const { body, status } = await api(
      '/api/programs?filters[category][$eq]=qualification&pagination[pageSize]=50'
    );
    expect(status).toBe(200);
    for (const item of body.data) {
      expect(item.category).toBe('qualification');
    }
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('filters by category=retraining', async () => {
    const { body } = await api(
      '/api/programs?filters[category][$eq]=retraining&pagination[pageSize]=50'
    );
    for (const item of body.data) {
      expect(item.category).toBe('retraining');
    }
  });

  it('filters by format=online', async () => {
    const { body, status } = await api(
      '/api/programs?filters[format][$eq]=online&pagination[pageSize]=50'
    );
    expect(status).toBe(200);
    for (const item of body.data) {
      expect(item.format).toBe('online');
    }
  });

  it('returns results for locale=uk', async () => {
    const { status, body } = await api('/api/programs?locale=uk');
    expect(status).toBe(200);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('returns results for locale=en', async () => {
    const { status, body } = await api('/api/programs?locale=en');
    expect(status).toBe(200);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('respects pagination[pageSize]', async () => {
    const { body } = await api('/api/programs?pagination[pageSize]=3');
    expect(body.data.length).toBeLessThanOrEqual(3);
    expect(body.meta.pagination.pageSize).toBe(3);
  });

  it('search filter works (title contains substring)', async () => {
    // Seed data includes programs with "НМТ" in the title
    const { body, status } = await api(
      '/api/programs?filters[title][$containsi]=НМТ&pagination[pageSize]=20'
    );
    expect(status).toBe(200);
    for (const item of body.data) {
      expect(item.title.toLowerCase()).toContain('нмт');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/programs/:documentId
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/programs/:documentId', () => {
  let firstItem: any;

  beforeAll(async () => {
    const { body } = await api('/api/programs?pagination[pageSize]=1');
    firstItem = body.data[0];
  });

  it('returns a single program by documentId', async () => {
    const { status, body } = await api(`/api/programs/${firstItem.documentId}`);
    expect(status).toBe(200);
    expect(body.data.documentId).toBe(firstItem.documentId);
  });

  it('returns 404 for a non-existent documentId', async () => {
    const { status } = await api('/api/programs/nonexistent-id-xyz');
    expect(status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Write protection
//
// Program create/update/delete are granted to the Authenticated role only
// (see AUTHENTICATED_ACTIONS in src/index.ts); the Public role gets read-only
// find/findOne. So anonymous (no-token) writes must be rejected with 401/403.
// The admin dashboard performs these writes with a JWT attached.
// ─────────────────────────────────────────────────────────────────────────────
describe('POST / PUT / DELETE /api/programs — rejected without a token', () => {
  it('rejects an unauthenticated create with 401/403', async () => {
    const { status } = await post('/api/programs', {
      data: {
        title: 'Jest Test Program — should be rejected',
        category: 'qualification',
        format: 'online',
        duration: 2,
        duration_unit: 'months',
        description: 'Created by integration test suite (must not persist)',
        status: 'active',
      },
    });
    expect([401, 403]).toContain(status);
  });

  it('rejects an unauthenticated delete with 401/403', async () => {
    const { status } = await del('/api/programs/any-document-id');
    expect([401, 403]).toContain(status);
  });
});
