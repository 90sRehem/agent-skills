---
command: /build
skill: incremental-build
---

Build one task at a time — implement, verify, persist, advance.

**Usage:**
- `/build` — Find and build next unchecked task
- `/build <feature-name>` — Build specific feature

**Behavior:** Implement → verify → mark [x] (immediately) → report → loop

**Output:** Modified code + updated tasks.md
