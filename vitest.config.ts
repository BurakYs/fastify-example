import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@/tests': path.resolve(__dirname, 'tests'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    test: {
        poolOptions: {
            pool: 'forks',
            forks: {
                execArgv: ['--loader', './custom-loader.js', '--no-warnings']
            }
        }
    }
});
