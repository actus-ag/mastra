import { Agent } from '@actus-ag/mastra-core/agent';
import type { LanguageModel } from '@actus-ag/mastra-core/llm';

export abstract class MastraAgentJudge {
  protected readonly agent: Agent;

  constructor(name: string, instructions: string, model: LanguageModel) {
    this.agent = new Agent({
      name: `Mastra Eval Judge ${name}`,
      instructions: instructions,
      model,
    });
  }
}
