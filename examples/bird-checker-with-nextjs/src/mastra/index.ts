import { Mastra } from "@actus-ag/mastra-core";
import { birdAgent } from "./agents";

export const mastra = new Mastra({
  agents: { birdAgent },
});
