# Tarea para Casa - Clase 6

**Fecha de entrega:** Antes de la Clase 7
**Modalidad:** Individual
**Entrega:** Repositorio GitHub/GitLab personal + Capturas de pantalla

---

## Objetivo

Consolidar los conocimientos de Pods, Deployments y Services creando una aplicación multi-tier (frontend + backend + base de datos) completamente funcional en Kubernetes.

---

## Requisitos Técnicos

Debes crear una aplicación con 3 componentes:

### 1. Base de Datos (MongoDB)
- **Deployment:** `mongodb-deployment`
- **Imagen:** `mongo:7-jammy`
- **Réplicas:** 1
- **Puerto:** 27017
- **Service:** ClusterIP (interno)

### 2. Backend (API REST)
- **Deployment:** `api-deployment`
- **Imagen:** `alefiengo/simple-api:latest` (o crear tu propia)
- **Réplicas:** 2
- **Puerto:** 3000
- **Service:** ClusterIP (interno)
- **Debe conectarse a MongoDB**

### 3. Frontend (Nginx)
- **Deployment:** `frontend-deployment`
- **Imagen:** `nginx:alpine`
- **Réplicas:** 2
- **Puerto:** 80
- **Service:** NodePort (acceso externo)

---

## Instrucciones Paso a Paso

### Parte 1: Estructura del Proyecto

Crea la siguiente estructura en tu repositorio:

```
tarea-clase6/
├── README.md
├── mongodb/
│   ├── deployment.yaml
│   └── service.yaml
├── api/
│   ├── deployment.yaml
│   └── service.yaml
└── frontend/
    ├── deployment.yaml
    └── service.yaml
```

### Parte 2: Crear Manifests YAML

#### 1. MongoDB

**mongodb/deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb-deployment
  labels:
    app: mongodb
    tier: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
        tier: database
    spec:
      containers:
      - name: mongodb
        image: mongo:7-jammy
        ports:
        - containerPort: 27017
          name: mongo-port
```

**mongodb/service.yaml:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
spec:
  type: ClusterIP
  selector:
    app: mongodb
  ports:
  - port: 27017
    targetPort: 27017
```

#### 2. API Backend

**api/deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  labels:
    app: api
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
        tier: backend
    spec:
      containers:
      - name: api
        image: alefiengo/simple-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: MONGO_URL
          value: "mongodb://mongodb-service:27017/mydb"
```

**api/service.yaml:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
  - port: 3000
    targetPort: 3000
```

#### 3. Frontend

**frontend/deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  labels:
    app: frontend
    tier: presentation
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
        tier: presentation
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
```

**frontend/service.yaml:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30100
```

### Parte 3: Desplegar la Aplicación

```bash
# 1. Crear namespace para la tarea (opcional pero recomendado)
kubectl create namespace tarea-clase6

# 2. Aplicar manifests (en orden)
kubectl apply -f mongodb/ -n tarea-clase6
kubectl apply -f api/ -n tarea-clase6
kubectl apply -f frontend/ -n tarea-clase6

# 3. Verificar deployments
kubectl get deployments -n tarea-clase6

# 4. Verificar pods
kubectl get pods -n tarea-clase6

# 5. Verificar services
kubectl get services -n tarea-clase6

# 6. Acceder al frontend
minikube service frontend-service -n tarea-clase6
```

### Parte 4: Verificaciones

Ejecuta y captura los resultados de estos comandos:

```bash
# 1. Ver todos los recursos
kubectl get all -n tarea-clase6

# 2. Describir un pod del backend
kubectl describe pod -l app=api -n tarea-clase6

# 3. Ver logs del backend
kubectl logs -l app=api -n tarea-clase6

# 4. Probar conectividad interna
kubectl run test-pod --image=alpine --rm -it -n tarea-clase6 -- sh
# Dentro del pod:
apk add curl
curl http://api-service:3000
exit

# 5. Ver endpoints de services
kubectl get endpoints -n tarea-clase6
```

---

## Entregables

### 1. Repositorio GitHub/GitLab

Debe contener:
- [ ] Todos los archivos YAML
- [ ] README.md con:
  - Descripción del proyecto
  - Instrucciones de despliegue
  - Comandos de verificación
  - Capturas de pantalla

### 2. Capturas de Pantalla

Incluir en el README:
1. `kubectl get all -n tarea-clase6`
2. `kubectl get pods -n tarea-clase6 -o wide`
3. `kubectl describe service frontend-service -n tarea-clase6`
4. Navegador accediendo al frontend via NodePort
5. Logs del backend mostrando conexión a MongoDB

### 3. Documentación en README.md

Ejemplo de estructura:

```markdown
# Tarea Clase 6 - Aplicación Multi-Tier en Kubernetes

## Descripción

Aplicación de 3 capas desplegada en Kubernetes con minikube:
- Frontend: Nginx
- Backend: API REST
- Base de datos: MongoDB

## Arquitectura

[Diagrama o descripción]

## Instalación

```bash
kubectl apply -f mongodb/
kubectl apply -f api/
kubectl apply -f frontend/
```

## Verificación

[Comandos y capturas]

## Problemas Encontrados

[Descripción de problemas y cómo los resolviste]

## Aprendizajes

[Qué aprendiste en esta tarea]
```

---

## Criterios de Evaluación

| Criterio | Puntos |
|----------|--------|
| Manifests YAML correctos y funcionales | 30% |
| Aplicación desplegada correctamente | 25% |
| Verificaciones y comandos documentados | 20% |
| README completo con capturas | 15% |
| Limpieza de código y organización | 10% |

**Total:** 100 puntos

---

## Desafíos Opcionales (Puntos Extra)

### Desafío 1: Scaling Automático (10 puntos)

Escala el backend a 4 réplicas y documenta:
```bash
kubectl scale deployment api-deployment --replicas=4 -n tarea-clase6
```

### Desafío 2: Rolling Update (10 puntos)

Actualiza la imagen del frontend y documenta el proceso:
```bash
kubectl set image deployment/frontend-deployment nginx=nginx:1.26-alpine -n tarea-clase6
kubectl rollout status deployment frontend-deployment -n tarea-clase6
```

### Desafío 3: Health Checks (15 puntos)

Agrega liveness y readiness probes al deployment del backend:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 3
```

### Desafío 4: Usar tu Propia Aplicación (20 puntos)

En lugar de usar imágenes predefinidas, crea tu propia API:
- Dockerfile para tu aplicación
- Push a Docker Hub
- Usar en el deployment

---

## Recursos de Ayuda

- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- Labs de la clase

---

## Preguntas Frecuentes

**P: ¿Puedo usar otras imágenes?**
R: Sí, pero deben ser compatibles y documentar por qué las elegiste.

**P: ¿Debo usar namespace?**
R: Es opcional pero recomendado para organización.

**P: ¿Cómo verifico que MongoDB está funcionando?**
R:
```bash
kubectl exec -it deployment/mongodb-deployment -n tarea-clase6 -- mongosh
# Dentro de mongo:
show dbs
exit
```

**P: ¿Qué hago si un pod no inicia?**
R:
```bash
kubectl describe pod <pod-name> -n tarea-clase6
kubectl logs <pod-name> -n tarea-clase6
```

---

## Limpieza

Al terminar la tarea:

```bash
# Eliminar namespace completo
kubectl delete namespace tarea-clase6

# O eliminar recursos individuales
kubectl delete -f mongodb/ -n tarea-clase6
kubectl delete -f api/ -n tarea-clase6
kubectl delete -f frontend/ -n tarea-clase6
```

---

## Fecha de Entrega

**Antes de la Clase 7**

Enviar por Moodle:
- Link al repositorio GitHub/GitLab (público o dar acceso al instructor)
- PDF con capturas de pantalla si el repositorio es privado

---

**¡Éxito en tu tarea!**
