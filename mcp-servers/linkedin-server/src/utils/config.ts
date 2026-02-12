/**
 * Server configuration — all values come from environment variables
 * set in the MCP settings JSON.
 */
export const config = {
  chrome: {
    executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
    userDataDir: process.env.CHROME_USER_DATA_DIR || '/home/worker/.config/google-chrome',
    profile: process.env.CHROME_PROFILE || 'Profile 2',
  },
  linkedin: {
    baseUrl: 'https://www.linkedin.com',
    searchUrl: 'https://www.linkedin.com/search/results/people/',
  },
  timing: {
    minDelay: 3000,   // 3 seconds
    maxDelay: 8000,   // 8 seconds
    typeDelay: 50,     // ms between keystrokes
    navigationTimeout: 30000,  // 30 seconds
  },
} as const;
