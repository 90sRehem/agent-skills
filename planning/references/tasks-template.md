<!-- Template: .specs/features/<name>/tasks.md — Medium/Large scope artifact. Replace all {{placeholders}}. -->
---
feature: {{feature-name}}
scope: {{medium|large}}
status: pending
created: {{YYYY-MM-DD}}
last-completed: null
updated: {{YYYY-MM-DD}}
total_tasks: {{N}}
completed_count: 0
---

# Tasks: {{feature-name}}

**Spec**: `.specs/features/{{feature-name}}/spec.md`

## Execution Plan

Tasks execute sequentially in document order. Each task must pass its acceptance criteria before the next begins.

```
T1 → T2 → T3 → T4 → T5
```

## Task Breakdown

- [ ] **T1: {{Task Title}}** (`{{primary/file}}`)
  - **What**: {{2-3 sentence description of the change}}
  - **Files**: `{{path/to/file1}}` (new|modify), `{{path/to/file2}}` (new|modify)
  - **Depends on**: None
  - **Requirement**: {{FEAT}}-01
  - **Size**: {{XS|S|M|L}}
  - **Done when**:
    - [ ] {{Verifiable criterion}}
    - [ ] {{Verifiable criterion}}

---

- [ ] **T2: {{Task Title}}** (`{{primary/file}}`)
  - **What**: {{2-3 sentence description of the change}}
  - **Files**: `{{path/to/file1}}` (new|modify), `{{path/to/file2}}` (new|modify)
  - **Depends on**: T1
  - **Requirement**: {{FEAT}}-02
  - **Size**: {{XS|S|M|L}}
  - **Done when**:
    - [ ] {{Verifiable criterion}}
    - [ ] {{Verifiable criterion}}

---

## Task Sizing

| Task | Size | Duration | Rationale |
|------|------|----------|-----------|
| T1 | {{XS\|S\|M\|L}} | {{5m\|15m\|45m\|2h}} | {{brief reason}} |

**Rule**: Each task must be ≤ 2 hours. If a task would take longer, break it into smaller tasks.

## Requirement Coverage

| Requirement ID | Task(s) | Status |
|---------------|---------|--------|
| {{FEAT}}-01 | T1 | Pending |
| {{FEAT}}-02 | T2 | Pending |

**Traceability Rule**: Every requirement ID in spec.md must appear in this table. Every row must map to at least one task.
