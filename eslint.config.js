import eslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {ignores: ['dist', 'public/content/content.json']},
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {...globals.browser, ...globals.node},
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {'react-hooks': reactHooks, 'react-refresh': reactRefresh},
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      curly: ['error', 'all'],
      '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports', fixStyle: 'separate-type-imports'}],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', {checksVoidReturn: {attributes: false}}],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/only-throw-error': 'error',
      'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {globals: globals.node},
    rules: {
      curly: ['error', 'all'],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
);
