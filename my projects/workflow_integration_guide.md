# Integration Guide: Using Project Insights in Content Workflows

> **Quick Reference**: How to use the project insights extraction with your existing `/step-1-generate-ideas` and `/step-2-draft-post` workflows.

---

## 🔗 Workflow Integration Points

### For `/step-1-generate-ideas`

When generating content ideas, reference these sections from `project_insights_extraction.md`:

1. **Key Themes for LinkedIn Content** (5 themes)
   - Use as primary topic categories
   - Each theme has 3-4 ready-to-use content angles

2. **Story Arcs for LinkedIn Posts** (4 arcs)
   - Transformation Story
   - Technical Deep Dive
   - Lesson Learned
   - How-To Guide

3. **Content Hooks Library**
   - Problem-focused hooks
   - Metric-focused hooks
   - Contrarian hooks
   - How-to hooks

**Example Idea Generation Prompt**:
```
Generate 5 LinkedIn post ideas using:
- Theme: "AI Architecture & LLMOps"
- Arc: "Technical Deep Dive"
- Target Audience: AI Engineers
- Hook Style: Contrarian

Reference the multi-provider strategy and LLMOps integration from the project insights.
```

---

### For `/step-2-draft-post`

When drafting posts, reference these sections:

1. **Metrics Bank for Posts**
   - Productivity metrics (3-4 integrations/day, 70-85% automation)
   - Quality metrics (95% confidence, self-correcting QA)
   - Technical metrics (multi-language, multi-provider)

2. **Key Differentiators to Emphasize**
   - Technical credibility signals
   - Business acumen points
   - Process innovation highlights

3. **Target Audience Personas**
   - Adjust tone and focus based on persona
   - Use appropriate pain points and content focus

**Example Draft Prompt**:
```
Draft a LinkedIn post using:
- Project: Argus (Financial Reconciliation)
- Template: Problem → Solution → Result
- Audience: Business Leaders
- Key Metric: 70-85% automation
- Hook: "We were drowning in 100 support tickets daily until we built this"

Include specific technical details from the Argus workflow section.
```

---

## 📋 Content Template Mapping

### Template 1: Problem → Solution → Result

**Best Project Sources**:
- **Argus**: Support ticket automation (100 → 15 tickets)
- **PRD Assistant**: Integration speed (1/week → 4/day)
- **OCR**: Document processing scalability

**Key Sections to Reference**:
- Theme 3: Business Impact & ROI
- Metrics Bank: Productivity metrics
- Story Arc 1: Transformation Story

---

### Template 2: Contrarian Take + Proof

**Best Project Sources**:
- Multi-model orchestration (all projects)
- Spec-before-code (PRD Assistant)
- LLMOps practices (all projects)

**Key Sections to Reference**:
- Theme 2: AI Architecture & LLMOps
- Content Hooks: Contrarian hooks
- Key Differentiators: Technical credibility

---

### Template 3: Step-by-Step Framework

**Best Project Sources**:
- SIP methodology (PRD Assistant)
- Validation layers (all projects)
- Workflow design (PRD Assistant)

**Key Sections to Reference**:
- Theme 1: Methodology & Process Innovation
- Theme 5: Quality & Reliability
- Story Arc 4: How-To Guide

---

### Template 4: Personal Story + Lesson

**Best Project Sources**:
- Migration to modern stack (LangGraph)
- Implementing QA loops (Argus)
- Scaling integrations (PRD Assistant)

**Key Sections to Reference**:
- Story Arc 3: Lesson Learned
- Theme 4: Developer Experience & Tooling
- Content Hooks: Problem-focused hooks

---

### Template 5: Metrics + Behind-the-Scenes

**Best Project Sources**:
- 70-85% automation (Argus)
- 3-4 integrations/day (PRD Assistant)
- Cost optimization (OCR)

**Key Sections to Reference**:
- Metrics Bank (all sections)
- Theme 3: Business Impact & ROI
- Visual Content Ideas: Architecture diagrams

---

## 🎯 Quick Reference: Project → Content Mapping

### PRD Assistant

**Best For**:
- Process innovation posts
- Developer experience content
- Productivity transformation stories
- Methodology deep dives

**Key Talking Points**:
- Spec-Integrated PRD (SIP) methodology
- 3-4 integrations per day
- Jupyter-style workflow execution
- Two-layer documentation system

**Target Audiences**: Process Optimizers, AI Engineers, Technical Decision Makers

---

### Argus (Financial Reconciliation)

**Best For**:
- Business impact posts
- Automation ROI stories
- AI reliability content
- Multi-agent architecture

**Key Talking Points**:
- 70-85% automation rate
- Self-correcting QA loops
- Complete audit trails
- Multi-agent orchestration

**Target Audiences**: Business Leaders, Technical Decision Makers

---

### OCR Microservice

**Best For**:
- Technical architecture posts
- Scalability stories
- Multi-provider orchestration
- Global product content

**Key Talking Points**:
- Smart Router for cost optimization
- 12+ language support
- Confidence scoring system
- Format-agnostic processing

**Target Audiences**: AI Engineers, Technical Decision Makers

---

## 💡 Example Content Ideas (Ready to Use)

### Idea 1: Transformation Story
**Project**: Argus  
**Hook**: "We were drowning in 100 support tickets daily until we built this"  
**Arc**: Transformation Story  
**Audience**: Business Leaders  
**Key Metric**: 70-85% automation  

### Idea 2: Technical Deep Dive
**Project**: All Projects  
**Hook**: "Stop using one AI model. Here's why you need three."  
**Arc**: Technical Deep Dive  
**Audience**: AI Engineers  
**Key Point**: Multi-provider orchestration with dynamic routing  

### Idea 3: How-To Guide
**Project**: PRD Assistant  
**Hook**: "How we went from 1 integration/week to 4/day without sacrificing quality"  
**Arc**: How-To Guide  
**Audience**: Process Optimizers  
**Framework**: SIP methodology (5 steps)  

### Idea 4: Lesson Learned
**Project**: All Projects  
**Hook**: "We hardcoded our AI prompts and regretted it"  
**Arc**: Lesson Learned  
**Audience**: AI Engineers  
**Solution**: Langfuse-managed prompts with versioning  

### Idea 5: Metrics + Behind-the-Scenes
**Project**: OCR Microservice  
**Hook**: "We process receipts in 12 languages. Here's the architecture"  
**Arc**: Metrics + Behind-the-Scenes  
**Audience**: Technical Decision Makers  
**Visual**: Architecture diagram (Upload → Queue → Smart Router → Validation)  

---

## 🔄 Workflow Enhancement Suggestions

### For `/step-1-generate-ideas`

**Add Context Parameter**:
```
When generating ideas, specify:
- Source project (PRD Assistant / Argus / OCR)
- Target audience persona
- Preferred content template
- Key metric to highlight
```

**Example Enhanced Prompt**:
```
Generate 3 LinkedIn post ideas:
- Source: Argus project
- Audience: Business Leaders
- Template: Problem → Solution → Result
- Metric: 70-85% automation
- Reference: Theme 3 (Business Impact & ROI)
```

---

### For `/step-2-draft-post`

**Add Credibility Signals**:
```
When drafting, include:
- Specific technical stack (from Key Differentiators)
- Quantified metrics (from Metrics Bank)
- Audience-appropriate tone (from Target Personas)
- Visual content suggestion (from Visual Content Ideas)
```

**Example Enhanced Prompt**:
```
Draft a LinkedIn post:
- Idea: "How we automated 85% of customer support"
- Project: Argus
- Include: Multi-agent orchestration workflow
- Metrics: 70-85% automation, complete audit trails
- Tone: Strategic, outcome-focused (Business Leaders)
- Visual: Architecture diagram (Gateway → B2C/B2B → QA → Output)
```

---

## ✅ Checklist for Using Project Insights

### Before Generating Ideas
- [ ] Review target audience persona
- [ ] Select primary theme (1 of 5)
- [ ] Choose story arc (1 of 4)
- [ ] Pick content hook style
- [ ] Identify source project(s)

### Before Drafting Post
- [ ] Confirm content template
- [ ] Select key metrics to include
- [ ] Identify technical differentiators
- [ ] Plan visual content (if applicable)
- [ ] Verify tone matches audience

### After Drafting Post
- [ ] Verify metrics are accurate
- [ ] Check technical credibility signals
- [ ] Confirm hook is compelling
- [ ] Ensure CTA is clear
- [ ] Review for audience appropriateness

---

## 📚 Quick Links to Key Sections

**For Idea Generation**:
- [Key Themes](#key-themes-for-linkedin-content)
- [Story Arcs](#story-arcs-for-linkedin-posts)
- [Content Hooks Library](#content-hooks-library)

**For Drafting**:
- [Metrics Bank](#metrics-bank-for-posts)
- [Key Differentiators](#key-differentiators-to-emphasize)
- [Target Audience Personas](#target-audience-personas)

**For Visual Content**:
- [Visual Content Ideas](#visual-content-ideas)
- [Architecture Diagrams](#architecture-diagrams)
- [Before/After Comparisons](#beforeafter-comparisons)
