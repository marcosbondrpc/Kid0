// Parity Checker
// Compares canonical files against removed fusion duplicates
// Fails if fusion duplicates reappear or diverge from canonical versions

import { promises as fs } from 'fs';
import path from 'path';

const repoRoot = process.cwd();

// Hard-coded parity pairs: canonical ⇄ fusion duplicate
const PARITY_PAIRS = [
  {
    canonical: '.0kid/unified-agents.yaml',
    fusion: '.0kid/fusion/unified-agents.yaml',
    name: 'unified-agents.yaml'
  },
  {
    canonical: '.0kid/methodology-bridge.json', 
    fusion: '.0kid/fusion/methodology-bridge.json',
    name: 'methodology-bridge.json'
  }
];

async function fileExists(filePath) {
  try {
    await fs.access(path.join(repoRoot, filePath));
    return true;
  } catch {
    return false;
  }
}

async function readFileContent(filePath) {
  try {
    return await fs.readFile(path.join(repoRoot, filePath), 'utf8');
  } catch {
    return null;
  }
}

function generateSimpleDiff(canonical, fusion, fileName) {
  const canonicalLines = canonical.split('\n');
  const fusionLines = fusion.split('\n');
  
  const maxLines = Math.max(canonicalLines.length, fusionLines.length);
  const differences = [];
  
  for (let i = 0; i < maxLines; i++) {
    const canonicalLine = canonicalLines[i] || '';
    const fusionLine = fusionLines[i] || '';
    
    if (canonicalLine !== fusionLine) {
      differences.push({
        line: i + 1,
        canonical: canonicalLine,
        fusion: fusionLine
      });
    }
  }
  
  return differences;
}

export async function checkParity() {
  const results = [];
  let overallSuccess = true;
  
  for (const pair of PARITY_PAIRS) {
    const canonicalExists = await fileExists(pair.canonical);
    const fusionExists = await fileExists(pair.fusion);
    
    const result = {
      name: pair.name,
      canonical: pair.canonical,
      fusion: pair.fusion,
      canonicalExists,
      fusionExists,
      status: 'unknown',
      issues: []
    };
    
    if (!canonicalExists) {
      result.status = 'error';
      result.issues.push('Canonical file missing');
      overallSuccess = false;
    } else if (!fusionExists) {
      // This is the desired state - fusion duplicate removed
      result.status = 'ok';
    } else {
      // Fusion duplicate exists - need to check if it matches canonical
      result.status = 'violation';
      result.issues.push('Fusion duplicate exists (should be removed)');
      overallSuccess = false;
      
      // Also check for content differences
      const canonicalContent = await readFileContent(pair.canonical);
      const fusionContent = await readFileContent(pair.fusion);
      
      if (canonicalContent && fusionContent && canonicalContent !== fusionContent) {
        const differences = generateSimpleDiff(canonicalContent, fusionContent, pair.name);
        result.issues.push(`Content differs (${differences.length} lines)`);
        result.differences = differences.slice(0, 5); // Show first 5 differences
      }
    }
    
    results.push(result);
  }
  
  return {
    success: overallSuccess,
    results
  };
}

function generateReport(parityCheck) {
  const lines = [];
  
  lines.push('Parity Check Report');
  lines.push('==================');
  lines.push('');
  
  if (parityCheck.success) {
    lines.push('Status: ✅ PASS - All files in parity');
  } else {
    lines.push('Status: ❌ FAIL - Parity violations detected');
  }
  
  lines.push('');
  
  for (const result of parityCheck.results) {
    lines.push(`${result.name}:`);
    lines.push(`  Canonical: ${result.canonical} (${result.canonicalExists ? 'exists' : 'missing'})`);
    lines.push(`  Fusion:    ${result.fusion} (${result.fusionExists ? 'exists' : 'absent'})`);
    
    if (result.status === 'ok') {
      lines.push(`  Status:    ✅ OK`);
    } else if (result.status === 'violation') {
      lines.push(`  Status:    ❌ VIOLATION`);
      for (const issue of result.issues) {
        lines.push(`  Issue:     ${issue}`);
      }
      
      if (result.differences && result.differences.length > 0) {
        lines.push(`  Diffs:     First ${result.differences.length} differences:`);
        for (const diff of result.differences) {
          lines.push(`    Line ${diff.line}:`);
          lines.push(`      Canonical: ${diff.canonical}`);
          lines.push(`      Fusion:    ${diff.fusion}`);
        }
      }
    } else if (result.status === 'error') {
      lines.push(`  Status:    ❌ ERROR`);
      for (const issue of result.issues) {
        lines.push(`  Issue:     ${issue}`);
      }
    }
    
    lines.push('');
  }
  
  if (!parityCheck.success) {
    lines.push('Required actions:');
    for (const result of parityCheck.results) {
      if (result.status === 'violation') {
        lines.push(`- Remove duplicate file: ${result.fusion}`);
      } else if (result.status === 'error') {
        lines.push(`- Fix missing canonical file: ${result.canonical}`);
      }
    }
  }
  
  return lines.join('\n');
}

async function main() {
  try {
    const parityCheck = await checkParity();
    const report = generateReport(parityCheck);
    
    console.log(report);
    
    process.exit(parityCheck.success ? 0 : 1);
    
  } catch (error) {
    console.error('Parity check error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}