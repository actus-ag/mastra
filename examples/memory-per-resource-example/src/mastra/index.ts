import { Mastra } from '@datawarp/mastra-core';
import { assistantAgent } from './agents';

export const mastra = new Mastra({
  agents: { assistantAgent },
});
