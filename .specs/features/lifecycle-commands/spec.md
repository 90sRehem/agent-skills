---
feature: lifecycle-commands
status: draft
scope: Large
created: 2026-04-24
prefix: LC
---

# Spec: lifecycle-commands

## Problem Statement

The agent-skills project currently has a single monolithic `spec-driven` skill (347 lines) that handles all 6 phases of the development lifecycle (LOAD → SPECIFY → DESIGN → TASKS → EXECUTE → LEARN). This creates several problems:

1. **Cognitive overload** — A single SKILL.md does everything, making it hard to understand, maintain, or extend any individual concern.
2. **No lifecycle commands** — Users cannot invoke specific lifecycle phases independently (e.g., "just plan" or "just review").
3. **Weak task persistence** — Task completion marking exists but isn't strongly enforced; resume behavior is fragile.
4. **No archive workflow** — Completed features accumulate in `.specs/features/` with no structured completion path.
5. **No STATE.md** — No single source of truth for active work, decisions, blockers, and deferred items.

## Goals

- G1: Decompose monolithic skill into 7 focused, independently invokable skills
- G2: Create 7 thin orchestrator commands mapping to the dev lifecycle
- G3: Adopt consistent skill anatomy (Overview → When to Use → Boundaries → Core Process → Rationalizations → Red Flags → Verification)
- G4: Strengthen task persistence with immediate file writes and reliable resume
- G5: Implement archive workflow for completed features
- G6: Implement STATE.md for project-level state tracking
- G7: Preserve backward compatibility with existing .specs/ structure, scope detection, knowledge base, and checkpoint/resume

## Out of Scope

- Changing the `.specs/` directory structure
- Modifying the docs/ knowledge base format
- Creating a UI or dashboard
- Implementing agent-to-agent communication protocol
- Changing the scope detection scoring matrix
- Creating personas (who) — only skills (how) and commands (when)

## User Stories

### P1 — Must Have

| ID | Story |
|----|-------|
| US-01 | As a developer, I can type `/spec <desc>` to specify what to build, receiving a scoped spec.md |
| US-02 | As a developer, I can type `/plan` to plan how to build a specified feature, receiving design.md + tasks.md |
| US-03 | As a developer, I can type `/build` to execute the next task slice, with progress saved immediately |
| US-04 | As a developer, I can type `/test` to verify a feature against its acceptance criteria |
| US-05 | As a developer, I can type `/review` to get a structured quality review of my changes |
| US-06 | As a developer, I can type `/code-simplify` to identify and apply simplification opportunities |
| US-07 | As a developer, I can type `/ship` to run pre-flight checks and get a GO/NO-GO decision |
| US-08 | As a developer, I can resume work on a feature from exactly where I left off, with no task state lost |
| US-09 | As a developer, I can archive a completed feature, capturing learnings and cleaning up .specs/ |

### P2 — Should Have

| ID | Story |
|----|-------|
| US-10 | As a developer, I can check STATE.md to see all active features, blockers, and deferred items |
| US-11 | As a developer, each skill gives me clear exit criteria so I know when a phase is truly done |
| US-12 | As a developer, skills warn me about common rationalizations for skipping steps |

### P3 — Nice to Have

| ID | Story |
|----|-------|
| US-13 | As a developer, I can invoke skills independently without the full pipeline (e.g., /review on any code, not just planned features) |
| US-14 | As a developer, the "NOTICED BUT NOT TOUCHING" pattern helps me stay focused during execution |

## Requirements

| ID | Requirement | Priority | Stories |
|----|------------|----------|---------|
| LC-01 | Refactor spec-driven SKILL.md to contain only LOAD + SPECIFY phases | P1 | US-01 |
| LC-02 | Create planning skill with DESIGN + TASKS phases | P1 | US-02 |
| LC-03 | Create incremental-build skill with EXECUTE phase, task persistence, and completion/archive trigger | P1 | US-03, US-08, US-09 |
| LC-04 | Create test-verification skill with Prove-It pattern | P1 | US-04 |
| LC-05 | Create code-review skill with five-axis review and severity labels | P1 | US-05 |
| LC-06 | Create code-simplification skill with scan-identify-apply-verify process | P1 | US-06 |
| LC-07 | Create shipping skill with pre-flight checks and GO/NO-GO decision | P1 | US-07 |
| LC-08 | Create 7 thin orchestrator command files that invoke corresponding skills | P1 | US-01 to US-07 |
| LC-09 | All skills follow consistent skill anatomy template | P1 | US-11, US-12, US-14 |
| LC-10 | Task persistence: immediate [x] write, reliable resume from first unchecked task | P1 | US-08 |
| LC-11 | Archive workflow: extract learnings, move to .specs/archive/, update STATE.md | P1 | US-09 |
| LC-12 | STATE.md management: active features, decisions, lessons, blockers, deferred | P2 | US-10 |
| LC-13 | Backward compatibility: preserve .specs/ structure, scope detection, knowledge base, checkpoint/resume | P1 | US-08 |
| LC-14 | Shared references in _shared/ for cross-cutting concerns (skill anatomy, task format, context loading, scope discipline) | P1 | US-11, US-12, US-14 |
| LC-15 | Each skill has valid .skill-meta.json with triggers, description, and version | P1 | US-01 to US-07, US-13 |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-01 | 7 skill directories exist, each with SKILL.md following skill anatomy |
| AC-02 | 7 command files exist, each under 25 lines, invoking the correct skill |
| AC-03 | spec-driven/SKILL.md contains only LOAD + SPECIFY (no DESIGN/TASKS/EXECUTE/LEARN) |
| AC-04 | `/plan` reads an existing spec.md and produces design.md + tasks.md |
| AC-05 | `/build` finds the first unchecked task, executes it, writes [x] to the file immediately |
| AC-06 | After all tasks are [x], incremental-build suggests archive workflow |
| AC-07 | Archive moves feature to .specs/archive/ and writes session log |
| AC-08 | STATE.md tracks at least: active features, completed features, blockers |
| AC-09 | All existing .specs/ structure, scope detection, and docs/ knowledge base still function |
| AC-10 | Each skill has a "Common Rationalizations" table with at least 3 entries |
| AC-11 | Each skill has "Red Flags" section and "Verification" exit criteria |
| AC-12 | _shared/ contains at least: skill-anatomy.md, task-format.md, state-management.md, archive-workflow.md, context-loading.md |

## Success Criteria

- All 7 skills load independently and produce expected output for their phase
- A full lifecycle (/spec → /plan → /build → /test → /review → /ship) can complete a feature end-to-end
- Task state survives session interruption and resumes correctly
- Archive workflow cleans up completed features
- No skill exceeds 300 lines (progressive disclosure via references/)
