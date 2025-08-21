import { MastraTTS as BaseMastraTTS } from './index';
import type { TTSConfig } from './index';

export * from './index';

export abstract class MastraTTS extends BaseMastraTTS {
  constructor(args: TTSConfig) {
    super(args);

    this.logger.warn('Please import "MastraTTS" from "@datawarp/mastra-core/tts" instead of "@datawarp/mastra-core"');
  }
}
