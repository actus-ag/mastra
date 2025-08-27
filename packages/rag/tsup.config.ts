import { generateTypes } from '@internal/types-builder';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  dts: false,
  splitting: true,
  treeshake: {
    preset: 'smallest',
  },
  external: [
    '@mastra/core',
    'ai',
    'zod',
  ],
  sourcemap: true,
  onSuccess: async () => {
    await generateTypes(process.cwd());
  },
});
