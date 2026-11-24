'use strict';

const mockData = require('../services/mockData');
const kubernetes = require('../services/kubernetes');
const config = require('../config');

/**
 * GET /api/health
 * Simple liveness/readiness probe used by Docker and Kubernetes.
 */
exports.getHealth = (req, res) => {
  res.json({
    status: 'healthy',
    service: 'backend',
    version: config.version,
    timestamp: new Date().toISOString(),
  });
};

/**
 * GET /api/version
 * Returns the build metadata injected through environment variables.
 */
exports.getVersion = (req, res) => {
  res.json({
    version: config.version,
    buildNumber: config.buildNumber,
    commit: config.commit,
    environment: config.environment,
    // Extra UX metadata for the dashboard
    branch: config.environment === 'production' ? 'main' : 'develop',
    buildTime: new Date().toISOString(),
  });
};

/**
 * GET /api/deployments
 * Mock deployment history.
 */
exports.getDeployments = (req, res) => {
  res.json({
    deployments: mockData.deployments(config),
    stats: {
      deploymentFrequency: 12,
      buildSuccessRate: 96.8,
    },
  });
};

/**
 * GET /api/pipeline
 * Inactive CI/CD pipeline definition.
 */
exports.getPipeline = (req, res) => {
  res.json({
    pipeline: mockData.pipelineStages(),
  });
};

/**
 * GET /api/infrastructure
 * Live Kubernetes topology when a cluster is reachable, otherwise mock data.
 * `source` tells the dashboard whether it is looking at real or mock data.
 */
exports.getInfrastructure = async (req, res) => {
  const infra = mockData.infrastructure();
  infra.kubernetes.dockerImage = `devops-demo:${config.version}`;

  let source = 'mock';
  try {
    const live = await kubernetes.getClusterOverview();
    if (live) {
      infra.kubernetes = live;
      source = 'kubernetes';
    }
  } catch (err) {
    console.warn(
      `Kubernetes API unavailable (namespace "${kubernetes.NAMESPACE}"), using mock data: ${err.message}`
    );
  }

  res.json({
    infrastructure: infra,
    health: mockData.health(),
    source,
  });
};
