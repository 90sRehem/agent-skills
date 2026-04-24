---
feature: lifecycle-commands
status: completed
scope: Large
created: 2026-04-24
last-completed: 11.1
updated: 2026-04-24
total_tasks: 36
completed_count: 36
---

# Tasks: lifecycle-commands

## Phase 1: Shared Foundation

- [x] 1.1 Create skill anatomy template (`_shared/skill-anatomy.md`)
  - Files: `_shared/skill-anatomy.md` (new)
  - Depends on: nothing
  - Requirement: LC-09
  - Size: S
  - What: Create the canonical skill structure template that all 7 skills will follow. Include all 8 sections with placeholder guidance: Overview, When to Use, Boundaries (Always/Ask First/Never), Core Process, Common Rationalizations table (3+ rows with Excuse → Rebuttal format), Red Flags, Verification (exit criteria checklist), References. Add inline comments explaining each section's purpose and what makes a good entry.
  - Done when:
    - [ ] File exists at `_shared/skill-anatomy.md`
    - [ ] Contains all 8 sections with placeholder guidance
    - [ ] Rationalizations table has example format with 3 sample rows
    - [ ] Verification section has checklist format

- [x] 1.2 Create task format reference (`_shared/task-format.md`)
  - Files: `_shared/task-format.md` (new)
  - Depends on: nothing
  - Requirement: LC-10, LC-14
  - Size: S
  - What: Document the canonical task format. Frontmatter fields: feature, status, scope, created, last-completed, updated, total_tasks, completed_count. Checkbox syntax (`- [ ]` / `- [x]`). Task structure fields: title, Files, Depends on, Requirement, Size, What, Done when. Persistence rules (immediate write, never batch). Resume algorithm (scan for first `- [ ]`).
  - Done when:
    - [ ] File exists at `_shared/task-format.md`
    - [ ] Frontmatter schema documented with all fields
    - [ ] Task structure documented with example
    - [ ] Persistence rules explicitly stated (immediate write, not deferred)
    - [ ] Resume algorithm described step-by-step

- [x] 1.3 Create state management reference (`_shared/state-management.md`)
  - Files: `_shared/state-management.md` (new)
  - Depends on: nothing
  - Requirement: LC-12, LC-14
  - Size: S
  - What: Document the STATE.md format. Location: `.specs/project/STATE.md`. Sections: Active Features table (columns: feature, scope, progress, started), Completed Features table (columns: feature, completed, archived), Decisions log, Lessons Learned, Blockers (columns: feature, task, reason, since), Deferred Items. Update rules: who writes what, when. Creation rule: create from template on first write if file missing.
  - Done when:
    - [ ] File exists at `_shared/state-management.md`
    - [ ] STATE.md format fully specified with example content
    - [ ] All sections with table headers documented
    - [ ] Update rules defined per section
    - [ ] Creation-on-first-write rule documented

- [x] 1.4 Create archive workflow reference (`_shared/archive-workflow.md`)
  - Files: `_shared/archive-workflow.md` (new)
  - Depends on: 1.3
  - Requirement: LC-11, LC-14
  - Size: S
  - What: Document the archive process. Trigger condition: all tasks in tasks.md are [x] (no unchecked, no [BLOCKED]). Steps: (1) extract learnings → write session log to docs/sessions/, (2) move .specs/features/<name>/ → .specs/archive/<name>/, (3) update STATE.md — remove from Active, add to Completed with date and archive path, (4) update docs/project.md if feature added new modules. User confirmation required before executing. Partial completion handling: if blocked tasks exist, do not trigger archive, report blocked count.
  - Done when:
    - [ ] File exists at `_shared/archive-workflow.md`
    - [ ] Trigger condition clearly defined (all [x], no [BLOCKED])
    - [ ] All 4 archive steps with file paths documented
    - [ ] User confirmation gate documented
    - [ ] Partial completion (blocked tasks) handled

- [x] 1.5 Create context loading reference (`_shared/context-loading.md`)
  - Files: `_shared/context-loading.md` (new)
  - Depends on: nothing
  - Requirement: LC-13, LC-14
  - Size: S
  - What: Extract context loading strategy from current spec-driven/SKILL.md. Document: what to load (docs/project.md, docs/conventions.md, docs/decisions.md, 3 most recent sessions, .specs/codebase/, STATE.md if exists), token budgets per source, total budget <40k tokens, load-on-demand principle, Context Summary block format (feature name, scope, active work, key constraints).
  - Done when:
    - [ ] File exists at `_shared/context-loading.md`
    - [ ] Load list with all sources documented
    - [ ] Token budget table with per-source limits
    - [ ] Context Summary block format documented
    - [ ] Load-on-demand principle stated

- [x] 1.6 Create scope discipline reference (`_shared/scope-discipline.md`)
  - Files: `_shared/scope-discipline.md` (new)
  - Depends on: nothing
  - Requirement: LC-09, LC-14
  - Size: S
  - What: Document the "NOTICED BUT NOT TOUCHING" pattern. Definition: log improvements noticed during execution but don't act on them. When to apply: during /build and /code-simplify. Format for logging noticed items: append to a "## Noticed (not acting on)" section in tasks.md or session log. Rationale: scope discipline prevents feature creep and session overrun. Provide 2 concrete examples (e.g., noticing a refactoring opportunity while fixing a bug, noticing missing tests while implementing a feature).
  - Done when:
    - [ ] File exists at `_shared/scope-discipline.md`
    - [ ] Pattern defined with rationale
    - [ ] Log format for noticed items specified
    - [ ] At least 2 concrete examples

## Phase 2: Refactor spec-driven Skill

- [x] 2.1 Rewrite spec-driven/SKILL.md to LOAD + SPECIFY only (`spec-driven/SKILL.md`)
  - Files: `spec-driven/SKILL.md` (rewrite)
  - Depends on: 1.1, 1.5
  - Requirement: LC-01, LC-09
  - Size: M
  - What: Rewrite the existing monolithic SKILL.md. Keep only LOAD and SPECIFY phases. Remove DESIGN, TASKS, EXECUTE, LEARN phases entirely. Restructure to follow the skill anatomy from _shared/skill-anatomy.md. Add: Boundaries section (Always: detect scope, surface assumptions, ask clarifying questions; Ask First: override auto-detected scope; Never: design, plan tasks, implement code). Add Common Rationalizations table with ≥3 entries (e.g., "I'll just quickly design it too" → "Stop. /plan handles design."; "The spec is clear enough, skip clarification" → "Unasked questions become wrong implementations."; "I'll skip scope detection for small tasks" → "Scope sets expectations — skipping creates surprises."). Add Red Flags section. Add Verification exit criteria checklist. Reference _shared/context-loading.md for LOAD phase. Keep knowledge base scaffold (create docs/ on first run) in LOAD. Under 300 lines.
  - Done when:
    - [ ] SKILL.md follows skill anatomy template
    - [ ] Contains only LOAD + SPECIFY phases
    - [ ] No mention of DESIGN, TASKS, EXECUTE, or LEARN phases
    - [ ] Boundaries section with Always/Ask First/Never
    - [ ] Common Rationalizations table with ≥3 entries
    - [ ] Red Flags section present
    - [ ] Verification exit criteria checklist present
    - [ ] References _shared/context-loading.md
    - [ ] Under 300 lines

- [x] 2.2 Update spec-driven/.skill-meta.json (`spec-driven/.skill-meta.json`)
  - Files: `spec-driven/.skill-meta.json` (update)
  - Depends on: 2.1
  - Requirement: LC-01, LC-15
  - Size: S
  - What: Update the meta file. Set description to "Specify what to build — scope detection, requirements, acceptance criteria." Triggers: ["/spec", "/spec quick", "/spec medium", "/spec large", "/spec resume"]. Add version: "2.0.0" (major bump for refactor). Ensure name: "spec-driven".
  - Done when:
    - [ ] Description reflects SPECIFY-only scope
    - [ ] All 5 trigger patterns listed
    - [ ] Version field present with "2.0.0"
    - [ ] Valid JSON

- [x] 2.3 Reorganize spec-driven/references/ (`spec-driven/references/`)
  - Files: `spec-driven/references/design-template.md` (move to planning), `spec-driven/references/tasks-template.md` (move to planning), `spec-driven/references/session-template.md` (move to _shared)
  - Depends on: 2.1, 3.3
  - Requirement: LC-01, LC-14
  - Size: S
  - What: After planning/references/ and _shared/ exist (tasks 3.3 must run first or in parallel): Remove design-template.md from spec-driven/references/ (content already copied to planning/references/). Remove tasks-template.md from spec-driven/references/ (content already copied to planning/references/). Move or remove session-template.md (content preserved in _shared/ or incremental-build/references/). Keep in spec-driven/references/: scope-detection.md, spec-template.md, task-template.md (Quick scope).
  - Done when:
    - [ ] spec-driven/references/ contains only: scope-detection.md, spec-template.md, task-template.md
    - [ ] Removed files' content is preserved elsewhere (planning/ or _shared/)

## Phase 3: Create Planning Skill

- [x] 3.1 Create planning/SKILL.md (`planning/SKILL.md`)
  - Files: `planning/SKILL.md` (new)
  - Depends on: 1.1, 1.2, 2.1
  - Requirement: LC-02, LC-09
  - Size: M
  - What: Create the planning skill following skill anatomy. Core Process: (1) Load context referencing _shared/context-loading.md, (2) Read spec.md to get scope, requirements, and acceptance criteria, (3) If scope=Large → produce design.md using design-template.md, (4) Produce tasks.md using tasks-template.md, (5) Apply vertical slicing strategy (reference vertical-slicing.md), (6) Size each task XS/S/M/L/XL — reject XL (must break down further), (7) Build requirement traceability table (every req ID covered by ≥1 task), (8) Approval gate before finalizing. Boundaries — Always: read spec first, size every task, include traceability table. Ask First: skip design.md for Medium scope. Never: implement code, modify spec, change scope. Rationalizations: "These tasks are too small" → "Small tasks complete reliably; large tasks get stuck mid-session." / "We don't need a traceability table" → "Traceability catches requirements that have no implementation." / "I can plan without the spec" → "Planning without spec creates tasks for the wrong problem." Red Flags: task touches 8+ files, no requirement ID, vague done-when. Verification: every req ID covered, no XL tasks, design.md exists if Large scope, all tasks have done-when criteria.
  - Done when:
    - [ ] File exists at `planning/SKILL.md`
    - [ ] Follows skill anatomy template
    - [ ] Core Process: 8 steps
    - [ ] Task sizing table (XS/S/M/L/XL) with XL-rejection rule
    - [ ] Vertical slicing referenced
    - [ ] Requirement traceability table required
    - [ ] Common Rationalizations ≥3 entries
    - [ ] Under 300 lines

- [x] 3.2 Create planning/.skill-meta.json (`planning/.skill-meta.json`)
  - Files: `planning/.skill-meta.json` (new)
  - Depends on: 3.1
  - Requirement: LC-02, LC-15
  - Size: S
  - What: Create meta file with: name: "planning", description: "Plan how to build — design decisions, task breakdown, vertical slicing.", triggers: ["/plan", "plan this", "break into tasks", "create tasks for"], version: "1.0.0".
  - Done when:
    - [ ] File exists and is valid JSON
    - [ ] All fields present: name, description, triggers, version

- [x] 3.3 Create planning/references/ (`planning/references/`)
  - Files: `planning/references/design-template.md` (new), `planning/references/tasks-template.md` (new), `planning/references/vertical-slicing.md` (new)
  - Depends on: 2.3
  - Requirement: LC-02, LC-14
  - Size: S
  - What: Create three reference files. (1) design-template.md: copy content from existing spec-driven/references/ design template if it exists, otherwise create a template with sections: Architecture Decisions (table), Component Design, Data Flow, Error Handling. (2) tasks-template.md: copy content from existing spec-driven/references/tasks-template.md and add a Size field (XS/S/M/L/XL) to each task entry. (3) vertical-slicing.md: new file with definition (thin end-to-end slice delivering one user-visible behavior), benefits (earlier feedback, smaller PRs, independently testable), how-to (identify user-visible behavior, trace through all layers, cut minimal path), anti-pattern (horizontal slicing by layer), 2 examples.
  - Done when:
    - [ ] design-template.md exists in planning/references/
    - [ ] tasks-template.md exists with Size field added
    - [ ] vertical-slicing.md exists with definition, benefits, how-to, 2 examples

## Phase 4: Create Incremental-Build Skill

- [x] 4.1 Create incremental-build/SKILL.md (`incremental-build/SKILL.md`)
  - Files: `incremental-build/SKILL.md` (new)
  - Depends on: 1.1, 1.2, 1.4, 1.6
  - Requirement: LC-03, LC-09, LC-10, LC-11
  - Size: M
  - What: Create the build skill following skill anatomy. Core Process: (1) Load tasks.md, find first `- [ ]` task (skip all `- [x]`), (2) Read task definition (What, Files, Done when), (3) Load referenced source files, (4) Implement the change, (5) Run task's done-when acceptance checks, (6) If ~100 lines written without a test → stop and write tests first (red flag), (7) **IMMEDIATELY** mark `- [x]` in tasks.md, update frontmatter (last-completed: task-id, updated: date, increment completed_count), write file to disk — BEFORE reporting to user, (8) Report "✓ Task N complete. [N/M done]", (9) Proceed to next `- [ ]` task, (10) When all tasks [x]: write session log, suggest archive (reference _shared/archive-workflow.md), update STATE.md. Blocker handling: if task cannot proceed, mark `[BLOCKED: <reason>]`, continue to next non-dependent task. Boundaries — Always: write [x] immediately before reporting, verify acceptance before marking done, use NOTICED BUT NOT TOUCHING for out-of-scope items. Ask First: skip a task, modify task definition. Never: create new tasks, change spec.md, modify design.md. Rationalizations: "I'll mark it done later" → "Later never comes when sessions end. Write [x] now." / "This refactoring is clearly needed, I'll do it now" → "NOTICED BUT NOT TOUCHING. Log it and continue." / "The tests are slow, I'll skip running them" → "Unverified tasks create cascading failures. Run tests." Red Flags: >100 lines implemented without a test, modifying files outside task scope, all tasks blocked. Verification: task.done-when criteria all checked, [x] written to file, commit created.
  - Done when:
    - [ ] File exists at `incremental-build/SKILL.md`
    - [ ] Follows skill anatomy template
    - [ ] Core Process: 10 steps
    - [ ] Task persistence: immediate [x] write explicitly required BEFORE user reporting
    - [ ] ~100 lines without testing is a Red Flag
    - [ ] Completion section: session log + archive suggestion + STATE.md update
    - [ ] Blocker handling documented
    - [ ] NOTICED BUT NOT TOUCHING referenced
    - [ ] Common Rationalizations ≥3 entries
    - [ ] Under 300 lines

- [x] 4.2 Create incremental-build/.skill-meta.json (`incremental-build/.skill-meta.json`)
  - Files: `incremental-build/.skill-meta.json` (new)
  - Depends on: 4.1
  - Requirement: LC-03, LC-15
  - Size: S
  - What: Create meta file with: name: "incremental-build", description: "Build one slice at a time — implement, verify, persist, advance.", triggers: ["/build", "build next task", "implement next", "resume work", "continue building"], version: "1.0.0".
  - Done when:
    - [ ] File exists and is valid JSON
    - [ ] All fields present

- [x] 4.3 Create incremental-build/references/build-cycle.md (`incremental-build/references/build-cycle.md`)
  - Files: `incremental-build/references/build-cycle.md` (new)
  - Depends on: 4.1
  - Requirement: LC-03
  - Size: S
  - What: Document the implement → test → verify → commit micro-cycle per task. Steps: (1) Read task definition, (2) Implement minimal code for the task (not more), (3) Write/run tests — if >100 lines, stop here first, (4) Verify all done-when criteria, (5) Write [x] to tasks.md + update frontmatter, (6) Commit with conventional message: `feat(<scope>): <task-title> [task-<id>]`. Include: the 100-line rule explanation, commit message format with examples, what "verify" means (run tests, not just eyeball).
  - Done when:
    - [ ] File exists at `incremental-build/references/build-cycle.md`
    - [ ] 6-step cycle documented
    - [ ] 100-line rule documented with explanation
    - [ ] Commit message format with example

## Phase 5: Create Test-Verification Skill

- [x] 5.1 Create test-verification/SKILL.md (`test-verification/SKILL.md`)
  - Files: `test-verification/SKILL.md` (new)
  - Depends on: 1.1
  - Requirement: LC-04, LC-09
  - Size: M
  - What: Create the test skill following skill anatomy. Two modes. Feature verification mode: (1) Load spec.md and tasks.md, (2) For each acceptance criterion and done-when item: write or run a test, collect evidence (test output, log, return value), (3) Produce verification report (criterion → evidence → PASS/FAIL). Bug mode — Prove-It pattern (reference prove-it-pattern.md): (1) Reproduce the bug precisely, (2) Write a failing test that captures the bug exactly, (3) Confirm the test fails, (4) Fix the code, (5) Confirm the test passes, (6) Run full test suite to check for regressions. Boundaries — Always: collect evidence for every criterion, never "trust me it works". Ask First: mark a criterion as manual-only. Never: modify acceptance criteria, change spec.md, skip evidence collection. Rationalizations: "I tested it manually and it works" → "Manual tests aren't reproducible. Write it down or write a test." / "This criterion is too vague to test" → "Surface this to the author — vague criteria are unverifiable by definition." / "All the important cases pass, some edge cases can wait" → "Edge cases are where bugs live. Test them now." Red Flags: no evidence collected, criteria skipped, bug fixed without a reproducing test.
  - Done when:
    - [ ] File exists at `test-verification/SKILL.md`
    - [ ] Follows skill anatomy template
    - [ ] Two modes documented: feature verification + Prove-It bug mode
    - [ ] Evidence collection required for each criterion
    - [ ] Common Rationalizations ≥3 entries
    - [ ] Under 250 lines

- [x] 5.2 Create test-verification/.skill-meta.json (`test-verification/.skill-meta.json`)
  - Files: `test-verification/.skill-meta.json` (new)
  - Depends on: 5.1
  - Requirement: LC-04, LC-15
  - Size: S
  - What: Create meta file with: name: "test-verification", description: "Verify against acceptance criteria — Prove-It pattern for bugs.", triggers: ["/test", "verify feature", "prove it works", "test this", "run tests"], version: "1.0.0".
  - Done when:
    - [ ] File exists and is valid JSON
    - [ ] All fields present

- [x] 5.3 Create test-verification/references/prove-it-pattern.md (`test-verification/references/prove-it-pattern.md`)
  - Files: `test-verification/references/prove-it-pattern.md` (new)
  - Depends on: 5.1
  - Requirement: LC-04
  - Size: S
  - What: Document the Prove-It pattern in detail. Origin/philosophy: "Don't tell me the bug is fixed. Prove it." Steps: (1) Reproduce — find the exact input/state that triggers the bug, (2) Write failing test — create a test that captures exactly this scenario and confirm it fails, (3) Fix — implement the minimal fix, (4) Confirm passing — run the test, confirm it passes, (5) Regression check — run full suite, confirm nothing else broke. When to use: bug reports, "it works on my machine" claims, flaky behavior. Anti-pattern: "I tested manually" without a test as proof. One concrete example.
  - Done when:
    - [ ] File exists at `test-verification/references/prove-it-pattern.md`
    - [ ] 5-step process documented
    - [ ] When-to-use and anti-pattern documented
    - [ ] At least 1 concrete example

## Phase 6: Create Code-Review Skill

- [x] 6.1 Create code-review/SKILL.md (`code-review/SKILL.md`)
  - Files: `code-review/SKILL.md` (new)
  - Depends on: 1.1
  - Requirement: LC-05, LC-09
  - Size: M
  - What: Create the review skill following skill anatomy. Core Process: (1) Identify review target: git diff, explicit file list, or feature from .specs/, (2) Load docs/conventions.md, (3) Review on 5 axes (reference review-axes.md): Correctness, Security, Performance, Readability, Architecture, (4) Label each finding with severity: Critical (blocks merge), Major (should fix before merge), Nit (style, non-blocking), Optional (suggestion), FYI (informational), (5) Check convention compliance against docs/conventions.md, (6) Produce review report: findings table (file:line | axis | severity | finding | suggestion), (7) If architectural decisions found → suggest creating an ADR entry in docs/decisions.md. Boundaries — Always: review all 5 axes, label every finding, check conventions. Ask First: suggest structural refactoring beyond current scope. Never: auto-fix code, modify files during review, skip security axis. Rationalizations: "It's a small change, no need for full review" → "Critical bugs hide in small changes." / "Security review isn't needed for this feature" → "Every change is a security surface. Check." / "The code is readable to me, skip readability" → "Readable to you ≠ readable to the next engineer." Red Flags: no security axis check, Critical findings not flagged, skipping conventions check.
  - Done when:
    - [ ] File exists at `code-review/SKILL.md`
    - [ ] Follows skill anatomy template
    - [ ] Five-axis review documented
    - [ ] Severity labels with definitions
    - [ ] Convention compliance check included
    - [ ] ADR suggestion on architectural decisions
    - [ ] Common Rationalizations ≥3 entries
    - [ ] Under 250 lines

- [x] 6.2 Create code-review/.skill-meta.json (`code-review/.skill-meta.json`)
  - Files: `code-review/.skill-meta.json` (new)
  - Depends on: 6.1
  - Requirement: LC-05, LC-15
  - Size: S
  - What: Create meta file with: name: "code-review", description: "Structured quality review — five axes, severity labels, convention compliance.", triggers: ["/review", "review this", "code review", "check quality", "review changes"], version: "1.0.0".
  - Done when:
    - [ ] File exists and is valid JSON
    - [ ] All fields present

- [x] 6.3 Create code-review/references/review-axes.md (`code-review/references/review-axes.md`)
  - Files: `code-review/references/review-axes.md` (new)
  - Depends on: 6.1
  - Requirement: LC-05
  - Size: S
  - What: Document the five review axes. For each: definition, what to look for (checklist of 3-5 items), common issues, typical severity. Axes: (1) Correctness: logic errors, off-by-one, missing error handling, edge cases not covered. (2) Security: injection vulnerabilities, missing auth checks, data exposure, unsafe deserialization. (3) Performance: N+1 queries, missing indices, unnecessary computation, memory leaks. (4) Readability: unclear naming, function too long (>50 lines), nesting depth >3, missing or misleading comments. (5) Architecture: tight coupling, violation of separation of concerns, missing abstraction, over-engineering.
  - Done when:
    - [ ] File exists at `code-review/references/review-axes.md`
    - [ ] All 5 axes with definition and checklist
    - [ ] Common issues listed per axis
    - [ ] Typical severity guidance per axis

## Phase 7: Create Code-Simplification Skill

- [x] 7.1 Create code-simplification/SKILL.md (`code-simplification/SKILL.md`)
  - Files: `code-simplification/SKILL.md` (new)
  - Depends on: 1.1, 1.6
  - Requirement: LC-06, LC-09
  - Size: M
  - What: Create the simplification skill following skill anatomy. Core Process: (1) Read docs/conventions.md, (2) Identify target: explicit file/module from user, or auto-detect from recently changed files, (3) Scan for simplification opportunities (reference simplification-patterns.md): duplication, over-abstraction, dead code, complex conditionals, unnecessary indirection, (4) Rank opportunities by impact (high/medium/low) and risk (breaking change / non-breaking), (5) Apply one simplification at a time — propose, wait for implicit or explicit go-ahead, then execute, (6) Verify after each: run tests, confirm behavior unchanged, (7) Log any noticed improvements outside scope using NOTICED BUT NOT TOUCHING (reference _shared/scope-discipline.md). Boundaries — Always: read conventions first, apply one change at a time, verify after each. Ask First: remove public APIs, change function signatures, rename widely-used symbols. Never: change observable behavior, add new features, skip post-change verification. Rationalizations: "I'll batch all simplifications then test" → "Batched changes create untraceable failures. One at a time." / "The tests are passing, I don't need to run them again" → "Each simplification can break something unrelated." / "I'll also fix this bug I noticed" → "NOTICED BUT NOT TOUCHING. File it separately." Red Flags: behavior change observed after simplification, test failures after change, multiple changes applied before testing.
  - Done when:
    - [ ] File exists at `code-simplification/SKILL.md`
    - [ ] Follows skill anatomy template
    - [ ] Core Process: 7 steps
    - [ ] One-simplification-at-a-time rule
    - [ ] NOTICED BUT NOT TOUCHING referenced
    - [ ] Common Rationalizations ≥3 entries
    - [ ] Under 250 lines

- [x] 7.2 Create code-simplification/.skill-meta.json (`code-simplification/.skill-meta.json`)
  - Files: `code-simplification/.skill-meta.json` (new)
  - Depends on: 7.1
  - Requirement: LC-06, LC-15
  - Size: S
  - What: Create meta file with: name: "code-simplification", description: "Identify and apply simplification opportunities — one change at a time, verify after each.", triggers: ["/code-simplify", "simplify this", "reduce complexity", "clean up code", "refactor"], version: "1.0.0".
  - Done when:
    - [ ] File exists and is valid JSON
    - [ ] All fields present

- [x] 7.3 Create code-simplification/references/simplification-patterns.md (`code-simplification/references/simplification-patterns.md`)
  - Files: `code-simplification/references/simplification-patterns.md` (new)
  - Depends on: 7.1
  - Requirement: LC-06
  - Size: S
  - What: Document 6 common simplification patterns. For each: name, smell (what it looks like), fix (what to do), example (before/after pseudocode), risk level (low/medium/high). Patterns: (1) Extract duplication — same logic in 2+ places → extract to shared function. (2) Inline unnecessary abstraction — wrapper adds no value → inline the call. (3) Remove dead code — unreachable or unused code → delete. (4) Simplify complex conditionals — deeply nested if/else → guard clauses + early returns. (5) Reduce indirection — unnecessary wrapper or delegate → remove the layer. (6) Replace imperative with declarative — manual loop building a list → map/filter.
  - Done when:
    - [ ] File exists at `code-simplification/references/simplification-patterns.md`
    - [ ] All 6 patterns with name, smell, fix, example, risk level

## Phase 8: Create Shipping Skill

- [x] 8.1 Create shipping/SKILL.md (`shipping/SKILL.md`)
  - Files: `shipping/SKILL.md` (new)
  - Depends on: 1.1
  - Requirement: LC-07, LC-09
  - Size: M
  - What: Create the shipping skill following skill anatomy. Core Process: (1) Identify feature: read from .specs/features/<name>/ or active feature in STATE.md, (2) Run pre-flight checklist — STOP if any item fails: all tasks in tasks.md are [x], no [BLOCKED] tasks, tests pass (ask for test output or run /test), no Critical review findings (ask for review report or run /review), (3) If pre-flight fails → NO-GO: list specific blockers with task/file references, (4) If pre-flight passes → parallel review: assess from 3 perspectives (Correctness: are the acceptance criteria met?, Security: any new vulnerabilities introduced?, Performance: any regressions?), (5) Merge findings from all 3 perspectives, (6) Produce GO/NO-GO decision with evidence summary. GO requires: pre-flight passed, no new Critical security issues, no performance regressions. Boundaries — Always: run full pre-flight first, provide evidence for GO/NO-GO. Ask First: override a failing pre-flight check. Never: auto-merge, auto-deploy, produce GO without evidence. Rationalizations: "Pre-flight is overkill for this small change" → "Ship discipline applies regardless of size." / "We can fix issues after shipping" → "Shipping known issues creates debt immediately." / "Security review isn't needed for a UI change" → "UI changes expose data. Check security anyway." Red Flags: any pre-flight item skipped, GO without evidence, no rollback plan.
  - Done when:
    - [ ] File exists at `shipping/SKILL.md`
    - [ ] Follows skill anatomy template
    - [ ] Pre-flight checklist documented (4+ items)
    - [ ] GO/NO-GO format with evidence requirement
    - [ ] Parallel 3-perspective review documented
    - [ ] Common Rationalizations ≥3 entries
    - [ ] Under 250 lines

- [x] 8.2 Create shipping/.skill-meta.json (`shipping/.skill-meta.json`)
  - Files: `shipping/.skill-meta.json` (new)
  - Depends on: 8.1
  - Requirement: LC-07, LC-15
  - Size: S
  - What: Create meta file with: name: "shipping", description: "Pre-flight checks and GO/NO-GO decision — verify everything before shipping.", triggers: ["/ship", "ready to ship", "pre-flight check", "can we ship this"], version: "1.0.0".
  - Done when:
    - [ ] File exists and is valid JSON
    - [ ] All fields present

## Phase 9: Create Thin Orchestrator Commands

- [x] 9.1 Create /spec command (`commands/spec.md`)
  - Files: `commands/spec.md` (new)
  - Depends on: 2.1
  - Requirement: LC-08
  - Size: S
  - What: Create thin orchestrator. Load `spec-driven` skill. Parse arguments: `/spec <desc>` → specify feature with auto-detected scope, `/spec quick <desc>` → Quick scope, `/spec medium <desc>` → Medium scope, `/spec large <desc>` → Large scope, `/spec resume` → resume flow (find in-progress feature in STATE.md). Under 20 lines.
  - Done when:
    - [x] File exists at `commands/spec.md`
    - [x] References spec-driven skill by name
    - [x] Handles 5 variants (default, quick, medium, large, resume)
    - [x] Under 20 lines

- [x] 9.2 Create /plan command (`commands/plan.md`)
  - Files: `commands/plan.md` (new)
  - Depends on: 3.1
  - Requirement: LC-08
  - Size: S
  - What: Create thin orchestrator. Load `planning` skill. Parse arguments: `/plan` → plan active feature (from STATE.md or most recent spec.md), `/plan <feature-name>` → plan specific feature. Note: planning is read-only — does not modify existing code. Under 20 lines.
  - Done when:
    - [x] File exists at `commands/plan.md`
    - [x] References planning skill by name
    - [x] Handles default and feature-name variants
    - [x] States read-only constraint (no code modification)
    - [x] Under 20 lines

- [x] 9.3 Create /build command (`commands/build.md`)
  - Files: `commands/build.md` (new)
  - Depends on: 4.1
  - Requirement: LC-08
  - Size: S
  - What: Create thin orchestrator. Load `incremental-build` skill. Parse arguments: `/build` → find next unchecked task in active feature, `/build <feature-name>` → build specific feature. If multiple features have unchecked tasks → list them and ask which to build. Under 20 lines.
  - Done when:
    - [x] File exists at `commands/build.md`
    - [x] References incremental-build skill by name
    - [x] Handles default and feature-name variants
    - [x] Handles multi-feature disambiguation
    - [x] Under 20 lines

- [x] 9.4 Create /test command (`commands/test.md`)
  - Files: `commands/test.md` (new)
  - Depends on: 5.1
  - Requirement: LC-08
  - Size: S
  - What: Create thin orchestrator. Load `test-verification` skill. Parse arguments: `/test` → verify active feature, `/test <feature-name>` → verify specific feature, `/test bug: <description>` → enter Prove-It bug mode. Under 20 lines.
  - Done when:
    - [x] File exists at `commands/test.md`
    - [x] References test-verification skill by name
    - [x] Handles 3 variants (default, feature-name, bug mode)
    - [x] Under 20 lines

- [x] 9.5 Create /review command (`commands/review.md`)
  - Files: `commands/review.md` (new)
  - Depends on: 6.1
  - Requirement: LC-08
  - Size: S
  - What: Create thin orchestrator. Load `code-review` skill. Parse arguments: `/review` → review changes in current git diff, `/review <file-or-dir>` → review specific target. Under 20 lines.
  - Done when:
    - [x] File exists at `commands/review.md`
    - [x] References code-review skill by name
    - [x] Handles default (git diff) and explicit target variants
    - [x] Under 20 lines

- [x] 9.6 Create /code-simplify command (`commands/code-simplify.md`)
  - Files: `commands/code-simplify.md` (new)
  - Depends on: 7.1
  - Requirement: LC-08
  - Size: S
  - What: Create thin orchestrator. Load `code-simplification` skill. Parse arguments: `/code-simplify` → simplify current feature code, `/code-simplify <file-or-dir>` → simplify specific target. Under 20 lines.
  - Done when:
    - [x] File exists at `commands/code-simplify.md`
    - [x] References code-simplification skill by name
    - [x] Handles default and explicit target variants
    - [x] Under 20 lines

- [x] 9.7 Create /ship command (`commands/ship.md`)
  - Files: `commands/ship.md` (new)
  - Depends on: 8.1
  - Requirement: LC-08
  - Size: S
  - What: Create thin orchestrator. Load `shipping` skill. Parse arguments: `/ship` → ship active feature, `/ship <feature-name>` → ship specific feature. Under 20 lines.
  - Done when:
    - [x] File exists at `commands/ship.md`
    - [x] References shipping skill by name
    - [x] Handles default and feature-name variants
    - [x] Under 20 lines

## Phase 10: Integration

- [x] 10.1 Create STATE.md template (`_shared/state-template.md`)
  - Files: `_shared/state-template.md` (new)
  - Depends on: 1.3
  - Requirement: LC-12
  - Size: S
  - What: Create a ready-to-use template for `.specs/project/STATE.md`. Include YAML frontmatter (updated date). Sections: Active Features (table), Completed Features (table), Decisions (table: date, decision, context), Lessons Learned (bullet list), Blockers (table: feature, task, reason, since), Deferred Items (bullet list). Pre-fill headers only — no example data rows.
  - Done when:
    - [ ] File exists at `_shared/state-template.md`
    - [ ] All 6 sections present with table headers
    - [ ] YAML frontmatter with updated field
    - [ ] No example data (headers only)

- [x] 10.2 Create session log template (`_shared/session-template.md`)
  - Files: `_shared/session-template.md` (new)
  - Depends on: nothing
  - Requirement: LC-13
  - Size: S
  - What: Create a template for session logs written to docs/sessions/. YAML frontmatter: date, feature, scope, status (completed/partial/blocked). Body sections: Summary (1-2 sentences), Tasks Completed (list), Tasks Remaining (list), Decisions Made (list), Lessons Learned (list), Noticed But Not Acting On (list), Next Session Start (first unchecked task).
  - Done when:
    - [ ] File exists at `_shared/session-template.md`
    - [ ] All sections present
    - [ ] YAML frontmatter with required fields
    - [ ] Consistent with archive-workflow.md session log reference

## Phase 11: Validation

- [x] 11.1 Verify requirement traceability
  - Files: `.specs/features/lifecycle-commands/spec.md`, all created SKILL.md files, all created command files
  - Depends on: all previous tasks
  - Requirement: all (LC-01 through LC-15)
  - Size: S
  - What: Final validation pass. Check: (1) Every requirement LC-01 through LC-15 has corresponding content in at least one SKILL.md or command file, (2) Every acceptance criterion AC-01 through AC-12 is achievable from the created content, (3) All 7 skills have Rationalizations table (≥3 entries), Red Flags section, and Verification checklist, (4) All 7 command files are under 25 lines, (5) All SKILL.md files are under 300 lines. Report any gaps found.
   - Done when:
     - [x] All LC-01 to LC-15 requirements covered
     - [x] All AC-01 to AC-12 acceptance criteria achievable
     - [x] All skills have Rationalizations, Red Flags, Verification
     - [x] All commands under 25 lines
     - [x] All skills under 300 lines
     - [x] No gaps reported (or gaps documented with remediation)

---

## Requirement Coverage

| Requirement | Tasks |
|-------------|-------|
| LC-01 | 2.1, 2.2, 2.3 |
| LC-02 | 3.1, 3.2, 3.3 |
| LC-03 | 4.1, 4.2, 4.3 |
| LC-04 | 5.1, 5.2, 5.3 |
| LC-05 | 6.1, 6.2, 6.3 |
| LC-06 | 7.1, 7.2, 7.3 |
| LC-07 | 8.1, 8.2 |
| LC-08 | 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7 |
| LC-09 | 1.1, 1.6, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1 |
| LC-10 | 1.2, 4.1 |
| LC-11 | 1.4, 4.1 |
| LC-12 | 1.3, 10.1 |
| LC-13 | 1.5, 10.2, 11.1 |
| LC-14 | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.3, 3.3 |
| LC-15 | 2.2, 3.2, 4.2, 5.2, 6.2, 7.2, 8.2 |

## Execution Order

Parallelizable groups:
1. **Group A** (no deps): 1.1, 1.2, 1.3, 1.5, 1.6, 8.1, 5.1, 6.1, 10.2
2. **Group B** (after Group A): 1.4, 2.1, 7.1
3. **Group C** (after Group B): 2.2, 3.1, 4.1, 7.2, 7.3, 8.2
4. **Group D** (after Group C): 2.3, 3.2, 3.3, 4.2, 4.3, 5.2, 5.3, 6.2, 6.3
5. **Group E** (after Group D): 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 10.1
6. **Group F** (after Group E): 11.1
