# Review Axes Reference

The 5 axes for structured code review. For each axis, understand the definition, common issues, and typical severity.

---

## 1. Correctness

**Definition**: Does the code do what it's supposed to do? Are there logic errors, off-by-one bugs, missing error handling, or edge cases?

**Checklist** (what to look for):
- [ ] Logic errors: wrong operator, inverted condition, unreachable code
- [ ] Off-by-one errors: array bounds, loop limits, string slicing
- [ ] Missing error handling: null checks, exception handling, validation
- [ ] Edge cases: empty input, max/min values, boundary conditions
- [ ] State management: race conditions, stale state, mutations

**Common Issues**:
- Null pointer dereference: accessing `.property` on undefined
- Array index out of bounds: loop doesn't check length
- Missing validation: accepting user input without checking format
- Wrong comparison: `=` instead of `==` / `===`
- Unreachable code: return statement before other code

**Typical Severity**:
- **Critical**: Logic bug causing wrong behavior, data loss, or crash
- **Major**: Missing validation, edge case not handled
- **Nit**: Redundant check, inefficient pattern

**Example:**

```typescript
// ❌ WRONG (Correctness issue: missing null check)
function getUserAge(userId: string) {
  const user = db.users.findById(userId);
  return user.age; // CRASH if user is null!
}

// ✓ RIGHT (Error handling)
function getUserAge(userId: string) {
  const user = db.users.findById(userId);
  if (!user) throw new NotFoundError('User not found');
  return user.age;
}
```

---

## 2. Security

**Definition**: Does the code expose security vulnerabilities? Are there injection risks, missing auth checks, data exposure, or unsafe operations?

**Checklist** (what to look for):
- [ ] Injection vulnerabilities: SQL injection, command injection, XSS
- [ ] Missing auth/authz checks: protecting endpoints, data access
- [ ] Data exposure: sensitive data in logs, errors, or responses
- [ ] Unsafe deserialization: arbitrary code execution risk
- [ ] Cryptography: weak algorithms, hardcoded secrets, improper hashing

**Common Issues**:
- SQL injection: building queries with string concatenation
- XSS: user input rendered without escaping
- Missing auth: endpoint accessible without login check
- Hardcoded secrets: passwords, API keys in code
- Weak password hashing: storing plaintext, using MD5

**Typical Severity**:
- **Critical**: Injection vulnerability, hardcoded secret, missing auth gate
- **Major**: Weak crypto, data exposure, unsafe deserialization
- **Optional**: Security hardening suggestion, defense-in-depth improvement

**Example:**

```typescript
// ❌ WRONG (SQL injection risk)
app.get('/users/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
  db.query(query); // INJECTION RISK!
});

// ✓ RIGHT (Parameterized query)
app.get('/users/:id', (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
});
```

---

## 3. Performance

**Definition**: Will this code scale? Are there N+1 queries, missing indices, unnecessary computation, or memory leaks?

**Checklist** (what to look for):
- [ ] N+1 queries: loop with DB query inside
- [ ] Missing indices: querying large tables without indexes
- [ ] Unnecessary computation: calculations in loops, repeated work
- [ ] Memory leaks: resources not freed, listeners not removed
- [ ] Algorithmic complexity: O(n²) where O(n) is possible

**Common Issues**:
- N+1 queries: `users.map(user => db.posts.find({ userId: user.id }))` — one query per user!
- Missing index: querying `users` by `email` without an email index
- Unnecessary loop: sorting array multiple times in a loop
- Memory leak: event listeners not cleaned up
- Large allocations: loading entire file into memory when streaming

**Typical Severity**:
- **Critical**: N+1 query causing timeout, memory leak, crash
- **Major**: Performance regression, missing index causing slowdown
- **Optional**: Performance optimization, cleaner approach

**Example:**

```typescript
// ❌ WRONG (N+1 query: one DB call per user)
const users = await db.users.find({ status: 'active' });
const usersWithPosts = await Promise.all(
  users.map(user => db.posts.find({ userId: user.id })) // LOOP!
);

// ✓ RIGHT (Single query with join)
const usersWithPosts = await db.users.find({ status: 'active' }).include('posts');
```

---

## 4. Readability

**Definition**: Can the next engineer understand this code? Are names clear? Is it concise? Are comments present where needed?

**Checklist** (what to look for):
- [ ] Naming: variables, functions, classes have clear, intention-revealing names
- [ ] Function length: functions are focused, under 50 lines
- [ ] Nesting depth: max 3 levels of nesting (use guard clauses)
- [ ] Comments: present where logic is non-obvious, outdated comments removed
- [ ] Formatting: consistent indentation, spacing, line length (<100 chars)

**Common Issues**:
- Poor naming: `x`, `data`, `result` — unclear what it is
- Long functions: 200+ lines of nested logic, hard to follow
- Deep nesting: 4+ levels of if/for/while, hard to understand flow
- Missing comments: complex algorithm with no explanation
- Inconsistent style: mixing camelCase and snake_case

**Typical Severity**:
- **Major**: Unclear naming makes code unmaintainable, function too long
- **Nit**: Style inconsistency, missing comment, whitespace issue
- **Optional**: Suggestion for clearer approach

**Example:**

```typescript
// ❌ WRONG (Poor naming, deep nesting, long function)
function f(d) {
  let r = [];
  for (let i = 0; i < d.length; i++) {
    if (d[i].s) {
      if (d[i].a > 10) {
        if (d[i].t === 'active') {
          r.push(d[i]);
        }
      }
    }
  }
  return r;
}

// ✓ RIGHT (Clear names, guard clauses, readable)
function getActiveUsersAboveThreshold(users) {
  return users.filter(user => {
    if (!user.status) return false;
    if (user.age <= 10) return false;
    if (user.type !== 'active') return false;
    return true;
  });
}
```

---

## 5. Architecture

**Definition**: Does this code fit the project architecture? Is there tight coupling, violation of separation of concerns, missing abstraction, or over-engineering?

**Checklist** (what to look for):
- [ ] Separation of concerns: business logic separate from infrastructure, UI from data
- [ ] Coupling: dependencies flow in one direction (no circular dependencies)
- [ ] Abstraction level: right level of detail, not leaking implementation
- [ ] Reusability: logic extracted to shared modules, not duplicated
- [ ] Over-engineering: unnecessary complexity, patterns misapplied

**Common Issues**:
- Tight coupling: feature A hard-coded to depend on feature B
- Circular dependencies: A imports B, B imports A
- Leaky abstraction: implementation details exposed to callers
- Duplication: same logic in 2+ places, not extracted
- Over-engineering: pattern template for simple feature, unnecessary indirection

**Typical Severity**:
- **Major**: Violation of arch principles, tight coupling, circular dependency
- **Nit**: Over-engineered solution, unnecessary abstraction
- **Optional**: Alternative architecture suggestion

**Example:**

```typescript
// ❌ WRONG (Tight coupling: auth service depends on specific database)
class AuthService {
  login(email: string) {
    // Hard-coded to use MongoDB
    const user = MongoDBConnection.users.findOne({ email });
  }
}

// ✓ RIGHT (Dependency injection: decoupled from database)
class AuthService {
  constructor(private userRepository: UserRepository) {}
  
  login(email: string) {
    const user = this.userRepository.findByEmail(email); // DB-agnostic
  }
}
```

---

## Severity Reference

| Severity | Definition | Merge Gate | Examples |
|----------|-----------|-----------|----------|
| **Critical** | Blocks merge; security/data/logic risk | Must fix | SQL injection, auth bypass, data loss, crash |
| **Major** | Should fix before merge; architectural violation | Should fix | N+1 query, perf regression, tight coupling, missing validation |
| **Nit** | Style/clarity; non-functional | Can merge with nits | Naming, formatting, whitespace, minor comment |
| **Optional** | Suggestion; future improvement | Can merge | Alternative approach, optimization idea, pattern suggestion |
| **FYI** | Informational; learning opportunity | Can merge | Pattern match, best practice reminder, architecture note |

---

**End of Review Axes Reference**

Use these 5 axes for every code review. Check each axis systematically.
