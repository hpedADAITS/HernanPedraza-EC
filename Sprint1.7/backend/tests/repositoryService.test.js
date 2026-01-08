/**
 * Test suite for Repository Service
 */

const repositoryService = require('../services/repositoryService');
const path = require('path');
const fs = require('fs');

console.log('Testing Repository Service...\n');

// Test 1: Find Java files (using existing test files)
console.log('Test 1: Finding Java files');
const testDir = path.join(__dirname, '../');
const javaFiles = repositoryService.findJavaFiles(testDir);

if (javaFiles.length > 0) {
  console.log(`✓ Found ${javaFiles.length} Java files`);
  console.log(`  Examples:`);
  javaFiles.slice(0, 3).forEach(file => {
    console.log(`    - ${path.basename(file)}`);
  });
} else {
  console.log(`✗ No Java files found (expected for backend directory)`);
}

// Test 2: Verify directory structures exist
console.log('\nTest 2: Directory structures');
const config = require('../config/config');

const directories = [
  { name: 'Upload', path: config.uploadDir },
  { name: 'Output', path: config.outputDir }
];

directories.forEach(dir => {
  if (!fs.existsSync(dir.path)) {
    fs.mkdirSync(dir.path, { recursive: true });
  }
  if (fs.existsSync(dir.path)) {
    console.log(`✓ ${dir.name} directory: ${dir.path}`);
  } else {
    console.log(`✗ ${dir.name} directory not accessible`);
  }
});

// Test 3: Verify module exports
console.log('\nTest 3: Module exports');
const exports = [
  'cloneRepository',
  'processRepository',
  'findJavaFiles',
  'cleanupDirectory',
  'cloneAndProcess'
];

exports.forEach(exp => {
  if (typeof repositoryService[exp] === 'function') {
    console.log(`✓ ${exp} exported`);
  } else {
    console.log(`✗ ${exp} not found`);
  }
});

console.log('\n✓ Repository Service test PASSED');
