---
description: Daily LinkedIn lead generation using MCP browser automation
---

# LinkedIn Outreach — Lead Generation Workflow

Daily routine for LinkedIn lead generation. The agent uses **MCP LinkedIn tools** to search for decision-makers, engage with their content, send connection requests, and track leads in the local CRM.

**Strategy**: "Trojan Horse" — engage with content first (like + high-value comment), then connect without a note. This warms the prospect before the request arrives.

**Execution layer**: All browser automation is handled by the `linkedin` MCP server (Puppeteer + Chrome Profile 2). The agent only orchestrates via tool calls and generates comments — no screenshots or vision needed.

---

## Prerequisites

- User must be **logged into LinkedIn** in Chrome Profile 2
- `linkedin` MCP server must be running (registered in Antigravity MCP settings)
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
| Connection level | 2nd degree only | Enforced by search filter |
| Connection note | **None** — send without note | Per playbook strategy |
| Pacing | 3-8 seconds between actions | Human-like speed (built into MCP server) |
| UI Languages | Russian + English | Button detection handles both |

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

1. **Use `linkedin_search_leads` MCP tool**:
   ```
   linkedin_search_leads(
     keywords: "CEO founder IT outsourcing Ukraine",
     network: "S",      // 2nd-degree only
     maxResults: 20
   )
   ```
   - The tool automatically:
     - Navigates to LinkedIn search with 2nd-degree filter
     - Scrolls through results
     - Filters by button text: only returns leads where button says **"Установить контакт"** / **"Connect"**
     - Skips leads with **"Сообщение"** (Message) = already connected
     - Skips leads with **"На рассмотрении"** (Pending) = request already sent
   - Returns structured JSON: name, headline, profileUrl, location

2. **Check results against CRM**:
   - For each returned lead, check if name exists in `outreach/crm.json`
   - Skip any duplicates
   - Proceed with unprocessed leads

3. **If results are thin**, try additional queries:
   - `CIO digital transformation Ukraine`
   - `Founder tech startup Kyiv`
   - `VP Engineering outsourcing Ukraine`

---

## Step 2: Profile Analysis & Engagement

**Purpose**: For each candidate, visit their profile, engage with their content, then connect.

### For each lead from Step 1 (repeat until daily goal of 20 is reached):

#### 2a. Get Profile Details

1. **Use `linkedin_get_profile` MCP tool**:
   ```
   linkedin_get_profile(profileUrl: "https://www.linkedin.com/in/username/")
   ```
   - Returns: name, headline, company, role, location, about, connectionStatus, hasRecentActivity
2. **Verify relevance**:
   - Confirm current role matches target (CEO, CTO, Founder, etc.)
   - Confirm company is in IT/Software/Outsourcing sector
   - If connectionStatus is NOT "Connect" → skip, move to next candidate
   - If NOT relevant → skip, move to next candidate
   - If relevant → proceed

#### 2b. Get Recent Posts

1. **Use `linkedin_get_recent_posts` MCP tool**:
   ```
   linkedin_get_recent_posts(profileUrl: "...", maxPosts: 3)
   ```
   - Returns: postText, postUrl, timeAgo, likes, comments, isOriginal
2. **Assess posts**:
   - Look for posts from the last ~2 weeks (check timeAgo field)
   - Prioritize original posts over reshares (isOriginal: true)
   - Read the postText to understand the topic

#### 2c. Engagement — Like + Comment

**If a relevant recent post exists (with postUrl and postText):**

1. **Like the post** — Use `linkedin_like_post` MCP tool:
   ```
   linkedin_like_post(postUrl: "https://www.linkedin.com/feed/update/urn:li:activity:123/")
   ```

2. **Generate and post a high-value comment**:
   - Read the postText returned in step 2b
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
   - Post the comment using `linkedin_comment_on_post` MCP tool:
     ```
     linkedin_comment_on_post(postUrl: "...", comment: "Your generated comment text")
     ```

**If NO relevant recent post exists:**
- Skip engagement, proceed directly to connection

#### 2d. Send Connection Request

1. **Use `linkedin_send_connection` MCP tool**:
   ```
   linkedin_send_connection(profileUrl: "https://www.linkedin.com/in/username/")
   ```
   - The tool automatically:
     - Variant A: Clicks visible "Установить контакт" / "Connect" button
     - Variant B: If not visible, clicks "..." menu → finds Connect in dropdown
     - Clicks "Отправить без заметки" / "Send without a note" in the modal
     - Handles both Russian and English UI
   - Returns: success status, message, newStatus
2. If success → proceed to logging
3. If failure → report and skip to next lead

#### 2e. Log to CRM

After each successful connection request, update `outreach/crm.json`:

1. Read the current JSON array from `outreach/crm.json`
2. Determine next `id` (max existing id + 1, or 1 if empty)
3. Assess lead quality and assign a `score` (1-5)
4. Generate a personalized `dmDraft` using the Trojan Horse template (customize topic, question, and resource based on their role and company)
5. Add a new entry to the array:
   ```json
   {
     "id": 3,
     "name": "Leonid Polupan",
     "company": "Seeton Group",
     "role": "Chief Executive Officer",
     "source": "LinkedIn",
     "status": "Request Sent",
     "lastAction": "Sent connection request (Feb 12)",
     "score": 3,
     "dmDraft": "Hey Leonid, thanks for the connection. I'm finishing a technical report on 'AI-Driven Process Optimization for Outsourcing Companies.' Since you lead Seeton Group, I'd love to get your perspective on whether your clients are asking for custom AI integration yet. Happy to share my 'Agency AI Integration Framework' in exchange for your feedback."
   }
   ```
6. Write the updated array back to `outreach/crm.json`

#### 2f. Progress Check

After each lead:
- Report progress: `"✓ [3/20] Connected with Leonid Polupan — CEO at Seeton Group (liked + commented on their post about scaling teams)"`
- If daily goal (20) is reached → verify invitations and generate report
- If more candidates needed → go back to Step 1 with different search query

---

## Step 3: Verification & Reporting

After reaching the daily goal:

1. **Verify sent invitations** — Use `linkedin_check_invitations` MCP tool:
   ```
   linkedin_check_invitations()
   ```
   - Returns: pendingCount, recentSent list
   - Cross-check with today's connections

2. **Generate session report** — Present to user:
   ```
   📊 Daily Outreach Report — Feb 12, 2026
   ────────────────────────────────
   Leads searched:     45
   Profiles visited:   25
   Posts engaged:      18 (liked + commented)
   Connections sent:   20/20 ✓
   ────────────────────────────────
   Role breakdown:
   • CEO/Founder: 12
   • CTO: 5
   • COO/CMO: 3
   ────────────────────────────────
   Top engagement:
   • Leonid Polupan (CEO, Seeton Group) — commented on scaling post
   • [etc.]
   ```

3. **Log metrics** to `outreach/crm_trending.json`

---

## MCP Tools Reference

| Tool | Purpose | Key Input | Key Output |
|------|---------|-----------|------------|
| `linkedin_search_leads` | Find connectable leads | keywords, network, maxResults | Array of {name, headline, profileUrl, buttonText, location} |
| `linkedin_get_profile` | Read profile details | profileUrl | {name, headline, company, role, about, connectionStatus, hasRecentActivity} |
| `linkedin_get_recent_posts` | Read recent posts | profileUrl, maxPosts | Array of {postText, postUrl, timeAgo, likes, comments, isOriginal} |
| `linkedin_like_post` | Like a post | postUrl | {success, message} |
| `linkedin_comment_on_post` | Comment on a post | postUrl, comment | {success, message} |
| `linkedin_send_connection` | Send connection request (no note) | profileUrl | {success, message, newStatus} |
| `linkedin_check_invitations` | Check sent invitations | (none) | {pendingCount, recentSent[]} |

All tools handle Russian + English LinkedIn UI automatically. Human-like delays (3-8s) are built into each tool.

---

## CRM Operations

> **All CRM operations follow the [CRM Management Skill](../skills/crm-management.md).**
> Read that skill for: contact schema, field definitions, status progression, lead scoring, DM draft templates, and all CRUD operations.

This workflow uses the following CRM operations:
- **Add Contact** — After each successful connection request (Step 2e)
- **Check Duplicates** — Before engaging any profile (Step 2a)

---

## Rules & Constraints

1. **Human-like pacing**: 3-8 seconds between actions (built into MCP tools). Never rush.
2. **No generic comments**: Every comment must reference the specific post content and add value.
3. **No connection notes**: Always send without a note (higher acceptance per playbook).
4. **Daily limit**: Hard stop at 20 connection requests per session.
5. **No duplicates**: Always check `crm.json` before engaging a profile.
6. **2nd-degree only**: Use `network: "S"` filter in search tool.
7. **Button filtering**: The search tool automatically filters by button text — "Установить контакт" / "Connect" = target lead, "Сообщение" / "Message" = skip.
8. **Stop on errors**: If any tool returns a CAPTCHA error — stop immediately and report to user.
9. **Comment voice**: Match the tone from `.gemini.md` — direct, outcome-focused, data-backed, no fluff.

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Not logged into LinkedIn | Tool returns auth error. Stop. Ask user to log in manually, then restart. |
| CAPTCHA or verification | Tool returns CAPTCHA error. Stop. Report to user, ask them to solve it. |
| "Connect" button not found | Tool tries both Variant A and B. If still not found → profile may be 3rd-degree. Skip. |
| LinkedIn rate limit warning | Stop session immediately. Report how many sent. Resume tomorrow. |
| Profile page won't load | Tool returns navigation error. Skip profile, move to next. |
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

## Technical Architecture

```
Agent (LLM) ──── stdio (JSON-RPC) ──── linkedin MCP Server
                                              │
                                        Puppeteer-core
                                              │
                                     Chrome (Profile 2)
                                     with real cookies/login
```

- **MCP Server location**: `mcp-servers/linkedin-server/`
- **Config**: All environment variables set in MCP settings (Chrome path, profile, CRM paths)
- **Anti-detection**: puppeteer stealth mode, real user profile, randomized delays
- **Languages**: Russian + English button/label detection
- **Build**: `cd mcp-servers/linkedin-server && npm run build`

---

## References

- [LinkedIn Social Selling Playbook](../../linkedin%20methodology/LinkedIn%20Social%20Selling%20Playbook.md) — Full outreach strategy
- [LinkedIn Playbook](../../linkedin%20methodology/LinkedIn%20Playbook.md) — Profile optimization
- [.gemini.md](../../.gemini.md) — Voice, tone, and expertise context for comments
- [Architecture Plan](./linkedin-outreach-mcp-architecture.md) — Detailed MCP server architecture
