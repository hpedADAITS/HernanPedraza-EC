# Implementation Guide
## Automatic Documentation Generator for Java Projects

---

## 1. Project Setup & Environment

### 1.1 Prerequisites
- **Node.js**: v18.0.0 or higher
- **Docker**: Latest version with Docker Compose
- **LMStudio**: Locally installed with OpenAI-compatible API running on `localhost:1234`
- **Java**: For PlantUML (jar execution)
- **Pandoc**: For PDF conversion

### 1.2 Environment Variables

Create `.env` file in project root:

```bash
# Backend
NODE_ENV=production
PORT=3000
LMS_MODEL_PATH=/models/llama-3-8b-instruct
LMS_API_URL=http://localhost:1234/v1/chat/completions
MAX_PROJECT_SIZE_MB=50
MAX_TOKENS_PER_REQUEST=5000

# Frontend
VITE_API_BASE_URL=http://localhost:3000

# Docker
COMPOSE_PROJECT_NAME=java-doc-generator
```

### 1.3 Directory Structure Setup

```bash
mkdir -p backend/{controllers,services,analyzers,utils,config}
mkdir -p frontend/{components,hooks,utils,styles}
mkdir -p media/{docs,logs}
mkdir -p diagrams
touch backend/server.ts
touch frontend/App.tsx
```

---

## 2. Backend Implementation

### 2.1 TypeScript/Node.js Configuration

**Technology Stack**:
- **Runtime**: Node.js 18.0.0 (LTS)
- **Language**: TypeScript 5.1.6
- **Runtime Environment**: ts-node (development) / compiled Node.js (production)
- **Package Manager**: npm 9.x
- **Build Tool**: TypeScript Compiler (tsc)

All backend code is written in **TypeScript** with strict type checking enabled.

### 2.1 Core Dependencies (package.json)

```json
{
  "name": "java-doc-generator-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node --esm src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.4.0",
    "gpt-tokenizer": "^2.1.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.1.6",
    "ts-node": "^10.9.1",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1"
  }
}
```

### 2.2 TypeScript Project Structure

```
backend/
├── src/
│   ├── server.ts                    # Express server entry point
│   ├── types.ts                     # Shared TypeScript types & interfaces
│   ├── config/
│   │   └── environment.ts           # Environment configuration
│   ├── controllers/
│   │   └── analyzeController.ts     # Route handlers
│   ├── services/
│   │   ├── aiService.ts             # LMStudio orchestration
│   │   ├── javaParser.ts            # Java code parsing
│   │   ├── fileTreeAnalyzer.ts      # File structure analysis
│   │   ├── plantUmlGenerator.ts     # Diagram generation
│   │   ├── markdownBuilder.ts       # Documentation assembly
│   │   └── pdfConverter.ts          # PDF generation
│   ├── analyzers/
│   │   └── javaAnalyzer.ts          # Java-specific analysis
│   ├── utils/
│   │   ├── childProcessExecutor.ts  # External process execution
│   │   ├── schemaValidator.ts       # JSON schema validation
│   │   └── tokenizer.ts             # Token counting utility
│   └── middleware/
│       ├── errorHandler.ts          # Global error handling
│       └── corsHandler.ts           # CORS configuration
├── dist/                            # Compiled JavaScript output
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies
└── Dockerfile
```

### 2.2 Core Service Patterns

#### JavaParser Service (src/services/javaAnalyzer.ts)

**Purpose**: Extract class, method, and field information from Java files

**Key Functions**:
```typescript
// Extract all classes from Java file
extractClasses(content: string, filePath: string): JavaClass[]

// Extract methods from class definition
extractMethods(classBody: string, className: string): JavaMethod[]

// Parse method signature
parseMethodSignature(methodDef: string): MethodSignature

// Extract annotations and modifiers
parseModifiers(line: string): { visibility, isStatic, isAbstract, ... }
```

**Implementation Approach**:
- Use regex patterns for robust extraction
- Handle nested classes and inner classes
- Preserve parameter types and generics
- Extract JavaDoc comments for initial descriptions
- Track line numbers for reference

**Example Patterns**:
```regex
# Class definition
(?:public|private|protected)?\s+(?:abstract)?\s+class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?

# Method definition
(?:public|private|protected|static)+\s+(?:\w+[\[\]]*)\s+(\w+)\s*\((.*?)\)

# Field definition
(?:public|private|protected|static)\s+(?:final)?\s+(\w+(?:\[\])*)\s+(\w+)
```

#### FileTreeAnalyzer Service

**Purpose**: Build hierarchical file structure and extract metadata

**Key Functions**:
```typescript
// Recursively build file tree
buildFileTree(rootDir: string, extensions: string[]): FileNode

// Calculate tokens for file
calculateTokens(content: string): number

// Extract package hierarchy
extractPackages(files: DocumentInfo[]): PackageInfo[]

// Build dependency graph
buildDependencyGraph(classes: JavaClass[]): DependencyMap
```

**Token Counting Implementation**:
```typescript
import { encode } from 'gpt-tokenizer';

function countTokens(text: string): number {
  return encode(text).length;
}

// For each file
const content = readFileSync(filePath, 'utf-8');
const tokenCount = countTokens(content);
const documentInfo: DocumentInfo = {
  path: filePath,
  language: 'java',
  lineCount: content.split('\n').length,
  byteSize: Buffer.byteLength(content),
  tokenCount
};
```

#### AIService Service

**Purpose**: Orchestrate LMStudio API calls with token budgeting

**Key Functions**:
```typescript
// Call IMPLEMENTER model for code analysis
callImplementer(prompt: string, maxTokens?: number): Promise<ToolCallResponse>

// Call EXPANDER model for text enrichment
callExpander(prompt: string, context?: string): Promise<string>

// Build token-budgeted prompt
buildBudgetedPrompt(
  code: string,
  ragChunks: RagChunk[],
  instructions: string
): { system: string; user: string }

// Validate LMStudio response
validateToolCall(response: unknown): ToolCallResponse
```

**Prompt Construction**:
```typescript
function buildBudgetedPrompt(
  functionCode: string,
  ragHits: RagHit[],
  instructions: string
): BuiltPrompt {
  // Constants
  const TOTAL_BUDGET = 5000;
  const SYSTEM_TOKENS = 400;
  const OUTPUT_TOKENS = 800;
  const FN_BUDGET = 2300;
  const RAG_BUDGET = 1500;
  
  // Truncate function code
  let fnCode = functionCode;
  while (countTokens(fnCode) > FN_BUDGET && fnCode.length > 100) {
    fnCode = fnCode.slice(0, -100) + '...';
  }
  
  // Add RAG chunks
  let ragText = '';
  let ragTokens = 0;
  for (const hit of ragHits.sort((a, b) => b.score - a.score)) {
    const chunkText = hit.chunk.text;
    const chunkTokens = countTokens(chunkText);
    if (ragTokens + chunkTokens > RAG_BUDGET) break;
    ragText += '\n---\n' + chunkText;
    ragTokens += chunkTokens;
  }
  
  const system = `You are an expert Java code analyzer...`;
  const user = `${instructions}\n\nFunction:\n${fnCode}\n\nContext:\n${ragText}`;
  
  // Validate total
  const totalTokens = countTokens(system) + countTokens(user) + OUTPUT_TOKENS;
  if (totalTokens > TOTAL_BUDGET) {
    throw new Error(`Token budget exceeded: ${totalTokens} > ${TOTAL_BUDGET}`);
  }
  
  return { system, user };
}
```

**LMStudio API Call**:
```typescript
async function callLmStudio(prompt: BuiltPrompt): Promise<string> {
  const response = await axios.post(
    process.env.LMS_API_URL,
    {
      model: process.env.LMS_MODEL_PATH,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      max_tokens: 800,
      temperature: 0.2,
      top_p: 0.9
    },
    { timeout: 120000 } // 2 minute timeout
  );
  
  if (!response.data.choices?.[0]?.message?.content) {
    throw new Error('Invalid LMStudio response structure');
  }
  
  return response.data.choices[0].message.content;
}
```

#### PlantUML Generator Service

**Purpose**: Generate and render UML diagrams from class structures

**Key Functions**:
```typescript
// Generate PlantUML for class
generateClassDiagram(classInfo: JavaClass): string

// Generate package diagram
generatePackageDiagram(packages: PackageInfo[]): string

// Generate sequence diagram
generateSequenceDiagram(method: JavaMethod, context: JavaClass[]): string

// Render all .puml files to PNG
renderDiagrams(diagramDir: string): Promise<void>
```

**PlantUML Generation Example**:
```typescript
function generateClassDiagram(classInfo: JavaClass): string {
  let puml = '@startuml\n';
  puml += `class ${classInfo.name}${classInfo.superclass ? ` extends ${classInfo.superclass}` : ''} {\n`;
  
  // Add fields
  for (const field of classInfo.fields) {
    const visibility = field.visibility[0].toUpperCase();
    puml += `  ${visibility} ${field.type} ${field.name}\n`;
  }
  
  // Add methods
  for (const method of classInfo.methods) {
    const visibility = method.visibility[0].toUpperCase();
    const params = method.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
    puml += `  ${visibility} ${method.returnType} ${method.name}(${params})\n`;
  }
  
  puml += '}\n';
  
  // Add relationships
  if (classInfo.superclass) {
    puml += `${classInfo.superclass} <|-- ${classInfo.name}\n`;
  }
  for (const iface of classInfo.interfaces) {
    puml += `${iface} <|.. ${classInfo.name}\n`;
  }
  
  puml += '@enduml\n';
  return puml;
}
```

**Rendering**:
```typescript
async function renderDiagrams(diagramDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(
      'java',
      ['-jar', 'plantuml.jar', '-tpng', `${diagramDir}/*.puml`],
      { cwd: diagramDir },
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
}
```

#### Markdown Builder Service

**Purpose**: Assemble final Markdown documentation

**Key Functions**:
```typescript
// Build master index.md
buildIndex(packages: PackageInfo[]): string

// Build package documentation
buildPackageDocs(pkg: PackageInfo, classes: JavaClass[]): string

// Build class documentation
buildClassDocs(classInfo: JavaClass, description: string): string

// Build method documentation
buildMethodDocs(method: JavaMethod, docString: string): string
```

**Example Structure**:
```typescript
function buildClassDocs(classInfo: JavaClass, description: string): string {
  let md = `# Class: ${classInfo.name}\n\n`;
  md += `**Package**: \`${classInfo.package}\`\n\n`;
  md += `**Description**: ${description}\n\n`;
  
  if (classInfo.superclass) {
    md += `**Extends**: \`${classInfo.superclass}\`\n\n`;
  }
  
  if (classInfo.interfaces.length > 0) {
    md += `**Implements**: ${classInfo.interfaces.map(i => `\`${i}\``).join(', ')}\n\n`;
  }
  
  // Fields section
  if (classInfo.fields.length > 0) {
    md += `## Fields\n\n`;
    for (const field of classInfo.fields) {
      md += `- \`${field.type} ${field.name}\` (${field.visibility})\n`;
    }
    md += '\n';
  }
  
  // Methods section
  if (classInfo.methods.length > 0) {
    md += `## Methods\n\n`;
    for (const method of classInfo.methods) {
      const params = method.parameters.map(p => `${p.type} ${p.name}`).join(', ');
      md += `### ${method.name}(${params})\n`;
      md += `- **Returns**: \`${method.returnType}\`\n`;
      md += `- **Visibility**: ${method.visibility}\n`;
      md += '\n';
    }
  }
  
  return md;
}
```

#### PDFConverter Service

**Purpose**: Convert Markdown to PDF using Pandoc

**Key Functions**:
```typescript
// Convert single markdown file to PDF
convertMarkdownToPdf(
  inputPath: string,
  outputPath: string,
  templatePath?: string
): Promise<void>

// Batch convert all markdown files
convertAllMarkdowns(docsDir: string): Promise<string[]>
```

**Implementation**:
```typescript
async function convertMarkdownToPdf(
  inputPath: string,
  outputPath: string,
  templatePath?: string
): Promise<void> {
  const args = [
    '-f', 'markdown',
    '-t', 'pdf',
    inputPath,
    '-o', outputPath
  ];
  
  if (templatePath) {
    args.push('--template', templatePath);
  }
  
  return new Promise((resolve, reject) => {
    execFile('pandoc', args, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}
```

---

### 2.3 Controller Implementation

**analyzeController.ts** - Main orchestration

```typescript
async function handleAnalyzeRequest(req: Request, res: Response) {
  const { projectPath } = req.body;
  const analysisId = uuidv4();
  const startTime = Date.now();
  
  try {
    // 1. Validate input
    const validation = await validateProject(projectPath);
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid project path',
        details: validation.errors
      });
    }
    
    // 2. Extract file tree
    const fileTree = await buildFileTree(projectPath, ['.java']);
    const javaFiles = collectJavaFiles(fileTree);
    
    // 3. Parse all Java files
    const allClasses: JavaClass[] = [];
    for (const file of javaFiles) {
      const content = readFileSync(file.path, 'utf-8');
      const classes = parseJavaFile(content, file.path);
      allClasses.push(...classes);
    }
    
    // 4. Build RAG index
    const ragIndex = await buildRagIndex(javaFiles);
    
    // 5. For each class, generate documentation
    const docResults: FunctionDocResult[] = [];
    for (const classInfo of allClasses) {
      // Query RAG for context
      const ragHits = await ragIndex.search(classInfo.name, 5);
      
      // Build prompt
      const prompt = buildBudgetedPrompt(
        classInfo.sourceCode,
        ragHits,
        'Generate detailed documentation for this Java class'
      );
      
      // Call IMPLEMENTER
      const toolCall = await callImplementer(prompt);
      const validatedCall = validateToolCall(toolCall);
      
      // Call EXPANDER for enrichment
      const enrichedDoc = await callExpander(
        prompt,
        validatedCall.output
      );
      
      // Generate diagram
      const plantUml = generateClassDiagram(classInfo);
      
      docResults.push({
        fnId: classInfo.id,
        filePath: classInfo.filePath,
        name: classInfo.name,
        documentation: enrichedDoc,
        plantUml
      });
    }
    
    // 6. Generate diagrams
    await renderDiagrams(diagramDir);
    
    // 7. Build Markdown
    const markdown = await buildFinalMarkdown(allClasses, docResults);
    
    // 8. Convert to PDF
    const pdfPath = await convertMarkdownToPdf(markdown);
    
    // 9. Log execution
    const execution = {
      id: analysisId,
      projectPath,
      projectName: path.basename(projectPath),
      timestamp: new Date().toISOString(),
      status: 'success',
      processingTimeMs: Date.now() - startTime,
      resultsUrl: `/api/docs/${analysisId}`
    };
    appendToHistory(execution);
    
    // 10. Return results
    res.json({
      status: 'success',
      analysisId,
      markdown,
      pdfUrl: `/docs/${analysisId}/output.pdf`,
      diagrams: getDiagramPaths(analysisId),
      metadata: {
        projectName: execution.projectName,
        totalClasses: allClasses.length,
        totalMethods: allClasses.reduce((sum, c) => sum + c.methods.length, 0),
        totalPackages: new Set(allClasses.map(c => c.package)).size,
        fileCount: javaFiles.length,
        processingTimeMs: execution.processingTimeMs
      },
      executionTimestamp: execution.timestamp
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      executionId: analysisId
    });
  }
}
```

---

## 3. Frontend Implementation

### 3.1 React + TypeScript Configuration

**Technology Stack**:
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.1.6
- **Build Tool**: Vite 4.4.5
- **Styling**: TailwindCSS 3.3.2
- **Markdown**: react-markdown 8.0.7
- **HTTP Client**: axios 1.4.0
- **Node.js**: 18.0.0 (build & dev)

All frontend code is written in **TypeScript** with React functional components and hooks.

### 3.2 Frontend Project Structure

```
frontend/
├── src/
│   ├── main.tsx                     # React entry point
│   ├── App.tsx                      # Root component
│   ├── types.ts                     # Shared TypeScript types
│   ├── components/
│   │   ├── ProjectSelector.tsx      # File/directory selection
│   │   ├── GenerateButton.tsx       # Analysis trigger
│   │   ├── ResultsView.tsx          # Results display
│   │   ├── HistoryView.tsx          # Execution history
│   │   ├── LoadingState.tsx         # Loading indicators
│   │   └── DocViewer.tsx            # Markdown/PDF viewer
│   ├── hooks/
│   │   ├── useAnalysis.ts           # Analysis state hook
│   │   ├── useHistory.ts            # History management hook
│   │   └── useApi.ts                # API communication hook
│   ├── utils/
│   │   ├── api.ts                   # API client setup
│   │   └── validators.ts            # Form validation
│   ├── styles/
│   │   └── index.css                # Tailwind + custom CSS
│   └── vite-env.d.ts                # Vite type definitions
├── dist/                            # Built output
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
├── package.json                     # Dependencies
└── Dockerfile
```

### 3.1 Core Dependencies (package.json)

```json
{
  "name": "java-doc-generator-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^8.0.7",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "vite": "^4.4.5",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.1.6",
    "tailwindcss": "^3.3.2"
  }
}
```

### 3.2 Component Implementation Patterns

#### App.tsx - Root Component

```typescript
export default function App() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<ExecutionHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'results'>('generate');
  
  useEffect(() => {
    fetchHistory();
  }, []);
  
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/history');
      setHistory(res.data.history);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };
  
  const handleGenerateClick = async () => {
    if (!selectedProject) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      const res = await axios.post('/api/analyze', {
        projectPath: selectedProject
      });
      setResults(res.data);
      setActiveTab('results');
      await fetchHistory();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 p-4">
        <h1 className="text-3xl font-bold">Java Documentation Generator</h1>
      </header>
      
      <div className="flex">
        <nav className="w-48 bg-gray-800 p-4 border-r border-gray-700">
          <button
            onClick={() => setActiveTab('generate')}
            className={`block w-full text-left p-2 rounded ${activeTab === 'generate' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Generate
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`block w-full text-left p-2 rounded ${activeTab === 'history' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            History
          </button>
          {results && (
            <button
              onClick={() => setActiveTab('results')}
              className={`block w-full text-left p-2 rounded ${activeTab === 'results' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              Results
            </button>
          )}
        </nav>
        
        <main className="flex-1 p-6">
          {activeTab === 'generate' && (
            <ProjectGeneratorView
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              isGenerating={isGenerating}
              onGenerate={handleGenerateClick}
              error={error}
            />
          )}
          {activeTab === 'history' && (
            <HistoryView history={history} />
          )}
          {activeTab === 'results' && results && (
            <ResultsView results={results} />
          )}
        </main>
      </div>
    </div>
  );
}
```

---

## 4. Docker Setup

### 4.1 Dockerfile - Backend

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
RUN apk add --no-cache openjdk17-jre pandoc

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY plantuml.jar ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### 4.2 Dockerfile - Frontend

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8978

CMD ["nginx", "-g", "daemon off;"]
```

### 4.3 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    volumes:
      - ./media:/app/media
      - ./diagrams:/app/diagrams
    environment:
      - NODE_ENV=production
      - LMS_MODEL_PATH=/models/llama-3-8b-instruct
      - LMS_API_URL=http://host.docker.internal:1234/v1/chat/completions
    networks:
      - app-network

  frontend:
    build: ./frontend
    ports:
      - "8978:8978"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

---

## 5. Testing Strategy

### 5.1 Unit Tests

- **Token counting**: Verify gpt-tokenizer accuracy
- **Prompt building**: Ensure token budgets are respected
- **Regex patterns**: Test Java class/method extraction
- **Schema validation**: Verify tool call response validation

### 5.2 Integration Tests

- **File tree building**: Test recursive directory scanning
- **RAG indexing**: Verify chunk creation and retrieval
- **LMStudio calls**: Mock API responses and validate handling
- **PDF conversion**: Test Markdown to PDF pipeline

### 5.3 End-to-End Tests

- **Full pipeline**: Upload small Java project, verify all outputs
- **Error handling**: Test invalid projects, missing files, API timeouts
- **Performance**: Measure processing time for 10-50 file projects

---

## 6. Deployment Checklist

- [ ] All environment variables configured
- [ ] LMStudio running and accessible at configured URL
- [ ] PlantUML and Pandoc installed in Docker image
- [ ] Docker Compose builds successfully
- [ ] Services start without errors
- [ ] Frontend can reach backend API
- [ ] Backend can reach LMStudio
- [ ] Test analysis runs to completion
- [ ] Artifacts generated in `/media/docs/` and `/diagrams/`
- [ ] Frontend displays results correctly
- [ ] PDF download works
- [ ] History is persisted across restarts

---

## 7. Troubleshooting

| Issue | Solution |
|-------|----------|
| LMStudio connection refused | Ensure LMStudio is running on `localhost:1234` |
| PlantUML rendering fails | Check Java is installed and `plantuml.jar` is accessible |
| Token budget exceeded | Reduce `FN_BUDGET` or increase `maxTokensPerChunk` |
| Out of memory | Increase Docker memory limits in compose file |
| Frontend can't reach backend | Check CORS settings and port mappings |

