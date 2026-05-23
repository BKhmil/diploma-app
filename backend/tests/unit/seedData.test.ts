import { seedPrograms, SeedProgram } from '../../src/seed/content/programs';

const VALID_CATEGORIES: SeedProgram['category'][] = [
  'qualification',
  'retraining',
  'master',
  'pre-university',
];

const VALID_DURATION_UNITS: SeedProgram['duration_unit'][] = [
  'weeks',
  'months',
  'years',
];

const VALID_FORMATS: SeedProgram['format'][] = ['online', 'offline', 'mixed'];

// ─────────────────────────────────────────────────────────────────────────────
// Shape validation
// ─────────────────────────────────────────────────────────────────────────────
describe('seedPrograms — shape', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(seedPrograms)).toBe(true);
    expect(seedPrograms.length).toBeGreaterThan(0);
  });

  it('every program has a non-empty program_code', () => {
    for (const p of seedPrograms) {
      expect(typeof p.program_code).toBe('string');
      expect(p.program_code.trim().length).toBeGreaterThan(0);
    }
  });

  it('every program has a non-empty title', () => {
    for (const p of seedPrograms) {
      expect(typeof p.title).toBe('string');
      expect(p.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('every program has a valid category', () => {
    for (const p of seedPrograms) {
      expect(VALID_CATEGORIES).toContain(p.category);
    }
  });

  it('every program has a positive duration', () => {
    for (const p of seedPrograms) {
      expect(typeof p.duration).toBe('number');
      expect(p.duration).toBeGreaterThan(0);
    }
  });

  it('every program has a valid duration_unit', () => {
    for (const p of seedPrograms) {
      expect(VALID_DURATION_UNITS).toContain(p.duration_unit);
    }
  });

  it('every program has a valid format', () => {
    for (const p of seedPrograms) {
      expect(VALID_FORMATS).toContain(p.format);
    }
  });

  it('every program has a non-empty description', () => {
    for (const p of seedPrograms) {
      expect(typeof p.description).toBe('string');
      expect(p.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('every program has status="active"', () => {
    for (const p of seedPrograms) {
      expect(p.status).toBe('active');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Uniqueness
// ─────────────────────────────────────────────────────────────────────────────
describe('seedPrograms — uniqueness', () => {
  it('all program_codes are unique', () => {
    const codes = seedPrograms.map((p) => p.program_code);
    const unique = new Set(codes);
    expect(unique.size).toBe(codes.length);
  });

  it('all titles are unique', () => {
    const titles = seedPrograms.map((p) => p.title);
    const unique = new Set(titles);
    expect(unique.size).toBe(titles.length);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Category coverage
// ─────────────────────────────────────────────────────────────────────────────
describe('seedPrograms — category coverage', () => {
  it('contains at least one qualification program', () => {
    expect(seedPrograms.some((p) => p.category === 'qualification')).toBe(true);
  });

  it('contains at least one retraining program', () => {
    expect(seedPrograms.some((p) => p.category === 'retraining')).toBe(true);
  });

  it('contains at least one master program', () => {
    expect(seedPrograms.some((p) => p.category === 'master')).toBe(true);
  });

  it('contains at least one pre-university program', () => {
    expect(seedPrograms.some((p) => p.category === 'pre-university')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Optional-field types
// ─────────────────────────────────────────────────────────────────────────────
describe('seedPrograms — optional fields', () => {
  it('outcomes is either undefined or a string array', () => {
    for (const p of seedPrograms) {
      if (p.outcomes !== undefined) {
        expect(Array.isArray(p.outcomes)).toBe(true);
        p.outcomes.forEach((o) => expect(typeof o).toBe('string'));
      }
    }
  });

  it('modules is either undefined or an array of { title, hours }', () => {
    for (const p of seedPrograms) {
      if (p.modules !== undefined) {
        expect(Array.isArray(p.modules)).toBe(true);
        p.modules.forEach((m) => {
          expect(typeof m.title).toBe('string');
          expect(typeof m.hours).toBe('number');
          expect(m.hours).toBeGreaterThan(0);
        });
      }
    }
  });

  it('faq is either undefined or an array of { q, a }', () => {
    for (const p of seedPrograms) {
      if (p.faq !== undefined) {
        expect(Array.isArray(p.faq)).toBe(true);
        p.faq.forEach((f) => {
          expect(typeof f.q).toBe('string');
          expect(typeof f.a).toBe('string');
        });
      }
    }
  });

  it('price is either undefined or a positive number', () => {
    for (const p of seedPrograms) {
      if (p.price !== undefined) {
        expect(typeof p.price).toBe('number');
        expect(p.price).toBeGreaterThan(0);
      }
    }
  });

  it('credits is either undefined or a positive integer', () => {
    for (const p of seedPrograms) {
      if (p.credits !== undefined) {
        expect(Number.isInteger(p.credits)).toBe(true);
        expect(p.credits).toBeGreaterThan(0);
      }
    }
  });

  it('start_date is either undefined or a YYYY-MM-DD string', () => {
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    for (const p of seedPrograms) {
      if (p.start_date !== undefined) {
        expect(typeof p.start_date).toBe('string');
        expect(dateRe.test(p.start_date)).toBe(true);
      }
    }
  });
});
