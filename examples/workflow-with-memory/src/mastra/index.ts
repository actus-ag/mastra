import { Mastra } from '@datawarp/mastra-core';
import { PinoLogger } from '@datawarp/mastra-loggers';

import { catOne } from './agents/index';
import { sequentialWorkflow, parallelWorkflow, branchedWorkflow, cyclicalWorkflow } from './workflows';

export const mastra = new Mastra({
  agents: { catOne },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'debug',
  }),
  workflows: {
    sequentialWorkflow,
    parallelWorkflow,
    branchedWorkflow,
    cyclicalWorkflow,
  },
});
