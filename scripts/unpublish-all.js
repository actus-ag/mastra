#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { globby } from 'globby';
import path from 'path';

/**
 * Script to unpublish all packages in the monorepo
 * Usage: node scripts/unpublish-all.js [--dry-run]
 */

const isDryRun = process.argv.includes('--dry-run');

async function getPublishablePackages() {
  const packagePaths = await globby([
    'packages/*/package.json', 
    'stores/*/package.json', 
    'deployers/*/package.json', 
    'voice/*/package.json', 
    'auth/*/package.json', 
    'client-sdks/*/package.json', 
    'speech/*/package.json',
    'integrations/*/package.json',
    'explorations/*/package.json',
    'observability/*/package.json'
  ], {
    ignore: ['**/node_modules/**']
  });

  const packages = [];
  
  for (const packagePath of packagePaths) {
    try {
      const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
      
      // Skip private packages
      if (pkg.private === true) {
        continue;
      }
      
      // Skip internal packages
      if (pkg.name?.startsWith('@internal/')) {
        continue;
      }
      
      // Skip create-mastra (not affected by scope transformation)
      if (pkg.name === 'create-mastra') {
        continue;
      }
      
      // Only include packages with a name and version
      if (pkg.name && pkg.version) {
        packages.push({
          name: pkg.name,
          version: pkg.version,
          path: packagePath
        });
      }
    } catch (error) {
      console.warn(`Warning: Could not parse ${packagePath}:`, error.message);
    }
  }
  
  return packages;
}

async function checkIfPackageIsPublished(packageName, version) {
  try {
    execSync(`npm view ${packageName}@${version} --silent`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function unpublishPackage(packageName, version) {
  const packageSpec = `${packageName}@${version}`;
  
  if (isDryRun) {
    console.log(`[DRY RUN] Would unpublish: ${packageSpec}`);
    return;
  }
  
  try {
    console.log(`Unpublishing ${packageSpec}...`);
    execSync(`npm unpublish ${packageSpec} --force`, { stdio: 'inherit' });
    console.log(`✅ Successfully unpublished ${packageSpec}`);
  } catch (error) {
    console.error(`❌ Failed to unpublish ${packageSpec}:`, error.message);
  }
}

async function main() {
  try {
    // Apply scope transformation
    console.log('🔄 Applying scope transformation...');
    execSync('node scripts/scope-transform.js apply && node scripts/refresh-workspace-links.js', { stdio: 'inherit' });

    console.log('🔍 Finding publishable packages...');
    const packages = await getPublishablePackages();
    
    if (packages.length === 0) {
      console.log('No publishable packages found.');
      return;
    }
    
    console.log(`Found ${packages.length} publishable packages:`);
    packages.forEach(pkg => console.log(`  - ${pkg.name}@${pkg.version}`));
    
    if (isDryRun) {
      console.log('\n🏃 Dry run mode - no packages will be actually unpublished');
    } else {
      console.log('\n⚠️  WARNING: This will unpublish all packages from the registry!');
      console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log('\n🚀 Starting unpublish process...');
    
    for (const pkg of packages) {
      const isPublished = await checkIfPackageIsPublished(pkg.name, pkg.version);
      
      if (isPublished) {
        await unpublishPackage(pkg.name, pkg.version);
      } else {
        console.log(`⏭️  Skipping ${pkg.name}@${pkg.version} (not published)`);
      }
    }
    
    console.log('\n✨ Unpublish process completed!');
  } finally {
    // Always rollback scope transformation, even if unpublish fails
    console.log('🔄 Rolling back scope transformation...');
    try {
      execSync('node scripts/scope-transform.js rollback && node scripts/refresh-workspace-links.js', { stdio: 'inherit' });
    } catch (rollbackError) {
      console.error('❌ Failed to rollback scope transformation:', rollbackError.message);
    }
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});