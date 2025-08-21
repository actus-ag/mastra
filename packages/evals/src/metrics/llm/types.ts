import type { MetricResult } from '@datawarp/mastra-core/eval';

export interface MetricResultWithReason extends MetricResult {
  info: {
    reason: string;
  };
}
