import { OpenAPIToolset as BaseOpenAPIToolset } from './openapi-toolset';

export abstract class OpenAPIToolset extends BaseOpenAPIToolset {
  constructor() {
    super();

    console.warn('Please import "OpenAPIToolset" from "@datawarp/mastra-core/integration" instead of "@datawarp/mastra-core"');
  }
}
