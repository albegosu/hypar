import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '.output/**',
      '.nuxt/**',
      'node_modules/**',
      'docs/**',
      'components/**',
      'pages/**',
      'composables/**',
      'stores/**',
      'layouts/**',
      'middleware/**',
      'plugins/**',
      'utils/**',
      'modules/**',
      'prisma/migrations/**',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['server/**/*.ts', 'tests/**/*.ts', 'scripts/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        defineEventHandler: 'readonly',
        defineNitroPlugin: 'readonly',
        useRuntimeConfig: 'readonly',
        createError: 'readonly',
        readValidatedBody: 'readonly',
        readBody: 'readonly',
        getHeader: 'readonly',
        setHeader: 'readonly',
        getQuery: 'readonly',
        setResponseStatus: 'readonly',
        getRequestURL: 'readonly',
        $fetch: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
)
