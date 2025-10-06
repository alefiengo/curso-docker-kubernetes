# Tarea para Casa - Clase 3

**Fecha de entrega:** Antes de la próxima clase
**Modalidad:** Individual
**Entrega:** Repositorio personal en GitHub/GitLab + enlace en Moodle

---

## Objetivo

Crear una aplicación multi-contenedor completa usando Docker Compose, aplicando los conceptos de redes, volúmenes y orquestación de servicios aprendidos en clase.

---

## Requisitos de la Aplicación

Debes crear una aplicación con **mínimo 3 servicios**:

1. **Backend/API**: Aplicación en cualquier lenguaje (Node.js, Python, Go, Java, etc.)
2. **Base de datos**: PostgreSQL, MySQL, MongoDB, etc.
3. **Servicio adicional**: Puede ser:
   - Cache (Redis, Memcached)
   - Queue (RabbitMQ, Redis)
   - GUI de base de datos (Adminer, pgAdmin, mongo-express)
   - Proxy reverso (Nginx, Traefik)

---

## Especificaciones Técnicas

### 1. Docker Compose

Tu `docker-compose.yml` debe incluir:

- ✅ Al menos 3 servicios
- ✅ Al menos 1 servicio con `build` (Dockerfile personalizado)
- ✅ Al menos 1 servicio con imagen oficial de Docker Hub
- ✅ Variables de entorno configuradas
- ✅ Mapeo de puertos apropiado
- ✅ `depends_on` para control de inicio

### 2. Redes

- ✅ Crear al menos 1 red custom
- ✅ Segmentar servicios en diferentes redes (opcional pero recomendado)
- ✅ Documentar la arquitectura de red

### 3. Volúmenes

- ✅ Al menos 1 **named volume** para persistencia de datos
- ✅ Al menos 1 **bind mount** para desarrollo o configuración
- ✅ Probar que los datos persisten después de `docker compose down`

### 4. Funcionalidad

La aplicación debe:

- ✅ Ser accesible desde el navegador o API client (Postman/curl)
- ✅ Conectarse exitosamente a la base de datos
- ✅ Realizar al menos operaciones CRUD básicas o similar
- ✅ Funcionar correctamente después de `docker compose up`

---

## Estructura del Repositorio

Tu repositorio debe tener la siguiente estructura:

```
tu-repo-clase3/
├── README.md                    # Documentación completa
├── docker-compose.yml           # Orquestación de servicios
├── .env.example                 # Ejemplo de variables (sin valores reales)
├── .gitignore                   # Ignorar node_modules, .env, etc.
├── app/                         # Tu aplicación
│   ├── Dockerfile
│   ├── código fuente
│   └── ...
├── config/                      # Configuraciones (nginx.conf, etc.)
└── screenshots/                 # Capturas de pantalla (ver más abajo)
```

---

## Documentación Requerida (README.md)

Tu README.md debe incluir las siguientes secciones:

### 1. Título y Descripción

```markdown
# Nombre de tu Aplicación

Breve descripción de qué hace tu aplicación y qué tecnologías usa.

**Curso:** Docker & Kubernetes - Clase 3
**Estudiante:** Tu Nombre
**Fecha:** DD/MM/YYYY
```

### 2. Stack Tecnológico

Lista las tecnologías usadas:

```markdown
## Stack Tecnológico

- **Backend:** Node.js + Express / Python + FastAPI / etc.
- **Base de datos:** PostgreSQL 15 / MongoDB 7 / etc.
- **Cache/Queue:** Redis / RabbitMQ / etc.
- **Otros:** Nginx, Adminer, etc.
```

### 3. Arquitectura

Diagrama o descripción de la arquitectura:

```markdown
## Arquitectura

Descripción de cómo se comunican los servicios, qué redes usan, etc.

Servicios:
- `app`: Puerto 3000, conectado a db y redis
- `db`: PostgreSQL, solo accesible desde app
- `redis`: Cache, solo accesible desde app
```

Puedes incluir un diagrama ASCII o imagen.

### 4. Requisitos Previos

```markdown
## Requisitos

- Docker Desktop o Docker Engine
- Docker Compose
- Git
```

### 5. Instalación y Uso

Instrucciones paso a paso:

```markdown
## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repo-clase3.git
   cd tu-repo-clase3
   ```

2. Copiar variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Levantar servicios:
   ```bash
   docker compose up -d
   ```

4. Acceder a la aplicación:
   - API: http://localhost:3000
   - GUI DB: http://localhost:8080
```

### 6. Endpoints / Funcionalidad

Documenta cómo usar tu aplicación:

```markdown
## Endpoints

- `GET /` - Información de la API
- `GET /api/items` - Listar items
- `POST /api/items` - Crear item
- etc.

### Ejemplo de uso:

```bash
curl http://localhost:3000/api/items
```
```

### 7. Capturas de Pantalla

Incluir al menos 3 screenshots:

```markdown
## Capturas de Pantalla

### 1. Servicios corriendo
![docker compose ps](screenshots/01-services.png)

### 2. Aplicación funcionando
![App running](screenshots/02-app.png)

### 3. Base de datos con datos
![Database](screenshots/03-database.png)
```

### 8. Conceptos Aplicados

```markdown
## Conceptos Docker Aplicados

- **Docker Compose**: Orquestación de 3 servicios
- **Redes**: Red custom `app-network` para comunicación
- **Volúmenes**: `postgres-data` para persistencia
- **Variables de entorno**: Configuración de conexiones
- **Multi-stage build**: Dockerfile optimizado (si aplica)
```

### 9. Problemas y Soluciones (Opcional)

Documenta problemas que encontraste y cómo los resolviste.

---

## Capturas de Pantalla Requeridas

Debes incluir al menos estas 3 capturas:

1. **Servicios corriendo**: `docker compose ps`
2. **Aplicación funcionando**: Tu app en el navegador o respuesta de API
3. **Datos en la base de datos**: Usando GUI o cliente de BD

**Capturas adicionales sugeridas**:
- `docker volume ls`
- `docker network ls`
- `docker compose logs`
- Postman/curl haciendo requests

---

## Criterios de Evaluación

| Criterio | Puntos |
|----------|--------|
| **Funcionalidad** (aplicación funciona correctamente) | 25% |
| **Docker Compose** (mínimo 3 servicios, bien configurados) | 20% |
| **Redes** (al menos 1 red custom) | 15% |
| **Volúmenes** (persistencia correcta) | 15% |
| **Documentación** (README completo y claro) | 15% |
| **Capturas de pantalla** (evidencia del funcionamiento) | 10% |

**Total:** 100%

---

## Restricciones

- ❌ No usar ejemplos exactos de los labs de clase (puedes inspirarte pero debe ser diferente)
- ❌ No incluir credenciales reales en el repositorio (usar `.env.example`)
- ❌ No subir `node_modules`, archivos binarios, o datos de volúmenes
- ✅ El repositorio debe ser público
- ✅ Debe funcionar con solo `git clone` + `docker compose up`

---

## Entrega

1. **Crear repositorio público** en GitHub o GitLab
2. **Subir tu código** con commits descriptivos
3. **Verificar** que funcione clonando en otro directorio
4. **Entregar en Moodle**:
   - Enlace al repositorio
   - Breve descripción (2-3 líneas) de tu aplicación

**Formato del enlace en Moodle**:
```
Repositorio: https://github.com/tu-usuario/tu-repo-clase3
Descripción: API REST de gestión de tareas con Node.js, PostgreSQL y Redis como cache.
```

---

## Ideas de Proyectos

Si no sabes qué hacer, aquí hay algunas ideas:

### Idea 1: Blog Simple
- **Backend**: Node.js/Express
- **BD**: PostgreSQL
- **Adicional**: Adminer (GUI)
- **Funcionalidad**: CRUD de posts

### Idea 2: API de Productos
- **Backend**: Python/FastAPI
- **BD**: MongoDB
- **Adicional**: mongo-express
- **Funcionalidad**: Catálogo de productos

### Idea 3: Sistema de Usuarios
- **Backend**: Node.js/Express
- **BD**: PostgreSQL
- **Adicional**: Redis (cache de sesiones)
- **Funcionalidad**: Registro, login, perfil

### Idea 4: Todo List
- **Backend**: Go/Gin
- **BD**: MySQL
- **Adicional**: phpMyAdmin
- **Funcionalidad**: CRUD de tareas

---

## Recursos de Ayuda

- [Ejemplos de los labs de clase](../labs/)
- [Cheatsheet de Clase 3](../cheatsheet.md)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Guía de Entrega de Tareas](../../ENTREGA_TAREAS.md)

---

## Preguntas Frecuentes

### ¿Puedo usar un proyecto existente?

Sí, pero debe estar completamente dockerizado con Compose y cumplir todos los requisitos.

### ¿Puedo trabajar en grupo?

No, esta tarea es individual. Cada estudiante debe tener su propio repositorio.

### ¿Qué hago si no sé programar en ningún lenguaje?

Puedes usar los ejemplos de clase como base y modificarlos. Lo importante es demostrar que entiendes Docker Compose, redes y volúmenes.

### ¿Debo hacer el frontend?

No es obligatorio. Una API REST documentada es suficiente.

### ¿Puedo agregar más de 3 servicios?

Sí, puedes agregar los que quieras. Mientras más completo, mejor.

---

## Checklist Final

Antes de entregar, verifica:

- [ ] El repositorio es público
- [ ] README.md está completo con todas las secciones
- [ ] `docker-compose.yml` tiene mínimo 3 servicios
- [ ] Hay al menos 1 red custom
- [ ] Hay al menos 1 named volume
- [ ] `.gitignore` excluye archivos innecesarios
- [ ] `.env.example` está incluido (sin valores reales)
- [ ] Screenshots están en el repositorio
- [ ] La aplicación funciona con `docker compose up`
- [ ] Commits tienen mensajes descriptivos
- [ ] Enlace entregado en Moodle

---

¡Éxito con tu tarea!
