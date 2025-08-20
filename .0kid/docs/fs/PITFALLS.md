# Pitfalls

Security:
- Validate and sanitize paths to avoid path traversal.
- Avoid following untrusted symlinks unless explicitly intended.

Performance:
- Prefer streaming (`createReadStream`/`createWriteStream`) for large files.
- Batch operations where possible; avoid excessive sync calls on hot paths.

Reliability:
- Always handle `ENOENT`, `EEXIST`, permission errors.
- Use `fs.mkdir({ recursive: true })` and `fs.rm({ recursive: true, force: true })` carefully.

Compatibility:
- Watchers (`fs.watch`) vary by platform; coalesce events and debounce.
- Use `fs.promises` to reduce callback error handling complexity.

Migration:
- Replace deprecated callbacks with `fs/promises`.
- Ensure atomic writes (write temp + rename) to prevent partial file corruption.