# agent-skills

Reusable skills for AI coding agents — OpenCode, Claude Code, Cursor, GitHub Copilot,
Windsurf, and more.

A comprehensive toolkit that decomposes software development into 7 focused, reusable
skills, each targeting a specific lifecycle phase. Use them sequentially for structured
development or invoke individual skills for targeted work.

---

## Quick start

Install all 7 skills globally:

```bash
for skill in spec-driven planning incremental-build test-verification \
  code-review code-simplification shipping; do
  npx skills add 90sRehem/agent-skills@$skill -g -y
done
```

Then add to your project:

```bash
npx skills init
npx skills add @local/spec-driven
npx skills add @local/planning
npx skills add @local/incremental-build
npx skills add @local/test-verification
npx skills add @local/code-review
npx skills add @local/code-simplification
npx skills add @local/shipping
```

Invoke a skill with a slash command:

```bash
/spec Define what to build
/plan Design how to build it
/build Implement incrementally
/test Verify against criteria
/review Structured quality check
/code-simplify Reduce complexity
/ship Final gates before shipping
```

---

## The 7 skills lifecycle

Agent-skills decomposes development into a structured pipeline:

```
/spec → /plan → /build → /test → /review → /code-simplify → /ship
```

Each skill is **independent** — use individually for targeted work — and
**composable** — use sequentially for end-to-end feature delivery.

### `/spec` — Define

Define what to build through structured specification: scope detection, requirements
analysis, and acceptance criteria.

**When to use:**

- Starting a new feature with an unclear scope
- Clarifying vague or ambiguous requirements
- Breaking large initiatives into manageable work

**Key outputs:**

- `spec.md`: problem statement, goals, acceptance criteria
- Requirement IDs: `[ABBR]-01`, `[ABBR]-02`, etc. (traceable)
- Scope classification: Quick, Medium, or Large

**Example:**

```bash
/spec Add user authentication with OAuth2 and JWT
```

### `/plan` — Plan

Design the solution and break work into tasks. Produces architecture decisions and
vertical slices that each deliver one user-visible behavior.

**When to use:**

- After `/spec` produces an approved specification
- Breaking a feature into independent, testable tasks
- Establishing task dependencies and sizing

**Key outputs:**

- `design.md`: architecture decisions, tech stack, data flow (for Large scope)
- `tasks.md`: ordered tasks with dependencies, sizing (XS/S/M/L), done-when
  criteria
- Traceability table: every requirement mapped to ≥1 task

**Task sizing:**

| Size | Duration | Example |
|------|----------|---------|
| XS | 5 min | Update one line, no tests |
| S | 15 min | Write single file <100 LOC |
| M | 45 min | 2–3 files, some integration |
| L | 2 hours | 4–5 files, complex logic |

**Example:**

```bash
/plan Design JWT tokens, OAuth2 flow, user persistence
```

### `/build` — Build

Build the feature one task at a time. Each task is implemented, verified, and marked
complete before moving to the next.

**When to use:**

- You have an approved `tasks.md` from `/plan`
- Executing the plan slice by slice
- Resuming work from a prior session

**Key workflow:**

1. Find first unchecked `- [ ]` task in `tasks.md`
2. Read task definition: What, Files, Done when
3. Implement the change
4. Run tests/lint to verify done-when criteria
5. Mark `- [x]` immediately and write to disk
6. Report completion, then loop to next task

**Example:**

```bash
/build Implement JWT token service
/build Implement OAuth2 provider integration
/build Implement user persistence
```

### `/test` — Verify

Verify features against acceptance criteria and fix bugs using the Prove-It pattern:
reproduce → write failing test → fix → verify.

**When to use:**

- Feature is built and needs verification against acceptance criteria
- A bug is reported and needs proof and root cause
- You need evidence-based confidence (not just "it works")

**Prove-It pattern:**

1. Reproduce the bug exactly (what input/state triggers it?)
2. Write a failing test that captures the issue
3. Confirm failure: run test → bug is visible
4. Fix the issue minimally
5. Confirm passing: run test → ✓
6. Regression check: full test suite → no breakage

**Example:**

```bash
/test Verify OAuth2 login accepts valid tokens
/test Verify JWT refresh token rotation
/test bug: users can't refresh expired tokens
```

### `/review` — Review

Conduct structured quality review on 5 axes: Correctness, Security, Performance,
Readability, Architecture. Label findings with severity levels.

**When to use:**

- Before merging or shipping code
- You want structured feedback (not just "looks good")
- Assessing security and performance impact
- Checking convention compliance

**Review axes:**

| Axis | Focus |
|------|-------|
| **Correctness** | Logic errors, missing error handling, edge cases |
| **Security** | Injection, auth, data exposure, unsafe deserialization |
| **Performance** | N+1 queries, missing indices, memory leaks |
| **Readability** | Naming clarity, function length, code style |
| **Architecture** | Coupling, separation of concerns, over-engineering |

**Severity levels:**

- **Critical**: Blocks merge (security vulnerability, logic bug, data loss risk)
- **Major**: Should fix before merge (architectural violation, perf regression)
- **Nit**: Non-blocking style/clarity improvement
- **Optional**: Suggestion for future improvement
- **FYI**: Informational, learning opportunity

**Example:**

```bash
/review Check security, error handling, logging
```

### `/code-simplify` — Simplify

Identify and apply simplification opportunities: remove duplication, eliminate
over-abstraction, reduce complexity, improve maintainability.

**When to use:**

- Code is working but has redundancy or unnecessary complexity
- You want to reduce cognitive load for the next engineer
- Improving maintainability without changing behavior
- Cleaning up code patterns across the codebase

**Simplification patterns:**

- Extract duplication (same logic in 2+ places)
- Inline unnecessary abstraction (wrapper adds no value)
- Remove dead code (unreachable or unused)
- Simplify complex conditionals (nested if/else → guard clauses)
- Reduce indirection (unnecessary wrapper → direct call)
- Replace imperative with declarative (manual loop → map/filter)

**Example:**

```bash
/code-simplify Reduce token refresh logic duplication
```

### `/ship` — Ship

Pre-flight checks and GO/NO-GO decision. Verifies tasks complete, tests pass, no
critical review findings, and no security/performance regressions.

**When to use:**

- Feature is built, tested, and reviewed
- Before deploying to production or merging to main
- You want evidence-based confidence before shipping

**Pre-flight checklist:**

1. All tasks in `tasks.md` are `[x]` (100% complete)
2. All tests pass (full test suite)
3. No Critical or Major review findings
4. Code follows conventions

**Decision criteria:**

GO requires:

- ✓ Pre-flight: all 4 items passed
- ✓ Correctness: acceptance criteria met
- ✓ Security: no new vulnerabilities
- ✓ Performance: no regressions

NO-GO if any gate fails. Stop and fix blockers.

**Example:**

```bash
/ship Final checks before deploying auth service
```

---

## Slash commands

All skills are invoked via slash commands in `commands/`:

| Command | Skill | Phase | Purpose |
|---------|-------|-------|---------|
| `/spec` | spec-driven | DEFINE | Specify what to build |
| `/plan` | planning | PLAN | Design and task breakdown |
| `/build` | incremental-build | BUILD | Implement incrementally |
| `/test` | test-verification | VERIFY | Verify acceptance criteria |
| `/review` | code-review | REVIEW | Structured quality review |
| `/code-simplify` | code-simplification | SIMPLIFY | Reduce complexity |
| `/ship` | shipping | SHIP | Pre-flight and go/no-go |

---

## Architecture and shared references

All skills follow a canonical anatomy documented in `_shared/skill-anatomy.md`:

1. **Overview** — What the skill does, when to use it
2. **When to Use** — Ideal triggers and entry points
3. **Boundaries** — Always, Ask First, Never rules
4. **Core Process** — Step-by-step algorithm
5. **Common Rationalizations** — Excuse ↔ Rebuttal table
6. **Red Flags** — Warning signs of drift
7. **Verification** — Exit criteria and success signals
8. **References** — Links to templates and patterns

### Shared references in `_shared/`

| File | Purpose |
|------|---------|
| `skill-anatomy.md` | Canonical skill structure — used by all 7 skills |
| `task-format.md` | Task file format, persistence rules, resume algorithm |
| `state-management.md` | `STATE.md` format and update rules |
| `session-template.md` | Template for session logs |
| `archive-workflow.md` | Archive process for completed features |
| `context-loading.md` | Context loading strategy and token budgets |
| `scope-discipline.md` | "NOTICED BUT NOT TOUCHING" pattern — staying focused |

---

## Project structure

```
agent-skills/
├── README.md                    # This file
├── commands/                    # 7 slash command definitions
│   ├── spec.md
│   ├── plan.md
│   ├── build.md
│   ├── test.md
│   ├── review.md
│   ├── code-simplify.md
│   └── ship.md
├── spec-driven/                 # /spec skill
│   ├── SKILL.md
│   ├── references/
│   │   ├── scope-detection.md
│   │   └── spec-template.md
│   └── phases/
├── planning/                    # /plan skill
│   ├── SKILL.md
│   ├── references/
│   │   ├── design-template.md
│   │   ├── tasks-template.md
│   │   └── vertical-slicing.md
│   └── templates/
├── incremental-build/           # /build skill
│   ├── SKILL.md
│   ├── references/
│   │   └── build-cycle.md
│   └── executor/
├── test-verification/           # /test skill
│   ├── SKILL.md
│   ├── references/
│   │   └── prove-it-pattern.md
│   └── patterns/
├── code-review/                 # /review skill
│   ├── SKILL.md
│   ├── references/
│   │   └── review-axes.md
│   └── axes/
├── code-simplification/         # /code-simplify skill
│   ├── SKILL.md
│   ├── references/
│   │   └── simplification-patterns.md
│   └── patterns/
├── shipping/                    # /ship skill
│   ├── SKILL.md
│   ├── references/
│   │   └── shipping-checklist.md
│   └── checklists/
└── _shared/                     # Shared templates and patterns
    ├── skill-anatomy.md
    ├── task-format.md
    ├── state-management.md
    ├── session-template.md
    ├── state-template.md
    ├── archive-workflow.md
    ├── context-loading.md
    └── scope-discipline.md
```

---

## Usage examples

### Example 1: Full feature workflow

Build a feature from specification to shipping:

```bash
# 1. Define requirements
/spec Add user authentication with OAuth2 and JWT

# 2. Design solution
/plan Design JWT tokens, OAuth2 flow, persistence layer

# 3. Build incrementally
/build Implement JWT token service
/build Implement OAuth2 provider integration
/build Implement user persistence

# 4. Verify it works
/test Verify OAuth2 login accepts valid tokens
/test Verify JWT refresh token rotation

# 5. Review quality
/review Check security, error handling, logging

# 6. Simplify and optimize
/code-simplify Reduce token refresh logic duplication

# 7. Ship with confidence
/ship Final checks before deploying auth service
```

### Example 2: Bug fix with proof

Use the Prove-It pattern to diagnose and fix a reported bug:

```bash
/test bug: users can't refresh expired tokens
/test bug: root cause → refresh token expiry not checked
/build Fix: add expiry validation to refresh endpoint
/test Verify fix: refresh works correctly
/review Check fix doesn't introduce security issues
/ship Deploy hotfix
```

### Example 3: Refactoring sprint

Improve code quality without adding features:

```bash
/code-simplify Identify over-engineering in API layer
/build Remove unused abstractions
/test Verify no regressions
/review Check consistency with codebase standards
/ship Deploy refactoring
```

### Example 4: Isolated verification

Verify an existing feature without full workflow:

```bash
/test Verify user registration accepts valid emails
/test Verify password reset link expires in 1 hour
```

### Example 5: Targeted code review

Review a specific file or module:

```bash
/review src/auth/oauth2.ts
```

---

## Key principles

**1. Sequential but independent**

Use all 7 skills in order for structured feature development. Invoke individual
skills for targeted work: debug with `/test`, refactor with `/code-simplify`,
review without spec with `/review`.

**2. Discipline over scope creep**

Each skill has explicit boundaries: "Always", "Ask First", "Never" rules. Use the
"NOTICED BUT NOT TOUCHING" pattern (in `_shared/scope-discipline.md`) to stay
focused — log improvements outside scope and continue.

**3. Persistent progress**

Context persists across sessions:

- `tasks.md` checkboxes track completion
- `STATE.md` maintains active features
- Archive workflow (in `_shared/archive-workflow.md`) preserves completed work
- Session logs capture decisions and lessons learned

**4. Quality gates**

Each phase has exit criteria — no skipping ahead:

- `/spec` → user approval gate
- `/plan` → design + tasks approval
- `/build` → all done-when criteria pass
- `/test` → evidence collected for all criteria
- `/review` → findings documented and categorized
- `/code-simplify` → tests pass after each simplification
- `/ship` → pre-flight checklist passed

**5. Evidence-based decisions**

Everything is reproducible and verifiable:

- Tests capture acceptance criteria
- Review findings include file:line and severity
- Verification reports include evidence (test output, logs, timing)
- Ship decision includes pre-flight checklist results

---

## Installation

### Option 1: Install all skills globally

```bash
for skill in spec-driven planning incremental-build test-verification \
  code-review code-simplification shipping; do
  npx skills add 90sRehem/agent-skills@$skill -g -y
done
```

### Option 2: Install individual skill

Example: install only planning skill:

```bash
npx skills add 90sRehem/agent-skills@planning -g -y
```

### Option 3: Add installed skills to project

After installing globally, initialize your project:

```bash
cd your-project
npx skills init
npx skills add @local/spec-driven
npx skills add @local/planning
npx skills add @local/incremental-build
npx skills add @local/test-verification
npx skills add @local/code-review
npx skills add @local/code-simplification
npx skills add @local/shipping
```

---

## Contributing

Skills follow the canonical anatomy in `_shared/skill-anatomy.md`. To create a new
skill:

1. Follow the standard structure: Overview → When to Use → Boundaries → Core
   Process → Common Rationalizations → Red Flags → Verification → References
2. Write comprehensive `SKILL.md` documentation
3. Add a slash command entry in `commands/`
4. Reference shared patterns in `_shared/`
5. Include templates and reference materials in `<skill>/references/`

---

## License

Skills are licensed under
[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).

---

## Support and feedback

For questions about a specific skill, refer to that skill's `SKILL.md` file and its
`references/` subdirectory. For general questions or feedback, refer to the project
root documentation.
