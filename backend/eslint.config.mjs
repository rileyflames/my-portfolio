// @ts-check
import eslint from '@eslint/js';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // eslintPluginPrettierRecommended,  // removed so Prettier formatting is not enforced by ESLint
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // keep important TS rules relaxed as before
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // Turn off noisy/style rules so ESLint focuses on important issues only:
      indent: 'off',
      quotes: 'off',
      semi: 'off',
      'comma-dangle': 'off',
      'object-curly-spacing': 'off',
      'space-before-function-paren': 'off',
      padded-blocks: 'off',
      'no-multi-spaces': 'off',
      'space-in-parens': 'off',
      'keyword-spacing': 'off',
      'arrow-parens': 'off',
      'brace-style': 'off',
      'eol-last': 'off',
      'max-len': 'off',
      'padding-line-between-statements': 'off',
      'no-trailing-spaces': 'off',
      'space-infix-ops': 'off'
    },
  },
);