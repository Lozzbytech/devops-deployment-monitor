'use strict';

/**
 * Realistic mock data used to power the dashboard.
 * Everything in this file is a SIMULATION - no real infrastructure is queried.
 */

/**
 * The CI/CD pipeline definition. Each stage carries an icon name that the
 * frontend maps to a Lucide React icon.
 */
const pipelineStages = () => [
  {
    id: 'git',
    name: 'Git Push',
    icon: 'GitBranch',
    status: 'success',
    duration: 2,
    description: 'Developer pushes a commit to the repository and triggers the webhook.',
    logs: [
      'Commit abc1234 pushed to refs/heads/main',
      'Webhook delivered to Jenkins',
    ],
  },
  {
    id: 'jenkins',
    name: 'Jenkins Build',
    icon: 'Hammer',
    status: 'success',
    duration: 34,
    description: 'Jenkins checks out the code and runs the declarative pipeline.',
    logs: [
      'Checking out revision abc1234',
      'Installing dependencies',
      'Pipeline completed successfully',
    ],
  },
  {
    id: 'tests',
    name: 'Tests',
    icon: 'FlaskConical',
    status: 'success',
    duration: 21,
    description: 'Automated unit and integration tests are executed.',
    logs: [
      'Running 42 tests',
      '42 passed, 0 failed',
      'Coverage 96.8%',
    ],
  },
  {
    id: 'sonar',
    name: 'SonarQube',
    icon: 'ShieldCheck',
    status: 'success',
    duration: 18,
    description: 'Static code analysis and quality gate evaluation.',
    logs: [
      'Quality gate passed',
      '0 bugs, 0 vulnerabilities',
      'Code smells within threshold',
    ],
  },
  {
    id: 'docker-build',
    name: 'Docker Build',
    icon: 'Box',
    status: 'success',
    duration: 47,
    description: 'Multi-stage Docker images are built for frontend and backend.',
    logs: [
      'Building image devops-monitor-frontend:1.0.0',
      'Building image devops-monitor-backend:1.0.0',
      'Successfully tagged images',
    ],
  },
  {
    id: 'docker-push',
    name: 'Docker Hub',
    icon: 'UploadCloud',
    status: 'success',
    duration: 29,
    description: 'Built images are pushed to the container registry.',
    logs: [
      'Pushing devops-monitor-backend:1.0.0',
      'Pushing devops-monitor-frontend:1.0.0',
      'Digest sha256:9f2c...',
    ],
  },
  {
    id: 'argocd',
    name: 'Argo CD',
    icon: 'GitMerge',
    status: 'success',
    duration: 12,
    description: 'The GitOps manifest repository is updated and synced.',
    logs: [
      'Manifest repository updated',
      'Sync status: Synced',
      'Health status: Healthy',
    ],
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: 'Boxes',
    status: 'success',
    duration: 26,
    description: 'Kubernetes performs a rolling update of the deployments.',
    logs: [
      'Rolling update triggered',
      'Waiting for rollout to finish',
      'Deployment successfully rolled out',
    ],
  },
];

/**
 * Sample deployment history. The first record is kept in sync with the
 * currently running version by the controller.
 */
const deployments = (current) => [
  {
    version: `v${current.version}`,
    commit: current.commit,
    branch: 'main',
    environment: 'Production',
    status: 'Success',
    triggeredBy: 'jenkins',
    time: new Date().toISOString(),
    duration: '2m 09s',
  },
  {
    version: 'v0.9.8',
    commit: 'b7d41e2',
    branch: 'main',
    environment: 'Production',
    status: 'Success',
    triggeredBy: 'jenkins',
    time: '2026-11-20T14:32:00Z',
    duration: '2m 01s',
  },
  {
    version: 'v0.9.7',
    commit: '3f8a90c',
    branch: 'develop',
    environment: 'Staging',
    status: 'Failed',
    triggeredBy: 'pranjal',
    time: '2026-11-19T09:14:00Z',
    duration: '1m 12s',
  },
  {
    version: 'v0.9.6',
    commit: 'c1e7b55',
    branch: 'main',
    environment: 'Production',
    status: 'Success',
    triggeredBy: 'jenkins',
    time: '2026-11-18T18:05:00Z',
    duration: '2m 04s',
  },
  {
    version: 'v0.9.5',
    commit: '9a2d0f1',
    branch: 'feature/health',
    environment: 'Development',
    status: 'Success',
    triggeredBy: 'pranjal',
    time: '2026-11-17T11:48:00Z',
    duration: '1m 58s',
  },
];

/**
 * Infrastructure graph (nodes + edges) rendered by the frontend diagram.
 */
const infrastructure = () => ({
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
});

/**
 * Health of the simulated components.
 */
const health = () => [
  { name: 'Frontend', status: 'online', responseTime: 42, availability: 99.99 },
  { name: 'Backend API', status: 'online', responseTime: 18, availability: 99.97 },
  { name: 'Database (mock)', status: 'online', responseTime: 7, availability: 99.95 },
  { name: 'Kubernetes Cluster (mock)', status: 'online', responseTime: 12, availability: 100 },
];

module.exports = {
  pipelineStages,
  deployments,
  infrastructure,
  health,
};
