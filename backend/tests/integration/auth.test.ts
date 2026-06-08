/**
 * Integration tests — Authentication
 *
 * Covers:
 *   (7) Public self-registration is disabled.
 *   (8) /api/auth/local login works for a valid users-permissions user.
 *
 * The "login works" test requires a content-API user to exist.  It creates
 * one via the Strapi admin content-manager API in beforeAll (using the
 * auto-provisioned superadmin from SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD),
 * then deletes it in afterAll.  If the admin is not yet provisioned the test
 * is skipped gracefully.
 */

import { api, getAdminJwt, STRAPI_URL } from '../helpers/api';

const TEST_USER_EMAIL = `jest_auth_${Date.now()}@test.local`;
const TEST_USER_PASSWORD = 'TestPass123!';

// ─────────────────────────────────────────────────────────────────────────────
// Test case 7 — public registration is disabled
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/auth/local/register — disabled', () => {
  it('returns a non-200 status (403 or 400)', async () => {
    const { status } = await api('/api/auth/local/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'hacker',
        email: 'hacker@example.com',
        password: 'Password1!',
      }),
    });

    // Strapi returns 403 when allow_register is false, or 400 on some versions
    expect(status).not.toBe(200);
    expect(status).not.toBe(201);
  });

  it('error body contains an "error" key', async () => {
    const { body } = await api('/api/auth/local/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'hacker2',
        email: 'hacker2@example.com',
        password: 'Password1!',
      }),
    });

    expect(body.error).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test case 8 — /api/auth/local login
// ─────────────────────────────────────────────────────────────────────────────

const USER_CT = 'plugin::users-permissions.user';

/**
 * Create a users-permissions user via the Strapi content-manager API.
 * Returns the created user's documentId (needed for deletion), or null.
 *
 * Endpoints (verified against Strapi 5):
 *   - Roles:  GET  /users-permissions/roles            (admin JWT, no /api prefix)
 *   - Create: POST /content-manager/collection-types/:uid  (no /admin prefix)
 */
async function createTestContentUser(adminJwt: string): Promise<string | null> {
  const rolesRes = await fetch(`${STRAPI_URL}/users-permissions/roles`, {
    headers: { Authorization: `Bearer ${adminJwt}` },
  });
  let authenticatedRoleId: number | undefined;
  if (rolesRes.ok) {
    const rolesData = (await rolesRes.json()) as any;
    const roles: any[] = rolesData.roles ?? rolesData.data ?? [];
    const authRole = roles.find((r: any) => r.type === 'authenticated');
    authenticatedRoleId = authRole?.id;
  }

  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/${USER_CT}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminJwt}`,
      },
      body: JSON.stringify({
        username: TEST_USER_EMAIL.split('@')[0],
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        confirmed: true,
        blocked: false,
        ...(authenticatedRoleId !== undefined ? { role: authenticatedRoleId } : {}),
      }),
    }
  );

  if (!res.ok) return null;
  // content-manager returns the entity directly: { id, documentId, ... }
  const data = (await res.json()) as any;
  return data.documentId ?? null;
}

/** Delete the test user via content-manager (Strapi 5 deletes by documentId). */
async function deleteTestContentUser(adminJwt: string, documentId: string): Promise<void> {
  await fetch(
    `${STRAPI_URL}/content-manager/collection-types/${USER_CT}/${documentId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminJwt}` },
    }
  );
}

describe('POST /api/auth/local — login', () => {
  let adminJwt: string | null = null;
  let createdUserDocId: string | null = null;

  beforeAll(async () => {
    adminJwt = await getAdminJwt();
    if (!adminJwt) {
      console.warn(
        '[auth test] Admin JWT could not be obtained — ' +
          'make sure SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD are set and the test stack is running. ' +
          'Login tests will be skipped.'
      );
      return;
    }
    createdUserDocId = await createTestContentUser(adminJwt);
    if (!createdUserDocId) {
      console.warn('[auth test] Could not create test user via content-manager — login tests will be skipped.');
    }
  });

  afterAll(async () => {
    if (adminJwt && createdUserDocId) {
      await deleteTestContentUser(adminJwt, createdUserDocId);
    }
  });

  it('returns 400 for wrong credentials', async () => {
    const { status } = await api('/api/auth/local', {
      method: 'POST',
      body: JSON.stringify({
        identifier: 'nobody@nowhere.com',
        password: 'WrongPassword!',
      }),
    });
    expect(status).toBe(400);
  });

  it('returns 400 for missing password', async () => {
    const { status } = await api('/api/auth/local', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'nobody@nowhere.com' }),
    });
    expect(status).toBe(400);
  });

  it('returns 200 with a JWT and the user for valid credentials', async () => {
    // This is the core "login works" assertion (case 8). If the admin/user
    // could not be provisioned, fail loudly rather than skip silently.
    expect(createdUserDocId).toBeTruthy();

    const { status, body } = await api('/api/auth/local', {
      method: 'POST',
      body: JSON.stringify({
        identifier: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      }),
    });

    expect(status).toBe(200);
    expect(typeof body.jwt).toBe('string');
    expect(body.jwt.length).toBeGreaterThan(10);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(TEST_USER_EMAIL);
    // The frontend admin dashboard reads the user straight from this response
    // (it never calls /api/users/me), so the user object here is what matters.
  });
});
