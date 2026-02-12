---
description: Reusable skill for managing the outreach CRM (read, write, update, report)
---

# CRM Management Skill

Shared skill for working with the outreach CRM. Used by any workflow that needs to read, write, or analyze lead data.

---

## CRM Files

| File | Format | Purpose |
|------|--------|---------|
| `outreach/crm.json` | Flat JSON array | Contact database — one object per lead |
| `outreach/crm_trending.json` | JSON object with `daily_metrics` array | Daily performance metrics & trend analysis |

---

## Contact Schema — outreach/crm.json

The file is a flat JSON array `[]`. Each entry represents one lead:

```json
{
  "id": 1,
  "name": "Larisa Khachidze",
  "company": "Gremcy",
  "role": "Founder and CEO",
  "source": "LinkedIn",
  "status": "Connected",
  "lastAction": "Accepted + Trojan Horse DM Sent (Feb 12)",
  "score": 4,
  "dmDraft": "Hey Larisa, thanks for the connection. I'm finishing a technical report on 'High-Margin AI Service Extensions for Software Agencies.' Since you lead Gremcy, I'd love to get your perspective on whether your clients are asking for custom LLM integration yet. Happy to share my 'Agency AI Integration Framework' in exchange for your feedback."
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Auto-incrementing (next = max existing id + 1, or 1 if empty) |
| `name` | string | Full name from profile |
| `company` | string | Current company name |
| `role` | string | Job title / role as shown on profile |
| `source` | string | Where the lead came from (`"LinkedIn"`, `"Referral"`, `"Inbound"`, etc.) |
| `status` | string | Current pipeline stage (see Status Progression below) |
| `lastAction` | string | Human-readable description of the most recent action with date |
| `score` | integer | Lead quality score 1-5 (see Lead Scoring below) |
| `dmDraft` | string | Pre-written personalized DM for when they accept / next follow-up |

### Status Progression

```
"Request Sent" → "Connected" → "DM Sent" → "Replied" → "Meeting Booked" → "Converted" / "Not Interested"
```

| Status | Meaning |
|--------|---------|
| `Request Sent` | Connection request sent, waiting for acceptance |
| `Connected` | They accepted the connection |
| `DM Sent` | Trojan Horse DM sent after connection accepted |
| `Replied` | They replied to the DM |
| `Meeting Booked` | Coffee chat / call scheduled |
| `Converted` | Became a client, partner, or active lead |
| `Not Interested` | Declined, no response after follow-ups, or not a fit |

### Lead Scoring (1-5)

| Score | Criteria |
|-------|----------|
| 5 | Perfect fit: C-level at IT outsourcing company, active poster, engaged with our content |
| 4 | Strong fit: Decision-maker at relevant company, some activity |
| 3 | Good fit: Right role or right company, limited recent activity |
| 2 | Possible fit: Adjacent role or industry, worth a try |
| 1 | Low fit: Marginal relevance, included to fill daily quota |

---

## Trending Schema — outreach/crm_trending.json

```json
{
  "daily_metrics": [
    {
      "date": "2026-02-12",
      "session_date_analyzed": "2026-02-11",
      "sent": 20,
      "accepted": 4,
      "conversion_rate": 20.0,
      "role_breakdown": {
        "CEO": { "sent": 8, "accepted": 2 },
        "CTO": { "sent": 5, "accepted": 1 },
        "Founder": { "sent": 4, "accepted": 1 }
      },
      "insights": "CTOs accepting faster than CEOs. Founders from Kyiv have higher rate."
    }
  ]
}
```

---

## CRM Operations

### Add a Contact

1. Read `outreach/crm.json`
2. Determine next `id` (max existing id + 1, or 1 if empty array)
3. Assess lead quality → assign `score` (1-5)
4. Generate personalized `dmDraft` (see DM Draft Template below)
5. Create the contact object with all fields
6. Append to the array
7. Write the updated array back to `outreach/crm.json`

### Update a Contact

1. Read `outreach/crm.json`
2. Find the contact by `id` or `name`
3. Update `status` and `lastAction` (always include date in lastAction)
4. Optionally update `score`, `dmDraft`, or other fields
5. Write the updated array back

### Check for Duplicates

Before adding any contact, check if they already exist:
- Match by `name` (case-insensitive)
- If the entry has a LinkedIn URL in `lastAction` or `dmDraft`, match by URL too
- If duplicate found → skip, do not add again

### Query Contacts by Status

To get all contacts in a specific stage:
- Read `outreach/crm.json`
- Filter array where `status` matches the target value
- Return the filtered list

### Count Contacts by Role

- Read `outreach/crm.json`
- Group by `role` field
- Count entries in each group
- Return breakdown: `{ "CEO": 12, "CTO": 8, "Founder": 5, ... }`

---

## DM Draft Template

When creating a `dmDraft` for a new contact, personalize using this "Trojan Horse" template:

> "Hey {name}, thanks for the connection. I'm finishing a technical report on '{relevant topic}.' Since you lead {company}, I'd love to get your perspective on {specific question related to their role}. Happy to share my '{resource name}' in exchange for your feedback."

### Personalization Rules

- **{relevant topic}** — Vary based on their industry/role:
  - For CEOs/Founders: "High-Margin AI Service Extensions for Software Agencies"
  - For CTOs: "AI-Augmented Development Pipelines for Outsourcing Teams"
  - For COOs: "Process Bottleneck Elimination Using AI Automation"
  - For CMOs: "AI-Driven Lead Generation for Tech Companies"
- **{specific question}** — Connect to their likely pain point:
  - "whether your clients are asking for custom LLM integration yet"
  - "how your team handles the integration bottleneck at scale"
  - "what process consumes the most manual hours in your delivery pipeline"
- **{resource name}** — Offer something concrete:
  - "Agency AI Integration Framework"
  - "Process Automation ROI Calculator"
  - "AI Services Expansion Playbook"

---

## Performance Reporting

### Generate Funnel Report

1. Read `outreach/crm.json`
2. Count entries by `status`:
   - Request Sent (pending)
   - Connected (accepted)
   - DM Sent
   - Replied
   - Meeting Booked
   - Converted
3. Present as funnel:
   ```
   📊 CRM FUNNEL REPORT
   ─────────────────────────────
   Request Sent:    45
   Connected:       12  (26.7% acceptance)
   DM Sent:          8
   Replied:          3
   Meeting Booked:   1
   Converted:        0
   ─────────────────────────────
   Total Leads:     45
   ```

### Log Daily Metrics

1. Read `outreach/crm_trending.json`
2. Append to `daily_metrics`:
   ```json
   {
     "date": "YYYY-MM-DD",
     "session_date_analyzed": "date of the session being analyzed",
     "sent": N,
     "accepted": N,
     "conversion_rate": N.N,
     "role_breakdown": { ... },
     "insights": "Brief pattern observation"
   }
   ```
3. Write updated file back

### Analyze Trends

When asked to analyze outreach performance:
1. Read `outreach/crm_trending.json`
2. Compare metrics across days:
   - Is acceptance rate improving or declining?
   - Which roles have highest acceptance?
   - What day-of-week performs best?
3. Present insights and recommendations

---

## Usage from Other Workflows

This skill can be referenced by any workflow that needs CRM access:

- **`/linkedin-outreach`** — Adds contacts, updates statuses, logs daily metrics
- **`/dm-followup`** (future) — Reads contacts with `status: "Connected"`, sends DMs, updates to `"DM Sent"`
- **`/outreach-report`** (future) — Generates funnel report and trend analysis
- **`/research-competitors`** — Could log interesting profiles found during research

To use: reference this skill and follow the operations defined above.
