import { PinoLogger } from '@datawarp/mastra-loggers';
import { Mastra } from '@datawarp/mastra-core';

import { ycAgent } from './agents';

export const mastra = new Mastra({
  agents: { ycAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
