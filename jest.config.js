module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts','js','json','node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    }
  },
  testMatch: [
    '**/?(*.)+(spec|test).ts?(x)'
  ],
};
