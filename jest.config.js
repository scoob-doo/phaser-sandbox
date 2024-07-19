export default {
  testTimeout: 20_000,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        isolatedModules: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust the path as per your project structure
  },
}
