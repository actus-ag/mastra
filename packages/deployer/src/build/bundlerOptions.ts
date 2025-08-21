import { removeAllOptionsExceptBundler } from './babel/remove-all-options-bundler';
import type { Config } from '@datawarp/mastra-core/mastra';
import { extractMastraOption, extractMastraOptionBundler } from './shared/extract-mastra-option';
import type { IMastraLogger } from '@datawarp/mastra-core/logger';

export function getBundlerOptionsBundler(
  entryFile: string,
  result: {
    hasCustomConfig: false;
  },
) {
  return extractMastraOptionBundler('bundler', entryFile, removeAllOptionsExceptBundler, result);
}

export async function getBundlerOptions(
  entryFile: string,
  outputDir: string,
  logger?: IMastraLogger,
): Promise<Config['bundler'] | null> {
  const result = await extractMastraOption<Config['bundler']>(
    'bundler',
    entryFile,
    removeAllOptionsExceptBundler,
    outputDir,
    logger,
  );

  if (!result) {
    return null;
  }

  return result.getConfig();
}
