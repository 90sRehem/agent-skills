# agent-skills

Reusable skills for AI coding agents — OpenCode, Claude Code, Cursor, GitHub Copilot, Windsurf, and more.

## Available Skills

| Skill | Description | Install |
|-------|-------------|---------|
| [spec-driven](./spec-driven/) | Structured planning pipeline with 4 adaptive phases (Specify, Design, Tasks, Execute) and persistent knowledge accumulation | `npx skills add 90sRehem/agent-skills@spec-driven` |

## Installation

```bash
# Install a skill globally
npx skills add 90sRehem/agent-skills@spec-driven -g -y
```

## Skills

### spec-driven

A 6-phase standalone planning + execution pipeline for structured software development.

**Trigger:** `/spec <description>`

**Phases:** LOAD → SPECIFY → DESIGN → TASKS → EXECUTE → LEARN

**Scopes:**
- `Quick` — single TASK.md, inline execution
- `Medium` — spec.md + tasks.md
- `Large` — spec.md + design.md + tasks.md

**Knowledge base:** Accumulates context in `docs/` across sessions.

```bash
npx skills add 90sRehem/agent-skills@spec-driven -g -y
```

## License

Skills are licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).
