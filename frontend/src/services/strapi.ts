import { Program } from '../types';
import { AppLocale } from '../context/LanguageContext';

const STRAPI_BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const STRAPI_LOCALE = (import.meta.env.VITE_STRAPI_LOCALE || 'uk').toLowerCase();

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

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${STRAPI_BASE_URL}/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status}`);
  }

  return res.json();
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
    const primary = await request<T>(withRuntimeLocale(path, activeLocale));
    if (fallbackOnEmpty && shouldFallbackToUk(activeLocale) && hasNoData(primary)) {
      return request<T>(withRuntimeLocale(path, 'uk'));
    }
    return primary;
  } catch (error) {
    if (shouldFallbackToUk(activeLocale)) {
      return request<T>(withRuntimeLocale(path, 'uk'));
    }
    throw error;
  }
};

export const getPrograms = async (locale?: AppLocale): Promise<Program[]> => {
  const response = await requestWithLocaleFallback<StrapiListResponse<any>>(
    '/programs?pagination[pageSize]=100&sort=createdAt:desc',
    locale,
    true
  );
  return response.data.map((item) => {
    const entry = normalizeEntity(item);
    return {
      id: entry.program_code || entry.id,
      title: entry.title,
      category: entry.category,
      duration: entry.duration || (entry.duration_hours ? `${entry.duration_hours} годин` : ''),
      format: entry.format,
      credits: entry.credits ?? entry.credits_ects,
      description: entry.description || '',
      targetAudience: entry.target_audience,
      startDate: entry.start_date,
      price: entry.price,
      certificate: entry.certificate,
      groupSize: entry.group_size,
      outcomes: Array.isArray(entry.outcomes) ? entry.outcomes : [],
      modules: Array.isArray(entry.modules) ? entry.modules : [],
      faq: Array.isArray(entry.faq) ? entry.faq : [],
    } as Program;
  });
};

export const createApplication = async (payload: {
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
}) => {
  return request('/applications', {
    method: 'POST',
    body: JSON.stringify({ data: payload }),
  });
};

// ── Admin: Applications ────────────────────────────────────────────────────

export type AppStatus = 'new' | 'processing' | 'accepted' | 'rejected';

export interface StrapiApplication {
  id: number;
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
  id: number,
  data: Partial<Pick<StrapiApplication, 'status' | 'manager_comment' | 'category' | 'financing'>>
): Promise<StrapiApplication> => {
  const response = await request<any>(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return normalizeEntity(response.data) as StrapiApplication;
};

export const deleteApplication = async (id: number): Promise<void> => {
  await request(`/applications/${id}`, { method: 'DELETE' });
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

// ── Admin: Students ────────────────────────────────────────────────────────

export type StudentStatus = 'active' | 'completed' | 'paused';

export interface StrapiStudent {
  id: number;
  name: string;
  email: string;
  phone?: string;
  program_name?: string;
  enrolled?: string;
  status: StudentStatus;
}

export const getStudents = async (search?: string): Promise<StrapiStudent[]> => {
  const qs = new URLSearchParams();
  qs.set('pagination[pageSize]', '200');
  qs.set('sort', 'createdAt:desc');
  if (search) {
    qs.set('filters[$or][0][name][$containsi]', search);
    qs.set('filters[$or][1][email][$containsi]', search);
  }
  const response = await request<any>(`/students?${qs.toString()}`);
  return (response.data || []).map((item: any) => {
    const e = normalizeEntity(item);
    return { ...e, id: Number(e.id) } as StrapiStudent;
  });
};

export const createStudent = async (
  data: Omit<StrapiStudent, 'id'>
): Promise<StrapiStudent> => {
  const response = await request<any>('/students', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  return normalizeEntity(response.data) as StrapiStudent;
};

export const updateStudent = async (
  id: number,
  data: Partial<Omit<StrapiStudent, 'id'>>
): Promise<StrapiStudent> => {
  const response = await request<any>(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return normalizeEntity(response.data) as StrapiStudent;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await request(`/students/${id}`, { method: 'DELETE' });
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

export const getPreUniversityGroups = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiListResponse<any>>(
    '/pre-university-groups?pagination[pageSize]=100&sort=createdAt:desc',
    locale,
    true
  );
  return response.data.map(normalizeEntity);
};

export const getHomePage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/home-page?populate[quality_bullets]=*&populate[direction_cards]=*&populate[admissions_cards]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};

export const getAboutPage = async (locale?: AppLocale) => {
  const response = await requestWithLocaleFallback<StrapiSingleResponse<any>>(
    '/about-page?populate[mission_checklist]=*&populate[timeline_items]=*&populate[leadership_items]=*',
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
    '/pre-university-page?populate[steps]=*',
    locale,
    true
  );
  if (!response.data) return null;
  return normalizeEntity(response.data);
};
