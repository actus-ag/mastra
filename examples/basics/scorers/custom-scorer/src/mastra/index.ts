import { Mastra } from '@datawarp/mastra-core';
import { LibSQLStore } from '@datawarp/mastra-libsql';

import { chefAgent } from './agents/chefAgent';

export const mastra = new Mastra({
  agents: { chefAgent },
  storage: new LibSQLStore({
    url: 'file:./mastra.db',
  }),
});
