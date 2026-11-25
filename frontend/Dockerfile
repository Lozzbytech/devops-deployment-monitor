# Stage 1: Build React application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build metadata
ARG VITE_APP_VERSION=1.0.0
ARG VITE_BUILD_NUMBER=1
ARG VITE_GIT_COMMIT=local
ARG VITE_APP_MESSAGE="Deployed via Jenkins + Argo CD"

ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV VITE_BUILD_NUMBER=${VITE_BUILD_NUMBER}
ENV VITE_GIT_COMMIT=${VITE_GIT_COMMIT}
ENV VITE_APP_MESSAGE=${VITE_APP_MESSAGE}

RUN npm run build

# Stage 2: Nginx production image
FROM nginx:alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check (single line)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]