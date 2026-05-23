import type { JestConfigWithTsJest } from 'ts-jest';

/**
 * Integration-test configuration — requires a running Strapi backend.
 *
 * By default targets http://localhost:1337 (Docker dev instance).
 * Override with: STRAPI_URL=http://... npm run test:integration
 *
 * Run:  npm run test:integration
 */
const config: JestConfigWithTsJest = {
  displayName: 'integration',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
  testTimeout: 30_000,
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
  coverageDirectory: 'coverage/integration',
};

export default config;
