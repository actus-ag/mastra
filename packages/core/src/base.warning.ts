import { MastraBase as MastraBaseBase } from './base';
import type { RegisteredLogger } from './logger';

export class MastraBase extends MastraBaseBase {
  constructor(args: { component?: RegisteredLogger; name?: string }) {
    super(args);

    this.logger.warn('Please import "MastraBase" from "@actus-ag/mastra-core/base" instead of "@actus-ag/mastra-core"');
  }
}
