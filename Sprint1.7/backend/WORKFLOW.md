# Git Clone & Process Workflow

## Complete Documentation

This document describes the subprocess workflow for cloning Git repositories and processing them with the documentation backend.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│         Frontend (React)                                 │
│   Sends: repositoryUrl, branch                          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP POST /api/repository/process
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Backend (Node.js)                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  REST API Layer (repositoryRoutes.js)            │  │
│  │  Receives request, validates input               │  │
│  └────────────────┬─────────────────────────────────┘  │
│                   │                                     │
│  ┌────────────────▼─────────────────────────────────┐  │
│  │  Repository Service (repositoryService.js)       │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │ Phase 1: Clone Repository                │   │  │
│  │  │ ┌────────────────────────────────────┐   │   │  │
│  │  │ │ spawn('git', ['clone', ...])       │   │   │  │
│  │  │ │ ├─ Monitor: stdout, stderr         │   │   │  │
│  │  │ │ ├─ Timeout: 5 minutes              │   │   │  │
│  │  │ │ └─ Cleanup on failure              │   │   │  │
│  │  │ └────────────────────────────────────┘   │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  │                                                  │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │ Phase 2: Process Repository              │   │  │
│  │  │ ┌────────────────────────────────────┐   │   │  │
│  │  │ │ findJavaFiles(clonePath)           │   │   │  │
│  │  │ │ ├─ Recursive traversal             │   │   │  │
│  │  │ │ ├─ Skip: .git, build, target, ... │   │   │  │
│  │  │ │ └─ Collect all .java files        │   │   │  │
│  │  │ └────────────────────────────────────┘   │   │  │
│  │  │                                           │   │  │
│  │  │ ┌────────────────────────────────────┐   │   │  │
│  │  │ │ Analyze Each Java File             │   │   │  │
│  │  │ │ ├─ javaAnalyzer.analyzeJavaCode()  │   │   │  │
│  │  │ │ ├─ Extract classes, methods, etc.  │   │   │  │
│  │  │ │ └─ Aggregate structures            │   │   │  │
│  │  │ └────────────────────────────────────┘   │   │  │
│  │  │                                           │   │  │
│  │  │ ┌────────────────────────────────────┐   │   │  │
│  │  │ │ Generate Documentation             │   │   │  │
│  │  │ │ ├─ markdownGenerator.generate()    │   │   │  │
│  │  │ │ ├─ plantumlGenerator.generate()    │   │   │  │
│  │  │ │ └─ Save to outputs/repo-{id}/     │   │   │  │
│  │  │ └────────────────────────────────────┘   │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  │                                                  │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │ Phase 3: Cleanup (optional)              │   │  │
│  │  │ └─ Remove cloned repo from uploads/  │   │  │  │
│  │  └──────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│                   │                                     │
│                   │ Result: success, id, statistics    │
└───────────────────┼─────────────────────────────────────┘
                    │ HTTP Response (JSON)
                    ▼
         ┌──────────────────────┐
         │  Frontend (React)    │
         │  Display results     │
         │  Show statistics     │
         │  Link to docs/files  │
         └──────────────────────┘
```

## Subprocess Implementation Details

### 1. Git Clone Process

#### Spawning Git

```javascript
const { spawn } = require('child_process');

const gitProcess = spawn('git', [
  'clone',
  '--depth', '1',           // Shallow clone (fast)
  '--branch', branch,       // Specific branch
  repoUrl,                  // Repository URL
  clonePath                 // Target directory
]);
```

#### Stream Monitoring

```javascript
// Capture output
gitProcess.stdout.on('data', (data) => {
  console.log(`[Git] ${data}`);
});

gitProcess.stderr.on('data', (data) => {
  console.error(`[Git Error] ${data}`);
});

// Handle completion
gitProcess.on('close', (code) => {
  if (code === 0) {
    // Success: proceed to processing
  } else {
    // Failure: cleanup and return error
  }
});
```

#### Error Handling

```javascript
// Spawn errors (e.g., git not found)
gitProcess.on('error', (err) => {
  console.error('[Repository] Spawn error:', err.message);
  // Handle gracefully
});

// Timeout mechanism
setTimeout(() => {
  if (!completed) {
    gitProcess.kill();
    cleanup();
  }
}, 5 * 60 * 1000); // 5 minutes
```

### 2. Java File Discovery

#### Recursive Traversal

```javascript
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip ignored directories
      if (!ignoredDirs.includes(file)) {
        walk(filePath);  // Recurse
      }
    } else if (file.endsWith('.java')) {
      javaFiles.push(filePath);
    }
  }
}
```

#### Ignored Directories

- `node_modules` - Node dependencies
- `.git` - Git metadata
- `.gradle` - Gradle build
- `build` - Build output
- `target` - Maven output
- `.idea` - IDE metadata

### 3. Java Analysis Pipeline

#### Per-File Analysis

```javascript
for (const javaFile of javaFiles) {
  const content = fs.readFileSync(javaFile, 'utf8');
  const structure = javaAnalyzer.analyzeJavaCode(content);
  
  // Aggregate results
  allClasses.push(...structure.classes);
  allInterfaces.push(...structure.interfaces);
  allImports.add(...structure.imports);
}
```

#### Structure Aggregation

```javascript
const aggregatedStructure = {
  package: mainPackage || 'unknown',
  imports: Array.from(allImports),
  classes: allClasses,
  interfaces: allInterfaces
};
```

### 4. Documentation Generation

#### Markdown Generation

```javascript
const markdown = markdownGenerator.generateMarkdown(aggregatedStructure);

// Output includes:
// - Table of Contents
// - Package information
// - All imports
// - Class definitions with:
//   - Inheritance information
//   - Fields (type and name)
//   - Methods (signature)
// - Interface definitions
```

#### PlantUML Generation

```javascript
const puml = plantumlGenerator.generateClassDiagram(aggregatedStructure);

// Output: Valid PlantUML syntax for:
// - Class definitions with fields and methods
// - Interface definitions
// - Inheritance relationships (-->)
// - Implementation relationships (..|>)
```

#### Saving Results

```javascript
const outputDir = path.join(config.outputDir, `repo-${repoId}`);
fs.mkdirSync(outputDir, { recursive: true });

markdownGenerator.saveMarkdown(markdown, 
  path.join(outputDir, 'documentation.md'));
plantumlGenerator.savePlantUML(puml, 
  path.join(outputDir, 'diagram.puml'));
```

### 5. Cleanup Phase

```javascript
function cleanupDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}
```

- Removes temporary cloned repository
- Preserves generated documentation
- Only if `KEEP_CLONE !== 'true'`

## Timing Example

For a typical small Java project:

```
Start: 2024-01-08 12:00:00

Git Clone:          ~3 seconds
  ├─ Connect to GitHub
  ├─ Download commit history
  └─ Download files

Processing:         ~0.5 seconds
  ├─ Find Java files: 15 files
  ├─ Read & analyze: 15 files
  ├─ Generate Markdown
  ├─ Generate PlantUML
  └─ Save results

Cleanup:            ~0.1 seconds
  └─ Remove clone directory

Total:              ~3.6 seconds
```

## Error Scenarios

### Scenario 1: Invalid Repository URL

```
Request: { repositoryUrl: "not-a-repo" }

Response (400):
{
  "error": "Invalid repository URL",
  "message": "Must be a valid Git repository URL"
}
```

### Scenario 2: Network Timeout

```
Request: { repositoryUrl: "https://github.com/large/repo.git" }

Process: Clone takes > 5 minutes
Response (500):
{
  "success": false,
  "error": "Git clone timeout (5 minutes)",
  "phase": "clone"
}
```

### Scenario 3: No Java Files

```
Request: { repositoryUrl: "https://github.com/user/python-project.git" }

Response (500):
{
  "success": false,
  "error": "No Java files found in repository",
  "phase": "process"
}
```

### Scenario 4: Git Not Found

```
Process: Git command not in PATH
Response (500):
{
  "success": false,
  "error": "Failed to execute git: spawn ENOENT",
  "phase": "clone"
}
```

## Environment Variables

```env
# Keep cloned repositories
KEEP_CLONE=false

# Base directories (optional - uses config/config.js defaults)
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs

# AI Model (optional)
AI_MODEL_URL=http://localhost:1234/v1
AI_MODEL_NAME=local-model
```

## File Structure After Processing

```
backend/
├── uploads/
│   └── repo-a1b2c3d4/          # Removed after processing
│       ├── .git/
│       ├── src/
│       │   └── main/
│       │       └── java/
│       │           └── *.java
│       └── pom.xml
│
├── outputs/
│   └── repo-a1b2c3d4/          # Persists
│       ├── documentation.md    # Generated Markdown
│       └── diagram.puml        # Generated PlantUML
│
└── cli/
    └── process-repo.js         # CLI tool
```

## Node.js Child Process Reference

### Subprocess Options

```javascript
spawn('git', args, {
  cwd: process.cwd(),      // Working directory
  env: process.env,        // Environment variables
  stdio: 'pipe',           // I/O handling
  shell: false,            // Don't use shell
  timeout: 0               // No timeout (we handle it)
});
```

### Event Handling

```javascript
process.on('data', callback)       // Stream data
process.on('close', callback)      // Process finished
process.on('error', callback)      // Spawn error
process.on('exit', callback)       // Process exited
process.kill([signal])             // Terminate
```

## Logging Output Example

```
[Workflow] Starting: Clone and Process
[Workflow] Repository: https://github.com/user/repo.git
[Workflow] Branch: main

[Repository] Cloning https://github.com/user/repo.git to /path/uploads/repo-a1b2c3d4...
[Git] Cloning into '/path/uploads/repo-a1b2c3d4'...
[Git] remote: Counting objects: 123
[Git] remote: Compressing objects: 100% (98/98)
[Git] Receiving objects: 100% (123/123), 45.67 KiB
[Repository] Clone successful: /path/uploads/repo-a1b2c3d4

[Processing] Starting analysis of /path/uploads/repo-a1b2c3d4
[Processing] Found 15 Java files
[Processing] Processed: src/main/java/UserService.java
[Processing] Processed: src/main/java/UserRepository.java
...
[Processing] Documentation saved to /path/outputs/repo-a1b2c3d4

[Cleanup] Removed /path/uploads/repo-a1b2c3d4
```

## References

- Node.js Child Process: https://nodejs.org/api/child_process.html
- Git Clone Documentation: https://git-scm.com/docs/git-clone
- Repository Service: `services/repositoryService.js`
- Repository Routes: `api/repositoryRoutes.js`
- CLI Tool: `cli/process-repo.js`
