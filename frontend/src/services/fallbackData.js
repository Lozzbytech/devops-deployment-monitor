/**
 * Fallback data used when the backend API is unreachable.
 * This keeps the dashboard usable (for UI demos) even without the API running.
 */
export const fallbackVersion = {
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  buildNumber: import.meta.env.VITE_BUILD_NUMBER || '1',
  commit: import.meta.env.VITE_GIT_COMMIT || 'local',
  environment: 'development',
  branch: 'main',
};

export const fallbackPipeline = [
  { id: 'git', name: 'Git Push', icon: 'GitBranch', status: 'success', duration: 2, description: 'Webhook triggered from GitHub.', logs: ['Commit pushed to main'] },
  { id: 'jenkins', name: 'Jenkins Build', icon: 'Hammer', status: 'success', duration: 34, description: 'Jenkins runs the declarative pipeline.', logs: ['Dependencies installed'] },
  { id: 'tests', name: 'Tests', icon: 'FlaskConical', status: 'success', duration: 21, description: 'Automated test suite.', logs: ['42 passed, 0 failed'] },
  { id: 'sonar', name: 'SonarQube', icon: 'ShieldCheck', status: 'success', duration: 18, description: 'Static analysis.', logs: ['Quality gate passed'] },
  { id: 'docker-build', name: 'Docker Build', icon: 'Box', status: 'success', duration: 47, description: 'Build container images.', logs: ['Images built'] },
  { id: 'docker-push', name: 'Docker Hub', icon: 'UploadCloud', status: 'success', duration: 29, description: 'Push images to registry.', logs: ['Images pushed'] },
  { id: 'argocd', name: 'Argo CD', icon: 'GitMerge', status: 'success', duration: 12, description: 'GitOps sync.', logs: ['Synced'] },
  { id: 'kubernetes', name: 'Kubernetes', icon: 'Boxes', status: 'success', duration: 26, description: 'Rolling update.', logs: ['Rollout complete'] },
];

export const fallbackDeployments = [
  { version: 'v1.0.0', commit: 'local', branch: 'main', environment: 'Production', status: 'Success', triggeredBy: 'jenkins', time: new Date().toISOString(), duration: '2m 09s' },
  { version: 'v0.9.8', commit: 'b7d41e2', branch: 'main', environment: 'Production', status: 'Success', triggeredBy: 'jenkins', time: '2026-11-20T14:32:00Z', duration: '2m 01s' },
  { version: 'v0.9.7', commit: '3f8a90c', branch: 'develop', environment: 'Staging', status: 'Failed', triggeredBy: 'pranjal', time: '2026-11-19T09:14:00Z', duration: '1m 12s' },
  { version: 'v0.9.6', commit: 'c1e7b55', branch: 'main', environment: 'Production', status: 'Success', triggeredBy: 'jenkins', time: '2026-11-18T18:05:00Z', duration: '2m 04s' },
];

export const fallbackInfrastructure = {
  pipeline: [
    { id: 'github', name: 'GitHub', icon: 'Github', status: 'healthy' },
    { id: 'jenkins', name: 'Jenkins', icon: 'Hammer', status: 'healthy' },
    { id: 'docker-build', name: 'Docker Build', icon: 'Box', status: 'healthy' },
    { id: 'docker-hub', name: 'Docker Hub', icon: 'UploadCloud', status: 'healthy' },
    { id: 'argocd', name: 'Argo CD', icon: 'GitMerge', status: 'healthy' },
    { id: 'kubernetes', name: 'Kubernetes', icon: 'Boxes', status: 'healthy' },
  ],
  kubernetes: {
    clusterStatus: 'Healthy',
    dockerImage: 'devops-demo:1.0.0',
    deployments: [
      { name: 'Frontend Deployment', pods: '2/2 Pods Running', status: 'healthy' },
      { name: 'Backend Deployment', pods: '2/2 Pods Running', status: 'healthy' },
    ],
    pods: [
      { name: 'frontend', replicas: 2, status: 'Running' },
      { name: 'backend', replicas: 2, status: 'Running' },
    ],
    services: [
      { name: 'frontend-service', type: 'ClusterIP', port: 80, status: 'healthy' },
      { name: 'backend-service', type: 'ClusterIP', port: 5000, status: 'healthy' },
    ],
  },
};

export const fallbackHealth = [
  { name: 'Frontend', status: 'online', responseTime: 42, availability: 99.99 },
  { name: 'Backend API', status: 'online', responseTime: 18, availability: 99.97 },
  { name: 'Database (mock)', status: 'online', responseTime: 7, availability: 99.95 },
  { name: 'Kubernetes Cluster (mock)', status: 'online', responseTime: 12, availability: 100 },
];
