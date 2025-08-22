import { Mastra } from '@actus-ag/mastra-core/mastra';
import { PinoLogger } from '@actus-ag/mastra-loggers';
import { agent } from './agents';

export const mastra = new Mastra({
  agents: { agent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
