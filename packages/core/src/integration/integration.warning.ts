import { Integration as BaseIntegration } from './integration';

export class Integration<ToolsParams = void, ApiClient = void> extends BaseIntegration<ToolsParams, ApiClient> {
  constructor() {
    super();

    console.warn('Please import "Integration" from "@actus-ag/mastra-core/integration" instead of "@actus-ag/mastra-core"');
  }
}
