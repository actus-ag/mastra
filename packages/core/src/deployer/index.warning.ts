import { MastraDeployer as BaseMastraDeployer } from './index';

export abstract class MastraDeployer extends BaseMastraDeployer {
  constructor(args: { name: string; mastraDir: string; outputDirectory: string }) {
    super(args);

    this.logger.warn('Please import "MastraDeployer" from "@actus-ag/mastra-core/deployer" instead of "@actus-ag/mastra-core"');
  }
}
