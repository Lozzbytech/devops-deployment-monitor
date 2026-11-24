import { useMemo, useState } from 'react';
import { GitCommitHorizontal, GitBranch, Filter } from 'lucide-react';
import Card from './ui/Card';
import StatusBadge from './ui/StatusBadge';
import { formatDateTime } from '../utils/format';

const ENV_OPTIONS = ['All', 'Production', 'Staging', 'Development'];
const STATUS_OPTIONS = ['All', 'Success', 'Failed'];

/**
 * Deployment history table with environment + status filtering.
 * `limit` can be used to show a short preview on the Overview page.
 */
export default function DeploymentTable({ deployments, limit, showFilters = true }) {
  const [env, setEnv] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return deployments.filter(
      (d) =>
        (env === 'All' || d.environment === env) &&
        (status === 'All' || d.status === status)
    );
  }, [deployments, env, status]);

  const rows = limit ? filtered.slice(0, limit) : filtered;

  return (
    <Card
      title="Deployment History"
      subtitle={`${filtered.length} deployment${filtered.length === 1 ? '' : 's'}`}
      bodyClassName="px-0 py-0"
      actions={
        showFilters && (
          <div className="flex items-center gap-2">
            <Filter className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
            <Select value={env} onChange={setEnv} options={ENV_OPTIONS} label="Environment" />
            <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} label="Status" />
          </div>
        )
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <Th>Version</Th>
              <Th>Commit</Th>
              <Th>Branch</Th>
              <Th>Environment</Th>
              <Th>Status</Th>
              <Th>Triggered By</Th>
              <Th>Time</Th>
              <Th>Duration</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d, i) => (
              <tr
                key={`${d.version}-${d.commit}-${i}`}
                className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.02]"
              >
                <Td className="font-medium text-white">{d.version}</Td>
                <Td>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400">
                    <GitCommitHorizontal className="h-3.5 w-3.5" />
                    {d.commit}
                  </span>
                </Td>
                <Td>
                  <span className="inline-flex items-center gap-1.5 text-slate-400">
                    <GitBranch className="h-3.5 w-3.5" />
                    {d.branch}
                  </span>
                </Td>
                <Td className="text-slate-300">{d.environment}</Td>
                <Td>
                  <StatusBadge status={d.status} />
                </Td>
                <Td className="text-slate-400">{d.triggeredBy}</Td>
                <Td className="text-slate-400">{formatDateTime(d.time)}</Td>
                <Td className="text-slate-400">{d.duration}</Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500">
                  No deployments match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Select({ value, onChange, options, label }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-white/10 bg-base-800 px-2 py-1 text-xs text-slate-300 focus:border-accent-indigo/50 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Th({ children }) {
  return <th className="whitespace-nowrap px-5 py-3 font-medium">{children}</th>;
}

function Td({ children, className = '' }) {
  return <td className={`whitespace-nowrap px-5 py-3 ${className}`}>{children}</td>;
}
