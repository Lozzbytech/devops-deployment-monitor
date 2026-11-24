import { ChevronDown, Boxes, Layers } from 'lucide-react';
import Icon from './Icon';
import Card from './ui/Card';
import StatusDot from './ui/StatusDot';
import { normaliseStatus, STATUS_META } from './ui/StatusBadge';

/**
 * Visual infrastructure diagram:
 *   GitHub -> Jenkins -> Docker Build -> Docker Hub -> Argo CD -> Kubernetes
 * plus a Kubernetes cluster panel showing deployments, pods and services.
 */
export default function Infrastructure({ infrastructure, source = 'mock' }) {
  const { pipeline, kubernetes } = infrastructure;
  const clusterHealthy = kubernetes.clusterStatus === 'Healthy';

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="CI/CD Infrastructure" subtitle="GitOps toolchain (simulated)">
        <ol className="space-y-1">
          {pipeline.map((node, index) => (
            <li key={node.id}>
              <InfraNode node={node} />
              {index < pipeline.length - 1 && (
                <div className="flex justify-center py-1">
                  <ChevronDown className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </Card>

      <Card
        title="Kubernetes Cluster"
        subtitle={kubernetes.dockerImage}
        actions={
          <div className="flex items-center gap-2">
            <SourceBadge source={source} />
            <span
              className={`chip ring-1 ${
                clusterHealthy
                  ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 ring-amber-500/30'
              }`}
            >
              <StatusDot status={clusterHealthy ? 'healthy' : 'pending'} />
              {kubernetes.clusterStatus}
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          <SubHeading icon={Boxes} label="Deployments" />
          <div className="grid gap-3 sm:grid-cols-2">
            {kubernetes.deployments.map((d) => (
              <KubeTile key={d.name} title={d.name} value={d.pods} status={d.status} />
            ))}
          </div>

          <SubHeading icon={Layers} label="Pods" />
          <div className="grid gap-3 sm:grid-cols-2">
            {kubernetes.pods.map((p) => (
              <KubeTile
                key={p.name}
                title={p.name}
                value={`${p.replicas} replicas`}
                status={p.status === 'Running' ? 'success' : 'pending'}
              />
            ))}
          </div>

          <SubHeading icon={Layers} label="Services" />
          <ul className="space-y-2">
            {kubernetes.services.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-base-800/50 px-3 py-2 text-sm"
              >
                <span className="font-mono text-slate-300">{s.name}</span>
                <span className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{s.type}</span>
                  <span>:{s.port}</span>
                  <StatusDot status={s.status} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

function InfraNode({ node }) {
  const meta = STATUS_META[normaliseStatus(node.status)];
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-base-800/50 px-4 py-2.5 transition-colors hover:border-white/10">
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${meta.bg} ${meta.ring}`}>
        <Icon name={node.icon} className={`h-4 w-4 ${meta.color}`} />
      </span>
      <span className="flex-1 text-sm font-medium text-slate-200">{node.name}</span>
      <span className={`flex items-center gap-1.5 text-xs font-medium ${meta.color}`}>
        <StatusDot status={node.status} />
        {meta.label}
      </span>
    </div>
  );
}

function KubeTile({ title, value, status }) {
  return (
    <div className="card card-hover rounded-lg border border-white/5 bg-base-800/50 p-3">
      <p className="text-xs font-medium text-slate-300">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{value}</p>
      <div className="mt-2">
        <StatusDot status={status} pulse={status === 'success'} />
      </div>
    </div>
  );
}

function SubHeading({ icon: HeadingIcon, label }) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      <HeadingIcon className="h-3.5 w-3.5" />
      {label}
    </p>
  );
}

/** Tells the user whether the cluster data is live or mocked. */
function SourceBadge({ source }) {
  const live = source === 'kubernetes';
  return (
    <span
      className={`chip ring-1 ${
        live
          ? 'bg-sky-500/10 text-sky-400 ring-sky-500/30'
          : 'bg-slate-500/10 text-slate-400 ring-slate-500/30'
      }`}
      title={live ? 'Live data from the Kubernetes API' : 'Mock data — no cluster reachable'}
    >
      {live ? 'LIVE' : 'MOCK'}
    </span>
  );
}
