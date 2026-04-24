# Context Loading Reference

This document defines the strategy for loading project context before planning or executing features.

## Overview

**Purpose:** Build a comprehensive but token-efficient context snapshot before any planning phase.

**Principle:** Load on-demand, not eagerly. Prioritize recent and relevant context.

**Budget:** Total loaded content must remain under 40k tokens.

## What to Load

### Priority 1: Project Fundamentals (Always Load)

| Source | Path | Purpose | Max Tokens |
|--------|------|---------|------------|
| Project overview | `docs/project.md` | Project name, modules, active architecture | 2k |
| Coding conventions | `docs/conventions.md` | Naming patterns, structural rules, best practices | 2k |
| Decisions log | `docs/decisions.md` | Architectural decisions and rationale | 3k |

**Load Rule:** Always read these files first. They establish baseline project context.

### Priority 2: Recent Sessions (Load Most Recent)

| Source | Path | Purpose | Max Tokens |
|--------|------|---------|------------|
| Session logs | `docs/sessions/` (3 most recent) | Recent decisions, learnings, blockers | 6k |

**Load Rule:** Sort `docs/sessions/` by filename (ISO date format YYYY-MM-DD), load the 3 most recent files.

**Why 3 recent sessions?** Last session is immediate context. Prior 2 sessions show trends and decisions that haven't been documented in `docs/decisions.md` yet.

### Priority 3: Codebase Structure (Load on-demand)

| Source | Path | Purpose | Max Tokens |
|--------|------|---------|------------|
| Codebase spec | `.specs/codebase/STACK.md` | Tech stack, libraries, key modules | 2k |
| Architecture diagram | `.specs/codebase/ARCHITECTURE.md` | System boundaries, data flow | 3k |
| Local conventions | `.specs/codebase/CONVENTIONS.md` | Project-specific patterns not yet in docs/ | 2k |

**Load Rule:** Load only if `.specs/codebase/` exists AND the feature touches relevant domains. Do NOT load eagerly; load only when needed for specification or design.

**How to decide "relevant domains":** Scan user's feature description for mentions of modules, patterns, or APIs that appear in STACK.md or ARCHITECTURE.md.

### Priority 4: PROJECT-LEVEL STATE (Load if exists)

| Source | Path | Purpose | Max Tokens |
|--------|------|---------|------------|
| Project state | `.specs/project/STATE.md` | Active features, blockers, decisions, lessons | 2k |

**Load Rule:** Load if file exists. Use to understand active work and identify blockers.

---

## Context Summary Block

After loading, produce a **Context Summary** for the user:

```markdown
## Context Summary

**Project:** [name from docs/project.md or "unknown"]

**Active Feature:** [if resuming, from STATE.md]

**Known Conventions** (from docs/conventions.md):
- [bullet 1, max 5 bullets]
- [bullet 2]
- [bullet 3]

**Recent Decisions** (from docs/decisions.md):
- [decision 1, max 3 bullets]
- [decision 2]

**Last Session:** [date and feature from most recent session log, or "none"]

**Prior Context Loaded From:**
- docs/project.md
- docs/conventions.md
- docs/decisions.md
- docs/sessions/YYYY-MM-DD-*.md (3 most recent)
- .specs/codebase/STACK.md (if relevant)
- .specs/codebase/ARCHITECTURE.md (if relevant)
```

**Purpose:** Makes context loading transparent. User can see what was loaded and what assumptions are being made.

---

## Token Budget Breakdown

| Category | Max | Notes |
|----------|-----|-------|
| Project fundamentals (docs/) | 7k | Must-have baseline |
| Recent sessions (3 most recent) | 6k | Captures recent context |
| Codebase structure (if loaded) | 7k | On-demand, domain-specific |
| Project state (if exists) | 2k | Active work tracking |
| **Total budget** | **22k** | Out of 40k total context budget |
| **Reserve for planning** | **18k** | Space for feature spec, design, tasks |

**Rule:** If any section approaches its limit, summarize rather than load full text.

---

## Load-on-Demand Principle

**When to load `.specs/codebase/` files:**

✓ **DO load if:**
- Feature is in a domain mentioned in `.specs/codebase/STACK.md`
- Feature integrates with existing modules
- Feature requires understanding current architecture
- User's description mentions specific tech or architecture concerns

✗ **DON'T load if:**
- Feature is entirely new (no existing codebase domain)
- `.specs/codebase/` directory doesn't exist
- Loading would exceed token budget
- Feature is a spec-only task (no code needed)

**How to decide:**
1. Scan feature description for module/tech/architecture keywords
2. Check if these keywords appear in codebase files (quick grep)
3. If yes → load; if no → skip

---

## Missing Knowledge Base

**If `docs/` does not exist (first run):**

1. Note "first run" in Context Summary
2. Proceed with LOAD phase complete but without external context
3. During LEARN phase: scaffold `docs/` directory with `docs/project.md`, `docs/conventions.md`, `docs/decisions.md`

**If specific files are missing:**
- `docs/project.md` missing → note in summary, continue with what's available
- `docs/conventions.md` missing → note in summary, infer conventions from codebase
- `docs/decisions.md` missing → note in summary, start fresh
- `docs/sessions/` missing → note in summary, no prior session context

---

## External Context (if available)

**Context7 (Library Documentation)**

If your environment has access to Context7 (external library docs):

1. Do NOT load Context7 docs eagerly
2. Load only during DESIGN phase if feature requires external library knowledge
3. Use context7 to supplement `.specs/codebase/` knowledge, not replace it

**Example:**
- Feature requires learning Zod validation library
- Check `.specs/codebase/STACK.md` — confirms Zod is used
- Load Zod docs from Context7 during DESIGN phase

---

## Context Refresh

**When to reload context:**

- After completing a feature (new STATE.md entries, new session logs)
- If user explicitly asks to "refresh context" or "reload"
- If feature being planned depends on recent changes

**When NOT to reload:**
- During execution of a single feature (reuse context from specification phase)
- Within a single session (one load at start is sufficient)

---

## Example Context Load

**Scenario:** User says `/spec medium: Add authentication to user service`

**Load Process:**

1. Read `docs/project.md` → project is "agent-skills"
2. Read `docs/conventions.md` → Auth implemented via JWT, stored in context
3. Read `docs/decisions.md` → "Auth pattern decision: JWT in HTTP-only cookies"
4. Read 3 most recent session logs → recent context from other features
5. Scan user description for "authentication" keyword
6. Check `.specs/codebase/STACK.md` → mentions "jwt library, express middleware"
7. Load `.specs/codebase/` files for auth domain
8. Skip `.specs/project/STATE.md` (not started any features yet) → file doesn't exist

**Output Context Summary:**

```markdown
## Context Summary

**Project:** agent-skills

**Active Feature:** None

**Known Conventions** (from docs/conventions.md):
- Authentication via JWT tokens in HTTP-only cookies
- All auth checks in dedicated middleware functions
- No auth logic in route handlers

**Recent Decisions** (from docs/decisions.md):
- JWT pattern chosen for stateless auth (2026-04-20)
- HTTP-only cookies prevent XSS token theft (2026-04-15)

**Last Session:** 2026-04-24, spec-driven-v2 feature

**Prior Context Loaded From:**
- docs/project.md
- docs/conventions.md
- docs/decisions.md
- docs/sessions/2026-04-24-*.md
- .specs/codebase/STACK.md (auth domain)
```

---

**End of Context Loading Reference**
