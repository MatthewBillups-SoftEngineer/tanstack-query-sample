const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    preset: 'ts-jest',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jsdom',
    collectCoverageFrom: [
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'pages/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};

module.exports = createJestConfig(customJestConfig);
