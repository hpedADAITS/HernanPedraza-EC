/**
 * Integration Test - Backend Components
 * Verifies all modules work together
 */

const javaAnalyzer = require('../generators/javaAnalyzer');
const markdownGenerator = require('../generators/markdownGenerator');
const plantumlGenerator = require('../generators/plantumlGenerator');
const repositoryService = require('../services/repositoryService');
const path = require('path');
const fs = require('fs');

console.log('================================');
console.log('Integration Test Suite');
console.log('================================\n');

// Sample Java code with multiple classes and interfaces
const sampleJavaCode = `
package com.example.service;

import java.util.List;
import java.util.Optional;
import java.io.IOException;

public class UserService implements UserRepository {
  private String serviceName;
  private List<User> users;
  
  public UserService() {
    this.serviceName = "UserService";
    this.users = new ArrayList<>();
  }
  
  public void addUser(User user) {
    users.add(user);
  }
  
  public Optional<User> findById(String id) {
    return users.stream()
      .filter(u -> u.getId().equals(id))
      .findFirst();
  }
  
  public List<User> getAllUsers() {
    return new ArrayList<>(users);
  }
}

public class AdminService extends UserService {
  private boolean hasAdminRights;
  
  public AdminService(boolean adminRights) {
    super();
    this.hasAdminRights = adminRights;
  }
  
  public void deleteUser(String id) {
    if (hasAdminRights) {
      // Delete implementation
    }
  }
}

interface UserRepository {
  void addUser(User user);
  Optional<User> findById(String id);
  List<User> getAllUsers();
}

interface AuditService {
  void logAction(String action);
  void generateReport();
}
`;

let testsPassed = 0;
let testsFailed = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`✓ ${testName}`);
    testsPassed++;
  } catch (error) {
    console.log(`✗ ${testName}: ${error.message}`);
    testsFailed++;
  }
}

// Test 1: Java Analysis
runTest('Java Analysis - Parse code', () => {
  const result = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  
  if (!result.package) throw new Error('Package not found');
  if (result.package !== 'com.example.service') throw new Error('Package mismatch');
  if (result.imports.length === 0) throw new Error('Imports not found');
  if (result.classes.length < 2) throw new Error('Classes not found');
  if (result.interfaces.length < 1) throw new Error('Interfaces not found');
});

runTest('Java Analysis - Class extraction', () => {
  const result = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  const userService = result.classes.find(c => c.name === 'UserService');
  
  if (!userService) throw new Error('UserService class not found');
  if (userService.methods.length === 0) throw new Error('Methods not found');
  if (userService.fields.length === 0) throw new Error('Fields not found');
});

runTest('Java Analysis - Inheritance detection', () => {
  const result = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  const adminService = result.classes.find(c => c.name === 'AdminService');
  
  if (!adminService) throw new Error('AdminService class not found');
  if (adminService.extends !== 'UserService') throw new Error('Inheritance not detected');
});

// Test 2: Markdown Generation
runTest('Markdown Generation - Basic structure', () => {
  const structure = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  const markdown = markdownGenerator.generateMarkdown(structure);
  
  if (!markdown.includes('# Java Documentation')) throw new Error('Title missing');
  if (!markdown.includes('Table of Contents')) throw new Error('TOC missing');
  if (!markdown.includes('Package')) throw new Error('Package section missing');
});

runTest('Markdown Generation - Content inclusion', () => {
  const structure = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  const markdown = markdownGenerator.generateMarkdown(structure);
  
  if (!markdown.includes('UserService')) throw new Error('Class not in markdown');
  if (!markdown.includes('UserRepository')) throw new Error('Interface not in markdown');
  if (!markdown.includes('com.example.service')) throw new Error('Package not in markdown');
});

// Test 3: PlantUML Generation
runTest('PlantUML Generation - Valid syntax', () => {
  const structure = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  const puml = plantumlGenerator.generateClassDiagram(structure);
  
  if (!puml.includes('@startuml')) throw new Error('@startuml missing');
  if (!puml.includes('@enduml')) throw new Error('@enduml missing');
  if (!puml.includes('class UserService')) throw new Error('Class definition missing');
});

runTest('PlantUML Generation - Relationships', () => {
  const structure = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  const puml = plantumlGenerator.generateClassDiagram(structure);
  
  if (!puml.includes('AdminService --|> UserService')) throw new Error('Inheritance not in diagram');
  if (!puml.includes('UserService ..|>')) throw new Error('Implementation not in diagram');
});

// Test 4: Integration - End to end
runTest('Integration - Full pipeline', () => {
  // Parse Java code
  const structure = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  
  // Generate documentation
  const markdown = markdownGenerator.generateMarkdown(structure);
  const puml = plantumlGenerator.generateClassDiagram(structure);
  
  // Verify all outputs
  if (!markdown.length > 100) throw new Error('Markdown too short');
  if (puml.length < 50) throw new Error('PlantUML too short');
});

// Test 5: File I/O
runTest('File I/O - Save markdown', () => {
  const structure = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  const markdown = markdownGenerator.generateMarkdown(structure);
  const testPath = path.join(__dirname, '../outputs/test-integration.md');
  
  const outputDir = path.dirname(testPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  markdownGenerator.saveMarkdown(markdown, testPath);
  
  if (!fs.existsSync(testPath)) throw new Error('File not saved');
  const content = fs.readFileSync(testPath, 'utf8');
  if (content.length === 0) throw new Error('File is empty');
});

runTest('File I/O - Save PlantUML', () => {
  const structure = javaAnalyzer.analyzeJavaCode(sampleJavaCode);
  const puml = plantumlGenerator.generateClassDiagram(structure);
  const testPath = path.join(__dirname, '../outputs/test-integration.puml');
  
  const outputDir = path.dirname(testPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  plantumlGenerator.savePlantUML(puml, testPath);
  
  if (!fs.existsSync(testPath)) throw new Error('File not saved');
  const content = fs.readFileSync(testPath, 'utf8');
  if (content.length === 0) throw new Error('File is empty');
});

// Test 6: Repository Service
runTest('Repository Service - Exports', () => {
  const exports = [
    'cloneRepository',
    'processRepository',
    'findJavaFiles',
    'cleanupDirectory',
    'cloneAndProcess'
  ];
  
  for (const exp of exports) {
    if (typeof repositoryService[exp] !== 'function') {
      throw new Error(`${exp} not exported`);
    }
  }
});

runTest('Repository Service - Directory creation', () => {
  const config = require('../config/config');
  if (!fs.existsSync(config.uploadDir)) {
    throw new Error('Upload directory not created');
  }
  if (!fs.existsSync(config.outputDir)) {
    throw new Error('Output directory not created');
  }
});

// Summary
console.log('\n================================');
console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
console.log('================================\n');

process.exit(testsFailed > 0 ? 1 : 0);
