# Bloque 2: Kubernetes

Este bloque cubre la orquestación de containers (contenedores) con Kubernetes, desde los conceptos fundamentales hasta el deployment (despliegue), escalado y observabilidad de aplicaciones en producción.

---

## Objetivos del bloque

Al finalizar este bloque, serás capaz de:

- Comprender la arquitectura y componentes de Kubernetes
- Desplegar y gestionar aplicaciones con Pods, Deployments y Services
- Configurar aplicaciones con ConfigMaps y Secrets
- Implementar health checks con Probes
- Configurar escalado automático (HPA) e Ingress
- Implementar observabilidad con logs, métricas, Prometheus y Grafana
- Aplicar buenas prácticas de deployment en Kubernetes

---

## Contenido

### [Clase 6: Introducción a Kubernetes](clase6-introduccion/)

Fundamentos de Kubernetes, arquitectura del cluster, y deployment básico de aplicaciones.

**Temas:**
- Arquitectura de Kubernetes (Control Plane y Worker Nodes)
- Instalación y configuración de minikube y kubectl
- Pods: Unidad mínima de despliegue
- Deployments: Gestión declarativa de aplicaciones
- Services: Exposición de aplicaciones (ClusterIP, NodePort, LoadBalancer)
- Labels, selectors y namespaces

**Labs:**
- Lab 01: Verificación del setup
- Lab 02: Primer Pod
- Lab 03: Deployments
- Lab 04: Services

---

### Clase 7: Configuración y Persistencia (próximamente)

Gestión de configuración, secrets, health checks y persistencia de datos.

**Temas:**
- ConfigMaps y Secrets
- Probes (liveness, readiness, startup)
- Ingress Controllers
- Volumes y PersistentVolumes
- StatefulSets

---

### Clase 8: Escalado y Observabilidad (próximamente)

Escalado automático y monitoreo de aplicaciones en Kubernetes.

**Temas:**
- Horizontal Pod Autoscaling (HPA)
- Resources (requests y limits)
- Prometheus y Grafana
- Logging y tracing
- Buenas prácticas de producción

---

## Proyecto Integrador - Evolución en Kubernetes

El Proyecto Integrador evoluciona en este bloque migrando la arquitectura de microservicios de Docker Compose a Kubernetes:

| Versión | Clase | Stack |
|---------|-------|-------|
| v2.0 | 6 | Migración a K8s: Spring Boot + PostgreSQL (Deployments + Services) |
| v2.1 | 7 | + ConfigMaps + Secrets + Ingress |
| v2.2 | 8 | + HPA + Prometheus + Grafana (DEMO FINAL) |

El Proyecto Integrador se muestra al final de cada clase como ejemplo de integración de los conceptos aprendidos.

---

## Requisitos Previos

Antes de comenzar este bloque, asegúrate de:

- Tener completado el Bloque 1 (Docker)
- Instalar minikube y kubectl (ver [INSTALL_KUBERNETES.md](../INSTALL_KUBERNETES.md))
- Verificar que minikube inicia correctamente
- Tener Docker funcionando (requerido por minikube)
- Tener conocimientos de YAML y línea de comandos

---

## Herramientas Utilizadas

**Cluster local:**
- minikube (Kubernetes local)
- kubectl (CLI de Kubernetes)

**Opcional:**
- k9s (Terminal UI para Kubernetes)
- Lens (Kubernetes IDE)
- Helm (Package manager para Kubernetes)

---

## Recursos adicionales

- [Documentación oficial de Kubernetes](https://kubernetes.io/docs/)
- [Kubernetes Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [CNCF Cloud Native Interactive Landscape](https://landscape.cncf.io/)

---

[← Volver al curso](../README.md)
