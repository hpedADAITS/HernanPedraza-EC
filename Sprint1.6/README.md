# Generador Automático de Documentación para Proyectos Java

Un sistema inteligente que analiza automáticamente código fuente Java y genera documentación técnica integral con enriquecimiento impulsado por IA, diagramas UML y exportación a PDF.

## Descripción General

Este proyecto proporciona una aplicación full-stack que:
- **Analiza** código fuente Java desde directorios locales o repositorios de GitHub
- **Genera** documentación técnica en formato Markdown
- **Enriquece** la documentación con descripciones e insights impulsados por IA
- **Visualiza** la arquitectura del sistema mediante diagramas PlantUML
- **Exporta** resultados como PDF y conserva el historial de análisis

**Filosofía Clave**: Procesamiento local que preserva la privacidad con diseño offline-first utilizando LMStudio para operaciones de IA.

---

## Documentación Completa en Docs/

Toda la documentación consolidada está en la carpeta `Docs/`:

- [Docs/GUÍA_RÁPIDA.md](./Docs/GUÍA_RÁPIDA.md) - Inicio rápido e instalación
- [Docs/PILA_TECNOLÓGICA.md](./Docs/PILA_TECNOLÓGICA.md) - Stack de tecnologías y dependencias
- [Docs/REFERENCIA_API.md](./Docs/REFERENCIA_API.md) - Especificaciones completas de API
- [Docs/ARQUITECTURA_DETALLADA.md](./Docs/ARQUITECTURA_DETALLADA.md) - Arquitectura del sistema
- [Docs/CUMPLIMIENTO_REQUISITOS.md](./Docs/CUMPLIMIENTO_REQUISITOS.md) - Verificación de requisitos del assignment
- [Docs/MEJORAS_A_IMPLEMENTAR.md](./Docs/MEJORAS_A_IMPLEMENTAR.md) - Roadmap y características planificadas

Requisitos del proyecto:
- [ASSIGNMENT.md](./ASSIGNMENT.md) - Especificación de requisitos

### Diagramas de Arquitectura (Docs/Diagrams/Generated/)

#### 1. Arquitectura del Sistema
![System Architecture](./Docs/Diagrams/Generated/01-system-architecture-diagram.png)

#### 2. Pipeline de Flujo de Datos
![Data Flow Pipeline](./Docs/Diagrams/Generated/02-data-flow-pipeline.png)

#### 3. Secuencia de Interacción con IA
![AI Interaction Sequence](./Docs/Diagrams/Generated/03-ai-interaction-sequence.png)

#### 4. Workflow del Backend
![Backend Workflow](./Docs/Diagrams/Generated/04-backend-workflow-process.png)

#### 5. Estructura de Archivos
![File Structure](./Docs/Diagrams/Generated/06-file-structure-and-hierarchy.png)

#### 6. Arquitectura de Despliegue
![Deployment Architecture](./Docs/Diagrams/Generated/07-deployment-architecture.png)

#### 7. Schema de Endpoints API
![API Endpoint Schema](./Docs/Diagrams/Generated/08-api-endpoint-schema.png)

**Fuentes PlantUML**: [Docs/Diagrams/](./Docs/Diagrams/) - Editar archivos `.puml` para regenerar diagramas

---

## Características Principales

- Análisis automático de código Java
- Documentación impulsada por IA (patrón IMPLEMENTER + EXPANDER)
- Generación de diagramas UML con PlantUML
- Exportación a PDF
- Historial de análisis persistente
- Completamente offline (LLM local)
- Gestión de tokens presupuestada
- Validación de esquemas para salidas de IA
- Listo para Docker
- Base de código 100% TypeScript

---

## Inicio Rápido

### Instalación
```bash
npm install
export LMS_API_URL=http://localhost:1234/v1/chat/completions
export NODE_ENV=development
```

### Ejecutar Servicios
```bash
docker-compose up --build
# Frontend: http://localhost:8978
# Backend API: http://localhost:3000
```

Para instrucciones detalladas, consulte [Docs/GUÍA_RÁPIDA.md](./Docs/GUÍA_RÁPIDA.md)

---

## Stack Tecnológico

| Componente | Tecnología | Propósito |
|-----------|-----------|----------|
| **Backend** | Node.js 18 + Express + TypeScript | API REST y orquestación |
| **Frontend** | React 18 + TailwindCSS + TypeScript | Interfaz de usuario |
| **Integración IA** | LMStudio (LLM local) | Enriquecimiento de análisis de código |
| **Diagramas** | PlantUML | Generación de UML |
| **Generación PDF** | Pandoc | Conversión de Markdown a PDF |
| **Contenedorización** | Docker + Docker Compose | Despliegue |

Para detalles completos de tecnología incluyendo todas las dependencias, consulte [Docs/PILA_TECNOLÓGICA.md](./Docs/PILA_TECNOLÓGICA.md)

---

## Referencia Rápida de API

### Enviar Análisis
```bash
POST /api/analyze
{
  "projectPath": "/ruta/a/proyecto/java"
}
```

### Obtener Historial
```bash
GET /api/history
```

### Recuperar Resultados
```bash
GET /api/docs/:id
```

Para documentación completa de API, consulte [Docs/REFERENCIA_API.md](./Docs/REFERENCIA_API.md)

---

## Arquitectura y Diseño

El sistema sigue una **arquitectura en capas** con clara separación de responsabilidades:

```
Frontend (React)
    ↓
Capa de API (Express)
    ↓
Servicios (Pipeline de Análisis)
    ↓
Herramientas Externas (LMStudio, PlantUML, Pandoc)
    ↓
Almacenamiento en Sistema de Archivos
```

### Principios de Diseño Clave

1. **Separación de Responsabilidades** - Cada servicio tiene una única responsabilidad
2. **Disciplina de Tokens** - Aplicación estricta del presupuesto para restricciones de LMStudio
3. **Procesamiento Stateless** - Contexto fresco para cada llamada LLM
4. **Validación de Esquemas** - Todas las salidas de IA validadas contra esquemas JSON
5. **Privacidad Primero** - Todo el procesamiento es local y offline
6. **Configuración Modular** - Configuración impulsada por ambiente

### Pipeline de Procesamiento

El sistema procesa proyectos Java a través de un **pipeline de 22 pasos**:

1. Frontend recibe entrada del usuario (URL de repositorio o ruta local)
2. Validación y clonación de proyecto (si es URL de GitHub)
3. Análisis de estructura de archivos y extracción de archivos Java
4. Parsing de código (clases, métodos, campos)
5. Construcción de índice RAG para recuperación de contexto
6. Carga de modelos IA (IMPLEMENTER y EXPANDER)
7. Generación de estructura de documentación inicial
8. Enriquecimiento de documentación con descripciones impulsadas por IA
9. Generación de diagramas PlantUML
10. Renderización de diagramas a PNG
11. Conversión de Markdown a PDF
12. Devolución de resultados al usuario

Para arquitectura detallada, consulte [Docs/ARQUITECTURA_DETALLADA.md](./Docs/ARQUITECTURA_DETALLADA.md)

---

## Características de Rendimiento

### Tiempo de Procesamiento
- Proyectos pequeños (< 10 archivos): 1-2 minutos
- Proyectos medianos (10-50 archivos): 3-5 minutos
- Proyectos grandes (> 50 archivos): 5+ minutos

### Uso de Memoria
- Backend: ~500MB línea base + ~100MB por análisis concurrente
- Frontend: ~150MB en navegador
- LMStudio: ~3GB para modelo de 8B parámetros

### Uso de Tokens
- Promedio por clase: 500-1000 tokens
- Contexto RAG: máximo 1500 tokens por función
- Total por análisis: 5000-50000 tokens (varía según tamaño del proyecto)

---

## Decisiones Arquitectónicas Clave

| Decisión | Fundamentación | Compromiso |
|----------|---|---|
| Enfoque de dos modelos (IMPLEMENTER + EXPANDER) | Separa extracción de enriquecimiento | 2x llamadas LLM por clase |
| Inyección de contexto basada en RAG | Proporciona contexto relevante dentro del presupuesto de tokens | Paso de preprocesamiento adicional |
| Prompts presupuestados en tokens | Respeta restricciones de VRAM de LMStudio | Requiere ajuste cuidadoso |
| Persistencia basada en sistema de archivos | Simple y confiable | Sin búsqueda/indexación integrada |
| Contenedorización con Docker | Reproducible y portátil | Complejidad de configuración adicional |
| PlantUML para diagramas | Código abierto y ampliamente utilizado | Tipos de diagramas limitados |
| Pandoc para PDF | Conversión nativa de Markdown | Personalización de PDF limitada |

---

## Desarrollo y Despliegue

### Desarrollo Local
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

### Despliegue con Docker
```bash
docker-compose up --build
```

### Requisitos Previos
- Node.js 18+
- Docker & Docker Compose
- LMStudio instalado y en ejecución
- Java (para PlantUML)
- Pandoc

Para instrucciones detalladas de configuración, consulte [Docs/GUÍA_RÁPIDA.md](./Docs/GUÍA_RÁPIDA.md)

---

## Mejoras Planificadas

Más allá de los requisitos mínimos, se planean las siguientes mejoras significativas:

### Análisis y Estadísticas
- Métricas en tiempo real: clases, métodos, paquetes, líneas de código
- Presupuesto y gestión inteligente de tokens
- Rendimiento y timing detallado por fase del análisis

### Búsqueda y Navegación
- Filtrado granular por paquete, clase, método
- Recuperación contextual con RAG (Retrieval-Augmented Generation)
- Referencias cruzadas e índices jerárquicos automáticos

### Insights de IA
- Detección de patrones de diseño (Factory, Singleton, Observer, etc.)
- Análisis de principios SOLID y complejidad ciclomática
- Recomendaciones automáticas de refactoring

### Validación y Calidad
- Validación de esquemas para todas las respuestas IA
- Manejo robusto de errores con backoff exponencial
- Logging completo y trazabilidad de cada análisis

### Accesibilidad y UX
- Diseño responsive (móvil, tablet, desktop)
- Cumplimiento WCAG AA para accesibilidad
- Indicadores de estado visuales y error boundaries

Para detalles completos, ver: **[Docs/MEJORAS_A_IMPLEMENTAR.md](./Docs/MEJORAS_A_IMPLEMENTAR.md)**

---

## Criterios de Éxito

- Todos los diagramas PlantUML se renderizan correctamente
- Los endpoints de API devuelven respuestas formateadas correctamente
- La documentación incluye todas las secciones requeridas
- Los PDFs son descargables y visualizables
- El historial persiste entre reinicios
- Los mensajes de error son amigables para el usuario
- El procesamiento se completa sin errores de memoria
- Los presupuestos de tokens se aplican estrictamente
- La validación de esquemas detecta respuestas malformadas de IA
- El despliegue con Docker funciona de manera inmediata

---

## Soporte y Recursos

### Documentación Principal (en Docs/)
- **Quick Start**: [Docs/GUÍA_RÁPIDA.md](./Docs/GUÍA_RÁPIDA.md)
- **Tecnologías**: [Docs/PILA_TECNOLÓGICA.md](./Docs/PILA_TECNOLÓGICA.md)
- **API Reference**: [Docs/REFERENCIA_API.md](./Docs/REFERENCIA_API.md)
- **Arquitectura**: [Docs/ARQUITECTURA_DETALLADA.md](./Docs/ARQUITECTURA_DETALLADA.md)
- **Cumplimiento**: [Docs/CUMPLIMIENTO_REQUISITOS.md](./Docs/CUMPLIMIENTO_REQUISITOS.md)
- **Roadmap**: [Docs/MEJORAS_A_IMPLEMENTAR.md](./Docs/MEJORAS_A_IMPLEMENTAR.md)

### Referencias Externas
- [Sintaxis PlantUML](https://plantuml.com/syntax)
- [Manual de Pandoc](https://pandoc.org/MANUAL.html)
- [API de LMStudio](https://lmstudio.ai/)
- [Documentación de React](https://react.dev/)
- [Guía de Express.js](https://expressjs.com/)
- [Referencia de Docker Compose](https://docs.docker.com/compose/compose-file/)

---

## Próximos Pasos

1. **Revisar** [Docs/GUÍA_RÁPIDA.md](./Docs/GUÍA_RÁPIDA.md) para configuración de ambiente
2. **Consultar** [Docs/PILA_TECNOLÓGICA.md](./Docs/PILA_TECNOLÓGICA.md) para dependencias
3. **Leer** [Docs/ARQUITECTURA_DETALLADA.md](./Docs/ARQUITECTURA_DETALLADA.md) para diseño del sistema
4. **Verificar** [Docs/CUMPLIMIENTO_REQUISITOS.md](./Docs/CUMPLIMIENTO_REQUISITOS.md) para cumplimiento de requisitos
5. **Explorar** [Docs/MEJORAS_A_IMPLEMENTAR.md](./Docs/MEJORAS_A_IMPLEMENTAR.md) para el roadmap de características planificadas

---

**Última Actualización**: Diciembre 2025  
**Versión**: 1.1.0  
**Estado**: Listo para Producción (proyectos Java de 10-50 archivos)
