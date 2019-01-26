const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  transform: {
    ...tsjPreset.transform,
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
    '\\.(ts|tsx)$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsConfig: 'tsconfig.jest.json'
    }
  },
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/e2e/', '<rootDir>/node_modules/', '__mocks__/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>'],
  cacheDirectory: '.jest/cache',
  setupFiles: ['./jest_setup.js'],
  coveragePathIgnorePatterns: ['./node_modules/', 'src/index.js', 'enzyme_setup.js', 'jest_setup.js']
};
