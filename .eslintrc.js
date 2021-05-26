const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'));

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'prettier/@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': ['error', prettierOptions]
    // indent: ['error', 2],
    // 'linebreak-style': ['error', 'unix'],
    // quotes: ['error', 'single'],
    // semi: ['error', 'always']
  }
};
