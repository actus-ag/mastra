import { Mastra } from '@datawarp/mastra-core';

import { stockWeatherAgent } from './agents';

export const mastra = new Mastra({
  agents: { stockWeatherAgent },
});
