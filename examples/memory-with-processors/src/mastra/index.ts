import { Mastra } from '@datawarp/mastra-core';

import { supportAgent, interviewerAgent } from './agents';

export const mastra = new Mastra({
  agents: { supportAgent, interviewerAgent },
});
