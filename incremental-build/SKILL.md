# incremental-build

## Overview

This skill builds features one task at a time, implementing changes, verifying acceptance criteria, and persisting task completion immediately. After planning produces tasks.md, use this skill to execute each task, write code, run tests, and track progress. Each task completion is marked [x] and written to disk before reporting to user.

---

## When to Use

- You have approved tasks.md from `/plan` and need to build the feature
- You're resuming work on a feature from an interrupted session
- You want to execute the next task slice of a feature
- Each task is independently testable and verifiable
- User says: `/build`, `/build <feature>`, "implement next", "continue building"

---

## Boundaries

**Always:**
- Find and execute the first unchecked `- [ ]` task in tasks.md
- Load the task definition: What, Files, Done when criteria
- Implement the minimal code to satisfy the task (not more)
- Run tests/verification: confirm all done-when criteria pass
- **IMMEDIATELY** mark `- [x]` in tasks.md, update frontmatter (last-completed, updated, completed_count), write to disk — BEFORE reporting to user
- Log any noticed improvements using NOTICED BUT NOT TOUCHING pattern (reference: `_shared/scope-discipline.md`)
- After all tasks [x]: write session log, suggest archive workflow

**Ask First:**
- Skip a task (blocker or dependency issue)
- Modify task definition mid-execution
- Change scope or accept new requirements

**Never:**
- Create new tasks on the fly
- Modify spec.md or design.md
- Change requirement IDs or acceptance criteria
- Mark [x] without first verifying done-when criteria
- Defer [x] marking (must be immediate and on-disk)

---

## Core Process

1. **Load tasks.md**: Read `.specs/features/<name>/tasks.md`. Scan from top to bottom for the first `- [ ]` (unchecked task). Skip all `- [x]` and `[BLOCKED: ]` tasks.

2. **Read task definition**: From the unchecked task, extract: What (2-3 sentence description), Files (affected paths), Done when (acceptance checklist).

3. **Load referenced source files**: Read each file listed in the task's "Files" section.

4. **Implement the change**: Edit the source files directly to implement the task's "What". Implement minimally (just enough to pass done-when criteria, nothing extra).

5. **Run acceptance checks**: Execute each done-when criterion:
   - Run tests if tests are mentioned
   - Lint if linting is mentioned
   - Verify behavior if manual verification is mentioned
   - If any criterion fails → fix code and re-test until all pass

6. **~100 lines threshold**: If you've written ~100 lines without running a test, STOP and write tests first. This is a red flag. (Reference: `incremental-build/references/build-cycle.md`)

7. **IMMEDIATELY mark [x]**: Edit tasks.md **NOW** (before reporting to user):
   - Change `- [ ]` to `- [x]` for this task
   - Update frontmatter: `last-completed: <task-id>`, `updated: <today>`, increment `completed_count`
   - Write file to disk

8. **Report completion**: "✓ Task N/M complete: [brief description]"

9. **Next task**: Loop back to step 1 (find next `- [ ]` task)

10. **Completion**: When all tasks are [x] (no `- [ ]` or `[BLOCKED]` remain):
    - Write session log to `docs/sessions/YYYY-MM-DD-<feature>.md` using `_shared/session-template.md`
    - Update STATE.md: remove from Active Features, add to Completed Features (reference: `_shared/archive-workflow.md`)
    - Suggest: "Feature complete! Run `/ship` to pre-flight check before shipping."

---

## Blocker Handling

**If a task cannot proceed:**

1. Determine the blocker (missing API key, unresolved design question, dependency on external input)
2. Mark task as `[BLOCKED: <reason>]` in tasks.md
3. Update frontmatter: `status: blocked`
4. Report the blocker clearly to user: "Task X blocked: <reason>"
5. Continue to next non-dependent task (if any exist)
6. Do NOT mark feature complete until blockers are resolved

**Dependent tasks**: If task B depends on task A (via "Depends on: A"), and A is blocked, then B is also implicitly blocked. Mark B as blocked only if it cannot be started.

---

## Common Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "I'll mark it done later" | Later never comes when sessions end. Write [x] now, before reporting. Disk is the only checkpoint. |
| "This refactoring is clearly needed, I'll do it now" | NOTICED BUT NOT TOUCHING. Log it. Continue with the task's scope. |
| "The tests are slow, I'll skip running them" | Unverified tasks create cascading failures in the next task. Run tests. |
| "I've written 150 lines, tests aren't needed" | Red flag. Stop. Write tests now or break this task into smaller pieces. |
| "I can fix this bug I noticed later" | Log it as "noticed". Continue with task scope. Don't let unrelated bugs block delivery. |

---

## Red Flags

- **>100 lines written without a test**: Stop and write tests first
- **Modifying files outside the task's Files list**: Scope creep; log and continue
- **Done-when criterion marked ✓ without evidence**: Verify it actually passes
- **All tasks blocked**: Feature cannot progress; report blockers and next steps
- **[x] marked but changes not on disk**: Session ends, progress lost; always write immediately
- **Task definition changed mid-execution**: Mark current task done, create new task for the change

---

## Verification

- [ ] First unchecked task found in tasks.md
- [ ] Task definition (What, Files, Done when) understood
- [ ] All source files loaded and read
- [ ] Implementation code written (minimal, not extra)
- [ ] All done-when criteria verified to pass
- [ ] [x] marked in tasks.md
- [ ] Frontmatter updated (last-completed, updated, completed_count)
- [ ] File written to disk (before reporting to user)
- [ ] User notification sent

---

## References

- `incremental-build/references/build-cycle.md` — Micro-cycle per task: implement → test → verify → commit
- `_shared/scope-discipline.md` — NOTICED BUT NOT TOUCHING pattern
- `_shared/archive-workflow.md` — Archive workflow after all tasks complete
- `/plan` — Previous phase (produces tasks.md)
- `/test` — Verification phase (comprehensive testing)
- `/ship` — Gate before production (pre-flight checks)
