# Pitfalls

- Don’t assume `/` vs `\`; use `path.join`.
- `path.resolve` depends on CWD; pass bases explicitly when needed.
- Normalize before comparing; case sensitivity differs by platform.
- Prefer `fileURLToPath` / `pathToFileURL` for file URL interop.