import { Mastra } from '@actus-ag/mastra-core/mastra';
import { LibSQLStore } from '@actus-ag/mastra-libsql';
import { PinoLogger } from '@actus-ag/mastra-loggers';
import { webAgent } from './agents/web-agent';

export const mastra = new Mastra({
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ':memory:',
  }),
  agents: { webAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
