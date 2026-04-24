# code-review

## Overview

This skill conducts structured quality reviews using 5 axes (Correctness, Security, Performance, Readability, Architecture) and severity labels (Critical, Major, Nit, Optional, FYI). Reviews can target git diffs, explicit file lists, or feature code. Output is a findings table with file:line, axis, severity, finding, and suggestion.

---

## When to Use

- You have changes (git diff, files, or a feature) that need quality review
- You want structured feedback on 5 axes (not just "looks good")
- You need to assess security and performance before shipping
- You want convention compliance checked
- User says: `/review`, `/review <file-or-dir>`, "code review", "check quality"

---

## Boundaries

**Always:**
- Review all 5 axes (Correctness, Security, Performance, Readability, Architecture)
- Label every finding with severity (Critical, Major, Nit, Optional, FYI)
- Check convention compliance against `docs/conventions.md`
- Identify architectural decisions found and suggest documenting them in ADR
- Provide actionable suggestions (not just problems)

**Ask First:**
- Suggest structural refactoring beyond current scope (is it in-scope?)
- Auto-fix code during review (should be in separate task/PR)
- Defer security or performance review (always do both)

**Never:**
- Auto-fix code during review
- Modify files during review (it's read-only)
- Skip security axis (every change is a security surface)
- Leave findings without severity labels

---

## Core Process

1. **Identify review target**: git diff, explicit file list, or feature from `.specs/features/<name>/`.

2. **Load docs/conventions.md**: Understand project coding standards, naming rules, patterns. This is the baseline for "Readability" axis.

3. **Review on 5 axes** (reference: `code-review/references/review-axes.md`):
   - **Correctness**: Logic errors, off-by-one bugs, missing error handling, edge cases
   - **Security**: Injection vulnerabilities, missing auth checks, data exposure, unsafe deserialization
   - **Performance**: N+1 queries, missing indices, unnecessary computation, memory leaks
   - **Readability**: Naming clarity, function length, nesting depth, comment quality
   - **Architecture**: Tight coupling, separation of concerns, abstraction level, over-engineering

4. **Label each finding**: Assign severity from 5 levels (reference: `code-review/references/review-axes.md`):
   - **Critical** (blocks merge): security vulnerability, logic bug, data loss risk
   - **Major** (should fix before merge): architectural violation, performance regression, missing feature
   - **Nit** (style, non-blocking): naming clarity, code style, comment formatting
   - **Optional** (suggestion): alternative approach, optimization idea
   - **FYI** (informational): pattern match, learning opportunity, best practice reminder

5. **Check conventions**: Compare code against `docs/conventions.md`. Flag any deviations.

6. **Produce findings table**: File:line | Axis | Severity | Finding | Suggestion

7. **Suggest ADR** (if architectural decisions found): "Consider documenting this decision in `docs/decisions.md`"

---

## Severity Definitions

| Severity | Criteria | Merge Gate | Fix? |
|----------|----------|-----------|------|
| **Critical** | Blocks merge; security/data risk; logic bug causing wrong behavior | Must fix before merge | YES, required |
| **Major** | Should fix before merge; violation of arch principles; perf regression | Should fix before merge | YES, strongly suggested |
| **Nit** | Style/clarity improvement; non-functional | No, can merge with nits | Optional |
| **Optional** | Suggestion for future improvement; alternative approach | No, can merge | Optional |
| **FYI** | Informational; learning opportunity; pattern match | No, purely informational | No |

---

## Common Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "It's a small change, no need for full review" | Critical bugs hide in small changes. Review all 5 axes. |
| "Security review isn't needed for this feature" | Every change is a security surface. Check it. |
| "The code is readable to me, skip readability" | Readable to you ≠ readable to the next engineer. Standard matters. |
| "Performance isn't critical for this feature" | Performance problems compound. Catch them now before they scale. |
| "I'll auto-fix the issues while reviewing" | Review should be read-only. Fixes go in separate task/commit. |

---

## Red Flags

- **No security axis check**: Critical omission
- **Critical findings not flagged**: Findingswithout severity labels
- **Conventions check skipped**: Code drifts from standards
- **Findings without suggestions**: Not actionable for the fixer
- **Architectural issues ignored**: Technical debt compounds

---

## Verification

- [ ] Review target identified (git diff, files, or feature)
- [ ] docs/conventions.md loaded
- [ ] All 5 axes reviewed (Correctness, Security, Performance, Readability, Architecture)
- [ ] All findings labeled with severity
- [ ] Convention compliance checked
- [ ] Findings table produced with: file:line, axis, severity, finding, suggestion
- [ ] Architectural decisions identified and ADR suggestion made (if applicable)
- [ ] No code modified during review (read-only)

---

## References

- `code-review/references/review-axes.md` — 5-axis definitions, checklists, common issues
- `docs/conventions.md` — Project coding standards and patterns
- `docs/decisions.md` — Architectural decisions (update when new decisions found)
- `/test` — Previous phase (verification)
- `/ship` — Next phase (pre-flight checks before shipping)
