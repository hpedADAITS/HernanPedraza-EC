# Backend - Automatic Documentation Generator

## Overview
Node.js backend server for generating Java documentation using PlantUML diagrams, Markdown files, and PDF conversion with AI enrichment.

## Project Structure

```
backend/
├── api/                 # REST API endpoints
│   └── docsRoutes.js   # Documentation endpoints
├── services/            # Business logic services
│   └── aiService.js    # AI model integration (LMStudio)
├── generators/          # Documentation generators
│   ├── javaAnalyzer.js     # Java code parser
│   ├── plantumlGenerator.js # PlantUML diagram generation
│   └── markdownGenerator.js # Markdown documentation
├── config/              # Configuration
│   └── config.js       # Central configuration
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── index.js            # Server entry point
└── README.md           # This file
```

## Installation

1. Copy `.env.example` to `.env` and configure as needed:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Ensure LMStudio is running on `http://localhost:1234` for AI features.

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in `.env` (default: 3000).

## API Endpoints

### Health Check
- **GET** `/health` - Server status

### Documentation
- **GET** `/api/docs` - List all generated documentation (history)
- **GET** `/api/docs/:id` - Retrieve documentation (PDF or Markdown)
  - Query param: `format` (pdf or md)
- **POST** `/api/docs` - Upload Java file and generate documentation
  - Form data: `javaFile` (file), `fileName` (string)

## Key Components

### Java Analyzer (`generators/javaAnalyzer.js`)
- Parses Java source code
- Extracts classes, interfaces, methods, and fields
- Analyzes inheritance and implementation relationships

### PlantUML Generator (`generators/plantumlGenerator.js`)
- Generates UML class diagrams
- Creates `.puml` files for further processing
- Supports class relationships (inheritance, implementation)

### Markdown Generator (`generators/markdownGenerator.js`)
- Generates comprehensive Markdown documentation
- Includes table of contents, class diagrams, method signatures
- Integrates AI-enriched descriptions

### AI Service (`services/aiService.js`)
- Integrates with LMStudio local model
- Generates enriched technical descriptions
- Supports class summaries and code analysis

## Configuration

Key configuration options in `config/config.js`:

- `port` - Server port
- `aiModelUrl` - LMStudio endpoint
- `aiModelName` - Model name to use
- `maxFileSize` - Maximum upload size
- `uploadDir` - Temporary upload directory
- `outputDir` - Generated files directory

## Environment Variables

```env
PORT=3000
NODE_ENV=development
AI_MODEL_URL=http://localhost:1234/v1
AI_MODEL_NAME=local-model
FRONTEND_URL=http://localhost:8978
MAX_FILE_SIZE=52428800
LOG_LEVEL=info
```

## TODO / Future Implementation

- [ ] Implement PDF generation from Markdown
- [ ] Add database integration for result persistence
- [ ] Implement async job queue for large files
- [ ] Add authentication and authorization
- [ ] Error handling and validation improvements
- [ ] Unit tests
- [ ] API documentation (Swagger/OpenAPI)

## Technologies Used

- **Express.js** - Web framework
- **Multer** - File upload handling
- **Axios** - HTTP client for AI service
- **UUID** - Unique ID generation
- **Dotenv** - Environment variable management

## Notes

- The AI enrichment feature requires LMStudio running locally
- Files are stored in `backend/uploads/` temporarily
- Generated documentation is stored in `backend/outputs/`
- CORS is enabled for frontend communication
