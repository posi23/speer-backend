import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv'], // Load environment variables
    moduleFileExtensions: ['ts', 'js'], // Recognize TypeScript files
    testMatch: ['**/tests/**/*.test.ts'], // Look for test files in the `tests` folder
};

export default config;
