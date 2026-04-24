# Vertical Slicing Reference

## Definition

A **vertical slice** is a thin, end-to-end slice of a feature that delivers one user-visible behavior through all layers (API → business logic → data → UI → tests).

Contrast with **horizontal slicing** (API layer tasks, then logic layer tasks, then database tasks) — vertical slicing is preferred.

---

## Benefits

### 1. Earlier Feedback

- Can test after task 1 (end-to-end), not waiting for all layers
- Users see value sooner
- Catch integration issues early

### 2. Smaller PRs

- Fewer files per task → easier code review
- Faster review cycle → faster merging
- Lower risk of merge conflicts

### 3. Independently Testable

- Each slice is a complete feature
- Can write comprehensive tests for one slice
- No stub/mock dependencies on unfinished layers

### 4. Better for Parallel Work

- If team grows, can assign slices to different people
- Slices have clear boundaries
- Less coordination needed between tasks

---

## How to Create a Vertical Slice

**Step 1: Pick One User-Visible Behavior**

From the spec.md acceptance criteria, identify a single, concrete behavior:

❌ **Wrong (too broad)**: "User authentication"
✓ **Right (one behavior)**: "User can log in with email and password"

❌ **Wrong (too broad)**: "Dashboard"
✓ **Right (one behavior)**: "Dashboard displays user's last 5 completed tasks"

**Step 2: Trace Through All Layers**

Map the path from user input → system output:

```
User Input (UI)
    ↓
API Endpoint (HTTP handler)
    ↓
Business Logic (service function)
    ↓
Data Access (database query)
    ↓
System Response (JSON, redirect, etc.)
    ↓
User Sees Result (UI update, page load, etc.)
```

**Step 3: Create One Task for the Full Slice**

One task covers ALL these layers for THIS ONE behavior. Do not split by layer.

**Example Task:**
```
Task: "User can log in with email and password"
  - Create POST /auth/login endpoint (API)
  - Implement login service: validate credentials, create session (Logic)
  - Query user by email, verify password (Data)
  - Return session token or error (API response)
  - Write integration test: login with correct credentials → token received
  - Write integration test: login with wrong password → 401 error
```

**Step 4: Done When**

Each vertical slice's "Done when" criteria include:
- Feature works end-to-end (tested)
- Tests pass (not just manual verification)
- No stub dependencies (no "TODO: implement later" in service layer)

---

## Anti-Pattern: Horizontal Slicing

❌ **Wrong**: Organize tasks by layer:

```
Task 1: Create /auth/login endpoint
Task 2: Implement login service
Task 3: Add user.email index to database
Task 4: Write tests
```

**Problem**: After task 1, you can't test anything (endpoint exists but no logic). After task 2, you still can't call it (endpoint might not be calling the service). Task 4 is deferred, so nothing is truly verified until the end.

---

## Example: Feature with Multiple Slices

**Feature**: "User dashboard with task list"

**Acceptance Criteria**:
- User can view their dashboard
- Dashboard displays user's completed tasks
- Dashboard displays pending tasks
- User can filter tasks by status

**Vertical Slices**:

### Slice 1: User can view their dashboard
- API endpoint: GET /dashboard
- Service: fetch user dashboard data
- Database: query user dashboard metadata
- Tests: authenticated request returns 200, contains expected fields

### Slice 2: Dashboard displays completed tasks
- API endpoint: GET /dashboard/tasks?status=completed
- Service: fetch completed tasks for user
- Database: query tasks WHERE status='completed' AND user_id=X
- Tests: request with completed status returns list of completed tasks

### Slice 3: Dashboard displays pending tasks
- API endpoint: GET /dashboard/tasks?status=pending
- Service: fetch pending tasks for user
- Database: query tasks WHERE status='pending' AND user_id=X
- Tests: request with pending status returns list of pending tasks

### Slice 4: User can filter tasks by status
- API endpoint: GET /dashboard/tasks?status={{status}}
- Service: parameterize task fetch by status
- Database: generic query (already done in slices 2 & 3)
- Tests: filter parameter correctly filters results

**Each slice is independent and testable**. Each can be reviewed and merged separately (if PRs are organized that way).

---

## Recognizing Vertical Slices vs Horizontal

| Aspect | Vertical Slice | Horizontal Slice |
|--------|---|---|
| **Scope** | One user-visible behavior | One technical layer |
| **Example** | "User can reset password" | "Create password reset API endpoint" |
| **Testable?** | Yes (end-to-end) | No (needs other layers) |
| **Value delivered** | User sees something work | Partial infrastructure |
| **Review effort** | Low (focused change) | High (depends on other slices) |

---

## Edge Cases: When Horizontal Slicing is OK

In rare cases, horizontal slicing is acceptable:

- **Infrastructure setup**: If you must create shared utilities before any feature can work (e.g., database schema, authentication middleware), a "setup" task that touches multiple layers is OK. But it should be followed by vertical slices that use it.
- **Cross-cutting changes**: If multiple features need a refactored module, one "refactor X module" task is OK. But follow with vertical slices that use the refactored module.

**Rule of thumb**: If a task doesn't deliver user-visible value on its own, ask if it's truly necessary as a separate task. Often it can be bundled with the first vertical slice that uses it.

---

**End of Vertical Slicing Reference**

Apply vertical slicing during planning (task 3.1) to create small, independently testable tasks.
