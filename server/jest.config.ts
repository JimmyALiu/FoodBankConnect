import type { JestConfigWithTsJest } from 'ts-jest';

const common: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json',
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },
};

export default {
  projects: [
    {
      ...common,
      displayName: 'unit',
      testMatch: [
        '<rootDir>/__test__/**/*.test.ts',
        '<rootDir>/__test__/**/*.spec.ts',
      ],
      testPathIgnorePatterns: ['\\.int\\.test\\.ts$'], // ✅ ignore integration tests in unit config
    },
    {
      ...common,
      displayName: 'integration',
      testMatch: ['<rootDir>/__test__/**/*.int.test.ts'],
    },
  ],
};