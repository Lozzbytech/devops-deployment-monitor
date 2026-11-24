import { Activity } from 'lucide-react';
import Card from './ui/Card';
import StatusDot from './ui/StatusDot';

/**
 * Live-ish health monitoring panel.
 * Response times jitter slightly on each poll to feel alive (still mock data).
 */
export default function HealthPanel({ health }) {
  return (
    <Card title="Application Health" subtitle="Frontend, API, database and cluster status">
      <ul className="divide-y divide-white/5">
        {health.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <StatusDot status={item.status} pulse={item.status === 'online'} />
              <div>
                <p className="text-sm font-medium text-slate-200">{item.name}</p>
                <p className="text-xs capitalize text-slate-500">{item.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Response</p>
                <p className="text-sm font-medium text-slate-200">{item.responseTime} ms</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Availability</p>
                <p className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
                  <Activity className="h-3.5 w-3.5" />
                  {item.availability.toFixed(2)}%
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
