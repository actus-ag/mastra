import { Mastra } from '@actus-ag/mastra-core/mastra';
import { PinoLogger } from '@actus-ag/mastra-loggers';

import { mem0Agent } from './agents';

export const mastra = new Mastra({
  agents: { mem0Agent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'error',
  }),
});
