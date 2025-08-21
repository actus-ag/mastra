import { Mastra } from '@datawarp/mastra-core/mastra';
import { PinoLogger } from '@datawarp/mastra-loggers';

import { weatherAgent } from './agents';

export const mastra = new Mastra({
  agents: { weatherAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'error',
  }),
});
