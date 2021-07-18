module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error'],
      },
    },
  ],
  extends: ['airbnb-typescript/base', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
};
