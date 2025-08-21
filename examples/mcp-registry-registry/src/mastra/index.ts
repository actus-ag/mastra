import { Mastra } from '@datawarp/mastra-core';
import { PinoLogger } from '@datawarp/mastra-loggers';
import { mcpRegistryAgent } from './agents/index';

export const mastra = new Mastra({
  agents: { mcpRegistryAgent },
  logger: new PinoLogger({ name: 'MCP Registry', level: 'info' }),
});
