import { analytics, origin } from '../..';
import { build } from '../build/build';

export const buildProject = async (args: any) => {
  await analytics.trackCommandExecution({
    command: '@actus-ag/@mastra/cli/cli build',
    args,
    execution: async () => {
      await build({
        dir: args?.dir,
        root: args?.root,
        tools: args?.tools ? args.tools.split(',') : [],
        env: args?.env,
      });
    },
    origin,
  });
};
