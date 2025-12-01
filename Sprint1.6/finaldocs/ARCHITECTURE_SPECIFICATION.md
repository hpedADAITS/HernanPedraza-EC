# Technical Architecture Specification
## Automatic Documentation Generator for Java Projects

---

## 1. System Overview

### 1.1 Project Objective
Develop a fully modular, self-contained application that automatically analyzes Java source code, generates comprehensive technical documentation, and delivers it in structured formats (Markdown and PDF), while producing UML diagrams using PlantUML.

### 1.2 Core Constraints & Design Decisions
- **VRAM-Limited AI**: Uses LMStudio (local LLM) with ~5000 token context limit per request
- **Privacy-First**: All processing occurs locally without cloud dependencies
- **Offline Capability**: Works without internet access after initial setup
- **Token Budget Discipline**: Implements strict token counting and chunking to respect LLM constraints
- **Stateless AI Calls**: Each LLM call has fresh context (no accumulated chat history)

### 1.3 Architecture Pattern
Follows **separation of concerns** with clear boundaries:
- **Frontend**: React + TailwindCSS (user interaction)
- **Backend**: Node.js + Express (orchestration & processing)
- **AI Processing**: LMStudio (IMPLEMENTER & EXPANDER models)
- **Output Generation**: PlantUML (diagrams), Pandoc (PDFs)
- **Data Storage**: Filesystem-based (docs/, diagrams/, media/)

---

## 2. Component Architecture

### 2.1 Frontend Layer (React + TypeScript)

**Purpose**: Provides user interface for project selection, analysis triggering, and results viewing.

#### Components:
1. **ProjectSelector**
   - Handles local directory selection or ZIP file upload
   - Validates that selected path contains valid Java files
   - Displays file count and total size

2. **GenerateButton**
   - Triggers POST /api/analyze with validated project path
   - Shows loading state while analysis is in progress
   - Manages error handling and retry logic

3. **ResultsView**
   - Displays generated Markdown with syntax highlighting
   - Shows embedded PlantUML diagrams (PNG images)
   - Provides download buttons for Markdown and PDF formats
   - Shows project metadata and analysis statistics

4. **HistoryView**
   - Displays table of past executions
   - Each row shows: timestamp, project name, status, result links
   - Allows deletion of history entries

5. **LoadingState**
   - Shows spinner and progress information
   - Displays current processing step (parsing, analyzing, generating docs, etc.)
   - Implements timeout handling

#### State Management:
```typescript
// App.tsx state structure
const [selectedProject, setSelectedProject] = useState<string | null>(null);
const [isGenerating, setIsGenerating] = useState(false);
const [results, setResults] = useState({
  markdown: '',
  pdfUrl: '',
  diagrams: [],
  metadata: {}
});
const [error, setError] = useState('');
const [history, setHistory] = useState([]);
```

#### Key Effects:
- **On mount**: Fetch history from `/api/history`
- **On selectedProject change**: Validate and enable generate button
- **On isGenerating change**: Show/hide loading state
- **On results change**: Display ResultsView component

---

### 2.2 Backend Layer (Node.js + Express)

**Purpose**: Orchestrates entire analysis pipeline, coordinates services, and manages external tool execution.

#### Architecture:

```
backend/
├── controllers/
│   └── analyzeController.ts        # Route handler & orchestration
├── services/
│   ├── aiService.ts                # LMStudio interaction
│   ├── plantUmlGenerator.ts         # UML diagram generation
│   ├── markdownBuilder.ts           # Documentation assembly
│   └── pdfConverter.ts              # PDF conversion
├── analyzers/
│   ├── javaParser.ts                # Java source analysis
│   └── fileTreeAnalyzer.ts          # File structure extraction
├── utils/
│   ├── childProcessExecutor.ts      # External tool execution
│   ├── schemaValidator.ts           # JSON schema validation
│   └── tokenizer.ts                 # Token counting
└── config/
    └── environment.ts               # Configuration management
```

#### Key Services:

**1. AIService**
- Manages communication with LMStudio OpenAI-compatible API
- Implements token-budgeted prompt construction
- Orchestrates two-stage processing:
  - **IMPLEMENTER**: Extracts code structure (tool calls)
  - **EXPANDER**: Enriches descriptions (text generation)
- Enforces max 5000 token limit per request
- Validates all responses against JSON schemas

**2. JavaParser**
- Parses Java source files using regex-based extraction
- Extracts:
  - Class names and package structure
  - Method signatures with return types and parameters
  - Field declarations with types and visibility
  - Inheritance relationships (extends/implements)
  - Annotations and modifiers
- Returns structured `FunctionUnit[]` for each file

**3. FileTreeAnalyzer**
- Scans project directory recursively
- Filters for `.java` files
- Builds hierarchical `FileNode` tree
- Computes metadata:
  - Line counts
  - File sizes
  - Token counts (using gpt-tokenizer)
  - Package hierarchies

**4. PlantUmlGenerator**
- Generates PlantUML source (`.puml`) files
- Creates class relationship diagrams
- Builds package dependency diagrams
- Produces activity diagrams for complex methods
- Validates output starts with `@startuml` and ends with `@enduml`

**5. MarkdownBuilder**
- Assembles final Markdown documentation
- Structure:
  - Project overview section
  - Package breakdowns
  - Per-class documentation (methods, fields, relationships)
  - UML diagram references with image embedding
  - Metrics and statistics
  - Dependency graph

**6. PDFConverter**
- Converts Markdown to PDF using Pandoc CLI
- Applies custom styling template
- Generates both per-file and master index PDFs
- Stores output in `/media/docs/`

---

### 2.3 Analysis Pipeline Flow

#### Stage 1: Input Validation
```
1. Receive POST /api/analyze with projectPath
2. Validate path exists and is directory
3. Check for minimum 1 .java file
4. Verify total project size < 50 MB
5. Return 400 if invalid, continue if valid
```

#### Stage 2: File Structure Extraction
```
1. Execute ext-finder.js to locate all .java files
2. Build FileNode tree with metadata
3. Extract DocumentInfo for each file
4. Count tokens for each file (for budgeting)
5. Build file list for subsequent processing
```

#### Stage 3: Code Structure Analysis (IMPLEMENTER)
```
1. For each Java file:
   a. Create token-budgeted prompt
   b. Include file tree context
   c. Call IMPLEMENTER model
   d. Receive tool call response with class/method data
   e. Validate response against schema
   f. Extract classes, methods, fields, relationships
2. Aggregate all extracted data
3. Build in-memory class hierarchy
```

#### Stage 4: Context Building (RAG Preparation)
```
1. Chunk analyzed files by token budget (max 2000 tokens/chunk)
2. Create embeddings for each chunk
3. Build vector index for semantic search
4. Store metadata (file path, section, token count)
5. Ready for per-function context retrieval
```

#### Stage 5: Documentation Enrichment (EXPANDER)
```
1. For each extracted class/method:
   a. Query RAG index for relevant context
   b. Build prompt with function code + context snippets
   c. Call EXPANDER model
   d. Receive enriched description
   e. Store in FunctionDocResult
2. Aggregate enriched descriptions
3. Add recommendations and usage patterns
```

#### Stage 6: Diagram Generation
```
1. For each class and package:
   a. Extract relationship data (inherits, depends on, etc.)
   b. Generate PlantUML syntax
   c. Validate and save as .puml file
2. Execute PlantUML CLI to render all .puml to .png
3. Handle failures gracefully with placeholder diagrams
```

#### Stage 7: Markdown Assembly
```
1. Build master index.md
2. For each package:
   a. Create overview section
   b. Link all classes in package
3. For each class:
   a. Add description (from EXPANDER)
   b. List all methods with docs
   c. List all fields
   d. Show inheritance and relationships
   e. Embed diagram image
4. Add project metrics section
5. Add recommendation section (from AI analysis)
```

#### Stage 8: PDF Generation
```
1. Convert index.md to PDF using Pandoc
2. Convert each class/package file to PDF
3. Apply consistent styling template
4. Store in /media/docs/ with unique IDs
```

#### Stage 9: History Logging
```
1. Record execution in history.json:
   - analysisId (UUID)
   - projectPath and projectName
   - timestamp (ISO 8601)
   - status (success/error)
   - processingTimeMs
   - resultsUrl
2. Append to history array (most recent first)
```

---

## 3. Data Structures & Type System

### 3.1 Core Types (src/types.ts)

**Language**: TypeScript/Node.js implementation for type safety.

```typescript
export type Language = "java" | "ts" | "js" | "py" | "md" | "unknown";
export type NodeKind = "file" | "dir";

export interface FileNode {
  kind: NodeKind;
  name: string;
  path: string;           // relative path from project root
  children?: FileNode[];
  metadata?: {
    lineCount?: number;
    byteSize?: number;
    tokenCount?: number;
  };
}

export interface DocumentInfo {
  path: string;
  language: Language;
  lineCount: number;
  byteSize: number;
  tokenCount: number;
}

export interface FunctionUnit {
  id: string;               // path + name + index
  filePath: string;
  language: Language;
  name: string;
  signature: string;        // full method signature
  code: string;             // complete function body
  startLine: number;
  endLine: number;
  enclosingClass?: string;
}

export interface RagChunk {
  id: string;
  text: string;
  metadata: {
    docPath: string;
    language: Language;
    sectionTitle: string;
    indexInSection: number;
    tokenCount: number;
  };
}

export interface RagHit {
  chunk: RagChunk;
  score: number;
}

export interface FunctionDocResult {
  fnId: string;
  filePath: string;
  name: string;
  documentation: string;    // enriched markdown
  plantUml?: string;         // PlantUML source
  markdownPath?: string;     // relative path to .md
  plantUmlPath?: string;     // relative path to .puml
  diagramImagePath?: string; // relative path to .png
}

export interface AnalysisResult {
  status: 'success' | 'error';
  analysisId: string;        // UUID
  markdown: string;
  pdfUrl: string;
  diagrams: Array<{
    name: string;
    url: string;
    type: 'class' | 'package' | 'sequence';
  }>;
  metadata: {
    projectName: string;
    totalClasses: number;
    totalMethods: number;
    totalPackages: number;
    fileCount: number;
    processingTimeMs: number;
  };
  executionTimestamp: string; // ISO 8601
}
```

### 3.2 AI Tool Call Schema

```typescript
interface ToolCallResponse {
  tool_call_id: string;
  name: string;              // 'grep_java_methods', 'extract_classes', etc.
  input: {
    pattern?: string;
    path?: string;
    [key: string]: any;
  };
  output: {
    classes?: ClassInfo[];
    methods?: MethodInfo[];
    packages?: PackageInfo[];
    dependencies?: DependencyInfo[];
  };
}

interface ClassInfo {
  name: string;
  package: string;
  methods: MethodInfo[];
  fields: FieldInfo[];
  superclass?: string;
  interfaces: string[];
  visibility: 'public' | 'protected' | 'private';
  annotations?: string[];
}

interface MethodInfo {
  name: string;
  signature: string;
  returnType: string;
  parameters: ParameterInfo[];
  visibility: 'public' | 'protected' | 'private';
  isStatic: boolean;
  isAbstract: boolean;
}

interface ParameterInfo {
  name: string;
  type: string;
}

interface FieldInfo {
  name: string;
  type: string;
  visibility: 'public' | 'protected' | 'private';
  isStatic: boolean;
}

interface PackageInfo {
  name: string;
  classes: string[];
  subpackages?: string[];
}

interface DependencyInfo {
  from: string;              // class name
  to: string;                // class name
  type: 'extends' | 'implements' | 'uses' | 'returns';
}
```

---

## 4. Token Management & LLM Constraints

### 4.1 Token Budget Strategy

**Total Context Window**: ~5000 tokens per LMStudio call

**Budget Allocation**:
- System prompt: ~400 tokens
- Reserved for output: ~800 tokens
- Available for input: ~3800 tokens

**Input Token Distribution**:
- Function code: 2300 tokens max (truncate if needed)
- RAG context chunks: 1500 tokens remaining
- Prompt instructions: 0 (included in system)

### 4.2 Token Counting Implementation

```typescript
import { encode } from "gpt-tokenizer";

function countTokens(text: string): number {
  return encode(text).length;
}

// Build token-budgeted prompt
function buildFunctionDocPrompt(
  fn: FunctionUnit,
  ragHits: RagHit[]
): { system: string; user: string } {
  const FN_BUDGET = 2300;
  const RAG_BUDGET = 1500;
  
  // Truncate function code
  let fnCode = fn.code;
  while (countTokens(fnCode) > FN_BUDGET) {
    fnCode = fnCode.slice(0, -100);
  }
  
  // Add RAG chunks until budget exhausted
  let ragText = '';
  let ragTokens = 0;
  for (const hit of ragHits) {
    const chunkTokens = countTokens(hit.chunk.text);
    if (ragTokens + chunkTokens > RAG_BUDGET) break;
    ragText += '\n' + hit.chunk.text;
    ragTokens += chunkTokens;
  }
  
  const system = `You are a code documentation expert...`;
  const user = `Generate documentation for:\n${fnCode}\n\nContext:\n${ragText}`;
  
  // Final validation
  const totalTokens = countTokens(system) + countTokens(user) + 800;
  if (totalTokens > 5000) {
    console.warn(`Token budget exceeded: ${totalTokens} > 5000`);
  }
  
  return { system, user };
}
```

### 4.3 Stateless LLM Calls

Each call to LMStudio is **completely independent**:
- Fresh context (no chat history)
- No context accumulation between calls
- Messages array always: `[{role: 'system', ...}, {role: 'user', ...}]`
- Temperature: 0.2 (low randomness for consistency)
- Max tokens: 800 per call

---

## 5. External Tool Integration

### 5.1 PlantUML Integration

**Execution**:
```bash
java -jar plantuml.jar -tpng /diagrams/*.puml
```

**Input Format**: `.puml` files in `/diagrams/`
**Output Format**: `.png` files in `/diagrams/`
**Error Handling**: 
- Log PlantUML stderr
- Use placeholder PNG if rendering fails
- Continue processing

### 5.2 Pandoc PDF Conversion

**Execution**:
```bash
pandoc -f markdown -t pdf \
  --template template.tex \
  -o output.pdf input.md
```

**Input Format**: `.md` files in `/media/docs/`
**Output Format**: `.pdf` files in `/media/docs/`
**Template**: Custom LaTeX template with styling

### 5.3 Child Process Execution

```typescript
import { execFile } from 'child_process';

async function executeChildProcess(
  command: string,
  args: string[],
  options: { cwd?: string; timeout?: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = execFile(command, args, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${command} failed: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
    
    if (options.timeout) {
      setTimeout(() => process.kill(), options.timeout);
    }
  });
}
```

---

## 6. REST API Specification

### 6.1 Endpoints

**POST /api/analyze**
- Accepts: `{ projectPath: string }`
- Returns: `{ status, analysisId, markdown, pdfUrl, diagrams, metadata }`
- Error: 400 (validation), 500 (processing)

**GET /api/history**
- Returns: `{ status, history: [{ id, projectPath, timestamp, status, ... }] }`

**GET /api/docs/:id**
- Returns: Analysis results from history
- Error: 404 if not found

---

## 7. Docker Deployment

### 7.1 Docker Compose Services

```yaml
services:
  backend:
    build: ./backend
    ports: ["3000:3000"]
    volumes:
      - ./media:/app/media
      - ./diagrams:/app/diagrams
    environment:
      - LMS_MODEL_PATH=/models/llama-3-8b-instruct
      - NODE_ENV=production
  
  frontend:
    build: ./frontend
    ports: ["8978:8978"]
    depends_on: [backend]
```

### 7.2 Volume Mapping

- `/media/docs/`: Generated Markdown and PDF files
- `/diagrams/`: PlantUML source and rendered PNG files

---

## 8. Execution Flow Summary

1. **User uploads Java project** → Frontend validates
2. **POST /api/analyze** → Backend receives projectPath
3. **File scanning** → Find all .java files, build tree
4. **IMPLEMENTER call** → Extract code structure (tool calls)
5. **Schema validation** → Ensure response quality
6. **RAG building** → Chunk files, create index
7. **EXPANDER calls** → Enrich descriptions with context
8. **PlantUML generation** → Create diagram source files
9. **PlantUML rendering** → Convert to PNG images
10. **Markdown assembly** → Build comprehensive documentation
11. **PDF conversion** → Generate downloadable PDFs
12. **History logging** → Record execution metadata
13. **Return results** → Frontend displays documentation

---

## 9. Key Design Principles

1. **Separation of Concerns**: Each service has single responsibility
2. **Stateless Processing**: No accumulated context or state between AI calls
3. **Token Discipline**: Strict budget enforcement to prevent model overload
4. **Schema Validation**: All AI outputs validated against JSON schemas
5. **Error Resilience**: Graceful degradation on external tool failures
6. **Privacy First**: All data processing happens locally
7. **Modular Architecture**: Easy to extend with new analyzers or generators
8. **Observable Processing**: Comprehensive logging and error tracking
