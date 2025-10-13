# Clase 6: Introducción a Kubernetes

Bienvenido a la primera clase de Kubernetes. En esta sesión aprenderás los fundamentos de Kubernetes, desde la arquitectura básica hasta el despliegue y exposición de aplicaciones.

---

## Objetivos de Aprendizaje

- Comprender la arquitectura básica de Kubernetes
- Instalar y configurar minikube y kubectl
- Crear y gestionar Pods
- Desplegar aplicaciones con Deployments
- Exponer aplicaciones con Services
- Entender los conceptos de labels, selectors y namespaces

---

## Requisitos Previos

Antes de la clase, **debes completar**:

- [ ] Instalar minikube y kubectl (ver [INSTALL_KUBERNETES.md](../../INSTALL_KUBERNETES.md))
- [ ] Verificar que minikube inicia correctamente
- [ ] Tener Docker funcionando (requerido por minikube)

---

## Conceptos Clave

### Arquitectura de Kubernetes

**Control Plane (Master):**
- **API Server**: Punto de entrada para todas las operaciones
- **etcd**: Base de datos distribuida del estado del cluster
- **Scheduler**: Asigna pods a nodos
- **Controller Manager**: Ejecuta controladores del cluster

**Worker Nodes:**
- **kubelet**: Agente que ejecuta en cada nodo
- **kube-proxy**: Gestiona reglas de red
- **Container Runtime**: Docker, containerd, etc.

### Recursos Principales

**Pod**: Unidad mínima de despliegue (uno o más containers)

**Deployment**: Gestiona el despliegue declarativo y actualizaciones de aplicaciones

**Service**: Abstracción para exponer pods como servicio de red

**Namespace**: Espacio virtual para organizar recursos

---

## Demo Práctica

### [FastAPI Products API en Kubernetes](demos/fastapi-products-k8s/)
Demo completa de despliegue de una aplicación REST API en Kubernetes. Integra todos los conceptos de la clase: Dockerfile multi-stage, Deployment con 3 réplicas, Service NodePort, labels y selectors, health checks y auto-healing.

**Incluye:** Aplicación FastAPI, manifiestos K8s, script de verificación automatizada y README paso a paso.

---

## Laboratorios de la Clase

### [Lab 01: Verificación del Setup](labs/01-verificacion-setup/)
Verifica que minikube y kubectl estén correctamente instalados. Explora los componentes del cluster y familiarízate con los comandos básicos de inspección.

**Conceptos:** Control plane, worker nodes, namespaces, componentes del sistema

---

### [Lab 02: Primer Pod](labs/02-primer-pod/)
Crea tu primer pod en Kubernetes usando comandos imperativos y archivos YAML declarativos. Aprende la diferencia entre ambos enfoques y gestiona pods multi-container.

**Conceptos:** Pods, containers, labels, port-forwarding, multi-container pods

---

### [Lab 03: Deployments](labs/03-deployments/)
Aprende a usar Deployments para gestionar réplicas de pods, realizar actualizaciones rolling, rollbacks y aprovechar el auto-healing de Kubernetes.

**Conceptos:** Deployments, ReplicaSets, rolling updates, rollback, self-healing, scaling

---

### [Lab 04: Services](labs/04-services/)
Expone tus aplicaciones usando Services. Aprende los diferentes tipos (ClusterIP, NodePort, LoadBalancer) y cómo funciona el service discovery con DNS.

**Conceptos:** Services, ClusterIP, NodePort, LoadBalancer, endpoints, DNS, selectors

---

## Tareas

### [Desafío Rápido](tareas/desafio-rapido.md)
Ejercicio práctico de 5 minutos: desplegar la API de productos, experimentar con escalado y verificar el auto-healing de Kubernetes.

**Para resolver:** Al final de la clase

---

### [Tarea para Casa](tareas/tarea-casa.md)
Crea una aplicación multi-tier completa (frontend + backend + base de datos) desplegada en Kubernetes con Deployments y Services.

**Entrega:** Antes de la Clase 7

**Puntos:** 100 + puntos extra opcionales

---

## Cheatsheet

- [Comandos y Conceptos - Clase 6](cheatsheet.md)

Referencia rápida de todos los comandos kubectl aprendidos en esta clase.

---

## Recursos Adicionales

### Documentación Oficial
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
- [kubectl Reference](https://kubernetes.io/docs/reference/kubectl/)
- [minikube Documentation](https://minikube.sigs.k8s.io/docs/)

### Tutoriales Interactivos
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Play with Kubernetes](https://labs.play-with-k8s.com/)

### Herramientas Útiles
- [k9s](https://k9scli.io/) - Terminal UI para Kubernetes
- [Lens](https://k8slens.dev/) - Kubernetes IDE
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

---

## Notas Importantes

### Diferencias con Docker

| Aspecto | Docker | Kubernetes |
|---------|--------|------------|
| Unidad básica | Container | Pod |
| Orquestación | Docker Compose | Deployments |
| Networking | docker network | Services |
| Gestión | Imperativa | Declarativa |
| Escalado | Manual | Automático |

### Buenas Prácticas

**YAML Declarativo:**
- Usa archivos YAML para producción
- Versionarlos en Git
- Representa el estado deseado

**Labels:**
- Usa labels consistentes (`app`, `env`, `version`)
- Permiten organización y selección flexible

**Namespaces:**
- Separa ambientes (dev, staging, prod)
- Organiza recursos por equipo o proyecto

**Resources:**
- Define requests y limits
- Evita problemas de recursos

---

## Troubleshooting Común

### minikube no inicia
```bash
minikube delete
minikube start --driver=docker --cpus=2 --memory=4096
```

### kubectl no se conecta
```bash
minikube status
kubectl cluster-info
```

### Pod en ImagePullBackOff
```bash
kubectl describe pod <name>
# Verificar nombre de imagen
```

### Service no accesible
```bash
kubectl get endpoints <service>
# Verificar selector y labels coinciden
```

---

## Siguiente Clase

En la **Clase 7** veremos:
- ConfigMaps y Secrets
- Probes (liveness, readiness)
- Ingress
- Persistencia de datos

**Preparación:**
- Completar la tarea para casa
- Leer sobre ConfigMaps y Secrets
- Tener el cluster funcionando
