#!/usr/bin/env node

/**
 * Backend Test Runner
 * Runs all backend tests without external dependencies
 */

const path = require('path');

console.log('================================');
console.log('Backend Test Suite');
console.log('================================\n');

const tests = [
  './tests/javaAnalyzer.test.js',
  './tests/markdownGenerator.test.js',
  './tests/plantumlGenerator.test.js'
];

let passed = 0;
let failed = 0;

for (const testFile of tests) {
  console.log(`\n--- Running ${path.basename(testFile)} ---`);
  try {
    require(testFile);
    passed++;
  } catch (error) {
    failed++;
    console.error('Test failed:', error.message);
  }
}

console.log('\n================================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('================================\n');

process.exit(failed > 0 ? 1 : 0);
