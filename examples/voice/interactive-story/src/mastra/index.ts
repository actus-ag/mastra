import { PinoLogger } from '@actus-ag/mastra-loggers';
import { Mastra } from '@actus-ag/mastra-core/mastra';

import { storyTellerAgent } from './agents';

export const mastra = new Mastra({
  agents: { storyTellerAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
