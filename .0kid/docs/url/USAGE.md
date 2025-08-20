# Usage

Basic WHATWG URL:
```js
const u = new URL('https://example.com/docs?page=1#top');
console.log(u.hostname, u.pathname, u.searchParams.get('page'));
```

Mutating query params:
```js
const u = new URL('https://api.example.com/items');
u.searchParams.set('limit', '50');
u.searchParams.append('tag', 'blue');
console.log(u.toString());
```

File path interop:
```js
import { fileURLToPath, pathToFileURL } from 'url';
const p = fileURLToPath(new URL('file:///tmp/file.txt'));
const u = pathToFileURL('/tmp/file.txt');
```

Relative resolution:
```js
const base = new URL('https://example.com/root/');
const child = new URL('./a/b', base); // https://example.com/root/a/b
```

Integration notes:
- Prefer `new URL()` over legacy `url.parse`.
- Use `URLSearchParams` helpers to manage query strings safely.
- For file paths, use `fileURLToPath`/`pathToFileURL` to avoid manual parsing.