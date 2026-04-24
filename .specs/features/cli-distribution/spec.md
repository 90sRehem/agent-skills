---
feature: cli-distribution
status: draft
scope: large
version: v3
created: 2026-04-24
---

# CLI Distribution — Specification

## Problem Statement

The `agent-skills` repository contains 7 reusable AI-agent skills (spec-driven, planning, incremental-build, test-verification, code-review, code-simplification, shipping) plus 7 commands and 8 shared refs. Currently, users must manually clone the repo and copy files to use any skill. There is no CLI, no package on npm, and no automated installation mechanism.

Users need a single `npx agent-skills install <skill>` command that copies (or symlinks) skill files into the correct directory for their AI agent tool (opencode, claude-code, cursor, etc.) — with tracking, removal, and update support.

## Goals

1. Publish `agent-skills` to npm so users can run `npx agent-skills` (or `bunx agent-skills`)
2. Provide install/list/remove/update commands for managing skills
3. Support opencode as the first agent tool target, with an extensible adapter pattern
4. Support global (`--global`) and project-local installation scopes
5. Track installed skills via a lockfile for idempotent operations
6. Bundle all skills inside the npm package (no CDN, no network fetching)
7. Use Bun as the complete dev toolchain — zero devDependencies

## Out of Scope

- CDN-based skill fetching or remote skill registries
- GUI or TUI interactive mode
- Bun standalone binary compilation (`bun build --compile`) — requires per-platform binaries
- Plugin system for community skills (future feature)
- Auto-detection of agent tool (user specifies `--tool` or uses default)

## User Stories

### P1 — Must Have

| ID | Story |
|----|-------|
| CLI-01 | As a developer, I can run `npx agent-skills install spec-driven` to install a skill to my opencode config directory |
| CLI-02 | As a developer, I can run `npx agent-skills list` to see all available and installed skills |
| CLI-03 | As a developer, I can run `npx agent-skills remove spec-driven` to uninstall a skill |
| CLI-04 | As a developer, I can run `npx agent-skills install --link spec-driven` to symlink instead of copy |
| CLI-05 | As a developer, I can run `npx agent-skills install --global spec-driven` to install to the global config directory |
| CLI-06 | As a developer, my installations are tracked in `.skill-lock.json` so reinstalls are idempotent |

### P2 — Should Have

| ID | Story |
|----|-------|
| CLI-07 | As a developer, I can run `npx agent-skills update` to update all installed skills to the latest bundled versions |
| CLI-08 | As a developer, I can run `npx agent-skills install --tool claude-code spec-driven` to target a different agent tool |

### P3 — Nice to Have

| ID | Story |
|----|-------|
| CLI-09 | As a developer, I see colored output with success/error/warning indicators |
| CLI-10 | As a developer, I get helpful error messages when a skill name is invalid or a target directory doesn't exist |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-01 | `npx agent-skills install spec-driven` copies skill files to `~/.config/opencode/skills/spec-driven/` |
| AC-02 | `npx agent-skills install --link spec-driven` creates a symlink instead of copying |
| AC-03 | `npx agent-skills list` shows available skills with installed status indicator |
| AC-04 | `npx agent-skills remove spec-driven` deletes the installed skill directory and updates lockfile |
| AC-05 | `.skill-lock.json` records each install with: skill name, method (copy/symlink), scope, timestamp, version |
| AC-06 | `npx agent-skills install --global` targets `~/.config/opencode/skills/` |
| AC-07 | `npx agent-skills install` (no `--global`) targets `.opencode/skills/` relative to cwd |
| AC-08 | `npx agent-skills update` re-copies/re-links all skills in the lockfile |
| AC-09 | CLI runs on Node.js ≥18 via npx (output is Node-compatible ESM) |
| AC-10 | Package has zero devDependencies (Bun is the entire dev toolchain) |

## Requirement Traceability

| Req ID | Description | Stories | Acceptance |
|--------|-------------|---------|------------|
| REQ-01 | npm package distribution | CLI-01 | AC-09, AC-10 |
| REQ-02 | Install command (copy) | CLI-01, CLI-05 | AC-01, AC-06, AC-07 |
| REQ-03 | Install command (symlink) | CLI-04 | AC-02 |
| REQ-04 | List command | CLI-02 | AC-03 |
| REQ-05 | Remove command | CLI-03 | AC-04 |
| REQ-06 | Update command | CLI-07 | AC-08 |
| REQ-07 | Lockfile tracking | CLI-06 | AC-05 |
| REQ-08 | Agent tool extensibility | CLI-08 | — |
| REQ-09 | Bun toolchain | — | AC-10 |

## Success Criteria

- `npx agent-skills install spec-driven` works on a fresh machine with Node.js ≥18
- All 7 bundled skills are installable and removable
- Lockfile correctly tracks state across install/remove/update cycles
- `bun test` passes all tests with zero devDependencies
- Package size < 500KB (skills are markdown + JSON, no heavy deps)
