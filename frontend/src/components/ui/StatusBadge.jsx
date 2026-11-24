import { CheckCircle2, XCircle, Clock, Loader2, CircleDashed } from 'lucide-react';

/**
 * Status vocabulary shared by badges, dots and the pipeline.
 * Every status maps to a label, a colour class and an icon.
 */
export const STATUS_META = {
  success: { label: 'Success', color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/30', dot: 'bg-emerald-400', Icon: CheckCircle2 },
  healthy: { label: 'Healthy', color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/30', dot: 'bg-emerald-400', Icon: CheckCircle2 },
  online: { label: 'Online', color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/30', dot: 'bg-emerald-400', Icon: CheckCircle2 },
  running: { label: 'Running', color: 'text-sky-400', bg: 'bg-sky-500/10', ring: 'ring-sky-500/30', dot: 'bg-sky-400', Icon: Loader2, spin: true },
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', ring: 'ring-amber-500/30', dot: 'bg-amber-400', Icon: Clock },
  queued: { label: 'Queued', color: 'text-amber-400', bg: 'bg-amber-500/10', ring: 'ring-amber-500/30', dot: 'bg-amber-400', Icon: Clock },
  failed: { label: 'Failed', color: 'text-rose-400', bg: 'bg-rose-500/10', ring: 'ring-rose-500/30', dot: 'bg-rose-400', Icon: XCircle },
  offline: { label: 'Offline', color: 'text-rose-400', bg: 'bg-rose-500/10', ring: 'ring-rose-500/30', dot: 'bg-rose-400', Icon: XCircle },
  idle: { label: 'Idle', color: 'text-slate-400', bg: 'bg-slate-500/10', ring: 'ring-slate-500/30', dot: 'bg-slate-500', Icon: CircleDashed },
};

/** Normalise any incoming status string into a known key. */
export function normaliseStatus(status) {
  const key = String(status || '').toLowerCase();
  return STATUS_META[key] ? key : 'idle';
}

/** Pill-shaped status badge with icon. */
export default function StatusBadge({ status, className = '' }) {
  const meta = STATUS_META[normaliseStatus(status)];
  const { Icon } = meta;
  return (
    <span className={`chip ${meta.bg} ${meta.color} ring-1 ${meta.ring} ${className}`}>
      <Icon className={`h-3.5 w-3.5 ${meta.spin ? 'animate-spin' : ''}`} />
      {meta.label}
    </span>
  );
}
