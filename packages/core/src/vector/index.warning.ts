import { MastraVector as BaseMastraVector } from './vector';

export * from './index';

export abstract class MastraVector extends BaseMastraVector {
  constructor() {
    super();

    this.logger.warn('Please import "MastraVector" from "@actus-ag/mastra-core/vector" instead of "@actus-ag/mastra-core"');
  }
}
