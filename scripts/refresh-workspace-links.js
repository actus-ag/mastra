#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Refreshes workspace symlinks in node_modules without touching the registry
 * This is needed after scope transformations to update package name references
 */
function refreshWorkspaceLinks() {
  const rootDir = path.resolve(__dirname, '..');
  const nodeModulesDir = path.join(rootDir, 'node_modules');
  
  console.log('🔗 Refreshing workspace symlinks...');
  
  // Read pnpm-workspace.yaml to get workspace patterns
  const workspaceFile = path.join(rootDir, 'pnpm-workspace.yaml');
  if (!fs.existsSync(workspaceFile)) {
    console.log('❌ pnpm-workspace.yaml not found');
    return;
  }
  
  // Find all workspace packages
  const workspacePackages = findWorkspacePackages(rootDir);
  
  // Update symlinks for each workspace package
  let updatedCount = 0;
  for (const pkg of workspacePackages) {
    if (updateSymlink(nodeModulesDir, pkg)) {
      updatedCount++;
    }
  }
  
  console.log(`✅ Updated ${updatedCount} workspace symlinks`);
}

function findWorkspacePackages(rootDir) {
  const packages = [];
  
  // Common workspace directories
  const workspaceDirs = [
    'packages',
    'stores', 
    'deployers',
    'auth',
    'client-sdks',
    'voice',
    'workflows',
    'integrations'
  ];
  
  for (const dir of workspaceDirs) {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      const subdirs = fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const subdir of subdirs) {
        const packageJsonPath = path.join(dirPath, subdir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            packages.push({
              name: packageJson.name,
              path: path.join(dirPath, subdir)
            });
          } catch (error) {
            console.warn(`Warning: Could not read ${packageJsonPath}: ${error.message}`);
          }
        }
      }
    }
  }
  
  return packages;
}

function updateSymlink(nodeModulesDir, pkg) {
  if (!pkg.name.startsWith('@')) {
    // Handle non-scoped packages
    const linkPath = path.join(nodeModulesDir, pkg.name);
    return createOrUpdateSymlink(linkPath, pkg.path, pkg.name);
  } else {
    // Handle scoped packages
    const [scope, name] = pkg.name.split('/');
    const scopeDir = path.join(nodeModulesDir, scope);
    const linkPath = path.join(scopeDir, name);
    
    // Ensure scope directory exists
    if (!fs.existsSync(scopeDir)) {
      fs.mkdirSync(scopeDir, { recursive: true });
    }
    
    return createOrUpdateSymlink(linkPath, pkg.path, pkg.name);
  }
}

function createOrUpdateSymlink(linkPath, targetPath, packageName) {
  try {
    // Remove existing symlink/directory if it exists
    if (fs.existsSync(linkPath)) {
      const stats = fs.lstatSync(linkPath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(linkPath);
      } else if (stats.isDirectory()) {
        fs.rmSync(linkPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(linkPath);
      }
    }
    
    // Create new symlink
    fs.symlinkSync(path.relative(path.dirname(linkPath), targetPath), linkPath, 'dir');
    console.log(`  ✓ ${packageName} -> ${path.relative(process.cwd(), targetPath)}`);
    return true;
  } catch (error) {
    console.warn(`  ⚠️  Failed to update symlink for ${packageName}: ${error.message}`);
    return false;
  }
}

refreshWorkspaceLinks();