import { PinoLogger } from '@datawarp/mastra-loggers';

export const logger = new PinoLogger({
  name: 'Mastra CLI',
  level: 'info',
});
