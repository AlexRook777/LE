/**
 * Tool: linkedin_send_connection
 * Sends a connection request without a note.
 * Handles both Russian and English UI.
 */
import { navigateTo, getPage } from '../browser/browser-manager.js';
import { randomDelay, shortDelay, detectCaptcha } from '../browser/anti-detect.js';
import { PROFILE, CONNECTION, BUTTON_TEXT } from '../browser/selectors.js';
import { log } from '../utils/logger.js';

export async function sendConnection(
  profileUrl: string
): Promise<{ success: boolean; message: string; newStatus: string }> {
  log.info(`Sending connection request: ${profileUrl}`);

  const page = await navigateTo(profileUrl);

  if (await detectCaptcha(page)) {
    throw new Error('CAPTCHA detected. Please solve it manually and retry.');
  }

  await new Promise((r) => setTimeout(r, 2500));

  // --- VARIANT A: Try to find "Connect" button directly visible on profile ---
  let connectClicked = false;

  // Search all buttons in the actions section for Connect text
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const text = await page.evaluate((el) => el.textContent?.trim() || '', button);
    const isConnect = BUTTON_TEXT.connect.some(
      (p) => text.toLowerCase().includes(p.toLowerCase())
    );
    if (isConnect) {
      await button.click();
      connectClicked = true;
      log.info('Clicked Connect button (Variant A - direct)');
      break;
    }
  }

  // --- VARIANT B: Connect button hidden behind "..." menu ---
  if (!connectClicked) {
    log.info('Connect button not visible, trying More menu (Variant B)');

    const moreButton = await page.$(PROFILE.moreButton);
    if (moreButton) {
      await moreButton.click();
      await shortDelay();

      // Look for Connect option in the dropdown
      const dropdownItems = await page.$$('.artdeco-dropdown__content li button, .artdeco-dropdown__content button');
      for (const item of dropdownItems) {
        const text = await page.evaluate((el) => el.textContent?.trim() || '', item);
        const isConnect = BUTTON_TEXT.connect.some(
          (p) => text.toLowerCase().includes(p.toLowerCase())
        );
        if (isConnect) {
          await item.click();
          connectClicked = true;
          log.info('Clicked Connect in dropdown (Variant B)');
          break;
        }
      }

      // Close dropdown if we didn't find Connect
      if (!connectClicked) {
        await page.keyboard.press('Escape');
      }
    }
  }

  if (!connectClicked) {
    return {
      success: false,
      message: 'Connect button not found. Profile may be 1st/3rd degree or restricted.',
      newStatus: 'Skipped',
    };
  }

  // --- Handle the modal: "Add a note?" → Click "Send without a note" ---
  await new Promise((r) => setTimeout(r, 2000));

  // Wait for modal to appear
  const modal = await page.waitForSelector(CONNECTION.modal, { timeout: 5000 }).catch(() => null);

  if (modal) {
    // Strategy 1: Try aria-label selector
    let sendClicked = false;
    const sendButton = await page.$(CONNECTION.sendWithoutNote);
    if (sendButton) {
      await sendButton.click();
      sendClicked = true;
      log.info('Clicked "Send without a note" (aria-label match)');
    }

    // Strategy 2: Find button by text content
    if (!sendClicked) {
      const modalButtons = await page.$$('.artdeco-modal button');
      for (const btn of modalButtons) {
        const text = await page.evaluate((el) => el.textContent?.trim() || '', btn);
        const isSend = CONNECTION.sendWithoutNoteByText.some(
          (p) => text.toLowerCase().includes(p.toLowerCase())
        );
        if (isSend) {
          await btn.click();
          sendClicked = true;
          log.info(`Clicked send button: "${text}"`);
          break;
        }
      }
    }

    // Strategy 3: If there's only a "Send" button (no note option shown)
    if (!sendClicked) {
      const modalButtons = await page.$$('.artdeco-modal button.artdeco-button--primary');
      for (const btn of modalButtons) {
        const text = await page.evaluate((el) => el.textContent?.trim() || '', btn);
        if (text.toLowerCase().includes('send') || text.toLowerCase().includes('отправить')) {
          await btn.click();
          sendClicked = true;
          log.info(`Clicked primary send button: "${text}"`);
          break;
        }
      }
    }

    if (!sendClicked) {
      // Dismiss modal and report failure
      await page.keyboard.press('Escape');
      return {
        success: false,
        message: 'Could not find "Send without a note" button in modal.',
        newStatus: 'Error',
      };
    }
  } else {
    // No modal appeared — connection might have been sent directly
    // or there was an issue
    log.warn('No modal appeared after clicking Connect');
  }

  await shortDelay();

  // Verify: check if button changed to "Pending"
  const pageText = await page.evaluate(() => document.body.textContent || '');
  const isPending =
    BUTTON_TEXT.pending.some((p) => pageText.includes(p)) ||
    pageText.includes('Pending') ||
    pageText.includes('На рассмотрении');

  if (isPending) {
    log.info('Connection request sent successfully (status: Pending)');
    return {
      success: true,
      message: 'Connection request sent',
      newStatus: 'Pending',
    };
  }

  // May have worked even without visible confirmation
  log.warn('Could not verify Pending status, but request was likely sent');
  return {
    success: true,
    message: 'Connection request likely sent (could not verify Pending status)',
    newStatus: 'Pending (unverified)',
  };
}
