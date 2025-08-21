import { Mastra } from '@datawarp/mastra-core/mastra';
import { LibSQLStore } from '@datawarp/mastra-libsql';
import { PinoLogger } from '@datawarp/mastra-loggers';
import { codingAgent } from './agents/coding-agent';

export const mastra = new Mastra({
  agents: { codingAgent },
  storage: new LibSQLStore({ url: 'file:../../mastra.db' }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  }),
});
