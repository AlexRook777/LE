# LinkedIn Outreach MCP Server — Setup & Usage Guide

## What Is This?

A **Model Context Protocol (MCP) server** that automates LinkedIn outreach using your real Chrome browser. Instead of the AI looking at screenshots and clicking around (expensive, slow, fragile), this server handles all browser automation internally and returns clean structured data to the AI.

**Result**: The AI only orchestrates the flow and generates comments — no vision model needed. You can use **cheap/free LLMs** (Gemini Flash, Groq, local Ollama) instead of expensive vision models.

---

## Architecture

```
┌──────────────────────────────────────────────┐
│          Antigravity IDE (Agent)             │
│                                              │
│   You type: "run linkedin outreach"          │
│                                              │
│   LLM reads linkedin-outreach.md workflow    │
│   LLM calls MCP tools (text-only, no vision)│
│   LLM generates high-value comments         │
│   LLM logs results to CRM                   │
└──────────────┬───────────────────────────────┘
               │ stdio (JSON-RPC)
               ▼
┌──────────────────────────────────────────────┐
│       linkedin MCP Server (Node.js)          │
│                                              │
│   7 tools that drive Chrome via Puppeteer:   │
│   • Search for leads                         │
│   • Read profiles                            │
│   • Read posts                               │
│   • Like posts                               │
│   • Comment on posts                         │
│   • Send connection requests                 │
│   • Check sent invitations                   │
│                                              │
│   Chrome Profile 2 (your real login/cookies) │
│   Anti-detection: stealth plugin + delays    │
│   Languages: Russian + English               │
└──────────────────────────────────────────────┘
```

---

## Prerequisites

1. **Google Chrome** installed at `/usr/bin/google-chrome`
2. **Node.js v22+** and npm
3. **Chrome Profile 2** logged into LinkedIn (the server uses your existing session — no password needed)
4. **Antigravity IDE** with MCP server support

### How to verify Chrome Profile 2 is logged in:

```bash
# Open Chrome with Profile 2 manually
google-chrome --profile-directory="Profile 2"
```

Navigate to `https://www.linkedin.com` — you should see your feed (not a login page). If not, log in manually. The MCP server will use these exact cookies.

---

## Installation

### Step 1: Install dependencies

```bash
cd /home/worker/repos/LE/mcp-servers/linkedin-server
npm install
```

### Step 2: Build the TypeScript server

```bash
npm run build
```

This compiles TypeScript from `src/` into JavaScript in `build/`.

### Step 3: Verify the build

```bash
ls build/index.js
# Should exist — this is the entry point
```

### Step 4: Register in Antigravity

The MCP server config is at:
```
~/.config/Antigravity/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

It should contain:

```json
{
  "mcpServers": {
    "linkedin": {
      "command": "node",
      "args": [
        "/home/worker/repos/LE/mcp-servers/linkedin-server/build/index.js"
      ],
      "env": {
        "CHROME_USER_DATA_DIR": "/home/worker/.config/google-chrome",
        "CHROME_PROFILE": "Profile 2",
        "CHROME_PATH": "/usr/bin/google-chrome"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Step 5: Restart Antigravity

After updating the MCP settings, restart Antigravity. The server will auto-start and you'll see 7 new tools available in the "Connected MCP Servers" section.

---

## Available Tools

### 1. `linkedin_search_leads`

**Purpose**: Search LinkedIn for 2nd-degree connections. Returns only leads with "Connect" button.

**Input**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keywords` | string | ✅ | — | Search query (e.g., `"CEO founder IT outsourcing Ukraine"`) |
| `network` | string | — | `"S"` | `"S"` = 2nd degree, `"F"` = 1st, `"O"` = 3rd+ |
| `maxResults` | number | — | `20` | Max leads to return |

**Output**: JSON array of leads with `name`, `headline`, `profileUrl`, `buttonText`, `location`

**How it filters** (from your screenshot):
- Button says **"Установить контакт"** or **"Connect"** → ✅ **included** (this is your target)
- Button says **"Сообщение"** or **"Message"** → ❌ **excluded** (already connected)
- Button says **"На рассмотрении"** or **"Pending"** → ❌ **excluded** (already sent)

**Example**:
```
Use linkedin_search_leads with keywords "CEO software company Ukraine" and maxResults 10
```

---

### 2. `linkedin_get_profile`

**Purpose**: Visit a LinkedIn profile and extract structured data.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `profileUrl` | string | ✅ | Full LinkedIn profile URL |

**Output**: `name`, `headline`, `company`, `role`, `location`, `about` (first 300 chars), `connectionStatus`, `hasRecentActivity`

**Example**:
```
Use linkedin_get_profile with profileUrl "https://www.linkedin.com/in/leonidpolupan/"
```

---

### 3. `linkedin_get_recent_posts`

**Purpose**: Read a person's recent LinkedIn posts (for generating contextual comments).

**Input**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `profileUrl` | string | ✅ | — | Profile URL (activity page derived automatically) |
| `maxPosts` | number | — | `3` | How many posts to return |

**Output**: Array of posts with `postText` (first 500 chars), `postUrl`, `timeAgo`, `likes`, `comments`, `isOriginal`

**Example**:
```
Use linkedin_get_recent_posts with profileUrl "https://www.linkedin.com/in/leonidpolupan/" and maxPosts 3
```

---

### 4. `linkedin_like_post`

**Purpose**: Like a LinkedIn post. Skips if already liked.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `postUrl` | string | ✅ | Full post URL |

**Example**:
```
Use linkedin_like_post with postUrl "https://www.linkedin.com/feed/update/urn:li:activity:7295000000000/"
```

---

### 5. `linkedin_comment_on_post`

**Purpose**: Post a comment on a LinkedIn post.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `postUrl` | string | ✅ | Full post URL |
| `comment` | string | ✅ | The comment text (2-4 sentences, value-adding) |

**Comment quality rules** (from the workflow):
- ❌ "Great post!" / "Thanks for sharing!" / "Totally agree!"
- ❌ "I help companies with AI..." (no pitching)
- ✅ "This resonates — we saw the same pattern when optimizing reconciliation pipelines. The bottleneck was never the technology, it was the handoff between teams."
- ✅ "The 'automate everything' trap is real. In my experience, the highest ROI comes from automating the verification layer, not the execution."

**Example**:
```
Use linkedin_comment_on_post with postUrl "https://www.linkedin.com/feed/update/..." and comment "Interesting take on scaling engineering teams. We found that the real bottleneck wasn't hiring speed but onboarding quality — mapping decision flows before adding headcount cut our ramp-up time by 40%."
```

---

### 6. `linkedin_send_connection`

**Purpose**: Send a connection request WITHOUT a note.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `profileUrl` | string | ✅ | Profile URL to connect with |

**How it works internally**:
1. **Variant A**: Clicks visible "Установить контакт" / "Connect" button on profile
2. **Variant B**: If not visible, clicks "..." (three-dot menu) → finds "Установить контакт" / "Connect" in dropdown
3. When modal appears → clicks "Отправить без заметки" / "Send without a note"
4. Verifies status changed to "На рассмотрении" / "Pending"

**Example**:
```
Use linkedin_send_connection with profileUrl "https://www.linkedin.com/in/leonidpolupan/"
```

---

### 7. `linkedin_check_invitations`

**Purpose**: Check the sent invitations page for verification after a session.

**Input**: None

**Output**: `pendingCount`, `recentSent[]` (name + sent info)

**Example**:
```
Use linkedin_check_invitations
```

---

## How to Run Daily Outreach

### Option A: Tell the agent directly

Open Antigravity chat and say:

> "Run the linkedin outreach workflow. Search for CEO/CTO/Founder in IT outsourcing in Ukraine. Goal: 20 connections today."

The agent will:
1. Read the `linkedin-outreach.md` workflow
2. Call `linkedin_search_leads` to find leads
3. For each lead: get profile → get posts → like → generate comment → comment → send connection
4. Log each lead to `outreach/crm.json`
5. After 20 connections → verify with `linkedin_check_invitations` → generate report

### Option B: Step by step (for testing)

You can call individual tools to test:

1. **Test search**: "Use linkedin_search_leads with keywords 'CEO software Ukraine' and maxResults 5"
2. **Test profile**: "Use linkedin_get_profile with profileUrl [one of the URLs from search]"
3. **Test posts**: "Use linkedin_get_recent_posts with profileUrl [same URL]"
4. **Test like**: "Use linkedin_like_post with postUrl [one of the post URLs]"

This lets you verify each tool works before running the full workflow.

---

## Configuration

### Environment Variables (set in MCP settings)

| Variable | Default | Description |
|----------|---------|-------------|
| `CHROME_PATH` | `/usr/bin/google-chrome` | Path to Chrome binary |
| `CHROME_USER_DATA_DIR` | `/home/worker/.config/google-chrome` | Chrome user data directory |
| `CHROME_PROFILE` | `Profile 2` | Which Chrome profile to use |

### Timing (hardcoded in `src/utils/config.ts`)

| Setting | Value | Description |
|---------|-------|-------------|
| `minDelay` | 3000ms | Minimum delay between actions |
| `maxDelay` | 8000ms | Maximum delay between actions |
| `typeDelay` | 50ms | Delay between keystrokes (human-like typing) |
| `navigationTimeout` | 30000ms | Max wait for page loads |

### Changing Chrome Profile

If your LinkedIn is logged in on a different profile (e.g., Default or Profile 1), update the MCP settings:

```json
"env": {
  "CHROME_PROFILE": "Default"
}
```

Then restart Antigravity.

---

## Troubleshooting

### "Not logged into LinkedIn"

**Cause**: Chrome Profile 2 doesn't have an active LinkedIn session.
**Fix**: Open Chrome with Profile 2 manually, log into LinkedIn, then restart the MCP server.

```bash
google-chrome --profile-directory="Profile 2" https://www.linkedin.com
```

### "CAPTCHA detected"

**Cause**: LinkedIn is showing a security verification.
**Fix**: The tool stops automatically. Open Chrome, solve the CAPTCHA manually, then retry.

### MCP server not appearing in Antigravity

**Cause**: Settings file not read yet.
**Fix**: Restart Antigravity. Check that the settings file path is correct:
```
~/.config/Antigravity/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

### "Browser disconnected" errors

**Cause**: Chrome was already open with Profile 2 when the MCP server tried to launch.
**Fix**: Close all Chrome windows using Profile 2 before starting the MCP server. Only one process can use a Chrome profile at a time.

### Build errors after code changes

```bash
cd /home/worker/repos/LE/mcp-servers/linkedin-server
npm run build
```

Then restart Antigravity to pick up the new build.

---

## Cost Comparison

| Approach | LLM calls/session | Vision needed | Cost/session | Model options |
|----------|-------------------|---------------|-------------|---------------|
| `browser_action` (old) | ~200 screenshots | ✅ Yes | $2-5 | Claude, GPT-4V, Gemini Pro only |
| **MCP Server (new)** | ~80 text-only | ❌ No | $0-0.10 | Gemini Flash, Groq free, Ollama, any model |

**Savings**: ~95% cost reduction per session.

---

## File Structure

```
mcp-servers/linkedin-server/
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── src/                      # Source code
│   ├── index.ts              # MCP server entry point (7 tools registered)
│   ├── browser/
│   │   ├── browser-manager.ts  # Chrome launch/reuse with Profile 2
│   │   ├── anti-detect.ts      # Human-like delays, stealth, CAPTCHA detection
│   │   └── selectors.ts        # All LinkedIn CSS selectors (centralized)
│   ├── tools/
│   │   ├── search.ts           # linkedin_search_leads
│   │   ├── profile.ts          # linkedin_get_profile
│   │   ├── posts.ts            # linkedin_get_recent_posts
│   │   ├── engage.ts           # linkedin_like_post + linkedin_comment_on_post
│   │   ├── connect.ts          # linkedin_send_connection
│   │   └── invitations.ts      # linkedin_check_invitations
│   └── utils/
│       ├── config.ts           # Environment variable config
│       └── logger.ts           # Logging (stderr, keeps stdout clean for MCP)
└── build/                    # Compiled JavaScript (auto-generated)
```

---

## Updating LinkedIn Selectors

When LinkedIn changes their UI, you only need to update one file:

```
src/browser/selectors.ts
```

This file contains all CSS selectors and button text patterns for both Russian and English UI. After editing:

```bash
cd /home/worker/repos/LE/mcp-servers/linkedin-server
npm run build
# Restart Antigravity
```

---

## Security Notes

- The MCP server **never sees your LinkedIn password** — it uses Chrome's existing session cookies
- All credentials stay local in your Chrome profile directory
- The server runs locally via stdio — no network exposure
- Browser launches in **visible mode** (not headless) — you can always see what it's doing
