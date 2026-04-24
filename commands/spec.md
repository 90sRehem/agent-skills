---
command: /spec
skill: spec-driven
---

Specify what to build — detect scope, clarify requirements, produce spec.

**Usage:**
- `/spec <desc>` — Specify feature (auto-detect scope)
- `/spec quick|medium|large <desc>` — Force scope
- `/spec resume` — Resume from last in-progress feature

**Output:** `.specs/features/<name>/spec.md` or `.specs/quick/NNN-<slug>/TASK.md`
