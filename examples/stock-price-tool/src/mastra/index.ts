import { Mastra } from '@datawarp/mastra-core';

import { stockAgent } from './agents';

export const mastra = new Mastra({
  agents: { stockAgent },
});
