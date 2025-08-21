import { fireworks } from '@ai-sdk/fireworks';
import { Agent } from '@datawarp/mastra-core/agent';
import { Memory } from '@datawarp/mastra-memory';

if (!process.env.FIREWORKS_API_KEY) {
  throw new Error(`FIREWORKS_API_KEY env var is required for this example to work`);
}

export const agent = new Agent({
  model: fireworks(`accounts/fireworks/models/deepseek-r1`),

  name: 'Example agent',
  instructions: `You are a helpful and intelligent AI agent.`,
  memory: new Memory(),
});
