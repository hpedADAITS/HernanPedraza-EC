# Repository Processing Feature

## Overview

The Repository Processing feature allows the backend to automatically clone Git repositories and generate comprehensive Java documentation from them.

## Architecture

### Components

1. **Repository Service** (`services/repositoryService.js`)
   - Handles Git clone operations via subprocess
   - Discovers Java files recursively
   - Aggregates and processes Java structures
   - Generates documentation

2. **Repository Routes** (`api/repositoryRoutes.js`)
   - REST endpoints for repository processing
   - Integration with Express server

3. **CLI Tool** (`cli/process-repo.js`)
   - Command-line interface for direct usage
   - Useful for testing and batch processing

## Usage

### Method 1: REST API

```bash
curl -X POST http://localhost:3000/api/repository/process \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryUrl": "https://github.com/user/repo.git",
    "branch": "main"
  }'
```

**Request Body:**
```json
{
  "repositoryUrl": "https://github.com/user/repo.git",
  "branch": "main"  // Optional, defaults to "main"
}
```

**Response (Success):**
```json
{
  "success": true,
  "id": "a1b2c3d4",
  "message": "Repository processed successfully",
  "statistics": {
    "filesFound": 15,
    "filesProcessed": 15,
    "classesFound": 8,
    "interfacesFound": 2
  },
  "documentation": {
    "markdownPath": "backend/outputs/repo-a1b2c3d4/documentation.md",
    "pumlPath": "backend/outputs/repo-a1b2c3d4/diagram.puml"
  }
}
```

### Method 2: CLI

```bash
# Process repository with main branch
npm run process-repo https://github.com/user/repo.git

# Process repository with specific branch
npm run process-repo https://github.com/user/repo.git develop
```

## Workflow

### Clone & Process Workflow

```
1. Clone Repository
   ├─ Spawn git subprocess
   ├─ Monitor progress
   └─ Wait for completion

2. Process Repository
   ├─ Find all Java files
   ├─ Parse each file
   ├─ Aggregate structures
   ├─ Generate Markdown
   ├─ Generate PlantUML
   └─ Save outputs

3. Cleanup (optional)
   └─ Remove cloned repository from temp storage
```

### Implementation Details

#### Git Clone Process

```javascript
const { spawn } = require('child_process');

gitProcess = spawn('git', [
  'clone',
  '--depth', '1',
  '--branch', 'main',
  'https://github.com/user/repo.git',
  '/path/to/clone'
]);
```

Features:
- Shallow clone (`--depth 1`) for faster cloning
- Configurable branch
- Process monitoring and error handling
- 5-minute timeout
- Automatic cleanup on failure

#### Java File Discovery

```javascript
findJavaFiles(dirPath)
```

Features:
- Recursive directory traversal
- Skips common ignored directories:
  - `node_modules`, `.git`, `.gradle`
  - `build`, `target`, `.idea`
- Collects all `.java` files

#### Documentation Generation

```javascript
processRepository(clonePath, repoId)
```

Features:
- Analyzes all Java files
- Aggregates classes and interfaces
- Generates comprehensive Markdown documentation
- Generates PlantUML UML diagrams
- Stores results in `outputs/repo-{id}/` directory

## Configuration

### Environment Variables

Add to `.env`:

```env
# Keep cloned repositories in outputs (default: false)
KEEP_CLONE=false

# Upload/output directories (optional)
# Uses defaults from config/config.js if not set
```

### Directory Structure

```
backend/
├── uploads/          # Temporary storage for cloned repos
│   └── repo-{id}/   # Individual repository clones
├── outputs/          # Generated documentation
│   └── repo-{id}/
│       ├── documentation.md
│       └── diagram.puml
└── cli/
    └── process-repo.js
```

## Error Handling

### Clone Errors

- `Git clone failed: ...` - Clone process returned non-zero exit code
- `Failed to execute git: ...` - Git command not found or spawn error
- `Git clone timeout (5 minutes)` - Clone took too long

### Processing Errors

- `No Java files found in repository` - No .java files in cloned repo
- Various file read/parse errors logged but don't stop processing

### Response on Failure

```json
{
  "success": false,
  "error": "Error message",
  "phase": "clone" | "process",
  "message": "Failed during {phase} phase"
}
```

## Subprocess Details

### Git Process

- **Command:** `git clone --depth 1 --branch {branch} {url} {path}`
- **Spawn Option:** Default (not shell)
- **stdout/stderr:** Captured and logged
- **Timeout:** 5 minutes
- **Cleanup:** Automatic on failure or via KEEP_CLONE env var

### Logging

All subprocess output is logged with prefixes:
- `[Repository]` - High-level operations
- `[Git]` - Git stdout
- `[Git Error]` - Git stderr
- `[Processing]` - File processing
- `[Cleanup]` - Directory cleanup

## Examples

### Example 1: Public Repository

```bash
npm run process-repo https://github.com/google/guava.git
```

### Example 2: Private Repository (with auth)

Note: Ensure git credentials are configured

```bash
npm run process-repo git@github.com:user/private-repo.git main
```

### Example 3: Via cURL

```bash
curl -X POST http://localhost:3000/api/repository/process \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryUrl": "https://github.com/apache/commons-lang.git",
    "branch": "master"
  }' | jq
```

## Performance Considerations

1. **Clone Time** - Depends on repository size
   - Shallow clone (`--depth 1`) minimizes time
   - Large monorepos may take longer

2. **Processing Time** - Proportional to Java files
   - 100 files typically < 1 second
   - 1000 files typically < 10 seconds

3. **Storage** - Temporary and output files
   - Clones cleaned up by default
   - Set `KEEP_CLONE=true` to preserve

4. **Concurrency** - Sequential processing
   - Each request processes independently
   - Can handle multiple parallel requests

## Future Enhancements

- [ ] Job queue for async processing
- [ ] Progress tracking via WebSocket
- [ ] Status endpoint implementation
- [ ] Database persistence of results
- [ ] AI enrichment integration
- [ ] PDF generation
- [ ] Support for multiple programming languages
- [ ] Caching mechanism for repeated repositories
- [ ] Batch processing
- [ ] Custom filtering and analysis rules

## Troubleshooting

### "No Java files found"

- Verify repository contains .java files
- Check branch exists
- Repository may use different structure

### Git command not found

- Ensure Git is installed and in PATH
- On Windows, use Git Bash or ensure git.exe is available

### Process timeout

- Repository may be too large
- Network connectivity issues
- Increase timeout in code if needed

### Permission denied

- Git SSH key issues (for private repos)
- File system permissions on upload/output directories

## Related Files

- `services/repositoryService.js` - Main implementation
- `api/repositoryRoutes.js` - REST endpoints
- `cli/process-repo.js` - CLI tool
- `config/config.js` - Configuration
- `generators/` - Documentation generators
