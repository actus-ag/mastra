import { Mastra } from '@datawarp/mastra-core';

import { chefAgent, memoryAgent } from './agents';

export const mastra = new Mastra({
  agents: { chefAgent, memoryAgent },
});
