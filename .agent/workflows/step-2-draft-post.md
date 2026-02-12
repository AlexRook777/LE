---
description: Take a post idea and produce a structured LinkedIn draft
---

# Draft Post Workflow

## Steps

1. Read `.gemini.md` to refresh post anatomy rules and tone/voice guide
2. Read `templates/post_templates.md` for basic post structures
3. Read `templates/competitor_pattern_templates.md` for viral patterns (Enemy Narrative, Diagnosis Listicle, Counter-Intuitive, Hard Truth, Street Smart)
4. **Read `my projects/project_insights_extraction.md`** to access:
   - Specific project details (PRD Assistant, Argus, OCR Microservice)
   - Quantified metrics for credibility (70-85% automation, 3-4 integrations/day, 95% confidence scores)
   - Technical differentiators (LangGraph, Langfuse, multi-provider orchestration)
   - Target audience personas with appropriate tone guidance
5. **Read `my projects/workflow_integration_guide.md`** for:
   - Template mapping to projects
   - Example drafts and structure guidance
   - Credibility signals to include
6. Read the idea file from `content pipeline/1_ideas/`
7. **If the idea references a source project** (PRD Assistant/Argus/OCR), review the relevant sections in `project_insights_extraction.md` for:
   - Specific technical details and architecture
   - Quantified business impact metrics
   - Key talking points and differentiators
8. Select the best matching template/pattern based on the idea's category and goal
9. Start writing the draft in this order:
   - **Value payoff first** — what's the core insight or lesson?
   - **Story / body** — a quick personal moment or real example making it relatable
     - **Use project-specific details** when applicable (actual workflows, architectures, challenges)
     - **Include quantified metrics** to add credibility (e.g., "70-85% automation", "3-4 integrations/day")
   - **Hook last** — one bold, clear line that stops the scroll
     - **Reference content hooks library** from project insights when applicable
   - **CTA** — a soft call to action (question, invitation to discuss)
   - **Hashtags** — 5-10 relevant hashtags after a separator
10. Apply style rules:
    - Maximum ≤ 3000 symbols (LinkedIn limit), recommended 800–1500 for engagement
    - Emojis: sparingly, for visual breaks only
    - No fluff — if a sentence doesn't add value, cut it
    - Tone: direct, outcome-focused, data-backed, accessible
    - **Match tone to target audience** (from project insights personas)
11. **Add technical credibility signals** when relevant:
    - Specific tech stack (LangGraph, Pydantic V2, Langfuse)
    - Architecture patterns (multi-agent orchestration, async-first)
    - Quality practices (validation layers, QA loops, audit trails)
12. Save the draft to `content pipeline/2_drafts/` with the same filename as the idea
13. If a visual would help the post, note the image concept in the draft file under a `## Visual` section
    - **Reference visual content ideas** from project insights (architecture diagrams, before/after comparisons)
14. Present the draft to the user for feedback

