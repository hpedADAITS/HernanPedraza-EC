const fs = require('fs');
const path = require('path');

/**
 * Java Code Analyzer
 * Parses Java source files and extracts structural information
 */

/**
 * Analyze a Java file and extract classes, methods, and relationships
 * @param {string} javaCode - Java source code
 * @returns {Object} - Parsed structure with classes, methods, fields
 */
function analyzeJavaCode(javaCode) {
  const structure = {
    package: null,
    imports: [],
    classes: [],
    interfaces: []
  };

  // Extract package
  const packageMatch = javaCode.match(/package\s+([\w.]+);/);
  if (packageMatch) {
    structure.package = packageMatch[1];
  }

  // Extract imports
  const importMatches = javaCode.matchAll(/import\s+(static\s+)?([\w.*]+);/g);
  for (const match of importMatches) {
    structure.imports.push(match[2]);
  }

  // Extract classes
  const classMatches = javaCode.matchAll(/(?:public\s+)?(?:abstract\s+)?(?:final\s+)?class\s+(\w+)(?:\s+extends\s+([\w.]+))?(?:\s+implements\s+([\w\s,]+))?\s*\{/g);
  for (const match of classMatches) {
    const className = match[1];
    const extends_ = match[2] || null;
    const implements_ = match[3] ? match[3].split(',').map(i => i.trim()) : [];

    const classObj = {
      name: className,
      type: 'class',
      extends: extends_,
      implements: implements_,
      methods: extractMethods(javaCode, className),
      fields: extractFields(javaCode, className)
    };

    structure.classes.push(classObj);
  }

  // Extract interfaces
  const interfaceMatches = javaCode.matchAll(/(?:public\s+)?interface\s+(\w+)(?:\s+extends\s+([\w\s,]+))?\s*\{/g);
  for (const match of interfaceMatches) {
    const interfaceName = match[1];
    const extends_ = match[2] ? match[2].split(',').map(e => e.trim()) : [];

    structure.interfaces.push({
      name: interfaceName,
      extends: extends_,
      methods: extractInterfaceMethods(javaCode, interfaceName)
    });
  }

  return structure;
}

/**
 * Extract methods from Java class
 * @param {string} javaCode - Java source code
 * @param {string} className - Class name to extract methods from
 * @returns {Array} - Array of method objects
 */
function extractMethods(javaCode, className) {
  const methods = [];
  const methodRegex = /(?:public|private|protected)?\s*(?:static\s+)?(?:synchronized\s+)?(\w+(?:<[\w\s,]+>)?)\s+(\w+)\s*\((.*?)\)\s*(?:throws\s+[\w\s,]+)?\s*\{/g;

  let match;
  while ((match = methodRegex.exec(javaCode)) !== null) {
    methods.push({
      returnType: match[1],
      name: match[2],
      parameters: parseParameters(match[3])
    });
  }

  return methods;
}

/**
 * Extract methods from Java interface
 * @param {string} javaCode - Java source code
 * @param {string} interfaceName - Interface name
 * @returns {Array} - Array of method signatures
 */
function extractInterfaceMethods(javaCode, interfaceName) {
  const methods = [];
  const methodRegex = /(\w+(?:<[\w\s,]+>)?)\s+(\w+)\s*\((.*?)\)\s*;/g;

  let match;
  while ((match = methodRegex.exec(javaCode)) !== null) {
    methods.push({
      returnType: match[1],
      name: match[2],
      parameters: parseParameters(match[3])
    });
  }

  return methods;
}

/**
 * Extract fields from Java class
 * @param {string} javaCode - Java source code
 * @param {string} className - Class name
 * @returns {Array} - Array of field objects
 */
function extractFields(javaCode, className) {
  const fields = [];
  const fieldRegex = /(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?(\w+(?:<[\w\s,]+>)?)\s+(\w+)\s*(?:=\s*.*?)?\s*;/g;

  let match;
  while ((match = fieldRegex.exec(javaCode)) !== null) {
    fields.push({
      type: match[1],
      name: match[2]
    });
  }

  return fields;
}

/**
 * Parse method parameters
 * @param {string} paramStr - Parameter string
 * @returns {Array} - Array of parameter objects
 */
function parseParameters(paramStr) {
  if (!paramStr.trim()) return [];

  return paramStr.split(',').map(param => {
    const parts = param.trim().split(/\s+/);
    return {
      type: parts.slice(0, -1).join(' '),
      name: parts[parts.length - 1]
    };
  });
}

module.exports = {
  analyzeJavaCode,
  extractMethods,
  extractFields,
  parseParameters
};
