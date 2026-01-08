/**
 * Test suite for PlantUML Generator
 */

const plantumlGenerator = require('../generators/plantumlGenerator');
const fs = require('fs');
const path = require('path');

// Mock Java structure
const mockStructure = {
  package: 'com.example.demo',
  classes: [
    {
      name: 'UserService',
      type: 'class',
      extends: 'BaseService',
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

console.log('Testing PlantUML Generator...\n');

try {
  const puml = plantumlGenerator.generateClassDiagram(mockStructure);
  
  console.log('✓ PlantUML diagram generated');
  console.log('✓ Content length:', puml.length);
  console.log('✓ Contains @startuml:', puml.includes('@startuml'));
  console.log('✓ Contains @enduml:', puml.includes('@enduml'));
  console.log('✓ Contains class:', puml.includes('class UserService'));
  console.log('✓ Contains interface:', puml.includes('interface UserRepository'));
  console.log('✓ Contains inheritance:', puml.includes('UserService --|> BaseService'));
  console.log('✓ Contains implementation:', puml.includes('UserService ..|>'));
  
  // Save test output
  const outputPath = path.join(__dirname, '../outputs/test-diagram.puml');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  plantumlGenerator.savePlantUML(puml, outputPath);
  console.log('✓ PlantUML saved to:', outputPath);
  
  // Display generated diagram
  console.log('\n--- Generated PlantUML Diagram ---');
  console.log(puml);
  console.log('--- End Diagram ---\n');
  
  console.log('✓ PlantUML Generator test PASSED');
} catch (error) {
  console.error('✗ PlantUML Generator test FAILED:', error.message);
  process.exit(1);
}
