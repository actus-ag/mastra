import { PostgresStore } from "@actus-ag/mastra-pg";

const url = "postgresql://postgres:postgres@localhost:5433/mastra";

export const storage = new PostgresStore({
  connectionString: url,
});
