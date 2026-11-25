# ---------------------------------------------------------------------------
# Production image for the DevOps Monitor backend
# ---------------------------------------------------------------------------
FROM node:24-alpine

# Create a non-root user for better security
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Install production dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy the application source
COPY src ./src

USER app

# Build metadata - overridden at build/run time by the CI/CD pipeline
ENV NODE_ENV=production \
    PORT=5000 \
    APP_VERSION=1.0.0 \
    BUILD_NUMBER=1 \
    GIT_COMMIT=local \
    APP_ENV=production

EXPOSE 5000

# Container level health check hitting the API health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "src/server.js"]
