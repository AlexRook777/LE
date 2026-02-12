/**
 * Browser lifecycle manager.
 * Launches Chrome with the user's real profile (cookies, logins preserved).
 * Reuses a single browser instance across all tool calls.
 */
import puppeteer, { Browser, Page } from 'puppeteer-core';
import { config } from '../utils/config.js';
import { log } from '../utils/logger.js';

let browserInstance: Browser | null = null;
let pageInstance: Page | null = null;

/**
 * Get or launch the browser. Reuses existing instance.
 */
export async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  log.info('Launching Chrome...', {
    profile: config.chrome.profile,
    userDataDir: config.chrome.userDataDir,
  });

  // Use puppeteer-core to connect to the system Chrome
  browserInstance = await puppeteer.launch({
    executablePath: config.chrome.executablePath,
    headless: false, // Must be visible for LinkedIn (headless gets blocked)
    userDataDir: config.chrome.userDataDir,
    args: [
      `--profile-directory=${config.chrome.profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-size=1280,900',
      '--disable-extensions-except=',
      '--disable-component-extensions-with-background-pages',
    ],
    defaultViewport: null, // Use window size
    ignoreDefaultArgs: ['--enable-automation'],
    timeout: config.timing.navigationTimeout,
  });

  browserInstance.on('disconnected', () => {
    log.warn('Browser disconnected');
    browserInstance = null;
    pageInstance = null;
  });

  log.info('Chrome launched successfully');
  return browserInstance;
}

/**
 * Get the active page (first tab), or create one.
 */
export async function getPage(): Promise<Page> {
  if (pageInstance && !pageInstance.isClosed()) {
    return pageInstance;
  }

  const browser = await getBrowser();
  const pages = await browser.pages();
  pageInstance = pages[0] || (await browser.newPage());

  // Set navigation timeout
  pageInstance.setDefaultNavigationTimeout(config.timing.navigationTimeout);
  pageInstance.setDefaultTimeout(15000);

  return pageInstance;
}

/**
 * Navigate to a URL and wait for the page to load.
 */
export async function navigateTo(url: string): Promise<Page> {
  const page = await getPage();
  const currentUrl = page.url();

  // Don't navigate if already on the target page
  if (currentUrl === url) {
    return page;
  }

  log.info(`Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // Extra wait for LinkedIn's dynamic content
  await new Promise((r) => setTimeout(r, 2000));
  return page;
}

/**
 * Close the browser cleanly.
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    log.info('Closing browser...');
    await browserInstance.close();
    browserInstance = null;
    pageInstance = null;
  }
}

/**
 * Check if we're logged into LinkedIn.
 */
export async function isLoggedIn(): Promise<boolean> {
  const page = await navigateTo('https://www.linkedin.com/feed/');
  const url = page.url();
  // If redirected to login page, not logged in
  if (url.includes('/login') || url.includes('/authwall')) {
    return false;
  }
  // Check for feed content or nav bar
  const hasNav = await page.$('.global-nav');
  return hasNav !== null;
}
