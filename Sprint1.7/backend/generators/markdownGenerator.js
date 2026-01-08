/**
 * Markdown Documentation Generator - Concise Version
 * Converts analyzed Java structure to compact Markdown documentation
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate concise Markdown documentation from analyzed Java structure
 * @param {Object} structure - Analyzed Java structure from javaAnalyzer
 * @param {Object} aiDescriptions - AI-generated descriptions (per class/method)
 * @param {string} diagramImagePath - Optional path to rendered diagram image (PNG/SVG)
 * @returns {string} - Markdown documentation
 */
function generateMarkdown(structure, aiDescriptions = {}, diagramImagePath = null) {
  let markdown = '# Documentación de API Java\n\n';

  // Summary
  if (structure.classes || structure.interfaces) {
    const classCount = structure.classes ? structure.classes.length : 0;
    const interfaceCount = structure.interfaces ? structure.interfaces.length : 0;
    markdown += `**${classCount} Clases** | **${interfaceCount} Interfaces**\n\n`;
  }

  // Embed class diagram if available
  if (diagramImagePath) {
    markdown += '## Diagrama de Clases\n\n';
    // Use relative path for better portability
    const relativeDiagramPath = diagramImagePath.includes('\\') 
      ? diagramImagePath.split('\\').pop() 
      : diagramImagePath.split('/').pop();
    markdown += `![Diagrama de Clases - Relaciones entre clases e interfaces](${relativeDiagramPath})\n\n`;
    markdown += '_Diagrama generado automáticamente del análisis del código Java_\n\n';
  }

  // Classes (concise)
  if (structure.classes && structure.classes.length > 0) {
    markdown += '## Clases\n\n';
    for (const classObj of structure.classes) {
      markdown += generateClassMarkdown(classObj, aiDescriptions);
    }
  }

  // Interfaces (concise)
  if (structure.interfaces && structure.interfaces.length > 0) {
    markdown += '## Interfaces\n\n';
    for (const interfaceObj of structure.interfaces) {
      markdown += generateInterfaceMarkdown(interfaceObj, aiDescriptions);
    }
  }

  return markdown;
}

/**
 * Generate concise Markdown for a class
 * @param {Object} classObj - Class object
 * @param {Object} aiDescriptions - AI descriptions map
 * @returns {string} - Markdown section
 */
function generateClassMarkdown(classObj, aiDescriptions = {}) {
  let markdown = `### ${classObj.name}\n`;

  // AI Description (single line)
  if (aiDescriptions[classObj.name]) {
    markdown += `${aiDescriptions[classObj.name]}\n`;
  }

  // Inheritance (compact)
  const inheritance = [];
  if (classObj.extends) {
    inheritance.push(`extiende \`${classObj.extends}\``);
  }
  if (classObj.implements && classObj.implements.length > 0) {
    inheritance.push(`implementa ${classObj.implements.map(i => `\`${i}\``).join(', ')}`);
  }
  if (inheritance.length > 0) {
    markdown += `\n_${inheritance.join(' | ')}_\n`;
  }

  // Methods only (no fields table)
  if (classObj.methods && classObj.methods.length > 0) {
    markdown += '\n**Métodos:**\n';
    
    // Show only first 10 methods to keep it concise
    const methodsToShow = classObj.methods.slice(0, 10);
    for (const method of methodsToShow) {
      const params = method.parameters.length > 0 
        ? method.parameters.map(p => `${p.type}`).join(', ')
        : 'void';
      const methodKey = `${classObj.name}.${method.name}`;
      let methodDoc = `- **${method.name}**(${params}): ${method.returnType}`;
      
      // Add AI description if available (inline)
      if (aiDescriptions[methodKey]) {
        const desc = aiDescriptions[methodKey].split('\n')[0]; // First line only
        methodDoc += ` — ${desc}`;
      }
      markdown += methodDoc + '\n';
    }
    
    // Show count if there are more methods
    if (classObj.methods.length > 10) {
      markdown += `- _(+${classObj.methods.length - 10} métodos más)_\n`;
    }
  }

  markdown += '\n';
  return markdown;
}

/**
 * Generate concise Markdown for an interface
 * @param {Object} interfaceObj - Interface object
 * @param {Object} aiDescriptions - AI descriptions map
 * @returns {string} - Markdown section
 */
function generateInterfaceMarkdown(interfaceObj, aiDescriptions = {}) {
  let markdown = `### ${interfaceObj.name}\n`;

  // AI Description
  if (aiDescriptions[interfaceObj.name]) {
    markdown += `${aiDescriptions[interfaceObj.name]}\n`;
  }

  // Extended Interfaces (compact)
  if (interfaceObj.extends && interfaceObj.extends.length > 0) {
    markdown += `\n_extiende ${interfaceObj.extends.map(e => `\`${e}\``).join(', ')}_\n`;
  }

  // Methods only
  if (interfaceObj.methods && interfaceObj.methods.length > 0) {
    markdown += '\n**Métodos:**\n';
    
    const methodsToShow = interfaceObj.methods.slice(0, 10);
    for (const method of methodsToShow) {
      const params = method.parameters.length > 0
        ? method.parameters.map(p => `${p.type}`).join(', ')
        : 'void';
      const methodKey = `${interfaceObj.name}.${method.name}`;
      let methodDoc = `- **${method.name}**(${params}): ${method.returnType}`;
      
      if (aiDescriptions[methodKey]) {
        const desc = aiDescriptions[methodKey].split('\n')[0];
        methodDoc += ` — ${desc}`;
      }
      markdown += methodDoc + '\n';
    }
    
    if (interfaceObj.methods.length > 10) {
      markdown += `- _(+${interfaceObj.methods.length - 10} métodos más)_\n`;
    }
  }

  markdown += '\n';
  return markdown;
}

/**
 * Save Markdown to file
 * @param {string} markdown - Markdown content
 * @param {string} outputPath - Output file path
 * @returns {string} - Output path
 */
function saveMarkdown(markdown, outputPath) {
  const dir = path.dirname(outputPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown, 'utf8');
  return outputPath;
}

module.exports = {
  generateMarkdown,
  generateClassMarkdown,
  generateInterfaceMarkdown,
  saveMarkdown
};
