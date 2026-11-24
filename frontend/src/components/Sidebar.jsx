import {
  LayoutDashboard,
  Rocket,
  GitMerge,
  Boxes,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Activity,
} from 'lucide-react';
import StatusDot from './ui/StatusDot';

/**
 * Navigation items rendered in the sidebar.
 * `id` matches the view key handled in App.jsx.
 */
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'deployments', label: 'Deployments', icon: Rocket },
  { id: 'pipeline', label: 'Pipeline', icon: GitMerge },
  { id: 'infrastructure', label: 'Infrastructure', icon: Boxes },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ENVIRONMENTS = ['Development', 'Staging', 'Production'];

export default function Sidebar({
  collapsed,
  onToggle,
  view,
  onNavigate,
  environment,
  onEnvironmentChange,
  backendOnline,
}) {
  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-white/5 bg-base-900 transition-all duration-200 ${
        collapsed ? 'w-[68px]' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-indigo/15 ring-1 ring-accent-indigo/30">
          <Activity className="h-5 w-5 text-accent-indigo" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">DevOps Monitor</p>
            <p className="truncate text-[11px] text-slate-500">CI/CD Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ id, label, icon: NavIcon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-accent-indigo/15 text-white ring-1 ring-accent-indigo/30'
                  : 'text-slate-400 hover:bg-base-800 hover:text-slate-100'
              }`}
            >
              <NavIcon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-accent-indigo' : ''}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer: environment selector + system status */}
      <div className="space-y-3 border-t border-white/5 p-3">
        {!collapsed && (
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Environment
            </span>
            <select
              value={environment}
              onChange={(e) => onEnvironmentChange(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-base-800 px-2.5 py-1.5 text-sm text-slate-200 focus:border-accent-indigo/50 focus:outline-none"
            >
              {ENVIRONMENTS.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
          </label>
        )}

        <div
          className={`flex items-center gap-2 rounded-lg bg-base-800/60 px-3 py-2 ${
            collapsed ? 'justify-center' : ''
          }`}
          title={`API ${backendOnline ? 'connected' : 'offline'}`}
        >
          <StatusDot status={backendOnline ? 'online' : 'offline'} pulse={backendOnline} />
          {!collapsed && (
            <span className="truncate text-xs text-slate-400">
              {backendOnline ? 'System Operational' : 'API Offline'}
            </span>
          )}
        </div>

        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-base-800 hover:text-slate-300"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
