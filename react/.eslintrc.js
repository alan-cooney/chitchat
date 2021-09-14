/**
 * # Skyhook Website Eslint
 */
 module.exports = {
    env: { browser: true, es6: true, node: true, jest: true },
    extends: [
      // Airbnb Typescript eslint from https://www.npmjs.com/package/eslint-config-airbnb-typescript
      'airbnb',
      'airbnb/hooks',
      'airbnb-typescript/base',
      // Prettier added using default settings from https://github.com/prettier/eslint-plugin-prettier
      'plugin:prettier/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:testing-library/react',
      'plugin:jest-dom/recommended',
    ],
    globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: ['./tsconfig.json'],
      ecmaVersion: 2018,
      ecmaFeatures: { jsx: true },
      sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint', 'testing-library', 'jest-dom'],
    rules: {
      'no-new': 'off',
      'no-alert': 'off',
      'no-shadow': 'off',
      'import/no-cycle': 'off',
      'import/extensions': 'off',
      'react/display-name': 'warn',
      '@typescript-eslint/no-explicit-any': 0,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'no-plusplus': 'off',
      'react/jsx-curly-newline': 'off',
      'react/destructuring-assignment': 'warn',
      'react/no-array-index-key': 'warn',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-restricted-properties': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/indent': 'off',
      radix: 'off',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'react/jsx-filename-extension': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/require-default-props': 'off', // Not needed as we have TypeScript for type checking
      'react/no-unescaped-entities': [
        'error',
        {
          forbid: ['>', '}'],
        },
      ],
      'spaced-comment': ['error', 'always', { markers: ['/'] }],
    },
    settings: { react: { version: 'detect' } },
    ignorePatterns: ['types/graphql.ts'],
  };