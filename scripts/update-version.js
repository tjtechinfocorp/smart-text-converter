#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get version from command line or use timestamp
const newVersion = process.argv[2] || `2.0.${Date.now()}`;
const buildDate = new Date().toISOString();
const buildNumber = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.${new Date().toTimeString().slice(0, 5).replace(/:/g, '')}`;

console.log(`🔄 Updating version to ${newVersion}`);

// Update version.json
const versionJsonPath = path.join(__dirname, '../public/version.json');
const versionData = {
  version: newVersion,
  buildDate: buildDate,
  buildNumber: buildNumber,
  environment: 'production',
};

fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2));
console.log('✅ Updated public/version.json');

// Update cache management service
const cacheServicePath = path.join(__dirname, '../src/app/services/cache-management.service.ts');
let cacheServiceContent = fs.readFileSync(cacheServicePath, 'utf8');

// Update the version constant
cacheServiceContent = cacheServiceContent.replace(
  /private readonly CURRENT_VERSION = '[^']*';/,
  `private readonly CURRENT_VERSION = '${newVersion}';`
);

fs.writeFileSync(cacheServicePath, cacheServiceContent);
console.log('✅ Updated cache-management.service.ts');

// Update service worker
const swPath = path.join(__dirname, '../public/sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');

// Update the cache version
swContent = swContent.replace(
  /const CACHE_VERSION = '[^']*';/,
  `const CACHE_VERSION = '${newVersion}';`
);

fs.writeFileSync(swPath, swContent);
console.log('✅ Updated public/sw.js');

// Update package.json version (optional)
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json');

console.log(`🎉 Version update complete! New version: ${newVersion}`);
console.log(`📅 Build date: ${buildDate}`);
console.log(`🔢 Build number: ${buildNumber}`);
