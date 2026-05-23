const stripMarkers = (value: string): string =>
  value.trim().replace(/\s+\((new|uk|en)\)/gi, '').trim();

/** Appends ` (new) (uk)` or ` (new) (en)` so Strapi admin rows are easy to spot after re-seed. */
export const localizeUk = (value: string): string => {
  if (!value || !value.trim()) return value;
  return `${stripMarkers(value)} (new) (uk)`;
};

export const localizeEn = (value: string): string => {
  if (!value || !value.trim()) return value;
  return `${stripMarkers(value)} (new) (en)`;
};

export const ensureLocaleSuffix = (value: unknown, locale: 'uk' | 'en'): unknown => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  return locale === 'uk' ? localizeUk(stripMarkers(trimmed)) : localizeEn(stripMarkers(trimmed));
};

export const localizeArrayUk = (arr: string[]): string[] => arr.map(localizeUk);
export const localizeArrayEn = (arr: string[]): string[] => arr.map(localizeEn);

export const localizeObjectArrayUk = <T extends Record<string, unknown>>(
  arr: T[],
  textFields: (keyof T & string)[]
): T[] =>
  arr.map((item) => {
    const result = { ...item };
    for (const field of textFields) {
      if (typeof result[field] === 'string') {
        Object.assign(result, { [field]: localizeUk(result[field] as string) });
      }
    }
    return result;
  });

export const localizeObjectArrayEn = <T extends Record<string, unknown>>(
  arr: T[],
  textFields: (keyof T & string)[],
  translations?: Partial<Record<keyof T & string, string[]>>
): T[] =>
  arr.map((item, idx) => {
    const result = { ...item };
    for (const field of textFields) {
      if (translations && translations[field] && translations[field]![idx] !== undefined) {
        Object.assign(result, { [field]: localizeEn(translations[field]![idx]) });
      } else if (typeof result[field] === 'string') {
        Object.assign(result, { [field]: localizeEn(result[field] as string) });
      }
    }
    return result;
  });
