import { RefreshCw, User, Bell } from 'lucide-react';

/**
 * Top header bar: page title, environment badge, last updated time,
 * refresh button and a user profile icon.
 */
export default function Header({ title, environment, lastUpdated, onRefresh, refreshing }) {
  const badgeColor =
    environment === 'Production'
      ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30'
      : environment === 'Staging'
        ? 'bg-amber-500/10 text-amber-400 ring-amber-500/30'
        : 'bg-sky-500/10 text-sky-400 ring-sky-500/30';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-base-900/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        <span className={`chip uppercase tracking-wide ring-1 ${badgeColor}`}>{environment}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-slate-500 sm:block">
          Last updated {lastUpdated}
        </span>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="btn-ghost"
          title="Refresh data"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button className="btn-ghost px-2" title="Notifications">
          <Bell className="h-4 w-4" />
        </button>

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-indigo/15 ring-1 ring-accent-indigo/30"
          title="Signed in as pranjal"
        >
          <User className="h-4 w-4 text-accent-indigo" />
        </div>
      </div>
    </header>
  );
}
