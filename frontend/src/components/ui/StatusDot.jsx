import { normaliseStatus, STATUS_META } from './StatusBadge';

/** Small coloured dot with an optional pulsing ring for "live" states. */
export default function StatusDot({ status, pulse = false, className = '' }) {
  const meta = STATUS_META[normaliseStatus(status)];
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${meta.dot} ${
        pulse ? 'animate-pulse-ring' : ''
      } ${className}`}
      aria-hidden="true"
    />
  );
}
