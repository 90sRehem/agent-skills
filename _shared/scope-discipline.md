# Scope Discipline Reference

## The "NOTICED BUT NOT TOUCHING" Pattern

**Definition:**

During execution (/build, /code-simplify, /review), developers notice improvements, refactoring opportunities, bugs, or architectural issues that are OUT OF SCOPE for the current feature. Instead of implementing them immediately, **log them and continue**.

**Why:** Scope discipline prevents feature creep, session overrun, and context loss. Each feature has defined tasks and acceptance criteria. Diverging from those criteria:
1. Makes the session longer (delays delivery)
2. Risks breaking unrelated code (untested changes)
3. Makes the feature harder to review (more changes = harder review)
4. Loses focus on the original goal (confuses what we're building)

**Mental Pattern:**
- ✓ "This refactoring would improve readability" → Log it. Continue.
- ✓ "That test is flaky, I should fix it" → Log it. Continue.
- ✓ "This error message could be clearer" → Log it. Continue.
- ✗ "I'll also refactor this module while I'm here" → Stop. This is scope creep.

---

## When to Apply

**Apply NOTICED BUT NOT TOUCHING during:**

- `/build` (incremental-build skill) — when executing tasks
- `/code-simplify` (code-simplification skill) — when identifying opportunities
- `/review` (code-review skill) — when reviewing code

**Not during:**
- `/spec` — specification should not produce code, so nothing to notice
- `/plan` — planning should not produce code, so nothing to notice
- `/test` — verification tests specific acceptance criteria, not general improvements
- `/ship` — shipping is a gate, not an execution phase (no new code)

---

## How to Log Noticed Items

### In tasks.md

Append a new section at the bottom of the tasks.md file:

```markdown
## Noticed (Not Acting On)

Items identified during execution but deferred for future work:

- [<date>] <description> — noticed during <task-id> (reason: <why defer>)
- [<date>] <description> — noticed during <task-id> (reason: <why defer>)
```

**Example:**

```markdown
## Noticed (Not Acting On)

Items identified during execution but deferred for future work:

- [2026-04-24] Refactor user service to use dependency injection — noticed during 3.1 (reason: out of scope, improves architecture but not required by spec)
- [2026-04-24] Add unit tests for utils/validation.ts — noticed during 4.2 (reason: these tests failed once before, should be added but not in this feature's scope)
- [2026-04-24] Error messages in auth middleware could be more descriptive — noticed during 2.3 (reason: UX improvement but not required by acceptance criteria)
```

### In Session Log

When writing a session log (during archive), include a section:

```markdown
## Noticed But Not Acting On

- <description> (observed while <task>)
- <description> (observed while <task>)
```

---

## Concrete Examples

### Example 1: Refactoring Temptation During Build

**Scenario:** You're implementing a feature that requires modifying `src/users/service.ts`. While reading the file, you notice it's 500 lines long and could be split into 3 smaller files. The refactoring would improve maintainability.

**WRONG (scope creep):**
```
"I'll split this file into 3 modules first, then implement my feature."
```
✗ This adds 2-3 hours of refactoring to the feature scope.

**RIGHT (scope discipline):**
```
"I notice this file is large and could be refactored. I'll add this to the 
session log and continue implementing my feature."
```

**Log Entry:**
```markdown
- [2026-04-24] Refactor users/service.ts (500 lines) into separate modules — 
  noticed during 3.2 (reason: improves maintainability but not required by spec)
```

✓ You document the opportunity, stay focused on the feature, and ship on time.

---

### Example 2: Missing Tests Noticed While Building

**Scenario:** You're implementing feature X. During `/build`, you examine `src/utils/validation.ts` (which your feature uses). You notice it has no unit tests, and you know from experience that this module has had bugs before.

**WRONG (scope creep):**
```
"I'll add comprehensive tests for validation.ts first, then continue with my feature."
```
✗ This adds 30-60 min of testing to the feature scope, delays delivery.

**RIGHT (scope discipline):**
```
"I notice validation.ts lacks unit tests. This is important but out of scope 
for this feature. I'll log it as a noticed item and continue."
```

**Log Entry:**
```markdown
- [2026-04-24] Add unit tests for utils/validation.ts — noticed during 4.1 
  (reason: module has history of bugs, tests needed but not in this feature's scope)
```

✓ You surface the issue for future work, stay focused on your feature, and ship on time.

---

### Example 3: Better Error Messages Noticed During Code Review

**Scenario:** You're reviewing code during `/code-simplify`. You notice an error message in the auth middleware that says "Invalid token" but doesn't explain whether the token was expired, malformed, or missing. You could improve the error message to help users debug faster.

**WRONG (scope creep):**
```
"While simplifying this code, I'll also improve these error messages."
```
✗ This changes scope and makes the review about multiple concerns (simplification + UX).

**RIGHT (scope discipline):**
```
"I notice the error messages could be more descriptive. This is a UX improvement 
but out of scope for code-simplify. I'll log it."
```

**Log Entry:**
```markdown
- [2026-04-24] Improve error messages in auth/middleware.ts (e.g., "Invalid token" → 
  explain cause: expired, malformed, missing) — noticed during 2.3 
  (reason: UX improvement but not in code-simplify scope)
```

✓ You identify a valuable improvement, stay focused on simplification, and document the opportunity.

---

## Creating Deferred Work from Noticed Items

**After a session completes:**

1. Review all items in "Noticed But Not Acting On"
2. For high-priority items, create new features in `.specs/features/<name>/spec.md`
3. Add to STATE.md → Deferred Items section
4. Link to the original feature where it was noticed

**Example:**

After lifecycle-commands feature completes, review noticed items:

```markdown
## Noticed (Not Acting On)

- [2026-04-24] Automate archive workflow with shell script — noticed during 10.1
- [2026-04-24] Create graphify integration for STATE.md visualization — noticed during 1.3
```

**Deferred Items in STATE.md:**
```markdown
## Deferred Items

- Automate archive workflow with shell script (noticed during lifecycle-commands; would improve workflow)
- Create graphify integration for STATE.md visualization (nice-to-have dashboard; current manual tracking sufficient)
```

**Future:** When ready, `/spec` a new feature "archive-automation" or "state-graphify-dashboard".

---

## Rationale: Why This Matters

### Session Velocity
- **Focused scope** → Ship feature faster → User gets value sooner
- **Scope creep** → Feature takes 2x longer → User waits longer

### Code Quality
- **Focused scope** → Reviewer understands changes → Faster review
- **Scope creep** → Reviewer sees unrelated changes → Slower review + confusion

### Testing & Confidence
- **Focused scope** → Tests cover feature spec → High confidence
- **Scope creep** → Tests scattered across concerns → Low confidence, higher risk

### Maintainability
- **Focused scope** → Commit message is clear → Git history is clear
- **Scope creep** → Commit message is vague → Git history is confusing

---

## Anti-Patterns: What NOT to Do

❌ **"I'll just quickly fix this too"**
- This is scope creep dressed up as efficiency
- "Quick" usually takes longer than expected
- Makes the feature review harder

❌ **"The tests are failing, let me fix them"**
- If tests are failing because of your feature → they're in scope
- If tests are failing for unrelated reasons → log and continue
- Don't let unrelated issues block your feature

❌ **"I can't ship this with that bug visible"**
- If the bug is in your feature → fix it (in scope)
- If the bug is elsewhere → log it, ship your feature, file a separate bug (out of scope)
- Don't let other people's bugs block your delivery

---

**End of Scope Discipline Reference**

Use this pattern to stay focused and deliver features on time.
