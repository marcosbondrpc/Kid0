// Dependency Docs Compliance Checker
// Scans code imports and verifies each external library has docs in .0kid/docs/index.json
// Exits non-zero if missing entries are detected.

import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';

const repoRoot = process.cwd();
const indexPath = path.join(repoRoot, '.0kid', 'docs', 'index.json');

// File extensions to scan
const exts = ['.js', '.ts', '.mjs', '.cjs', '.jsx', '.tsx', '.py', '.go', '.rs', '.rb', '.cs'];

// Basic ignore filters
const ignoreDirs = new Set([
  'node_modules', '.git', '.github', '.idea', '.vscode', 'dist', 'build', 'out', '.next', '.cache',
  '.venv', 'venv', '__pycache__', 'target', 'bin', 'obj', '.0kid/docs'
]);

// Regex patterns to detect external imports (first segment only)
const patterns = [
  // JS/TS ESM/CJS
  { lang: 'js/ts import', regex: /\bimport\s+(?:[^'"]+?\s+from\s+)?["']([^"']+)["']/g },
  { lang: 'js/ts dynamic', regex: /\bimport\(\s*["']([^"']+)["']\s*\)/g },
  { lang: 'js/ts require', regex: /\brequire\(\s*["']([^"']+)["']\s*\)/g },
  // Python
  { lang: 'python import', regex: /^\s*import\s+([a-zA-Z0-9_\.]+)/gm },
  { lang: 'python from', regex: /^\s*from\s+([a-zA-Z0-9_\.]+)\s+import\s+/gm },
  // Go
  { lang: 'go import', regex: /^\s*import\s+"([^"]+)"/gm },
  { lang: 'go import block', regex: /^\s*import\s*\(\s*([\s\S]*?)\)/gm, inner: /"([^"]+)"/g },
  // Rust (very approximate for external crates when using `extern crate` or `use <crate>::`)
  { lang: 'rust extern', regex: /^\s*extern\s+crate\s+([a-zA-Z0-9_]+)/gm },
  { lang: 'rust use', regex: /^\s*use\s+([a-zA-Z0-9_]+)::/gm },
  // Ruby
  { lang: 'ruby require', regex: /^\s*require(?:_relative)?\s+["']([^"']+)["']/gm },
  // C#
  { lang: 'csharp using', regex: /^\s*using\s+([a-zA-Z0-9_.]+)\s*;/gm }
];

// Helper: determine if a module specifier is external (not relative/path)
function isExternal(spec) {
  if (!spec) return false;
  // relative or absolute
  if (spec.startsWith('.') || spec.startsWith('/') || spec.match(/^[A-Za-z]:\\/)) return false;
  // urls
  if (/^[a-z]+:\/\//i.test(spec)) return false;
  return true;
}

// Normalize lib key to its top-level package/namespace
function topLevel(spec) {
  // npm scoped packages like @scope/name -> @scope/name
  if (spec.startsWith('@')) {
    const parts = spec.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : spec;
  }
  // strip subpaths: react/jsx-runtime -> react
  return spec.split('/')[0];
}

async function readJSONSafe(fp) {
  try {
    const txt = await fs.readFile(fp, 'utf8');
    const data = JSON.parse(txt || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const rel = path.relative(repoRoot, p);
      const name = ent.name;
      if (ignoreDirs.has(name) || ignoreDirs.has(rel)) continue;
      // Skip hidden folders except .0kid (but still skip .0kid/docs explicitly above)
      if (name.startsWith('.') && name !== '.0kid') continue;
      yield* walk(p);
    } else {
      const ext = path.extname(ent.name).toLowerCase();
      if (exts.includes(ext)) {
        yield p;
      }
    }
  }
}

async function collectImports() {
  const found = new Set();
  for await (const file of walk(repoRoot)) {
    try {
      const content = await fs.readFile(file, 'utf8');
      for (const pat of patterns) {
        if (pat.inner) {
          // handle go import block
          let m;
          while ((m = pat.regex.exec(content)) !== null) {
            const block = m[1] || '';
            let im;
            while ((im = pat.inner.exec(block)) !== null) {
              const spec = im[1];
              if (isExternal(spec)) found.add(topLevel(spec));
            }
          }
        } else {
          let m;
          while ((m = pat.regex.exec(content)) !== null) {
            const raw = m[1];
            if (!raw) continue;
            const spec = pat.lang.startsWith('python') || pat.lang.startsWith('csharp')
              ? raw.split('.')[0] // top-level module/namespace
              : raw;
            if (isExternal(spec)) found.add(topLevel(spec));
          }
        }
      }
    } catch {
      // ignore unreadable files
    }
  }
  return Array.from(found).sort();
}

(async function main() {
  const idx = await readJSONSafe(indexPath);
  const libraries = idx.libraries && typeof idx.libraries === 'object' ? idx.libraries : {};
  const documented = new Set(Object.keys(libraries));

  const imports = await collectImports();

  const missing = imports.filter(lib => !documented.has(lib));

  if (missing.length > 0) {
    console.error('Missing library docs for:', missing.join(', '));
    console.error(`Add entries under .0kid/docs and update index.json accordingly.`);
    process.exit(1);
  } else {
    console.log('Docs check passed.');
    process.exit(0);
  }
})().catch(err => {
  console.error('Docs check error:', err?.message || err);
  process.exit(2);
});