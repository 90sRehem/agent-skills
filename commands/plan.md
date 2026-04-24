---
command: /plan
skill: planning
---

Plan how to build — design decisions and task breakdown.

**Usage:**
- `/plan` — Plan active feature (from STATE.md)
- `/plan <feature-name>` — Plan specific feature

**Constraint:** Read-only; requires approved spec.md

**Output:** `.specs/features/<name>/design.md` (Large only), `.specs/features/<name>/tasks.md`
