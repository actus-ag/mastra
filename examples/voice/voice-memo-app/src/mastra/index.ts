import { PinoLogger } from '@datawarp/mastra-loggers';
import { Mastra } from '@datawarp/mastra-core/mastra';

import { noteTakerAgent } from './agents';

export const mastra = new Mastra({
  agents: { noteTakerAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
