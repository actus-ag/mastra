#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clean bidirectional mappings: @mastra/ <-> @actus-ag/mastra-
const SCOPE_MAPPINGS = {
  // Root package name transformation
  '"name": "mastra-turbo"': '"name": "@actus-ag/mastra-cli-turbo"',
  
  // Core package scope transformations: @mastra/ -> @actus-ag/mastra-
  '"@mastra/core"': '"@actus-ag/mastra-core"',
  "'@mastra/core'": "'@actus-ag/mastra-core'",
  '@mastra/core': '@actus-ag/mastra-core',
  
  '"@mastra/memory"': '"@actus-ag/mastra-memory"',
  "'@mastra/memory'": "'@actus-ag/mastra-memory'",
  '@mastra/memory': '@actus-ag/mastra-memory',
  
  '"@mastra/rag"': '"@actus-ag/mastra-rag"',
  "'@mastra/rag'": "'@actus-ag/mastra-rag'",
  '@mastra/rag': '@actus-ag/mastra-rag',
  
  '"@mastra/evals"': '"@actus-ag/mastra-evals"',
  "'@mastra/evals'": "'@actus-ag/mastra-evals'",
  '@mastra/evals': '@actus-ag/mastra-evals',
  
  '"@mastra/server"': '"@actus-ag/mastra-server"',
  "'@mastra/server'": "'@actus-ag/mastra-server'",
  '@mastra/server': '@actus-ag/mastra-server',
  
  '"@mastra/mcp"': '"@actus-ag/mastra-mcp"',
  "'@mastra/mcp'": "'@actus-ag/mastra-mcp'",
  '@mastra/mcp': '@actus-ag/mastra-mcp',
  
  '"@mastra/deployer"': '"@actus-ag/mastra-deployer"',
  "'@mastra/deployer'": "'@actus-ag/mastra-deployer'",
  '@mastra/deployer': '@actus-ag/mastra-deployer',
  
  // CLI package special case (TODO: may need different handling)
  '"@mastra/cli"': '"@actus-ag/mastra-cli"',
  "'@mastra/cli'": "'@actus-ag/mastra-cli'",
  '@mastra/cli': '@actus-ag/mastra-cli',
  
  // Generic package scope patterns (catch remaining @mastra/ packages)
  '"@mastra/': '"@actus-ag/mastra-',
  "'@mastra/": "'@actus-ag/mastra-",
  '@mastra/': '@actus-ag/mastra-',
  
  // Changeset configuration
  '"!@mastra/': '"!@actus-ag/mastra-',
  
  // Documentation references in backticks
  '`@mastra/core`': '`@actus-ag/mastra-core`',
  '`@mastra/memory`': '`@actus-ag/mastra-memory`',
  '`@mastra/rag`': '`@actus-ag/mastra-rag`',
  '`@mastra/evals`': '`@actus-ag/mastra-evals`',
  '`@mastra/server`': '`@actus-ag/mastra-server`',
  '`@mastra/mcp`': '`@actus-ag/mastra-mcp`',
  '`@mastra/deployer`': '`@actus-ag/mastra-deployer`',
  '`@mastra/cli`': '`@actus-ag/mastra-cli`',
  
  // Generic documentation pattern
  '`@mastra/': '`@actus-ag/mastra-',
};

// Create proper reverse mappings for rollback
const REVERSE_SCOPE_MAPPINGS = {
  // Root package name transformation (reverse)
  '"name": "@actus-ag/mastra-cli-turbo"': '"name": "mastra-turbo"',
  
  // Core package scope transformations: @actus-ag/mastra- -> @mastra/
  '"@actus-ag/mastra-core"': '"@mastra/core"',
  "'@actus-ag/mastra-core'": "'@mastra/core'",
  '@actus-ag/mastra-core': '@mastra/core',
  
  '"@actus-ag/mastra-memory"': '"@mastra/memory"',
  "'@actus-ag/mastra-memory'": "'@mastra/memory'",
  '@actus-ag/mastra-memory': '@mastra/memory',
  
  '"@actus-ag/mastra-rag"': '"@mastra/rag"',
  "'@actus-ag/mastra-rag'": "'@mastra/rag'",
  '@actus-ag/mastra-rag': '@mastra/rag',
  
  '"@actus-ag/mastra-evals"': '"@mastra/evals"',
  "'@actus-ag/mastra-evals'": "'@mastra/evals'",
  '@actus-ag/mastra-evals': '@mastra/evals',
  
  '"@actus-ag/mastra-server"': '"@mastra/server"',
  "'@actus-ag/mastra-server'": "'@mastra/server'",
  '@actus-ag/mastra-server': '@mastra/server',
  
  '"@actus-ag/mastra-mcp"': '"@mastra/mcp"',
  "'@actus-ag/mastra-mcp'": "'@mastra/mcp'",
  '@actus-ag/mastra-mcp': '@mastra/mcp',
  
  '"@actus-ag/mastra-deployer"': '"@mastra/deployer"',
  "'@actus-ag/mastra-deployer'": "'@mastra/deployer'",
  '@actus-ag/mastra-deployer': '@mastra/deployer',
  
  // CLI package special case (reverse)
  '"@actus-ag/mastra-cli"': '"@mastra/cli"',
  "'@actus-ag/mastra-cli'": "'@mastra/cli'",
  '@actus-ag/mastra-cli': '@mastra/cli',
  
  // Generic package scope patterns (reverse)
  '"@actus-ag/mastra-': '"@mastra/',
  "'@actus-ag/mastra-": "'@mastra/",
  '@actus-ag/mastra-': '@mastra/',
  
  // Changeset configuration (reverse)
  '"!@actus-ag/mastra-': '"!@mastra/',
  
  // Documentation references in backticks (reverse)
  '`@actus-ag/mastra-core`': '`@mastra/core`',
  '`@actus-ag/mastra-memory`': '`@mastra/memory`',
  '`@actus-ag/mastra-rag`': '`@mastra/rag`',
  '`@actus-ag/mastra-evals`': '`@mastra/evals`',
  '`@actus-ag/mastra-server`': '`@mastra/server`',
  '`@actus-ag/mastra-mcp`': '`@mastra/mcp`',
  '`@actus-ag/mastra-deployer`': '`@mastra/deployer`',
  '`@actus-ag/mastra-cli`': '`@mastra/cli`',
  
  // Generic documentation pattern (reverse)
  '`@actus-ag/mastra-': '`@mastra/',
};

// Files and directories to process
const INCLUDE_PATTERNS = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  '**/*.json',
  '**/*.md',
  '**/*.mdx',
  '**/*.ts',
  '**/*.tsx',
  '**/*.js',
  '**/*.jsx'
];

// Directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '.turbo',
  '.mastra'
];

// Files to exclude (don't transform the script itself!)
const EXCLUDE_FILES = [
  'scripts/scope-transform.js'
];

function detectCurrentScope() {
  // Check both CLI package.json and root package.json to determine current scope
  const cliPackagePath = path.resolve(__dirname, '..', 'packages', 'cli', 'package.json');
  const rootPackagePath = path.resolve(__dirname, '..', 'package.json');
  
  try {
    // Check CLI package
    const cliContent = fs.readFileSync(cliPackagePath, 'utf8');
    const cliPackageJson = JSON.parse(cliContent);
    
    // Check root package
    const rootContent = fs.readFileSync(rootPackagePath, 'utf8');
    const rootPackageJson = JSON.parse(rootContent);
    
    // Determine scope based on package names
    const cliIsActusAg = cliPackageJson.name === '@actus-ag/mastra-cli';
    const cliIsMastra = cliPackageJson.name === 'mastra';
    const rootIsActusAg = rootPackageJson.name === '@actus-ag/mastra-cli-turbo';
    const rootIsMastra = rootPackageJson.name === 'mastra-turbo';
    
    if (cliIsActusAg && rootIsActusAg) {
      return 'actus-ag';
    } else if (cliIsMastra && rootIsMastra) {
      return 'mastra';
    } else if (cliIsActusAg || rootIsActusAg) {
      return 'mixed-actus-ag';
    } else if (cliIsMastra || rootIsMastra) {
      return 'mixed-mastra';
    } else {
      console.warn(`Unknown package names: CLI=${cliPackageJson.name}, Root=${rootPackageJson.name}`);
      return 'unknown';
    }
  } catch (error) {
    console.warn(`Could not detect current scope: ${error.message}`);
    return 'unknown';
  }
}

function findFiles(dir, patterns, excludePatterns) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(dir, fullPath);
      
      // Skip excluded directories
      if (entry.isDirectory() && excludePatterns.some(pattern => 
        relativePath.includes(pattern) || entry.name === pattern
      )) {
        continue;
      }
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile()) {
        // Skip excluded files (like the script itself)
        if (EXCLUDE_FILES.some(excludeFile => relativePath === excludeFile)) {
          continue;
        }
        
        // Check if file matches any include pattern
        const shouldInclude = patterns.some(pattern => {
          if (pattern.includes('**')) {
            const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
            return regex.test(relativePath);
          }
          return entry.name === pattern || relativePath.endsWith(pattern);
        });
        
        if (shouldInclude) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function transformFile(filePath, mappings) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Sort mappings by length (longest first) to avoid partial replacements
    const sortedMappings = Object.entries(mappings).sort(([a], [b]) => b.length - a.length);
    
    for (const [from, to] of sortedMappings) {
      const regex = new RegExp(escapeRegExp(from), 'g');
      if (regex.test(content)) {
        content = content.replace(regex, to);
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`Warning: Could not process ${filePath}: ${error.message}`);
    return false;
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const isForced = args.includes('--force');
  
  if (!command || !['apply', 'rollback'].includes(command)) {
    console.log('Usage: node scope-transform.js <apply|rollback> [--force]');
    console.log('');
    console.log('Commands:');
    console.log('  apply    - Transform @mastra/* to @actus-ag/mastra-*');
    console.log('  rollback - Transform @actus-ag/mastra-* back to @mastra/*');
    console.log('');
    console.log('Options:');
    console.log('  --force  - Force transformation even if already in target scope');
    process.exit(1);
  }
  
  // Detect current scope state
  const currentScope = detectCurrentScope();
  console.log(`Current scope detected: ${currentScope}`);
  
  // Check if transformation is needed (idempotent check)
  if (!isForced) {
    if (command === 'apply' && currentScope === 'actus-ag') {
      console.log('✓ Already in @actus-ag scope. No transformation needed.');
      console.log('  Use --force to run anyway.');
      return;
    }
    
    if (command === 'rollback' && currentScope === 'mastra') {
      console.log('✓ Already in @mastra scope. No transformation needed.');
      console.log('  Use --force to run anyway.');
      return;
    }
  }
  
  if (isForced) {
    console.log('🔧 Force flag detected. Running transformation anyway...');
  } else if (currentScope === 'unknown') {
    console.log('⚠️  Unknown scope state. Proceeding with transformation...');
  }
  
  const mappings = command === 'apply' ? SCOPE_MAPPINGS : REVERSE_SCOPE_MAPPINGS;
  const rootDir = path.resolve(__dirname, '..');
  
  console.log(`${command === 'apply' ? 'Applying' : 'Rolling back'} scope transformations...`);
  console.log(`Target: ${command === 'apply' ? '@mastra/* → @actus-ag/mastra-*' : '@actus-ag/mastra-* → @mastra/*'}`);
  
  const files = findFiles(rootDir, INCLUDE_PATTERNS, EXCLUDE_PATTERNS);
  let changedFiles = 0;
  
  for (const file of files) {
    if (transformFile(file, mappings)) {
      changedFiles++;
      console.log(`  ✓ ${path.relative(rootDir, file)}`);
    }
  }
  
  console.log(`\nTransformation complete! ${changedFiles} files changed.`);
  
  // Verify the transformation worked
  const newScope = detectCurrentScope();
  const expectedScope = command === 'apply' ? 'actus-ag' : 'mastra';
  
  if (newScope === expectedScope) {
    console.log(`✅ Transformation successful! Now in ${newScope} scope.`);
  } else if (newScope.includes('mixed')) {
    console.log(`⚠️  Partial transformation detected (${newScope}). Some files may need manual review.`);
  } else {
    console.log(`⚠️  Transformation may have failed. Expected ${expectedScope} scope, but detected ${newScope}.`);
  }
  
  if (command === 'rollback') {
    console.log('\nNote: You may want to run "pnpm install" to update lockfiles after rollback.');
  }
}

main();

export { SCOPE_MAPPINGS, REVERSE_SCOPE_MAPPINGS, transformFile, findFiles };