import { Mastra } from '@actus-ag/mastra-core';
import { LibSQLStore } from '@actus-ag/mastra-libsql';

import { chefAgent } from './agents/chefAgent';

export const mastra = new Mastra({
  agents: { chefAgent },
  storage: new LibSQLStore({
    url: 'file:./mastra.db',
  }),
});
