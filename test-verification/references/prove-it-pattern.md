# Prove-It Pattern

**Philosophy:** "Don't tell me the bug is fixed. Prove it."

This pattern ensures bugs are reproducible, fixes are verifiable, and regressions don't hide.

---

## The 5-Step Process

### Step 1: Reproduce

**Goal**: Find the exact input/state that triggers the bug. Document it precisely.

**What to do:**
1. Read the bug report carefully
2. Try to recreate it step-by-step
3. Isolate the minimal reproduction case (what's the smallest input that triggers it?)
4. Write down the exact steps, inputs, and environment

**Example:**

```
Bug Report: "Password reset link doesn't work"

Reproduction:
1. POST /auth/reset with email: user@example.com
2. Check email → find reset link
3. Click link → redirected to /reset-password?token=abc123
4. Enter new password: "newpassword123"
5. Click "Reset Password" button
6. Expected: "Password reset successfully" message
7. Actual: 500 Internal Server Error

Environment: localhost, Node v16, PostgreSQL 13
```

**Why this step matters:**
- Proves the bug is real and reproducible
- Gives the fixer exact steps to follow
- Enables writing a precise test

---

### Step 2: Write Failing Test

**Goal**: Create a test that captures the bug exactly and fails before the fix.

**What to do:**
1. Write a test that follows the reproduction steps
2. The test should fail (not pass)
3. The test should capture the expected vs actual behavior
4. Run it once to confirm it fails with the bug

**Example:**

```typescript
describe('Password Reset', () => {
  it('should reset password with valid reset token', async () => {
    // Step 1: Request password reset
    const resetRes = await request(app)
      .post('/auth/reset')
      .send({ email: 'user@example.com' });
    
    // Extract token from email (mocked in test)
    const token = resetRes.body.resetToken;
    
    // Step 2: Submit new password with token
    const changeRes = await request(app)
      .post('/auth/reset-password')
      .send({ 
        token: token, 
        newPassword: 'newpassword123' 
      });
    
    // Step 3: Verify success
    expect(changeRes.status).toBe(200);
    expect(changeRes.body.message).toContain('Password reset successfully');
  });
});
```

**Run the test:**

```
$ npm test -- password-reset.test.ts
FAIL  password-reset.test.ts
  Password Reset
    ✕ should reset password with valid reset token

  Error: expected 500, got 500 (POST /auth/reset-password)
  TypeError: Cannot read property 'token' of undefined
```

Good! The test fails with the bug.

---

### Step 3: Confirm Failure

**Goal**: Verify that the test fails in the expected way (the bug is captured).

**What to check:**
- [ ] Test runs and fails (not passes)
- [ ] Failure message matches the bug description
- [ ] Error is in the expected place (not a test setup issue)

**If test passes:** You may have misunderstood the bug. Go back to Step 1 and reproduce more carefully.

**If test fails with a different error:** You may be testing the wrong thing. Review the reproduction steps and test again.

---

### Step 4: Fix

**Goal**: Implement the minimal fix. Do NOT refactor, optimize, or add new features.

**What to do:**
1. Identify the root cause from the test failure and error message
2. Implement the smallest change that fixes the bug
3. Do NOT change anything else

**Example:**

```typescript
// BEFORE (buggy)
app.post('/auth/reset-password', (req, res) => {
  const { newPassword } = req.body; // ❌ token is never extracted!
  // ... rest of code
});

// AFTER (fixed)
app.post('/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body; // ✓ token extracted
  // ... rest of code
});
```

**Do NOT do this:**

```typescript
// ❌ WRONG: Adding too much
app.post('/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  
  // Also refactor error handling, add logging, add rate limiting...
  // TOO MUCH! Just fix the bug.
});
```

---

### Step 5: Confirm Passing + Regression Check

**Goal**: Verify the fix works and nothing else broke.

**Run the failing test:**

```
$ npm test -- password-reset.test.ts
PASS  password-reset.test.ts
  Password Reset
    ✓ should reset password with valid reset token
```

Great! The test passes.

**Run full test suite:**

```
$ npm test
PASS  (all tests)
  142 tests pass
  0 tests fail
```

Perfect! No regressions.

---

## When to Use Prove-It

✓ **Use Prove-It for:**
- Bug reports: "feature X doesn't work"
- Flaky behavior: "sometimes works, sometimes doesn't"
- Regressions: "this used to work"
- "Works on my machine" claims: prove it works everywhere
- Customer issues: reproducible failure in production

---

## Anti-Pattern: Skipping Prove-It

❌ **Do NOT:**
```
"I looked at the code and I can see the bug. I fixed it. Trust me."
```

This is how bugs come back and nobody knows.

✓ **DO:**
```
1. Reproduce the bug (exact steps)
2. Write a failing test (proves bug exists)
3. Fix the code (minimal change)
4. Run test (should pass)
5. Run full suite (confirm no regressions)
→ Proof: [test passes, no regressions]
```

---

## Example: Full Prove-It Session

**Bug Report:** "User login with special characters in password fails"

**Step 1: Reproduce**
```
Input: email=user@example.com, password="p@$$w0rd!"
Expected: Login succeeds, returns JWT
Actual: 400 Bad Request: "Invalid password format"

Password contains: @ $ $ 0 ! (special characters)
```

**Step 2: Write failing test**
```typescript
it('should allow login with special characters in password', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ 
      email: 'user@example.com', 
      password: 'p@$$w0rd!' 
    });
  
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
});
```

Run: `npm test` → FAIL

**Step 3: Confirm failure**
```
Error: expected 200, got 400
Response: "Invalid password format"
```

Good, test captures the bug.

**Step 4: Fix**

Look at password validation in the code:
```typescript
// BEFORE (buggy)
const isValidPassword = (pwd) => /^[a-zA-Z0-9]+$/.test(pwd); // ❌ No special chars!

// AFTER (fixed)
const isValidPassword = (pwd) => pwd.length >= 8; // ✓ Allow special chars
```

**Step 5: Confirm passing**

```
$ npm test -- login.test.ts
PASS  login.test.ts
  ✓ should allow login with special characters in password

$ npm test
PASS  (all tests)
  157 tests pass, 0 fail
```

**Result**: Bug fixed, proven, no regressions.

---

**End of Prove-It Pattern**

Use this pattern for every bug. It's how you know the fix is real.
