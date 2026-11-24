import { useEffect, useRef } from 'react';
import { Play, Terminal, Rocket, Info, Trash2 } from 'lucide-react';
import Card from './ui/Card';
import { normaliseStatus, STATUS_META } from './ui/StatusBadge';

/**
 * "Run New Deployment" control plus a live simulated log panel.
 * Clearly labelled as a simulation so it is not mistaken for real infra.
 */
export default function DeploymentSimulator({ simulator, onRunPipeline, onRunDeployment }) {
  const { running, mode, logs, currentStage, reset } = simulator;
  const scrollRef = useRef(null);

  // Auto-scroll the log panel as new lines arrive.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card
      title="Deployment Simulator"
      subtitle="Simulation only — no real infrastructure is touched"
      actions={
        <span className="chip bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30">
          <Info className="h-3.5 w-3.5" />
          SIMULATION
        </span>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={onRunDeployment} disabled={running} className="btn-primary">
          <Rocket className={`h-4 w-4 ${running && mode === 'deployment' ? 'animate-pulse' : ''}`} />
          {running && mode === 'deployment' ? 'Deploying…' : 'Run New Deployment'}
        </button>

        <button onClick={onRunPipeline} disabled={running} className="btn-ghost">
          <Play className="h-4 w-4" />
          Run Pipeline
        </button>

        {logs.length > 0 && !running && (
          <button onClick={reset} className="btn-ghost ml-auto">
            <Trash2 className="h-4 w-4" />
            Clear Log
          </button>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-white/5 bg-base-950/90">
        <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
          <span className="flex items-center gap-2 font-mono text-xs text-slate-500">
            <Terminal className="h-3.5 w-3.5" />
            deployment.log
          </span>
          {running && currentStage && (
            <span className="chip bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30">
              {STATUS_META[normaliseStatus('running')].label} · {currentStage}
            </span>
          )}
        </div>
        <div
          ref={scrollRef}
          className="max-h-56 overflow-y-auto p-3 font-mono text-xs leading-relaxed"
        >
          {logs.length === 0 ? (
            <p className="text-slate-600">
              Click “Run New Deployment” to simulate a full CI/CD run…
            </p>
          ) : (
            logs.map((line) => (
              <div key={line.id} className="whitespace-pre-wrap">
                <span className="text-slate-600">[{line.time}]</span>{' '}
                <span
                  className={
                    line.level === 'success'
                      ? 'text-emerald-400'
                      : line.stage === 'system'
                        ? 'text-accent-indigo'
                        : 'text-slate-300'
                  }
                >
                  {line.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
