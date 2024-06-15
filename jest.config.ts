import { Config } from '@jest/types'

const config: Config.InitialOptions = {
    roots: ['<rootDir>/src'],
    preset: 'ts-jest',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'text'],
    testEnvironment: 'node',
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/index.ts',
        '!<rootDir>/src/config/**',
        '!<rootDir>/src/enums/**',
        '!<rootDir>/src/routes/index.ts',
        '!<rootDir>/src/types/**',
    ],
    transform: {
        '.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        '^~config/(.*)$': '<rootDir>/src/config/$1',
        '^~controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^~enums/(.*)$': '<rootDir>/src/enums/$1',
        '^~helpers/(.*)$': '<rootDir>/src/helpers/$1',
        '^~routes/(.*)$': '<rootDir>/src/routes/$1',
        '^~services/(.*)$': '<rootDir>/src/services/$1',
        '^~types/(.*)$': '<rootDir>/src/types/$1',
        '^~utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    testMatch: ['**/*.spec.ts', '**/*.test.ts'],
}

export default config
