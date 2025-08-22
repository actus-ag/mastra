import { Mastra } from '@actus-ag/mastra-core/mastra';
import { myAgent, contentCreatorAgent } from './agents';

export const mastra = new Mastra({
  agents: {
    myAgent,
    contentCreatorAgent,
  },
});
