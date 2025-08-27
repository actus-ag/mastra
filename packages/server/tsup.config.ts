import { generateTypes } from '@internal/types-builder';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/server/handlers.ts',
    'src/server/handlers/*.ts',
    'src/server/a2a/store.ts',
    '!src/server/handlers/*.test.ts',
  ],
  format: ['esm', 'cjs'],
  clean: true,
  dts: false,
  splitting: true,
  treeshake: {
    preset: 'smallest',
  },
  sourcemap: true,
  external: [
    '@mastra/core',
    '@mastra/schema-compat',
    'zod',
  ],
  onSuccess: async () => {
    await generateTypes(process.cwd());
  },
});
