/**
 * Logger that writes to stderr (MCP servers must keep stdout clean for JSON-RPC).
 */
export const log = {
  info: (msg: string, data?: unknown) => {
    console.error(`[INFO] ${msg}`, data ? JSON.stringify(data) : '');
  },
  warn: (msg: string, data?: unknown) => {
    console.error(`[WARN] ${msg}`, data ? JSON.stringify(data) : '');
  },
  error: (msg: string, data?: unknown) => {
    console.error(`[ERROR] ${msg}`, data ? JSON.stringify(data) : '');
  },
  debug: (msg: string, data?: unknown) => {
    if (process.env.DEBUG === 'true') {
      console.error(`[DEBUG] ${msg}`, data ? JSON.stringify(data) : '');
    }
  },
};
