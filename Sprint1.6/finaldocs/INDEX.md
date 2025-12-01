# Technical Specification Index
## Automatic Documentation Generator for Java Projects

---

## 📑 Document Organization

This directory contains **12 comprehensive documents** covering the complete technical specification for the Java Documentation Generator project.

### Quick Navigation

| Document | Type | Purpose | Read Time |
|----------|------|---------|-----------|
| **README.md** | Overview | Introduction and quick start | 10 min |
| **ARCHITECTURE_SPECIFICATION.md** | Specification | Complete architectural details | 45 min |
| **IMPLEMENTATION_GUIDE.md** | Guide | Step-by-step implementation | 60 min |

---

## 📊 PlantUML Diagrams (9 files)

Each diagram provides a different view of the system architecture:

### System & Architecture Views

**01-system-architecture-diagram.puml**
- Component overview
- Service relationships
- Data flow connections
- Shows all major modules (Frontend, Backend, External systems, Storage)
- **Best for**: Understanding overall structure

**06-file-structure-and-hierarchy.puml**
- Directory organization
- File locations
- Component responsibilities
- Module interactions
- **Best for**: Navigating the codebase

**07-deployment-architecture.puml**
- Docker setup
- Service networking
- Volume mappings
- Port configuration
- **Best for**: Deployment and DevOps setup

### Processing & Data Flow Views

**02-data-flow-pipeline.puml**
- End-to-end data transformation
- 9 processing stages
- Input to final output
- Data model transformations
- **Best for**: Understanding the analysis pipeline

**04-backend-workflow-process.puml**
- Detailed step-by-step backend flow
- 18-step pipeline
- Decision points
- Error handling paths
- **Best for**: Implementation details

**09-database-schema.puml**
- Data models
- In-memory structures
- Persistence schemas
- Relationships and constraints
- **Best for**: Understanding data structures

### Interaction & Interface Views

**03-ai-interaction-sequence.puml**
- AI model interaction sequence
- IMPLEMENTER vs EXPANDER
- Schema validation flow
- Message passing
- **Best for**: AI integration details

**05-frontend-state-flow.puml**
- React component states
- User interaction flows
- State transitions
- Error recovery
- **Best for**: Frontend development

**08-api-endpoint-schema.puml**
- REST API endpoints
- Request/response schemas
- Data contracts
- Validation rules
- **Best for**: API specification

---

## 📖 Technical Documentation

### ARCHITECTURE_SPECIFICATION.md (9 Sections)

**Section 1: System Overview**
- Project objective and vision
- Core constraints (VRAM, context window, privacy)
- Design decision rationale
- Architecture patterns used
- **Key concepts**: Token discipline, stateless processing, privacy-first

**Section 2: Component Architecture**
- Frontend Layer (React + TailwindCSS)
  - Components: ProjectSelector, GenerateButton, ResultsView, HistoryView, LoadingState
  - State management patterns
  - Event handling and effects
  
- Backend Layer (Node.js + Express)
  - Service-oriented architecture
  - 6 core services with responsibilities
  - Analysis pipeline (9 stages)
  
- Data flow through pipeline

**Section 3: Data Structures & Type System**
- Core TypeScript types and interfaces
- DocumentInfo, FileNode, FunctionUnit
- RagChunk, RagHit for context retrieval
- AnalysisResult response structure
- AI Tool Call Schema

**Section 4: Token Management & LLM Constraints**
- Token budget strategy
  - 5000 token total context
  - 400 for system, 800 for output, 3800 for input
  - 2300 for code, 1500 for RAG context
- Implementation using gpt-tokenizer
- Automatic truncation strategy
- Stateless call pattern

**Section 5: External Tool Integration**
- PlantUML: Diagram generation and rendering
- Pandoc: Markdown to PDF conversion
- Child process execution with error handling

**Section 6: REST API Specification**
- POST /api/analyze: Submit project for analysis
- GET /api/history: Retrieve past executions
- GET /api/docs/:id: Get previous analysis results
- Request/response format details

**Section 7: Docker Deployment**
- Service configuration
- Volume mapping
- Environment variables
- Multi-stage builds

**Section 8: Execution Flow Summary**
- 13-step pipeline overview
- Key transformation points

**Section 9: Key Design Principles**
- Separation of concerns
- Token discipline
- Stateless processing
- Schema validation
- Privacy first
- Modular architecture
- Observable processing

### IMPLEMENTATION_GUIDE.md (7 Sections)

**Section 1: Project Setup & Environment**
- Prerequisites (Node.js, Docker, LMStudio, Java, Pandoc)
- Environment variable configuration
- Directory structure initialization

**Section 2: Backend Implementation**
- Core dependencies and package.json
- Service implementation patterns
  - JavaParser: Class/method extraction
  - FileTreeAnalyzer: File structure and metadata
  - AIService: LMStudio orchestration
  - PlantUmlGenerator: Diagram creation
  - MarkdownBuilder: Documentation assembly
  - PDFConverter: PDF generation
- Token budgeting implementation
- LMStudio API integration
- Controller implementation (main orchestration)

**Section 3: Frontend Implementation**
- React dependencies
- Component patterns and examples
- App.tsx structure
- State management hooks
- Event handling

**Section 4: Docker Setup**
- Backend Dockerfile with multi-stage build
- Frontend Dockerfile with nginx
- docker-compose.yml with services and volumes

**Section 5: Testing Strategy**
- Unit tests (token counting, regex, validation)
- Integration tests (file tree, RAG, LMStudio)
- End-to-end tests (full pipeline)

**Section 6: Deployment Checklist**
- 13-point verification checklist
- Pre-deployment validation steps

**Section 7: Troubleshooting**
- Common issues and solutions
- Debugging tips
- Connection verification commands

---

## 🔑 Key Design Patterns

### Pattern 1: Token-Budgeted Prompts
```
Total: 5000 tokens
├── System prompt: 400 tokens
├── Reserved for output: 800 tokens
└── Input budget: 3800 tokens
    ├── Function code: 2300 tokens (truncate if needed)
    └── RAG context: 1500 tokens (add chunks until exhausted)
```

### Pattern 2: Stateless LLM Calls
- Each call has fresh context (no chat history)
- Messages: `[{role: 'system', ...}, {role: 'user', ...}]`
- Temperature: 0.2 for consistency
- Max output: 800 tokens
- Result: Independent per-function processing

### Pattern 3: Two-Model Architecture
```
IMPLEMENTER (Extraction)
    ↓ [structured tool call response]
Schema Validation
    ↓ [validated data]
EXPANDER (Enrichment)
    ↓ [enriched markdown with descriptions]
Final Documentation
```

### Pattern 4: RAG for Context
```
Query: class name + method signatures
    ↓
Vector search (semantic similarity)
    ↓
Top-5 relevant chunks (by score)
    ↓
Token-budgeted packing (up to 1500 tokens)
    ↓
Include in prompt for context
```

### Pattern 5: Service-Oriented Backend
```
Controller (Orchestration)
    ├─ FileTreeAnalyzer (Parsing)
    ├─ JavaParser (Analysis)
    ├─ AIService (LLM calls)
    ├─ PlantUmlGenerator (Diagrams)
    ├─ MarkdownBuilder (Docs)
    └─ PDFConverter (PDF)
```

---

## 🏗️ Architecture Decisions

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| **IMPLEMENTER + EXPANDER** | Separation of concerns; independent optimization | 2x LLM calls per class |
| **RAG-based context** | Relevant project context within token budget | Extra preprocessing step |
| **Token-budgeted prompts** | Respects VRAM limits; prevents overflow | Requires careful tuning |
| **Filesystem-based storage** | Simple, reliable, fast | No built-in search/indexing |
| **Docker containerization** | Reproducible environment; easy deployment | Additional setup complexity |
| **PlantUML for diagrams** | Open-source, renders to PNG, widely used | Limited diagram types vs. commercial tools |
| **Pandoc for PDF** | Markdown-native; supports custom templates | PDF customization limited |

---

## 📊 Processing Pipeline (18 Steps)

1. Receive POST /api/analyze with projectPath
2. Validate project (exists, has .java files, < 50MB)
3. Build file tree structure
4. Execute ext-finder.js to locate all .java files
5. Parse files with JavaParser (extract classes, methods, fields)
6. Build RAG index (chunk files, create embeddings)
7. Prepare IMPLEMENTER prompt (token-budgeted)
8. Call LMStudio IMPLEMENTER (extract code structure)
9. Validate tool call response against schema
10. Extract enrichment chunks from RAG
11. Prepare EXPANDER prompt (function code + context)
12. Call LMStudio EXPANDER (enrich descriptions)
13. Build final Markdown documentation
14. Generate PlantUML diagrams
15. Render .puml to .png using PlantUML CLI
16. Convert Markdown to PDF using Pandoc
17. Log execution to history.json
18. Return results to Frontend

---

## 🎯 Implementation Phases

### Phase 1: Foundation (Days 1-3)
- [ ] Setup Node.js project structure
- [ ] Configure environment and Docker
- [ ] Implement core types and interfaces
- [ ] Create token counting utilities

### Phase 2: Parsing & Analysis (Days 4-7)
- [ ] Implement JavaParser service
- [ ] Implement FileTreeAnalyzer service
- [ ] Build RAG index system
- [ ] Test parsing on sample projects

### Phase 3: AI Integration (Days 8-11)
- [ ] Implement AIService for LMStudio calls
- [ ] Build token-budgeted prompt constructor
- [ ] Implement schema validation
- [ ] Test IMPLEMENTER and EXPANDER calls

### Phase 4: Output Generation (Days 12-14)
- [ ] Implement PlantUmlGenerator service
- [ ] Implement MarkdownBuilder service
- [ ] Implement PDFConverter service
- [ ] Test all output formats

### Phase 5: Frontend Development (Days 15-17)
- [ ] Implement React components
- [ ] Implement state management
- [ ] Implement API communication
- [ ] Style with TailwindCSS

### Phase 6: Integration & Testing (Days 18-20)
- [ ] End-to-end testing
- [ ] Error handling and edge cases
- [ ] Performance optimization
- [ ] Documentation and deployment

---

## ✅ Validation Checklist

### Architecture Review
- [ ] All components have single responsibility
- [ ] All dependencies are one-directional
- [ ] All data flows are clear and documented
- [ ] All error handling paths are defined

### Type Safety
- [ ] All TypeScript interfaces are complete
- [ ] All API responses have types
- [ ] All configuration values are typed
- [ ] No `any` types without justification

### Token Management
- [ ] Total budget never exceeds 5000 tokens
- [ ] System prompt under 400 tokens
- [ ] Code truncation works correctly
- [ ] RAG chunks are properly counted

### Schema Validation
- [ ] All AI responses validated
- [ ] Schema matches actual data
- [ ] Error messages are helpful
- [ ] Validation doesn't cause bottlenecks

### Error Handling
- [ ] All external calls wrapped in try-catch
- [ ] All errors logged with context
- [ ] User-friendly error messages
- [ ] Graceful degradation on failures

---

## 🚀 Deployment Steps

1. **Setup LMStudio**
   - Install LMStudio
   - Load desired model
   - Verify API accessible at localhost:1234

2. **Install Prerequisites**
   - Node.js 18+
   - Java (for PlantUML)
   - Pandoc
   - Docker & Docker Compose

3. **Build & Deploy**
   ```bash
   docker-compose up --build
   ```

4. **Verify Services**
   - Frontend: http://localhost:8978
   - Backend: http://localhost:3000
   - Check /health endpoint

5. **Run Test Analysis**
   - Upload small Java project
   - Verify all artifacts generated
   - Check console for errors

6. **Monitor**
   - Check logs for issues
   - Monitor memory usage
   - Track processing times

---

## 📞 Support & References

### Key Files to Reference
- `ARCHITECTURE_SPECIFICATION.md` - For architecture questions
- `IMPLEMENTATION_GUIDE.md` - For implementation details
- Diagram files - For visual reference
- API spec (section 6 of ARCHITECTURE_SPECIFICATION.md) - For API questions

### External Documentation
- PlantUML: https://plantuml.com/
- Pandoc: https://pandoc.org/
- LMStudio: https://lmstudio.ai/
- React: https://react.dev/
- Express: https://expressjs.com/
- Docker: https://docs.docker.com/

---

## 📝 Document Maintenance

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Complete - Ready for Implementation  
**Maintainer**: Technical Team

### Version History
- 1.0.0 (Dec 2024): Initial technical specification

### Change Log
- Created 9 PlantUML diagrams
- Written ARCHITECTURE_SPECIFICATION.md (9 sections)
- Written IMPLEMENTATION_GUIDE.md (7 sections)
- Created comprehensive README.md
- Created this INDEX.md for navigation

---

## 🎓 Learning Path

**For Architects**:
1. Read README.md (overview)
2. Study 01-system-architecture-diagram.puml
3. Read Section 1 of ARCHITECTURE_SPECIFICATION.md
4. Study all other architecture diagrams

**For Developers**:
1. Read README.md
2. Read IMPLEMENTATION_GUIDE.md completely
3. Study relevant diagrams
4. Read corresponding sections of ARCHITECTURE_SPECIFICATION.md
5. Begin implementation

**For DevOps**:
1. Read Section 7 of ARCHITECTURE_SPECIFICATION.md
2. Study 07-deployment-architecture.puml
3. Review docker-compose.yml structure
4. Follow deployment steps in README.md

**For QA/Testing**:
1. Read testing section in IMPLEMENTATION_GUIDE.md
2. Study 04-backend-workflow-process.puml (decision points)
3. Review error handling in ARCHITECTURE_SPECIFICATION.md
4. Create test cases based on pipeline steps

---

**Next Steps**: Begin Phase 1 of Implementation (Foundation)
