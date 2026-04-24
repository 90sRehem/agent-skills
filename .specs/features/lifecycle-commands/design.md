---
feature: lifecycle-commands
status: draft
scope: Large
created: 2026-04-24
---

# Design: lifecycle-commands

## Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────┐
│  COMMANDS (thin orchestrators, 5-25 lines each)  │
│  /spec  /plan  /build  /test  /review  /ship    │
│                    /code-simplify                 │
└─────────────┬───────────────────────────────────┘
              │ invokes
┌─────────────▼───────────────────────────────────┐
│  SKILLS (focused SKILL.md, <300 lines each)      │
│  spec-driven │ planning │ incremental-build      │
│  test-verification │ code-review                 │
│  code-simplification │ shipping                  │
└─────────────┬───────────────────────────────────┘
              │ references
┌─────────────▼───────────────────────────────────┐
│  _shared/ (cross-cutting references)             │
│  skill-anatomy │ task-format │ state-management  │
│  archive-workflow │ context-loading               │
│  scope-discipline                                │
└─────────────────────────────────────────────────┘
```

### Data Flow (Artifact Pipeline)

```
/spec ──produces──▶ .specs/features/<name>/spec.md
                          │
/plan ──reads─────────────┘
      ──produces──▶ design.md + tasks.md
                          │
/build ──reads─────────────┘
       ──updates──▶ tasks.md ([x] marks)
       ──produces──▶ code changes
       ──triggers──▶ archive workflow (when all done)
                          │
/test ──reads──────────────┘
      ──verifies──▶ acceptance criteria from spec.md
                          │
/review ──reads─────────────┘
        ──produces──▶ review report
                          │
/ship ──reads──────────────┘
      ──produces──▶ GO / NO-GO decision
```

### Artifact Coupling

Skills communicate exclusively through `.specs/` artifacts. There is no runtime dependency between skills.

| Artifact | Written by | Read by |
|----------|-----------|---------|
| spec.md | spec-driven | planning, test-verification, code-review |
| design.md | planning | incremental-build, code-review |
| tasks.md | planning | incremental-build, test-verification |
| STATE.md | incremental-build, spec-driven | all skills (context loading) |
| Session logs | incremental-build | spec-driven (LOAD phase) |

## File Layout

```
skills/
├── spec-driven/                  # LOAD + SPECIFY only (refactored)
│   ├── SKILL.md
│   ├── .skill-meta.json
│   └── references/
│       ├── scope-detection.md    # kept as-is
│       ├── spec-template.md      # kept as-is
│       └── task-template.md      # Quick scope inline tasks
│
├── planning/                     # DESIGN + TASKS (new)
│   ├── SKILL.md
│   ├── .skill-meta.json
│   └── references/
│       ├── design-template.md
│       ├── tasks-template.md
│       └── vertical-slicing.md
│
├── incremental-build/            # EXECUTE + persistence + archive (new)
│   ├── SKILL.md
│   ├── .skill-meta.json
│   └── references/
│       └── build-cycle.md
│
├── test-verification/            # TEST (new)
│   ├── SKILL.md
│   ├── .skill-meta.json
│   └── references/
│       └── prove-it-pattern.md
│
├── code-review/                  # REVIEW (new)
│   ├── SKILL.md
│   ├── .skill-meta.json
│   └── references/
│       └── review-axes.md
│
├── code-simplification/          # SIMPLIFY (new)
│   ├── SKILL.md
│   ├── .skill-meta.json
│   └── references/
│       └── simplification-patterns.md
│
├── shipping/                     # SHIP (new)
│   ├── SKILL.md
│   └── .skill-meta.json
│
├── _shared/                      # Cross-cutting references (new)
│   ├── skill-anatomy.md
│   ├── task-format.md
│   ├── state-management.md
│   ├── archive-workflow.md
│   ├── context-loading.md
│   └── scope-discipline.md
│
└── commands/                     # Thin orchestrators (new)
    ├── spec.md
    ├── plan.md
    ├── build.md
    ├── test.md
    ├── review.md
    ├── code-simplify.md
    └── ship.md
```

## Technical Decisions

### TD-01: Skills communicate via artifacts, not runtime calls

**Decision**: All inter-skill communication happens through `.specs/` files. No skill imports or calls another skill directly.
**Consequence**: Skills can be invoked independently, in any order, by any agent.

### TD-02: Commands are markdown files, not code

**Decision**: Each command is a `.md` file (5-25 lines) that describes which skill to load and what arguments to pass.

**Format**:
```markdown
---
command: /spec
skill: spec-driven
---
# /spec — Specify a Feature
Load the `spec-driven` skill. Pass the user's description as the feature input.
```

### TD-03: Scope detection stays in spec-driven, scope travels in frontmatter

**Decision**: Keep scope-detection.md in spec-driven. The determined scope is written to spec.md frontmatter. Downstream skills read scope from the artifact.

### TD-04: LEARN phase distributed, not centralized

**Decision**: Distribute LEARN behaviors:
- Session logging → incremental-build Completion section
- Archive workflow → triggered by incremental-build when all tasks complete
- Live docs update → incremental-build Completion section
- Knowledge base scaffold → spec-driven LOAD (first run only)
- ADR creation → code-review when architectural decisions found

### TD-05: Task persistence model

**Decision**: The incremental-build skill MUST:
1. Find first `- [ ]` task
2. Execute the task
3. Immediately write `- [x]` to the tasks.md file (not deferred, not batched)
4. Update frontmatter `last-completed: <task-id>` and `updated: <date>`
5. On resume: read tasks.md, skip all `- [x]`, start at first `- [ ]`

### TD-06: Skill anatomy template

**Decision**: Every SKILL.md follows:
```
# Skill: <name>
## Overview
## When to Use
## Boundaries (Always / Ask First / Never)
## Core Process
## Common Rationalizations (table: Excuse → Rebuttal)
## Red Flags
## Verification (exit criteria checklist)
## References
```

### TD-07: Task sizing in planning

| Size | Files | Action |
|------|-------|--------|
| XS | 1 | OK |
| S | 1-2 | OK (preferred) |
| M | 3-5 | OK |
| L | 5-8 | Split if possible |
| XL | 8+ | Must break down |

### TD-08: Vertical slicing as default strategy

**Decision**: Each slice delivers a thin end-to-end piece of functionality, not a horizontal layer.
**Consequence**: Earlier feedback, smaller PRs, each slice independently testable.

## Component Specifications

### spec-driven (refactored)
- **Phases**: LOAD + SPECIFY
- **Inputs**: User description, optional scope modifier
- **Outputs**: spec.md (or TASK.md for Quick scope)
- **Key behaviors**: Context loading, scope detection, clarification, knowledge base scaffold on first run

### planning (new)
- **Phases**: DESIGN + TASKS
- **Inputs**: spec.md
- **Outputs**: design.md (Large scope) + tasks.md
- **Key behaviors**: Vertical slicing, task sizing (XS/S/M/L/XL) with XL-rejection, requirement traceability, approval gate

### incremental-build (new)
- **Phase**: EXECUTE
- **Inputs**: tasks.md
- **Outputs**: Code changes, updated tasks.md, session log, archive trigger
- **Key behaviors**: One task at a time, immediate [x] write, NOTICED BUT NOT TOUCHING, archive on completion

### test-verification (new)
- **Phase**: TEST
- **Inputs**: spec.md (acceptance criteria), tasks.md (done-when)
- **Outputs**: Verification report
- **Key behaviors**: Prove-It pattern, evidence collection per criterion

### code-review (new)
- **Phase**: REVIEW
- **Inputs**: Changed files
- **Outputs**: Review report
- **Key behaviors**: Five-axis review (Correctness/Security/Performance/Readability/Architecture), severity labels (Critical/Major/Nit/Optional/FYI)

### code-simplification (new)
- **Phase**: SIMPLIFY
- **Inputs**: Target files
- **Outputs**: Simplified code
- **Key behaviors**: One simplification at a time, verify after each, NOTICED BUT NOT TOUCHING

### shipping (new)
- **Phase**: SHIP
- **Inputs**: Feature artifacts
- **Outputs**: GO/NO-GO decision
- **Key behaviors**: Pre-flight checklist, parallel review fan-out, rollback plan

## Error Handling

| Scenario | Handling |
|----------|----------|
| Skill invoked without prerequisite artifact | "Run /spec first to create spec.md" |
| tasks.md has no unchecked tasks | "All tasks complete. Run /ship or archive." |
| Task blocked | Mark [BLOCKED: reason], skip dependents, continue |
| STATE.md doesn't exist | Create from template on first write |
| Session interrupted mid-task | On resume: task still `- [ ]`, re-execute |

## Migration Path

The existing spec-driven/SKILL.md is refactored in place (not deleted). The other 6 skills are additive. Commands are a new layer with no conflict.

1. Phase 1-2: Foundation + refactor spec-driven
2. Phase 3-8: Add new skills (parallel, no conflict)
3. Phase 9: Add commands
4. Phase 10-11: Integration + validation
