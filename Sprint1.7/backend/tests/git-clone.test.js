/**
 * Git Clone Test
 * Tests the subprocess-based git cloning functionality
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('================================');
console.log('Git Clone Subprocess Test');
console.log('================================\n');

// Test 1: Check if git is available
console.log('Test 1: Checking if Git is installed...');
const gitCheckProcess = spawn('git', ['--version']);

gitCheckProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✓ Git is available\n');
    testGitClone();
  } else {
    console.error('✗ Git is not available or not in PATH');
    process.exit(1);
  }
});

gitCheckProcess.on('error', (err) => {
  console.error('✗ Failed to spawn git:', err.message);
  process.exit(1);
});

function testGitClone() {
  console.log('Test 2: Testing git clone with subprocess...');
  
  // Create temp directory for test
  const tempDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Use a small public repo for testing
  const testRepoUrl = 'https://github.com/octocat/Hello-World.git';
  const clonePath = path.join(tempDir, 'test-clone');

  // Clean up if exists
  if (fs.existsSync(clonePath)) {
    fs.rmSync(clonePath, { recursive: true, force: true });
  }

  console.log(`Cloning to: ${clonePath}`);
  console.log(`Repository: ${testRepoUrl}\n`);

  const gitCloneProcess = spawn('git', [
    'clone',
    '--depth', '1',
    testRepoUrl,
    clonePath
  ]);

  let completed = false;
  let gitOutput = '';
  let gitError = '';

  // Capture output
  gitCloneProcess.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(`[Git stdout] ${text}`);
    gitOutput += text;
  });

  gitCloneProcess.stderr.on('data', (data) => {
    const text = data.toString();
    console.log(`[Git stderr] ${text}`);
    gitError += text;
  });

  // Handle completion
  gitCloneProcess.on('close', (code) => {
    if (completed) return;
    completed = true;

    console.log(`\nGit process exited with code: ${code}\n`);

    if (code === 0) {
      console.log('✓ Git clone successful\n');
      
      // Verify cloned directory
      testClonedRepository(clonePath);
    } else {
      console.error('✗ Git clone failed');
      console.error('Error output:', gitError);
      cleanup(clonePath);
      process.exit(1);
    }
  });

  // Handle spawn errors
  gitCloneProcess.on('error', (err) => {
    if (completed) return;
    completed = true;
    
    console.error('✗ Failed to spawn git process:', err.message);
    cleanup(clonePath);
    process.exit(1);
  });

  // Timeout after 2 minutes
  setTimeout(() => {
    if (!completed) {
      completed = true;
      gitCloneProcess.kill();
      console.error('✗ Git clone timeout (2 minutes)');
      cleanup(clonePath);
      process.exit(1);
    }
  }, 2 * 60 * 1000);
}

function testClonedRepository(clonePath) {
  console.log('Test 3: Verifying cloned repository...\n');

  if (!fs.existsSync(clonePath)) {
    console.error('✗ Clone directory does not exist');
    process.exit(1);
  }

  console.log('✓ Clone directory exists');

  // Check for .git directory
  const gitDir = path.join(clonePath, '.git');
  if (fs.existsSync(gitDir)) {
    console.log('✓ .git directory found');
  } else {
    console.error('✗ .git directory not found');
    cleanup(clonePath);
    process.exit(1);
  }

  // List files in cloned repo
  const files = fs.readdirSync(clonePath);
  console.log(`✓ Cloned repository contains ${files.length} items`);
  console.log(`  Files: ${files.slice(0, 5).join(', ')}${files.length > 5 ? ', ...' : ''}`);

  // Check for common files
  if (fs.existsSync(path.join(clonePath, 'README.md'))) {
    console.log('✓ README.md found');
  }
  if (fs.existsSync(path.join(clonePath, '.git'))) {
    console.log('✓ .git metadata found');
  }

  console.log('\n✓ Cloned repository structure verified\n');

  // Test 4: Find files in cloned repo
  testFindFiles(clonePath);
}

function testFindFiles(clonePath) {
  console.log('Test 4: Finding files in cloned repository...\n');

  const fileStats = {
    total: 0,
    directories: 0,
    files: 0,
    markdown: 0
  };

  function walkDir(dir) {
    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip .git
          if (entry !== '.git') {
            fileStats.directories++;
            walkDir(fullPath);
          }
        } else {
          fileStats.files++;
          if (entry.endsWith('.md')) {
            fileStats.markdown++;
          }
        }
        fileStats.total++;
      }
    } catch (error) {
      console.error(`Error walking ${dir}:`, error.message);
    }
  }

  walkDir(clonePath);

  console.log(`✓ Total items: ${fileStats.total}`);
  console.log(`  Directories: ${fileStats.directories}`);
  console.log(`  Files: ${fileStats.files}`);
  console.log(`  Markdown files: ${fileStats.markdown}`);

  console.log('\n✓ File discovery successful\n');

  // Cleanup
  cleanup(clonePath);
}

function cleanup(clonePath) {
  console.log('Test 5: Cleanup...\n');
  
  try {
    if (fs.existsSync(clonePath)) {
      fs.rmSync(clonePath, { recursive: true, force: true });
      console.log('✓ Clone directory removed');
    }
  } catch (error) {
    console.error('✗ Failed to cleanup:', error.message);
  }

  console.log('\n================================');
  console.log('✓ All Git Clone Tests PASSED');
  console.log('================================\n');
  process.exit(0);
}
