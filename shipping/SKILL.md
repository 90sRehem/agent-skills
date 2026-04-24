# shipping

## Overview

This skill gates feature shipping with pre-flight checks and a GO/NO-GO decision. Pre-flight verifies all tasks completed, tests pass, no critical review findings, and no security/performance regressions. Produces a shipping decision with evidence. Use before deploying a feature to production.

---

## When to Use

- Feature is built, tested, and reviewed
- Before shipping to production or merging to main
- You want evidence-based confidence (not just "looks good")
- You want to catch last-minute issues
- User says: `/ship`, "ready to ship", "pre-flight check", "can we ship this"

---

## Boundaries

**Always:**
- Run full pre-flight checklist (4+ items must pass)
- Provide evidence for GO/NO-GO decision
- Check 3 perspectives: Correctness, Security, Performance
- Document any blockers explicitly

**Ask First:**
- Override a failing pre-flight check (why override? what's the risk?)
- Ship without evidence (tests, review, security check)
- Ship without running pre-flight first

**Never:**
- Auto-merge or auto-deploy
- Produce GO without evidence
- Skip security or performance review

---

## Core Process

### Phase 1: Pre-Flight Checklist

**Before shipping, STOP and verify:**

1. **All tasks in tasks.md are [x]** (100% complete)
   - Check: no `- [ ]` unchecked tasks remain
   - Check: no `[BLOCKED: ]` tasks remain
   - If fails: "Cannot ship: X tasks incomplete" → STOP, list incomplete tasks

2. **Tests pass** (ask for test output or run `/test`)
   - Check: full test suite passes
   - If fails: "Cannot ship: tests failing" → STOP, list failing tests

3. **No Critical review findings** (ask for review report or run `/review`)
   - Check: code review completed, no Critical or Major findings
   - If fails: "Cannot ship: Critical findings in review" → STOP, list findings

4. **Feature follows conventions** (vs `docs/conventions.md`)
   - Check: code style consistent, naming conventions followed
   - If fails: "Cannot ship: convention violations" → STOP, list violations

**If ANY item fails → NO-GO. Stop. Report blockers. Do not proceed.**

### Phase 2: Parallel 3-Perspective Review

**If pre-flight passes, assess from 3 perspectives:**

#### Perspective 1: Correctness
- Do acceptance criteria match the spec?
- Are all requirements satisfied?
- Is the feature complete?
- Are error cases handled?

#### Perspective 2: Security
- Any new security vulnerabilities?
- Auth/authz properly enforced?
- Data exposure risks?
- Dependency vulnerabilities?

#### Perspective 3: Performance
- Any performance regressions?
- Scalability concerns?
- Resource usage acceptable?
- Database queries optimized?

### Phase 3: GO/NO-GO Decision

**Merge findings from all 3 perspectives:**

**GO requires:**
- Pre-flight checklist: all 4 items passed ✓
- Correctness: acceptance criteria met, no major gaps ✓
- Security: no new Critical vulnerabilities, auth properly enforced ✓
- Performance: no regressions, scalability acceptable ✓

**NO-GO if any:**
- Pre-flight failed (catch-all gate)
- Correctness: acceptance criteria not met
- Security: new Critical vulnerability found
- Performance: regression or unacceptable scalability risk

**Report**: "GO / NO-GO — Evidence: [summary]"

---

## Pre-Flight Checklist (Detail)

| Item | Check | Pass Criteria | Evidence |
|------|-------|----------------|----------|
| All tasks [x] | Scan tasks.md | No `- [ ]` or `[BLOCKED: ]` | tasks.md dump, completed_count = total_tasks |
| Tests pass | Run test suite | All tests pass | Test output: "X tests pass, 0 fail" |
| No Critical review findings | Run `/review` or request report | No "Critical" or "Major" severity | Review report: findings table |
| Conventions followed | Check vs `docs/conventions.md` | Code style matches project | Code spot-check or linter output |

---

## Common Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "Pre-flight is overkill for this small change" | Ship discipline applies regardless of size. Small changes hide big bugs. |
| "We can fix issues after shipping" | Shipping known issues creates debt immediately. Fix before shipping. |
| "Security review isn't needed for a UI change" | UI changes expose data. Security always. |
| "Tests are slow, let me skip them" | Skipped tests hide regressions. Slow tests should be optimized, not skipped. |
| "I'll ship without pre-flight, it's just this once" | "This once" becomes "every time". Discipline matters. |

---

## Red Flags

- **Any pre-flight item skipped**: Cutcorners in gate → ship unknown quality
- **GO without evidence**: "Trust me it's fine" is not evidence
- **No rollback plan**: If something breaks in production, how do we revert?

---

## Verification

- [ ] Pre-flight checklist run (4+ items checked)
- [ ] All 4 pre-flight items passed
- [ ] 3-perspective assessment completed (Correctness, Security, Performance)
- [ ] GO/NO-GO decision made with evidence
- [ ] Evidence documented (checklist, test output, review report, assessment summary)
- [ ] User informed of decision and next steps

---

## References

- `/plan` — Planning phase (produces feature requirements)
- `/build` → `/test` → `/review` — Execution phases
- `/review` — Code review (5-axis review, security/performance assessment)
- `_shared/archive-workflow.md` — Archive workflow after ship (if successful)
