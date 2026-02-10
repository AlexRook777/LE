# LinkedIn Content Factory

A semi-autonomous content generation pipeline for LinkedIn lead generation.

---

## Vision

This project is a **content factory** — a structured system for creating LinkedIn posts that attract potential clients, invite meaningful conversations, and ultimately lead to project-based agreements.

The system starts under full human supervision and progressively moves toward autonomous operation through custom workflows, skills, and AI-assisted research.

---

## My Expertise

I help businesses **find, analyze, and eliminate process bottlenecks** using modern architecture and AI engineering.

**What I do:**
- Identify the hidden bottleneck that's constraining business growth
- Design a solution that combines AI tools with human expertise
- Implement the solution relentlessly until we reach the goal

**The pattern:** Every business has processes that seem like "just how things work" but are actually the single biggest constraint on growth. I find them, fix them, and unlock the next level of scale.

---

## Goals & Outcomes

| Goal | Outcome |
|------|---------|
| **Attract leads** | Posts that make decision-makers stop scrolling and think "I need to talk to this person" |
| **Demonstrate expertise** | Real case studies, practical insights, and opinionated takes on AI + business process automation |
| **Invite conversations** | Every post moves the reader from awareness → trust → action |
| **Build authority** | Consistent, high-quality content that positions me as the go-to expert in AI-augmented process optimization |
| **Generate inbound** | Over time, shift from outbound to inbound lead flow |

---

## Content Strategy

Based on the [LinkedIn Content Playbook](linkedin%20methodology/LinkedIn%20Content%20Playbook.md) and [Content Strategy](linkedin%20methodology/Content%20Strategy.md).

### The Formula

**Category × Perspective × Topic = Post**

- **Categories:** Educate (primary), Convince, Inspire, Entertain
- **Perspectives:** Expert Advice, General Advice, Personal Story
- **Topics:** Anchored to AI, automation, business process optimization

### Examples

| Category | Perspective | Example |
|----------|-------------|---------|
| Educate + Expert | Niche | "How to fine-tune an agentic pipeline to handle 5x more integrations per week" |
| Inspire + Personal | Story | "I automated a client's bottleneck and saved them 20 hours/week — here's what I learned" |
| Convince + Expert | Case Study | "We were stuck at 1 integration per week. Here's how AI changed that." |
| Entertain + General | Broad | "5 types of process bottlenecks every business has (and how to spot them)" |

### Posting Cadence

- **Frequency:** 2-3 posts per week
- **Max length:** ≤ 3000 symbols (LinkedIn limit), recommended 800–1500 for engagement
- **No cannibalization:** Never post within 17 hours of a previous post
- **Optimal timing:** Mornings 8:00-9:00 AM or afternoons 5:00-6:00 PM

---

## Project Structure

```
LE/
├── .gemini.md                    # Agent rules & project context
├── README.md                     # This file
├── linkedin methodology/         # Reference playbooks (read-only)
│   ├── Content Strategy.md
│   ├── LinkedIn Content Playbook.md
│   ├── LinkedIn Playbook.md
│   └── LinkedIn Social Selling Playbook.md
├── draft articles and ideas/     # Ideas and early-stage drafts
├── content pipeline/             # Active content pipeline
│   ├── 1_ideas/                  # Raw ideas
│   ├── 2_drafts/                 # Work-in-progress posts
│   ├── 3_ready_for_review/       # Ready for final approval
│   ├── 4_scheduled/              # Approved with planned dates
│   └── 5_published/              # Published posts (learning corpus)
├── research/                     # Content research & insights
│   ├── trending_topics.md        # Trending AI / business topics
│   ├── competitor_profiles.md    # 10k+ follower profile analysis
│   ├── viral_posts.md            # Viral post pattern breakdowns
│   └── pain_points.md            # Pain points from conversations
├── templates/                    # Reusable templates
│   ├── post_templates.md         # Proven post structures
│   └── image_prompts.md          # Prompts for post visuals
├── analytics/                    # Performance tracking
│   ├── post_performance.md       # Per-post metrics
│   └── winning_posts.md          # High-performers with analysis
└── .agent/workflows/             # Agent workflows
    ├── generate-ideas.md         # Research → ideas
    ├── draft-post.md             # Idea → draft
    ├── refine-post.md            # Draft → polished post
    └── research-competitors.md   # Competitor analysis
```

---

## Workflow

### Pipeline Stages

```
Research → Ideate → Draft → Refine → Approve → Publish → Analyze
```

1. **Research** — Scan LinkedIn for trending topics, review competitor profiles, collect pain points from real conversations
2. **Ideate** — Generate post ideas using the 3-axis formula, check against published articles to avoid duplication
3. **Draft** — Write the post starting with the value payoff; write the hook last (≤3000 symbols max)
4. **Refine** — Verify length (≤3000 symbols), tone, hashtags, and visuals
5. **Approve** — Human reviews and approves the final post
6. **Publish** — Schedule or publish directly on LinkedIn
7. **Analyze** — Track performance, identify winning patterns, feed insights back into research

### Agent Workflows

Workflows in `.agent/workflows/` automate each stage:
- `/generate-ideas` — Research and produce a list of post ideas
- `/draft-post` — Take an idea and produce a structured draft
- `/refine-post` — Review and polish a draft post
- `/research-competitors` — Analyze profiles and viral posts for inspiration

---

## Autonomy Roadmap

| Phase | Agent | Human |
|-------|-------|-------|
| **Phase 1** (Now) | Research, suggest ideas, draft posts | Review everything, approve all |
| **Phase 2** | Generate and refine posts, manage pipeline | Review finals, approve scheduling |
| **Phase 3** | Full pipeline management & trend monitoring | Spot-check, strategic direction |

---

## Key References

- [Content Strategy](linkedin%20methodology/Content%20Strategy.md) — High-level content principles
- [LinkedIn Content Playbook](linkedin%20methodology/LinkedIn%20Content%20Playbook.md) — Post creation rules and templates
- [LinkedIn Playbook](linkedin%20methodology/LinkedIn%20Playbook.md) — Profile optimization and network building
- [LinkedIn Social Selling Playbook](linkedin%20methodology/LinkedIn%20Social%20Selling%20Playbook.md) — Outreach and sales strategy
