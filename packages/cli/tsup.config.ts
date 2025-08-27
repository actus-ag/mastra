import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTypes } from '@internal/types-builder';
import { copy } from 'fs-extra';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/analytics/index.ts',
    'src/commands/create/create.ts',
    'src/commands/dev/telemetry-loader.ts',
    'src/commands/dev/telemetry-resolver.ts',
  ],
  treeshake: false,
  format: ['esm'],
  publicDir: './src/public',
  dts: false,
  clean: true,
  sourcemap: true,
  // Don't bundle any dependencies - just transpile TypeScript
  external: [/.*/],
  // Prevent bundler from trying to analyze dynamic imports
  esbuildOptions(options) {
    options.platform = 'node';
    options.target = 'node18';
    options.packages = 'external';
  },
  onSuccess: async () => {
    const playgroundPath = dirname(fileURLToPath(import.meta.resolve('@internal/playground/package.json')));

    await copy(join(playgroundPath, 'dist'), 'dist/playground');
    await generateTypes(process.cwd());
  },
});
