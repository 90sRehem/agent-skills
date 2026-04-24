# planning

## Overview

This skill plans how to build a feature by producing design decisions and a task breakdown. After specification clarifies what to build, planning produces design.md (for Large scope) and tasks.md with vertical slices, sizing, and requirement traceability. Use it when you have an approved spec.md and need to design the solution and break work into tasks.

---

## When to Use

- You have an approved spec.md and need to design the solution
- You need to break a feature into tasks with clear dependencies
- You want a vertical slicing strategy for faster feedback
- You need to trace requirements to tasks (coverage verification)
- User says: `/plan`, `/plan <feature-name>`, "break into tasks", "create tasks for"

---

## Boundaries

**Always:**
- Read spec.md first to get scope, requirements, and acceptance criteria
- Size every task: XS (5 min), S (15 min), M (45 min), L (2 hrs), XL (reject, must break down)
- Apply vertical slicing strategy: each task delivers one user-visible behavior through all layers
- Build requirement traceability table: every requirement ID maps to ≥1 task
- Present design (if Large scope) and tasks for user approval before finalizing

**Ask First:**
- Skip design.md for Medium scope (can produce just tasks.md)
- Defer detailed design to implementation (should be in task "What" section, not design.md)
- Deviate from vertical slicing (always prefer thin slices)

**Never:**
- Implement code during planning
- Modify spec.md or change scope
- Create tasks larger than 2 hours (break them down)
- Skip requirement traceability (every req must be covered)

---

## Core Process

1. **Load context**: Read `.specs/features/<name>/spec.md` to extract scope, requirements (with IDs), acceptance criteria, and success criteria. Reference `_shared/context-loading.md` for broader project context if needed.

2. **Assess scope**: Check frontmatter. If scope = Quick, no planning needed (tasks are inline in spec.md). If scope = Medium or Large, proceed.

3. **Produce design.md (only for Large scope)**: Use template from `planning/references/design-template.md`. Fill: architecture decisions (table: decision, rationale, alternatives considered), component design, data flow diagram (optional), error handling strategy, tech stack decisions. Approval gate: "Does this design look correct?" Do not proceed until approved.

4. **Identify user-visible behaviors**: From spec.md acceptance criteria, extract the core user-facing behaviors (e.g., "user can log in", "system sends email", "dashboard loads in <5 seconds").

5. **Apply vertical slicing**: For each user-visible behavior, create a task that touches all layers (e.g., API endpoint → business logic → database → tests). Reference `planning/references/vertical-slicing.md`.

6. **Produce tasks.md**: Use template from `planning/references/tasks-template.md`. Each task: title, What (2-3 sentence description), Files (affected paths), Depends on (prerequisite task IDs), Requirement ID, Size (XS/S/M/L, never XL), Done when (acceptance checklist). Order tasks by dependency (prerequisites first).

7. **Size tasks**: Each task must be completable in under 2 hours (L = 2 hrs max). If a task would take longer, break it into smaller tasks.

8. **Build traceability table**: Create a table at bottom of tasks.md: Requirement ID → Task IDs that cover it. Every requirement ID must appear ≥1 time. Flag any uncovered requirements.

9. **Approval gate**: Present tasks.md to user. Ask: "Does this task breakdown look correct? (approve / adjust)". Do not proceed to building until approved.

---

## Task Sizing Table

| Size | Duration | Scope | Example |
|------|----------|-------|---------|
| XS | 5 min | Trivial | Update one line, no tests |
| S | 15 min | Small, contained | Write single file <100 LOC, simple test |
| M | 45 min | Medium, some integration | 2-3 files, moderate integration, tests |
| L | 2 hours | Large, multi-step | 4-5 files, complex logic, comprehensive tests |
| **XL** | **4+ hours** | **Too large** | **REJECT — must break down into smaller tasks** |

**Rule:** If a task naturally fits L (2 hours), keep it. If it would take 3+ hours, split it into multiple smaller tasks.

---

## Vertical Slicing

**Definition**: A thin, end-to-end slice that delivers one user-visible behavior through all layers (API → logic → data → tests).

**Benefits**:
- Earlier feedback (can test after task 1, not waiting for all tasks)
- Smaller PRs (easier to review, faster feedback)
- Independently testable (can verify each slice works)

**How to Create a Vertical Slice**:
1. Pick one user-visible behavior (e.g., "user can reset password")
2. Trace through all layers: API endpoint → handler → business logic → database call → UI → tests
3. Create one task that covers all these layers for this one behavior
4. Avoid horizontal slicing (API layer only, then logic layer, then DB) — that's wrong

**Reference:** `planning/references/vertical-slicing.md` for detailed examples.

---

## Common Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "These tasks are too small, 15 min is wasting time on overhead" | Small tasks complete reliably. Large tasks get stuck mid-session, create context loss, delay shipping. Small is better. |
| "We don't need a traceability table, requirements are simple" | Traceability catches requirements that have no implementation. What if a requirement fell through the cracks? Trace it. |
| "I can plan without reading the spec first" | Planning without spec means you're planning the wrong problem. Read spec first, always. |
| "Skip design.md, let's just write tasks" | Design.md prevents rework. Architectural decisions made now avoid reimplementation later. Keep design for Large scope. |
| "This vertical slice is too thin, combine multiple behaviors" | Thin slices are a feature, not a bug. One behavior = independent, reviewable, testable. Combine them only if they're inseparable. |

---

## Red Flags

- Task touches 8+ files (too large, spread too thin, should be split)
- Task has no requirement ID (what business need does this task address?)
- Done-when criteria are vague (e.g., "tests pass", "code works") — make testable
- Traceability table has gaps (requirements with no task coverage)
- Design.md exists but Medium scope (ask first before creating for Medium)
- User not asked for approval before proceeding to build
- Horizontal slicing detected (e.g., "API layer tasks" separate from "logic layer tasks")

---

## Verification

- [ ] spec.md read and scope understood (Quick/Medium/Large)
- [ ] design.md exists if scope is Large (and approved)
- [ ] tasks.md exists with all tasks filled
- [ ] Every task has Size assigned (XS/S/M/L, no XL)
- [ ] No task larger than 2 hours (XL rejected)
- [ ] Vertical slicing applied (thin end-to-end slices, not horizontal layers)
- [ ] Requirement traceability table present and complete (all req IDs covered)
- [ ] Tasks ordered by dependency (prerequisites first)
- [ ] Done-when criteria are testable and specific
- [ ] User approval obtained before proceeding to build

---

## References

- `planning/references/design-template.md` — Template for design.md (Large scope only)
- `planning/references/tasks-template.md` — Template for tasks.md (with Size field)
- `planning/references/vertical-slicing.md` — Definition and examples of vertical slicing
- `_shared/context-loading.md` — Context loading strategy
- `/spec` — Previous phase (produces spec.md)
- `/build` — Next phase (executes tasks in order)
