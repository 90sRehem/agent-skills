---
command: /review
skill: code-review
---

Structured quality review — five axes, severity labels, convention compliance.

**Usage:**
- `/review` — Review current git diff
- `/review <file-or-dir>` — Review specific target

**Axes:** Correctness, Security, Performance, Readability, Architecture

**Output:** Review report with findings table (file:line | axis | severity | finding)
