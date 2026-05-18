import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['server/utils/**/*.ts'],
      thresholds: {
        lines: 12,
        functions: 35,
        branches: 50,
        statements: 12,
      },
    },
  },
})
