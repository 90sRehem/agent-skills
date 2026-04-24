# Archive Workflow Reference

This document defines the process for archiving completed features, extracting learnings, and cleaning up `.specs/`.

## When to Archive

**Trigger Condition:** A feature is ready for archival when:

1. All tasks in `.specs/features/<name>/tasks.md` are marked `- [x]` (100% complete)
2. NO tasks marked with `[BLOCKED: ]` remain
3. Feature has been shipped (optional but recommended: `/ship` returned GO)

**Verification:**
- Scan tasks.md from top to bottom
- Count unchecked tasks: `[ ]` or `[BLOCKED: ]`
- If count = 0 → **Eligible for archival**
- If count > 0 → **NOT eligible**, report blocker count to user

---

## Archive Process

### Step 1: Extract Learnings → Write Session Log

**What:** Capture insights and decisions from feature development.

**Where:** `.specs/sessions/<feature-name>-YYYY-MM-DD.md` or equivalent session log location

**Template:** Use `_shared/session-template.md`

**Content to Capture:**

- **Summary:** 1-2 sentence recap of what was built
- **Tasks Completed:** List of all completed task IDs with brief description
- **Tasks Remaining:** (empty if none)
- **Decisions Made:** Key architectural or implementation decisions
- **Lessons Learned:** Repeatable insights
- **Noticed But Not Acting On:** Improvements identified but deferred
- **Next Session Start:** First unchecked task (should be none if fully complete)

**Example:**

```markdown
---
date: 2026-04-24
feature: lifecycle-commands
scope: Large
status: completed
---

## Summary
Decomposed monolithic spec-driven skill into 7 focused skills (spec, plan, build, test, review, simplify, ship) and created thin orchestrator commands.

## Tasks Completed
- 1.1 Created skill anatomy template
- 1.2 Created task format reference
- 1.3 Created state management reference
...

## Lessons Learned
- Immediate [x] writes are critical for session recovery
- Skill anatomy reduces cognitive load and improves maintainability
- Pre-flight checklists catch issues early

## Noticed But Not Acting On
- Could add graphify integration to STATE.md (deferred)
- Consider automating archive workflow (future enhancement)
```

---

### Step 2: Move Feature → `.specs/archive/`

**What:** Archive the entire feature directory.

**From:** `.specs/features/<name>/`

**To:** `.specs/archive/YYYY-MM-DD-<name>/` (preserve all contents)

**Structure:**
```
.specs/archive/
  2026-04-20-spec-driven-v1/
    spec.md
    design.md
    tasks.md
    session-log.md
```

**How:**
1. Create target directory: `.specs/archive/YYYY-MM-DD-<name>/`
2. Copy all files from `.specs/features/<name>/` to archive directory
3. Delete `.specs/features/<name>/` directory
4. Verify archive directory contains all expected files

**Verification Checklist:**
- [ ] Archive directory created with correct date + name
- [ ] All files copied (spec.md, design.md, tasks.md, references/ if present)
- [ ] Original directory deleted from `.specs/features/`
- [ ] Archive is readable and complete

---

### Step 3: Update STATE.md

**What:** Record completion in project state tracking.

**File:** `.specs/project/STATE.md`

**Changes:**

#### Remove from Active Features
Delete the row for this feature from the Active Features table.

**Before:**
```markdown
| lifecycle-commands | Large | 100% | 2026-04-24 |
```

**After:** (row deleted)

#### Add to Completed Features
Add a new row to the Completed Features table.

**Template:**
```markdown
| <feature-name> | <completion-date> | .specs/archive/YYYY-MM-DD-<name>/ |
```

**Example:**
```markdown
| lifecycle-commands | 2026-04-24 | .specs/archive/2026-04-24-lifecycle-commands/ |
```

#### Append to Lessons Learned
Copy insights from session log → add bullets to Lessons Learned section.

**Example:**
```markdown
## Lessons Learned
- Immediate task writes are critical for session recovery (from lifecycle-commands)
- Skill anatomy reduces cognitive load (from lifecycle-commands)
```

#### Update Decisions (if significant)
Copy major decisions to the Decisions table (optional).

#### Clear Blockers (if any)
Remove rows from Blockers table that were for this feature.

---

### Step 4: Update docs/project.md (if applicable)

**What:** If feature added new modules or changed architecture, update project documentation.

**Check:**
- Did feature create new directories? (e.g., `/planning`, `/incremental-build`)
- Did feature change architecture? (e.g., skill decomposition)
- Did feature add new patterns? (e.g., "Prove-It pattern")

**If YES:** Update `docs/project.md` to reflect changes (add modules to architecture diagram, document new patterns, etc.)

**If NO:** Skip this step.

---

## User Confirmation Gate

**Before executing archive:**

1. Display feature name and archive path to user
2. Show summary of learnings extracted
3. List blockers (if any exist)
4. Ask: "Archive this feature? (Y/n)"

**If User Says NO:**
- Do NOT archive
- Report blockers if present
- Continue to next feature

**If User Says YES:**
- Execute all 4 steps above
- Report success: "✓ Archived: <feature-name> to <path>"

---

## Partial Completion Handling

**If tasks.md contains unchecked tasks:**

1. Do NOT trigger archive
2. Report: "Cannot archive: X tasks remaining"
3. List remaining tasks by ID
4. List blocked tasks with reasons
5. Suggest: "Resume with `/build` when ready"

**Example:**
```
Cannot archive lifecycle-commands: 5 tasks remaining
Remaining tasks:
  - 7.2 Create code-simplification/.skill-meta.json
  - 8.1 Create shipping/SKILL.md
  - 10.1 Create STATE.md template
  - 10.2 Create session log template
  - 11.1 Verify requirement traceability

Blocked tasks:
  - None

Resume: type `/build` to continue from task 7.2
```

---

## Archive Verification Checklist

After archive completes, verify:

- [ ] `.specs/archive/YYYY-MM-DD-<name>/` exists with all files
- [ ] `.specs/features/<name>/` directory deleted
- [ ] STATE.md updated: removed from Active, added to Completed
- [ ] Session log created in docs/sessions/ (if applicable)
- [ ] All learnings captured
- [ ] docs/project.md updated (if applicable)

---

## Archive Directory Retention

**Retention Policy:** Keep all archived features in `.specs/archive/`.

**Rationale:** Features are historical records. They document decisions, patterns, and lessons.

**Cleanup:** Archive cleanup (pruning very old features) is out of scope for this workflow.

---

**End of Archive Workflow Reference**
