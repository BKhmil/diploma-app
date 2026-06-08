/**
 * Shared helpers for integration tests.
 *
 * - `api(path, init?)` — thin fetch wrapper; returns the parsed JSON body and
 *   the raw Response so callers can assert on both status and body.
 * - `STRAPI_URL` — base URL of the running Strapi instance, configurable via
 *   the STRAPI_URL environment variable (default: http://localhost:1337).
 */

export const STRAPI_URL =
  (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');

type ApiResponse<T = unknown> = {
  status: number;
  body: T;
  headers: Headers;
};

/**
 * Make an HTTP request to the Strapi API and return status + parsed body.
 *
 * @example
 * const { status, body } = await api('/api/programs?locale=uk');
 */
export async function api<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${STRAPI_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init.headers as object) },
    ...init,
  });

  let body: T;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = (await res.json()) as T;
  } else {
    body = (await res.text()) as unknown as T;
  }

  return { status: res.status, body, headers: res.headers };
}

/** POST helper */
export const post = <T = any>(path: string, data: object) =>
  api<T>(path, { method: 'POST', body: JSON.stringify(data) });

/** PUT helper */
export const put = <T = any>(path: string, data: object) =>
  api<T>(path, { method: 'PUT', body: JSON.stringify(data) });

/** DELETE helper */
export const del = (path: string) => api(path, { method: 'DELETE' });

/** Generate a unique test email to avoid duplicate-application collisions across runs. */
export const uniqueEmail = (prefix = 'test') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@jest.local`;

/**
 * POST a multipart/form-data request.  Do NOT pass Content-Type manually —
 * Node's fetch sets it automatically with the correct boundary.
 */
export async function multipartPost<T = any>(
  path: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const url = `${STRAPI_URL}${path}`;
  const res = await fetch(url, { method: 'POST', body: formData });

  let body: T;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = (await res.json()) as T;
  } else {
    body = (await res.text()) as unknown as T;
  }

  return { status: res.status, body, headers: res.headers };
}

/**
 * Authenticate to the Strapi *admin* panel and return the admin JWT,
 * or null if the admin is not yet provisioned / credentials are wrong.
 * Used by auth tests to create test content-API users on the fly.
 */
export async function getAdminJwt(): Promise<string | null> {
  const email = process.env.SUPERADMIN_EMAIL || 'admin@test.local';
  const password = process.env.SUPERADMIN_PASSWORD || 'TestAdmin123!';
  try {
    // Strapi admin login is POST /admin/login → { data: { token } }
    const res = await fetch(`${STRAPI_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as any;
    return data.data?.token ?? null;
  } catch {
    return null;
  }
}
