import { Mastra } from '@actus-ag/mastra-core/mastra';
import { PinoLogger } from '@actus-ag/mastra-loggers';

import { weatherAgent } from './agents';

export const mastra = new Mastra({
  agents: { weatherAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'error',
  }),
});
