# Pitfalls

- Avoid legacy `url.parse`/`url.format`; prefer WHATWG `URL`.
- Be careful with relative URLs; always construct with a base.
- Query params are UTF-8 encoded; use `URLSearchParams` instead of manual string handling.
- `file:` URL semantics differ by OS; use `fileURLToPath`/`pathToFileURL` helpers.