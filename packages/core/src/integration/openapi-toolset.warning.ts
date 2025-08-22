import { OpenAPIToolset as BaseOpenAPIToolset } from './openapi-toolset';

export abstract class OpenAPIToolset extends BaseOpenAPIToolset {
  constructor() {
    super();

    console.warn('Please import "OpenAPIToolset" from "@actus-ag/mastra-core/integration" instead of "@actus-ag/mastra-core"');
  }
}
