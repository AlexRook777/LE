---
description: Review and polish a LinkedIn post draft to publication-ready quality
---

# Refine Post Workflow

## Steps

1. Read `.gemini.md` to refresh post anatomy rules and tone/voice guide
2. Read the draft file from `content pipeline/2_drafts/`
3. Run this checklist against the draft:

### Hook Check
- [ ] Is the first line bold, clear, and scroll-stopping?
- [ ] Does it create curiosity, tension, or a bold claim?
- [ ] Would YOU stop scrolling to read this?

### Content Check
- [ ] Is there a clear value payoff (practical takeaway)?
- [ ] Is the story/example relatable and concrete?
- [ ] Are there real numbers, metrics, or specific details?
- [ ] Does the post match the claimed Category × Perspective?

### Tone Check
- [ ] Direct and confident (no hedging)?
- [ ] Outcome-focused (leads with results)?
- [ ] Accessible language (no jargon for jargon's sake)?
- [ ] Does it sound like a real person, not "AI slop"?

### Format Check
- [ ] Total length ≤ 3000 symbols (ideally 800–1500)?
- [ ] Emojis used sparingly and purposefully?
- [ ] CTA present and natural?
- [ ] 5-10 relevant hashtags after separator?

### Duplication Check
- [ ] Topic not already covered in `content pipeline/4_published/`?
- [ ] Angle is fresh compared to existing posts?

4. Make refinements based on the checklist
5. If an image is needed, generate it using the `generate_image` tool with a prompt from `templates/image_prompts.md`
6. Move the refined post to `content pipeline/3_review/`
7. Present the polished post to the user for final approval
