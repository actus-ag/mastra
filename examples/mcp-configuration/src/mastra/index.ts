import { Mastra } from '@actus-ag/mastra-core';

import { stockWeatherAgent } from './agents';

export const mastra = new Mastra({
  agents: { stockWeatherAgent },
});
