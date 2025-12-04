# Referencia de API

Especificación completa de la API REST para el Generador Automático de Documentación.

---

## URL Base

```
http://localhost:3000
```

Para despliegue con Docker:
```
http://backend:3000
```

---

## Verificación de Salud

### GET /health

Verificar si el servidor de API está ejecutándose y saludable.

**Solicitud**:
```http
GET /health HTTP/1.1
Host: localhost:3000
```

**Respuesta (200 OK)**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600
}
```

---

## Endpoints Principales

---

## POST /api/analyze

Enviar un proyecto Java para análisis.

### Propósito

Iniciar generación automática de documentación para un proyecto Java.

### Solicitud

**URL**: `POST /api/analyze`

**Content-Type**: `application/json`

**Parámetros del Cuerpo**:

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `projectPath` | string | Sí | Ruta de archivo local o URL de GitHub al proyecto Java |

**Ejemplos**:

```bash
# Proyecto local
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/Users/usuario/projects/mi-app-java"
  }'
```

```bash
# Repositorio de GitHub
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "https://github.com/spring-projects/spring-boot"
  }'
```

### Respuesta

**Éxito (200 OK)**:

```json
{
  "status": "success",
  "analysisId": "550e8400-e29b-41d4-a716-446655440000",
  "markdown": "# Spring Boot\n\n## Descripción General\n...",
  "pdfUrl": "/docs/550e8400-e29b-41d4-a716-446655440000/output.pdf",
  "diagrams": [
    {
      "name": "Application.puml",
      "url": "/diagrams/550e8400-e29b-41d4-a716-446655440000/Application.png",
      "type": "class",
      "description": "Clases principales de la aplicación"
    }
  ],
  "metadata": {
    "projectName": "spring-boot",
    "totalClasses": 45,
    "totalMethods": 287,
    "totalPackages": 12,
    "fileCount": 38,
    "processingTimeMs": 127500,
    "analysisDate": "2024-01-15T10:30:00Z"
  },
  "executionTimestamp": "2024-01-15T10:30:00Z"
}
```

**Error (400 Solicitud Incorrecta)**:

```json
{
  "status": "error",
  "message": "Ruta de proyecto inválida o no es un proyecto Java",
  "details": "No se encontraron archivos .java en el directorio especificado"
}
```

**Error (413 Carga Demasiado Grande)**:

```json
{
  "status": "error",
  "message": "El tamaño del proyecto excede el máximo permitido",
  "details": "El proyecto es de 75MB, el máximo permitido es 50MB"
}
```

**Error (500 Error Interno del Servidor)**:

```json
{
  "status": "error",
  "message": "El análisis falló",
  "details": "Tiempo de espera agotado en la conexión con LMStudio en el paso 7"
}
```

---

## GET /api/history

Recuperar el historial de todas las análisis pasadas.

### Propósito

Obtener una lista de todos los análisis completados anteriormente con metadatos.

### Solicitud

**URL**: `GET /api/history`

**Parámetros de Consulta**: Ninguno

**Ejemplo**:

```bash
curl -X GET http://localhost:3000/api/history \
  -H "Content-Type: application/json"
```

### Respuesta

**Éxito (200 OK)**:

```json
{
  "status": "success",
  "history": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "projectPath": "/Users/usuario/projects/spring-boot",
      "projectName": "spring-boot",
      "timestamp": "2024-01-15T10:30:00Z",
      "status": "success",
      "processingTimeMs": 127500,
      "totalClasses": 45,
      "totalMethods": 287,
      "resultsUrl": "/api/docs/550e8400-e29b-41d4-a716-446655440000"
    }
  ],
  "totalAnalyses": 1
}
```

**Historial Vacío (200 OK)**:

```json
{
  "status": "success",
  "history": [],
  "totalAnalyses": 0
}
```

---

## GET /api/docs/:id

Recuperar los resultados completos de un análisis anterior.

### Propósito

Obtener la documentación completa, diagramas y metadatos de un análisis pasado.

### Solicitud

**URL**: `GET /api/docs/:id`

**Parámetros de Ruta**:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | UUID de análisis del historial |

**Ejemplo**:

```bash
curl -X GET http://localhost:3000/api/docs/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json"
```

### Respuesta

**Éxito (200 OK)**:

Devuelve la misma estructura que POST /api/analyze:

```json
{
  "status": "success",
  "analysisId": "550e8400-e29b-41d4-a716-446655440000",
  "markdown": "# Spring Boot\n\n## Descripción General\n...",
  "pdfUrl": "/docs/550e8400-e29b-41d4-a716-446655440000/output.pdf",
  "diagrams": [...],
  "metadata": {...},
  "executionTimestamp": "2024-01-15T10:30:00Z"
}
```

**Error (404 No Encontrado)**:

```json
{
  "status": "error",
  "message": "Análisis no encontrado",
  "details": "No se encontró análisis con ID: uuid-inválido"
}
```

---

## Endpoints de Descarga de Archivos

### GET /docs/:id/output.pdf

Descargar el archivo PDF generado.

**URL**: `GET /docs/:id/output.pdf`

**Ejemplo**:

```bash
curl -X GET http://localhost:3000/docs/550e8400-e29b-41d4-a716-446655440000/output.pdf \
  --output documentacion.pdf
```

**Respuesta**: Archivo PDF binario (Content-Type: `application/pdf`)

---

### GET /diagrams/:id/:filename.png

Descargar un diagrama renderizado.

**URL**: `GET /diagrams/:id/:filename.png`

**Parámetros**:

| Parámetro | Descripción |
|-----------|-------------|
| `id` | UUID de análisis |
| `filename` | Nombre del diagrama sin extensión (ej: "User") |

**Ejemplo**:

```bash
curl -X GET http://localhost:3000/diagrams/550e8400-e29b-41d4-a716-446655440000/User.png \
  --output User.png
```

**Respuesta**: Imagen PNG binaria (Content-Type: `image/png`)

---

## Respuestas de Error

Todos los endpoints siguen un formato de respuesta de error consistente.

### Estructura de Respuesta de Error

```json
{
  "status": "error",
  "message": "Mensaje de error legible para humanos",
  "details": "Contexto adicional o información de depuración",
  "code": "CÓDIGO_DE_ERROR",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Códigos de Estado HTTP

| Código | Significado | Escenario |
|--------|-------------|-----------|
| 200 | OK | Solicitud exitosa |
| 400 | Solicitud Incorrecta | Parámetros de entrada inválidos |
| 404 | No Encontrado | ID de análisis no existe |
| 413 | Carga Demasiado Grande | Proyecto excede límite de tamaño |
| 500 | Error Interno del Servidor | Falla de conexión con LMStudio o error de LLM |
| 503 | Servicio No Disponible | Backend o LMStudio no responden |

---

## Tipos de Contenido

| Endpoint | Solicitud | Respuesta |
|----------|-----------|----------|
| POST /api/analyze | application/json | application/json |
| GET /api/history | N/A | application/json |
| GET /api/docs/:id | N/A | application/json |
| GET /docs/:id/output.pdf | N/A | application/pdf |
| GET /diagrams/:id/*.png | N/A | image/png |

---

## Timeouts

| Operación | Timeout |
|-----------|---------|
| Clonación de Git | 60 segundos |
| Parsing de archivos | 30 segundos |
| Llamada LLM (por clase) | 120 segundos |
| Renderización de PlantUML | 30 segundos |
| Generación de PDF | 60 segundos |
| Análisis total | 900 segundos (15 minutos) |

---

## Ejemplo de Flujo Completo

### 1. Enviar Análisis

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "https://github.com/user/repo"
  }'
```

Respuesta:
```json
{
  "status": "success",
  "analysisId": "abc-123-def-456",
  ...
}
```

### 2. Verificar Historial

```bash
curl -X GET http://localhost:3000/api/history
```

Muestra el nuevo análisis en la lista.

### 3. Recuperar Resultados Completos

```bash
curl -X GET http://localhost:3000/api/docs/abc-123-def-456
```

### 4. Descargar PDF

```bash
curl -X GET http://localhost:3000/docs/abc-123-def-456/output.pdf \
  --output documentacion.pdf
```

### 5. Descargar Diagrama

```bash
curl -X GET http://localhost:3000/diagrams/abc-123-def-456/MiClase.png \
  --output MiClase.png
```

---

## Prueba de la API

### Usando cURL

```bash
# Verificar salud
curl http://localhost:3000/health

# Enviar análisis
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"projectPath":"./proyecto-prueba"}'

# Obtener historial
curl http://localhost:3000/api/history
```

### Usando JavaScript/Fetch

```javascript
// Ejemplo de Fetch
const response = await fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ projectPath: '/ruta/a/proyecto' })
});
const data = await response.json();
console.log(data);
```

### Usando Axios

```typescript
// Ejemplo de Axios (utilizado en frontend)
import axios from 'axios';

const response = await axios.post('/api/analyze', {
  projectPath: '/ruta/a/proyecto'
});
console.log(response.data);
```

---

**Última Actualización**: Diciembre 2025  
**Estado**: Estable  
**Versión**: 1.0
