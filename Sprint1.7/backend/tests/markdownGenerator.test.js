/**
 * Test suite for Markdown Generator
 */

const markdownGenerator = require('../generators/markdownGenerator');

// Mock Java structure
const mockStructure = {
  package: 'com.example.demo',
  imports: ['java.util.List', 'java.util.ArrayList'],
  classes: [
    {
      name: 'UserService',
      type: 'class',
      extends: null,
      implements: ['UserRepository'],
      fields: [
        { type: 'String', name: 'name' },
        { type: 'List<User>', name: 'users' }
      ],
      methods: [
        { 
          returnType: 'void',
          name: 'addUser',
          parameters: [{ type: 'User', name: 'user' }]
        },
        {
          returnType: 'List<User>',
          name: 'getUsers',
          parameters: []
        }
      ]
    }
  ],
  interfaces: [
    {
      name: 'UserRepository',
      extends: [],
      methods: [
        { returnType: 'User', name: 'findById', parameters: [{ type: 'String', name: 'id' }] }
      ]
    }
  ]
};

console.log('Testing Markdown Generator...\n');

try {
  const markdown = markdownGenerator.generateMarkdown(mockStructure);
  
  console.log('✓ Markdown generated');
  console.log('✓ Content length:', markdown.length);
  console.log('✓ Contains package:', markdown.includes('com.example.demo'));
  console.log('✓ Contains class name:', markdown.includes('UserService'));
  console.log('✓ Contains interface name:', markdown.includes('UserRepository'));
  console.log('✓ Contains table of contents:', markdown.includes('Table of Contents'));
  console.log('✓ Contains imports section:', markdown.includes('Imports'));
  
  // Save test output
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, '../outputs/test-markdown.md');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  markdownGenerator.saveMarkdown(markdown, outputPath);
  console.log('✓ Markdown saved to:', outputPath);
  
  console.log('\n✓ Markdown Generator test PASSED');
} catch (error) {
  console.error('✗ Markdown Generator test FAILED:', error.message);
  process.exit(1);
}
