'use strict';

/**
 * Central place where every environment variable is read.
 * Values fall back to safe defaults so the container always starts,
 * even when no CI/CD variables have been provided.
 */
const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  corsOrigin: process.env.CORS_ORIGIN || '*',

  // Build metadata injected by the pipeline (Jenkins / Kubernetes).
  version: process.env.APP_VERSION || '1.0.0',
  buildNumber: process.env.BUILD_NUMBER || '1',
  commit: process.env.GIT_COMMIT || 'local',
  environment: process.env.APP_ENV || 'development',
};

module.exports = config;
