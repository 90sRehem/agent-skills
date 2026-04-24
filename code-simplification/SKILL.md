# code-simplification

## Overview

This skill identifies and applies simplification opportunities to reduce complexity. Scan for duplication, over-abstraction, dead code, complex conditionals, and unnecessary indirection. Apply one simplification at a time, verify behavior unchanged, log noticed improvements. Use when you want to clean up code without adding features.

---

## When to Use

- Code is working but has redundancy, over-engineering, or unnecessary complexity
- You want to reduce cognitive load on the next engineer
- You want to improve maintainability without behavior change
- Codebase drift has created inconsistent patterns
- User says: `/code-simplify`, "/code-simplify <file>", "reduce complexity", "clean up code", "refactor"

---

## Boundaries

**Always:**
- Read `docs/conventions.md` first (what patterns are preferred in this codebase)
- Apply one simplification at a time (propose, get approval, execute)
- Verify behavior unchanged after each simplification (run tests)
- Log any noticed improvements outside scope using NOTICED BUT NOT TOUCHING (reference: `_shared/scope-discipline.md`)
- Maintain test coverage (if simplifying tested code, tests should still pass)

**Ask First:**
- Remove public APIs or functions used elsewhere
- Change function signatures or parameter order
- Rename widely-used symbols across multiple files
- Inline code that's referenced in documentation

**Never:**
- Change observable behavior
- Add new features
- Skip post-change verification

---

## Core Process

1. **Read conventions**: Load `docs/conventions.md` to understand project's preferred patterns and style.

2. **Identify target**: Either explicit file/module from user, or auto-detect from recently changed files (if user says `/code-simplify` without args).

3. **Scan for opportunities**: Reference `code-simplification/references/simplification-patterns.md` for 6 patterns:
   - Extract duplication: same logic in 2+ places → extract to function
   - Inline unnecessary abstraction: wrapper adds no value → inline call
   - Remove dead code: unreachable or unused → delete
   - Simplify complex conditionals: nested if/else → guard clauses + early returns
   - Reduce indirection: unnecessary wrapper/delegate → remove layer
   - Replace imperative with declarative: manual loop → map/filter

4. **Rank opportunities**: By impact (high/medium/low) and risk (breaking change vs non-breaking).

5. **Apply one at a time**: For each opportunity:
   - Propose the change: show before/after
   - Wait for implicit or explicit approval
   - Execute the simplification
   - Run tests: confirm behavior unchanged
   - Report: "✓ Simplified X, behavior unchanged, tests pass"

6. **Verify after each**: Always run tests. Each simplification can break something unrelated.

7. **Log noticed improvements**: If you spot further improvements outside this simplification session, use NOTICED BUT NOT TOUCHING pattern (reference: `_shared/scope-discipline.md`). Log and continue.

---

## Common Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "I'll batch all simplifications then test" | Batched changes create untraceable failures. One at a time, test after each. |
| "The tests are passing, I don't need to run them again" | Each simplification can break something unrelated. Always test after change. |
| "I'll also fix this bug I noticed" | NOTICED BUT NOT TOUCHING. Log it and continue with simplification scope. |
| "This duplication is not worth extracting, too small" | Small duplication compounds into large tech debt. Extract it. |
| "Refactoring code is wasting time, we should add features" | Unmaintainable code slows feature development more than time spent simplifying. |

---

## Red Flags

- **Behavior changed after simplification**: Simplification is not behavior-preserving; revert and try again
- **Test failures after change**: One simplification broke something; isolate and fix
- **Multiple changes applied before testing**: Too risky; revert and do one at a time
- **Public API changed without approval**: Breaks callers; needs coordination
- **Dead code "removed" but still referenced**: Incomplete removal; check all usages first

---

## Verification

- [ ] `docs/conventions.md` loaded and understood
- [ ] Target file/module identified
- [ ] Opportunities scanned and ranked
- [ ] Simplifications applied one at a time
- [ ] Tests run after each simplification → all pass
- [ ] Behavior verified unchanged (not just "tests pass")
- [ ] NOTICED BUT NOT TOUCHING used for out-of-scope improvements
- [ ] User informed of simplifications applied and impact

---

## References

- `code-simplification/references/simplification-patterns.md` — 6 patterns with before/after examples
- `_shared/scope-discipline.md` — NOTICED BUT NOT TOUCHING pattern
- `docs/conventions.md` — Project coding standards
- `/review` — Previous phase (code quality review)
- `/build` — Implementation phase (if new features needed alongside simplification)
