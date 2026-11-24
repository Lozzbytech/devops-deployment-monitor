/**
 * Thin wrapper around the backend REST API.
 *
 * The base URL defaults to an empty string so requests go to the same origin
 * (`/api/...`). In development Vite proxies these calls to the backend, and in
 * production Nginx proxies them to the backend container.
 */
const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`${path} responded with ${res.status}`);
  }
  return res.json();
}

export const api = {
  getHealth: () => request('/api/health'),
  getVersion: () => request('/api/version'),
  getDeployments: () => request('/api/deployments'),
  getPipeline: () => request('/api/pipeline'),
  getInfrastructure: () => request('/api/infrastructure'),
};
