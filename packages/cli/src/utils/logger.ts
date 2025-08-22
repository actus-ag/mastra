import { PinoLogger } from '@actus-ag/mastra-loggers';

export const logger = new PinoLogger({
  name: 'Mastra CLI',
  level: 'info',
});
