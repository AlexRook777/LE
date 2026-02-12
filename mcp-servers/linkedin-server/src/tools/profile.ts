/**
 * Tool: linkedin_get_profile
 * Navigates to a LinkedIn profile and extracts structured information.
 */
import { navigateTo } from '../browser/browser-manager.js';
import { randomDelay, detectCaptcha } from '../browser/anti-detect.js';
import { PROFILE, BUTTON_TEXT } from '../browser/selectors.js';
import { log } from '../utils/logger.js';

export interface ProfileData {
  name: string;
  headline: string;
  company: string;
  role: string;
  location: string;
  about: string;
  connectionStatus: string;
  hasRecentActivity: boolean;
  profileUrl: string;
}

export async function getProfile(profileUrl: string): Promise<ProfileData> {
  log.info(`Getting profile: ${profileUrl}`);

  const page = await navigateTo(profileUrl);

  if (await detectCaptcha(page)) {
    throw new Error('CAPTCHA detected. Please solve it manually and retry.');
  }

  // Wait for profile to load
  await new Promise((r) => setTimeout(r, 2500));

  const profileData = await page.evaluate(
    (selectors, btnText) => {
      const getText = (sel: string): string => {
        const el = document.querySelector(sel);
        return el?.textContent?.trim().replace(/\s+/g, ' ') || '';
      };

      const name = getText(selectors.name);
      const headline = getText(selectors.headline);
      const location = getText(selectors.location);

      // Try to get About section
      let about = '';
      const aboutEl = document.querySelector(selectors.about);
      if (aboutEl) {
        about = aboutEl.textContent?.trim().slice(0, 300) || '';
      }

      // Parse company and role from headline
      // Common patterns: "CEO at TechCorp" or "CEO — TechCorp"
      let company = '';
      let role = '';
      const atMatch = headline.match(/^(.+?)\s+(?:at|в|@|—|–|-)\s+(.+)$/i);
      if (atMatch) {
        role = atMatch[1].trim();
        company = atMatch[2].trim();
      } else {
        role = headline;
      }

      // Detect connection status from buttons
      let connectionStatus = 'Unknown';
      const actionsSection = document.querySelector(selectors.actionsSection);
      if (actionsSection) {
        const buttons = actionsSection.querySelectorAll('button');
        for (const btn of buttons) {
          const text = btn.textContent?.trim().toLowerCase() || '';
          if (btnText.connect.some((p: string) => text.includes(p.toLowerCase()))) {
            connectionStatus = 'Connect';
            break;
          }
          if (btnText.message.some((p: string) => text.includes(p.toLowerCase()))) {
            connectionStatus = 'Message';
            break;
          }
          if (btnText.pending.some((p: string) => text.includes(p.toLowerCase()))) {
            connectionStatus = 'Pending';
            break;
          }
          if (btnText.follow.some((p: string) => text.includes(p.toLowerCase()))) {
            connectionStatus = 'Follow';
          }
        }
      }

      // Check if there's recent activity
      const activityLink = document.querySelector(selectors.activityLink);
      const hasRecentActivity = activityLink !== null;

      return {
        name,
        headline,
        company,
        role,
        location,
        about,
        connectionStatus,
        hasRecentActivity,
      };
    },
    PROFILE,
    {
      connect: [...BUTTON_TEXT.connect],
      message: [...BUTTON_TEXT.message],
      pending: [...BUTTON_TEXT.pending],
      follow: [...BUTTON_TEXT.follow],
    }
  );

  await randomDelay(2000, 4000);

  return {
    ...profileData,
    profileUrl,
  };
}
