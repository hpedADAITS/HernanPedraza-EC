/**
 * PlantUML Renderer - Converts .puml to PNG/SVG
 * Uses Docker image: ghcr.io/plantuml/plantuml
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

/**
 * Render PlantUML diagram to PNG using Docker
 * @param {string} pumlPath - Path to .puml file
 * @param {string} outputDir - Directory to save PNG output
 * @returns {Promise<string>} - Path to generated PNG file
 */
async function renderPlantUMLToPNG(pumlPath, outputDir) {
  try {
    console.log(`\n========== PlantUML Rendering Pipeline Started ==========`);
    
    if (!fs.existsSync(pumlPath)) {
      throw new Error(`PlantUML file not found: ${pumlPath}`);
    }
    console.log(`✓ PlantUML source found: ${pumlPath}`);
    console.log(`  File size: ${fs.statSync(pumlPath).size} bytes`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    console.log(`✓ Output directory ready: ${outputDir}`);

    // Normalize paths for Docker (Windows to Unix-style)
    const pumlAbsPath = path.resolve(pumlPath);
    const outputAbsPath = path.resolve(outputDir);

    // Get the file name
    const pumlFileName = path.basename(pumlPath);
    
    // Create container path - use /work as mount point for consistency
    const containerWorkDir = '/work';
    const containerPumlPath = `${containerWorkDir}/${pumlFileName}`;

    // Docker command to render PlantUML
    // Mount the output directory at /work in the container
    // PlantUML will read and write files in /work
    const command = `docker run --rm -v "${outputAbsPath}:${containerWorkDir}" ghcr.io/plantuml/plantuml -png "${containerPumlPath}"`;

    console.log(`\n[Step 1] Initializing Docker container...`);
    console.log(`  Docker image: ghcr.io/plantuml/plantuml`);
    console.log(`  Host path: ${outputAbsPath}`);
    console.log(`  Container path: ${containerWorkDir}`);
    console.log(`  PUML file: ${pumlFileName}`);
    console.log(`  Output format: PNG`);
    console.log(`  Timeout: 30 seconds`);

    const startTime = Date.now();
    console.log(`\n[Step 2] Executing Docker command...`);
    const { stdout, stderr } = await execAsync(command, { 
      shell: true,
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large diagrams
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n[Step 3] Docker execution completed`);
    console.log(`  Duration: ${duration}s`);
    if (stdout) console.log(`  Stdout: ${stdout.trim()}`);
    if (stderr) console.log(`  Stderr: ${stderr.trim()}`);

    // PlantUML outputs PNG in same directory as input, with same name but .png extension
    const baseName = path.basename(pumlPath, '.puml');
    const pngPath = path.join(outputDir, `${baseName}.png`);

    if (fs.existsSync(pngPath)) {
      const fileSize = fs.statSync(pngPath).size;
      console.log(`\n[Step 4] PNG generated successfully`);
      console.log(`  Path: ${pngPath}`);
      console.log(`  Size: ${(fileSize / 1024).toFixed(2)} KB`);
      console.log(`========== PlantUML Rendering Pipeline Completed ==========\n`);
      return pngPath;
    } else {
      throw new Error(`PNG file was not created at expected location: ${pngPath}\nCheck stderr output above for PlantUML errors.`);
    }
  } catch (error) {
    console.error(`\n[ERROR] PlantUML rendering failed:`, error.message);
    console.error(`========== PlantUML Rendering Pipeline Failed ==========\n`);
    throw error;
  }
}

/**
 * Render PlantUML diagram to SVG using Docker
 * @param {string} pumlPath - Path to .puml file
 * @param {string} outputDir - Directory to save SVG output
 * @returns {Promise<string>} - Path to generated SVG file
 */
async function renderPlantUMLToSVG(pumlPath, outputDir) {
  try {
    console.log(`\n========== PlantUML SVG Rendering Started ==========`);
    
    if (!fs.existsSync(pumlPath)) {
      throw new Error(`PlantUML file not found: ${pumlPath}`);
    }
    console.log(`✓ PlantUML source found: ${pumlPath}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    console.log(`✓ Output directory ready: ${outputDir}`);

    const outputAbsPath = path.resolve(outputDir);
    const pumlFileName = path.basename(pumlPath);
    
    // Create container path - use /work as mount point
    const containerWorkDir = '/work';
    const containerPumlPath = `${containerWorkDir}/${pumlFileName}`;

    // Docker command to render PlantUML to SVG
    const command = `docker run --rm -v "${outputAbsPath}:${containerWorkDir}" ghcr.io/plantuml/plantuml -svg "${containerPumlPath}"`;

    console.log(`\n[Step 1] Rendering to SVG format...`);
    console.log(`  Host path: ${outputAbsPath}`);
    console.log(`  Container path: ${containerWorkDir}`);

    const startTime = Date.now();
    const { stdout, stderr } = await execAsync(command, { 
      shell: true,
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n[Step 2] Docker execution completed (${duration}s)`);
    if (stderr && stderr.trim()) console.log(`  Stderr: ${stderr.trim()}`);

    const baseName = path.basename(pumlPath, '.puml');
    const svgPath = path.join(outputDir, `${baseName}.svg`);

    if (fs.existsSync(svgPath)) {
      console.log(`[PlantUML Renderer] Successfully rendered SVG: ${svgPath}`);
      return svgPath;
    } else {
      throw new Error(`SVG file was not created at expected location: ${svgPath}`);
    }
  } catch (error) {
    console.error(`[PlantUML Renderer] Error rendering PlantUML to SVG:`, error.message);
    throw error;
  }
}

/**
 * Check if Docker is available
 * @returns {Promise<boolean>} - True if Docker is available
 */
async function isDockerAvailable() {
  try {
    console.log(`\n[Docker Check] Verifying Docker availability...`);
    const { stdout } = await execAsync('docker --version', { timeout: 5000 });
    console.log(`✓ Docker is available: ${stdout.trim()}`);
    return true;
  } catch (error) {
    console.warn(`\n✗ Docker not available: ${error.message}`);
    console.warn(`  Install Docker from: https://www.docker.com/products/docker-desktop`);
    return false;
  }
}

module.exports = {
  renderPlantUMLToPNG,
  renderPlantUMLToSVG,
  isDockerAvailable
};
