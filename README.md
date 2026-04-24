# agent-skills

Reusable skills for AI coding agents — OpenCode, Claude Code, Cursor, GitHub Copilot, Windsurf, and more.

A consolidated skill repository organized under the `skills/` directory with a powerful meta-skill that orchestrates the full development lifecycle.

---

## Quick Start

### Install the Meta-Skill (Recommended)

The **spec-driven** meta-skill (v3.0.0) routes all 7 lifecycle phases through a single entry point.

```bash
node install.js
```

This installs only the `spec-driven` meta-skill to `~/.config/opencode/skills/spec-driven/`.

### Install All Skills

To install every skill (planning, incremental-build, test-verification, code-review, code-simplification, shipping):

```bash
node install.js --all
```

### Install a Specific Skill

To install only one skill:

```bash
node install.js --skill planning
```

Or:

```bash
node install.js --skill code-review
node install.js --skill incremental-build
# ... etc
```

---

## Available Skills

### Meta-Skill: spec-driven (v3.0.0)

The **spec-driven** meta-skill orchestrates the complete development lifecycle in 7 phases:

| Phase | Triggers (EN) | Triggers (PT) | Purpose |
|-------|--------------|--------------|---------|
| **SPEC** | `/spec`, `specify`, `write spec` | `vamos especificar`, `preciso de um spec` | Capture what to build with testable requirements |
| **PLAN** | `/plan`, `plan this`, `break into tasks` | `vamos planejar`, `quebra em tarefas` | Design vertical slicing and task breakdown |
| **BUILD** | `/build`, `implement`, `execute tasks` | `vamos construir`, `implementar` | Execute implementation tasks one by one |
| **TEST** | `/test`, `verify`, `prove it works` | `vamos testar`, `teste isso` | Strategic test coverage and verification |
| **REVIEW** | `/review`, `code review`, `check quality` | `revisa isso` | Multi-axis code quality assessment |
| **SIMPLIFY** | `/simplify`, `refactor` | `simplifica`, `refatora` | Apply simplification patterns and refactoring |
| **SHIP** | `/ship`, `release`, `publish` | `vamos fazer release`, `versiona` | Release management and versioning |

**Install:** `node install.js` (default)

**Learn more:** See [skills/spec-driven/SKILL.md](./skills/spec-driven/SKILL.md)

---

### Individual Skills

Each individual skill is self-contained and can be installed independently:

#### planning

Vertical slicing and task breakdown planning.

- **Trigger:** `/plan`
- **Purpose:** Design approach, create task breakdown with dependencies
- **Standalone:** Yes — can be used independently

**Install:** `node install.js --skill planning`

---

#### incremental-build

Incremental build cycle execution.

- **Trigger:** `/build`
- **Purpose:** Execute tasks in build cycle with verification
- **Standalone:** Yes — can be used independently

**Install:** `node install.js --skill incremental-build`

---

#### test-verification

Test verification with prove-it pattern.

- **Trigger:** `/test`
- **Purpose:** Strategic test coverage and verify behavior
- **Standalone:** Yes — can be used independently

**Install:** `node install.js --skill test-verification`

---

#### code-review

Code quality assessment using review axes.

- **Trigger:** `/review`
- **Purpose:** Multi-dimensional code review and feedback
- **Standalone:** Yes — can be used independently

**Install:** `node install.js --skill code-review`

---

#### code-simplification

Code refactoring and simplification patterns.

- **Trigger:** `/simplify`
- **Purpose:** Apply simplification patterns and reduce complexity
- **Standalone:** Yes — can be used independently

**Install:** `node install.js --skill code-simplification`

---

#### shipping

Release management and versioning.

- **Trigger:** `/ship`
- **Purpose:** Release checklist, versioning, changelog management
- **Standalone:** Yes — can be used independently

**Install:** `node install.js --skill shipping`

---

## Structure

```
agent-skills/
├── skills/                          ← All skills organized here
│   ├── spec-driven/                 ← Meta-skill (orchestrates all 7 phases)
│   │   ├── SKILL.md
│   │   ├── .skill-meta.json
│   │   └── references/              ← 26 supporting reference files
│   │       ├── phase-spec.md
│   │       ├── phase-plan.md
│   │       ├── phase-build.md
│   │       ├── phase-test.md
│   │       ├── phase-review.md
│   │       ├── phase-simplify.md
│   │       ├── phase-ship.md
│   │       └── ... (19 supporting docs)
│   ├── planning/                    ← Individual skill
│   ├── incremental-build/           ← Individual skill
│   ├── test-verification/           ← Individual skill
│   ├── code-review/                 ← Individual skill
│   ├── code-simplification/         ← Individual skill
│   └── shipping/                    ← Individual skill
├── install.js                       ← Installation script
├── README.md
├── package.json
└── .specs/                          ← Feature specifications and tasks
```

---

## Installation Modes

### Mode 1: Default (Meta-Skill Only)

```bash
node install.js
```

**What it installs:**
- `spec-driven` meta-skill with all 7 phases
- All supporting reference files (26 total)
- Individual skills NOT installed

**Target:** `~/.config/opencode/skills/spec-driven/`

**Use case:** You want to use the full lifecycle pipeline through a single skill.

---

### Mode 2: All Skills

```bash
node install.js --all
```

**What it installs:**
- All 7 skills (spec-driven, planning, incremental-build, test-verification, code-review, code-simplification, shipping)
- Each skill gets its own directory

**Target:** `~/.config/opencode/skills/<skill-name>/`

**Use case:** You want access to all skills individually and the meta-skill.

---

### Mode 3: Specific Skill

```bash
node install.js --skill <skill-name>
```

**What it installs:**
- Only the named skill (e.g., `planning`, `code-review`)
- With all its reference files

**Target:** `~/.config/opencode/skills/<skill-name>/`

**Examples:**
```bash
node install.js --skill planning
node install.js --skill code-review
node install.js --skill incremental-build
```

**Use case:** You want just one skill without installing everything.

---

## Usage

### With the Meta-Skill (spec-driven)

After installing with `node install.js`:

```
User: "Implement user authentication"
Agent: [Runs SPEC phase]
       → Creates spec.md
       
User: "Approved"
Agent: [Runs PLAN phase]
       → Creates task breakdown in tasks.md
       
User: "Approved"
Agent: [Runs BUILD phase]
       → Executes each task
       → Marks tasks complete
       
User: (auto-continues or says "/test")
Agent: [Runs TEST phase]
       → Verifies with tests
       
Agent: [Runs REVIEW phase]
       → Code quality assessment
       
Agent: [Runs SIMPLIFY phase]
       → Applies refactoring patterns
       
Agent: [Runs SHIP phase]
       → Release with versioning
```

### With Individual Skills

Use each skill independently as needed:

```
User: "Let's plan this feature"
Agent: Runs planning skill → produces tasks.md

---

User: "Review this code"
Agent: Runs code-review skill → provides assessment

---

User: "Test this implementation"
Agent: Runs test-verification skill → creates test suite
```

---

## Reference Documentation

The meta-skill includes comprehensive reference files in `skills/spec-driven/references/`:

- **Phase files** (7): Detailed workflows for each phase
- **Templates**: spec.md, design.md, tasks.md, TASK.md, session logs
- **Patterns**: Vertical slicing, build cycles, prove-it testing, code review axes, simplification patterns
- **Guides**: Scope detection, context loading, state management, archive workflow

All reference files are included in the meta-skill installation and can be consulted during use.

---

## Requirements

- **Node.js:** ≥ 18
- **System:** macOS, Linux, or Windows (with WSL)
- **Installation target:** `~/.config/opencode/skills/`

---

## License

Skills are licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).

See [LICENSE](./LICENSE) for details.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Individual skill changes**: Keep skill content unchanged in spirit; clarify intent in commit message
2. **Meta-skill changes**: Update both SKILL.md and phase reference files consistently
3. **Reference changes**: Ensure traceability — which phase/skill uses this doc?
4. **Tests**: Ensure install.js works for all three modes before submitting

---

## Version History

### v3.0.0 (Current)

- **Release date**: 2026-04-24
- **Major change**: Consolidated structure with meta-skill orchestration
- **New**: Full lifecycle routing through single entry point
- **New**: All 7 phases unified
- **Improvement**: Granular install modes (default, --all, --skill)

### v2.x (Previous)

- SPECIFY-only spec-driven skill
- Individual skills not consolidated

### v1.x (Legacy)

- Early standalone spec-driven skill
