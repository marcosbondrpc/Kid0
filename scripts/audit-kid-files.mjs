#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Kid Files Audit');
console.log('==================');

let errorCount = 0;

function checkFileExists(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ MISSING: ${description} - ${filePath}`);
    errorCount++;
    return false;
  }
  console.log(`✅ EXISTS: ${description} - ${filePath}`);
  return true;
}

function validateJSON(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    JSON.parse(content);
    console.log(`✅ VALID JSON: ${description}`);
    return true;
  } catch (error) {
    console.log(`❌ INVALID JSON: ${description} - ${error.message}`);
    errorCount++;
    return false;
  }
}

function validateYAML(filePath, description, isCustomModes = false) {
  const fullPath = path.join(rootDir, filePath);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    // Basic YAML validation - check for proper structure
    if (isCustomModes) {
      if (content.includes('---') && content.includes('customModes:')) {
        console.log(`✅ VALID YAML: ${description}`);
        return true;
      } else {
        console.log(`❌ INVALID YAML STRUCTURE: ${description}`);
        errorCount++;
        return false;
      }
    } else {
      // For workflow YAML, just check basic structure
      if (content.includes('name:') && content.includes('on:') && content.includes('jobs:')) {
        console.log(`✅ VALID YAML: ${description}`);
        return true;
      } else {
        console.log(`❌ INVALID YAML STRUCTURE: ${description}`);
        errorCount++;
        return false;
      }
    }
  } catch (error) {
    console.log(`❌ YAML READ ERROR: ${description} - ${error.message}`);
    errorCount++;
    return false;
  }
}

function checkKidStructure() {
  console.log('\n📁 Checking .0kid/ structure...');
  
  const requiredDirs = [
    '.0kid/',
    '.0kid/docs/'
  ];
  
  requiredDirs.forEach(dir => {
    checkFileExists(dir, 'Directory');
  });
  
  const requiredFiles = [
    ['.0kid/docs/index.json', 'Library docs index'],
    ['.0kid/library_constraints.md', 'Library constraints document'],
    ['.0kid/noderr_architecture.md', 'Architecture document']
  ];
  
  requiredFiles.forEach(([file, desc]) => {
    checkFileExists(file, desc);
  });
}

function checkCustomModes() {
  console.log('\n🎯 Checking custom modes...');
  
  if (checkFileExists('custom_modes.yaml', 'Custom modes configuration')) {
    validateYAML('custom_modes.yaml', 'Custom modes YAML', true);
    
    // Check for required mode slugs
    const fullPath = path.join(rootDir, 'custom_modes.yaml');
    const content = fs.readFileSync(fullPath, 'utf8');
    
    const requiredModes = [
      'security-auditor-t2',
      'architecture-generator-t2', 
      'architecture-health-review-t2',
      'micro-fix-t3',
      'scaleout-planner-t2',
      'feature-idea-breakdown-t2',
      'critical-issue-response-t1',
      'integration-auditor-t2',
      'install-and-reconcile-t2',
      'midproject-feature-add-t2',
      'onboarding-audit-t2',
      'preflight-analysis-t2',
      'project-generator-t1',
      'refactor-node-t2',
      'retrofit-project-t2',
      'work-session-starter-t3',
      'loop-propose-change-set-t2'
    ];
    
    requiredModes.forEach(mode => {
      if (content.includes(`slug: ${mode}`)) {
        console.log(`✅ MODE FOUND: ${mode}`);
      } else {
        console.log(`❌ MODE MISSING: ${mode}`);
        errorCount++;
      }
    });
  }
}

function checkWorkflows() {
  console.log('\n🔄 Checking GitHub workflows...');
  
  if (checkFileExists('.github/workflows/kid-docs-compliance.yml', 'Kid docs compliance workflow')) {
    validateYAML('.github/workflows/kid-docs-compliance.yml', 'Workflow YAML');
  }
}

function checkScripts() {
  console.log('\n📜 Checking scripts...');
  
  checkFileExists('scripts/audit-kid-files.mjs', 'Audit script (self-check)');
  checkFileExists('scripts/check-lib-docs.mjs', 'Library docs checker');
}

function checkDocs() {
  console.log('\n📚 Checking documentation...');
  
  if (checkFileExists('.0kid/docs/index.json', 'Library docs index')) {
    validateJSON('.0kid/docs/index.json', 'Library docs index JSON');
  }
  
  checkFileExists('README.md', 'Main README');
  
  // Check for Orchestrator Macros section in README
  const readmePath = path.join(rootDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    if (content.includes('## Orchestrator Macros')) {
      console.log('✅ FOUND: Orchestrator Macros section in README');
    } else {
      console.log('❌ MISSING: Orchestrator Macros section in README');
      errorCount++;
    }
  }
}

// Run all checks
checkKidStructure();
checkCustomModes();
checkWorkflows();
checkScripts();
checkDocs();

console.log('\n📊 Audit Summary');
console.log('================');

if (errorCount === 0) {
  console.log('🎉 ALL CHECKS PASSED! Kid files structure is compliant.');
  process.exit(0);
} else {
  console.log(`💥 ${errorCount} ERRORS FOUND! Please fix the issues above.`);
  process.exit(1);
}