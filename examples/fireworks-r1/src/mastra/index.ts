import { Mastra } from '@datawarp/mastra-core/mastra';
import { PinoLogger } from '@datawarp/mastra-loggers';
import { agent } from './agents';

export const mastra = new Mastra({
  agents: { agent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
