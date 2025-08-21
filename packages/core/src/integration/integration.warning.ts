import { Integration as BaseIntegration } from './integration';

export class Integration<ToolsParams = void, ApiClient = void> extends BaseIntegration<ToolsParams, ApiClient> {
  constructor() {
    super();

    console.warn('Please import "Integration" from "@datawarp/mastra-core/integration" instead of "@datawarp/mastra-core"');
  }
}
