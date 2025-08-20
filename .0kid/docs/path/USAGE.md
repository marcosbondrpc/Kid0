# Usage

Basics:
```js
import path from 'path';
const full = path.join('a', 'b', 'c.txt');
const abs = path.resolve('a', '..', full);
const parsed = path.parse(full); // { root, dir, base, ext, name }
```

Normalize and compare:
```js
const a = path.normalize('/a/b/../c');
const b = '/a/c';
console.log(a === b); // platform-dependent; consider case sensitivity
```

POSIX vs Windows:
```js
path.posix.join('a', 'b'); // 'a/b'
path.win32.join('a', 'b'); // 'a\\b'
```

Interop with file URLs:
```js
import { fileURLToPath, pathToFileURL } from 'url';
const filePath = fileURLToPath(new URL('file:///tmp/file.txt'));
const fileUrl = pathToFileURL('/tmp/file.txt');
```

Integration notes:
- Use `path.join`/`path.resolve` rather than string concat.
- Normalize before comparisons; be aware of platform differences.