# TypeScript Setup & Configuration Guide
## Automatic Documentation Generator for Java Projects

---

## Overview

This project is **100% TypeScript** for both backend and frontend, ensuring type safety, better developer experience, and maintainability.

---

## Backend TypeScript Setup

### tsconfig.json (Backend)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key Compiler Options**:
- `strict: true` - Enables all strict type checking options
- `noImplicitAny: true` - Error on implicit `any` types
- `strictNullChecks: true` - Null/undefined must be explicitly handled
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused function parameters
- `noImplicitReturns: true` - Every code path must return a value
- `paths` - Enable import aliases (`@/*`)

### package.json Scripts (Backend)

```json
{
  "scripts": {
    "dev": "ts-node --esm src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "watch": "tsc --watch",
    "test": "vitest",
    "test:cov": "vitest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "type-check": "tsc --noEmit"
  }
}
```

**Script Explanations**:
- `dev` - Run with ts-node (direct TypeScript execution)
- `build` - Compile to JavaScript in `dist/`
- `start` - Run compiled JavaScript
- `watch` - Watch files and recompile on changes
- `test` - Run unit tests
- `lint` - Check code style
- `type-check` - Type checking without emitting files

### ESLint Configuration (.eslintrc.json)

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-types": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "default",
        "format": ["camelCase"]
      },
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      }
    ]
  }
}
```

---

## Frontend TypeScript Setup

### tsconfig.json (Frontend)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["./components/*"],
      "@hooks/*": ["./hooks/*"],
      "@utils/*": ["./utils/*"],
      "@types/*": ["./types/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**React-Specific Options**:
- `jsx: "react-jsx"` - Modern React 18+ JSX transform
- `allowImportingTsExtensions: true` - Allow importing `.ts` files in ESM
- `noEmit: true` - Vite handles compilation
- `paths` - Multiple import aliases for organization

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### package.json Scripts (Frontend)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Shared Type Definitions

### types.ts (Both Backend & Frontend)

Place shared types in a common location or use a monorepo structure:

```typescript
// src/types.ts

/**
 * Core type system for the application
 * Used by both backend and frontend
 */

export type Language = 'java' | 'ts' | 'js' | 'py' | 'md' | 'unknown';
export type NodeKind = 'file' | 'dir';
export type AnalysisStatus = 'success' | 'error' | 'pending';

export interface FileNode {
  kind: NodeKind;
  name: string;
  path: string;
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
  id: string;
  filePath: string;
  language: Language;
  name: string;
  signature: string;
  code: string;
  startLine: number;
  endLine: number;
  enclosingClass?: string;
}

export interface AnalysisResult {
  status: AnalysisStatus;
  analysisId: string;
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
  executionTimestamp: string;
}

export interface ExecutionHistory {
  id: string;
  projectPath: string;
  projectName: string;
  timestamp: string;
  status: AnalysisStatus;
  processingTimeMs: number;
  resultsUrl: string;
  errorMessage?: string;
}

export interface ApiErrorResponse {
  status: 'error';
  error: string;
  details?: string[];
  executionId?: string;
}

export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

---

## Backend Service Types

### Service Interfaces

```typescript
// src/services/types.ts

export interface JavaClass {
  id: string;
  name: string;
  package: string;
  filePath: string;
  sourceCode: string;
  startLine: number;
  endLine: number;
  fields: FieldInfo[];
  methods: MethodInfo[];
  superclass?: string;
  interfaces: string[];
  annotations: string[];
  modifiers: ClassModifiers;
}

export interface MethodInfo {
  id: string;
  name: string;
  signature: string;
  returnType: string;
  parameters: ParameterInfo[];
  throws: string[];
  modifiers: MethodModifiers;
  startLine: number;
  endLine: number;
  code: string;
}

export interface FieldInfo {
  id: string;
  name: string;
  type: string;
  modifiers: FieldModifiers;
  initializer?: string;
  annotations?: string[];
}

export interface ClassModifiers {
  isPublic: boolean;
  isAbstract: boolean;
  isFinal: boolean;
  isStatic: boolean;
}

export interface MethodModifiers {
  visibility: 'public' | 'protected' | 'private';
  isStatic: boolean;
  isAbstract: boolean;
  isSynchronized: boolean;
}

export interface FieldModifiers {
  visibility: 'public' | 'protected' | 'private';
  isStatic: boolean;
  isFinal: boolean;
}

export interface ParameterInfo {
  name: string;
  type: string;
  annotations?: string[];
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
  documentation: string;
  plantUml?: string;
  markdownPath?: string;
  plantUmlPath?: string;
  diagramImagePath?: string;
}

export interface ToolCallResponse {
  tool_call_id: string;
  name: string;
  input: Record<string, unknown>;
  output: {
    classes?: JavaClass[];
    methods?: MethodInfo[];
    packages?: PackageInfo[];
    dependencies?: DependencyInfo[];
  };
}

export interface PackageInfo {
  name: string;
  classes: string[];
  subpackages?: string[];
}

export interface DependencyInfo {
  from: string;
  to: string;
  type: 'extends' | 'implements' | 'uses' | 'returns';
}
```

---

## Frontend Component Types

### React Component Pattern

```typescript
// src/components/ProjectSelector.tsx

import React, { FC, ChangeEvent, FormEvent } from 'react';

interface ProjectSelectorProps {
  selectedProject: string | null;
  onSelectProject: (path: string) => void;
  error?: string;
}

export const ProjectSelector: FC<ProjectSelectorProps> = ({
  selectedProject,
  onSelectProject,
  error,
}) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelectProject(file.name);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select Java Project</h2>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".java,application/zip,.tar,.gz"
        aria-label="Select Java project file or directory"
      />
      {selectedProject && (
        <p className="text-sm text-gray-400">Selected: {selectedProject}</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
```

### React Hook Pattern

```typescript
// src/hooks/useAnalysis.ts

import { useState, useCallback } from 'react';
import { AnalysisResult, AnalysisStatus } from '../types';
import { api } from '../utils/api';

interface UseAnalysisReturn {
  result: AnalysisResult | null;
  status: AnalysisStatus;
  error: string | null;
  isLoading: boolean;
  analyze: (projectPath: string) => Promise<void>;
  reset: () => void;
}

export const useAnalysis = (): UseAnalysisReturn => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('pending');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = useCallback(async (projectPath: string) => {
    setIsLoading(true);
    setError(null);
    setStatus('pending');

    try {
      const response = await api.post<AnalysisResult>('/api/analyze', {
        projectPath,
      });
      setResult(response.data);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setStatus('pending');
    setError(null);
  }, []);

  return { result, status, error, isLoading, analyze, reset };
};
```

---

## Build & Deployment

### Development Workflow

```bash
# Backend development
cd backend
npm install
npm run dev          # Run with ts-node

# Frontend development
cd frontend
npm install
npm run dev          # Vite dev server at :5173
```

### Production Build

```bash
# Backend
cd backend
npm run build        # Compile TypeScript → JavaScript
npm run start        # Run compiled JavaScript

# Frontend
cd frontend
npm run build        # Compile and bundle
# Output in dist/ ready for deployment
```

### Docker Build

Both Dockerfiles compile TypeScript before running:

```dockerfile
# Backend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build    # ← TypeScript compilation

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist  # ← Use compiled JS
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

```dockerfile
# Frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build    # ← TypeScript + Vite build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html  # ← Use compiled output
```

---

## Testing with TypeScript

### Unit Testing (Vitest)

```typescript
// src/utils/tokenizer.test.ts

import { describe, it, expect } from 'vitest';
import { countTokens } from './tokenizer';

describe('Tokenizer', () => {
  it('should count tokens accurately', () => {
    const text = 'Hello world this is a test';
    const count = countTokens(text);
    expect(count).toBeGreaterThan(0);
  });

  it('should handle empty strings', () => {
    expect(countTokens('')).toBe(0);
  });

  it('should handle unicode characters', () => {
    const text = 'Hello 世界 مرحبا';
    const count = countTokens(text);
    expect(count).toBeGreaterThan(0);
  });
});
```

### Integration Testing

```typescript
// src/services/__tests__/aiService.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AIService } from '../aiService';

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService();
  });

  it('should call IMPLEMENTER model', async () => {
    const mockResponse = {
      tool_call_id: 'test-123',
      name: 'extract_classes',
      output: { classes: [] },
    };

    vi.spyOn(aiService, 'callImplementer').mockResolvedValue(mockResponse);

    const result = await aiService.callImplementer('test prompt');
    expect(result.tool_call_id).toBe('test-123');
  });
});
```

---

## Code Quality Tools

### Pre-commit Hooks (husky)

```bash
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

### Continuous Integration

```yaml
# .github/workflows/ci.yml

name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
      - run: npm run test
```

---

## TypeScript Best Practices

1. **Use Strict Mode**: Always enable `strict: true` in tsconfig.json
2. **Explicit Types**: Avoid relying on type inference; be explicit
3. **No `any`**: Use `unknown` if uncertain, or better type it
4. **Meaningful Names**: Use descriptive variable and function names
5. **Document Complex Types**: Use JSDoc comments for complex types
6. **Error Handling**: Properly type caught errors
7. **Function Returns**: Always specify return types explicitly
8. **Async/Await**: Properly type Promise returns

---

## Development Environment Setup

### Required Tools
- Node.js 18.0.0 or higher
- npm 9.x or yarn/pnpm
- TypeScript 5.1.6 or higher
- Visual Studio Code (recommended)

### VS Code Extensions
```json
{
  "extensions": [
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode"
  ]
}
```

### VS Code Settings (.vscode/settings.json)
```json
{
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find module '@/...'` | Check `paths` in tsconfig.json |
| `Type 'X' is not assignable to type 'Y'` | Review type definitions and ensure compatibility |
| `noImplicitAny` error | Add explicit type annotations |
| `Property does not exist on type 'Object'` | Check interface definitions |
| Build fails with `tsc` | Run `npm run type-check` to see all errors |
| Vite shows stale types | Clear `node_modules/.vite` and restart |

---

## Summary

This project uses **TypeScript exclusively** for:
- **100% type safety** across backend and frontend
- **Better IDE support** with autocomplete and refactoring
- **Compile-time error detection** before runtime
- **Self-documenting code** through types
- **Maintainability** and team collaboration

All code is written in TypeScript with strict compiler options enabled.
