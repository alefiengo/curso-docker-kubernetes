# Docker & Kubernetes: Containers (Contenedores) y Orquestación en la Práctica

Repositorio oficial del curso de **i-Quattro** enfocado en el uso profesional de containers (contenedores) con Docker y su orquestación con Kubernetes.

**[Información del curso](https://www.i-quattro.com/product-page/dok-kub-001)**

---

## Información General

**Duración:** 20 horas
**Modalidad:** 100% práctico con laboratorios en cada sesión

### Objetivos

Formar a los participantes en el uso de containers (contenedores) con Docker y su orquestación con Kubernetes, aplicando buenas prácticas de deployment (despliegue), escalabilidad y observabilidad en entornos productivos.

### Valor Diferencial

- Curso 100% práctico con laboratorios en cada sesión
- Preparación base para certificaciones CKAD/CKA
- Ejemplos orientados a casos reales (banca, retail, telecomunicaciones)
- Instructores con experiencia en proyectos cloud-native y DevOps

---

## Dirigido a

- **Desarrolladores** que deseen empaquetar y desplegar sus aplicaciones
- **Administradores de sistemas y DevOps** que necesiten gestionar infraestructura con contenedores
- **Estudiantes avanzados** de informática/ingeniería interesados en cloud-native

---

## Contenido del Curso

1. **[Introducción a containers (contenedores) y Docker](bloque-docker/clase1-introduccion/)**
2. Manejo de images (imágenes), containers (contenedores) y networks (redes)
3. Docker avanzado y Docker Compose
4. Seguridad en imágenes y escaneo de vulnerabilidades
5. Arquitectura de Kubernetes
6. Pods, Deployments y Services
7. ConfigMaps, Secrets y Probes
8. Escalado automático (HPA) e Ingress
9. Observabilidad (logs, métricas, Prometheus/Grafana)
10. Proyecto final integrador

---

## Prerrequisitos

### Instalaciones necesarias

- **Docker Desktop** (Windows/macOS) o **Docker Engine** (Linux) - [Guía de instalación](INSTALL_DOCKER.md)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/downloads)
- [Google Chrome](https://www.google.com/chrome/)
- [Postman](https://www.postman.com/downloads/)

### Instalaciones opcionales

- **WSL2 + Ubuntu 24.04.1 LTS** (recomendado para Windows) - [Guía de instalación](INSTALL_WSL.md)
- [Terminal Warp](https://www.warp.dev/)

---

## Cómo usar este repositorio

Cada clase contiene:
- **README.md** con objetivos y referencias a laboratorios
- **labs/** con ejercicios prácticos paso a paso
- **scripts/** con herramientas de utilidad
- **cheatsheet.md** con comandos de referencia rápida

Recomendamos clonar el repositorio y seguir las clases en orden:

```bash
git clone https://github.com/alefiengo/curso-docker-kubernetes.git
cd curso-docker-kubernetes/bloque-docker/clase1-introduccion
```

---

## Proyecto Integrador

El curso incluye un **proyecto integrador full-stack** que evoluciona progresivamente clase a clase.

**📦 Repositorio:** [proyecto-integrador-docker-k8s](https://github.com/alefiengo/proyecto-integrador-docker-k8s)

### Stack Completo (Clase 8)
- Spring Boot + Angular
- PostgreSQL + Redis
- Kong (Docker) / NGINX Ingress (Kubernetes)
- Prometheus + Grafana + Loki
- HPA (Autoscaling)

**[Ver más detalles →](PROYECTO_INTEGRADOR.md)**

---

## Notas

- Este repositorio es **público** y forma parte del curso oficial de i-Quattro
- El material está diseñado para estudiantes matriculados, pero es de libre acceso para la comunidad
- Si te resulta útil, ¡considera dejar una ⭐ en GitHub!

---

## Uso del Material

Este repositorio es **público** y de libre acceso para la comunidad. Siéntete libre de usarlo para aprender, practicar y compartir conocimiento.

---

**[i-Quattro](https://www.i-quattro.com/)** | Formación en Cloud-Native y DevOps
