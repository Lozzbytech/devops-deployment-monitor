# DevOps Deployment Monitor

A lightweight full-stack dashboard that visualises a fictional software
deployment system. It exists to demonstrate an **end-to-end CI/CD pipeline**:
code build → tests → Docker image → image registry → Kubernetes → GitOps, wired
up with **Jenkins**, **Docker Hub**, **Kubernetes** and **Argo CD**.

The dashboard shows application status, version, environment, deployment status,
build metadata, a CI/CD pipeline visualisation, deployment history, an
infrastructure diagram and health monitoring — plus a clearly-labelled
**deployment simulator** so the whole flow can be demoed without real
infrastructure.

> ⚠️ **Everything infrastructure-related in the UI is a simulation / mock data.**
> The application never triggers real Jenkins jobs, Docker builds, Argo CD syncs
> or Kubernetes rollouts. The one exception is the Kubernetes cluster panel,
> which shows **live** cluster data when a cluster is reachable (see §5) and is
> labelled `LIVE` vs `MOCK` in the UI.

---

## 1. Tech stack

| Layer     | Technology                                                   |
| --------- | ------------------------------------------------------------ |
| Frontend  | React 18, Vite, JavaScript, Tailwind CSS, Lucide React icons  |
| Backend   | Node.js, Express.js, REST API                                 |
| Packaging | Docker (multi-stage), Docker Compose                          |

---

## 2. Project structure

```
devops-monitor/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI building blocks
│   │   ├── pages/           # Overview / Deployments / Pipeline / Infrastructure / Settings
│   │   ├── services/        # API client + fallback data
│   │   ├── hooks/           # usePolling, useSimulator
│   │   ├── utils/           # formatting helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── Dockerfile           # Multi-stage build → Nginx
│   ├── nginx.conf           # SPA routing + /api proxy
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/          # REST route definitions
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Mock data + live Kubernetes client
│   │   ├── app.js
│   │   ├── server.js
│   │   └── config.js        # Reads all environment variables
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

Frontend and backend are **independently buildable and containerizable**.

---

## 3. Run locally (without Docker)

### Backend

```bash
cd backend
cp .env.example .env        # optional – defaults work out of the box
npm install
npm run dev                 # http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env        # optional
npm install
npm run dev                 # http://localhost:5173
```

Vite dev server proxies `/api/*` to `http://localhost:5000`, so both apps talk
to each other with no extra configuration.

---

## 4. Run with Docker Compose

```bash
docker compose up --build
```

| Service  | URL                     |
| -------- | ----------------------- |
| Frontend | http://localhost:8080   |
| Backend  | http://localhost:5000   |

Inside the Compose network the frontend Nginx proxies `/api/*` to the
`backend` service on port `5000`.

Stop and clean up:

```bash
docker compose down
```

---

## 5. Configuration (environment variables)

Build metadata is **never hard-coded** — it is injected through environment
variables so the UI updates automatically after every pipeline run.

### Backend (`backend/.env`)

| Variable        | Default       | Description                            |
| --------------- | ------------- | -------------------------------------- |
| `PORT`          | `5000`        | API port                               |
| `APP_VERSION`   | `1.0.0`       | Displayed application version          |
| `BUILD_NUMBER`  | `1`           | Displayed build number                 |
| `GIT_COMMIT`    | `local`       | Displayed git commit id                |
| `APP_ENV`       | `development` | Environment name                       |
| `CORS_ORIGIN`   | `*`           | Allowed CORS origin(s)                 |
| `K8S_NAMESPACE` | `default`     | Namespace for the live Kubernetes view  |

### Frontend (`frontend/.env`)

| Variable            | Default                          | Description                          |
| ------------------- | -------------------------------- | ------------------------------------ |
| `VITE_APP_MESSAGE`  | `Deployed via Jenkins + Argo CD` | Visible message rendered in the UI   |
| `VITE_APP_VERSION`  | `1.0.0`                          | Frontend build version               |
| `VITE_BUILD_NUMBER` | `1`                              | Frontend build number                |
| `VITE_GIT_COMMIT`   | `local`                          | Frontend build commit                |

No credentials or secrets are stored in the repository.

### Live Kubernetes data (optional)

`GET /api/infrastructure` returns **real** Deployment / Pod / Service data when a
cluster is reachable, and falls back to mock data otherwise. The response
includes a `source` field (`"kubernetes"` or `"mock"`) and the Infrastructure
page shows a **LIVE / MOCK** badge so you always know what you are looking at.

Auth is automatic — no tokens in code:

- **Inside a pod** – the pod's ServiceAccount token is used.
- **Locally** – your `~/.kube/config` (or `KUBECONFIG`) is used.

Set `K8S_NAMESPACE` to choose the namespace. When running the API inside
Kubernetes, give its ServiceAccount a `Role`/`RoleBinding` allowing `get` and
`list` on `deployments`, `pods` and `services`.

> If your kubeconfig points at a plain `http://` API server, the client refuses
> it. Add `insecure-skip-tls-verify: true` to that cluster entry in
> `~/.kube/config`, or rely on the automatic mock fallback.

---

## 6. REST API

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/api/health`           | Backend health (used by Docker/K8s probes)         |
| GET    | `/api/version`          | Build metadata from environment variables          |
| GET    | `/api/deployments`      | Mock deployment history + stats                    |
| GET    | `/api/pipeline`         | CI/CD pipeline stages and statuses                 |
| GET    | `/api/infrastructure`   | Kubernetes topology (live) + mock toolchain/health |

Example — `GET /api/health`:

```json
{
  "status": "healthy",
  "service": "backend",
  "version": "1.0.0",
  "timestamp": "2026-11-24T13:04:01.000Z"
}
```

Example — `GET /api/version`:

```json
{
  "version": "1.0.0",
  "buildNumber": "1",
  "commit": "local",
  "environment": "development"
}
```

---

## 7. Dashboard features

- **Sidebar** – collapsible navigation, environment selector, system status.
- **Header** – page title, environment badge, refresh, last-updated time, profile.
- **Overview** – status / version / deployment frequency / build success cards,
  pipeline visualisation, health, recent deployments.
- **Pipeline** – 8 connected stages (Git Push → Jenkins → Tests → SonarQube →
  Docker Build → Docker Hub → Argo CD → Kubernetes). Click a stage for its
  description, duration, status and logs.
- **Deployments** – history table with environment and status filters.
- **Infrastructure** – toolchain diagram + **live** Kubernetes deployments, pods
  and services (falls back to mock data).
- **Health** – frontend, backend API, database and cluster with response time
  and availability.
- **Deployment Simulator** – "Run New Deployment" drives the pipeline
  stage-by-stage with realistic delays, streaming a log panel. It is explicitly
  labelled as a simulation.

---

## 8. Demonstrating a real CI/CD deployment

This is the core purpose of the project. The version and build metadata shown in
the dashboard come from environment variables, so a new commit + pipeline run
visibly changes the UI.

1. **Change a visible message** — edit `VITE_APP_MESSAGE` (in `frontend/.env`
   or your pipeline config) or bump `APP_VERSION` in `backend/.env`.
2. **Commit and push** the change to GitHub.
3. **Jenkins** checks out the repo and runs the pipeline (install → test → build).
4. **Build Docker images** for frontend and backend with the new build args:
   ```bash
   docker build -t <user>/devops-monitor-backend:1.0.1 \
     --build-arg APP_VERSION=1.0.1 ./backend
   docker build -t <user>/devops-monitor-frontend:1.0.1 \
     --build-arg VITE_APP_VERSION=1.0.1 \
     --build-arg VITE_APP_MESSAGE="Deployed by Jenkins #24" ./frontend
   ```
5. **Push the images** to Docker Hub.
6. **Update the Kubernetes manifest** (image tag / `APP_VERSION` env) in the
   GitOps manifest repository.
7. **Argo CD** detects the manifest change and syncs it to the cluster.
8. **Refresh the dashboard** — the header, "Latest Version" card and footer now
   show the new version, build number and commit.

Example metadata for a pipeline run:

```
APP_VERSION=1.0.1
BUILD_NUMBER=24
GIT_COMMIT=abc1234
```

The dashboard then displays `Version 1.0.1 · Build #24 · abc1234`.

---

## 9. Docker images

Both images are production-ready:

- **Frontend** – multi-stage: React built with Node, served by Nginx. Includes
  SPA fallback routing, gzip and an `/api` reverse proxy.
- **Backend** – lightweight `node:20-alpine`, production dependencies only,
  non-root user, exposes port `5000` and ships a `HEALTHCHECK` against
  `/api/health`.

Build them directly:

```bash
docker build -t devops-monitor-backend:1.0.0 ./backend
docker build -t devops-monitor-frontend:1.0.0 ./frontend
```

---

## 10. Notes & limitations

- All infrastructure data is **mock/simulated** by default — this is a
  demonstration dashboard, not a real monitor. The Kubernetes cluster section
  becomes **live** automatically when a cluster is reachable (see §5), and the
  UI labels it `LIVE` vs `MOCK`.
- The deployment simulator only animates the UI; it never performs real
  deployments.
- Jenkinsfiles, Argo CD `Application` manifests and Kubernetes YAML live in the
  pipeline/GitOps configuration used to deploy this app.
