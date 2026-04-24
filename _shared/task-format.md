# Task Format Reference

This document defines the canonical task format used across all `.specs/features/<name>/tasks.md` files.

## Frontmatter Schema

Every tasks.md file starts with YAML frontmatter. All fields are required.

```yaml
---
feature: <feature-name>
status: pending | in-progress | completed | blocked
scope: Quick | Medium | Large
created: YYYY-MM-DD
last-completed: <task-id> | null
updated: YYYY-MM-DD
total_tasks: <number>
completed_count: <number>
---
```

### Field Definitions

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `feature` | string | "lifecycle-commands" | Must match directory name in `.specs/features/` |
| `status` | enum | "in-progress" | One of: pending, in-progress, completed, blocked |
| `scope` | enum | "Large" | Quick (1-2 tasks), Medium (3-8 tasks), Large (9+ tasks) |
| `created` | date | "2026-04-24" | ISO 8601 format, date feature was created |
| `last-completed` | string or null | "3.2" or null | Task ID of most recently completed task |
| `updated` | date | "2026-04-24" | ISO 8601 format, updated every time a task completes |
| `total_tasks` | integer | 31 | Total number of tasks in this file (does not change) |
| `completed_count` | integer | 5 | Number of completed tasks (increments with each [x]) |

## Checkbox Syntax

Tasks are marked with Markdown checkboxes:
- `- [ ]` = incomplete task
- `- [x]` = completed task
- `- [BLOCKED: <reason>]` = task blocked with reason

Example:
```markdown
- [ ] 1.1 Create component
- [x] 1.2 Write tests
- [BLOCKED: waiting for design feedback] 2.1 Implement API
```

## Task Structure

Each task follows this format:

```markdown
- [ ] <ID> <Title> (`<files-affected>`)
  - Files: <list of files to create/modify>
  - Depends on: <task IDs> | nothing
  - Requirement: <requirement IDs> | <requirement ID list>
  - Size: XS | S | M | L | XL
  - What: <what this task does>
  - Done when:
    - [ ] <criterion 1>
    - [ ] <criterion 2>
    - [ ] <criterion N>
```

### Field Descriptions

| Field | Content | Example |
|-------|---------|---------|
| ID | Task identifier | "1.1", "2.3", "11.1" |
| Title | 2-5 word task summary | "Create skill anatomy template" |
| Files | Affected files | ``_shared/skill-anatomy.md`` |
| **Files block** | List of files to create or modify (absolute paths relative to root) | `_shared/skill-anatomy.md` (new), `spec-driven/SKILL.md` (rewrite) |
| **Depends on** | Prerequisite tasks by ID | "1.1, 1.5" or "nothing" |
| **Requirement** | Requirement ID(s) from spec.md | "LC-09" or "LC-01, LC-09" |
| **Size** | XS (5 min), S (15 min), M (45 min), L (2 hrs), XL (4+ hrs) | "S" |
| **What** | 2-3 sentence description of the work | "Document the canonical task format..." |
| **Done when** | Bulleted checklist of acceptance criteria | "File exists", "Contains all 8 sections", etc. |

## Persistence Rules

### Immediate Write Requirement

**CRITICAL:** Tasks must be marked [x] in the file immediately after completion, not deferred.

1. **Before** reporting task complete to user:
   - Execute the task fully
   - Verify acceptance criteria
   - Edit tasks.md: change `- [ ]` to `- [x]`
   - Edit frontmatter: increment `completed_count`, update `last-completed`, update `updated` date
   - Write file to disk

2. **Then** report "✓ Task N/M complete" to user

3. **Never** defer the write. If session ends with uncommitted changes, the next session will miss completed tasks.

### Why Immediate?

- Sessions can be interrupted (context window exhaustion, tool failures, user disconnect)
- Deferred writes mean lost progress
- Immediate writes are the only way to make task state reliable
- The checkpoint exists ONLY if it's on disk

## Resume Algorithm

When resuming a feature:

1. Read `.specs/features/<name>/tasks.md`
2. Scan from top to bottom for the first `- [ ]` (unchecked task)
3. Read that task's full definition (What, Files, Done when)
4. Start execution from that task (skip all preceding `- [x]` tasks)
5. Do NOT scan for `- [BLOCKED: ]` markers — handle those as normal tasks and skip them only if explicitly marked blocked

**Resume Invariant:** If a task is not [x], it has not been completed and should be treated as pending.

## Example Task

```markdown
- [ ] 3.1 Create planning skill (`planning/SKILL.md`)
  - Files: `planning/SKILL.md` (new)
  - Depends on: 1.1, 1.2, 2.1
  - Requirement: LC-02, LC-09
  - Size: M
  - What: Create the planning skill following skill anatomy. Core Process includes: read spec, design if Large, plan tasks, size each, build traceability table, gate approval. Rationalizations table ≥3 entries. Under 300 lines.
  - Done when:
    - [ ] File exists at `planning/SKILL.md`
    - [ ] Follows skill anatomy template
    - [ ] Core Process: 8 steps documented
    - [ ] Rationalizations table with ≥3 entries
    - [ ] Under 300 lines
```

## State Transitions

A task can be in these states:

```
pending → in-progress → [x] (completed)
       → [BLOCKED: reason] → (resume later)
```

- **pending**: No work started (initial state)
- **in-progress**: Work started, not yet verified
- **[x]** (completed): Work verified against done-when criteria
- **[BLOCKED: ...]**: Work cannot continue (waiting for external input, missing dependency, etc.)

## Task Sizing Guidelines

| Size | Duration | Scope | Example |
|------|----------|-------|---------|
| XS | 5 min | Trivial edit | Update one line, no tests needed |
| S | 15 min | Small, contained | Write a single reference file, one new file under 100 LOC |
| M | 45 min | Medium, some scope | Rewrite existing file, 3-4 new files, integration |
| L | 2 hours | Large, multi-file | Decompose monolithic file, 5+ files, complex integration |
| XL | 4+ hours | Too large | Should be broken down further |

## Cross-Feature References

If a task in one feature depends on a task in another feature, use this format:

```markdown
- Depends on: external:<feature-name>:<task-id>
```

Example: `external:spec-driven:2.3`

---

## Anti-Patterns

❌ **Do NOT:**
- Mark `- [x]` without writing to disk (defer the write)
- Batch multiple tasks' completions before writing
- Skip the frontmatter update
- Use task IDs outside the feature (unless external reference)
- Leave `- [ ]` markers in files after session ends
- Modify a task's definition after it's been started

✓ **DO:**
- Write [x] immediately after verification
- Update frontmatter on every completion
- Resume from first `- [ ]` task
- Keep task definitions stable once started
- Use session logs to capture decisions and lessons

---

**End of Task Format Reference**
