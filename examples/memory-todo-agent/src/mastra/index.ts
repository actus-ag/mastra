import { Mastra } from '@actus-ag/mastra-core/mastra';

import { todoAgent } from './agents';

export const mastra = new Mastra({
  agents: { todoAgent },
  logger: false,
});
