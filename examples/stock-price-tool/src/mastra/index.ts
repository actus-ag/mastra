import { Mastra } from '@actus-ag/mastra-core';

import { stockAgent } from './agents';

export const mastra = new Mastra({
  agents: { stockAgent },
});
