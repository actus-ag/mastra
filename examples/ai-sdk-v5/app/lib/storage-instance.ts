import { LibSQLStore } from "@actus-ag/mastra-libsql";

let instance: LibSQLStore | null = null;

export function getStorage() {
  if (!instance) {
    instance = new LibSQLStore({
      url: `file:./mastra.db`,
    });
  }

  return instance;
}
