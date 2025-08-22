import { MastraStorage as BaseMastraStorage } from './base';

export * from './base';

export abstract class MastraStorage extends BaseMastraStorage {
  constructor({ name }: { name: string }) {
    super({
      name,
    });

    this.logger.warn('Please import "MastraStorage" from "@actus-ag/mastra-core/storage" instead of "@actus-ag/mastra-core"');
  }
}
