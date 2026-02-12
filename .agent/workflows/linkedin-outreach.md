---
description: Daily LinkedIn lead generation using browser automation
---

# LinkedIn Outreach — Lead Generation Workflow

Daily routine for LinkedIn lead generation. The agent uses `browser_action` to navigate LinkedIn, search for decision-makers, engage with their content, send connection requests, and track leads in the local CRM.

**Strategy**: "Trojan Horse" — engage with content first (like + high-value comment), then connect without a note. This warms the prospect before the request arrives.

---

## Prerequisites

- User must be **logged into LinkedIn** in the browser session (agent will verify)
- CRM files exist at `outreach/crm.json` and `outreach/crm_trending.json`
- Agent has read `.gemini.md` to understand the user's expertise and voice

---

## Configuration

| Parameter | Value | Notes |
|-----------|-------|-------|
| Daily lead goal | 20 | Max connection requests per session |
| Target roles | CEO, COO, CMO, CTO, CIO, HRO, CxO, Founder | Decision-makers |
| Target location | Ukraine | Adjustable per user request |
| Target industries | Software Development, IT Services, Outsourcing | Tech/IT sector |
| Connection level | 2nd degree only | Never 1st or 3rd |
| Connection note | **None** — send without note | Per playbook strategy |
| Pacing | 3-5 seconds between actions | Human-like speed |

---

## Step 1: Target Identification

**Purpose**: Search LinkedIn for decision-makers matching the target profile.

### Search Queries to Execute (rotate through these):

```
CEO founder IT outsourcing Ukraine
CTO co-founder software development company Ukraine
COO IT services outsourcing Ukraine
CMO technology company Ukraine
Founder software development Ukraine
CTO IT outsourcing Kyiv
CEO software house Ukraine
```

### Actions:

1. **Use `browser_action`** → launch LinkedIn search:
   - URL: `https://www.linkedin.com/search/results/people/?keywords=CEO+founder+IT+outsourcing+Ukraine&network=%5B%22S%22%5D`
   - The `network=%5B%22S%22%5D` parameter filters to **2nd-degree connections only**
   - Wait for results to load

2. **Scan results by reading page content**:
   - **Read the actual content** on the page — names, headlines, button labels
   - **Scroll through all results** on the page until you find profiles where:
     - The profile has a **"Connect" / "Установить контакт"** button (not "Message" or "Pending/На рассмотрении")
     - The role matches target criteria (CEO, CTO, Founder, etc.)
     - The person is NOT already in `crm.json`
   - **Do not stop at the first page view** — keep scrolling down to load more results
   - For each matching profile, note: **Name**, **Headline** (role + company)
   - Skip anyone who:
     - Shows "Message" button (already connected or Premium open messaging — verify on profile)
     - Shows "На рассмотрении" / "Pending" (connection already sent)
     - Is already in `crm.json` (check by name)
     - Is not clearly in a target role or IT/Software/Outsourcing industry

3. **Work through results continuously** — don't build a separate candidate list first
   - When you find a profile with "Connect" button and matching criteria → immediately click into their profile and start engagement (Step 2)
   - After connecting, return to search results and continue scanning
   - Mix multiple search queries to get variety in roles

4. **If results are thin**, try additional queries:
   - `CIO digital transformation Ukraine`
   - `Founder tech startup Kyiv`
   - `VP Engineering outsourcing Ukraine`

---

## Step 2: Profile Analysis & Engagement

**Purpose**: For each candidate, visit their profile, engage with their content, then connect.

### For each profile (repeat until daily goal of 20 is reached):

#### 2a. Navigate to Profile

1. Use `browser_action` → click on profile link (or navigate to profile URL)
2. Wait for profile to fully load and read the profile information
3. **Verify relevance**:
   - Confirm current role matches target (CEO, CTO, Founder, etc.)
   - Confirm company is in IT/Software/Outsourcing sector
   - If NOT relevant → skip, move to next candidate
   - If relevant → proceed

#### 2b. Find Recent Activity

1. On the profile page, look for "Activity" section or "Show all activity" link
2. Click to navigate to their recent posts
3. Read the activity page content to assess their posts
4. **Assess posts**:
   - Look for posts from the last ~2 weeks
   - Identify the most recent substantive post (not a reshare or reaction)
   - Read the post content to understand the topic

#### 2c. Engagement — Like + Comment

**If a relevant recent post exists:**

1. **Like the post**: Click the Like button
2. **Write a high-value comment**:
   - Read the post topic carefully
   - Generate a comment that:
     - Acknowledges their specific point (not generic)
     - Connects it to AI, automation, or process optimization (your expertise from `.gemini.md`)
     - Adds genuine value or a fresh perspective
     - Is 2-4 sentences max — concise and thoughtful
     - Does NOT pitch or sell anything
   - **Comment quality rules**:
     - ❌ NO: "Great post!" / "Thanks for sharing!" / "Totally agree!"
     - ❌ NO: "I help companies with AI..." (no pitching)
     - ✅ YES: "This resonates — we saw the same pattern when optimizing reconciliation pipelines. The bottleneck was never the technology, it was the handoff between teams. Curious if you've tried mapping the actual decision points vs. the org chart."
     - ✅ YES: "The 'automate everything' trap is real. In my experience, the highest ROI comes from automating the verification layer, not the execution. That's where 80% of human time gets burned."
   - Post the comment
   - Wait 2-3 seconds

**If NO relevant recent post exists:**
- Skip engagement, proceed directly to connection

#### 2d. Send Connection Request

1. Navigate back to the profile page (if not already there)
2. Find the **"Connect" / "Установить контакт"** button — **two variants exist**:

   **Variant A — Connect button is visible on the profile:**
   - You see a button labeled **"Установить контакт"** (Connect) directly on the profile
   - Click it directly

   **Variant B — Connect button is NOT visible (hidden behind "..." menu):**
   - The profile shows "Отслеживать" (Follow), "Отправить сообщение" (Message), and **"..."** (More)
   - Click the **"..."** (three-dot) button
   - Look for **"Установить контакт"** (Connect) in the dropdown menu
   - Click it

3. **IMPORTANT**: When the modal appears asking "Добавить заметку в приглашение?" / "Add a note?":
   - Click **"Отправить без заметки"** / **"Send without a note"**
   - Do **NOT** add a personalized note
4. Wait for confirmation — the button should change to **"На рассмотрении"** (Pending)
5. If neither variant works (no Connect option at all) → skip this profile, move to next

#### 2e. Log to CRM

After each successful connection request, update `outreach/crm.json`:

1. Read the current JSON array
2. Determine next `id` (max existing id + 1, or 1 if empty)
3. Assess lead quality and assign a `score` (1-5)
4. Generate a personalized `dmDraft` using the Trojan Horse template (customize topic, question, and resource based on their role and company)
5. Add a new entry to the array:
   ```json
   {
     "id": 3,
     "name": "Andrew Schepanskiy",
     "company": "Bliscore",
     "role": "Co-Founder and COO",
     "source": "LinkedIn",
     "status": "Request Sent",
     "lastAction": "Sent connection request (Feb 12)",
     "score": 3,
     "dmDraft": "Hey Andrew, thanks for the connection. I'm finishing a technical report on 'AI-Driven Process Optimization for Outsourcing Companies.' Since you lead Bliscore, I'd love to get your perspective on whether your clients are asking for custom AI integration yet. Happy to share my 'Agency AI Integration Framework' in exchange for your feedback."
   }
   ```
6. Write the updated array back to `outreach/crm.json`

#### 2f. Progress Check

After each lead:
- Report progress: `"✓ [3/20] Connected with John Smith — CEO at TechCorp (liked + commented on their post about scaling teams)"`
- If daily goal (20) is reached → stop, close browser, and notify user
- If more candidates needed → go back to Step 1 with different search query

**Pacing**: Wait 3-5 seconds between profile visits. Vary timing slightly to appear human.

---

## CRM Operations

> **All CRM operations follow the [CRM Management Skill](../skills/crm-management.md).**
> Read that skill for: contact schema, field definitions, status progression, lead scoring, DM draft templates, and all CRUD operations.

This workflow uses the following CRM operations:
- **Add Contact** — After each successful connection request (Step 2e)
- **Check Duplicates** — Before engaging any profile (Step 2a)

---

## Rules & Constraints

1. **Human-like pacing**: 3-5 seconds between actions. Never rush.
2. **No generic comments**: Every comment must reference the specific post content and add value.
3. **No connection notes**: Always send without a note (higher acceptance per playbook).
4. **Daily limit**: Hard stop at 20 connection requests per session.
5. **No duplicates**: Always check `crm.json` before engaging a profile.
6. **2nd-degree only**: Use the `network=%5B%22S%22%5D` filter in search URLs.
7. **Read content, don't just screenshot**: Read the actual page content (names, headlines, buttons). Scroll through results until finding actionable profiles. Don't stop at first page view.
8. **Stop on errors**: If LinkedIn shows a warning, restriction, or CAPTCHA — stop immediately and report to user.
9. **Comment voice**: Match the tone from `.gemini.md` — direct, outcome-focused, data-backed, no fluff.

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Not logged into LinkedIn | Stop. Ask user to log in manually, then restart. |
| CAPTCHA or verification | Stop. Report the issue to user and ask them to solve it. |
| "Connect" button not visible | Try Variant B: click "..." (three-dot) menu → look for "Установить контакт". If still not found → profile may be 3rd-degree or restricted. Skip. |
| LinkedIn rate limit warning | Stop session immediately. Report how many sent. Resume tomorrow. |
| Profile page won't load | Skip profile. Move to next candidate. |
| No search results | Try different search query. If still empty, adjust location/role. |
| CRM file read error | Report error. Do not proceed until resolved. |

---

## Integration with Content Pipeline

This outreach workflow complements the content pipeline:

- **Pain points discovered** during profile analysis → feed into `research/pain_points.md`
- **Trending topics** from posts you engage with → feed into `research/trending_topics.md`
- **Post ideas** from conversations → feed into `content pipeline/1_ideas/`
- **Published content** helps convert connections into conversations (they see your posts)

---

## Related Workflows

- **[LinkedIn Analytic](./linkedin-analytic.md)** — Run before/after outreach for performance analysis and reporting
- **CRM Management** — Uses [CRM Management Skill](../skills/crm-management.md) for all data operations

---

## References

- [LinkedIn Social Selling Playbook](../../linkedin%20methodology/LinkedIn%20Social%20Selling%20Playbook.md) — Full outreach strategy
- [LinkedIn Playbook](../../linkedin%20methodology/LinkedIn%20Playbook.md) — Profile optimization
- [.gemini.md](../../.gemini.md) — Voice, tone, and expertise context for comments
