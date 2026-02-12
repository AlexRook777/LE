/**
 * Tools: linkedin_like_post, linkedin_comment_on_post
 * Engagement actions on LinkedIn posts.
 */
import { navigateTo, getPage } from '../browser/browser-manager.js';
import { randomDelay, shortDelay, humanTypeInFocused, detectCaptcha } from '../browser/anti-detect.js';
import { ENGAGE } from '../browser/selectors.js';
import { log } from '../utils/logger.js';

/**
 * Like a LinkedIn post.
 */
export async function likePost(postUrl: string): Promise<{ success: boolean; message: string }> {
  log.info(`Liking post: ${postUrl}`);

  const page = await navigateTo(postUrl);

  if (await detectCaptcha(page)) {
    throw new Error('CAPTCHA detected. Please solve it manually and retry.');
  }

  await new Promise((r) => setTimeout(r, 2500));

  // Check if already liked
  const alreadyLiked = await page.$(ENGAGE.likedButton);
  if (alreadyLiked) {
    log.info('Post already liked');
    return { success: true, message: 'Post was already liked' };
  }

  // Find and click the like button
  const likeButton = await page.$(ENGAGE.likeButton);
  if (!likeButton) {
    // Try finding by the react button class on the post
    const altLike = await page.$('button.react-button__trigger');
    if (altLike) {
      await altLike.click();
      await shortDelay();
      return { success: true, message: 'Liked post' };
    }
    return { success: false, message: 'Like button not found' };
  }

  await likeButton.click();
  await shortDelay();

  log.info('Post liked successfully');
  return { success: true, message: 'Liked post' };
}

/**
 * Post a comment on a LinkedIn post.
 */
export async function commentOnPost(
  postUrl: string,
  comment: string
): Promise<{ success: boolean; message: string }> {
  log.info(`Commenting on post: ${postUrl}`);

  const page = await navigateTo(postUrl);

  if (await detectCaptcha(page)) {
    throw new Error('CAPTCHA detected. Please solve it manually and retry.');
  }

  await new Promise((r) => setTimeout(r, 2500));

  // Click the comment button to open the comment box
  const commentTrigger = await page.$(ENGAGE.commentTrigger);
  if (commentTrigger) {
    await commentTrigger.click();
    await shortDelay();
  }

  // Wait for comment box to appear
  await page.waitForSelector(ENGAGE.commentBox, { timeout: 10000 }).catch(() => null);

  const commentBox = await page.$(ENGAGE.commentBox);
  if (!commentBox) {
    // Try alternative: sometimes the comment box is a div with contenteditable
    const altBox = await page.$('div[contenteditable="true"][role="textbox"]');
    if (!altBox) {
      return { success: false, message: 'Comment box not found' };
    }
    await altBox.click();
    await humanTypeInFocused(page, comment);
  } else {
    await commentBox.click();
    await humanTypeInFocused(page, comment);
  }

  await shortDelay();

  // Submit the comment
  const submitButton = await page.$(ENGAGE.commentSubmit);
  if (!submitButton) {
    // Try alternative submit methods
    // Sometimes pressing Ctrl+Enter submits
    await page.keyboard.down('Control');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Control');
    await shortDelay();
    log.info('Comment submitted via Ctrl+Enter');
    return { success: true, message: 'Comment posted (via keyboard shortcut)' };
  }

  await submitButton.click();
  await shortDelay();

  log.info('Comment posted successfully');
  return { success: true, message: 'Comment posted' };
}
