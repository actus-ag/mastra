import { ConsoleLogger } from "@datawarp/mastra-core/logger";
import { Mastra } from "@datawarp/mastra-core/mastra";

import { weatherAgent } from "./agents";

export const mastra = new Mastra({
  agents: { weatherAgent },
  logger: new ConsoleLogger(),
  // aiSdkCompat: "v4",
});
