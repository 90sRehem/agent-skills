---
feature: cli-distribution
status: draft
scope: large
version: v3
created: 2026-04-24
last-completed: null
total_tasks: 20
completed_count: 0
---

# CLI Distribution — Tasks

## Phase 1: Project Setup

- [ ] 1.1 Initialize package.json
  - Files: `package.json`
  - Depends on: —
  - Requirement: REQ-01, REQ-09
  - Size: S
  - What: Create `package.json` with name `agent-skills`, version `0.1.0`, `"type": "module"`, bin field pointing to `dist/cli.js`, files field `["dist/", "skills/"]`, engines `{ "node": ">=18" }`, scripts (prebuild, build, dev, test, prepublishOnly), dependencies (commander ^13, picocolors ^1.1), devDependencies `{}`.
  - Done when:
    - [ ] `package.json` exists with `"type": "module"`
    - [ ] `"bin": { "agent-skills": "dist/cli.js" }` is set
    - [ ] `"files": ["dist/", "skills/"]` is set
    - [ ] `"engines": { "node": ">=18" }` is set
    - [ ] scripts has: prebuild, build, dev, test, prepublishOnly
    - [ ] devDependencies is empty `{}`

- [ ] 1.2 Create project scaffolding and .gitignore
  - Files: `.gitignore`, `bunfig.toml` (optional), directory structure
  - Depends on: 1.1
  - Requirement: REQ-09
  - Size: S
  - What: Create `.gitignore` with entries: `dist/`, `node_modules/`, `*.tgz`, `.skill-lock.json`. Create directories: `src/`, `src/commands/`, `src/core/`, `src/adapters/`, `scripts/`, `tests/`, `tests/commands/`.
  - Done when:
    - [ ] `.gitignore` has dist/, node_modules/, *.tgz, .skill-lock.json
    - [ ] All source directories exist

- [ ] 1.3 Install production dependencies
  - Files: `bun.lockb`
  - Depends on: 1.1
  - Requirement: REQ-01
  - Size: S
  - What: Run `bun install` to install commander and picocolors. Verify both packages present in node_modules.
  - Done when:
    - [ ] `bun.lockb` exists
    - [ ] `node_modules/commander` exists
    - [ ] `node_modules/picocolors` exists

- [ ] 1.4 Create skills bundling script
  - Files: `scripts/bundle-skills.ts`
  - Depends on: 1.2
  - Requirement: REQ-01
  - Size: S
  - What: Create `scripts/bundle-skills.ts` that reads all 7 skill directories from the repo root (spec-driven, planning, incremental-build, test-verification, code-review, code-simplification, shipping) and copies them into `skills/` using `fs.cpSync`. Script should be idempotent (clean `skills/` before copying).
  - Done when:
    - [ ] `scripts/bundle-skills.ts` exists
    - [ ] Running `bun scripts/bundle-skills.ts` produces `skills/` with all 7 skill dirs
    - [ ] Each skill dir has `SKILL.md` and `.skill-meta.json`
    - [ ] Script is idempotent (safe to run multiple times)

## Phase 2: Core Modules

- [ ] 2.1 Create paths module (`src/core/paths.ts`)
  - Files: `src/core/paths.ts`
  - Depends on: 1.2
  - Requirement: REQ-02
  - Size: S
  - What: Export `getGlobalSkillsDir(tool: string): string` → e.g. `~/.config/opencode/skills/`. Export `getLocalSkillsDir(tool: string): string` → `.opencode/skills/` relative to cwd. Export `getBundledSkillsDir(): string` → resolves `skills/` relative to package root using `import.meta.url` + `fileURLToPath`. Export `getLockfilePath(scope: 'global' | 'local'): string`. Use only `node:path`, `node:os`, `node:url`.
  - Done when:
    - [ ] `getGlobalSkillsDir('opencode')` returns correct XDG path
    - [ ] `getLocalSkillsDir('opencode')` returns correct local path
    - [ ] `getBundledSkillsDir()` resolves to absolute path of `skills/`
    - [ ] `getLockfilePath` returns correct path per scope
    - [ ] All imports use `node:` prefix

- [ ] 2.2 Create paths tests (`tests/paths.test.ts`)
  - Files: `tests/paths.test.ts`
  - Depends on: 2.1
  - Requirement: REQ-02
  - Size: S
  - What: Unit tests using `import { describe, it, expect } from "bun:test"`. Test all exported functions. Mock `process.cwd()` for local path tests.
  - Done when:
    - [ ] All 4 functions have at least one test
    - [ ] `bun test tests/paths.test.ts` passes with 0 failures

- [ ] 2.3 Create registry module (`src/core/registry.ts`)
  - Files: `src/core/registry.ts`
  - Depends on: 2.1
  - Requirement: REQ-01
  - Size: S
  - What: Export `getAvailableSkills(): SkillInfo[]` that scans `skills/*/` using `fs.readdirSync`, reads `.skill-meta.json` from each via `fs.readFileSync`, returns `{ name, description, version, path }[]`. Skip dirs without `.skill-meta.json` (warn to console). Export `getSkill(name: string): SkillInfo | undefined`.
  - Done when:
    - [ ] Returns metadata for all 7 bundled skills
    - [ ] Missing `.skill-meta.json` → skip + warn
    - [ ] `getSkill('nonexistent')` returns undefined

- [ ] 2.4 Create registry tests (`tests/registry.test.ts`)
  - Files: `tests/registry.test.ts`
  - Depends on: 2.3
  - Requirement: REQ-01
  - Size: S
  - What: Tests using fixture directories (temp dirs with mock skills). Test happy path (2–3 valid skills), missing `.skill-meta.json`, malformed JSON.
  - Done when:
    - [ ] Discovers valid skills from fixture
    - [ ] Skips dirs without `.skill-meta.json`
    - [ ] `bun test tests/registry.test.ts` passes

- [ ] 2.5 Create lockfile module (`src/core/lockfile.ts`)
  - Files: `src/core/lockfile.ts`
  - Depends on: 2.1
  - Requirement: REQ-07
  - Size: M
  - What: Export `readLockfile(path: string): Lockfile`, `writeLockfile(path: string, data: Lockfile): void`, `addEntry(path, name, entry: LockfileEntry): void`, `removeEntry(path, name): void`. Schema: `{ version: 1, skills: Record<string, { method, scope, installedAt, version, tool }> }`. Missing file → return `{ version: 1, skills: {} }`. Corrupted JSON → backup as `.skill-lock.json.bak`, return empty. `writeLockfile` creates parent dirs with `fs.mkdirSync({ recursive: true })`.
  - Done when:
    - [ ] `readLockfile` returns empty default on missing file
    - [ ] `writeLockfile` creates parent dirs if needed
    - [ ] `addEntry` persists entry with all fields
    - [ ] `removeEntry` removes entry and persists
    - [ ] Corrupted file backed up as `.bak` before reset

- [ ] 2.6 Create lockfile tests (`tests/lockfile.test.ts`)
  - Files: `tests/lockfile.test.ts`
  - Depends on: 2.5
  - Requirement: REQ-07
  - Size: S
  - What: Tests for all lockfile operations using temp dirs. Test missing file, corrupted file backup, add/remove/read roundtrip.
  - Done when:
    - [ ] All CRUD operations verified
    - [ ] Missing file returns empty lockfile (no error)
    - [ ] Corrupted file triggers backup + fresh
    - [ ] `bun test tests/lockfile.test.ts` passes

- [ ] 2.7 Create installer module (`src/core/installer.ts`)
  - Files: `src/core/installer.ts`
  - Depends on: 2.1
  - Requirement: REQ-02, REQ-03
  - Size: M
  - What: Export `installSkill({ src, dest, method: 'copy' | 'symlink' }): void`. Copy: `fs.cpSync(src, dest, { recursive: true })` after `fs.mkdirSync(parent, { recursive: true })`. Symlink: `fs.symlinkSync(src, dest, 'dir')` — warn if src contains `/tmp/` or similar temp pattern. Export `removeSkill(dest: string): void` using `fs.rmSync(dest, { recursive: true, force: true })`.
  - Done when:
    - [ ] Copy creates full directory at dest
    - [ ] Symlink creates dir symlink at dest
    - [ ] Symlink warns when source appears to be tmp/cache
    - [ ] Remove handles both copy and symlink installs
    - [ ] Parent dirs created automatically on install

- [ ] 2.8 Create installer tests (`tests/installer.test.ts`)
  - Files: `tests/installer.test.ts`
  - Depends on: 2.7
  - Requirement: REQ-02, REQ-03
  - Size: S
  - What: Tests using `fs.mkdtempSync` for isolated temp dirs. Test copy creates files, symlink creates link, remove deletes, idempotent operations.
  - Done when:
    - [ ] Copy test: files present at dest after install
    - [ ] Symlink test: symlink exists at dest
    - [ ] Remove test: dest gone after remove
    - [ ] `bun test tests/installer.test.ts` passes

## Phase 3: Agent Tool Adapter

- [ ] 3.1 Create adapter interface and registry (`src/adapters/adapter.ts`)
  - Files: `src/adapters/adapter.ts`
  - Depends on: 1.2
  - Requirement: REQ-08
  - Size: S
  - What: Export `AgentToolAdapter` interface: `{ name: string, getSkillsDir(scope: 'global' | 'local'): string, validateInstall(path: string): boolean }`. Export `adapterRegistry = new Map<string, AgentToolAdapter>()`. Export `getAdapter(name: string): AgentToolAdapter` that throws `Error('Unknown tool: ${name}. Available: ${[...adapterRegistry.keys()].join(", ")}')` for unknown names. Export `DEFAULT_TOOL = 'opencode'`.
  - Done when:
    - [ ] Interface exported
    - [ ] Registry map exported and mutable
    - [ ] `getAdapter` throws descriptive error for unknown tool
    - [ ] `DEFAULT_TOOL` is `'opencode'`

- [ ] 3.2 Create opencode adapter (`src/adapters/opencode.ts`)
  - Files: `src/adapters/opencode.ts`
  - Depends on: 3.1, 2.1
  - Requirement: REQ-08
  - Size: S
  - What: Implement `AgentToolAdapter` for opencode. `getSkillsDir('global')` → `~/.config/opencode/skills/` (respects `XDG_CONFIG_HOME`). `getSkillsDir('local')` → `.opencode/skills/` relative to `process.cwd()`. `validateInstall(path)` → checks `SKILL.md` exists in path. Self-register in `adapterRegistry` on module load.
  - Done when:
    - [ ] Global path uses `XDG_CONFIG_HOME` if set, else `~/.config/opencode/skills/`
    - [ ] Local path is `.opencode/skills/` relative to cwd
    - [ ] `validateInstall` checks for SKILL.md
    - [ ] Self-registers in adapterRegistry on import

## Phase 4: CLI Commands

- [ ] 4.1 Create install command (`src/commands/install.ts`)
  - Files: `src/commands/install.ts`
  - Depends on: 2.3, 2.5, 2.7, 3.2
  - Requirement: REQ-02, REQ-03
  - Size: M
  - What: Export Commander `Command`. Options: `--link` (symlink), `--global` (global scope), `--tool <name>` (default: opencode), `--force` (overwrite). Args: `<skill>` or `--all`. Flow: validate skill in registry → resolve adapter → determine target dir → check lockfile for existing install (skip unless --force) → install via installer → update lockfile → print colored result.
  - Done when:
    - [ ] `install spec-driven` copies to local opencode dir
    - [ ] `install --global spec-driven` copies to global dir
    - [ ] `install --link spec-driven` creates symlink
    - [ ] `install --all` installs all 7 skills
    - [ ] Already-installed skill skipped with message (no --force)
    - [ ] Lockfile updated after each install
    - [ ] Invalid skill name → colored error + available list

- [ ] 4.2 Create list command (`src/commands/list.ts`)
  - Files: `src/commands/list.ts`
  - Depends on: 2.3, 2.5
  - Requirement: REQ-04
  - Size: S
  - What: Export Commander `Command`. Options: `--tool <name>`, `--global`. Flow: get all available skills from registry → read lockfile → print table showing each skill with: name, description, installed indicator (✓ green / ✗ dim), method (copy/symlink), scope if installed.
  - Done when:
    - [ ] Lists all 7 available skills
    - [ ] Installed skills show ✓ in green
    - [ ] Not-installed skills show ✗ in dim
    - [ ] Method and scope shown for installed skills

- [ ] 4.3 Create remove command (`src/commands/remove.ts`)
  - Files: `src/commands/remove.ts`
  - Depends on: 2.5, 2.7, 3.2
  - Requirement: REQ-05
  - Size: S
  - What: Export Commander `Command`. Options: `--global`, `--tool <name>`. Args: `<skill>`. Flow: check lockfile for entry → resolve path → `removeSkill(path)` → `removeEntry(lockfile, skill)` → print success. Error if not in lockfile.
  - Done when:
    - [ ] Removes skill directory from target
    - [ ] Updates lockfile (entry removed)
    - [ ] Error message if skill not installed
    - [ ] Works for both copy and symlink

- [ ] 4.4 Create update command (`src/commands/update.ts`)
  - Files: `src/commands/update.ts`
  - Depends on: 2.3, 2.5, 2.7, 3.2
  - Requirement: REQ-06
  - Size: S
  - What: Export Commander `Command`. Options: `--tool <name>`, `--global`. Args: optional `[skill]`. Flow: if skill given → update one; else → update all in lockfile. For each: re-install using same method from lockfile entry → update `installedAt` timestamp in lockfile. Print summary: updated N skills.
  - Done when:
    - [ ] Updates single skill when name given
    - [ ] Updates all skills when no name given
    - [ ] Preserves method (copy/symlink) from lockfile
    - [ ] Updates timestamp in lockfile entry

- [ ] 4.5 Create CLI entry point (`src/cli.ts`)
  - Files: `src/cli.ts`
  - Depends on: 4.1, 4.2, 4.3, 4.4
  - Requirement: REQ-01
  - Size: S
  - What: Import Commander and all 4 commands. Create program with `name('agent-skills')`, `description(...)`, `version(...)` (read from package.json via `import`). Register all commands. `program.parse(process.argv)`. Add `#!/usr/bin/env node` shebang as first line comment (Bun preserves it in output).
  - Done when:
    - [ ] `bun src/cli.ts --help` shows all 4 commands
    - [ ] `bun src/cli.ts --version` shows version from package.json
    - [ ] All commands routable from entry point

## Phase 5: Build & Verification

- [ ] 5.1 Configure build and verify output
  - Files: `dist/cli.js` (generated)
  - Depends on: 4.5
  - Requirement: REQ-01, REQ-09
  - Size: S
  - What: Run `bun run build` (triggers prebuild + bun build). Verify `dist/cli.js` has `#!/usr/bin/env node` shebang. If missing, add `postbuild` script that prepends it with `echo '#!/usr/bin/env node' | cat - dist/cli.js > tmp && mv tmp dist/cli.js`. Verify `node dist/cli.js --help` works.
  - Done when:
    - [ ] `bun run build` succeeds
    - [ ] `dist/cli.js` starts with `#!/usr/bin/env node`
    - [ ] `node dist/cli.js --help` shows all 4 commands
    - [ ] `node dist/cli.js list` shows bundled skills

- [ ] 5.2 Integration tests (`tests/commands/install.test.ts`, `tests/commands/list.test.ts`)
  - Files: `tests/commands/install.test.ts`, `tests/commands/list.test.ts`
  - Depends on: 4.5
  - Requirement: REQ-02, REQ-04, REQ-05
  - Size: M
  - What: Integration tests using temp dirs. install.test.ts: verify install→lockfile→files exist flow. Test `--global`, `--link`, `--all`. list.test.ts: verify output format. Use `bun:test` with `beforeEach`/`afterEach` for temp dir setup/teardown.
  - Done when:
    - [ ] Install test: skill files at target + lockfile updated
    - [ ] Symlink test: symlink at target
    - [ ] List test: output contains skill names and status
    - [ ] Remove test: files gone + lockfile entry removed
    - [ ] `bun test` passes all tests with 0 failures

- [ ] 5.3 Write README.md
  - Files: `README.md`
  - Depends on: 5.1
  - Requirement: —
  - Size: S
  - What: Write README with: project description, quick start (`npx agent-skills install --all`), all 4 commands with examples, supported agent tools table (opencode + future), available skills list with descriptions, development setup (requires Bun), Node.js ≥18 runtime note.
  - Done when:
    - [ ] Quick start section present
    - [ ] All 4 commands documented with examples
    - [ ] Development section mentions Bun requirement
    - [ ] Available skills listed

## Requirement Coverage

| Req ID | Description | Covered by Tasks |
|--------|-------------|-----------------|
| REQ-01 | npm package distribution | 1.1, 1.3, 2.3, 4.5, 5.1 |
| REQ-02 | Install command (copy) | 2.1, 2.7, 4.1, 5.2 |
| REQ-03 | Install command (symlink) | 2.7, 4.1, 5.2 |
| REQ-04 | List command | 4.2, 5.2 |
| REQ-05 | Remove command | 4.3, 5.2 |
| REQ-06 | Update command | 4.4 |
| REQ-07 | Lockfile tracking | 2.5, 2.6 |
| REQ-08 | Agent tool extensibility | 3.1, 3.2 |
| REQ-09 | Bun toolchain | 1.1, 1.2, 5.1 |

## Task Summary

| Phase | Tasks | Sizes |
|-------|-------|-------|
| 1. Project Setup | 4 | S, S, S, S |
| 2. Core Modules | 8 | S, S, S, S, M, S, M, S |
| 3. Agent Adapter | 2 | S, S |
| 4. CLI Commands | 5 | M, S, S, S, S |
| 5. Build & Verification | 3 | S, M, S |
| **Total** | **22** | |
