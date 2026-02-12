# Competitor Pattern Templates

Post templates based on viral patterns from top LinkedIn performers (Shardul Mehta, David Pereira, Eric Partaker, Dr. Bart, Gregory Khropot, Andrii Mandrika).

See [research/competitor_profiles.md](../research/competitor_profiles.md) for full pattern analysis.

---

## Pattern 1: The "Enemy" Narrative

**Why it works:** Unites the audience against a common frustration.

**Best for:** Convince + Expert Advice

**Structure:**
```
[Name the enemy — the status quo that's broken]

[2-3 sentences describing how this enemy manifests in daily work]

The real problem: [The deeper issue behind the surface frustration]

Here's what actually works:
→ [Alternative approach 1]
→ [Alternative approach 2]
→ [Alternative approach 3]

[One sentence positioning your method as the liberation]

[CTA question inviting others to share their frustration]

---
#Hashtags
```

**Example (AI/Automation domain):**
```
---
title: "Stop Building 'AI Wrappers'"
category: "Convince"
perspective: "Expert Advice (Niche)"
topic: "AI Architecture"
template: "Enemy Narrative"
---

Most "AI solutions" are just ChatGPT with a login screen.

You've seen them. A fancy UI. A prompt template. Maybe some RAG bolted on. They call it "AI-powered." But when you ask "What happens when the API changes?" or "How do you prevent hallucinations?" — silence.

The real problem: We're treating AI like a feature, not a system.

Here's what actually works:
→ Contract-first architecture (typed schemas, not prompt strings)
→ Deterministic fallbacks (when the LLM fails, the system doesn't)
→ Observable pipelines (you can't fix what you can't see)

AI isn't magic. It's infrastructure. Build it like infrastructure.

Have you ever inherited an "AI solution" that was just a wrapper around someone else's API?

---
#AIEngineering #AIAgents #SoftwareArchitecture #TechLeadership #Automation
```

---

## Pattern 2: The "Diagnosis" Listicle

**Why it works:** People love to self-diagnose and validate their struggles.

**Best for:** Educate + General

**Structure:**
```
Are you suffering from [Problem]? Here are [X] signs.

[1 sentence intro — why this problem matters]

Sign 1: [Symptom with brief explanation]
Sign 2: [Symptom with brief explanation]
Sign 3: [Symptom with brief explanation]
Sign 4: [Symptom with brief explanation]
Sign 5: [Symptom with brief explanation]

[The impact — why this destroys value/career/productivity]

[CTA — "Which one hit hardest?" or "Share if you've seen this"]

---
#Hashtags
```

**Example (Process Automation domain):**
```
---
title: "Are You Stuck in a 'Manual Factory'?"
category: "Educate"
perspective: "General"
topic: "Process Optimization"
template: "Diagnosis Listicle"
---

Are your workflows stuck in the '90s? Here are 5 signs you need automation.

If you're spending more time managing work than doing work, this will sound familiar.

Sign 1: You have a "person who knows how to do X" (and they're a single point of failure)
Sign 2: Every new request requires a Slack thread to figure out "who owns this"
Sign 3: Your team celebrates "getting it done" instead of "making it repeatable"
Sign 4: You have 6 spreadsheets that need to be manually synced every week
Sign 5: The phrase "just this once" appears in every project kickoff

The impact: Your team isn't slow. Your process is. And every manual step is a tax on velocity.

Which one hit hardest?

---
#ProcessAutomation #BusinessProcessOptimization #Automation #OperationalExcellence #Productivity
```

---

## Pattern 3: The "Counter-Intuitive" Reality Check

**Why it works:** Cuts through the hype and signals high competence/insider knowledge.

**Best for:** Educate + Expert Advice (Niche)

**Structure:**
```
[Contrarian claim about a trending topic]

Everyone is talking about [Hype]. But here's what they're missing:

[The data/observation that contradicts the hype]

Why this happens:
[Root cause 1]
[Root cause 2]

The real solution: [What actually works, with specifics]

[One sentence takeaway]

[CTA question]

---
#Hashtags
```

**Example (AI Agents domain):**
```
---
title: "Why Your AI Agent Is Just a Fancy Chatbot"
category: "Educate"
perspective: "Expert Advice (Niche)"
topic: "AI Agent Architecture"
template: "Counter-Intuitive Reality Check"
---

AI Agents are the future. Except most of them can't actually *do* anything.

Everyone is talking about autonomous agents. But here's what they're missing: an agent without a contract is just a chatbot with delusions of grandeur.

I've reviewed dozens of "AI agent" implementations. 90% of them fail the same test: "What happens when the LLM hallucinates a field name?"

Why this happens:
→ Agents are built on natural language, not typed interfaces
→ There's no schema enforcement between the LLM and the tool
→ Errors are caught at runtime (in production), not compile time

The real solution: Contract-first agents. Define the interface (OpenAPI, Pydantic, JSON Schema). Bind the LLM to the contract. Now hallucinations become type errors, not production incidents.

Autonomy without constraints isn't intelligence. It's chaos.

Are you building agents or chatbots?

---
#AIAgents #AIEngineering #LangChain #SoftwareArchitecture #Automation #TechLeadership
```

---

## Pattern 4: The "Hard Truth" Pivot

**Why it works:** Differentiates you from the "fluff" posters. Signals seniority.

**Best for:** Convince + Expert Advice (Niche)

**Structure:**
```
Stop doing [Popular Soft Thing]. Start doing [Hard Technical Thing].

[2 sentences on why the "soft thing" is popular but ineffective]

Here's the hard truth: [The uncomfortable reality]

What to do instead:
1. [Concrete technical action 1]
2. [Concrete technical action 2]
3. [Concrete technical action 3]

[One sentence on the payoff]

[CTA question]

---
#Hashtags
```

**Example (AI Engineering domain):**
```
---
title: "Stop Prompt Engineering. Start Schema Engineering."
category: "Convince"
perspective: "Expert Advice (Niche)"
topic: "AI Engineering"
template: "Hard Truth Pivot"
---

Stop prompt engineering. Start schema engineering.

Everyone's obsessed with the perfect prompt. "Use this template." "Add 'think step by step.'" "Try chain-of-thought." It's duct tape on a structural problem.

Here's the hard truth: If your AI system depends on the exact wording of a prompt, you don't have a system. You have a magic spell.

What to do instead:
1. Define your data contracts (Pydantic models, JSON Schema, OpenAPI specs)
2. Use structured output modes (not "parse this JSON from markdown")
3. Validate at the boundary (fail fast on schema violations, not in production)

Prompts drift. Schemas don't.

Are you engineering or hoping?

---
#AIEngineering #SoftwareArchitecture #DataEngineering #TechLeadership #Automation
```

---

## Pattern 5: The "Street Smart" How-To

**Why it works:** Low barrier to entry, highly actionable.

**Best for:** Educate + Personal Story

**Structure:**
```
How I [achieved impressive result] with [surprisingly simple tool/method]

[1 sentence context — what was the problem?]

Most people would [expensive/complex approach].
I used [simple/scrappy approach].

Here's exactly how:

Step 1: [Specific action]
Step 2: [Specific action]
Step 3: [Specific action]

The result: [Measurable outcome]

[One sentence lesson — the principle behind the hack]

[CTA — "What's your scrappy automation win?"]

---
#Hashtags
```

**Example (Process Automation domain):**
```
---
title: "How I Automated Our Invoicing with 1 Python File"
category: "Educate"
perspective: "Personal Story"
topic: "Process Automation"
template: "Street Smart How-To"
---

How I automated our invoicing with 1 Python file (and 0 expensive SaaS tools).

We were manually generating 40+ invoices per month. Copy-paste from a spreadsheet into a Word template. 3 hours of soul-crushing work.

Most people would buy Zapier + QuickBooks + some invoice generator SaaS.
I used a 100-line Python script.

Here's exactly how:

Step 1: Export the billing data to CSV (we already had this)
Step 2: Write a Jinja2 template for the invoice HTML
Step 3: Use weasyprint to render HTML → PDF, loop through the CSV

The result: 40 invoices generated in 8 seconds. Zero monthly SaaS fees.

The lesson: Automation doesn't need to be fancy. It needs to work.

What's your scrappy automation win?

---
#ProcessAutomation #Python #Automation #Productivity #TechLeadership
```

---

## Quick Reference: Pattern → Use Case

| Pattern | Best For | Emotion Triggered | Example Topic |
|---------|----------|-------------------|---------------|
| **Enemy Narrative** | Challenging status quo | Anger → Relief | "Stop building AI wrappers" |
| **Diagnosis Listicle** | Validating pain points | Recognition → Validation | "5 signs you need automation" |
| **Counter-Intuitive** | Cutting through hype | Curiosity → Insight | "Why AI agents fail" |
| **Hard Truth Pivot** | Signaling expertise | Discomfort → Respect | "Stop prompt engineering" |
| **Street Smart How-To** | Showing practical wins | Inspiration → Action | "How I automated X with Y" |

---

## Mixing Patterns with Existing Templates

You can combine these patterns with the existing templates in `post_templates.md`:

- **Enemy Narrative** + **Problem → Solution → Result** = Powerful educational post
- **Diagnosis Listicle** + **Quick List / Tips** = High engagement post
- **Counter-Intuitive** + **Counterintuitive Insight** = Authority-building post
- **Hard Truth Pivot** + **Lesson Learned** = Credibility signal
- **Street Smart How-To** + **Before/After Transformation** = Viral case study

---

## Next Steps

1. Pick a pattern that matches your current content goal
2. Use your domain expertise (AI/Automation/Process Optimization) to fill in the specifics
3. Test with your audience and track engagement
4. Iterate based on what resonates

See [research/viral_posts.md](../research/viral_posts.md) for the original competitor post analyses.
