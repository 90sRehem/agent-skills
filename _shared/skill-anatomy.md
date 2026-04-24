# Skill Anatomy Template

All skills follow this 8-section structure for consistency, clarity, and discoverability.

## 1. Overview

**What it is:** A 1-2 sentence description of what this skill does, when to use it, and the user-facing outcome.

**Example:** "This skill specifies what to build by conducting scope detection, clarifying requirements, and producing an acceptance criteria checklist. Use it when you have a feature idea but need clarity on scope and requirements."

**Why:** Sets immediate context. Reader should understand purpose without reading further sections.

---

## 2. When to Use

**What it is:** Concrete triggering conditions — the situations where a developer should reach for this skill.

**Example:**
- You have a feature request but don't know if it's Quick, Medium, or Large
- You want to test that a feature meets its acceptance criteria
- You're onboarding and need to understand the dev lifecycle
- You're reviewing a change and want structured quality feedback

**Why:** Prevents skill misuse. Clarifies when this skill is "the right tool" and when to use another skill instead.

---

## 3. Boundaries: Always / Ask First / Never

**What it is:** The hard rules for what this skill does and does NOT do.

**Format:**
- **Always:** These actions MUST happen every time the skill runs. Non-negotiable.
- **Ask First:** These actions MAY happen, but require explicit user permission or a clear decision gate.
- **Never:** These actions are explicitly forbidden. Violating this indicates a fundamental misuse of the skill.

**Example:**
- Always: Load context from docs/project.md
- Ask First: Modify an existing spec.md
- Never: Implement code during specification

**Why:** Boundaries prevent scope creep and unintended side effects. They form the social contract between user and skill.

---

## 4. Core Process

**What it is:** The step-by-step algorithm the skill executes. Numbered list, 5-10 steps, each specific enough to implement.

**Example:**
1. Load context from docs/project.md and docs/conventions.md
2. Detect scope (Quick/Medium/Large) using scoring matrix
3. Surface any assumptions with user
4. Ask clarifying questions if spec is ambiguous
5. Write acceptance criteria matching scope template
6. Run verification checklist
7. Produce spec.md

**Why:** The "how" of the skill. Clear steps enable reproducibility and enable skill to be handed off or delegated.

---

## 5. Common Rationalizations → Rebuttal

**What it is:** A table of mental shortcuts or excuses developers often use to skip steps in this skill, paired with a rebuttal.

**Format:** 2-column table: **Excuse** | **Rebuttal**

**Example:**

| Excuse | Rebuttal |
|--------|----------|
| "I'll just quickly design it too" | Stop. /plan handles design. Specification is decision-free. |
| "The spec is clear enough, skip clarification questions" | Unasked questions become wrong implementations. Ask now, save time later. |
| "I'll skip scope detection for small tasks" | Scope sets expectations — skipping creates surprises. Always detect. |

**Why:** Rationalizations are how humans (and LLMs) accidentally cut corners. Naming them builds awareness. 3+ entries expected.

---

## 6. Red Flags

**What it is:** Signs that something went wrong or the skill is being misused. One bullet per flag.

**Example:**
- Specification doesn't reference any of the docs/ knowledge base (sign: context wasn't loaded)
- Acceptance criteria are written in vague language like "should be fast" or "user-friendly"
- Scope detection was skipped and scope was guessed instead
- Design decisions appear in the spec.md (sign: boundaries were violated)

**Why:** Early warning system. Flags catch problems before they cascade. Should prompt a stop/review.

---

## 7. Verification: Exit Criteria Checklist

**What it is:** A bulleted checklist of conditions that must be true for this skill's output to be considered "done" and correct.

**Example:**
- [ ] spec.md exists in .specs/features/<name>/
- [ ] Scope is one of: Quick, Medium, or Large
- [ ] At least 3 acceptance criteria present
- [ ] All AC reference user-visible behavior (not implementation details)
- [ ] Requirements traceability: every AC maps to a req ID
- [ ] No design decisions in the spec
- [ ] User has reviewed and approved

**Why:** Prevents premature or incomplete output. Clear exit criteria tell developer "you're done when these are true."

---

## 8. References

**What it is:** Bulleted list of related files, templates, or skills that provide supporting detail or are invoked by this skill.

**Example:**
- `spec-template.md` — template for writing spec.md
- `scope-detection.md` — scoring matrix for Quick/Medium/Large
- `/plan` — next command in lifecycle (reads spec.md, produces design.md + tasks.md)
- `docs/conventions.md` — project-specific conventions that affect spec

**Why:** Links the skill into the broader ecosystem. Tells user where to go for detail or what comes next.

---

## Style Guidance

### Length
- Keep total SKILL.md under 300 lines. Longer content goes in references/.
- Use Progressive Disclosure: skills reference details rather than embedding them.

### Tone
- Direct, imperative voice: "Always load context" not "context should be loaded"
- Assume user is competent but may be distracted or cutting corners
- Friendly but firm on boundaries

### Common Structure Across Skills
- Phase 1 skills focus on analysis and decision-making (Specification, Planning, Testing)
- Phase 2 skills focus on action and verification (Build, Code Review, Simplification)
- Phase 3 skills focus on closure (Shipping, Archival)

### Example Entry from Each Section
Here's what a minimal skill looks like:

```markdown
# Skill: Example Skill Name

## Overview
This skill does X, producing Y. Use it when Z.

## When to Use
- Situation A
- Situation B

## Boundaries
**Always:**
- Check requirement A

**Ask First:**
- Modify existing file X

**Never:**
- Change the database schema

## Core Process
1. Load context
2. Analyze requirement
3. Propose solution
4. Verify solution
5. Report findings

## Common Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "This is obviously correct" | Write proof. |

## Red Flags
- No evidence collected
- Assumption not surface

## Verification
- [ ] Output exists
- [ ] Verification step completed

## References
- `related-file.md`
```

---

**End of Skill Anatomy Template**

Use this structure for all 7 skills. Deviations should be minimal and intentional.
