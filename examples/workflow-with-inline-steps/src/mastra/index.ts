import { Mastra } from '@actus-ag/mastra-core';

import { myWorkflow } from './workflows';

export const mastra = new Mastra({
  workflows: {
    myWorkflow,
  },
});
