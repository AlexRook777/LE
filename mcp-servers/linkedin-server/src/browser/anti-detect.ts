/**
 * Human-like behavior simulation for anti-bot detection.
 */
import { Page } from 'puppeteer-core';
import { config } from '../utils/config.js';

/**
 * Random delay between min and max milliseconds.
 */
export function randomDelay(
  min: number = config.timing.minDelay,
  max: number = config.timing.maxDelay
): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Short delay for between micro-actions (1-2s).
 */
export function shortDelay(): Promise<void> {
  return randomDelay(1000, 2000);
}

/**
 * Type text with human-like per-character delays.
 */
export async function humanType(
  page: Page,
  selector: string,
  text: string
): Promise<void> {
  await page.click(selector);
  for (const char of text) {
    await page.keyboard.type(char, {
      delay: config.timing.typeDelay + Math.random() * 40,
    });
  }
}

/**
 * Type text into the currently focused element with human-like delays.
 */
export async function humanTypeInFocused(
  page: Page,
  text: string
): Promise<void> {
  for (const char of text) {
    await page.keyboard.type(char, {
      delay: config.timing.typeDelay + Math.random() * 40,
    });
  }
}

/**
 * Scroll down smoothly to simulate human scrolling.
 */
export async function smoothScroll(
  page: Page,
  distance: number = 600
): Promise<void> {
  await page.evaluate(async (dist: number) => {
    await new Promise<void>((resolve) => {
      let scrolled = 0;
      const step = 80 + Math.random() * 40;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        scrolled += step;
        if (scrolled >= dist) {
          clearInterval(timer);
          resolve();
        }
      }, 50 + Math.random() * 30);
    });
  }, distance);
  await shortDelay();
}

/**
 * Move mouse to a random point near an element (avoids pixel-perfect clicks).
 */
export async function moveToElement(
  page: Page,
  selector: string
): Promise<void> {
  const el = await page.$(selector);
  if (!el) return;
  const box = await el.boundingBox();
  if (!box) return;
  const x = box.x + box.width / 2 + (Math.random() - 0.5) * 10;
  const y = box.y + box.height / 2 + (Math.random() - 0.5) * 6;
  await page.mouse.move(x, y, { steps: 8 + Math.floor(Math.random() * 5) });
}

/**
 * Check if a CAPTCHA or verification page is showing.
 */
export async function detectCaptcha(page: Page): Promise<boolean> {
  const url = page.url();
  if (url.includes('/checkpoint/') || url.includes('/authwall')) {
    return true;
  }
  const captchaIndicators = await page.evaluate(() => {
    const body = document.body?.textContent?.toLowerCase() || '';
    return (
      body.includes('security verification') ||
      body.includes('проверка безопасности') ||
      body.includes("let's do a quick security check") ||
      document.querySelector('iframe[src*="captcha"]') !== null
    );
  });
  return captchaIndicators;
}
