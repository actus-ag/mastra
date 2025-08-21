import { Mastra } from '@datawarp/mastra-core';
import { LibSQLStore } from '@datawarp/mastra-libsql';
import { memoryProcessorAgent, weatherAgent } from './agents/weather';

export const mastra = new Mastra({
  agents: {
    test: weatherAgent,
    testProcessor: memoryProcessorAgent,
  },
  storage: new LibSQLStore({
    url: 'file:mastra.db',
  }),
});
