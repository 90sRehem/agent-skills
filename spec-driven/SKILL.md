# spec-driven

## Overview

This skill specifies what to build by conducting scope detection, clarifying requirements, and producing a spec with acceptance criteria. Use it when you have a feature idea but need clarity on scope, requirements, and what "done" looks like. Input a feature description → output a `.specs/features/<name>/spec.md` with requirements, acceptance criteria, and traceability table.

---

## When to Use

- You have a feature request but don't know if it's Quick, Medium, or Large scope
- You need to clarify ambiguous requirements before planning or building
- You want to document what "done" means for a feature (acceptance criteria)
- You're onboarding and need to understand the development lifecycle
- User says: `/spec <description>`, `/spec quick/medium/large <description>`, `/spec resume`

---

## Boundaries

**Always:**
- Load context from `docs/project.md`, `docs/conventions.md`, `docs/decisions.md` (reference: `_shared/context-loading.md`)
- Detect scope using the scoring matrix in `references/scope-detection.md`
- Surface any assumptions with the user
- Ask clarifying questions if specification is ambiguous
- Write acceptance criteria matching the scope-appropriate template
- Assign requirement IDs: `[ABBR]-01`, `[ABBR]-02`, etc. (where ABBR is 2-4 letter feature abbreviation)

**Ask First:**
- Skip scope detection (only if user explicitly specifies `/spec quick/medium/large`)
- Modify an existing spec.md (should rewrite the full spec, not patch)
- Assume clarification questions aren't needed (surface them first)

**Never:**
- Design the solution (that's `/plan`)
- Create tasks or break work into steps (that's `/plan`)
- Implement code (that's `/build`)
- Make architectural decisions (that's planning)

---

## Core Process

1. **Load context**: Read `docs/project.md`, `docs/conventions.md`, `docs/decisions.md`, 3 most recent session logs, and relevant `.specs/codebase/` files if present. Produce a Context Summary block (reference: `_shared/context-loading.md`).

2. **Detect scope**: Analyze user's feature description against 5 signals (files affected, concepts, ambiguity, integrations, risk) using `references/scope-detection.md`. Calculate scope: Quick, Medium, or Large. Skip detection if user specified scope explicitly (`/spec quick`, etc.).

3. **Surface assumptions**: List any assumptions implied by the request (e.g., "Assuming we're using JWT for auth", "Assuming GraphQL for API"). Ask user to confirm or correct.

4. **Ask clarifying questions**: If request is ambiguous (Ambiguity score ≥ 1), ask 1-3 focused clarification questions. Wait for answers before writing spec.

5. **Produce artifact**:
   - **Quick scope** → `.specs/quick/NNN-slug/TASK.md` (single executable task)
   - **Medium/Large scope** → `.specs/features/<name>/spec.md` (full specification)

6. **Fill specification** (for Medium/Large): Use template from `references/spec-template.md`. Include: problem statement, goals, out-of-scope items, user stories (P1/P2/P3), acceptance criteria (at least 3), requirement traceability table, success criteria. Assign requirement IDs: `[ABBR]-01`, etc.

7. **Idempotency check**: If `spec.md` already exists with `status: approved` → present it to user and ask if they want to revise. If approved as-is, skip to next phase.

8. **Approval gate**: Present spec to user. Ask: "Does this spec look correct? (approve / adjust / cancel)". Do not proceed until user approves.

---

## Common Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "I'll just quickly design it too" | Stop. Design is a separate phase (/plan). Specification is decision-free — capture what, not how. |
| "The spec is clear enough, skip clarification questions" | Unasked questions become wrong implementations. Surface assumptions and ask now — saves 10x time later. |
| "I'll skip scope detection for this small task" | Scope sets expectations and affects all downstream phases. Always detect. Small tasks often turn into medium. |
| "These acceptance criteria are too vague" | Vague criteria are unverifiable. Make them testable: "User can X in <5 seconds" not "User can X quickly". |
| "I don't have time to document this spec" | An undocumented feature is a feature that doesn't ship. Spec is the gate. 30 min spec saves 3 hours rework. |

---

## Red Flags

- **Assumption not surfaced**: Feature description has implicit tech choices (JWT, GraphQL, REST) but user wasn't asked to confirm
- **No acceptance criteria**: Specification has requirements but no testable criteria for "done"
- **Design decisions in spec**: Specification mentions implementation details (e.g., "use Redis for caching", "add index on users.id")
- **Scope detected as XL**: Scope should always be Quick/Medium/Large. XL indicates feature is too large and should be split
- **Ambiguity score high but no clarification questions asked**: High ambiguity means you're missing information
- **Requirement IDs not assigned**: Requirements without IDs cannot be traced to tasks or commits
- **User approval skipped**: Proceeding without approval gate means spec wasn't actually approved

---

## Verification

- [ ] Context Summary produced and presented to user
- [ ] Scope detected (Quick, Medium, or Large) with reasoning shown
- [ ] Assumptions surfaced and confirmed with user
- [ ] All ambiguities addressed via clarification questions
- [ ] Specification artifact exists (TASK.md for Quick, spec.md for Medium/Large)
- [ ] Acceptance criteria are testable (not vague)
- [ ] All requirements assigned IDs (e.g., [FEAT]-01)
- [ ] Requirement traceability table present (if Medium/Large)
- [ ] User explicitly approved spec (approval gate passed)

---

## References

- `references/scope-detection.md` — Scoring matrix for Quick/Medium/Large
- `references/spec-template.md` — Template for spec.md
- `references/task-template.md` — Template for quick TASK.md
- `_shared/context-loading.md` — Context loading strategy (what to load, token budget, format)
- `/plan` — Next phase (read spec, produce design.md + tasks.md)
