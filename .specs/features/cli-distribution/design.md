---
feature: cli-distribution
status: draft
scope: large
version: v3
created: 2026-04-24
---

# CLI Distribution — Technical Design

## Architecture Overview

```
agent-skills/
├── src/
│   ├── cli.ts                  # Entry point, commander setup
│   ├── commands/
│   │   ├── install.ts          # install command handler
│   │   ├── list.ts             # list command handler
│   │   ├── remove.ts           # remove command handler
│   │   └── update.ts           # update command handler
│   ├── core/
│   │   ├── lockfile.ts         # .skill-lock.json read/write
│   │   ├── registry.ts         # Discover bundled skills from skills/
│   │   ├── installer.ts        # Copy/symlink logic
│   │   └── paths.ts            # Resolve target directories per agent tool + scope
│   └── adapters/
│       ├── adapter.ts          # AgentToolAdapter interface + registry
│       └── opencode.ts         # opencode-specific paths and validation
├── skills/                     # Bundled skills (populated by prebuild script)
│   ├── spec-driven/
│   ├── planning/
│   ├── incremental-build/
│   ├── test-verification/
│   ├── code-review/
│   ├── code-simplification/
│   └── shipping/
├── scripts/
│   └── bundle-skills.ts        # Prebuild: copies skill dirs from root into skills/
├── tests/
│   ├── paths.test.ts
│   ├── registry.test.ts
│   ├── lockfile.test.ts
│   ├── installer.test.ts
│   └── commands/
│       ├── install.test.ts
│       └── list.test.ts
├── dist/                       # Build output (git-ignored)
│   └── cli.js                  # Single bundled file, Node-compatible ESM
├── package.json
├── bunfig.toml                 # Optional test configuration
├── .gitignore
└── README.md
```

## Toolchain: Bun (Complete Replacement)

| Concern | Before (Node.js) | After (Bun) |
|---------|-------------------|-------------|
| TypeScript compilation | `typescript` + `tsconfig.json` | Bun native (no config) |
| Bundling | `tsup` + `tsup.config.ts` | `bun build` (CLI flag) |
| Testing | `vitest` | `bun test` (native) |
| Package management | `npm install` | `bun install` |
| Dev watch mode | `tsup --watch` | `bun --watch` |
| Type definitions | `@types/node` | Built into Bun |
| **devDependencies** | **4 packages** | **0 packages** |

### Build Command

```bash
bun build src/cli.ts --outdir dist --target node --format esm
```

- `--target node` — output runs on Node.js (not Bun-specific APIs)
- `--format esm` — ES modules output
- Single output file: `dist/cli.js`

### Why NOT `bun build --compile`

Standalone binaries require per-platform builds (macOS arm64/x64, Linux x64/arm64, Windows). This complicates npm distribution enormously. Instead, we output standard ESM that runs on any Node.js ≥18 — `npx agent-skills` works for everyone.

## Key Components

### AgentToolAdapter Interface

```typescript
interface AgentToolAdapter {
  name: string;
  getSkillsDir(scope: 'global' | 'local'): string;
  validateInstall(skillPath: string): boolean;
}
```

- Adapters registered in a `Map<string, AgentToolAdapter>`
- Default: `opencode`
- Adding `claude-code`, `cursor`, `windsurf` = one new file each, zero core changes

### opencode Adapter Paths

| Scope | Path |
|-------|------|
| global | `~/.config/opencode/skills/` |
| local | `.opencode/skills/` (relative to cwd) |

### Lockfile Schema (`.skill-lock.json`)

```json
{
  "version": 1,
  "skills": {
    "spec-driven": {
      "method": "copy",
      "scope": "global",
      "installedAt": "2026-04-24T12:00:00Z",
      "version": "2.0.0",
      "tool": "opencode"
    }
  }
}
```

**Locations:**
- Global: `~/.config/agent-skills/.skill-lock.json`
- Local: `.agents/.skill-lock.json` (in project root)

### Skill Discovery (Registry)

Skills are bundled in the npm package under `skills/`. The registry reads `skills/*/.skill-meta.json` to enumerate available skills. Path resolved via `import.meta.dirname` (Node ≥21 + Bun) with `import.meta.url` + `fileURLToPath` fallback for Node 18–20.

### Installer Logic

| Method | Mechanism | Note |
|--------|-----------|------|
| copy (default) | `fs.cpSync(src, dest, { recursive: true })` | Node ≥16.7 built-in |
| symlink | `fs.symlinkSync(src, dest)` | Warns if source is in tmp/cache dir |

Remove: `fs.rmSync(target, { recursive: true, force: true })`

## package.json (Key Fields)

```json
{
  "name": "agent-skills",
  "version": "0.1.0",
  "type": "module",
  "bin": { "agent-skills": "dist/cli.js" },
  "files": ["dist/", "skills/"],
  "engines": { "node": ">=18" },
  "scripts": {
    "prebuild": "bun scripts/bundle-skills.ts",
    "build": "bun build src/cli.ts --outdir dist --target node --format esm",
    "dev": "bun --watch src/cli.ts",
    "test": "bun test",
    "prepublishOnly": "bun run build"
  },
  "dependencies": {
    "commander": "^13.0.0",
    "picocolors": "^1.1.0"
  },
  "devDependencies": {}
}
```

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Bun as sole dev tool | Eliminates 4 devDeps, simplifies CI, faster builds |
| `--target node` output | Maximum compatibility — users don't need Bun installed |
| `node:fs` only (no fs-extra) | Node.js built-in `cpSync` covers recursive copy since v16.7 |
| commander | Lightweight, battle-tested, excellent TS support |
| picocolors | 14x smaller than chalk, zero deps, ESM-native |
| Skills bundled (not fetched) | Offline-first, no network dependency, simpler |
| Adapter pattern | Adding new tool = one new file, no core changes |
| Lockfile per scope | Separate global/local tracking |

## Error Handling

| Error | Behavior |
|-------|----------|
| Unknown skill name | Print available skills, exit 1 |
| Target dir not writable | Print permission error with fix suggestion, exit 1 |
| Skill already installed | Skip with info (idempotent), `--force` to overwrite |
| Symlink from npx cache | Warn — link breaks after cache cleanup |
| Corrupted lockfile | Backup corrupted file, create fresh, warn user |
| No lockfile | Create on first install |
