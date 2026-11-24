/**
 * Reusable statistic card used in the Overview grid.
 * `accent` selects the icon colour ring, `value` is the hero number/text.
 */
export default function StatCard({ icon: Icon, label, value, sublabel, accent = 'indigo', badge }) {
  const accents = {
    emerald: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/20',
    indigo: 'text-accent-indigo bg-accent-indigo/10 ring-accent-indigo/20',
    sky: 'text-sky-400 bg-sky-500/10 ring-sky-500/20',
    amber: 'text-amber-400 bg-amber-500/10 ring-amber-500/20',
    purple: 'text-accent-purple bg-accent-purple/10 ring-accent-purple/20',
  };

  return (
    <div className="card card-hover animate-fade-in p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold text-white">{value}</p>
          {sublabel && <p className="mt-1 text-xs text-slate-500">{sublabel}</p>}
        </div>
        {Icon && (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ${accents[accent]}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      {badge && <div className="mt-3">{badge}</div>}
    </div>
  );
}
