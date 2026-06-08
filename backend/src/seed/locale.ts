/** Returns the value unchanged — locale suffix was removed (no more "(new) (uk)" markers). */
export const localizeUk = (value: string): string => value;

/** Returns the value unchanged — locale suffix was removed (no more "(new) (en)" markers). */
export const localizeEn = (value: string): string => value;

export const ensureLocaleSuffix = (value: unknown, _locale: 'uk' | 'en'): unknown => value;

export const localizeArrayUk = (arr: string[]): string[] => arr;
export const localizeArrayEn = (arr: string[]): string[] => arr;

export const localizeObjectArrayUk = <T extends Record<string, unknown>>(
  arr: T[],
  _textFields: (keyof T & string)[]
): T[] => arr;

export const localizeObjectArrayEn = <T extends Record<string, unknown>>(
  arr: T[],
  _textFields: (keyof T & string)[],
  _translations?: Partial<Record<keyof T & string, string[]>>
): T[] => arr;
