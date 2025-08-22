import type { MastraError } from '@actus-ag/mastra-core/error';
import type { Mastra } from '@actus-ag/mastra-core/mastra';

export interface ApiError extends MastraError {
  message: string;
  status?: number;
}

export interface Context {
  mastra: Mastra;
}
