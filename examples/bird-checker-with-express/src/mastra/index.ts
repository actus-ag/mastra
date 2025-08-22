import { PinoLogger } from '@actus-ag/mastra-loggers';
import { Mastra } from '@actus-ag/mastra-core';

import { birdCheckerAgent } from './agents/agent';

export const mastra = new Mastra({
  agents: { birdCheckerAgent },
  logger: new PinoLogger({
    name: 'CONSOLE',
    level: 'info',
  }),
});
