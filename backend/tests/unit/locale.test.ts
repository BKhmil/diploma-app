import {
  localizeUk,
  localizeEn,
  ensureLocaleSuffix,
  localizeArrayUk,
  localizeArrayEn,
  localizeObjectArrayUk,
  localizeObjectArrayEn,
} from '../../src/seed/locale';

// All locale helpers are now identity functions — they return the input unchanged.
// The (new) (uk)/(en) suffix mechanism was removed after the seed stabilised.

describe('localizeUk', () => {
  it('returns the same string unchanged', () => {
    expect(localizeUk('Програма')).toBe('Програма');
  });

  it('does not add any suffix', () => {
    expect(localizeUk('Hello')).not.toContain('(uk)');
    expect(localizeUk('Hello')).not.toContain('(new)');
  });

  it('returns an empty string unchanged', () => {
    expect(localizeUk('')).toBe('');
  });

  it('preserves whitespace', () => {
    expect(localizeUk('  Програма  ')).toBe('  Програма  ');
  });

  it('returns already-suffixed strings as-is (no double-suffix)', () => {
    expect(localizeUk('Програма (uk)')).toBe('Програма (uk)');
  });
});

describe('localizeEn', () => {
  it('returns the same string unchanged', () => {
    expect(localizeEn('Program')).toBe('Program');
  });

  it('does not add any suffix', () => {
    expect(localizeEn('Program')).not.toContain('(en)');
    expect(localizeEn('Program')).not.toContain('(new)');
  });

  it('returns an empty string unchanged', () => {
    expect(localizeEn('')).toBe('');
  });
});

describe('ensureLocaleSuffix', () => {
  it('returns the value unchanged for locale="uk"', () => {
    expect(ensureLocaleSuffix('Програма', 'uk')).toBe('Програма');
  });

  it('returns the value unchanged for locale="en"', () => {
    expect(ensureLocaleSuffix('Program', 'en')).toBe('Program');
  });

  it('passes non-string values through unchanged', () => {
    expect(ensureLocaleSuffix(42, 'uk')).toBe(42);
    expect(ensureLocaleSuffix(null, 'en')).toBe(null);
    expect(ensureLocaleSuffix(undefined, 'uk')).toBe(undefined);
    expect(ensureLocaleSuffix(true, 'en')).toBe(true);
  });

  it('handles empty string', () => {
    expect(ensureLocaleSuffix('', 'uk')).toBe('');
  });
});

describe('localizeArrayUk', () => {
  it('returns the same array reference', () => {
    const arr = ['Alpha', 'Beta', 'Gamma'];
    expect(localizeArrayUk(arr)).toBe(arr);
  });

  it('does not modify element values', () => {
    expect(localizeArrayUk(['Alpha', 'Beta'])).toEqual(['Alpha', 'Beta']);
  });

  it('returns an empty array for empty input', () => {
    expect(localizeArrayUk([])).toEqual([]);
  });
});

describe('localizeArrayEn', () => {
  it('returns the same array reference', () => {
    const arr = ['Alpha', 'Beta'];
    expect(localizeArrayEn(arr)).toBe(arr);
  });

  it('does not modify element values', () => {
    expect(localizeArrayEn(['Alpha', 'Beta'])).toEqual(['Alpha', 'Beta']);
  });
});

describe('localizeObjectArrayUk', () => {
  it('returns the same array reference', () => {
    const input = [{ title: 'Програма', order: 1 }];
    expect(localizeObjectArrayUk(input, ['title'])).toBe(input);
  });

  it('does not modify any field values', () => {
    const input = [{ title: 'Програма', order: 1 }, { title: 'Курс', order: 2 }];
    const result = localizeObjectArrayUk(input, ['title']);
    expect(result[0].title).toBe('Програма');
    expect(result[1].title).toBe('Курс');
    expect(result[0].order).toBe(1);
  });

  it('returns an empty array for empty input', () => {
    expect(localizeObjectArrayUk([], ['title'])).toEqual([]);
  });
});

describe('localizeObjectArrayEn', () => {
  it('returns the same array reference', () => {
    const input = [{ title: 'Програма' }];
    expect(localizeObjectArrayEn(input, ['title'])).toBe(input);
  });

  it('does not modify field values even when translations are provided', () => {
    const input = [{ title: 'Програма' }, { title: 'Курс' }];
    const result = localizeObjectArrayEn(input, ['title'], {
      title: ['Program', 'Course'],
    });
    // Identity function ignores translation map — returns original objects
    expect(result[0].title).toBe('Програма');
    expect(result[1].title).toBe('Курс');
  });

  it('returns an empty array for empty input', () => {
    expect(localizeObjectArrayEn([], ['title'])).toEqual([]);
  });
});
