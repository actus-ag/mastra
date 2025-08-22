import { PinoLogger } from '@actus-ag/mastra-loggers';
import { Mastra } from '@actus-ag/mastra-core/mastra';

import { noteTakerAgent } from './agents';

export const mastra = new Mastra({
  agents: { noteTakerAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
