// QA Composite Gate
// Runs dependency harvester and lib docs checker
// Aggregates results and produces markdown report

import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { runHarvester } from './dependency-docs-harvester.mjs';

const repoRoot = process.cwd();
const reportsDir = path.join(repoRoot, '.0kid', 'qa_reports');
const reportPath = path.join(reportsDir, 'report-libs.md');

// Exit codes
const EXIT_CODES = {
  PASS: 0,
  HARVESTER_GAP: 1,
  CHECKER_FAILURE: 2,
  RUNTIME_ERROR: 3
};

async function runHarvesterCheck() {
  try {
    // First run harvester in check mode
    const checkResult = await runHarvester({
      writeMode: false,
      checkMode: true,
      dryRun: false
    });
    
    return {
      success: !checkResult.changesMade,
      needsUpdate: checkResult.changesMade,
      result: checkResult
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runHarvesterWrite() {
  try {
    const writeResult = await runHarvester({
      writeMode: true,
      checkMode: false,
      dryRun: false
    });
    
    return {
      success: true,
      result: writeResult
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runLibDocsChecker() {
  try {
    // Execute the check-lib-docs.mjs script and capture output
    const result = execSync('node scripts/check-lib-docs.mjs', {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    return {
      success: true,
      output: result.trim()
    };
  } catch (error) {
    return {
      success: false,
      output: error.stdout ? error.stdout.trim() : '',
      error: error.stderr ? error.stderr.trim() : error.message,
      exitCode: error.status
    };
  }
}

function generateMarkdownReport(harvesterResult, checkerResult, harvesterWriteResult = null) {
  const timestamp = new Date().toISOString();
  const lines = [];
  
  lines.push('# Library Documentation QA Report');
  lines.push('');
  lines.push(`**Generated:** ${timestamp}`);
  lines.push('');
  
  // Harvester section
  lines.push('## Dependency Harvester');
  lines.push('');
  if (harvesterResult.success) {
    if (harvesterResult.needsUpdate) {
      lines.push('**Status:** ❌ Changes needed');
      lines.push('');
      if (harvesterResult.result) {
        lines.push(`- Total libraries: ${harvesterResult.result.totalLibraries}`);
        lines.push(`- New libraries: ${harvesterResult.result.newLibraries}`);
        lines.push(`- Removed libraries: ${harvesterResult.result.removedLibraries}`);
      }
      if (harvesterWriteResult && harvesterWriteResult.success) {
        lines.push('');
        lines.push('**Auto-fix applied:** ✅ Index updated');
      }
    } else {
      lines.push('**Status:** ✅ Up to date');
      if (harvesterResult.result) {
        lines.push('');
        lines.push(`- Total libraries: ${harvesterResult.result.totalLibraries}`);
      }
    }
  } else {
    lines.push('**Status:** ❌ Error');
    lines.push('');
    lines.push(`**Error:** ${harvesterResult.error}`);
  }
  
  lines.push('');
  
  // Checker section
  lines.push('## Documentation Compliance');
  lines.push('');
  if (checkerResult.success) {
    lines.push('**Status:** ✅ All libraries documented');
    lines.push('');
    lines.push('```');
    lines.push(checkerResult.output);
    lines.push('```');
  } else {
    lines.push('**Status:** ❌ Missing documentation');
    lines.push('');
    if (checkerResult.output) {
      lines.push('**Checker output:**');
      lines.push('```');
      lines.push(checkerResult.output);
      lines.push('```');
    }
    if (checkerResult.error) {
      lines.push('');
      lines.push('**Error:**');
      lines.push('```');
      lines.push(checkerResult.error);
      lines.push('```');
    }
  }
  
  lines.push('');
  
  // Summary
  lines.push('## Summary');
  lines.push('');
  const overallSuccess = harvesterResult.success && 
                        !harvesterResult.needsUpdate && 
                        checkerResult.success;
  
  if (overallSuccess) {
    lines.push('**Overall Status:** ✅ PASS - All checks passed');
  } else {
    lines.push('**Overall Status:** ❌ FAIL - Issues detected');
    lines.push('');
    lines.push('**Actions needed:**');
    if (harvesterResult.needsUpdate && !harvesterWriteResult?.success) {
      lines.push('- Run `node scripts/dependency-docs-harvester.mjs` to update index');
    }
    if (!checkerResult.success) {
      lines.push('- Add missing library documentation as indicated above');
    }
  }
  
  return lines.join('\n');
}

export async function main() {
  try {
    console.log('Running QA Composite Gate...');
    
    // Step 1: Check harvester status
    const harvesterResult = await runHarvesterCheck();
    
    // Step 2: If harvester needs update, run write mode
    let harvesterWriteResult = null;
    if (harvesterResult.needsUpdate) {
      console.log('Harvester detected changes, applying updates...');
      harvesterWriteResult = await runHarvesterWrite();
    }
    
    // Step 3: Run docs checker
    const checkerResult = await runLibDocsChecker();
    
    // Step 4: Generate report
    const report = generateMarkdownReport(harvesterResult, checkerResult, harvesterWriteResult);
    
    // Step 5: Write report
    await fs.mkdir(reportsDir, { recursive: true });
    await fs.writeFile(reportPath, report, 'utf8');
    
    console.log(`Report written to: ${reportPath}`);
    
    // Step 6: Determine exit code
    let exitCode = EXIT_CODES.PASS;
    
    if (!harvesterResult.success) {
      exitCode = EXIT_CODES.RUNTIME_ERROR;
    } else if (harvesterResult.needsUpdate && !harvesterWriteResult?.success) {
      exitCode = EXIT_CODES.HARVESTER_GAP;
    } else if (!checkerResult.success) {
      exitCode = EXIT_CODES.CHECKER_FAILURE;
    }
    
    console.log(`Exit code: ${exitCode}`);
    process.exit(exitCode);
    
  } catch (error) {
    console.error('QA Composite error:', error.message);
    process.exit(EXIT_CODES.RUNTIME_ERROR);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}