import { Mastra } from '@actus-ag/mastra-core';

import { chefAgent, memoryAgent } from './agents';

export const mastra = new Mastra({
  agents: { chefAgent, memoryAgent },
});
