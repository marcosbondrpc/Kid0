# Usage

Basic async with callbacks:
```js
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

Promises API:
```js
import { readFile, writeFile } from 'fs/promises';
const txt = await readFile('file.txt', 'utf8');
await writeFile('out.txt', txt.toUpperCase());
```

Streams:
```js
import { createReadStream, createWriteStream } from 'fs';
createReadStream('in.bin').pipe(createWriteStream('out.bin'));
```

Watching:
```js
import { watch } from 'fs';
const w = watch('.', (event, filename) => console.log(event, filename));
```

Integration notes:
- Prefer `fs/promises` with async/await.
- Use streams for large files to avoid memory spikes.
- Always specify encoding when reading text.