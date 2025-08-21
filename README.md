# Kid0 Multi‑Agent Orchestrator — Refactor Pass 1

## Overview
Unified “Kid” naming across docs and configs, bootstrap via [.0kid/orchestration.yaml](.0kid/orchestration.yaml), removal of stale placeholders, and addition of overview documents plus pass‑through methodology bridge and unified agents to enable minimal orchestration.

## Architecture
- Overview: [.0kid/architecture_overview.md](.0kid/architecture_overview.md)
- Kid architecture: [.0kid/kid_architecture.md](.0kid/kid_architecture.md)
- Context architecture: [.0kid/governor/architectural-context/architecture.md](.0kid/governor/architectural-context/architecture.md)
- Note: EE/CEng agents to be added in Pass 2 diagram refresh.

## Orchestration & Contracts
- Orchestration config: [.0kid/orchestration.yaml](.0kid/orchestration.yaml)
  - Brief schema keys: naming.canonical_brand, autonomy.enabled, gates.{pre_spec, pre_implement, post_verify}, paths.*, bootstrap.*, commit_policy.*
- Methodology bridge: [.0kid/methodology-bridge.json](.0kid/methodology-bridge.json)
- Agents: [.0kid/unified-agents.yaml](.0kid/unified-agents.yaml)
- Rules: [.0kid/governor/rules/](.0kid/governor/rules/)
- Patterns (if present): [.0kid/patterns/success/](.0kid/patterns/success/), [.0kid/patterns/antipatterns/](.0kid/patterns/antipatterns/)

## Core Docs & Overview
- Hub: [.0kid/project_overview.md](.0kid/project_overview.md)
- Project: [.0kid/kid_project.md](.0kid/kid_project.md)
- Loop: [.0kid/kid_loop.md](.0kid/kid_loop.md)
- Tracker: [.0kid/kid_tracker.md](.0kid/kid_tracker.md)
- Log: [.0kid/kid_log.md](.0kid/kid_log.md)

## Boomerang Orchestrator + Custom Modes
- Overview: The Orchestrator coordinates a concise, gated delivery loop. Flow: orchestrator → loop-propose → spec-author → implement → qa-gate → (security-auditor?, integration-auditor?) → finalize.
- Sources:
  - Custom modes live at [custom_modes.yaml](custom_modes.yaml)
  - CI guardrail lives at [.github/workflows/no-legacy-prompts.yml](.github/workflows/no-legacy-prompts.yml)
  - Legacy prompt pack removed: [.0kid/prompts](.0kid/prompts) (reintroduction is blocked by CI)

### Default Loop (one-liners)
- orchestrator: Strategic workflow coordinator (Boomerang loop; delegates, enforces gates).
- loop-propose: Propose minimal change set and rationale.
- spec-author: Draft `.0kid/specs/<NodeID>.md` with ARC.
- implement: Apply diffs + tests; report results.
- qa-gate: Enforce ARC + tests; Go/No-Go.
- security-auditor: Security scan; CRITICAL blocks release.
- integration-auditor: Holistic integration review for risky changes.
- finalize: Update docs/release notes; suggest tag and commit.

### Added Custom Modes (slugs + one-liners)
- feature-intake: Convert raw ideas to stories, NodeIDs, priorities.
- preflight-analyst: Assess risks/impact and sequencing before build.
- architect: Generate/refresh C4, ADRs, architecture docs.
- arch-health: Detect drift/complexity; recommend refactors.
- micro-fix: Apply small, surgical fixes with tests.
- critical-issue: Triage and resolve Sev‑1/2 incidents.
- refactor-node: Internal refactors without behavior change.
- retrofit: Add Kid docs to existing repos.
- onboarding-verify: Verify fresh machine can build/test/run.
- expand-project: Scale-out plan and roadmap grooming.
- kid-context-engineer: Initialize/repair `.0kid/` workspace; log context.
- kid-architect: Own architecture views and ADRs.
- kid-spec-author: Write per‑NodeID specs with ARC.
- kid-qa-gate: Enforce ARC + tests; issue Go/No-Go.
- kid-release-manager: Draft release notes; suggest semver tag.
- kid-risk-officer: Maintain risk register linked to NodeIDs.
- kid-business-analyst: Business briefs with KPIs and value.
- designer-t1: Produce TDDs linked to NodeIDs/specs.
- feature-planner-t2: Break features into tasks in plan.
- developer-code-t2: Implement T2 features with notes/tests.
- code: High‑complexity implementation with TDD.
- quality-assurance-gate: End‑of‑phase doc/test verification.
- documentation-writer-t2: Maintain living docs and navigation.
- devops-engineer-t2: CI/CD and infra changes with docs.
- junior-code-t3: Execute very small coding tasks.
- test-runner-t3: Run tests and report pass/fail.
- junior-debug-t3: Identify simple issues and propose fixes.
- mermaid-diagrammer-t3: Output valid Mermaid diagrams only.
- ask: Research/explain; propose approaches.
- debug: Deep root‑cause analysis and fix path.
- dependency-docs-harvester: Curate per‑library docs into `.0kid/docs`.

## Orchestrator Macros

### Work Session Management
```bash
# Update todo list and start focused work session
update_todo_list "Work Session"
```

### Context Engineering
```bash
# Initialize or repair Kid workspace with context logging
<new_task>
<mode>kid-context-engineer</mode>
<message>Initialize .0kid/ workspace structure and log current context</message>
</new_task>
```

### Documentation Harvesting
```bash
# Curate library documentation into structured format
<new_task>
<mode>dependency-docs-harvester</mode>
<message>Harvest and organize library documentation into .0kid/docs/</message>
</new_task>
```

### Preflight Analysis
```bash
# Risk assessment and impact analysis before implementation
<new_task>
<mode>preflight-analysis-t2</mode>
<message>Analyze proposed changes for risk vectors and provide mitigation strategies</message>
</new_task>
```

### CI Guardrail
- What it does: Blocks PRs that add or resurrect [.0kid/prompts](.0kid/prompts).
- How it works: The job in [.github/workflows/no-legacy-prompts.yml](.github/workflows/no-legacy-prompts.yml) fails when the `.0kid/prompts` directory exists or appears in the PR diff.

### Quick “Run a Feature Through the Loop”
1) orchestrator: normalize goal → delegate to loop-propose.
2) loop-propose: list files to change, tests to touch, rollback plan.
3) spec-author: write/update `.0kid/specs/<NodeID>.md` with ARC.
4) implement: make minimal diffs; run tests.
5) qa-gate: verify tests + ARC; decide Go/No-Go.
6) optional: security-auditor and/or integration-auditor for higher risk.
7) finalize: update docs and [.0kid/release_notes](.0kid/release_notes); recommend tag.

### Local Verification
- YAML parse (custom modes):
```bash
python - <<'PY'
import yaml, sys
p = 'custom_modes.yaml'
yaml.safe_load(open(p))
print('YAML_OK', p)
PY
```

- YAML parse (CI guardrail workflow):
```bash
python - <<'PY'
import yaml, sys
p = '.github/workflows/no-legacy-prompts.yml'
yaml.safe_load(open(p))
print('YAML_OK', p)
PY
```

- Guardrail simulation (presence vs absence of `.0kid/prompts`):
```bash
# Blocked (presence)
mkdir -p .0kid/prompts
if [ -d ".0kid/prompts" ]; then echo "BLOCKED: legacy prompts present"; else echo "OK"; fi
```
```bash
# Allowed (absence)
rm -rf .0kid/prompts
if [ -d ".0kid/prompts" ]; then echo "BLOCKED"; else echo "OK: no legacy prompts"; fi
```

### Changelog (NDv1.9 → Custom Modes Migration)
1) chore(prompts): archive NDv1.9 prompt pack before migration
   - Action: Archived legacy prompt content from [.0kid/prompts](.0kid/prompts) prior to removal.
2) chore(prompts): remove NDv1.9 prompts (superseded by Orchestrator + modes)
   - Removed: [.0kid/prompts](.0kid/prompts)
3) chore(roo): add Boomerang Orchestrator modes and CI guardrail
   - Added/Updated: [custom_modes.yaml](custom_modes.yaml), [.github/workflows/no-legacy-prompts.yml](.github/workflows/no-legacy-prompts.yml), [README.md](README.md)
4) chore(prompts): purge legacy prompts dir remnants
   - Verified: no remaining `.0kid/prompts` entries; CI blocks reintroduction.

## Extension Config Alignment
- Updated modes: [custom_modes.yaml](custom_modes.yaml)
- Note: slugs nodeer-* → kid-*; all noderr_* paths → kid_*.

## Validation & Demo Commands
- Brand sweep:
  - Edited targets: [custom_modes.yaml](custom_modes.yaml), [.0kid/fusion/fusion-orchestrator.md](.0kid/fusion/fusion-orchestrator.md), [.0kid/governor/architectural-context/README.md](.0kid/governor/architectural-context/README.md), [.0kid/kid_architecture.md](.0kid/kid_architecture.md), [.0kid/kid_tracker.md](.0kid/kid_tracker.md), [.0kid/project_overview.md](.0kid/project_overview.md), [.0kid/architecture_overview.md](.0kid/architecture_overview.md), [.0kid/orchestration.yaml](.0kid/orchestration.yaml)

```bash
grep -RniE '(noderr|nodeer)' -- custom_modes.yaml .0kid/fusion/fusion-orchestrator.md .0kid/governor/architectural-context/README.md .0kid/kid_architecture.md .0kid/kid_tracker.md .0kid/project_overview.md .0kid/architecture_overview.md .0kid/orchestration.yaml
```
- Parity checks (if sources present):

```bash
diff -u .0kid/fusion/methodology-bridge.json .0kid/methodology-bridge.json
diff -u .0kid/fusion/unified-agents.yaml .0kid/unified-agents.yaml
```
- YAML sanity:

```bash
python - <<'PY'
import yaml,sys
for p in ['custom_modes.yaml','.0kid/unified-agents.yaml','.0kid/orchestration.yaml']:
  print('YAML_OK',p) if yaml.safe_load(open(p)) is not None else sys.exit(1)
print('YAML_ALL_OK')
PY
```

## Known Limitations / Next Pass
- Remaining legacy brand text likely in [.0kid/prompts/](.0kid/prompts/) to be swept in Pass 2.
- Architecture diagram update to include EE/CEng agents.
- Rule audit integration in [.0kid/kid_loop.md](.0kid/kid_loop.md) planned for Pass 2.

## Changelog (Pass 1)
- Edited: [custom_modes.yaml](custom_modes.yaml), [.0kid/fusion/fusion-orchestrator.md](.0kid/fusion/fusion-orchestrator.md), [.0kid/governor/architectural-context/README.md](.0kid/governor/architectural-context/README.md), [.0kid/kid_architecture.md](.0kid/kid_architecture.md), [.0kid/kid_tracker.md](.0kid/kid_tracker.md)
- Added: [.0kid/project_overview.md](.0kid/project_overview.md), [.0kid/architecture_overview.md](.0kid/architecture_overview.md), [.0kid/methodology-bridge.json](.0kid/methodology-bridge.json), [.0kid/unified-agents.yaml](.0kid/unified-agents.yaml), [.0kid/orchestration.yaml](.0kid/orchestration.yaml)

## Library Docs Index
- Index: [.0kid/docs/index.json](.0kid/docs/index.json)
- Harvester mode: `dependency-docs-harvester`