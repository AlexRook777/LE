/**
 * Tool: linkedin_check_invitations
 * Checks the sent invitations page for verification.
 */
import { navigateTo } from '../browser/browser-manager.js';
import { randomDelay, smoothScroll, detectCaptcha } from '../browser/anti-detect.js';
import { log } from '../utils/logger.js';

export interface SentInvitation {
  name: string;
  sentInfo: string;
}

export interface InvitationsResult {
  pendingCount: number;
  recentSent: SentInvitation[];
}

export async function checkInvitations(): Promise<InvitationsResult> {
  const url = 'https://www.linkedin.com/mynetwork/invitation-manager/sent/';
  log.info('Checking sent invitations...');

  const page = await navigateTo(url);

  if (await detectCaptcha(page)) {
    throw new Error('CAPTCHA detected. Please solve it manually and retry.');
  }

  await new Promise((r) => setTimeout(r, 3000));

  // Scroll to load more invitations
  await smoothScroll(page, 600);

  const result = await page.evaluate(() => {
    const invitations: Array<{ name: string; sentInfo: string }> = [];

    // Try to find invitation cards
    const cards = document.querySelectorAll(
      '.invitation-card, .mn-invitation-list li, li.invitation-card'
    );

    cards.forEach((card) => {
      const nameEl = card.querySelector(
        '.invitation-card__title, .mn-person-info__name, .invitation-card__tvm-title'
      );
      const timeEl = card.querySelector(
        '.invitation-card__subtitle, .time-badge, .invitation-card__tvm-subtitle'
      );

      const name = nameEl?.textContent?.trim() || '';
      const sentInfo = timeEl?.textContent?.trim() || '';

      if (name) {
        invitations.push({ name, sentInfo });
      }
    });

    // Try to get total pending count from the page
    let pendingCount = invitations.length;
    const countEl = document.querySelector(
      '.mn-invitation-manager__header h2, .invitation-manager__header'
    );
    if (countEl) {
      const countMatch = countEl.textContent?.match(/(\d+)/);
      if (countMatch) {
        pendingCount = parseInt(countMatch[1], 10);
      }
    }

    return {
      pendingCount,
      recentSent: invitations.slice(0, 20),
    };
  });

  await randomDelay(2000, 4000);

  log.info(`Found ${result.pendingCount} pending invitations`);
  return result;
}
