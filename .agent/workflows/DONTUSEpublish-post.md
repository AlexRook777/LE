---
description: Publish an approved LinkedIn post using browser automation
---

# Publish Post to LinkedIn

## Prerequisites

- Post must be in `content pipeline/4_published/` with `status: "ready_to_publish"` or `status: "published"`
- You must be logged into LinkedIn in your browser session

## Steps

1. **Validate the post file**
   - Read the post file from `content pipeline/4_published/<filename>`
   - Parse frontmatter and verify required fields exist:
     - `title` (string)
     - `category` (string)
     - `perspective` (string)
     - `topic` (string)
     - `status` (must be "ready_to_publish" or "published")
   - Extract post content (everything after frontmatter)
   - Count symbols in content (must be ≤ 3000 characters)
   - If validation fails, stop and report the error

2. **Check if already published**
   - If `status: "published"` AND file exists in `content pipeline/4_published/`:
     - Report: "Post already published, skipping"
     - Exit workflow
   - Otherwise, proceed to publish

3. **Open LinkedIn and navigate to post creation**
   - Use `browser_subagent` to:
     - Navigate to `https://www.linkedin.com/feed/`
     - Wait for page to fully load
     - Verify user is logged in by checking for "Start a post" button
     - If not logged in, report error: "Please log into LinkedIn first"
     - Click "Start a post" button
     - Wait for the post creation modal to appear

4. **Compose the post**
   - Click into the text area
   - Paste the entire post content (including hashtags)
   - Wait 1 second for content to render
   - Take a screenshot of the draft for verification

5. **Pre-publish verification**
   - Verify the content appears correctly in the text area
   - Check that hashtags are visible at the bottom
   - Confirm character count is within limits (LinkedIn shows this in UI)

6. **Publish the post**
   - Click the "Post" button
   - Wait for the success confirmation (modal closes, returns to feed)
   - Wait 2 seconds for the post to appear in feed

7. **Capture post metadata**
   - Locate the newly published post in the feed (should be the first post)
   - Extract the post URL from the browser
   - Take a screenshot of the published post
   - Record the current timestamp as `published_date`

8. **Update post file and move to published folder**
   - Update the frontmatter in the original file:
     - Set `status: "published"`
     - Add `published_date: "<ISO 8601 timestamp>"`
     - Add `post_url: "<LinkedIn post URL>"`
   - Update the file in `content pipeline/4_published/` (no move needed, just update status)
   - Verify the file was moved successfully

9. **Create analytics entry**
   - Open `analytics/post_performance.md`
   - Add a new entry with:
     - Post title
     - Published date
     - Post URL
     - Initial metrics (to be filled later): impressions, likes, comments, shares
   - Save the file

10. **Report success**
    - Display the post URL
    - Show the screenshot of the published post
    - Confirm the file status was updated to `published`
    - Provide next steps: "Post published successfully! Track performance in analytics/post_performance.md"

## Error Handling

- **LinkedIn not logged in**: Stop and ask user to log in first
- **Post creation modal doesn't appear**: Retry 2x, then report error
- **Post button disabled**: Check content length, report if >3000 characters
- **Post doesn't appear in feed**: Wait 5 more seconds, retry capture
- **File move fails**: Report error but don't delete the original

## Notes

- The browser automation will be visible to you, so you can watch the process
- If anything fails, screenshots will be captured for debugging
- The workflow is idempotent: running it twice on the same file won't duplicate posts
