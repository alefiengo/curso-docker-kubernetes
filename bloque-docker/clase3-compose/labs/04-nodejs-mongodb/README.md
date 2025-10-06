# Lab 04: Node.js + MongoDB - Aplicación Completa con Docker Compose

## Objetivo

Crear una aplicación full-stack completa usando Docker Compose, integrando todos los conceptos aprendidos: múltiples servicios, redes, volúmenes, variables de entorno y comunicación entre contenedores.

---

## Stack Tecnológico

- **Backend**: Node.js + Express + Mongoose
- **Base de datos**: MongoDB 7
- **GUI de BD**: mongo-express
- **API REST**: CRUD completo de tareas

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│              app-network (bridge)                   │
│                                                     │
│  ┌──────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  nodejs-app  │  │  mongodb   │  │ mongo-exp  │ │
│  │  (puerto     │◄─┤  (volumen  │◄─┤ (GUI web)  │ │
│  │   3000)      │  │  mongo-data│  │ (puerto    │ │
│  └──────────────┘  └────────────┘  │  8081)     │ │
│         │                           └────────────┘ │
└─────────┼───────────────────────────────────────────┘
          │
     Usuario (navegador/Postman)
```

**Comunicación**:
- `app` se conecta a `db` usando `mongodb://db:27017`
- `mongo-express` se conecta a `db` usando el nombre de servicio
- Usuario accede a la API en `http://localhost:3000`
- Usuario accede a Mongo Express en `http://localhost:8081`

---

## Estructura del Proyecto

```
04-nodejs-mongodb/
├── docker-compose.yml       # Orquestación de 3 servicios
├── app/
│   ├── Dockerfile          # Imagen de Node.js
│   ├── .dockerignore
│   ├── package.json        # Dependencias
│   └── server.js           # API REST
└── README.md               # Este archivo
```

---

## Paso 1: Revisar el docker-compose.yml

```yaml
services:
  app:
    build: ./app
    container_name: nodejs-app
    ports:
      - "3000:3000"
    environment:
      - MONGO_URL=mongodb://db:27017/tasksdb
      - NODE_ENV=development
    depends_on:
      - db
    networks:
      - app-network
    volumes:
      - ./app:/usr/src/app
      - /usr/src/app/node_modules

  db:
    image: mongo:7
    container_name: mongodb
    environment:
      - MONGO_INITDB_DATABASE=tasksdb
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  mongo-express:
    image: mongo-express
    container_name: mongo-express
    ports:
      - "8081:8081"
    environment:
      - ME_CONFIG_MONGODB_SERVER=db
      - ME_CONFIG_MONGODB_PORT=27017
      - ME_CONFIG_BASICAUTH_USERNAME=admin
      - ME_CONFIG_BASICAUTH_PASSWORD=admin123
    depends_on:
      - db
    networks:
      - app-network

volumes:
  mongo-data:
    driver: local

networks:
  app-network:
    driver: bridge
```

### Conceptos integrados

| Concepto | Implementación |
|----------|----------------|
| **Múltiples servicios** | 3 servicios: app, db, mongo-express |
| **Build custom** | `app` usa Dockerfile personalizado |
| **Redes** | Red custom `app-network` para todos |
| **Volúmenes named** | `mongo-data` para persistencia de MongoDB |
| **Volúmenes bind mount** | `./app` para desarrollo en tiempo real |
| **Variables de entorno** | Configuración de conexiones y credenciales |
| **depends_on** | Orden de inicio de servicios |
| **DNS interno** | `app` se conecta a `db` por nombre |

---

## Paso 2: Construir y Levantar la Aplicación

```bash
docker compose up --build
```

**Salida esperada:**
```
Building app
[+] Building 15.2s (10/10) FINISHED
 => [1/5] FROM docker.io/library/node:18-alpine
 => [2/5] WORKDIR /usr/src/app
 => [3/5] COPY package*.json ./
 => [4/5] RUN npm install
 => [5/5] COPY . .
Creating network "04-nodejs-mongodb_app-network" with driver "bridge"
Creating volume "04-nodejs-mongodb_mongo-data" with local driver
Creating mongodb ... done
Creating nodejs-app ... done
Creating mongo-express ... done
Attaching to mongodb, nodejs-app, mongo-express
mongodb       | ... MongoDB starting
nodejs-app    | ✓ Conectado a MongoDB
nodejs-app    | ✓ Servidor corriendo en http://localhost:3000
mongo-express | Mongo Express server listening at http://0.0.0.0:8081
```

---

## Paso 3: Probar la API REST

### 1. Health Check

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "estado": "activo",
  "mongodb": "conectado",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 2. Ver endpoints disponibles

```bash
curl http://localhost:3000/
```

**Respuesta esperada:**
```json
{
  "mensaje": "API de Tareas con Node.js y MongoDB",
  "version": "1.0.0",
  "endpoints": {
    "GET /": "Información de la API",
    "GET /api/tasks": "Listar todas las tareas",
    "POST /api/tasks": "Crear una nueva tarea",
    ...
  }
}
```

### 3. Crear una tarea (POST)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Aprender Docker Compose",
    "descripcion": "Completar laboratorio 04"
  }'
```

**Respuesta esperada:**
```json
{
  "mensaje": "Tarea creada exitosamente",
  "tarea": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "titulo": "Aprender Docker Compose",
    "descripcion": "Completar laboratorio 04",
    "completada": false,
    "fechaCreacion": "2025-01-15T10:35:00.000Z"
  }
}
```

### 4. Listar todas las tareas (GET)

```bash
curl http://localhost:3000/api/tasks
```

**Respuesta esperada:**
```json
{
  "total": 1,
  "tareas": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "titulo": "Aprender Docker Compose",
      "descripcion": "Completar laboratorio 04",
      "completada": false,
      "fechaCreacion": "2025-01-15T10:35:00.000Z"
    }
  ]
}
```

### 5. Actualizar una tarea (PUT)

```bash
curl -X PUT http://localhost:3000/api/tasks/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Content-Type: application/json" \
  -d '{
    "completada": true
  }'
```

### 6. Eliminar una tarea (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/tasks/65a1b2c3d4e5f6g7h8i9j0k1
```

---

## Paso 4: Usar Mongo Express (GUI)

### Acceder a la interfaz web:

```
http://localhost:8081
```

**Credenciales**:
- Usuario: `admin`
- Contraseña: `admin123`

### Explorar la base de datos:

1. Seleccionar database: `tasksdb`
2. Seleccionar collection: `tasks`
3. Ver los documentos creados vía API
4. Puedes editar/eliminar datos desde aquí

---

## Paso 5: Desarrollo en Tiempo Real

Gracias al bind mount (`./app:/usr/src/app`), los cambios en el código se reflejan sin reconstruir.

### Modificar server.js:

Agregar un nuevo endpoint:

```javascript
// GET /api/stats - Estadísticas
app.get('/api/stats', async (req, res) => {
  const total = await Task.countDocuments();
  const completadas = await Task.countDocuments({ completada: true });

  res.json({
    total,
    completadas,
    pendientes: total - completadas
  });
});
```

### Reiniciar el servicio app:

```bash
docker compose restart app
```

### Probar el nuevo endpoint:

```bash
curl http://localhost:3000/api/stats
```

---

## Paso 6: Verificar Persistencia

### 1. Crear varias tareas:

```bash
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d "{\"titulo\": \"Tarea $i\", \"descripcion\": \"Descripción $i\"}"
done
```

### 2. Detener y eliminar contenedores:

```bash
docker compose down
```

### 3. Levantar de nuevo:

```bash
docker compose up -d
```

### 4. Verificar que las tareas persisten:

```bash
curl http://localhost:3000/api/tasks
```

**Resultado**: Las 5 tareas siguen ahí porque están en el volumen `mongo-data`.

---

## Paso 7: Inspeccionar Logs

### Ver logs de todos los servicios:

```bash
docker compose logs
```

### Ver logs de un servicio específico:

```bash
docker compose logs app
docker compose logs db
docker compose logs mongo-express
```

### Seguir logs en tiempo real:

```bash
docker compose logs -f app
```

---

## Conceptos Aprendidos

- **Multi-service orchestration**: Coordinar 3 servicios con un solo comando
- **Service discovery**: `app` encuentra `db` usando DNS interno
- **Named volumes**: Persistencia de datos de MongoDB
- **Bind mounts**: Desarrollo en tiempo real sin rebuild
- **Environment variables**: Configuración externa
- **depends_on**: Control de orden de inicio
- **Build context**: Dockerfile personalizado para la aplicación
- **GUI tools**: mongo-express para visualizar datos

---

## Troubleshooting

### Error: "MongooseServerSelectionError"

**Problema:** Node.js no puede conectarse a MongoDB.

**Diagnóstico:**
```bash
docker compose logs db
docker compose exec app ping db
```

**Solución:** Verificar que `MONGO_URL` use el nombre correcto del servicio (`db`).

### Error: "Cannot find module 'express'"

**Problema:** Dependencias no instaladas.

**Solución:**
```bash
docker compose down
docker compose up --build
```

### Cambios en código no se reflejan

**Problema:** Necesitas reiniciar el contenedor.

**Solución:**
```bash
docker compose restart app
```

**Mejor solución**: Usar `nodemon` (ya está en devDependencies):
```bash
# En package.json cambiar CMD
CMD ["npm", "run", "dev"]
```

### Mongo Express no carga

**Problema:** MongoDB aún no está listo.

**Solución:** Esperar unos segundos y recargar `http://localhost:8081`.

---

## Desafío Adicional

### Nivel 1: Agregar validación

Modificar el modelo para validar que el título tenga mínimo 3 caracteres:

```javascript
titulo: {
  type: String,
  required: true,
  minlength: 3
}
```

### Nivel 2: Agregar autenticación básica

Agregar middleware de autenticación simple:

```javascript
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === 'Bearer secret-token') {
    next();
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
};

app.use('/api/tasks', basicAuth);
```

### Nivel 3: Agregar paginación

Implementar paginación en GET /api/tasks:

```javascript
app.get('/api/tasks', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tasks = await Task.find()
    .sort({ fechaCreacion: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments();

  res.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    tareas: tasks
  });
});
```

### Nivel 4: Frontend simple

Crear un `index.html` en `app/public/` que consuma la API con fetch y muestre las tareas.

---

## Comparación: Antes vs Después de Compose

### Sin Docker Compose:

```bash
# Terminal 1: MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:7

# Terminal 2: Node.js app
cd app
npm install
MONGO_URL=mongodb://localhost:27017/tasksdb npm start

# Terminal 3: mongo-express
docker run -d --name mongo-express \
  -p 8081:8081 \
  -e ME_CONFIG_MONGODB_SERVER=localhost \
  mongo-express
```

**Problemas**:
- 3 comandos separados
- Configuración manual de conexiones
- No hay red compartida
- Difícil de compartir con el equipo

### Con Docker Compose:

```bash
docker compose up
```

**Beneficios**:
- Un solo comando
- Configuración declarativa
- Red automática
- Fácil de compartir (solo el repositorio)

---

## Recursos Adicionales

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [mongo-express on Docker Hub](https://hub.docker.com/_/mongo-express)
- [Docker Compose Best Practices](https://docs.docker.com/compose/production/)

---

[← Volver a Clase 3](../../README.md)
