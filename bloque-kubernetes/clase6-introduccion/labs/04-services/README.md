# Lab 04: Services en Kubernetes

## Objetivo

Entender cómo funcionan los Services en Kubernetes para exponer aplicaciones, aprender los diferentes tipos de Services (ClusterIP, NodePort, LoadBalancer) y cómo se comunican los pods entre sí.

---

## Comandos a Ejecutar

### Parte 1: Service ClusterIP (Interno)

```bash
# 1. Crear deployment de backend
kubectl create deployment backend --image=nginx:alpine --replicas=3

# 2. Exponer con Service ClusterIP
kubectl expose deployment backend --port=80 --target-port=80 --name=backend-service

# 3. Ver service creado
kubectl get service backend-service

# 4. Ver detalles del service
kubectl describe service backend-service

# 5. Ver endpoints (IPs de los pods)
kubectl get endpoints backend-service

# 6. Probar conectividad desde un pod temporal
kubectl run test-pod --image=alpine --rm -it -- sh
# Dentro del pod:
apk add curl
curl http://backend-service
curl http://backend-service.default.svc.cluster.local
exit
```

---

### Parte 2: Service NodePort (Acceso Externo)

```bash
# 1. Crear deployment
kubectl create deployment webapp --image=nginx:alpine --replicas=2

# 2. Crear service NodePort declarativo
cat > service-nodeport.yaml <<EOF
apiVersion: v1
kind: Service
metadata:
  name: webapp-nodeport
spec:
  type: NodePort
  selector:
    app: webapp
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
EOF

# 3. Aplicar service
kubectl apply -f service-nodeport.yaml

# 4. Ver service
kubectl get service webapp-nodeport

# 5. Obtener URL de minikube
minikube service webapp-nodeport --url

# 6. Acceder desde navegador
# Abrir: http://<minikube-ip>:30080

# 7. O usar minikube service (abre automáticamente)
minikube service webapp-nodeport

# 8. Ver detalles
kubectl describe service webapp-nodeport
```

---

### Parte 3: Service con Selectors

```bash
# 1. Crear pods con diferentes labels
cat > pods-labels.yaml <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: pod-v1
  labels:
    app: myapp
    version: v1
spec:
  containers:
  - name: nginx
    image: nginx:1.25-alpine
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-v2
  labels:
    app: myapp
    version: v2
spec:
  containers:
  - name: nginx
    image: nginx:1.26-alpine
EOF

# 2. Crear pods
kubectl apply -f pods-labels.yaml

# 3. Crear service que selecciona solo v1
cat > service-v1.yaml <<EOF
apiVersion: v1
kind: Service
metadata:
  name: myapp-v1
spec:
  selector:
    app: myapp
    version: v1
  ports:
  - port: 80
    targetPort: 80
EOF

# 4. Aplicar service
kubectl apply -f service-v1.yaml

# 5. Ver endpoints (solo pod-v1)
kubectl get endpoints myapp-v1

# 6. Crear service para ambas versiones
cat > service-all.yaml <<EOF
apiVersion: v1
kind: Service
metadata:
  name: myapp-all
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 80
EOF

# 7. Aplicar
kubectl apply -f service-all.yaml

# 8. Ver endpoints (ambos pods)
kubectl get endpoints myapp-all
```

---

### Parte 4: Service Discovery (DNS)

```bash
# 1. Crear deployment y service de base de datos
kubectl create deployment redis --image=redis:alpine
kubectl expose deployment redis --port=6379 --name=redis-service

# 2. Crear deployment de aplicación
cat > app-deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: alpine
        image: alpine:latest
        command: ["sh", "-c", "apk add redis && sleep 3600"]
EOF

# 3. Aplicar
kubectl apply -f app-deployment.yaml

# 4. Probar DNS desde pod de aplicación
kubectl exec -it deployment/app -- sh
# Dentro del pod:
redis-cli -h redis-service ping
# Salida: PONG

# Probar FQDN (Fully Qualified Domain Name)
redis-cli -h redis-service.default.svc.cluster.local ping
exit

# 5. Ver resolución DNS
kubectl run dns-test --image=alpine --rm -it -- sh
# Dentro:
apk add bind-tools
nslookup redis-service
nslookup redis-service.default.svc.cluster.local
exit
```

---

### Parte 5: Múltiples Puertos en Service

```bash
# 1. Crear deployment con múltiples puertos
cat > multi-port-deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multi-port-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: multi-port
  template:
    metadata:
      labels:
        app: multi-port
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
          name: http
        - containerPort: 443
          name: https
EOF

# 2. Aplicar
kubectl apply -f multi-port-deployment.yaml

# 3. Crear service con múltiples puertos
cat > multi-port-service.yaml <<EOF
apiVersion: v1
kind: Service
metadata:
  name: multi-port-service
spec:
  selector:
    app: multi-port
  ports:
  - name: http
    port: 80
    targetPort: http
  - name: https
    port: 443
    targetPort: https
EOF

# 4. Aplicar
kubectl apply -f multi-port-service.yaml

# 5. Ver service
kubectl describe service multi-port-service
```

---

### Parte 6: LoadBalancer (minikube tunnel)

```bash
# 1. Crear service LoadBalancer
cat > service-loadbalancer.yaml <<EOF
apiVersion: v1
kind: Service
metadata:
  name: webapp-lb
spec:
  type: LoadBalancer
  selector:
    app: webapp
  ports:
  - port: 80
    targetPort: 80
EOF

# 2. Aplicar
kubectl apply -f service-loadbalancer.yaml

# 3. Ver service (EXTERNAL-IP en Pending en minikube)
kubectl get service webapp-lb

# 4. En otra terminal, crear túnel minikube
minikube tunnel
# Dejar corriendo

# 5. Ver EXTERNAL-IP asignada
kubectl get service webapp-lb

# 6. Acceder desde navegador
# http://<EXTERNAL-IP>

# 7. Detener túnel (Ctrl+C en terminal del tunnel)
```

---

### Parte 7: Limpieza

```bash
# Eliminar todos los recursos creados
kubectl delete deployment backend webapp app redis multi-port-app
kubectl delete service backend-service webapp-nodeport myapp-v1 myapp-all redis-service multi-port-service webapp-lb
kubectl delete pod pod-v1 pod-v2
kubectl delete -f service-nodeport.yaml --ignore-not-found
kubectl delete -f service-loadbalancer.yaml --ignore-not-found
```

---

## Desglose de Comandos

| Comando | Descripción |
|---------|-------------|
| `kubectl expose deployment <name> --port=<port>` | Crea service para un deployment |
| `kubectl get service` | Lista todos los services |
| `kubectl get endpoints <service>` | Muestra endpoints (IPs de pods) del service |
| `kubectl describe service <name>` | Detalles completos del service |
| `minikube service <name> --url` | Obtiene URL del service NodePort |
| `minikube service <name>` | Abre service en navegador |
| `minikube tunnel` | Crea túnel para services LoadBalancer |
| `nslookup <service-name>` | Resuelve DNS del service |
| `kubectl run <name> --rm -it --image=<image> -- sh` | Crea pod temporal interactivo |

---

## Explicación Detallada

### Paso 1: Tipos de Services

**1. ClusterIP (Default):**
- IP interna del cluster
- Solo accesible desde dentro del cluster
- Ideal para comunicación entre microservicios

```yaml
type: ClusterIP  # O omitir (es default)
```

**2. NodePort:**
- Expone puerto en cada nodo del cluster
- Rango: 30000-32767
- Accesible desde fuera: `<NodeIP>:<NodePort>`

```yaml
type: NodePort
ports:
- nodePort: 30080  # Opcional, auto-asigna si se omite
```

**3. LoadBalancer:**
- Crea load balancer externo (cloud)
- En minikube requiere `minikube tunnel`
- IP externa asignada

```yaml
type: LoadBalancer
```

### Paso 2: Service Discovery con DNS

Kubernetes tiene DNS integrado (CoreDNS). Los services son accesibles por nombre:

**Formatos de DNS:**
```
<service-name>                           # Mismo namespace
<service-name>.<namespace>               # Otro namespace
<service-name>.<namespace>.svc           # Forma corta
<service-name>.<namespace>.svc.cluster.local  # FQDN completo
```

**Ejemplo:**
```bash
# Desde cualquier pod:
curl http://backend-service           # Mismo namespace
curl http://redis.default             # Namespace default
curl http://api.production.svc        # Namespace production
```

### Paso 3: Selectors y Endpoints

El Service usa `selector` para encontrar pods:

```yaml
spec:
  selector:
    app: myapp
    version: v1
```

Kubernetes crea automáticamente **Endpoints** con las IPs de los pods que coinciden:

```bash
kubectl get endpoints myapp-v1
# NAME       ENDPOINTS           AGE
# myapp-v1   172.17.0.5:80      1m
```

### Paso 4: Load Balancing

Services distribuyen tráfico entre pods usando round-robin:

```
Client → Service (ClusterIP: 10.96.0.10)
              ↓
        Load Balancer
         ↙    ↓    ↘
    Pod1   Pod2   Pod3
```

### Paso 5: Puertos en Services

```yaml
ports:
- port: 80          # Puerto del Service (dentro del cluster)
  targetPort: 8080  # Puerto del container en el pod
  nodePort: 30080   # Puerto en el nodo (solo NodePort)
```

**Flujo:**
```
Cliente → Service:80 → Pod:8080
```

### Paso 6: Session Affinity

Por defecto, cada request puede ir a diferente pod. Para sticky sessions:

```yaml
spec:
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 3600
```

---

## Conceptos Aprendidos

- **Service**: Abstracción para exponer pods como servicio de red
- **ClusterIP**: Service interno del cluster (default)
- **NodePort**: Service accesible desde fuera del cluster via puerto del nodo
- **LoadBalancer**: Service con IP externa (cloud o minikube tunnel)
- **Selector**: Labels que identifican qué pods pertenecen al service
- **Endpoints**: Lista de IPs de pods que matchean el selector
- **Service Discovery**: DNS automático para encontrar services
- **FQDN**: Nombre completo del service (service.namespace.svc.cluster.local)
- **Port mapping**: port (service) → targetPort (pod)
- **Load Balancing**: Distribución automática de tráfico entre pods

---

## Troubleshooting

### Service no tiene Endpoints

**Síntoma:** `kubectl get endpoints <service>` muestra vacío

**Solución:**
```bash
# Verificar que selector coincide con labels de pods
kubectl describe service <name>
kubectl get pods --show-labels

# Verificar que pods están Running
kubectl get pods -l <selector>
```

### No se puede acceder al Service NodePort

**Causa:** Puerto no accesible o minikube IP incorrecta

**Solución:**
```bash
# Obtener IP correcta de minikube
minikube ip

# Verificar puerto asignado
kubectl get service <name>

# Usar helper de minikube
minikube service <name> --url
```

### LoadBalancer EXTERNAL-IP en "Pending"

**Causa:** minikube no asigna IP externa sin túnel

**Solución:**
```bash
# En terminal separada:
minikube tunnel

# Verificar IP asignada
kubectl get service <name>
```

### DNS no resuelve service

**Causa:** CoreDNS no está corriendo

**Solución:**
```bash
# Verificar CoreDNS
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Si no está, reiniciar minikube
minikube stop
minikube start
```

### Connection refused al service

**Causa:** targetPort incorrecto

**Solución:**
```bash
# Verificar puerto del container
kubectl describe pod <pod-name> | grep Port

# Actualizar targetPort en service
kubectl edit service <name>
```

---

## Desafío Adicional

### Desafío 1: Service sin Selector (Endpoints Manuales)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-db
spec:
  ports:
  - port: 5432
---
apiVersion: v1
kind: Endpoints
metadata:
  name: external-db
subsets:
- addresses:
  - ip: 192.168.1.100  # IP de DB externa
  ports:
  - port: 5432
```

Útil para servicios fuera del cluster.

### Desafío 2: Headless Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: headless
spec:
  clusterIP: None  # ← Sin ClusterIP
  selector:
    app: myapp
  ports:
  - port: 80
```

DNS retorna IPs de pods directamente (no load balancing).

### Desafío 3: ExternalName Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: google-dns
spec:
  type: ExternalName
  externalName: dns.google
```

Crea alias DNS para servicio externo.

---

## Recursos Adicionales

- [Services en Kubernetes](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Service Types](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)
- [DNS for Services](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
- [Connecting Applications](https://kubernetes.io/docs/tutorials/services/connect-applications-service/)
- [Service Topology](https://kubernetes.io/docs/concepts/services-networking/service-topology/)
