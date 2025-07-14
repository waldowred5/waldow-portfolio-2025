import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactESLintPlugin from 'eslint-plugin-react'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react: reactESLintPlugin,
    },
    rules: {
      'semi': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'quotes': ['error', 'single'],
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'always', children: 'always' },
      ],
    }
  },
])
