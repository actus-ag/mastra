import type { MastraError } from '@datawarp/mastra-core/error';
import type { Mastra } from '@datawarp/mastra-core/mastra';

export interface ApiError extends MastraError {
  message: string;
  status?: number;
}

export interface Context {
  mastra: Mastra;
}
