#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Special mappings for CLI package name only (applied to specific files)
const CLI_PACKAGE_MAPPINGS = {
  '"name": "mastra"': '"name": "@actus-ag/mastra-cli"',
};

// Special reverse mappings for CLI package name only
const REVERSE_CLI_PACKAGE_MAPPINGS = {
  '"name": "@actus-ag/mastra-cli"': '"name": "mastra"',
};

// Special mappings for root package name
const ROOT_PACKAGE_MAPPINGS = {
  '"name": "mastra-turbo"': '"name": "@actus-ag/mastra-turbo"',
};

// Special reverse mappings for root package name
const REVERSE_ROOT_PACKAGE_MAPPINGS = {
  '"name": "@actus-ag/mastra-turbo"': '"name": "mastra-turbo"',
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
  '**/*.jsx',
];

// Directories to exclude
const EXCLUDE_PATTERNS = ['node_modules', '.git', 'dist', '.next', 'coverage', '.turbo', '.mastra'];

// Files to exclude (don't transform the script itself!)
const EXCLUDE_FILES = ['scripts/scope-transform.js'];

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
    const rootIsActusAg = rootPackageJson.name === '@actus-ag/mastra-turbo';
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
      if (
        entry.isDirectory() &&
        excludePatterns.some(pattern => relativePath.includes(pattern) || entry.name === pattern)
      ) {
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

function transformFile(filePath, cliMappings = null, rootMappings = null, direction = 'apply') {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Check if this is the CLI package.json file
    const relativePath = path.relative(path.resolve(__dirname, '..'), filePath);
    const isCliPackageJson = relativePath === path.join('packages', 'cli', 'package.json');
    const isRootPackageJson = relativePath === 'package.json';

    // Apply CLI-specific mappings if this is the CLI package.json
    if (isCliPackageJson && cliMappings) {
      for (const [from, to] of Object.entries(cliMappings)) {
        if (content.includes(from)) {
          content = content.replace(new RegExp(escapeRegExp(from), 'g'), to);
          changed = true;
        }
      }
    }

    // Apply root-specific mappings if this is the root package.json
    if (isRootPackageJson && rootMappings) {
      for (const [from, to] of Object.entries(rootMappings)) {
        if (content.includes(from)) {
          content = content.replace(new RegExp(escapeRegExp(from), 'g'), to);
          changed = true;
        }
      }
    }

    // Use regex patterns to handle all @mastra/* transformations generically
    if (direction === 'apply') {
      // Transform @mastra/package or @mastra/package/subpath to @actus-ag/mastra-package or @actus-ag/mastra-package/subpath
      // This regex handles all cases including those inside function calls like import.meta.resolve()
      const subpathRegex = /@mastra\/([^\/\s]+)(\/[^\s)'"]*)?/g;
      let newContent = content.replace(subpathRegex, (match, packageName, subpath) => {
        const transformedPackage = `@actus-ag/mastra-${packageName}`;
        return `${transformedPackage}${subpath || ''}`;
      });

      // Handle bare 'mastra' package references specifically in import.meta.resolve() calls
      // This targets the CLI package name transformation for import.meta.resolve('mastra/...')
      const importMetaResolveRegex = /import\.meta\.resolve\(\s*(['"`])mastra(\/[^'"`]*)?(['"`])\s*\)/g;
      newContent = newContent.replace(importMetaResolveRegex, (match, openQuote, subpath, closeQuote) => {
        return `import.meta.resolve(${openQuote}@actus-ag/mastra-cli${subpath || ''}${closeQuote})`;
      });

      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    } else if (direction === 'rollback') {
      // Transform @actus-ag/mastra-package or @actus-ag/mastra-package/subpath back to @mastra/package or @mastra/package/subpath
      const subpathRegex = /@actus-ag\/mastra-([^\/\s]+)(\/[^\s)'"]*)?/g;
      let newContent = content.replace(subpathRegex, (match, packageName, subpath) => {
        const transformedPackage = `@mastra/${packageName}`;
        return `${transformedPackage}${subpath || ''}`;
      });

      // Handle '@actus-ag/mastra-cli' package references back to 'mastra' in import.meta.resolve() calls
      const importMetaResolveRegex = /import\.meta\.resolve\(\s*(['"`])@actus-ag\/mastra-cli(\/[^'"`]*)?(['"`])\s*\)/g;
      newContent = newContent.replace(importMetaResolveRegex, (match, openQuote, subpath, closeQuote) => {
        return `import.meta.resolve(${openQuote}mastra${subpath || ''}${closeQuote})`;
      });

      if (newContent !== content) {
        content = newContent;
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

  const cliMappings = command === 'apply' ? CLI_PACKAGE_MAPPINGS : REVERSE_CLI_PACKAGE_MAPPINGS;
  const rootMappings = command === 'apply' ? ROOT_PACKAGE_MAPPINGS : REVERSE_ROOT_PACKAGE_MAPPINGS;
  const rootDir = path.resolve(__dirname, '..');

  console.log(`${command === 'apply' ? 'Applying' : 'Rolling back'} scope transformations...`);
  console.log(`Target: ${command === 'apply' ? '@mastra/* → @actus-ag/mastra-*' : '@actus-ag/mastra-* → @mastra/*'}`);
  console.log(
    `CLI package: ${command === 'apply' ? 'mastra → @actus-ag/mastra-cli' : '@actus-ag/mastra-cli → mastra'}`,
  );

  const files = findFiles(rootDir, INCLUDE_PATTERNS, EXCLUDE_PATTERNS);
  let changedFiles = 0;

  for (const file of files) {
    if (transformFile(file, cliMappings, rootMappings, command)) {
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

export {
  CLI_PACKAGE_MAPPINGS,
  REVERSE_CLI_PACKAGE_MAPPINGS,
  ROOT_PACKAGE_MAPPINGS,
  REVERSE_ROOT_PACKAGE_MAPPINGS,
  transformFile,
  findFiles,
};
