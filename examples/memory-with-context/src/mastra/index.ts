import { Mastra } from '@actus-ag/mastra-core';

import { memoryAgent } from './agents';

export const mastra = new Mastra({
  agents: { memoryAgent },
});
