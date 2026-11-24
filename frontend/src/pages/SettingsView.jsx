import Card from '../components/ui/Card';
import StatusDot from '../components/ui/StatusDot';

const ENDPOINTS = [
  { method: 'GET', path: '/api/health', desc: 'Backend liveness/readiness probe' },
  { method: 'GET', path: '/api/version', desc: 'Build metadata from environment variables' },
  { method: 'GET', path: '/api/deployments', desc: 'Mock deployment history' },
  { method: 'GET', path: '/api/pipeline', desc: 'CI/CD pipeline stages' },
  { method: 'GET', path: '/api/infrastructure', desc: 'Mock infrastructure topology' },
];

const BACKEND_ENV = ['APP_VERSION', 'BUILD_NUMBER', 'GIT_COMMIT', 'APP_ENV', 'PORT', 'CORS_ORIGIN'];
const FRONTEND_ENV = ['VITE_APP_MESSAGE', 'VITE_APP_VERSION', 'VITE_BUILD_NUMBER', 'VITE_GIT_COMMIT'];

/**
 * Settings page: environment configuration, build metadata and API reference.
 */
export default function SettingsView({ version, backendOnline, message }) {
  const fe = {
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    buildNumber: import.meta.env.VITE_BUILD_NUMBER || '1',
    commit: import.meta.env.VITE_GIT_COMMIT || 'local',
    message: import.meta.env.VITE_APP_MESSAGE || 'Deployed via Jenkins + Argo CD',
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Backend Build Info" subtitle="Injected at runtime from environment variables">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <Field label="Version" value={version?.version} />
            <Field label="Build Number" value={version?.buildNumber} />
            <Field label="Commit" value={version?.commit} mono />
            <Field label="Environment" value={version?.environment} />
          </dl>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <StatusDot status={backendOnline ? 'online' : 'offline'} pulse={backendOnline} />
            API {backendOnline ? 'reachable at /api' : 'unreachable — showing fallback data'}
          </div>
        </Card>

        <Card title="Frontend Build Info" subtitle="Baked into the bundle at build time">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <Field label="Version" value={fe.version} />
            <Field label="Build Number" value={fe.buildNumber} />
            <Field label="Commit" value={fe.commit} mono />
            <Field label="Message" value={fe.message} />
          </dl>
          <p className="mt-4 text-xs text-slate-500">
            Change <span className="font-mono text-slate-400">VITE_APP_MESSAGE</span> and rebuild to
            verify the CI/CD pipeline end-to-end.
          </p>
        </Card>
      </div>

      <Card title="REST API" subtitle="Endpoints exposed by the backend">
        <ul className="divide-y divide-white/5">
          {ENDPOINTS.map((e) => (
            <li key={e.path} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className="chip w-14 justify-center bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                {e.method}
              </span>
              <span className="font-mono text-sm text-slate-300">{e.path}</span>
              <span className="ml-auto text-xs text-slate-500">{e.desc}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Backend Environment Variables">
          <ul className="space-y-1.5 font-mono text-xs text-slate-400">
            {BACKEND_ENV.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </Card>
        <Card title="Frontend Environment Variables">
          <ul className="space-y-1.5 font-mono text-xs text-slate-400">
            {FRONTEND_ENV.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Current Message" subtitle="Rendered from VITE_APP_MESSAGE">
        <p className="text-sm text-slate-200">{message}</p>
      </Card>
    </div>
  );
}

function Field({ label, value, mono = false }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className={`mt-1 text-slate-200 ${mono ? 'font-mono text-xs' : ''}`}>{value ?? '—'}</dd>
    </div>
  );
}
