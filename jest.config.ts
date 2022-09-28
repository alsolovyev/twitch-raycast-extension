import type { Config } from 'jest'

const config: Config = {
  coverageDirectory: 'coverage',
  coverageReporters: ['text'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: { '\\.(js)$': 'babel-jest' },
  transformIgnorePatterns: []
}

export default config
