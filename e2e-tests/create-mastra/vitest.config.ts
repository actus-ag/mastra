import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['./@actus-ag/create-@mastra.test.ts'],
    globalSetup: ['./setup.ts'],
  },
});
