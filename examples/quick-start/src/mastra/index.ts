import { Mastra } from '@actus-ag/mastra-core';
import { PinoLogger } from '@actus-ag/mastra-loggers';
import { catOne } from './agents/agent';
import { logCatWorkflow as legacy_catWorkflow } from './legacy-workflows';
import { logCatWorkflow } from './workflows';

export const mastra = new Mastra({
  agents: { catOne },
  legacy_workflows: {
    legacy_catWorkflow,
  },
  workflows: {
    logCatWorkflow,
  },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'debug',
  }),
});
