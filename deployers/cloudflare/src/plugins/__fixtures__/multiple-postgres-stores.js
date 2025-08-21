import { createLogger } from '@datawarp/mastra-core/logger';
import { Mastra } from '@datawarp/mastra-core/mastra';
import { createApiRoute } from '@datawarp/mastra-core/server';
import { TestDeployer } from '@datawarp/mastra-deployer/test';
import { PostgresStore } from '@datawarp/mastra-pg';
import { weatherAgent } from '@/agents';

export const storage = new PostgresStore({
  connectionString: process.env.DATABASE_URL,
});

export const mastra = new Mastra({
  agents: { weatherAgent },
  storage: new PostgresStore({
    connectionString: process.env.DATABASE_URL,
  }),
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    enabled: true,
    serviceName: 'my-app',
    export: {
      type: 'otlp',
      endpoint: 'http://localhost:4318', // SigNoz local endpoint
    },
  },
  server: {
    port: 3000,
    timeout: 5000,
    apiRoutes: [
      createApiRoute({
        path: '/hello',
        method: 'get',
        handler: async (req, res) => {
          res.send('Hello World');
        },
      }),
    ],
  },
  deployer: new TestDeployer(),
});
