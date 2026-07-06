import { defineConfig } from 'vitest/config'

// Alias "@/..." -> raiz do projeto (regex evita pegar pacotes "@scope/...").
const root = process.cwd().replace(/\\/g, '/')

export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: `${root}/` }],
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'tests/**/*.test.ts'],
  },
})
