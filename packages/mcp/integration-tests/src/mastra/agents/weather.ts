import { openai } from '@ai-sdk/openai';
import { createTool } from '@datawarp/mastra-core';
import { Agent } from '@datawarp/mastra-core/agent';
import { z } from 'zod';
import { weatherTool } from '../tools/weather';
import { MCPClient } from '@datawarp/mastra-mcp';

const client = new MCPClient({
  id: 'weather-server',
  servers: {
    weather: {
      url: new URL(`http://localhost:4114/api/mcp/myMcpServer/mcp`),
    },
  },
});

export const weatherAgent = new Agent({
  name: 'test',
  instructions:
    'You are a weather agent. When asked about weather in any city, use the get_weather tool with the city name as the postal code. When asked for clipboard contents you also get that.',
  model: openai('gpt-4o'),
  tools: async () => {
    const tools = await client.getTools();
    return {
      get_weather: weatherTool,
      clipboard: createTool({
        id: 'clipboard',
        description: 'Returns the contents of the users clipboard',
        inputSchema: z.object({}),
      }),
      ...tools,
    };
  },
});
