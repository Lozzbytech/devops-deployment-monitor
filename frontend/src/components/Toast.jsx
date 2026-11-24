import { useEffect } from 'react';
import { CheckCircle2, X, AlertTriangle, Info } from 'lucide-react';

const VARIANTS = {
  success: { Icon: CheckCircle2, color: 'text-emerald-400', ring: 'ring-emerald-500/30' },
  error: { Icon: AlertTriangle, color: 'text-rose-400', ring: 'ring-rose-500/30' },
  info: { Icon: Info, color: 'text-sky-400', ring: 'ring-sky-500/30' },
};

/**
 * Lightweight toast notification, auto-dismisses after `duration` ms.
 */
export default function Toast({ toast, onClose, duration = 5000 }) {
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [toast, onClose, duration]);

  if (!toast) return null;
  const { Icon, color, ring } = VARIANTS[toast.type] || VARIANTS.info;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className={`card pointer-events-auto flex items-start gap-3 px-4 py-3 ring-1 ${ring}`}>
        <Icon className={`mt-0.5 h-5 w-5 ${color}`} />
        <div className="pr-2">
          <p className="text-sm font-medium text-white">{toast.title}</p>
          {toast.message && <p className="mt-0.5 text-xs text-slate-400">{toast.message}</p>}
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
