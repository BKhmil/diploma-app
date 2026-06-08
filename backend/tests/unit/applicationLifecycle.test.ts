/**
 * Unit tests for the Application content-type lifecycle hooks.
 *
 * The lifecycle uses:
 *   - `(strapi as any).*`  → set as `global.strapi` before each test
 *   - `require('@strapi/utils').errors.ValidationError` → mocked below
 */

// Mock @strapi/utils so ValidationError is a plain Error subclass in tests
class MockValidationError extends Error {
  details: object;
  constructor(message: string, details: object = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

jest.mock('@strapi/utils', () => ({
  errors: {
    ValidationError: MockValidationError,
  },
}));

// We need the raw lifecycle object; import it directly.
import lifecycles from '../../src/api/application/content-types/application/lifecycles';

// ─────────────────────────────────────────────────────────────────────────────
// Mock factory helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Build a fresh per-UID query mock that can be configured per test. */
function makeQueryMock(overrides: Record<string, jest.Mock> = {}) {
  return {
    findOne: jest.fn().mockResolvedValue(null),
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 99, email: 'student@test.com' }),
    ...overrides,
  };
}

function makeStrapiMock() {
  const queryMock = makeQueryMock();

  const strapi = {
    db: {
      // All UIDs share the same mock so spies work globally;
      // individual tests can override per-call with mockImplementation.
      query: jest.fn().mockReturnValue(queryMock),
    },
    log: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
    plugins: {
      email: {
        services: {
          email: { send: jest.fn().mockResolvedValue(undefined) },
        },
      },
    },
  };

  return { strapi, queryMock };
}

// ─────────────────────────────────────────────────────────────────────────────
// beforeCreate
// ─────────────────────────────────────────────────────────────────────────────
describe('beforeCreate — auto-num assignment', () => {
  beforeEach(() => {
    const { strapi, queryMock } = makeStrapiMock();
    // No previous apps → num should start at 1001
    queryMock.findMany.mockResolvedValue([]);
    queryMock.findOne.mockResolvedValue(null);
    (global as any).strapi = strapi;
  });

  it('sets num to 1001 when there are no existing applications', async () => {
    const event: any = {
      params: { data: { app_type: 'application', email: 'a@b.com', program_name: 'TestProg' } },
    };
    await lifecycles.beforeCreate(event);
    expect(event.params.data.num).toBe(1001);
  });

  it('increments from the highest existing num', async () => {
    const { strapi, queryMock } = makeStrapiMock();
    queryMock.findOne.mockResolvedValue(null); // no duplicate
    queryMock.findMany.mockResolvedValue([{ num: 1042 }]); // highest num
    (global as any).strapi = strapi;

    const event: any = {
      params: { data: { app_type: 'application', email: 'a@b.com', program_name: 'TestProg' } },
    };
    await lifecycles.beforeCreate(event);
    expect(event.params.data.num).toBe(1043);
  });

  it('uses 1001 when the last num is at or below 1000 (resets low values)', async () => {
    const { strapi, queryMock } = makeStrapiMock();
    queryMock.findOne.mockResolvedValue(null);
    queryMock.findMany.mockResolvedValue([{ num: 5 }]); // low / legacy num
    (global as any).strapi = strapi;

    const event: any = {
      params: { data: { app_type: 'application', email: 'a@b.com', program_name: 'TestProg' } },
    };
    await lifecycles.beforeCreate(event);
    expect(event.params.data.num).toBe(1001);
  });
});

describe('beforeCreate — duplicate application guard', () => {
  it('throws a ValidationError when a duplicate email+program_name exists', async () => {
    const { strapi, queryMock } = makeStrapiMock();
    queryMock.findOne.mockResolvedValue({ id: 7, email: 'dup@test.com', program_name: 'Prog' });
    queryMock.findMany.mockResolvedValue([]);
    (global as any).strapi = strapi;

    const event = {
      params: { data: { app_type: 'application', email: 'dup@test.com', program_name: 'Prog' } },
    };

    let caught: unknown;
    try {
      await lifecycles.beforeCreate(event);
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(MockValidationError);
    expect((caught as Error).message).toMatch(/Prog/);
  });

  it('does NOT check for duplicates when app_type is "contact"', async () => {
    const { strapi, queryMock } = makeStrapiMock();
    queryMock.findMany.mockResolvedValue([]);
    (global as any).strapi = strapi;

    const event = {
      params: {
        data: { app_type: 'contact', email: 'contact@test.com', program_name: 'Prog' },
      },
    };

    await lifecycles.beforeCreate(event);

    // findOne should NOT have been called for a contact-type application
    expect(queryMock.findOne).not.toHaveBeenCalled();
  });

  it('does NOT check for duplicates when email is missing', async () => {
    const { strapi, queryMock } = makeStrapiMock();
    queryMock.findMany.mockResolvedValue([]);
    (global as any).strapi = strapi;

    const event = {
      params: { data: { app_type: 'application', program_name: 'Prog' } },
    };

    await lifecycles.beforeCreate(event);
    expect(queryMock.findOne).not.toHaveBeenCalled();
  });

  it('does NOT check for duplicates when program_name is missing', async () => {
    const { strapi, queryMock } = makeStrapiMock();
    queryMock.findMany.mockResolvedValue([]);
    (global as any).strapi = strapi;

    const event = {
      params: { data: { app_type: 'application', email: 'a@b.com' } },
    };

    await lifecycles.beforeCreate(event);
    expect(queryMock.findOne).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// afterCreate — email notification
//
// The hook is fire-and-forget: it launches sendApplicationNotification without
// awaiting it.  Two things are required to test it correctly:
//   1. SMTP_USER / SMTP_PASS must be set, or the hook returns early.
//   2. After awaiting afterCreate(), flush the microtask queue so the
//      detached promise has a chance to run before the assertions.
// ─────────────────────────────────────────────────────────────────────────────

/** Drain all pending microtasks (Promise chains) created by fire-and-forget calls. */
const flushPromises = () => new Promise<void>(resolve => setImmediate(resolve));

describe('afterCreate — email notification', () => {
  beforeEach(() => {
    process.env.SMTP_USER = 'test-user';
    process.env.SMTP_PASS = 'test-pass';
  });

  afterEach(() => {
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
  });

  it('sends an admin notification email after a new application', async () => {
    const { strapi, queryMock } = makeStrapiMock();
    queryMock.findOne.mockResolvedValue({ email: 'admin@university.ua' });
    (global as any).strapi = strapi;

    const event: any = {
      result: {
        id: 1,
        app_type: 'application',
        full_name: 'Іван Петренко',
        email: 'ivan@example.com',
        phone: '+380501234567',
        program_name: 'Data Science',
      },
    };

    await lifecycles.afterCreate(event);
    await flushPromises(); // let the detached promise complete

    expect(strapi.plugins.email.services.email.send).toHaveBeenCalledTimes(1);
    const callArg = strapi.plugins.email.services.email.send.mock.calls[0][0];
    expect(callArg.to).toBe('admin@university.ua');
    expect(callArg.subject).toContain('#1');
    expect(callArg.html).toContain('Іван Петренко');
    expect(callArg.html).toContain('Data Science');
  });

  it('sends a contact-form notification with a different subject', async () => {
    const { strapi, queryMock } = makeStrapiMock();
    queryMock.findOne.mockResolvedValue(null); // no contact-info → default email
    (global as any).strapi = strapi;

    const event: any = {
      result: {
        id: 2,
        app_type: 'contact',
        full_name: 'Марія Коваль',
        email: 'maria@example.com',
        message: 'Цікавлюсь програмами',
      },
    };

    await lifecycles.afterCreate(event);
    await flushPromises();

    const callArg = strapi.plugins.email.services.email.send.mock.calls[0][0];
    expect(callArg.subject).toContain('Нове повідомлення від Марія Коваль');
    expect(callArg.html).toContain('Цікавлюсь програмами');
  });

  it('does not throw when the email plugin fails — logs a warning instead', async () => {
    const { strapi, queryMock } = makeStrapiMock();
    queryMock.findOne.mockResolvedValue(null);
    strapi.plugins.email.services.email.send.mockRejectedValue(new Error('SMTP error'));
    (global as any).strapi = strapi;

    const event: any = {
      result: {
        id: 3,
        app_type: 'application',
        full_name: 'Test User',
        email: 'test@example.com',
        program_name: 'NMT Prep',
      },
    };

    // afterCreate itself must not throw — the fire-and-forget catches internally
    await expect(lifecycles.afterCreate(event)).resolves.toBeUndefined();
    await flushPromises();

    expect(strapi.log.warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to send notification')
    );
  });

  it('skips email and logs info when SMTP is not configured', async () => {
    // Override the beforeEach values so SMTP looks absent
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const { strapi } = makeStrapiMock();
    (global as any).strapi = strapi;

    const event: any = {
      result: {
        id: 4,
        app_type: 'application',
        full_name: 'No SMTP User',
        email: 'nosmtp@example.com',
        program_name: 'Some Program',
      },
    };

    await lifecycles.afterCreate(event);

    expect(strapi.plugins.email.services.email.send).not.toHaveBeenCalled();
    expect(strapi.log.info).toHaveBeenCalledWith(
      expect.stringContaining('SMTP not configured')
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// afterUpdate — enrollment on acceptance
// ─────────────────────────────────────────────────────────────────────────────
describe('afterUpdate — enrollment flow', () => {
  it('does nothing when status is not "accepted"', async () => {
    const { strapi } = makeStrapiMock();
    (global as any).strapi = strapi;

    const event = { result: { id: 10, status: 'pending' } };
    await lifecycles.afterUpdate(event);

    // No DB queries for enrollment/student should have fired
    expect(strapi.db.query).not.toHaveBeenCalled();
  });

  it('creates a student and enrollment when status changes to "accepted"', async () => {
    const { strapi, queryMock } = makeStrapiMock();

    const appRecord = {
      id: 10,
      email: 'student@test.com',
      full_name: 'Петро Мороз Іванович',
      phone: '+380671111111',
      program_name: 'UX Lab',
      program: { id: 3 },
    };

    queryMock.findOne
      .mockResolvedValueOnce(appRecord) // load application in handleApproval
      .mockResolvedValueOnce(null)      // student lookup → not found → will create
      .mockResolvedValueOnce(null);     // enrollment lookup → not found → will create

    queryMock.create
      .mockResolvedValueOnce({ id: 55, email: appRecord.email }) // created student
      .mockResolvedValueOnce({ id: 77 });                         // created enrollment

    (global as any).strapi = strapi;

    const event = { result: { id: 10, status: 'accepted' } };
    await lifecycles.afterUpdate(event);

    // student create was called with correct data
    expect(queryMock.create).toHaveBeenCalledTimes(2);
    const studentCreateCall = queryMock.create.mock.calls[0][0];
    expect(studentCreateCall.data.email).toBe('student@test.com');
    expect(studentCreateCall.data.last_name).toBe('Петро');
    expect(studentCreateCall.data.first_name).toBe('Мороз');
    expect(studentCreateCall.data.status).toBe('active');

    // enrollment create was called
    const enrollmentCreateCall = queryMock.create.mock.calls[1][0];
    expect(enrollmentCreateCall.data.application).toBe(10);
    expect(enrollmentCreateCall.data.student).toBe(55);
  });

  it('does not create a second enrollment when one already exists', async () => {
    const { strapi, queryMock } = makeStrapiMock();

    const appRecord = {
      id: 11,
      email: 'existing@test.com',
      full_name: 'Anna Test',
      program: { id: 5 },
    };

    queryMock.findOne
      .mockResolvedValueOnce(appRecord)              // load application
      .mockResolvedValueOnce({ id: 20 })             // existing student found
      .mockResolvedValueOnce({ id: 30, application: 11 }); // enrollment already exists

    (global as any).strapi = strapi;

    const event = { result: { id: 11, status: 'accepted' } };
    await lifecycles.afterUpdate(event);

    // create should NOT have been called (neither student nor enrollment)
    expect(queryMock.create).not.toHaveBeenCalled();
    expect(strapi.log.info).toHaveBeenCalledWith(
      expect.stringContaining('Enrollment already exists')
    );
  });

  it('uses the existing student if one is found by email', async () => {
    const { strapi, queryMock } = makeStrapiMock();

    const appRecord = {
      id: 12,
      email: 'returning@test.com',
      full_name: 'Existing Student',
      program: { id: 2 },
    };

    queryMock.findOne
      .mockResolvedValueOnce(appRecord)        // load application
      .mockResolvedValueOnce({ id: 88 })       // student found by email
      .mockResolvedValueOnce(null);            // no enrollment yet

    queryMock.create.mockResolvedValueOnce({ id: 99 }); // enrollment created

    (global as any).strapi = strapi;

    const event = { result: { id: 12, status: 'accepted' } };
    await lifecycles.afterUpdate(event);

    // Only one create call (enrollment, not student)
    expect(queryMock.create).toHaveBeenCalledTimes(1);
    const enrollmentCreate = queryMock.create.mock.calls[0][0];
    expect(enrollmentCreate.data.student).toBe(88);
    expect(strapi.log.info).toHaveBeenCalledWith(
      expect.stringContaining('Found existing student')
    );
  });
});
