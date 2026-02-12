---
description: LinkedIn outreach performance analytics and reporting
---

# LinkedIn Analytic — Performance Reporting Workflow

Analyzes LinkedIn outreach performance, tracks conversion rates, and generates insights from CRM data and LinkedIn activity.

---

## Purpose

This workflow handles all analytics and reporting for LinkedIn outreach:
- Previous day performance analysis
- Acceptance rate tracking
- Session completion reports
- Trend analysis over time

---

## Prerequisites

- CRM files exist at `outreach/crm.json` and `outreach/crm_trending.json`
- User has LinkedIn session active (for verification checks)

---

## Workflow: Previous Day Performance Report

**Run this before starting daily outreach** to analyze results from the previous session.

### Actions:

1. **Read CRM data**:
   - Read `outreach/crm.json` (flat JSON array)
   - Filter contacts with `status: "Request Sent"` — these are pending connections
   - Count total sent from previous session (parse date from `lastAction` field)
   - Note the roles breakdown (how many CEOs, CTOs, Founders, etc.)

2. **Check acceptances on LinkedIn**:
   - Use `browser_action` → launch `https://www.linkedin.com/mynetwork/invite-connect/connections/`
   - Wait for page to load and read the connections list
   - Scroll through recent connections and identify any names that appear in `crm.json` with `status: "Request Sent"`
   - For each match, update the entry in `crm.json`:
     - Set `status` to `"Connected"`
     - Update `lastAction` to `"Accepted (Feb DD)"`

3. **Calculate and present metrics**:
   ```
   📊 PREVIOUS SESSION REPORT
   ─────────────────────────────
   Session Date:     YYYY-MM-DD
   Total Sent:       X
   Total Accepted:   Y  (from that session, verified today)
   Conversion Rate:  Y/X = Z%
   
   Role Breakdown:
     CEO:     X sent → Y accepted
     CTO:     X sent → Y accepted
     Founder: X sent → Y accepted
   
   Insights: [e.g., "CTOs are accepting faster than CEOs"]
   ```

4. **Log trending data**:
   - Read `outreach/crm_trending.json`
   - Append a new entry to `daily_metrics`:
     ```json
     {
       "date": "YYYY-MM-DD",
       "session_date_analyzed": "previous session date",
       "sent": X,
       "accepted": Y,
       "conversion_rate": Z,
       "role_breakdown": { "CEO": {"sent": N, "accepted": N}, ... },
       "insights": "Brief pattern observation"
     }
     ```
   - Write updated file back

5. **Present report to user** and wait for acknowledgment before proceeding.

---

## Workflow: Session Completion Report

**Run this after completing daily outreach** to verify results and generate summary.

### Actions:

1. **Check Sent Invitations**:
   - Use `browser_action` → navigate to `https://www.linkedin.com/mynetwork/invitation-manager/sent/`
   - Read the sent invitations list
   - Verify the count of today's sent invitations matches CRM records

2. **Check Connections Page**:
   - Navigate to `https://www.linkedin.com/mynetwork/invite-connect/connections/`
   - Read the connections page
   - Note any new acceptances from today (unlikely same-day, but possible)

3. **Generate Session Report**:
   ```
   ═══════════════════════════════════════
   SESSION COMPLETE — 2026-02-12
   ═══════════════════════════════════════
   
   Leads Processed:      20/20 ✓
   Connection Requests:  20 sent
   Posts Engaged:        15 (liked + commented)
   Posts Skipped:        5  (no recent activity)
   
   Role Distribution:
     CEO:     8
     CTO:     5
     Founder: 4
     COO:     2
     CMO:     1
   
   Top Companies Targeted:
     1. TechCorp — CEO + CTO
     2. SoftServe — Founder
     3. ...
   
   Engagement Highlights:
     • Commented on 15 posts about: scaling, AI adoption, team building
     • Most common topic: AI in business processes
   
   Next Steps:
     • Run this workflow again tomorrow
     • Check acceptances in 2-3 days
     • When connections accept → follow up with DM (see Social Selling Playbook)
   ═══════════════════════════════════════
   ```

4. **Close browser**: Use `browser_action` → close

---

## CRM Analytics Operations

> **All CRM operations follow the [CRM Management Skill](../skills/crm-management.md).**

This workflow uses the following CRM analytics operations:
- **Query by Status** — Filter contacts by status for funnel analysis
- **Update Contact Status** — When acceptances are detected
- **Log Daily Metrics** — Track performance over time in `crm_trending.json`
- **Generate Funnel Report** — Calculate conversion rates and insights
- **Trend Analysis** — Compare performance across multiple days

---

## Integration

This analytics workflow integrates with:
- **linkedin-outreach.md** — Run before/after the main outreach workflow
- **crm.json** — Read contact data and update statuses
- **crm_trending.json** — Store historical performance metrics

---

## References

- [LinkedIn Outreach Workflow](./linkedin-outreach.md) — Main lead generation workflow
- [CRM Management Skill](../skills/crm-management.md) — CRM operations and schema
- [LinkedIn Social Selling Playbook](../../linkedin%20methodology/LinkedIn%20Social%20Selling%20Playbook.md) — Strategy context
