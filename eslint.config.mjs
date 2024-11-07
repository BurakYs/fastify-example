import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts}']
    },
    {
        ignores: ['dist/']
    },
    {
        rules: {
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'comma-dangle': ['error', 'never']
        }
    }
];