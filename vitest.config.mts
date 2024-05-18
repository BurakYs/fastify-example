import { defineConfig } from 'vitest/config';
import path from 'path';

process.env.NODE_ENV = 'test';

export default defineConfig({
    test: {
        globals: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
});