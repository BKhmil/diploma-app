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
}) => {
  return request('/applications', {
    method: 'POST',
    body: JSON.stringify({ data: payload }),
  });
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
