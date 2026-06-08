import { Program } from '../types';
import { AppLocale } from '../context/LanguageContext';

// When VITE_STRAPI_URL is explicitly set to '' (empty string, server deploy with nginx proxy),
// we use '' so all API calls become relative paths (/api/...) and nginx routes them.
// Fall back to localhost only when the env var is truly absent (local dev without Docker).
const STRAPI_BASE_URL = ((import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337') as string).replace(/\/$/, '');
const STRAPI_LOCALE = (import.meta.env.VITE_STRAPI_LOCALE || 'uk').toLowerCase();

/** The locale used for all admin-dashboard write operations.
 *  Every POST/PUT/DELETE to an i18n-enabled collection must include this. */
const ADMIN_LOCALE = 'uk';

type StrapiEntity<T> = {
  id: number | string;
  attributes?: T;
} & T;

type StrapiListResponse<T> = {
  data: Array<StrapiEntity<T>>;
};

type StrapiSingleResponse<T> = {
  data: StrapiEntity<T> | null;
};

const isObject = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null;

const normalizeEntity = <T extends Record<string, any>>(entity: StrapiEntity<T>): T & { id: string } => {
  const source = isObject(entity.attributes) ? entity.attributes : entity;
  return {
    ...source,
    id: String(entity.id),
  };
};

const getAuthHeader = (): Record<string, string> => {
  const jwt = localStorage.getItem('strapiJwt');
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
};

/** Authenticated request — attaches the stored JWT if present. Use for write operations and admin panel data. */
const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${STRAPI_BASE_URL}/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    throw new Error(`${res.status}`);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as unknown as T;
  }

  return res.json();
};

/** Public request — never sends a JWT. Use for read-only public content so a
 *  stored admin JWT doesn't trigger the Authenticated role and cause 403s. */
const publicRequest = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${STRAPI_BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`${res.status}`);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as unknown as T;
  }

  return res.json();
};

/** Admin write request — always appends ?locale=uk so i18n-enabled entries are
 *  saved in the Ukrainian locale rather than Strapi's internal fallback. */
const adminRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const separator = path.includes('?') ? '&' : '?';
  return request<T>(`${path}${separator}locale=${ADMIN_LOCALE}`, init);
};

const withLocale = (path: string) => {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}locale=${encodeURIComponent(STRAPI_LOCALE)}`;
};

const withRuntimeLocale = (path: string, locale?: AppLocale) => {
  if (!locale) return withLocale(path);
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}locale=${encodeURIComponent(locale)}`;
};

const resolveLocale = (locale?: AppLocale): AppLocale =>
  locale || (STRAPI_LOCALE === 'en' ? 'en' : 'uk');

const shouldFallbackToUk = (locale?: AppLocale) => resolveLocale(locale) === 'en';

const hasNoData = (response: any): boolean => {
  if (!response || typeof response !== 'object') return true;
  if ('data' in response) {
    const data = (response as any).data;
    if (Array.isArray(data)) return data.length === 0;
    return data == null;
  }
  return false;
};

const requestWithLocaleFallback = async <T>(
  path: string,
  locale?: AppLocale,
  fallbackOnEmpty = false
): Promise<T> => {
  const activeLocale = resolveLocale(locale);

  try {
    const primary = await publicRequest<T>(withRuntimeLocale(path, activeLocale));
    if (fallbackOnEmpty && shouldFallbackToUk(activeLocale) && hasNoData(primary)) {
      return publicRequest<T>(withRuntimeLocale(path, 'uk'));
    }
    return primary;
  } catch (error) {
    if (shouldFallbackToUk(activeLocale)) {
      return publicRequest<T>(withRuntimeLocale(path, 'uk'));
    }
    throw error;
  }
};

export interface StrapiProgram extends Program {
  documentId: string;
}

export const getPrograms = async (locale?: AppLocale): Promise<StrapiProgram[]> => {
  const response = await requestWithLocaleFallback<StrapiListResponse<any>>(
    '/programs?pagination[pageSize]=100&sort=createdAt:desc',
    locale,
    true
  );
  return response.data.map((item) => {
    const entry = normalizeEntity(item);
    return {
      id: entry.program_code || entry.id,
      documentId: item.documentId as string,
      title: entry.title,
      category: entry.category,
      duration: entry.duration != null ? Number(entry.duration) : (entry.duration_hours ? Math.round(entry.duration_hours / 4) : 1),
      duration_unit: entry.duration_unit ?? 'months',
      format: entry.format,
      credits: entry.credits ?? entry.credits_ects,
      description: entry.description || '',
      targetAudience: entry.target_audience,
      startDate: entry.start_date,
      price: entry.price != null ? Number(entry.price) : undefined,
      certificate: entry.certificate,
      groupSize: entry.group_size,
      outcomes: Array.isArray(entry.outcomes) ? entry.outcomes : [],
      modules: Array.isArray(entry.modules) ? entry.modules : [],
      faq: Array.isArray(entry.faq) ? entry.faq : [],
      is_featured: entry.is_featured ?? false,
      icon_emoji: entry.icon_emoji || undefined,
      price_hint: entry.price_hint || undefined,
    } as StrapiProgram;
  });
};

export const createProgram = async (
  data: Omit<Program, 'id'>
): Promise<StrapiProgram> => {
  const response = await adminRequest<any>('/programs', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        program_code: `custom-${Date.now()}`,
        title: data.title,
        category: data.category,
        format: data.format,
        duration: data.duration,
        duration_unit: data.duration_unit ?? 'months',
        price: data.price || null,
        description: data.description || '',
        target_audience: data.targetAudience || '',
      },
    }),
  });
  const e = normalizeEntity(response.data);
  return {
    ...e,
    id: e.program_code || String(e.id),
    documentId: response.data?.documentId as string,
  } as StrapiProgram;
};

export const updateProgram = async (
  documentId: string,
  data: Partial<Omit<Program, 'id'>>
): Promise<StrapiProgram> => {
  const payload: Record<string, unknown> = {};
  if (data.title     !== undefined) payload.title          = data.title;
  if (data.category  !== undefined) payload.category       = data.category;
  if (data.format    !== undefined) payload.format         = data.format;
  if (data.duration      !== undefined) payload.duration      = data.duration;
  if (data.duration_unit !== undefined) payload.duration_unit = data.duration_unit;
  if (data.price         !== undefined) payload.price         = data.price ?? null;
  if (data.description !== undefined) payload.description  = data.description;
  if (data.targetAudience !== undefined) payload.target_audience = data.targetAudience;
  const response = await adminRequest<any>(`/programs/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify({ data: payload }),
  });
  const e = normalizeEntity(response.data);
  return {
    ...e,
    id: e.program_code || String(e.id),
    documentId: response.data?.documentId as string ?? documentId,
  } as StrapiProgram;
};

export const deleteProgram = async (documentId: string): Promise<void> => {
  await adminRequest(`/programs/${documentId}`, { method: 'DELETE' });
};

export const createApplication = async (
  payload: {
    full_name: string;
    email: string;
    phone?: string;
    organization?: string;
    city?: string;
    program_name?: string;
    message?: string;
    financing?: string;
    birth_date?: string;
    education_level?: string;
    diploma_specialty?: string;
    app_type?: 'application' | 'contact';
  },
  files?: {
    diploma?: File;
    passport?: File;
    ipn?: File;
    photo?: File;
  }
) => {
  if (!files || (!files.diploma && !files.passport && !files.ipn && !files.photo)) {
    const res = await fetch(`${STRAPI_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({})) as { error?: { message?: string } };
      throw new Error(errBody?.error?.message || `${res.status}`);
    }
    return res.json();
  }

  const formData = new FormData();
  formData.append('data', JSON.stringify(payload));
  if (files.diploma)  formData.append('files.doc_diploma',  files.diploma,  files.diploma.name);
  if (files.passport) formData.append('files.doc_passport', files.passport, files.passport.name);
  if (files.ipn)      formData.append('files.doc_ipn',      files.ipn,      files.ipn.name);
  if (files.photo)    formData.append('files.doc_photo',    files.photo,    files.photo.name);

  const res = await fetch(`${STRAPI_BASE_URL}/api/applications`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(errBody?.error?.message || `${res.status}`);
  }
  return res.json();
};

// ── Admin: Applications ────────────────────────────────────────────────────

export type AppStatus = 'new' | 'processing' | 'accepted' | 'rejected';

export interface StrapiMediaFile {
  id: number;
  name: string;
  url: string;
  mime: string;
  size: number;
}

export interface StrapiApplication {
  id: number;
  documentId: string;
  num: number;
  full_name: string;
  email: string;
  phone?: string;
  program_name?: string;
  organization?: string;
  city?: string;
  category?: string;
  financing?: string;
  status: AppStatus;
  manager_comment?: string;
  app_type: 'application' | 'contact';
  createdAt: string;
  doc_diploma?: StrapiMediaFile;
  doc_passport?: StrapiMediaFile;
  doc_ipn?: StrapiMediaFile;
  doc_photo?: StrapiMediaFile;
}

export const getApplications = async (params?: {
  status?: AppStatus | 'all';
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: StrapiApplication[]; total: number }> => {
  const qs = new URLSearchParams();
  qs.set('pagination[pageSize]', String(params?.pageSize ?? 50));
  qs.set('pagination[page]', String(params?.page ?? 1));
  qs.set('sort', 'num:desc');
  qs.set('populate[doc_diploma]', 'true');
  qs.set('populate[doc_passport]', 'true');
  qs.set('populate[doc_ipn]', 'true');
  qs.set('populate[doc_photo]', 'true');
  if (params?.status && params.status !== 'all') {
    qs.set('filters[status][$eq]', params.status);
  }
  if (params?.search) {
    qs.set('filters[$or][0][full_name][$containsi]', params.search);
    qs.set('filters[$or][1][email][$containsi]', params.search);
  }
  const response = await request<any>(`/applications?${qs.toString()}`);
  const items: StrapiApplication[] = (response.data || []).map((item: any) => {
    const e = normalizeEntity(item);
    return { ...e, id: Number(e.id) } as StrapiApplication;
  });
  return { data: items, total: response.meta?.pagination?.total ?? items.length };
};

export const updateApplication = async (
  documentId: string,
  data: Partial<Pick<StrapiApplication, 'status' | 'manager_comment' | 'category' | 'financing'>>
): Promise<StrapiApplication> => {
  const response = await request<any>(`/applications/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return normalizeEntity(response.data) as StrapiApplication;
};

export const deleteApplication = async (documentId: string): Promise<void> => {
  await request(`/applications/${documentId}`, { method: 'DELETE' });
};

export const getApplicationsStats = async (): Promise<Record<AppStatus | 'total', number>> => {
  const [all, newA, proc, acc, rej] = await Promise.all([
    request<any>('/applications?pagination[pageSize]=1'),
    request<any>('/applications?pagination[pageSize]=1&filters[status][$eq]=new'),
    request<any>('/applications?pagination[pageSize]=1&filters[status][$eq]=processing'),
    request<any>('/applications?pagination[pageSize]=1&filters[status][$eq]=accepted'),
    request<any>('/applications?pagination[pageSize]=1&filters[status][$eq]=rejected'),
  ]);
  return {
    total: all.meta?.pagination?.total ?? 0,
    new: newA.meta?.pagination?.total ?? 0,
    processing: proc.meta?.pagination?.total ?? 0,
    accepted: acc.meta?.pagination?.total ?? 0,
    rejected: rej.meta?.pagination?.total ?? 0,
  };
};

// ── Admin: Students (types declared early for Enrollment reference) ────────

export type StudentStatus = 'active' | 'completed' | 'paused';

export interface StrapiStudent {
  id: number;
  documentId: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  email: string;
  phone?: string;
  program_name?: string;
  enrolled?: string;  // ISO date string yyyy-mm-dd
  status: StudentStatus;
}

export const studentFullName = (s: Pick<StrapiStudent, 'last_name' | 'first_name' | 'middle_name'>): string =>
  [s.last_name, s.first_name, s.middle_name].filter(Boolean).join(' ');

// ── Admin: Enrollments ─────────────────────────────────────────────────────

export type EnrollmentStatus = 'active' | 'completed' | 'cancelled';

export interface StrapiEnrollment {
  id: number;
  documentId: string;
  student: Pick<StrapiStudent, 'id' | 'documentId' | 'last_name' | 'first_name' | 'middle_name' | 'email' | 'phone'>;
  program_name?: string;
  enrolled_at?: string;
  status: EnrollmentStatus;
}

export const getEnrollments = async (): Promise<StrapiEnrollment[]> => {
  const qs = new URLSearchParams();
  qs.set('pagination[pageSize]', '200');
  qs.set('sort', 'enrolled_at:desc');
  qs.set('populate[student]', 'true');
  qs.set('populate[program]', 'true');
  const response = await request<any>(`/enrollments?${qs.toString()}`);
  return (response.data || []).map((item: any) => {
    const e = normalizeEntity(item);
    const program = item.program ? normalizeEntity(item.program) : null;
    return {
      ...e,
      id: Number(e.id),
      program_name: program?.title ?? e.program_name ?? undefined,
      student: e.student ? { ...normalizeEntity(item.student ?? {}), id: Number(e.student?.id ?? 0) } : null,
    } as StrapiEnrollment;
  });
};

export const updateEnrollment = async (
  documentId: string,
  data: Partial<Pick<StrapiEnrollment, 'status'>>
): Promise<StrapiEnrollment> => {
  const response = await request<any>(`/enrollments/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return normalizeEntity(response.data) as StrapiEnrollment;
};

export const deleteEnrollment = async (documentId: string): Promise<void> => {
  await request(`/enrollments/${documentId}`, { method: 'DELETE' });
};

// ── Admin: Students (functions) ────────────────────────────────────────────

export const getStudents = async (search?: string): Promise<StrapiStudent[]> => {
  const qs = new URLSearchParams();
  qs.set('pagination[pageSize]', '200');
  qs.set('sort', 'createdAt:desc');
  if (search) {
    qs.set('filters[$or][0][last_name][$containsi]', search);
    qs.set('filters[$or][1][first_name][$containsi]', search);
    qs.set('filters[$or][2][middle_name][$containsi]', search);
    qs.set('filters[$or][3][email][$containsi]', search);
  }
  const response = await request<any>(`/students?${qs.toString()}`);
  return (response.data || []).map((item: any) => {
    const e = normalizeEntity(item);
    return { ...e, id: Number(e.id) } as StrapiStudent;
  });
};

export const createStudent = async (
  data: Omit<StrapiStudent, 'id' | 'documentId'>
): Promise<StrapiStudent> => {
  const response = await request<any>('/students', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  return normalizeEntity(response.data) as StrapiStudent;
};

export const updateStudent = async (
  documentId: string,
  data: Partial<Omit<StrapiStudent, 'id' | 'documentId'>>
): Promise<StrapiStudent> => {
  const response = await request<any>(`/students/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return normalizeEntity(response.data) as StrapiStudent;
};

export const deleteStudent = async (documentId: string): Promise<void> => {
  await request(`/students/${documentId}`, { method: 'DELETE' });
};

export const getContactInfo = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>('/contact-info', locale, true);
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getDocuments = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiListResponse<any>>(
    '/documents?pagination[pageSize]=200&populate=*',
    locale,
    true
  );
  return response.data.map(normalizeEntity);
};

export const getPartners = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiListResponse<any>>(
    '/partners?pagination[pageSize]=200&populate=*',
    locale,
    true
  );
  return response.data.map(normalizeEntity);
};

export const getStaffMembers = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiListResponse<any>>(
    '/staff-members?pagination[pageSize]=200&populate=*',
    locale,
    true
  );
  return response.data.map(normalizeEntity);
};

export const getGraduates = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiListResponse<any>>(
    '/graduates?pagination[pageSize]=200&populate=*',
    locale,
    true
  );
  return response.data.map(normalizeEntity);
};

export const getHomePage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/home-page?populate[quality_bullets]=*&populate[direction_cards]=*&populate[admissions_cards]=*&populate[stats]=*&populate[popular_tags]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getAboutPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/about-page?populate[mission_checklist]=*&populate[timeline_items]=*&populate[leadership_items]=*&populate[mission_stats]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getAlumniPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/alumni-page?populate[hero_stats]=*&populate[employment_items]=*&populate[achievement_items]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getQualificationPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/qualification-page',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getRetrainingPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/retraining-page?populate[admission_docs_retraining]=*&populate[admission_docs_master]=*&populate[important_dates]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getPartnersPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/partners-page?populate[stats]=*&populate[benefits]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getPreUniversityPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/pre-university-page?populate[steps]=*&populate[advantages]=*&populate[schedule_rows]=*&populate[org_items]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const mediaUrl = (file: { url?: string } | null | undefined): string | null => {
  if (!file?.url) return null;
  if (file.url.startsWith('http')) return file.url;
  return `${STRAPI_BASE_URL}${file.url}`;
};

export const getApplyPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/apply-page?populate[next_steps]=*&populate[documents_required]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getProgramsPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/programs-page?populate[popular_tags]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getStaffPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/staff-page',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getDocumentsPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/documents-page?populate[category_labels]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getNotFoundPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/not-found-page?populate[popular_links]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getSiteSettings = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/site-settings',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export interface StrapiNewsItem {
  id: string;
  documentId: string;
  title: string;
  excerpt?: string;
  content?: string;
  date?: string;
  category: 'news' | 'announcement' | 'event';
  is_pinned?: boolean;
  slug?: string;
  cover_image?: { url: string; mime: string };
}

export const getNews = async (locale?: AppLocale, limit = 3): Promise<StrapiNewsItem[]> => {
  const response = await requestWithLocaleFallback<StrapiListResponse<any>>(
    `/news?pagination[pageSize]=${limit}&sort=date:desc&populate=cover_image`,
    locale,
    true
  );
  return response.data.map((item) => {
    const e = normalizeEntity(item);
    return {
      id: String(e.id),
      documentId: item.documentId as string,
      title: e.title,
      excerpt: e.excerpt,
      content: e.content,
      date: e.date,
      category: e.category ?? 'news',
      is_pinned: e.is_pinned ?? false,
      slug: e.slug,
      cover_image: e.cover_image,
    } as StrapiNewsItem;
  });
};

export const strapiLogin = async (
  identifier: string,
  password: string
): Promise<{ jwt: string; user: { id: number; username: string; email: string } }> => {
  const res = await fetch(`${STRAPI_BASE_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data?.error?.message || `${res.status}`;
    throw new Error(msg);
  }
  return res.json();
};
