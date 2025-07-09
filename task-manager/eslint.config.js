module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // phân tích code TS
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module', // dùng import/export
    ecmaFeatures: {
      jsx: true, // hỗ trợ JSX
    },
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended', // rule cơ bản của eslint
    'plugin:react/recommended', // rule cho react
    'plugin:@typescript-eslint/recommended', // rule cho TS
    'plugin:prettier/recommended', // tích hợp prettier
  ],
  settings: {
    react: {
      version: 'detect', // tự động detect version React
    },
  },
  rules: {
    // Bạn có thể thêm/sửa rules ở đây
    'prettier/prettier': 'error', // lỗi nếu code không theo prettier
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off', // với React 17+, không cần import React
  },
};
