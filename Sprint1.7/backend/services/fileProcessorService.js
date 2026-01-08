/**
 * File Processor Service
 * Processes Java files individually with AI enrichment
 */

const fs = require('fs');
const path = require('path');
const javaAnalyzer = require('../generators/javaAnalyzer');
const aiService = require('./aiService');

/**
 * Process a single Java file with AI enrichment
 * @param {string} filePath - Path to Java file
 * @param {boolean} useAI - Whether to use AI enrichment
 * @returns {Promise<Object>} - File processing result
 */
async function processJavaFile(filePath, useAI = true) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // Analyze Java code structure
    const structure = javaAnalyzer.analyzeJavaCode(fileContent);

    console.log(`[ProcesadorArchivos] Procesando: ${fileName}`);
    console.log(`  → Clases: ${structure.classes.length}, Interfaces: ${structure.interfaces.length}`);

    const aiDescriptions = {};

    // Enrich classes with AI if enabled
    if (useAI && structure.classes && structure.classes.length > 0) {
      for (const classObj of structure.classes) {
        try {
          // Generate class-level description
          const methodSignatures = classObj.methods
            .map(m => `${m.name}(${m.parameters.map(p => p.type).join(', ')}): ${m.returnType}`)
            .slice(0, 5); // Limit to first 5 methods

          const classDescription = await aiService.generateClassSummary(
            classObj.name,
            methodSignatures
          );
          aiDescriptions[classObj.name] = classDescription;

          // Generate method-level descriptions for key methods
          for (const method of classObj.methods.slice(0, 3)) {
            const methodKey = `${classObj.name}.${method.name}`;
            const methodDescription = await aiService.enrichDescription(
              `${classObj.name}.${method.name}`,
              `Class: ${classObj.name}, Method returns ${method.returnType}`
            );
            aiDescriptions[methodKey] = methodDescription.split('\n')[0]; // First line only
          }
        } catch (error) {
          console.error(`[ProcesadorArchivos] Error de enriquecimiento IA para ${classObj.name}:`, error.message);
          // Continue without AI enrichment for this class
        }
      }
    }

    // Enrich interfaces with AI if enabled
    if (useAI && structure.interfaces && structure.interfaces.length > 0) {
      for (const interfaceObj of structure.interfaces) {
        try {
          const methodSignatures = interfaceObj.methods
            .map(m => `${m.name}(${m.parameters.map(p => p.type).join(', ')}): ${m.returnType}`)
            .slice(0, 5);

          const interfaceDescription = await aiService.generateClassSummary(
            interfaceObj.name,
            methodSignatures
          );
          aiDescriptions[interfaceObj.name] = interfaceDescription;
        } catch (error) {
          console.error(`[ProcesadorArchivos] Error de enriquecimiento IA para ${interfaceObj.name}:`, error.message);
        }
      }
    }

    return {
      success: true,
      filePath,
      fileName,
      structure,
      aiDescriptions,
      error: null
    };
  } catch (error) {
    console.error(`[ProcesadorArchivos] Error al procesar ${filePath}:`, error.message);
    return {
      success: false,
      filePath,
      fileName: path.basename(filePath),
      structure: null,
      aiDescriptions: {},
      error: error.message
    };
  }
}

/**
 * Process multiple Java files with parallel AI enrichment
 * @param {Array<string>} filePaths - Array of Java file paths
 * @param {number} parallelLimit - Number of files to process in parallel
 * @param {boolean} useAI - Whether to use AI enrichment
 * @returns {Promise<Object>} - Aggregated processing result
 */
async function processJavaFilesParallel(filePaths, parallelLimit = 3, useAI = true) {
  const results = [];
  const allClasses = [];
  const allInterfaces = [];
  const allImports = new Set();
  const allAIDescriptions = {};
  let successCount = 0;
  let errorCount = 0;

  console.log(`[ProcesadorArchivos] Iniciando procesamiento paralelo de ${filePaths.length} archivos (límite: ${parallelLimit})`);

  // Process files in batches
  for (let i = 0; i < filePaths.length; i += parallelLimit) {
    const batch = filePaths.slice(i, i + parallelLimit);
    const batchPromises = batch.map(filePath => processJavaFile(filePath, useAI));
    const batchResults = await Promise.all(batchPromises);

    for (const result of batchResults) {
      results.push(result);

      if (result.success) {
        successCount++;
        if (result.structure.classes) {
          allClasses.push(...result.structure.classes);
        }
        if (result.structure.interfaces) {
          allInterfaces.push(...result.structure.interfaces);
        }
        if (result.structure.imports) {
          result.structure.imports.forEach(imp => allImports.add(imp));
        }
        // Merge AI descriptions
        Object.assign(allAIDescriptions, result.aiDescriptions);
      } else {
        errorCount++;
      }
    }
  }

  console.log(`[ProcesadorArchivos] Procesamiento paralelo completado: ${successCount} exitosos, ${errorCount} errores`);

  return {
    success: errorCount === 0,
    filesProcessed: successCount,
    filesWithErrors: errorCount,
    results,
    aggregated: {
      classes: allClasses,
      interfaces: allInterfaces,
      imports: Array.from(allImports),
      aiDescriptions: allAIDescriptions
    }
  };
}

/**
 * Process all Java files in a directory with AI enrichment
 * @param {string} dirPath - Directory path
 * @param {boolean} useAI - Whether to use AI enrichment
 * @returns {Promise<Object>} - Processing result
 */
async function processRepositoryWithAI(dirPath, useAI = true) {
  const javaAnalyzerModule = require('./repositoryService');
  const javaFiles = javaAnalyzerModule.findJavaFiles(dirPath);

  if (javaFiles.length === 0) {
    return {
      success: false,
      error: 'No Java files found',
      files: [],
      aggregated: null
    };
  }

  console.log(`[ProcesadorArchivos] Se encontraron ${javaFiles.length} archivos Java`);

  return processJavaFilesParallel(javaFiles, 3, useAI);
}

module.exports = {
  processJavaFile,
  processJavaFilesParallel,
  processRepositoryWithAI
};
