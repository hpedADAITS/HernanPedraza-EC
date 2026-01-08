/**
 * Repository Service
 * Handles Git repository cloning and processing
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const javaAnalyzer = require('../generators/javaAnalyzer');
const markdownGenerator = require('../generators/markdownGenerator');
const plantumlGenerator = require('../generators/plantumlGenerator');
const plantumlRenderer = require('../generators/plantumlRenderer');
const fileProcessorService = require('./fileProcessorService');

const config = require('../config/config');

// Simple UUID v4 generator (fallback if uuid package not available)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Clone a Git repository to a temporary directory
 * @param {string} repoUrl - Git repository URL
 * @param {string} branch - Branch name (optional, defaults to main)
 * @returns {Promise<Object>} - { success, clonePath, error }
 */
function cloneRepository(repoUrl, branch = 'main') {
  return new Promise((resolve) => {
    const repoId = generateUUID().slice(0, 8);
    const clonePath = path.join(config.uploadDir, `repo-${repoId}`);

    // Ensure upload directory exists
    if (!fs.existsSync(config.uploadDir)) {
      fs.mkdirSync(config.uploadDir, { recursive: true });
    }

    console.log(`[Repositorio] Clonando ${repoUrl} a ${clonePath}...`);

    // Spawn git clone process
    const gitProcess = spawn('git', [
      'clone',
      '--depth', '1',
      '--branch', branch,
      repoUrl,
      clonePath
    ]);

    let errorOutput = '';
    let completed = false;

    // Capture stderr
    gitProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`[Git Error] ${data}`);
    });

    // Capture stdout
    gitProcess.stdout.on('data', (data) => {
      console.log(`[Git] ${data}`);
    });

    // Handle process completion
    gitProcess.on('close', (code) => {
      if (completed) return;
      completed = true;

      if (code === 0) {
        console.log(`[Repositorio] Clone exitoso: ${clonePath}`);
        resolve({
          success: true,
          clonePath,
          repoId,
          error: null
        });
      } else {
        console.error(`[Repositorio] Clone falló con código ${code}`);
        // Cleanup on failure
        cleanupDirectory(clonePath);
        resolve({
          success: false,
          clonePath: null,
          repoId: null,
          error: `Git clone failed: ${errorOutput || 'Unknown error'}`
        });
      }
    });

    // Handle spawn errors
    gitProcess.on('error', (err) => {
      if (completed) return;
      completed = true;

      console.error('[Repositorio] Error de ejecución:', err.message);
      cleanupDirectory(clonePath);
      resolve({
        success: false,
        clonePath: null,
        repoId: null,
        error: `Failed to execute git: ${err.message}`
      });
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!completed) {
        completed = true;
        gitProcess.kill();
        cleanupDirectory(clonePath);
        resolve({
          success: false,
          clonePath: null,
          repoId: null,
          error: 'Git clone timeout (5 minutes)'
        });
      }
    }, 5 * 60 * 1000);
  });
}

/**
 * Find all Java files in a directory recursively
 * @param {string} dirPath - Directory path to search
 * @returns {Array} - Array of Java file paths
 */
function findJavaFiles(dirPath) {
  const javaFiles = [];

  function walk(dir) {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        // Skip node_modules, .git, and other common directories
        if (stat.isDirectory()) {
          if (!['node_modules', '.git', '.gradle', 'build', 'target', '.idea'].includes(file)) {
            walk(filePath);
          }
        } else if (file.endsWith('.java')) {
          javaFiles.push(filePath);
        }
      }
    } catch (error) {
      console.error(`[Walk] Error processing ${dir}:`, error.message);
    }
  }

  walk(dirPath);
  return javaFiles;
}

/**
 * Process a cloned repository and generate documentation with AI enrichment
 * @param {string} clonePath - Path to cloned repository
 * @param {string} repoId - Repository ID
 * @param {boolean} useAI - Whether to use AI enrichment (default: true)
 * @returns {Promise<Object>} - { success, documentation, statistics, error }
 */
async function processRepository(clonePath, repoId, useAI = true) {
  return new Promise(async (resolve) => {
    try {
      console.log(`[Procesamiento] Iniciando análisis de ${clonePath}`);
      console.log(`[Procesamiento] Enriquecimiento IA: ${useAI ? 'ACTIVADO ✓' : 'DESACTIVADO'}`);

      // Find all Java files
      const javaFiles = findJavaFiles(clonePath);
      console.log(`[Procesamiento] Se encontraron ${javaFiles.length} archivos Java`);

      if (javaFiles.length === 0) {
        return resolve({
          success: false,
          documentation: null,
          statistics: { filesFound: 0, filesProcessed: 0 },
          error: 'No Java files found in repository',
          aiEnabled: useAI
        });
      }

      // Use file processor service with AI enrichment
      console.log(`[Procesamiento] Procesando archivos${useAI ? ' con enriquecimiento IA...' : ' sin enriquecimiento IA...'}`);
      const processorResult = await fileProcessorService.processRepositoryWithAI(clonePath, useAI);

      if (!processorResult.success) {
        return resolve({
          success: false,
          documentation: null,
          statistics: { filesFound: javaFiles.length, filesProcessed: 0 },
          error: processorResult.error || 'Fallo al procesar el repositorio',
          aiEnabled: useAI
        });
      }

      const aggregated = processorResult.aggregated;
      const mainPackage = aggregated.classes.length > 0 
        ? 'analizado'
        : 'desconocido';

      console.log(`[Procesamiento] Enriquecimiento IA completado: ${Object.keys(aggregated.aiDescriptions).length} descripciones generadas`);

      // Create aggregated structure
      const aggregatedStructure = {
        package: mainPackage || 'unknown',
        imports: aggregated.imports,
        classes: aggregated.classes,
        interfaces: aggregated.interfaces
      };

      // Generate PlantUML diagram
      console.log(`\n========== Diagram Generation Pipeline ==========`);
      console.log(`[Fase 1] Generando sintaxis PlantUML...`);
      const puml = plantumlGenerator.generateClassDiagram(aggregatedStructure);
      console.log(`✓ PlantUML syntax generated (${puml.length} caracteres)`);

      // Save outputs
      const outputDirForRepo = path.join(config.outputDir, `repo-${repoId}`);
      if (!fs.existsSync(outputDirForRepo)) {
        fs.mkdirSync(outputDirForRepo, { recursive: true });
      }

      const markdownPath = path.join(outputDirForRepo, 'documentation.md');
      const pumlPath = path.join(outputDirForRepo, 'diagram.puml');
      const aiMetadataPath = path.join(outputDirForRepo, 'ai-metadata.json');
      let diagramImagePath = null;
      let renderingError = null;

      // Save PlantUML source
      console.log(`[Fase 2] Guardando archivo PlantUML...`);
      plantumlGenerator.savePlantUML(puml, pumlPath);
      console.log(`✓ PlantUML saved: ${pumlPath}`);

      // Try to render PlantUML diagram to PNG
      console.log(`[Fase 3] Attempting diagram rendering...`);
      try {
        const isDockerReady = await plantumlRenderer.isDockerAvailable();
        if (isDockerReady) {
          console.log(`[Fase 4] Iniciando renderizado a PNG con Docker...`);
          diagramImagePath = await plantumlRenderer.renderPlantUMLToPNG(pumlPath, outputDirForRepo);
          console.log(`✓ Diagram rendering completed successfully`);
        } else {
          console.warn(`\n⚠ Docker no disponible - diagram no será renderizado`);
          console.warn(`  Para habilitar: Instale Docker desde https://www.docker.com/products/docker-desktop`);
          console.warn(`  Luego ejecute: docker pull ghcr.io/plantuml/plantuml`);
          renderingError = 'Docker not available for diagram rendering';
        }
      } catch (renderError) {
        console.error(`\n✗ Error al renderizar diagrama: ${renderError.message}`);
        renderingError = renderError.message;
        // Continue without diagram - don't fail the entire process
      }
      console.log(`========== Diagram Generation Pipeline Complete ==========\n`);

      // Generate markdown with embedded diagram reference
      const markdown = markdownGenerator.generateMarkdown(
        aggregatedStructure, 
        aggregated.aiDescriptions,
        diagramImagePath
      );
      markdownGenerator.saveMarkdown(markdown, markdownPath);

      // Save AI metadata for reference
      fs.writeFileSync(aiMetadataPath, JSON.stringify({
        aiEnabled: useAI,
        descriptionsGenerated: Object.keys(aggregated.aiDescriptions).length,
        descriptions: aggregated.aiDescriptions
      }, null, 2));

      console.log(`[Procesamiento] Documentación guardada en ${outputDirForRepo}`);
      console.log(`[Procesamiento] Metadatos IA guardados: ${Object.keys(aggregated.aiDescriptions).length} enriquecimientos`);

      resolve({
        success: true,
        documentation: {
          markdown,
          puml,
          markdownPath,
          pumlPath,
          diagramImagePath,
          aiMetadataPath,
          diagramRenderingError: renderingError
        },
        statistics: {
          filesFound: javaFiles.length,
          filesProcessed: processorResult.filesProcessed,
          classesFound: aggregated.classes.length,
          interfacesFound: aggregated.interfaces.length,
          aiEnrichments: Object.keys(aggregated.aiDescriptions).length,
          aiEnabled: useAI
        },
        error: null
      });
    } catch (error) {
      console.error('[Procesamiento] Error fatal:', error.message);
      resolve({
        success: false,
        documentation: null,
        statistics: { filesFound: 0, filesProcessed: 0 },
        error: error.message,
        aiEnabled: useAI
      });
    }
  });
}

/**
 * Cleanup directory recursively
 * @param {string} dirPath - Directory to remove
 */
function cleanupDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`[Limpieza] Se removió ${dirPath}`);
    }
  } catch (error) {
    console.error(`[Cleanup] Error removing ${dirPath}:`, error.message);
  }
}

/**
 * Complete workflow: Clone repository and process it
 * @param {string} repoUrl - Git repository URL
 * @param {string} branch - Branch name (optional)
 * @returns {Promise<Object>} - Complete result object
 */
async function cloneAndProcess(repoUrl, branch = 'main') {
  console.log(`\n[Flujo] Iniciando: Clonar y Procesar`);
   console.log(`[Flujo] Repositorio: ${repoUrl}`);
   console.log(`[Flujo] Rama: ${branch}\n`);

  // Step 1: Clone repository
  const cloneResult = await cloneRepository(repoUrl, branch);

  if (!cloneResult.success) {
    return {
      success: false,
      id: null,
      phase: 'clone',
      error: cloneResult.error,
      documentation: null,
      statistics: null
    };
  }

  // Step 2: Process repository
  const processResult = await processRepository(
    cloneResult.clonePath,
    cloneResult.repoId
  );

  // Step 3: Cleanup cloned repository (optional - set to false to keep it)
  const KEEP_CLONE = process.env.KEEP_CLONE === 'true';
  if (!KEEP_CLONE) {
    cleanupDirectory(cloneResult.clonePath);
  }

  return {
    success: processResult.success,
    id: cloneResult.repoId,
    phase: 'process',
    error: processResult.error,
    documentation: processResult.documentation,
    statistics: processResult.statistics,
    repositoryUrl: repoUrl,
    branch
  };
}

module.exports = {
  cloneRepository,
  processRepository,
  findJavaFiles,
  cleanupDirectory,
  cloneAndProcess
};
