import { MastraMemory as BaseMemory } from './memory';

export * from './index';

export abstract class MastraMemory extends BaseMemory {
  constructor(_arg?: any) {
    // @ts-ignore
    super({ name: `Deprecated memory` });

    this.logger.warn('Please import "MastraMemory" from "@datawarp/mastra-core/memory" instead of "@datawarp/mastra-core"');
  }
}
