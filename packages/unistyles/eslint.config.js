const { defineConfig } = require('eslint');
const expoConfig = require('eslint-config-expo');

/** @type {import('eslint').Linter.Config} */
module.exports = defineConfig({
  extends: ['expo/web'],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks', 
    'react-native',
    'unused-imports',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist/**', 'node_modules/**'],
  rules: {
    // TypeScript rules - Super strict pero funcionales
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

    // React rules
    'react/prop-types': 'off', // Using TypeScript
    'react/display-name': 'error',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-fragments': ['error', 'syntax'],
    'react/jsx-pascal-case': 'error',
    'react/no-array-index-key': 'error',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // React Native specific rules
    'react-native/no-unused-styles': 'error',
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': 'off', // Demasiado estricto para componentes UI

    // Unistyles specific rules
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['react-native'],
            importNames: ['StyleSheet'],
            message: 'Use StyleSheet from react-native-unistyles instead of react-native for themed components.',
          },
        ],
      },
    ],

    // Unused imports
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // General code quality rules
    'no-console': 'warn', // Warn en lugar de error para desarrollo
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'curly': ['error', 'all'],
    'eqeqeq': ['error', 'always'],

    // Style rules más suaves
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
  },
});