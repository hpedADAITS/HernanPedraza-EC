# Pila Tecnológica

Referencia completa de todas las tecnologías, frameworks y dependencias utilizadas en el Generador Automático de Documentación.

---

## Descripción General de la Pila

| Capa | Tecnología | Versión | Propósito |
|-----|-----------|---------|----------|
| **Runtime del Backend** | Node.js | 18+ | Runtime de JavaScript/TypeScript |
| **Framework del Backend** | Express | ^4.18.0 | Servidor de API REST |
| **Lenguaje del Backend** | TypeScript | ^5.1.6 | Código backend type-safe |
| **Framework del Frontend** | React | ^18.2.0 | Librería de componentes UI |
| **Lenguaje del Frontend** | TypeScript | ^5.1.6 | Código frontend type-safe |
| **Estilo del Frontend** | TailwindCSS | ^3.3.2 | CSS utility-first |
| **Integración de IA** | LMStudio | latest | Inferencia de LLM local |
| **Generación de Diagramas** | PlantUML | latest | Renderización de diagramas UML |
| **Generación de PDF** | Pandoc | latest | Conversión de Markdown a PDF |
| **Contenedorización** | Docker | latest | Orquestación de contenedores |

---

## Dependencias del Frontend

### Dependencias de Producción

| Paquete | Versión | Propósito |
|---------|---------|----------|
| `react` | ^18.2.0 | Framework de UI central para componentes y renderización |
| `react-dom` | ^18.2.0 | Bindings de React DOM para navegador |
| `react-markdown` | ^8.0.7 | Renderización de documentación Markdown generada |
| `axios` | ^1.4.0 | Cliente HTTP para solicitudes de API al backend |

### Dependencias de Desarrollo

| Paquete | Versión | Propósito |
|---------|---------|----------|
| `typescript` | ^5.1.6 | Lenguaje type-safe para desarrollo |
| `vite` | ^4.4.5 | Herramienta de construcción rápida y servidor de desarrollo |
| `@vitejs/plugin-react` | ^4.0.3 | Soporte de React para Vite |
| `tailwindcss` | ^3.3.2 | Framework CSS utility-first |
| `@tailwindcss/forms` | ^0.5.3 | Componentes de formulario pre-estilos |
| `@types/react` | ^18.2.0 | Definiciones de tipos de TypeScript para React |
| `@types/react-dom` | ^18.2.0 | Definiciones de tipos de TypeScript para React DOM |
| `eslint` | ^8.42.0 | Linting y control de calidad de código |
| `@typescript-eslint/parser` | ^6.0.0 | Soporte de TypeScript para ESLint |
| `@typescript-eslint/eslint-plugin` | ^6.0.0 | Reglas de linting específicas de TypeScript |
| `vitest` | ^0.34.4 | Framework de pruebas unitarias |
| `postcss` | ^8.4.25 | Pipeline de procesamiento CSS para Tailwind |
| `autoprefixer` | ^10.4.14 | Agregar prefijos de proveedor a CSS automáticamente |

---

## Dependencias del Backend

### Dependencias de Producción

| Paquete | Versión | Propósito |
|---------|---------|----------|
| `express` | ^4.18.0 | Framework de servidor de API REST |
| `typescript` | ^5.1.6 | Lenguaje type-safe para backend |
| `@lmstudio/sdk` | latest | SDK de LMStudio para integración local de LLM |
| `axios` | ^1.4.0 | Cliente HTTP para APIs externas |
| `uuid` | ^9.0.0 | Generar IDs únicos de análisis |
| `gpt-tokenizer` | ^2.1.0 | Conteo de tokens para seguimiento de presupuesto |

### Dependencias de Desarrollo

| Paquete | Versión | Propósito |
|---------|---------|----------|
| `ts-node` | ^10.9.0 | Ejecutar TypeScript directamente sin compilar |
| `nodemon` | ^3.0.0 | Reinicio automático del servidor al cambiar archivos |
| `@types/node` | ^20.0.0 | Definiciones de tipos de TypeScript para Node.js |
| `@types/express` | ^4.17.0 | Definiciones de tipos de TypeScript para Express |
| `eslint` | ^8.42.0 | Linting y control de calidad de código |
| `@typescript-eslint/parser` | ^6.0.0 | Soporte de TypeScript para ESLint |
| `@typescript-eslint/eslint-plugin` | ^6.0.0 | Reglas de linting específicas de TypeScript |
| `vitest` | ^0.34.4 | Framework de pruebas unitarias |

---

## Integración del SDK de LMStudio

### Instalación

```bash
npm install @lmstudio/sdk --save
```

### Características Clave

- Cargar y descargar modelos programáticamente
- Llamar a modelos IMPLEMENTER y EXPANDER para análisis de código
- Generar embeddings para índice RAG (Retrieval-Augmented Generation)
- Ejecución completamente local (sin llamadas en la nube)
- Estructura de API compatible con OpenAI

### Instalación y Configuración

1. **Instalar SDK de LMStudio**:
   ```bash
   npm install @lmstudio/sdk
   ```

2. **Inicializar Cliente**:
   ```typescript
   import { LMStudioClient } from "@lmstudio/sdk";

   const client = new LMStudioClient();
   ```

3. **Listar Modelos Descargados**:
   ```typescript
   const models = await client.system.listDownloadedModels();
   console.log(models);
   ```

4. **Cargar Modelo**:
   ```typescript
   const model = await client.llm.model("qwen/qwen3-4b-2507");
   ```

5. **Llamar al Modelo**:
   ```typescript
   const result = await model.respond("Analizar esta clase Java...");
   console.log(result.content);
   ```

### Configuración del Endpoint de API

```typescript
// Endpoint predeterminado (localhost)
const client = new LMStudioClient({
  baseURL: "http://localhost:1234",
});

// Endpoint personalizado (para despliegue con Docker)
const client = new LMStudioClient({
  baseURL: "http://lmstudio:1234",
});
```

Para documentación completa, visite [lmstudio-js en GitHub](https://github.com/lmstudio-ai/lmstudio-js).

---

## Integración de Herramientas Externas

### PlantUML

**Propósito**: Generar diagramas UML

**Instalación**:
```bash
# Mac
brew install plantuml

# Linux
sudo apt-get install plantuml

# Windows
choco install plantuml
```

**Verificación**:
```bash
java -jar plantuml.jar -version
```

**Uso**:
```bash
java -jar plantuml.jar -tpng entrada.puml -o salida/
```

### Pandoc

**Propósito**: Convertir Markdown a PDF

**Instalación**:
```bash
# Mac
brew install pandoc

# Linux
sudo apt-get install pandoc

# Windows
choco install pandoc
```

**Verificación**:
```bash
pandoc --version
```

**Uso**:
```bash
pandoc entrada.md \
  --from markdown \
  --to pdf \
  --variable mainfont="DejaVu Sans" \
  -o salida.pdf
```

### Git (para Clonación de Repositorios)

**Propósito**: Clonar repositorios de GitHub

**Instalación**:
```bash
# Mac
brew install git

# Linux
sudo apt-get install git

# Windows
choco install git
```

**Verificación**:
```bash
git --version
```

**Uso**:
```typescript
// Clonación superficial (más rápida, menos ancho de banda)
execSync('git clone --depth 1 https://github.com/user/repo.git');
```

---

## Librerías de Soporte

### Conteo de Tokens

**Paquete**: `gpt-tokenizer`

```typescript
import { encoding_for_model } from "js-tiktoken";

const enc = encoding_for_model("gpt-3.5-turbo");

function countTokens(text: string): number {
  return enc.encode(text).length;
}
```

### Cliente HTTP

**Paquete**: `axios`

```typescript
import axios from "axios";

const response = await axios.post("http://api.ejemplo.com/endpoint", {
  data: "valor"
});
```

### Generación de IDs

**Paquete**: `uuid`

```typescript
import { v4 as uuidv4 } from "uuid";

const analysisId = uuidv4();
```

### Ejecución de Procesos Secundarios

**Incorporado**: Node.js `child_process`

```typescript
import { execSync } from "child_process";

const output = execSync("comando a ejecutar");
```

---

## Docker y Contenedorización

### Configuración de Docker

**Dockerfile (Backend)**:
- Base: `node:18-alpine`
- Construcción: Compilación de TypeScript multi-etapa
- Ejecución: `npm start` (producción)

**Dockerfile (Frontend)**:
- Construcción: Etapa de construcción Node.js con Vite
- Servicio: nginx con archivos construidos
- Puerto: 80 → 8978

**docker-compose.yml**:
- Servicios: backend, frontend, lmstudio (opcional)
- Redes: Red puente interna
- Volúmenes: Almacenamiento de proyectos, almacenamiento de salida
- Ambiente: Configuración compartida

---

## Requisitos de Lenguaje

### Backend

**100% TypeScript** (modo strict):
- `"strict": true` en tsconfig.json
- Sin tipos `any` sin justificación
- Cobertura de tipos completa para todas las exportaciones
- Interfaces para todas las APIs públicas

### Frontend

**100% TypeScript** (React + TSX):
- `"strict": true` en tsconfig.json
- Todos los componentes tipados como `React.FC<Props>`
- Todos los hooks tipados con parámetros genéricos
- Todos los manejadores de eventos adecuadamente tipados

---

## Características de Rendimiento

### Tiempo de Procesamiento
```
Proyecto pequeño (< 10 archivos):    1-2 minutos
Proyecto mediano (10-50 archivos):   3-5 minutos
Proyecto grande (> 50 archivos):     5+ minutos
```

### Uso de Memoria
```
Backend:    ~500MB base + ~100MB por análisis
Frontend:   ~150MB en navegador
LMStudio:   ~3GB para modelo de 8B parámetros
```

### Uso de Tokens
```
Promedio por clase:     500-1000 tokens
Contexto RAG:           máximo 1500 tokens por función
Total por análisis:     5000-50000 tokens (varía)
```

---

## Lista de Verificación de Despliegue

- [ ] Node.js 18+ instalado
- [ ] TypeScript compilado correctamente
- [ ] Todas las pruebas pasando
- [ ] Verificaciones de ESLint aprobadas
- [ ] Variables de ambiente configuradas
- [ ] Imágenes de Docker construidas
- [ ] LMStudio accesible
- [ ] PlantUML instalado
- [ ] Pandoc instalado
- [ ] Espacio en disco disponible (10GB mínimo)
- [ ] Memoria suficiente (4GB mínimo)

---

## Comandos Útiles

### Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar backend en desarrollo
npm run dev:backend

# Iniciar frontend en desarrollo
npm run dev:frontend

# Ejecutar pruebas
npm test

# Linting de código
npm run lint

# Formatear código
npm run format
```

### Producción

```bash
# Construir backend
npm run build:backend

# Construir frontend
npm run build:frontend

# Iniciar producción
npm start

# Despliegue con Docker
docker-compose up --build -d
```

---

## Referencias y Documentación

- [Documentación de Node.js](https://nodejs.org/docs/)
- [Guía de Express.js](https://expressjs.com/)
- [Documentación de React](https://react.dev/)
- [Manual de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de TailwindCSS](https://tailwindcss.com/docs/)
- [Documentación de Vite](https://vitejs.dev/)
- [Guía de PlantUML](https://plantuml.com/)
- [Manual de Pandoc](https://pandoc.org/MANUAL.html)
- [Documentación de Docker](https://docs.docker.com/)
- [API de LMStudio](https://lmstudio.ai/)

---

**Última Actualización**: Diciembre 2025  
**Versión**: 1.1.0  
**Estado**: Actual con todas las dependencias
