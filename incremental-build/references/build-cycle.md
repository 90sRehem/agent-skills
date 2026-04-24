# Build Cycle: Task Execution Micro-Cycle

This document describes the task execution micro-cycle: the repeated pattern for each task in `/build`.

## The 6-Step Cycle (Per Task)

### Step 1: Read Task Definition

From tasks.md, extract:
- **What**: 2-3 sentence description of the work
- **Files**: List of files to create or modify
- **Done when**: Acceptance criteria (checkboxes)

**Example:**
```markdown
- [ ] 3.1 Implement user login endpoint
  - What: Create POST /auth/login endpoint that accepts email/password, validates against database, returns JWT token on success or 401 on failure
  - Files: src/routes/auth.ts (modify), src/services/auth.service.ts (modify), tests/auth.test.ts (new)
  - Done when:
    - [ ] POST /auth/login accepts email and password
    - [ ] Returns 200 + JWT on correct credentials
    - [ ] Returns 401 on incorrect credentials
    - [ ] Tests pass
    - [ ] Linting passes
```

### Step 2: Implement Minimal Code

Edit the files listed in "Files":
- Create new files if marked "(new)"
- Modify existing files if marked "(modify)"
- Implement just enough to satisfy the done-when criteria
- Do NOT implement extra features, refactoring, or "nice-to-haves"

**Example (wrong):**
```typescript
// TOO MUCH: also adds password hashing, rate limiting, audit logging, email verification
export async function login(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  const user = await db.users.findOne({ email, passwordHash: hashedPassword });
  if (!user) {
    await logAuditEvent('login_failure', { email });
    throw new UnauthorizedError('Invalid credentials');
  }
  if (await isRateLimited(email)) {
    throw new RateLimitError('Too many attempts');
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  await sendVerificationEmail(user.email);
  return token;
}
```

**Example (right):**
```typescript
// MINIMAL: just validate and return token
export async function login(email: string, password: string) {
  const user = await db.users.findOne({ email });
  if (!user || user.passwordHash !== password) { // TODO: use bcrypt in real code
    throw new UnauthorizedError('Invalid credentials');
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  return token;
}
```

The first approach has 4 extra concerns. Each should be a separate task.

### Step 3: Write/Run Tests

**If code is <100 lines:** Proceed to step 4 (tests for small code are quick).

**If code is ~100 lines without tests:** STOP HERE. This is a red flag.
- Write tests NOW before continuing
- Tests capture what the code should do
- Tests prevent unrelated failures in the next task

**What to test:**
- Happy path: correct input → expected output
- Error path: invalid input → expected error
- Boundary cases: edge cases mentioned in done-when

**Example tests:**
```typescript
describe('POST /auth/login', () => {
  it('returns 200 + JWT on correct credentials', async () => {
    const res = await request(app).post('/auth/login')
      .send({ email: 'user@example.com', password: 'correct' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('returns 401 on incorrect password', async () => {
    const res = await request(app).post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('returns 401 on nonexistent user', async () => {
    const res = await request(app).post('/auth/login')
      .send({ email: 'nobody@example.com', password: 'anything' });
    expect(res.status).toBe(401);
  });
});
```

### Step 4: Verify All Done-When Criteria

For each bullet in "Done when":
- [ ] {{Criterion}}

Execute the verification:
- Run tests → should pass ✓
- Run linter → should pass ✓
- Manual check → should confirm ✓

**If any criterion fails:** Fix code, re-run tests, verify again.

**Do NOT proceed to step 5 until ALL criteria pass.**

### Step 5: Write [x] to tasks.md + Update Frontmatter

**IMMEDIATELY** edit tasks.md (on disk):

1. Change checkbox: `- [ ]` → `- [x]`
2. Update frontmatter:
   - `last-completed: <task-id>` (e.g., "3.1")
   - `updated: <today>` (ISO date, e.g., "2026-04-24")
   - `completed_count: <N>` (increment by 1)
   - `status: in-progress` (or `completed` if all tasks done)

**Example before:**
```yaml
---
feature: auth-service
status: in-progress
created: 2026-04-24
last-completed: 2.3
updated: 2026-04-24
total_tasks: 12
completed_count: 3
---
```

**Example after:**
```yaml
---
feature: auth-service
status: in-progress
created: 2026-04-24
last-completed: 3.1
updated: 2026-04-24
total_tasks: 12
completed_count: 4
---
```

**WRITE TO DISK** — This is critical. If the session ends here, the next session sees [x] and resumes from task 3.2.

### Step 6: Report Completion

Tell the user: "✓ Task 3.1 complete: Implement user login endpoint. [4/12 done]"

---

## The 100-Line Rule

**When code reaches ~100 lines without tests, STOP.**

### Why?

- 100 lines of untested code is risky
- Each additional line written makes testing harder
- You lose context if session interrupts
- Tests serve as documentation

### What to do?

1. Stop writing new code
2. Write tests for what you have
3. Run tests (should pass)
4. Then continue with the next task

### Example:

```
User: /build
Agent: Starting task 4.1: Create dashboard service
  [writes code]
  [reaches 97 lines, working fine, want to add more]
  ~100 lines threshold hit
Agent: STOP. Writing tests before continuing.
  [writes 8 tests]
  [runs tests — all pass]
Agent: Tests complete. Marking task done. [✓ Task 4.1 complete]
  [immediately marks [x], updates frontmatter, writes disk]
Agent: Next task is 4.2: Add error handling to dashboard service
```

---

## Commit Message Format

After marking [x] and updating tasks.md, **optionally** commit the changes.

**Format:**
```
feat(<scope>): <task-title> [task-<id>]

<description if needed>
```

**Example:**
```
feat(auth): implement user login endpoint [task-3.1]

- Create POST /auth/login endpoint
- Accept email/password, return JWT on success
- Return 401 on invalid credentials
- Add unit tests
- All done-when criteria verified
```

**Why include [task-<id>]?** Makes it easy to trace commits back to tasks.

---

## When Code Reaches Task Scope Boundary

**Scenario:** You're implementing a task. You finish the code. Then you notice something else that could be improved (different task, different scope).

**RIGHT:**
```
Mark [x], move to next task. Document the improvement in "Noticed But Not Acting On" section (see _shared/scope-discipline.md).
```

**WRONG:**
```
"While I'm here, I'll also refactor that module" → scope creep, delays shipping.
```

---

**End of Build Cycle Reference**

Repeat this cycle for each task in tasks.md. One task at a time, verify before marking [x], write [x] immediately.
