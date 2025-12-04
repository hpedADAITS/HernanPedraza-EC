# Guía de Inicio Rápido

Instale el Generador Automático de Documentación en minutos.

---

## Requisitos Previos

Antes de comenzar, asegúrese de tener instalado:

- **Node.js 18+** ([https://nodejs.org/](https://nodejs.org/))
- **Docker & Docker Compose** ([https://docs.docker.com/](https://docs.docker.com/))
- **LMStudio** ([https://lmstudio.ai/](https://lmstudio.ai/))
- **Java** (para PlantUML)
- **Pandoc** ([https://pandoc.org/](https://pandoc.org/))

---

## Paso 1: Configuración del Ambiente

### 1.1 Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd Sprint1.6
```

### 1.2 Instalar Dependencias
```bash
npm install
```

### 1.3 Configurar Variables de Ambiente

Cree un archivo `.env` en el directorio raíz:

```env
# Configuración del Backend
NODE_ENV=development
PORT=3000
LMS_API_URL=http://localhost:1234/v1/chat/completions
MAX_PROJECT_SIZE_MB=50
MAX_TOKENS_PER_REQUEST=5000

# Configuración del Frontend
VITE_API_BASE_URL=http://localhost:3000
```

### 1.4 Verificar LMStudio

Asegúrese de que LMStudio esté ejecutándose con un modelo cargado:

```bash
# Verificar conexión
curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "model",
    "messages": [{"role": "user", "content": "test"}],
    "max_tokens": 10
  }'
```

---

## Paso 2: Iniciar Servicios

### Opción A: Docker Compose (Recomendado)

```bash
docker-compose up --build
```

Espere a que ambos servicios se inicien:
- Backend: http://localhost:3000
- Frontend: http://localhost:8978

### Opción B: Desarrollo Local

Ejecute en terminales separadas:

**Terminal 1 - Backend**:
```bash
npm run dev:backend
```

**Terminal 2 - Frontend**:
```bash
npm run dev:frontend
```

**Terminal 3 - LMStudio** (si no está ejecutándose):
```bash
# Inicie LMStudio con un modelo cargado
# Visite http://localhost:1234 en su navegador
```

---

## Paso 3: Verificar Instalación

### Verificar Salud del Backend
```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Verificar Frontend
Abra http://localhost:8978 en su navegador

Debería ver:
- Campo de entrada de proyecto
- Botón "Generar Documentación"
- Sección de historial

---

## Paso 4: Ejecutar su Primer Análisis

### 4.1 Preparar un Proyecto Java

Ya sea:
- Use un proyecto Java existente: `/ruta/a/su/proyecto`
- O proporcione una URL de GitHub: `https://github.com/user/repo`

### 4.2 Enviar Análisis

1. Abra http://localhost:8978
2. Ingrese la ruta del proyecto o URL de GitHub en el campo de entrada
3. Haga clic en "Generar Documentación"
4. Espere el procesamiento (1-5 minutos según el tamaño del proyecto)

### 4.3 Ver Resultados

Después del procesamiento, verá:
- Documentación Markdown generada
- Diagramas PlantUML (como PNG)
- Enlace para descargar PDF
- Metadatos del análisis (recuento de clases, métodos, etc.)

---

## Referencia de Configuración

### Variables de Ambiente del Backend

| Variable | Valor Predeterminado | Descripción |
|----------|---|---|
| `NODE_ENV` | `development` | Modo de ambiente (`development`, `production`) |
| `PORT` | `3000` | Puerto del servidor API Express |
| `LMS_API_URL` | - | Endpoint de API de LMStudio |
| `MAX_PROJECT_SIZE_MB` | `50` | Tamaño máximo del proyecto en MB |
| `MAX_TOKENS_PER_REQUEST` | `5000` | Límite de ventana de contexto del LLM |

### Variables de Ambiente del Frontend

| Variable | Valor Predeterminado | Descripción |
|----------|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000` | URL base de la API del backend |

---

## Estructura de Directorios

```
Sprint1.6/
├── README.md                          # Descripción general
├── GUÍA_RÁPIDA.md                     # Este archivo
├── PILA_TECNOLÓGICA.md                # Dependencias y versiones
├── REFERENCIA_API.md                  # Documentación de API
├── .env                               # Variables de ambiente (crear)
├── .gitignore                         # Reglas de git ignore
├── docker-compose.yml                 # Configuración de Docker Compose
├── package.json                       # Dependencias de NPM
│
├── backend/                           # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/               # Manejadores de solicitudes
│   │   ├── services/                  # Lógica de negocio
│   │   ├── types/                     # Interfaces de TypeScript
│   │   └── index.ts                   # Punto de entrada
│   ├── Dockerfile                     # Contenedor del backend
│   └── package.json
│
├── frontend/                          # Frontend React
│   ├── src/
│   │   ├── components/                # Componentes de React
│   │   ├── pages/                     # Componentes de página
│   │   ├── App.tsx                    # Componente raíz
│   │   └── main.tsx                   # Punto de entrada
│   ├── Dockerfile                     # Contenedor del frontend
│   ├── package.json
│   └── vite.config.ts
│
├── Docs/                              # Documentación detallada
│   ├── ARQUITECTURA_DETALLADA.md      # Arquitectura completa
│   ├── PILA_TECNOLÓGICA.md            # Referencias de tecnología
│   ├── REFERENCIA_API.md              # Especificaciones de API
│   └── Diagrams/                      # Archivos PlantUML
│       ├── 01-system-architecture-diagram.puml
│       ├── 02-data-flow-pipeline.puml
│       ├── 03-ai-interaction-sequence.puml
│       ├── 04-backend-workflow-process.puml
│       ├── 06-file-structure-and-hierarchy.puml
│       ├── 07-deployment-architecture.puml
│       └── 08-api-endpoint-schema.puml
│
├── projects/                          # Proyectos de entrada (creado en tiempo de ejecución)
├── output/                            # Resultados de análisis (creado en tiempo de ejecución)
└── history/                           # Historial de análisis (creado en tiempo de ejecución)
```

---

## Flujos de Trabajo Comunes

### Analizar un Proyecto Java Local

```bash
# 1. Navegue al frontend: http://localhost:8978
# 2. Ingrese la ruta local:
#    /Users/sunombre/projects/mi-proyecto-java
# 3. Haga clic en "Generar"
# 4. Espere 1-5 minutos
# 5. Descargue el PDF o vea el markdown
```

### Analizar un Repositorio de GitHub

```bash
# 1. Navegue al frontend: http://localhost:8978
# 2. Ingrese la URL de GitHub:
#    https://github.com/spring-projects/spring-boot
# 3. Haga clic en "Generar"
# 4. El sistema clona automáticamente el repositorio
# 5. Espere el análisis
# 6. Vea los resultados
```

### Ver Historial de Análisis

```bash
# 1. Haga clic en la pestaña "Historial" en el frontend
# 2. Vea la lista de todos los análisis anteriores
# 3. Haga clic en cualquier entrada para reabrirla
```

---

## Solución de Problemas

### El Backend No Inicia

```bash
# Verificar que el puerto 3000 esté disponible
lsof -i :3000

# Verificar las variables de ambiente
echo $LMS_API_URL

# Intentar con un puerto explícito
PORT=4000 npm run dev:backend
```

### El Frontend No Carga

```bash
# Verificar que el puerto 8978 esté disponible
lsof -i :8978

# Verificar que el backend esté ejecutándose
curl http://localhost:3000/health

# Verificar que la URL de la API sea correcta
# Edite src/vite.env o el archivo .env
```

### La Conexión a LMStudio Falla

```bash
# Verificar que LMStudio esté ejecutándose
curl http://localhost:1234/health

# Verificar el endpoint de API
curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"model","messages":[{"role":"user","content":"test"}],"max_tokens":10}'

# Intentar con un puerto diferente si está personalizado
# Actualizar LMS_API_URL en .env
```

### Los Servicios de Docker No Inician

```bash
# Verificar que Docker esté ejecutándose
docker ps

# Ver registros
docker-compose logs -f

# Reconstruir contenedores
docker-compose down
docker-compose up --build

# Verificar espacio en disco disponible
df -h
```

### El Análisis Falla a Mitad del Proceso

```bash
# Verificar memoria disponible
free -h

# Verificar espacio en disco para archivos temporales
df -h /tmp

# Verificar que Java esté instalado (para PlantUML)
java -version

# Verificar que Pandoc esté instalado
pandoc --version
```

---

## Próximos Pasos

1. **Explorar Arquitectura**: Leer [ARQUITECTURA_DETALLADA.md](./Docs/ARQUITECTURA_DETALLADA.md)
2. **Revisar API**: Consultar [REFERENCIA_API.md](./REFERENCIA_API.md)
3. **Ver Dependencias**: Consultar [PILA_TECNOLÓGICA.md](./PILA_TECNOLÓGICA.md)
4. **Aprender Profundamente**: Estudiar [Docs/ARQUITECTURA_DETALLADA.md](./Docs/ARQUITECTURA_DETALLADA.md)

---

## Obtener Ayuda

- **Preguntas de arquitectura**: Consultar [Docs/ARQUITECTURA_DETALLADA.md](./Docs/ARQUITECTURA_DETALLADA.md)
- **Preguntas de API**: Consultar [REFERENCIA_API.md](./REFERENCIA_API.md)
- **Referencia visual**: Consultar [Docs/Diagrams/](./Docs/Diagrams/)

---

**Última Actualización**: Diciembre 2025  
**Estado**: Listo para usar
