import { Mastra } from '@datawarp/mastra-core';

import { chefAgent } from './agents/chefAgent';

export const mastra = new Mastra({
  agents: { chefAgent },
});
