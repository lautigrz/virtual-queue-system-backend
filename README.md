# Virtual Queue System

Sistema simple de cola virtual que usa Redis y BullMQ para gestionar una cola de usuarios y un worker que asigna "slots" temporales (sesiones activas).

Estructura principal

- `src/index.js` - Arranque de la aplicación Express y registro del job scheduler.
- `src/routes/` - Definición de rutas (`/queue`, `/event`).
- `src/controller/` - Controladores HTTP.
- `src/services/` - Lógica de negocio (servicios que usan repositorios).
- `src/repository/` - Acceso a Redis (ZSETs y claves auxiliares).
- `src/utils/` - Utilidades: `process-queue`, `delete-queue`, `calculate-progress`.
- `src/worker/` - Definición de la cola (BullMQ) y worker.
- `src/config/` - Configuración de Redis (`redis-client.js`) y Bull (`bull-connection.js`).
- `reports/` - Informes generados (análisis, vulnerabilidades).

Requisitos

- Node.js 18+ (o LTS compatible con dependencias).
- Redis en ejecución accesible (por defecto `127.0.0.1:6379`).

Variables de entorno (opcional)

- `PORT` - Puerto HTTP (por defecto `3000`).
- `CORS_ORIGIN` - Origen permitido para CORS (por defecto `http://localhost:4200`).
- `REDIS_HOST`, `REDIS_PORT` - Conexión a Redis.
- `PROCESS_INTERVAL_MS` - Intervalo del job repetible para procesar la cola (ms).
- `PROCESS_JOB_ID` - Identificador del job repetible (opcional).
- `INITIAL_AHEAD_TTL_SECONDS` - TTL en segundos para `initial_ahead:{userId}` (por defecto `3600`).

Instalación y uso

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno (opcional). Crear `.env` con por ejemplo:

```
PORT=3000
CORS_ORIGIN=http://localhost:4200
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PROCESS_INTERVAL_MS=1000
INITIAL_AHEAD_TTL_SECONDS=3600
```

3. Arrancar la API:

```bash
npm start
```

4. Arrancar worker (si lo ejecutas separado):

```bash
npm run worker
```

Endpoints principales

- `GET /event/open-status` - Devuelve si el evento está abierto o no.
- `POST /queue/join` - Añade un usuario a la cola. Body: `{ "userId": "opcional" }`.
- `GET /queue/status/:id` - Obtiene estado/progreso del usuario en la cola.

Notas de diseño y buenas prácticas aplicadas

- Redis se gestiona con `ioredis` y se exponen handlers de `connect`, `error`, `close`.
- BullMQ usa una conexión compartida (`src/config/bull-connection.js`).
- `initial_ahead:{userId}` se guarda con TTL para evitar acumulación de claves.
- Jobs repetibles usan `PROCESS_JOB_ID` configurable para evitar duplicados accidentales.
- Controladores usan `try/catch` y devuelven respuestas con códigos HTTP apropiados.

## Este proyecto sirvio como practica y simulacion de una fila virtual utilizando Redis y un Worker como BullMQ
