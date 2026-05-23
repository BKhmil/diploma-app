import type { JestConfigWithTsJest } from 'ts-jest';

/**
 * Unit-test configuration — runs without a Strapi instance.
 *
 * Run:  npm test
 */
const config: JestConfigWithTsJest = {
  displayName: 'unit',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
  testTimeout: 15_000,
  clearMocks: true,
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          strict: false,
          esModuleInterop: true,
          module: 'commonjs',
          moduleResolution: 'node',
        },
      },
    ],
  },
  collectCoverageFrom: [
    'src/seed/locale.ts',
    'src/seed/content/**/*.ts',
    'src/api/application/content-types/application/lifecycles.ts',
  ],
  coverageDirectory: 'coverage/unit',
};

export default config;
