import { Mastra } from '@datawarp/mastra-core/mastra';
import { agent } from './agents';

export const mastra = new Mastra({
  agents: {
    agent,
  },
});
