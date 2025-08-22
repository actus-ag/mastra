import { Mastra } from '@actus-ag/mastra-core';
import { assistantAgent } from './agents';

export const mastra = new Mastra({
  agents: { assistantAgent },
});
