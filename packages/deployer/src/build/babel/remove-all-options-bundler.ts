import type { IMastraLogger } from '@datawarp/mastra-core/logger';
import { removeAllOptionsFromMastraExcept } from './remove-all-options-except';

export function removeAllOptionsExceptBundler(result: { hasCustomConfig: boolean }, logger?: IMastraLogger) {
  return removeAllOptionsFromMastraExcept(result, 'bundler', logger);
}
