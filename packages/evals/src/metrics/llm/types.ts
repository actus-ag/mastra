import type { MetricResult } from '@actus-ag/mastra-core/eval';

export interface MetricResultWithReason extends MetricResult {
  info: {
    reason: string;
  };
}
