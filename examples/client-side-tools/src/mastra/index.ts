import { Mastra } from '@actus-ag/mastra-core/mastra';
import { agent } from './agents';

export const mastra = new Mastra({
  agents: {
    agent,
  },
});
