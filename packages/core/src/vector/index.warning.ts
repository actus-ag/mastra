import { MastraVector as BaseMastraVector } from './vector';

export * from './index';

export abstract class MastraVector extends BaseMastraVector {
  constructor() {
    super();

    this.logger.warn('Please import "MastraVector" from "@datawarp/mastra-core/vector" instead of "@datawarp/mastra-core"');
  }
}
