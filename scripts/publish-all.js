#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { globby } from 'globby';
import path from 'path';

/**
 * Script to publish all packages in the monorepo
 * Usage: node scripts/publish-all.js [--dry-run]
 */

const isDryRun = process.argv.includes('--dry-run');

async function getPublishablePackages() {
  const packagePaths = await globby(
    [
      'packages/*/package.json',
      'stores/*/package.json',
      'deployers/*/package.json',
      'voice/*/package.json',
      'auth/*/package.json',
      'client-sdks/*/package.json',
      'speech/*/package.json',
      'integrations/*/package.json',
      'explorations/*/package.json',
      'observability/*/package.json',
    ],
    {
      ignore: ['**/node_modules/**'],
    },
  );

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

      // Only include packages with a name and version
      if (pkg.name && pkg.version) {
        packages.push({
          name: pkg.name,
          version: pkg.version,
          path: packagePath,
          directory: path.dirname(packagePath),
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
    execSync(`pnpm view ${packageName}@${version} --silent`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function publishPackage(packageName, version, directory) {
  const packageSpec = `${packageName}@${version}`;

  if (isDryRun) {
    console.log(`[DRY RUN] Would publish: ${packageSpec}`);
    return;
  }

  try {
    console.log(`Publishing ${packageSpec}...`);
    // Determine registry based on package scope
    const registry = packageName.startsWith('@actus-ag/') ? '--registry https://verdaccio.actus-tax.com/' : '';
    execSync(`pnpm publish ${registry}`, { stdio: 'inherit', cwd: directory });
    console.log(`✅ Successfully published ${packageSpec}`);
  } catch (error) {
    console.error(`❌ Failed to publish ${packageSpec}:`, error.message);
  }
}

async function main() {
  console.log('🔍 Finding publishable packages...');
  const packages = await getPublishablePackages();

  if (packages.length === 0) {
    console.log('No publishable packages found.');
    return;
  }

  console.log(`Found ${packages.length} publishable packages:`);
  packages.forEach(pkg => console.log(`  - ${pkg.name}@${pkg.version}`));

  if (isDryRun) {
    console.log('\n🏃 Dry run mode - no packages will be actually published');
  } else {
    console.log('\n⚠️  WARNING: This will publish all packages to the registry!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log('\n🚀 Starting publish process...');

  for (const pkg of packages) {
    const isAlreadyPublished = await checkIfPackageIsPublished(pkg.name, pkg.version);

    if (isAlreadyPublished) {
      console.log(`⏭️  Skipping ${pkg.name}@${pkg.version} (already published)`);
    } else {
      await publishPackage(pkg.name, pkg.version, pkg.directory);
    }
  }

  console.log('\n✨ Publish process completed!');
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
