/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const fs = require('fs')

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    html: fs.readFileSync('src/client/html/index.html', 'utf8'),
  },
  roots: ['src/client'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.client.json',
    },
  },
}
