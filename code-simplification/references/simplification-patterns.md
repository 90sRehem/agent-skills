# Simplification Patterns

Six common simplification patterns. For each: name, smell (what it looks like), fix (what to do), example (before/after code), risk level.

---

## 1. Extract Duplication

**Smell**: Same logic appears in 2+ places.

**Fix**: Extract shared logic to a single function. Call it from both places.

**Before**:
```typescript
// In userController.ts
function validateEmail(email: string) {
  if (!email.includes('@')) throw new Error('Invalid email');
  if (email.length > 255) throw new Error('Email too long');
}

// In authService.ts (same code!)
function validateEmail(email: string) {
  if (!email.includes('@')) throw new Error('Invalid email');
  if (email.length > 255) throw new Error('Email too long');
}
```

**After**:
```typescript
// In validators/email.ts (shared)
export function validateEmail(email: string) {
  if (!email.includes('@')) throw new Error('Invalid email');
  if (email.length > 255) throw new Error('Email too long');
}

// In userController.ts
import { validateEmail } from './validators/email';
function registerUser(email: string) { validateEmail(email); ... }

// In authService.ts
import { validateEmail } from './validators/email';
function login(email: string) { validateEmail(email); ... }
```

**Risk**: Low (as long as both callsites need exactly this validation)

---

## 2. Inline Unnecessary Abstraction

**Smell**: Wrapper function that adds no value; just calls another function.

**Fix**: Remove the wrapper, call the underlying function directly.

**Before**:
```typescript
// Wrapper adds nothing
function getUserName(userId: string) {
  return getUser(userId).name; // Just delegates to getUser
}

// Everywhere else in code
const name = getUserName(id);
```

**After**:
```typescript
// Remove the wrapper
const user = getUser(userId);
const name = user.name; // Direct access
```

**Risk**: Low (wrapper wasn't adding behavior)

**Note**: Don't remove abstractions that provide real value:
- ✗ DON'T remove: `validateEmail()` wrapping complex regex logic (provides clarity)
- ✓ DO remove: `getName()` that just returns `user.name` (no value)

---

## 3. Remove Dead Code

**Smell**: Code that's never executed (unreachable, unused function, unused variable).

**Fix**: Delete the code.

**Before**:
```typescript
function processOrder(order) {
  const total = calculateTotal(order); // ✓ used
  const tax = calculateTax(order);    // ✗ DEAD: never used
  const discount = 0;                 // ✗ DEAD: set but never read
  
  return total;
}

function unusedHelper() { // ✗ DEAD: never called
  return 42;
}
```

**After**:
```typescript
function processOrder(order) {
  const total = calculateTotal(order);
  return total;
}
```

**Risk**: Low (removing unused code can't break anything)

**Careful**: Check for dead code that's intentionally unused (deprecated API, fallback code). Verify before deleting.

---

## 4. Simplify Complex Conditionals

**Smell**: Deeply nested if/else; hard to follow logic flow.

**Fix**: Use guard clauses (early returns) to flatten nesting.

**Before**:
```typescript
function processPayment(order) {
  if (order) {
    if (order.total > 0) {
      if (user.hasCard) {
        if (card.isValid) {
          charge(card, order.total);
          return { success: true };
        } else {
          return { error: 'Card invalid' };
        }
      } else {
        return { error: 'No card on file' };
      }
    } else {
      return { error: 'Order total must be > 0' };
    }
  } else {
    return { error: 'Order required' };
  }
}
```

**After**:
```typescript
function processPayment(order) {
  // Guard clauses: exit early on error
  if (!order) return { error: 'Order required' };
  if (order.total <= 0) return { error: 'Order total must be > 0' };
  if (!user.hasCard) return { error: 'No card on file' };
  if (!card.isValid) return { error: 'Card invalid' };
  
  // Happy path: charge the card
  charge(card, order.total);
  return { success: true };
}
```

**Risk**: Low (logic is equivalent, just flattened)

---

## 5. Reduce Indirection

**Smell**: Unnecessary wrapper or delegate layer; calls go through extra steps.

**Fix**: Remove the layer, call directly.

**Before**:
```typescript
// Unnecessary service layer
class UserService {
  getUser(id) {
    return this.userRepository.findById(id); // Just delegates!
  }
}

class UserRepository {
  findById(id) {
    return db.users.findOne({ id });
  }
}

// Usage
const user = userService.getUser(id); // 2 hops: service → repository
```

**After**:
```typescript
class UserRepository {
  findById(id) {
    return db.users.findOne({ id });
  }
}

// Usage
const user = userRepository.findById(id); // 1 hop: direct
```

**Risk**: Medium (may break if other code expects the service layer)

**Careful**: Don't remove indirection that provides real value:
- ✓ KEEP: Service layer that adds caching, validation, or logging
- ✗ REMOVE: Service layer that just delegates to repository with no added value

---

## 6. Replace Imperative with Declarative

**Smell**: Manual loop building a list; imperative style when declarative is clearer.

**Fix**: Use map/filter/reduce instead of manual loop.

**Before**:
```typescript
// Imperative: manual loop
const activeUsers = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].status === 'active') {
    activeUsers.push(users[i]);
  }
}

const userNames = [];
for (let i = 0; i < activeUsers.length; i++) {
  userNames.push(activeUsers[i].name);
}
```

**After**:
```typescript
// Declarative: map/filter
const userNames = users
  .filter(user => user.status === 'active')
  .map(user => user.name);
```

**Risk**: Low (same result, just more concise)

**Careful**: Don't force functional style where it hurts readability. Imperative is sometimes clearer.

---

## Summary Table

| Pattern | Smell | Fix | Risk | Example |
|---------|-------|-----|------|---------|
| Extract duplication | Same code 2+ places | Extract to function | Low | Email validation in 2 files |
| Inline unnecessary abstraction | Wrapper adds no value | Remove wrapper | Low | `getName()` that returns `user.name` |
| Remove dead code | Unreachable/unused | Delete | Low | Unused variable, unused function |
| Simplify conditionals | Deeply nested if/else | Guard clauses + early returns | Low | 4 levels of nesting → flattened |
| Reduce indirection | Unnecessary layers | Remove the layer | Medium | Service → Repository delegation |
| Replace imperative | Manual loop + filter | Use map/filter/reduce | Low | `for` loop building list → `.filter()` |

---

**End of Simplification Patterns**

Use these patterns to identify and apply simplifications. One at a time, verify after each.
