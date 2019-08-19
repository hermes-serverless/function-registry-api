module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*(test|spec)).tsx?$',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/src/__tests__/scripts/prepareDbContainer.ts',
  globalTeardown: '<rootDir>/src/__tests__/scripts/dropContainers.ts',
}
