# Documentation System

This directory contains comprehensive documentation for all external libraries and dependencies used in the Kid project. The documentation system is managed by automated tools that ensure consistency and completeness.

## Structure

The documentation follows a standardized structure:

```
.0kid/docs/
├── index.json              # Central registry of all documented libraries
├── README.md              # This file
└── <library-slug>/         # Per-library documentation folders
    ├── OVERVIEW.md         # Library overview and purpose
    ├── USAGE.md           # Usage examples and best practices
    ├── PITFALLS.md        # Common issues and gotchas
    └── LINKS.md           # Useful links and resources
```

Each library gets its own folder with a standardized slug (lowercase, @ and / replaced with dashes). The four required files provide comprehensive coverage of what developers need to know.

## Harvester System

The documentation system is maintained by the **dependency docs harvester** (`scripts/dependency-docs-harvester.mjs`), which:

- Scans the entire repository for import/require statements
- Checks `package.json` for declared dependencies  
- Automatically creates folder structure for new libraries
- Updates the central `index.json` registry
- Generates skeleton documentation files when needed

### Harvester Usage

```bash
# Check if updates are needed (exits 1 if changes required)
node scripts/dependency-docs-harvester.mjs --check

# Apply updates (default mode)
node scripts/dependency-docs-harvester.mjs --write

# Preview changes without writing
node scripts/dependency-docs-harvester.mjs --dry-run
```

The harvester is idempotent - running it multiple times without source changes produces no diffs.

## Compliance System

Documentation compliance is enforced by the **QA composite gate** (`scripts/qa-composite.mjs`), which:

1. Runs the harvester in check mode
2. Applies updates if needed
3. Runs the docs compliance checker (`scripts/check-lib-docs.mjs`)
4. Generates a markdown report with results
5. Exits with appropriate codes for CI integration

### QA Gate Usage

```bash
# Run full QA composite check
node scripts/qa-composite.mjs
```

Exit codes:
- `0`: All checks passed
- `1`: Harvester detected gaps (auto-fixed)
- `2`: Documentation compliance failure
- `3`: Runtime error

## CI Integration

Two GitHub Actions workflows enforce documentation quality:

- **`kid-qa-composite.yml`**: Runs the full QA gate on every push/PR
- **`kid-parity-check.yml`**: Ensures config file canonicalization

The QA gate will fail CI if any external libraries lack proper documentation, ensuring the system stays current as dependencies evolve.

## Manual Documentation

While the harvester creates skeleton files, developers must manually populate:

- **OVERVIEW.md**: Library purpose, key concepts, when to use
- **USAGE.md**: Code examples, API highlights, integration patterns  
- **PITFALLS.md**: Common mistakes, edge cases, troubleshooting
- **LINKS.md**: Official docs, tutorials, related resources

This ensures each library has comprehensive, developer-focused documentation that goes beyond auto-generated API references.