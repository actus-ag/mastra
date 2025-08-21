import { PinoLogger } from '@datawarp/mastra-loggers';
import { Mastra } from '@datawarp/mastra-core';

import { birdCheckerAgent } from './agents/agent';

export const mastra = new Mastra({
  agents: { birdCheckerAgent },
  logger: new PinoLogger({
    name: 'CONSOLE',
    level: 'info',
  }),
});
