/**
 * Tool: linkedin_search_leads
 * Searches LinkedIn for people matching criteria, returns structured lead data.
 * Filters by button text: "Установить контакт" / "Connect" = target lead.
 */
import { navigateTo, getPage } from '../browser/browser-manager.js';
import { randomDelay, smoothScroll, detectCaptcha } from '../browser/anti-detect.js';
import { SEARCH, BUTTON_TEXT, matchesButtonText } from '../browser/selectors.js';
import { log } from '../utils/logger.js';
import { config } from '../utils/config.js';

export interface LeadResult {
  name: string;
  headline: string;
  profileUrl: string;
  buttonText: string;
  location: string;
}

export async function searchLeads(
  keywords: string,
  network: string = 'S',
  maxResults: number = 20
): Promise<LeadResult[]> {
  const leads: LeadResult[] = [];
  const encodedKeywords = encodeURIComponent(keywords);
  const networkParam = encodeURIComponent(`["${network}"]`);
  const searchUrl = `${config.linkedin.searchUrl}?keywords=${encodedKeywords}&network=${networkParam}&origin=FACETED_SEARCH`;

  log.info(`Searching: ${keywords} (max ${maxResults})`);

  const page = await navigateTo(searchUrl);

  // Check for CAPTCHA
  if (await detectCaptcha(page)) {
    throw new Error('CAPTCHA detected. Please solve it manually and retry.');
  }

  // Check if logged in
  const url = page.url();
  if (url.includes('/login') || url.includes('/authwall')) {
    throw new Error('Not logged into LinkedIn. Please log in manually.');
  }

  let pageNum = 1;
  const maxPages = 5;

  while (leads.length < maxResults && pageNum <= maxPages) {
    // Wait for results to load
    await new Promise((r) => setTimeout(r, 3000));

    // Scroll to load all results on this page
    for (let i = 0; i < 4; i++) {
      await smoothScroll(page, 500);
    }

    // Extract results from the page
    const pageLeads = await page.evaluate(
      (selectors, connectPatterns, messagePatterns, pendingPatterns) => {
        const results: Array<{
          name: string;
          headline: string;
          profileUrl: string;
          buttonText: string;
          location: string;
        }> = [];

        const cards = document.querySelectorAll(selectors.resultCard);

        cards.forEach((card) => {
          // Get name and profile URL
          const nameEl = card.querySelector(selectors.nameLink) as HTMLAnchorElement | null;
          if (!nameEl) return;

          const name = nameEl.textContent?.trim().replace(/\s+/g, ' ') || '';
          const profileUrl = nameEl.href?.split('?')[0] || '';

          // Skip if no name
          if (!name || name.includes('LinkedIn Member')) return;

          // Get headline
          const headlineEl = card.querySelector(selectors.headline);
          const headline = headlineEl?.textContent?.trim() || '';

          // Get location
          const locationEl = card.querySelector(selectors.location);
          const location = locationEl?.textContent?.trim() || '';

          // Get action button text — THIS IS THE KEY FILTER
          const buttonEl = card.querySelector(selectors.actionButton) as HTMLButtonElement | null;
          const buttonText = buttonEl?.textContent?.trim() || '';

          // Only include if button says "Connect" / "Установить контакт"
          const isConnect = connectPatterns.some(
            (p: string) => buttonText.toLowerCase().includes(p.toLowerCase())
          );
          const isMessage = messagePatterns.some(
            (p: string) => buttonText.toLowerCase().includes(p.toLowerCase())
          );
          const isPending = pendingPatterns.some(
            (p: string) => buttonText.toLowerCase().includes(p.toLowerCase())
          );

          results.push({
            name,
            headline,
            profileUrl,
            buttonText: isConnect
              ? 'Connect'
              : isMessage
                ? 'Message'
                : isPending
                  ? 'Pending'
                  : buttonText,
            location,
          });
        });

        return results;
      },
      SEARCH,
      [...BUTTON_TEXT.connect],
      [...BUTTON_TEXT.message],
      [...BUTTON_TEXT.pending]
    );

    // Add only connectable leads
    for (const lead of pageLeads) {
      if (lead.buttonText === 'Connect' && leads.length < maxResults) {
        // Check for duplicates in current batch
        if (!leads.some((l) => l.name === lead.name)) {
          leads.push(lead);
        }
      }
    }

    log.info(`Page ${pageNum}: found ${pageLeads.length} results, ${leads.length} connectable leads total`);

    // Try next page if we need more
    if (leads.length < maxResults) {
      const nextButton = await page.$(SEARCH.nextPage);
      if (nextButton) {
        await nextButton.click();
        pageNum++;
        await randomDelay(3000, 5000);
      } else {
        break; // No more pages
      }
    }
  }

  log.info(`Search complete: ${leads.length} connectable leads found`);
  return leads.slice(0, maxResults);
}
