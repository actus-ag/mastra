import { logger } from '../../../utils/logger.js';
import type { LintContext, LintRule } from './types.js';

export const mastraCoreRule: LintRule = {
  name: 'mastra-core',
  description: 'Checks if @actus-ag/mastra-core is installed',
  async run(context: LintContext): Promise<boolean> {
    const hasCore = context.mastraPackages.some(pkg => pkg.name === '@actus-ag/mastra-core');
    if (!hasCore) {
      logger.error('@actus-ag/mastra-core is not installed. This package is required for Mastra to work properly.');
      return false;
    }
    return true;
  },
};
