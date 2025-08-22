import { Mastra } from '@actus-ag/mastra-core/mastra';
import { createLogger } from '@actus-ag/mastra-core/logger';
import { weatherAgent } from '@/agents';
import { TestDeployer } from '@mastra/deployer/test';

export const mastra = new Mastra({
  agents: { weatherAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  deployer: new TestDeployer(),
});
