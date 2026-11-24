# ---------------------------------------------------------------------------
# Multi-stage build for the DevOps Monitor frontend
# Stage 1: build the React app with Node
# Stage 2: serve the static files with Nginx
# ---------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build-time metadata (passed as --build-arg from the CI/CD pipeline)
ARG VITE_APP_VERSION=1.0.0
ARG VITE_BUILD_NUMBER=1
ARG VITE_GIT_COMMIT=local
ARG VITE_APP_MESSAGE=Deployed via Jenkins + Argo CD

ENV VITE_APP_VERSION=$VITE_APP_VERSION \
    VITE_BUILD_NUMBER=$VITE_BUILD_NUMBER \
    VITE_GIT_COMMIT=$VITE_GIT_COMMIT \
    VITE_APP_MESSAGE=$VITE_APP_MESSAGE

RUN npm run build

# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

# Custom nginx configuration (SPA routing + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
