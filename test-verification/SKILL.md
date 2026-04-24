# test-verification

## Overview

This skill verifies features against acceptance criteria and uses the Prove-It pattern to fix bugs. Two modes: Feature verification (collect evidence for each acceptance criterion) and Prove-It bug mode (reproduce → write failing test → fix → verify). Use it when you need to test a feature's acceptance criteria or diagnose and fix a bug with reproducible proof.

---

## When to Use

- Feature is built; you need to verify it against acceptance criteria
- A bug report comes in; you need to reproduce it and prove the fix
- You want evidence-based verification (not just "it works")
- User says: `/test`, `/test <feature>`, "verify feature", "test this", "prove it works", "test bug: ..."

---

## Boundaries

**Always:**
- Collect evidence for every acceptance criterion (test output, log, screenshot, return value)
- Write tests for bugs (Prove-It pattern): reproduce → failing test → fix → passing test
- Flag any criterion that is vague or untestable (escalate to author)
- Run full test suite after changes to check for regressions

**Ask First:**
- Mark a criterion as "manual-only" (cannot be automated; what evidence do you have?)
- Skip a criterion or "trust me it works"
- Test an acceptance criterion that contradicts the spec

**Never:**
- Modify acceptance criteria to make them easier to test
- Skip evidence collection and declare "it works"
- Fix code without a failing test that reproduces the bug
- Deploy without running tests

---

## Core Process: Feature Verification Mode

1. **Load spec.md and tasks.md**: Read `.specs/features/<name>/spec.md` (acceptance criteria) and `.specs/features/<name>/tasks.md` (done-when criteria).

2. **Extract all criteria**: Collect every acceptance criterion and every done-when checkbox. These are what must be verified.

3. **For each criterion**: 
   - Understand what it's testing (e.g., "User can reset password in <2 minutes")
   - Write or run a test that captures this criterion
   - Collect evidence: test output, log output, timing, error message, etc.

4. **Document evidence**: Create a verification report table: Criterion → Evidence → PASS/FAIL

5. **Produce verification report**: Present to user: "All criteria verified: ✓ 8/8 pass"

**Example criteria verification:**

| Acceptance Criterion | Test | Evidence | Result |
|-----|------|----------|--------|
| "User can reset password" | POST /auth/reset with email → receives reset link | `<a href="...reset?token=xyz">` in email | ✓ PASS |
| "Reset link expires in 1 hour" | Click reset link after 61 minutes | 410 Gone response | ✓ PASS |
| "New password must differ from old" | POST /reset with old password as new | 400 Bad Request: "New password must differ" | ✓ PASS |

---

## Core Process: Prove-It Bug Mode

**Trigger**: User says `/test bug: <description>`

**Steps** (reference: `test-verification/references/prove-it-pattern.md`):

1. **Reproduce**: Find the exact input/state that triggers the bug. Write it down.

2. **Write failing test**: Create a test that captures exactly this scenario. Run it. It should fail.

3. **Confirm failure**: Run test → should get the bug (error, wrong output, crash, etc.)

4. **Fix**: Implement the minimal fix. Do NOT change anything else.

5. **Confirm passing**: Run test → should pass ✓

6. **Regression check**: Run full test suite → nothing else broke

**Example Prove-It session:**

```
User: "I found a bug: user password resets aren't working"

Agent: Let me reproduce it.
  [Tries POST /auth/reset with valid email]
  [Follows reset link in email]
  [Gets 500 Internal Server Error when submitting new password]
  
Agent: Reproduced! Now I'll write a failing test.
  [Writes test: "POST /reset with valid token and new password → returns 200"]
  [Runs test → FAIL: "TypeError: resetToken is undefined"]
  
Agent: Test confirms the bug. Now fixing...
  [Examines code: resetToken not extracted from request body]
  [Adds: const resetToken = req.body.token]
  
Agent: Rerunning test...
  [Test passes ✓]
  
Agent: Full regression check...
  [npm test → 142 tests pass, 0 fail]
  
Agent: ✓ Bug fixed and verified. No regressions.
```

---

## Common Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "I tested it manually and it works" | Manual tests aren't reproducible. Write it down or write a test. |
| "This criterion is too vague to test" | Surface this to the author — vague criteria are unverifiable by definition. |
| "All the important cases pass, some edge cases can wait" | Edge cases are where bugs live. Test them now. |
| "The tests are slow, let me skip some" | Skipped tests hide bugs. Slow tests should be optimized, not skipped. |
| "I fixed the bug, trust me" | No. Prove it with a test that reproduces the bug and now passes. |

---

## Red Flags

- **No evidence collected**: Criterion declared "pass" with no supporting evidence
- **Criteria skipped or marked N/A**: If it's in the spec, it must be verified
- **Bug fixed without a reproducing test**: How do you know it's actually fixed?
- **Manual testing only**: Not reproducible; write a test
- **Test suite skipped or not run**: Regressions hide here

---

## Verification

- [ ] spec.md read and all acceptance criteria identified
- [ ] tasks.md read and all done-when criteria identified
- [ ] For each criterion: test written or run
- [ ] For each criterion: evidence collected (output, log, screenshot, etc.)
- [ ] Verification report produced (all criteria listed with evidence)
- [ ] All criteria pass (or gaps documented with escalation)
- [ ] Full test suite run → no regressions
- [ ] Bug fix (Prove-It mode): failing test written, bug reproduced, fix applied, test passing

---

## References

- `test-verification/references/prove-it-pattern.md` — 5-step pattern for bug verification
- `/build` — Previous phase (produces working code)
- `/review` — Next phase (code quality review)
- `/ship` — Final phase (pre-flight checks before shipping)
