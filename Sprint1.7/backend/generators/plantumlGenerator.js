/**
 * PlantUML Diagram Generator
 * Generates PlantUML class diagrams from analyzed Java code
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate PlantUML class diagram from analyzed Java structure
 * @param {Object} structure - Analyzed Java structure from javaAnalyzer
 * @returns {string} - PlantUML diagram source code
 */
function generateClassDiagram(structure) {
  let puml = '@startuml\n';
  puml += `!define ABSTRACT abstract\n`;
  puml += `skinparam classBackgroundColor #FEFCE8\n`;
  puml += `skinparam classBorderColor #333333\n\n`;

  // Add classes
  if (structure.classes && structure.classes.length > 0) {
    for (const classObj of structure.classes) {
      puml += generateClassDefinition(classObj);
    }
  }

  // Add interfaces
  if (structure.interfaces && structure.interfaces.length > 0) {
    for (const interfaceObj of structure.interfaces) {
      puml += generateInterfaceDefinition(interfaceObj);
    }
  }

  // Add relationships
  if (structure.classes && structure.classes.length > 0) {
    for (const classObj of structure.classes) {
      if (classObj.extends) {
        puml += `${classObj.name} --|> ${classObj.extends}\n`;
      }
      if (classObj.implements && classObj.implements.length > 0) {
        for (const impl of classObj.implements) {
          puml += `${classObj.name} ..|> ${impl}\n`;
        }
      }
    }
  }

  puml += '@enduml\n';
  return puml;
}

/**
 * Sanitize identifier for PlantUML (remove invalid characters)
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeIdentifier(str) {
  if (!str) return 'unknown';
  return str
    .replace(/\[REDACTED:[^\]]*\]/g, 'String') // Handle redacted fields
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 50); // Limit length
}

/**
 * Generate PlantUML class definition
 * @param {Object} classObj - Class object with name, methods, fields
 * @returns {string} - PlantUML class syntax
 */
function generateClassDefinition(classObj) {
  let puml = `class ${classObj.name} {\n`;

  // Add fields (filtered and sanitized)
  if (classObj.fields && classObj.fields.length > 0) {
    for (const field of classObj.fields) {
      // Skip invalid entries: keywords, empty, or containing special chars
      const fieldName = field.name?.trim() || '';
      const fieldType = field.type?.trim() || 'Object';
      
      // Skip fields that are clearly not valid (contain package, return, WHERE, etc)
      if (!fieldName || 
          fieldName.includes('return') || 
          fieldName.includes('WHERE') ||
          fieldName.includes('AND') ||
          fieldName.includes('to ') ||
          fieldName.includes('for(') ||
          fieldName.includes('package') ||
          fieldName.includes('for ') ||
          fieldName.length < 2) {
        continue;
      }
      
      const sanitizedName = sanitizeIdentifier(fieldName);
      const sanitizedType = sanitizeIdentifier(fieldType);
      puml += `  ${sanitizedType} ${sanitizedName}\n`;
    }
    puml += '\n';
  }

  // Add methods (filtered and sanitized)
  if (classObj.methods && classObj.methods.length > 0) {
    const methodsAdded = new Set(); // Prevent duplicates
    
    for (const method of classObj.methods) {
      const methodName = method.name?.trim() || '';
      const returnType = method.returnType?.trim() || 'void';
      
      // Skip invalid method entries
      if (!methodName || 
          methodName.includes('return') || 
          methodName.includes('WHERE') ||
          methodName.includes('for(') ||
          methodName.includes('new ') ||
          methodName.length < 2 ||
          methodsAdded.has(methodName)) {
        continue;
      }
      
      methodsAdded.add(methodName);
      const params = method.parameters 
        ? method.parameters
            .slice(0, 3) // Limit to 3 params for readability
            .map(p => {
              const pName = sanitizeIdentifier(p.name || 'param');
              const pType = sanitizeIdentifier(p.type || 'Object');
              return `${pName}: ${pType}`;
            })
            .join(', ')
        : '';
      
      const sanitizedReturn = sanitizeIdentifier(returnType);
      const sanitizedMethod = sanitizeIdentifier(methodName);
      puml += `  ${sanitizedReturn} ${sanitizedMethod}(${params})\n`;
    }
  }

  puml += '}\n\n';
  return puml;
}

/**
 * Generate PlantUML interface definition
 * @param {Object} interfaceObj - Interface object
 * @returns {string} - PlantUML interface syntax
 */
function generateInterfaceDefinition(interfaceObj) {
  let puml = `interface ${interfaceObj.name} {\n`;

  if (interfaceObj.methods && interfaceObj.methods.length > 0) {
    const methodsAdded = new Set();
    
    for (const method of interfaceObj.methods) {
      const methodName = method.name?.trim() || '';
      const returnType = method.returnType?.trim() || 'void';
      
      // Skip invalid entries
      if (!methodName || 
          methodName.includes('return') || 
          methodName.includes('WHERE') ||
          methodName.includes('for(') ||
          methodName.length < 2 ||
          methodsAdded.has(methodName)) {
        continue;
      }
      
      methodsAdded.add(methodName);
      const params = method.parameters
        ? method.parameters
            .slice(0, 3)
            .map(p => {
              const pName = sanitizeIdentifier(p.name || 'param');
              const pType = sanitizeIdentifier(p.type || 'Object');
              return `${pName}: ${pType}`;
            })
            .join(', ')
        : '';
      
      const sanitizedReturn = sanitizeIdentifier(returnType);
      const sanitizedMethod = sanitizeIdentifier(methodName);
      puml += `  ${sanitizedReturn} ${sanitizedMethod}(${params})\n`;
    }
  }

  puml += '}\n\n';
  return puml;
}

/**
 * Save PlantUML diagram to file
 * @param {string} pumlCode - PlantUML source code
 * @param {string} outputPath - Output file path
 */
function savePlantUML(pumlCode, outputPath) {
  const dir = path.dirname(outputPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, pumlCode, 'utf8');
  return outputPath;
}

module.exports = {
  generateClassDiagram,
  generateClassDefinition,
  generateInterfaceDefinition,
  savePlantUML
};
