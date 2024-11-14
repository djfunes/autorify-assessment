module.exports = {
  preset: 'ts-jest',  // This enables the use of TypeScript
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  // Transpile TypeScript files
    '^.+\\.js$': 'babel-jest',  // Transpile JavaScript files
  },
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',  // Mock CSS imports
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)',  // Allow certain packages to be transformed
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // If you're using TypeScript, this will treat those files as ESM
  globals: {
    'ts-jest': {
      useESM: true, // Enable ES module support for ts-jest (if you use TypeScript)
    },
  },
};
