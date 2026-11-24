/**
 * Small formatting helpers shared across the dashboard.
 */

/** Format an ISO timestamp as a short local time (e.g. "21:04:01"). */
export function formatClock(value) {
  const d = value ? new Date(value) : new Date();
  return d.toLocaleTimeString('en-GB', { hour12: false });
}

/** Format an ISO timestamp as a readable date/time. */
export function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Format a duration given in seconds (e.g. 34 -> "34s"). */
export function formatDuration(seconds) {
  if (seconds == null) return '—';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

/** Bump a "1.2.3" style version string by one patch. */
export function bumpPatchVersion(version) {
  const clean = String(version || '1.0.0').replace(/^v/, '');
  const parts = clean.split('.').map((n) => parseInt(n, 10) || 0);
  while (parts.length < 3) parts.push(0);
  parts[2] += 1;
  return parts.join('.');
}

/** Generate a short fake git commit hash (7 hex chars). */
export function fakeCommit() {
  return Math.random().toString(16).slice(2, 9);
}
