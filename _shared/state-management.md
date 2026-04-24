# State Management Reference

This document defines the STATE.md format used to track project-level state across features, decisions, and blockers.

## Overview

**Location:** `.specs/project/STATE.md`

**Purpose:** Single source of truth for:
- Which features are active and their progress
- Which features are completed and where they're archived
- Key decisions made during development
- Lessons learned
- Current blockers preventing progress
- Deferred work waiting for future sessions

**Scope:** Project-level state. Feature-level state (task progress) lives in `.specs/features/<name>/tasks.md`.

## File Format

### Frontmatter

```yaml
---
updated: YYYY-MM-DD
version: "1.0"
---
```

| Field | Type | Purpose |
|-------|------|---------|
| `updated` | date | ISO 8601, must be updated every time STATE.md changes |
| `version` | string | Semantic version (bump for breaking changes to schema) |

## Sections

### 1. Active Features

Tracks features currently in-progress.

**Table Headers:** `feature`, `scope`, `progress`, `started`

```markdown
## Active Features

| feature | scope | progress | started |
|---------|-------|----------|---------|
| lifecycle-commands | Large | 40% | 2026-04-24 |
| api-auth | Medium | 20% | 2026-04-23 |
```

**Field Definitions:**

| Field | Example | Notes |
|-------|---------|-------|
| `feature` | "lifecycle-commands" | Directory name in `.specs/features/` |
| `scope` | "Large" | Quick / Medium / Large |
| `progress` | "40%" | Approximate completion: `completed_count / total_tasks * 100` |
| `started` | "2026-04-24" | ISO 8601, date work began |

**Update Rule:** Add a new row when `/spec` produces a new feature. Update `progress` after each `/build` session. Remove row when feature is archived (move to Completed Features).

---

### 2. Completed Features

Tracks archived features.

**Table Headers:** `feature`, `completed`, `archived`

```markdown
## Completed Features

| feature | completed | archived |
|---------|-----------|----------|
| spec-driven-v2 | 2026-04-20 | .specs/archive/2026-04-20-spec-driven-v2/ |
```

**Field Definitions:**

| Field | Example | Notes |
|-------|---------|-------|
| `feature` | "spec-driven-v2" | Feature name |
| `completed` | "2026-04-20" | ISO 8601, date archive was created |
| `archived` | `.specs/archive/2026-04-20-spec-driven-v2/` | Path to archived feature directory |

**Update Rule:** After archive workflow completes, add a row here. Include archive path for future reference.

---

### 3. Decisions

Key architectural or design decisions made during development.

**Table Headers:** `date`, `decision`, `context`

```markdown
## Decisions

| date | decision | context |
|------|----------|---------|
| 2026-04-24 | Decompose monolithic spec-driven skill into 7 focused skills | Cognitive overload from 6 phases in one file; enables independent invocation |
| 2026-04-23 | Require immediate task completion writes | Session interruptions caused lost progress; checkpoint-on-disk is only reliable backup |
```

**Field Definitions:**

| Field | Example | Notes |
|-------|---------|-------|
| `date` | "2026-04-24" | ISO 8601, when decision was made |
| `decision` | "..." | Short phrase capturing the decision |
| `context` | "..." | Why the decision was made (problem, constraints, options considered) |

**Update Rule:** Add a row when a significant decision is made. Do NOT retroactively update context. Decisions are records, not mutable.

**Significant Decision Criteria:**
- Architectural changes (decompose, restructure)
- Process changes (immediate writes, archive workflow)
- Scope trade-offs (dropping features, deferring work)
- Technology choices

---

### 4. Lessons Learned

Insights discovered during development or execution.

**Format:** Bullet list

```markdown
## Lessons Learned

- Immediate task writes are critical: session interruptions mean deferred writes = lost progress
- Skill anatomy reduces cognitive load: narrow focus enables clearer documentation
- Pre-flight checklists prevent rework: shipping known issues creates debt faster than fixing before ship
- Vertical slicing delivers faster feedback than horizontal layers
- Tests provide confidence; manual testing provides none
```

**Update Rule:** Add a bullet after completing a feature or session. One sentence per lesson. Focus on repeatable insights, not one-off observations.

**Lesson Criteria:**
- Applicable to future work
- Surprising or counter-intuitive
- Changes how we should approach next time

---

### 5. Blockers

Features or tasks that cannot proceed, waiting for external input or resolution.

**Table Headers:** `feature`, `task`, `reason`, `since`

```markdown
## Blockers

| feature | task | reason | since |
|---------|------|--------|-------|
| api-auth | 3.2 | Waiting for security review of auth implementation | 2026-04-23 |
| lifecycle-commands | none | (none) | |
```

**Field Definitions:**

| Field | Example | Notes |
|-------|---------|-------|
| `feature` | "api-auth" | Feature name from Active Features |
| `task` | "3.2" or "none" | Task ID that's blocked, or "none" if entire feature is blocked |
| `reason` | "Waiting for security review..." | Human-readable explanation |
| `since` | "2026-04-23" | ISO 8601, when blocker was identified |

**Update Rule:** Add a row when a blocker is encountered. Remove row when blocker is resolved. Update `since` if blocker duration is significant (>3 days).

**When to Escalate:** If blocker has been open for 7+ days and no clear resolution path, escalate to stakeholders.

---

### 6. Deferred Items

Work identified as valuable but intentionally postponed.

**Format:** Bullet list

```markdown
## Deferred Items

- Add REST API endpoint for feature X (depended on by another feature; prioritize when X is ready)
- Performance optimization for task parsing (works fine now; optimize when perf becomes issue)
- Migrate spec-driven to use LLM-assisted planning (research phase only; production use later)
- Create graphify integration for STATE.md (nice-to-have dashboard; current manual tracking sufficient)
```

**Update Rule:** Add a bullet when deferring work identified during `/plan`, `/build`, or `/ship`. Include rationale (why defer). Remove bullet when work is started (move to Active Features).

**Deferral Criteria:**
- Not on critical path for current feature
- Valuable but not blocking
- Rationale documented for why now isn't the right time

---

## Creation Rule: Create on First Write

If `.specs/project/STATE.md` does not exist:

1. Create directory `.specs/project/` if missing
2. Copy template from `_shared/state-template.md`
3. Fill in `updated` date with today
4. Add first feature to Active Features
5. All other sections start empty (headers only, no data rows)

**Who Creates:** Whoever runs `/spec` for the first feature in a new project.

**When:** Automatically, on first STATE.md write (no user action needed).

## Update Rules by Section

| Section | Who Updates | When | Frequency |
|---------|------------|------|-----------|
| Active Features | /build or /spec | After starting new feature, after /build session | Per feature change |
| Completed Features | Archive workflow | After /ship and archive | Per completed feature |
| Decisions | Forge (in session log) or Manual | After significant decision | As needed |
| Lessons Learned | Forge (in session log) or Manual | After feature complete or major insight | Per feature or milestone |
| Blockers | Any skill (e.g., /build) | When blocked, when resolved | As needed |
| Deferred Items | Any skill | When deferring work | As needed |

## Example STATE.md

```markdown
---
updated: 2026-04-24
version: "1.0"
---

# Project State

## Active Features

| feature | scope | progress | started |
|---------|-------|----------|---------|
| lifecycle-commands | Large | 50% | 2026-04-24 |
| user-dashboard | Medium | 10% | 2026-04-24 |

## Completed Features

| feature | completed | archived |
|---------|-----------|----------|
| spec-driven-v1 | 2026-04-22 | .specs/archive/2026-04-22-spec-driven-v1/ |

## Decisions

| date | decision | context |
|------|----------|---------|
| 2026-04-24 | Decompose monolithic skill into 7 focused skills | Cognitive overload; enable independent invocation |
| 2026-04-24 | Require immediate task completion writes | Session reliability; checkpoint-on-disk only backup |

## Lessons Learned

- Immediate task writes are critical for session recovery
- Skill anatomy reduces cognitive load
- Vertical slicing beats horizontal layers

## Blockers

| feature | task | reason | since |
|---------|------|--------|-------|
| user-dashboard | 2.1 | Waiting for design review | 2026-04-24 |

## Deferred Items

- Add REST API for user preferences (depends on auth feature)
- Performance optimization for dashboard queries (current perf acceptable)

```

---

**End of State Management Reference**
