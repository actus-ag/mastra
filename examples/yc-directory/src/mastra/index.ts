import { PinoLogger } from '@actus-ag/mastra-loggers';
import { Mastra } from '@actus-ag/mastra-core';

import { ycAgent } from './agents';

export const mastra = new Mastra({
  agents: { ycAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
