import {
  localizeUk,
  localizeEn,
  ensureLocaleSuffix,
  localizeArrayUk,
  localizeArrayEn,
  localizeObjectArrayUk,
  localizeObjectArrayEn,
} from '../../src/seed/locale';

// ─────────────────────────────────────────────────────────────────────────────
// localizeUk
// ─────────────────────────────────────────────────────────────────────────────
describe('localizeUk', () => {
  it('appends (new) (uk) to a plain string', () => {
    expect(localizeUk('Програма')).toBe('Програма (new) (uk)');
  });

  it('strips an existing (uk) marker before re-applying', () => {
    expect(localizeUk('Програма (uk)')).toBe('Програма (new) (uk)');
  });

  it('strips an existing (en) marker and replaces with (uk)', () => {
    expect(localizeUk('Program (new) (en)')).toBe('Program (new) (uk)');
  });

  it('strips both (new) and locale markers before re-applying', () => {
    expect(localizeUk('Програма (new) (uk)')).toBe('Програма (new) (uk)');
  });

  it('handles leading and trailing whitespace', () => {
    expect(localizeUk('  Програма  ')).toBe('Програма (new) (uk)');
  });

  it('returns an empty string unchanged', () => {
    expect(localizeUk('')).toBe('');
  });

  it('returns a whitespace-only string unchanged', () => {
    expect(localizeUk('   ')).toBe('   ');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// localizeEn
// ─────────────────────────────────────────────────────────────────────────────
describe('localizeEn', () => {
  it('appends (new) (en) to a plain string', () => {
    expect(localizeEn('Program')).toBe('Program (new) (en)');
  });

  it('strips an existing (en) marker before re-applying', () => {
    expect(localizeEn('Program (en)')).toBe('Program (new) (en)');
  });

  it('strips a (uk) marker and replaces with (en)', () => {
    expect(localizeEn('Програма (new) (uk)')).toBe('Програма (new) (en)');
  });

  it('handles leading and trailing whitespace', () => {
    expect(localizeEn('  Program  ')).toBe('Program (new) (en)');
  });

  it('returns an empty string unchanged', () => {
    expect(localizeEn('')).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ensureLocaleSuffix
// ─────────────────────────────────────────────────────────────────────────────
describe('ensureLocaleSuffix', () => {
  it('applies (uk) suffix for locale="uk"', () => {
    expect(ensureLocaleSuffix('Програма', 'uk')).toBe('Програма (new) (uk)');
  });

  it('applies (en) suffix for locale="en"', () => {
    expect(ensureLocaleSuffix('Program', 'en')).toBe('Program (new) (en)');
  });

  it('passes non-string values through unchanged', () => {
    expect(ensureLocaleSuffix(42, 'uk')).toBe(42);
    expect(ensureLocaleSuffix(null, 'en')).toBe(null);
    expect(ensureLocaleSuffix(undefined, 'uk')).toBe(undefined);
    expect(ensureLocaleSuffix(true, 'en')).toBe(true);
  });

  it('handles empty string without appending suffix', () => {
    expect(ensureLocaleSuffix('', 'uk')).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// localizeArrayUk / localizeArrayEn
// ─────────────────────────────────────────────────────────────────────────────
describe('localizeArrayUk', () => {
  it('localizes every element with the (uk) suffix', () => {
    const result = localizeArrayUk(['Alpha', 'Beta', 'Gamma']);
    expect(result).toEqual([
      'Alpha (new) (uk)',
      'Beta (new) (uk)',
      'Gamma (new) (uk)',
    ]);
  });

  it('returns an empty array for an empty input', () => {
    expect(localizeArrayUk([])).toEqual([]);
  });
});

describe('localizeArrayEn', () => {
  it('localizes every element with the (en) suffix', () => {
    const result = localizeArrayEn(['Alpha', 'Beta']);
    expect(result).toEqual(['Alpha (new) (en)', 'Beta (new) (en)']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// localizeObjectArrayUk
// ─────────────────────────────────────────────────────────────────────────────
describe('localizeObjectArrayUk', () => {
  it('localizes only the specified text fields', () => {
    const input = [
      { title: 'Програма', order: 1 },
      { title: 'Курс', order: 2 },
    ];
    const result = localizeObjectArrayUk(input, ['title']);
    expect(result[0].title).toBe('Програма (new) (uk)');
    expect(result[1].title).toBe('Курс (new) (uk)');
    // Non-text fields must not be touched
    expect(result[0].order).toBe(1);
    expect(result[1].order).toBe(2);
  });

  it('localizes multiple fields when specified', () => {
    const input = [{ name: 'Іван', department: 'ІТ' }];
    const result = localizeObjectArrayUk(input, ['name', 'department']);
    expect(result[0].name).toBe('Іван (new) (uk)');
    expect(result[0].department).toBe('ІТ (new) (uk)');
  });

  it('skips fields whose value is not a string', () => {
    const input = [{ title: 'Test', count: 5 }];
    const result = localizeObjectArrayUk(input as any, ['title', 'count' as any]);
    expect(result[0].title).toBe('Test (new) (uk)');
    expect(result[0].count).toBe(5);
  });

  it('returns an empty array for an empty input', () => {
    expect(localizeObjectArrayUk([], ['title'])).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const input = [{ title: 'Original' }];
    localizeObjectArrayUk(input, ['title']);
    expect(input[0].title).toBe('Original');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// localizeObjectArrayEn
// ─────────────────────────────────────────────────────────────────────────────
describe('localizeObjectArrayEn', () => {
  it('falls back to localizeEn on the original value when no translation is provided', () => {
    const input = [{ title: 'Програма' }];
    const result = localizeObjectArrayEn(input, ['title']);
    expect(result[0].title).toBe('Програма (new) (en)');
  });

  it('uses the provided translation string instead of the original value', () => {
    const input = [{ title: 'Програма' }, { title: 'Курс' }];
    const result = localizeObjectArrayEn(input, ['title'], {
      title: ['Program', 'Course'],
    });
    expect(result[0].title).toBe('Program (new) (en)');
    expect(result[1].title).toBe('Course (new) (en)');
  });

  it('uses the original value when the translation array is shorter than the input', () => {
    const input = [{ title: 'Alpha' }, { title: 'Beta' }];
    const result = localizeObjectArrayEn(input, ['title'], {
      title: ['Alpha-en'],
    });
    expect(result[0].title).toBe('Alpha-en (new) (en)');
    // index 1 has no translation → falls back to original
    expect(result[1].title).toBe('Beta (new) (en)');
  });

  it('does not mutate the original array', () => {
    const input = [{ title: 'Original' }];
    localizeObjectArrayEn(input, ['title']);
    expect(input[0].title).toBe('Original');
  });
});
