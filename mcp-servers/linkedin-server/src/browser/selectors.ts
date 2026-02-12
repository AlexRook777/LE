/**
 * Centralized LinkedIn CSS selectors and text patterns.
 * When LinkedIn changes their UI, update only this file.
 *
 * Languages supported: English + Russian
 */

// --- Search Results Page ---
export const SEARCH = {
  /** Container for each search result card */
  resultCard: '.reusable-search__result-container',
  /** Name link inside a result card */
  nameLink: '.entity-result__title-text a',
  /** Headline/subtitle text */
  headline: '.entity-result__primary-subtitle',
  /** Secondary subtitle (location) */
  location: '.entity-result__secondary-subtitle',
  /** The action button on the right side of each card */
  actionButton: '.entity-result__actions button',
  /** "No results" indicator */
  noResults: '.search-reusable-search-no-results',
  /** Pagination next button */
  nextPage: 'button[aria-label="Next"], button[aria-label="Вперед"]',
} as const;

// --- Profile Page ---
export const PROFILE = {
  /** Full name */
  name: 'h1.text-heading-xlarge',
  /** Headline below name */
  headline: '.text-body-medium.break-words',
  /** Location */
  location: '.text-body-small.inline.t-black--light',
  /** About section text */
  about: '#about ~ .display-flex .inline-show-more-text',
  /** Activity link */
  activityLink: 'a[href*="/recent-activity/"]',
  /** Top card actions section */
  actionsSection: '.pvs-profile-actions',
  /** Connect button variants */
  connectButton: 'button[aria-label*="connect" i], button[aria-label*="контакт" i]',
  /** More actions dropdown trigger (three dots) */
  moreButton: 'button[aria-label="More actions"], button[aria-label="Ещё"], button[aria-label="Другие действия"]',
  /** Dropdown menu container */
  dropdownMenu: '.artdeco-dropdown__content',
} as const;

// --- Activity / Posts Page ---
export const ACTIVITY = {
  /** Individual post container on the activity page */
  postContainer: '.profile-creator-shared-feed-update__container',
  /** Post text content */
  postText: '.feed-shared-update-v2__description .break-words',
  /** Post text - alternative selector */
  postTextAlt: '.update-components-text .break-words',
  /** Time indicator (e.g., "2d", "1w") */
  timeAgo: '.update-components-actor__sub-description span[aria-hidden="true"]',
  /** Like count */
  likeCount: '.social-details-social-counts__reactions-count',
  /** Comment count */
  commentCount: 'button[aria-label*="comment" i] span, button[aria-label*="комментар" i] span',
  /** Reshare indicator */
  reshareIndicator: '.update-components-header__text-view',
} as const;

// --- Post Engagement ---
export const ENGAGE = {
  /** Like button (not yet liked) */
  likeButton: 'button[aria-label*="Like" i]:not([aria-pressed="true"]), button[aria-label*="нравится" i]:not([aria-pressed="true"]), button.react-button__trigger:not([aria-pressed="true"])',
  /** Like button already pressed */
  likedButton: 'button[aria-pressed="true"].react-button__trigger',
  /** Comment input trigger button */
  commentTrigger: 'button[aria-label*="Comment" i], button[aria-label*="комментар" i]',
  /** Comment text box */
  commentBox: '.ql-editor[data-placeholder], .comments-comment-box__form .ql-editor',
  /** Submit comment button */
  commentSubmit: 'button.comments-comment-box__submit-button',
} as const;

// --- Connection Request ---
export const CONNECTION = {
  /** "Send without a note" button in the modal */
  sendWithoutNote: 'button[aria-label="Send without a note"], button[aria-label="Отправить без заметки"], button[aria-label*="Send now"]',
  /** Alternative: look for button text */
  sendWithoutNoteByText: ['Send without a note', 'Отправить без заметки', 'Отправить сейчас', 'Send now'],
  /** Modal container */
  modal: '.artdeco-modal',
  /** Modal dismiss */
  modalDismiss: 'button[aria-label="Dismiss"], button[aria-label="Закрыть"]',
  /** Connection add note button (to avoid) */
  addNote: 'button[aria-label="Add a note"], button[aria-label="Добавить заметку"]',
} as const;

// --- Invitations Page ---
export const INVITATIONS = {
  /** Sent invitations tab */
  sentTab: 'button[aria-label*="Sent"]',
  /** Individual invitation card */
  invitationCard: '.invitation-card',
  /** Name in invitation */
  invitationName: '.invitation-card__title',
  /** Time of invitation */
  invitationTime: '.invitation-card__subtitle',
} as const;

// --- Button Text Patterns (Russian + English) ---
export const BUTTON_TEXT = {
  /** Buttons that mean "this is a connectable lead" */
  connect: ['Установить контакт', 'Connect', 'Подключиться'],
  /** Buttons that mean "already connected or can message" → SKIP */
  message: ['Сообщение', 'Message', 'Написать'],
  /** Buttons that mean "connection pending" → SKIP */
  pending: ['На рассмотрении', 'Pending', 'Ожидание'],
  /** Buttons that mean "follow" */
  follow: ['Отслеживать', 'Follow', 'Подписаться'],
} as const;

/**
 * Check if button text matches one of the target patterns.
 */
export function matchesButtonText(
  text: string,
  patterns: readonly string[]
): boolean {
  const normalized = text.trim().toLowerCase();
  return patterns.some((p) => normalized.includes(p.toLowerCase()));
}
