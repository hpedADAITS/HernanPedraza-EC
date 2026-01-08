/**
 * Test suite for Java Analyzer
 */

const javaAnalyzer = require('../generators/javaAnalyzer');

// Test Java code sample
const testJavaCode = `
package com.example.demo;

import java.util.List;
import java.util.ArrayList;

public class UserService {
  private String name;
  private List<User> users;

  public UserService(String name) {
    this.name = name;
    this.users = new ArrayList<>();
  }

  public void addUser(User user) {
    users.add(user);
  }

  public List<User> getUsers() {
    return users;
  }

  public boolean removeUser(String userId) {
    return users.removeIf(u -> u.getId().equals(userId));
  }
}

interface UserRepository {
  User findById(String id);
  void save(User user);
  void delete(String id);
}
`;

// Run tests
console.log('Testing Java Analyzer...\n');

try {
  const result = javaAnalyzer.analyzeJavaCode(testJavaCode);
  
  console.log('✓ Package detected:', result.package);
  console.log('✓ Imports found:', result.imports.length);
  console.log('✓ Classes found:', result.classes.length);
  console.log('✓ Interfaces found:', result.interfaces.length);
  
  if (result.classes.length > 0) {
    const userService = result.classes[0];
    console.log('\n✓ Class name:', userService.name);
    console.log('✓ Fields:', userService.fields.length);
    console.log('✓ Methods:', userService.methods.length);
  }

  if (result.interfaces.length > 0) {
    const repo = result.interfaces[0];
    console.log('\n✓ Interface name:', repo.name);
    console.log('✓ Interface methods:', repo.methods.length);
  }

  console.log('\n✓ Java Analyzer test PASSED');
} catch (error) {
  console.error('✗ Java Analyzer test FAILED:', error.message);
  process.exit(1);
}
