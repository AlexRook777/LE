/**
 * Tool: linkedin_get_recent_posts
 * Navigates to a profile's activity page and reads their most recent posts.
 */
import { navigateTo, getPage } from '../browser/browser-manager.js';
import { randomDelay, smoothScroll, detectCaptcha } from '../browser/anti-detect.js';
import { ACTIVITY } from '../browser/selectors.js';
import { log } from '../utils/logger.js';

export interface PostData {
  postText: string;
  postUrl: string;
  timeAgo: string;
  likes: number;
  comments: number;
  isOriginal: boolean;
}

export async function getRecentPosts(
  profileUrl: string,
  maxPosts: number = 3
): Promise<PostData[]> {
  // Navigate to the profile's activity page
  const activityUrl = profileUrl.replace(/\/$/, '') + '/recent-activity/all/';
  log.info(`Getting recent posts: ${activityUrl}`);

  const page = await navigateTo(activityUrl);

  if (await detectCaptcha(page)) {
    throw new Error('CAPTCHA detected. Please solve it manually and retry.');
  }

  // Wait for activity to load
  await new Promise((r) => setTimeout(r, 3000));

  // Scroll to load posts
  await smoothScroll(page, 800);

  const posts = await page.evaluate(
    (selectors, max) => {
      const results: Array<{
        postText: string;
        postUrl: string;
        timeAgo: string;
        likes: number;
        comments: number;
        isOriginal: boolean;
      }> = [];

      // Try to find post containers - use multiple strategies
      // Strategy 1: Look for feed update containers
      const containers = document.querySelectorAll(
        '.profile-creator-shared-feed-update__container, .feed-shared-update-v2'
      );

      for (const container of containers) {
        if (results.length >= max) break;

        // Get post text
        const textEl = container.querySelector(
          '.feed-shared-update-v2__description .break-words, .update-components-text .break-words'
        );
        const postText = textEl?.textContent?.trim().slice(0, 500) || '';

        // Skip if no text content (likely a reshare with no original text)
        if (!postText) continue;

        // Get post URL from share link or activity link
        const linkEl = container.querySelector(
          'a[href*="/feed/update/"], a[data-urn]'
        ) as HTMLAnchorElement | null;
        const postUrl = linkEl?.href?.split('?')[0] || '';

        // Get time ago
        const timeEl = container.querySelector(
          '.update-components-actor__sub-description span[aria-hidden="true"]'
        );
        const timeAgo = timeEl?.textContent?.trim() || '';

        // Get likes count
        const likesEl = container.querySelector(
          '.social-details-social-counts__reactions-count'
        );
        const likes = parseInt(likesEl?.textContent?.trim() || '0', 10) || 0;

        // Get comments count
        const commentsEl = container.querySelector(
          'button[aria-label*="comment" i] span, button[aria-label*="комментар" i] span'
        );
        const commentsText = commentsEl?.textContent?.trim() || '0';
        const comments = parseInt(commentsText.replace(/\D/g, ''), 10) || 0;

        // Check if this is an original post (not a reshare)
        const reshareIndicator = container.querySelector(
          '.update-components-header__text-view'
        );
        const isOriginal = !reshareIndicator;

        results.push({
          postText,
          postUrl,
          timeAgo,
          likes,
          comments,
          isOriginal,
        });
      }

      return results;
    },
    ACTIVITY,
    maxPosts
  );

  await randomDelay(2000, 4000);

  // Prioritize original posts
  const sorted = posts.sort((a, b) => {
    if (a.isOriginal && !b.isOriginal) return -1;
    if (!a.isOriginal && b.isOriginal) return 1;
    return 0;
  });

  log.info(`Found ${sorted.length} posts`);
  return sorted.slice(0, maxPosts);
}
