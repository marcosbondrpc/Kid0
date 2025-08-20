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