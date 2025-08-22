import { Mastra } from '@actus-ag/mastra-core';
import { LibSQLStore } from '@actus-ag/mastra-libsql';

import { weatherAgent } from './agents';
import { weatherWorkflow as legacyWeatherWorkflow } from './workflows';
import { weatherWorkflow, weatherWorkflow2 } from './workflows/new-workflow';

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: 'file:./mastra.db',
  }),
  agents: { weatherAgent },
  legacy_workflows: { legacyWeatherWorkflow },
  workflows: { weatherWorkflow, weatherWorkflow2 },
});
