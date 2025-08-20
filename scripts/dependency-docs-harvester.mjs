// Dependency Docs Harvester
// Scans repository for imports/requires and package.json dependencies
// Ensures per-library folder structure under .0kid/docs/<slug>/
// Updates index.json idempotently with library metadata

import { promises as fs } from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, '.0kid', 'docs');
const indexPath = path.join(docsRoot, 'index.json');

// File extensions to scan for imports
const scanExts = ['.js', '.ts', '.mjs', '.cjs', '.jsx', '.tsx', '.py', '.go', '.rs', '.rb', '.cs'];

// Directories to ignore during scan
const ignoreDirs = new Set([
  'node_modules', '.git', '.github', '.idea', '.vscode', 'dist', 'build', 'out', '.next', '.cache',
  '.venv', 'venv', '__pycache__', 'target', 'bin', 'obj', '.0kid/docs'
]);

// Import detection patterns
const importPatterns = [
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
  // Rust
  { lang: 'rust extern', regex: /^\s*extern\s+crate\s+([a-zA-Z0-9_]+)/gm },
  { lang: 'rust use', regex: /^\s*use\s+([a-zA-Z0-9_]+)::/gm },
  // Ruby
  { lang: 'ruby require', regex: /^\s*require(?:_relative)?\s+["']([^"']+)["']/gm },
  // C#
  { lang: 'csharp using', regex: /^\s*using\s+([a-zA-Z0-9_.]+)\s*;/gm }
];

// Required docs files for each library
const requiredFiles = ['OVERVIEW.md', 'USAGE.md', 'PITFALLS.md', 'LINKS.md'];

// Helper: check if module specifier is external
function isExternal(spec) {
  if (!spec) return false;
  // Skip relative paths, absolute paths, URLs
  if (spec.startsWith('.') || spec.startsWith('/') || spec.match(/^[A-Za-z]:\\/)) return false;
  if (/^[a-z]+:\/\//i.test(spec)) return false;
  return true;
}

// Normalize package name to top-level (for scoped packages)
function topLevelPackage(spec) {
  if (spec.startsWith('@')) {
    const parts = spec.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : spec;
  }
  return spec.split('/')[0];
}

// Generate slug from package name
function generateSlug(packageName) {
  return packageName.toLowerCase().replace(/[@\/]/g, '-');
}

// Safe JSON read with fallback
async function readJSONSafe(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

// Walk directory tree for source files
async function* walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const relativePath = path.relative(repoRoot, fullPath);
      if (ignoreDirs.has(entry.name) || ignoreDirs.has(relativePath)) continue;
      if (entry.name.startsWith('.') && entry.name !== '.0kid') continue;
      yield* walkFiles(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (scanExts.includes(ext)) {
        yield fullPath;
      }
    }
  }
}

// Scan for package.json dependencies
async function scanPackageJson() {
  const dependencies = new Set();
  try {
    const packagePath = path.join(repoRoot, 'package.json');
    const packageData = await readJSONSafe(packagePath);
    
    // Collect from all dependency sections
    for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      if (packageData[section] && typeof packageData[section] === 'object') {
        Object.keys(packageData[section]).forEach(dep => {
          if (isExternal(dep)) {
            dependencies.add(topLevelPackage(dep));
          }
        });
      }
    }
  } catch {
    // Ignore if package.json doesn't exist
  }
  return dependencies;
}

// Scan source files for import statements
async function scanImports() {
  const imports = new Set();
  
  for await (const filePath of walkFiles(repoRoot)) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      for (const pattern of importPatterns) {
        if (pattern.inner) {
          // Handle Go import blocks
          let match;
          while ((match = pattern.regex.exec(content)) !== null) {
            const block = match[1] || '';
            let innerMatch;
            while ((innerMatch = pattern.inner.exec(block)) !== null) {
              const spec = innerMatch[1];
              if (isExternal(spec)) {
                imports.add(topLevelPackage(spec));
              }
            }
          }
        } else {
          let match;
          while ((match = pattern.regex.exec(content)) !== null) {
            const rawSpec = match[1];
            if (!rawSpec) continue;
            
            // For Python/C#, split by dots to get top-level module
            const spec = pattern.lang.startsWith('python') || pattern.lang.startsWith('csharp')
              ? rawSpec.split('.')[0]
              : rawSpec;
              
            if (isExternal(spec)) {
              imports.add(topLevelPackage(spec));
            }
          }
        }
      }
    } catch {
      // Skip unreadable files
    }
  }
  
  return imports;
}

// Ensure library docs structure exists
async function ensureLibraryDocs(libraryName, slug) {
  const libDir = path.join(docsRoot, slug);
  
  try {
    await fs.mkdir(libDir, { recursive: true });
  } catch {
    // Directory exists
  }
  
  // Create skeleton files if missing
  for (const fileName of requiredFiles) {
    const filePath = path.join(libDir, fileName);
    try {
      await fs.access(filePath);
    } catch {
      // File doesn't exist, create skeleton
      const header = `# ${libraryName} - ${fileName.replace('.md', '')}\n\nTODO: Add ${fileName.replace('.md', '').toLowerCase()} documentation for ${libraryName}\n`;
      await fs.writeFile(filePath, header, 'utf8');
    }
  }
}

// Main harvester function
export async function runHarvester(options = {}) {
  const { writeMode = true, checkMode = false, dryRun = false } = options;
  
  try {
    // Scan for dependencies
    const [packageDeps, importDeps] = await Promise.all([
      scanPackageJson(),
      scanImports()
    ]);
    
    // Combine all found dependencies
    const allDeps = new Set([...packageDeps, ...importDeps]);
    const libraries = Array.from(allDeps).sort();
    
    // Read current index
    const currentIndex = await readJSONSafe(indexPath);
    const currentLibs = currentIndex.libraries || {};
    
    // Build new index structure
    const newLibs = {};
    let changesMade = false;
    
    for (const lib of libraries) {
      const slug = generateSlug(lib);
      const libPath = `.0kid/docs/${slug}/`;
      
      // Preserve existing entry or create new one
      const existing = currentLibs[lib] || {};
      newLibs[lib] = {
        id: lib,
        name: lib,
        slug: slug,
        paths: libPath,
        lastUpdated: existing.lastUpdated || new Date().toISOString(),
        version: existing.version || 'unknown',
        files: requiredFiles,
        links: existing.links || []
      };
      
      // Check if this is a new library
      if (!currentLibs[lib]) {
        changesMade = true;
        if (!dryRun && writeMode) {
          await ensureLibraryDocs(lib, slug);
        }
      }
    }
    
    // Check for removed libraries
    for (const existingLib of Object.keys(currentLibs)) {
      if (!allDeps.has(existingLib)) {
        changesMade = true;
      }
    }
    
    const newIndex = {
      libraries: newLibs,
      lastUpdated: new Date().toISOString()
    };
    
    // Write updated index if needed
    if (changesMade && !dryRun && writeMode) {
      await fs.mkdir(docsRoot, { recursive: true });
      await fs.writeFile(indexPath, JSON.stringify(newIndex, null, 2) + '\n', 'utf8');
    }
    
    // Prepare summary
    const summary = {
      totalLibraries: libraries.length,
      newLibraries: libraries.filter(lib => !currentLibs[lib]).length,
      removedLibraries: Object.keys(currentLibs).filter(lib => !allDeps.has(lib)).length,
      changesMade,
      libraries: libraries
    };
    
    // Output JSON summary
    console.log(JSON.stringify(summary, null, 2));
    
    // Exit codes based on check mode
    if (checkMode && changesMade) {
      process.exit(1);
    }
    
    return summary;
    
  } catch (error) {
    console.error('Harvester error:', error.message);
    process.exit(3);
  }
}

// CLI interface
export function cli() {
  const args = process.argv.slice(2);
  const options = {
    writeMode: !args.includes('--check') && !args.includes('--dry-run'),
    checkMode: args.includes('--check'),
    dryRun: args.includes('--dry-run')
  };
  
  runHarvester(options);
}

// Run CLI if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cli();
}