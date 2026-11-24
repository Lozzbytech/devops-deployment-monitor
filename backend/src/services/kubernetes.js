'use strict';

/**
 * Live Kubernetes integration for the Infrastructure page.
 *
 * Reads real Deployments, Pods and Services from the cluster the API is
 * running in (or the cluster selected by your local kubeconfig), then maps
 * them to the same JSON shape the mock data uses so the UI needs no changes.
 *
 * Auth:
 *   - Inside a pod  -> the ServiceAccount token is used automatically.
 *   - Locally       -> ~/.kube/config (or the KUBECONFIG env var) is used.
 */
const k8s = require('@kubernetes/client-node');
const config = require('../config');

const NAMESPACE = process.env.K8S_NAMESPACE || 'default';

let kubeConfigCache = null;

/** Build (and cache) a KubeConfig from the cluster or the local kubeconfig. */
function loadKubeConfig() {
  if (kubeConfigCache) return kubeConfigCache;

  const kc = new k8s.KubeConfig();
  if (process.env.KUBERNETES_SERVICE_HOST) {
    // Running inside a Kubernetes pod.
    kc.loadFromCluster();
  } else {
    // Running locally - reads ~/.kube/config or KUBECONFIG.
    kc.loadFromDefault();
  }

  kubeConfigCache = kc;
  return kc;
}

/**
 * @kubernetes/client-node v1+ returns the response body directly, while older
 * versions wrap it in `{ response, body }`. Support both.
 */
function unwrap(result) {
  return result && result.body ? result.body : result;
}

/** Derive a simple, human readable pod status. */
function podStatus(pod) {
  const phase = pod.status?.phase || 'Unknown';
  const statuses = pod.status?.containerStatuses || [];
  const allReady = statuses.length > 0 && statuses.every((c) => c.ready);
  if (phase === 'Running' && !allReady) return 'Pending';
  return phase;
}

/** Group pods by their app label so we can show "N replicas". */
function appLabel(pod) {
  const labels = pod.metadata?.labels || {};
  return labels.app || labels['app.kubernetes.io/name'] || 'other';
}

/**
 * Fetch a live overview of the namespace.
 * @returns {Promise<object>} the same shape as the mock `kubernetes` block
 * @throws if no kubeconfig is available or the API call fails
 */
async function getClusterOverview() {
  const kc = loadKubeConfig();
  const coreApi = kc.makeApiClient(k8s.CoreV1Api);
  const appsApi = kc.makeApiClient(k8s.AppsV1Api);

  const [deploymentsRes, podsRes, servicesRes] = await Promise.all([
    appsApi.listNamespacedDeployment({ namespace: NAMESPACE }),
    coreApi.listNamespacedPod({ namespace: NAMESPACE }),
    coreApi.listNamespacedService({ namespace: NAMESPACE }),
  ]);

  const deploymentItems = unwrap(deploymentsRes).items || [];
  const podItems = unwrap(podsRes).items || [];
  const serviceItems = unwrap(servicesRes).items || [];

  const deployments = deploymentItems.map((d) => {
    const desired = d.spec?.replicas ?? 0;
    const ready = d.status?.readyReplicas ?? 0;
    const healthy = desired === 0 ? true : ready === desired;
    return {
      name: d.metadata?.name || 'unknown',
      pods: `${ready}/${desired} Pods Running`,
      status: healthy ? 'healthy' : 'pending',
      image: d.spec?.template?.spec?.containers?.[0]?.image || '',
    };
  });

  const groups = new Map();
  for (const pod of podItems) {
    const key = appLabel(pod);
    if (!groups.has(key)) groups.set(key, { name: key, replicas: 0, phases: [] });
    const group = groups.get(key);
    group.replicas += 1;
    group.phases.push(podStatus(pod));
  }
  const pods = [...groups.values()].map((g) => ({
    name: g.name,
    replicas: g.replicas,
    status: g.phases.every((p) => p === 'Running')
      ? 'Running'
      : g.phases.find((p) => p !== 'Running') || 'Pending',
  }));

  const services = serviceItems.map((s) => ({
    name: s.metadata?.name || 'unknown',
    type: s.spec?.type || 'ClusterIP',
    port: s.spec?.ports?.[0]?.port ?? 0,
    status: 'healthy',
  }));

  const hasProblems =
    deployments.some((d) => d.status !== 'healthy') || pods.some((p) => p.status !== 'Running');

  const image = deployments.find((d) => d.image)?.image || `devops-demo:${config.version}`;

  return {
    clusterStatus: hasProblems ? 'Degraded' : 'Healthy',
    dockerImage: image,
    deployments,
    pods,
    services,
  };
}

module.exports = { getClusterOverview, NAMESPACE };
