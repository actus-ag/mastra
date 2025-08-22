// @ts-ignore
// @ts-ignore
import { evaluate } from '@actus-ag/mastra-core/eval';
import { AvailableHooks, registerHook } from '@actus-ag/mastra-core/hooks';
import { TABLE_EVALS } from '@actus-ag/mastra-core/storage';
import { checkEvalStorageFields } from '@actus-ag/mastra-core/utils';
import { mastra } from '#mastra';
import { createNodeServer, getToolExports } from '#server';
import { tools } from '#tools';
// @ts-ignore
await createNodeServer(mastra, {
  playground: true,
  isDev: true,
  tools: getToolExports(tools),
});

registerHook(AvailableHooks.ON_GENERATION, ({ input, output, metric, runId, agentName, instructions }) => {
  evaluate({
    agentName,
    input,
    metric,
    output,
    runId,
    globalRunId: runId,
    instructions,
  });
});

registerHook(AvailableHooks.ON_EVALUATION, async traceObject => {
  const storage = mastra.getStorage();
  if (storage) {
    // Check for required fields
    const logger = mastra?.getLogger();
    const areFieldsValid = checkEvalStorageFields(traceObject, logger);
    if (!areFieldsValid) return;

    await storage.insert({
      tableName: TABLE_EVALS,
      record: {
        input: traceObject.input,
        output: traceObject.output,
        result: JSON.stringify(traceObject.result || {}),
        agent_name: traceObject.agentName,
        metric_name: traceObject.metricName,
        instructions: traceObject.instructions,
        test_info: null,
        global_run_id: traceObject.globalRunId,
        run_id: traceObject.runId,
        created_at: new Date().toISOString(),
      },
    });
  }
});
