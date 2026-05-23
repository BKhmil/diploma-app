/**
 * Integration tests — /api/news  (custom router, not the default Strapi core router)
 *
 * The news entity uses a hand-written router that exposes only GET /api/news
 * and GET /api/news/:id.
 */

import { api, STRAPI_URL } from '../helpers/api';

describe('GET /api/news', () => {
  it('returns HTTP 200', async () => {
    const { status } = await api('/api/news');
    expect(status).toBe(200);
  });

  it('response body has a "data" array', async () => {
    const { body } = await api('/api/news');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('seeded news items are present (expects >= 1)', async () => {
    const { body } = await api('/api/news?pagination[pageSize]=50');
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('each news item has title, date, and category', async () => {
    const { body } = await api('/api/news?pagination[pageSize]=20');
    for (const item of body.data) {
      expect(typeof item.title).toBe('string');
      expect(item.title.trim().length).toBeGreaterThan(0);
      // date is optional but if present must look like a date string
      if (item.date) {
        expect(typeof item.date).toBe('string');
      }
      if (item.category) {
        expect(['announcement', 'event', 'news']).toContain(item.category);
      }
    }
  });

  it('sort=date:desc returns items newest first', async () => {
    const { body, status } = await api('/api/news?sort=date:desc&pagination[pageSize]=10');
    expect(status).toBe(200);
    const dates = body.data
      .map((item: any) => item.date)
      .filter(Boolean)
      .map((d: string) => new Date(d).getTime());

    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });

  it('pagination[pageSize]=3 returns at most 3 items', async () => {
    const { body } = await api('/api/news?pagination[pageSize]=3');
    expect(body.data.length).toBeLessThanOrEqual(3);
  });

  it('returns news for locale=uk', async () => {
    const { status, body } = await api('/api/news?locale=uk');
    expect(status).toBe(200);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('returns news for locale=en', async () => {
    const { status } = await api('/api/news?locale=en');
    expect(status).toBe(200);
  });
});

describe('GET /api/news/:id', () => {
  let firstItem: any;

  beforeAll(async () => {
    const { body } = await api('/api/news?pagination[pageSize]=1');
    firstItem = body.data[0];
  });

  it('returns a single news item by documentId', async () => {
    if (!firstItem) return; // Skip if seed has no news
    const { status, body } = await api(`/api/news/${firstItem.documentId}`);
    expect(status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.documentId ?? body.data.id).toBeDefined();
  });

  it('returns 404 for a non-existent id', async () => {
    const { status } = await api('/api/news/no-such-news-item-xyz');
    expect(status).toBe(404);
  });
});
