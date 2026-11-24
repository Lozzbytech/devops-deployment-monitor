import { useState, useEffect } from 'react';
import { ChevronRight, Terminal } from 'lucide-react';
import Icon from './Icon';
import StatusBadge, { normaliseStatus, STATUS_META } from './ui/StatusBadge';
import Card from './ui/Card';
import { formatDuration } from '../utils/format';

/**
 * Horizontal CI/CD pipeline visualisation.
 * Stages are connected and clickable - selecting one reveals a detail panel.
 */
export default function Pipeline({ stages, activeStageId, onSelectStage }) {
  const selected = stages.find((s) => s.id === activeStageId) || stages[0];

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-center gap-1 px-1">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <StageNode
                stage={stage}
                active={selected?.id === stage.id}
                onClick={() => onSelectStage(stage.id)}
              />
              {index < stages.length - 1 && <Connector status={stages[index + 1].status} />}
            </div>
          ))}
        </div>
      </div>

      {selected && <StageDetail stage={selected} />}
    </div>
  );
}

function StageNode({ stage, active, onClick }) {
  const meta = STATUS_META[normaliseStatus(stage.status)];
  const { Icon: StatusIcon } = meta;

  return (
    <button
      onClick={onClick}
      className={`flex w-[104px] flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-all ${
        active
          ? 'border-accent-indigo/40 bg-accent-indigo/5'
          : 'border-white/5 bg-base-850 hover:border-white/10 hover:bg-base-800'
      }`}
    >
      <span
        className={`relative flex h-11 w-11 items-center justify-center rounded-full ring-1 ${meta.bg} ${meta.ring}`}
      >
        <Icon name={stage.icon} className={`h-5 w-5 ${meta.color}`} />
        <StatusIcon
          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-base-950 p-[1px] ${meta.color} ${
            meta.spin ? 'animate-spin' : ''
          }`}
        />
      </span>
      <span className="text-[12px] font-medium leading-tight text-slate-200">{stage.name}</span>
      <span className={`text-[11px] font-medium ${meta.color}`}>{meta.label}</span>
      <span className="text-[10px] text-slate-500">{formatDuration(stage.duration)}</span>
    </button>
  );
}

function Connector({ status }) {
  const ok = normaliseStatus(status) === 'success';
  return (
    <div className="flex items-center px-1" aria-hidden="true">
      <span className={`h-px w-6 ${ok ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
      <ChevronRight className={`-ml-1 h-3.5 w-3.5 ${ok ? 'text-emerald-500/60' : 'text-white/20'}`} />
    </div>
  );
}

function StageDetail({ stage }) {
  const [tab, setTab] = useState('details');

  // Reset to the details tab whenever a different stage is selected.
  useEffect(() => {
    setTab('details');
  }, [stage.id]);

  return (
    <Card
      title={stage.name}
      subtitle={stage.description}
      actions={<StatusBadge status={stage.status} />}
    >
      <div className="mb-3 flex gap-1 rounded-lg bg-base-800/60 p-1 text-xs">
        {['details', 'logs'].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md px-3 py-1.5 font-medium capitalize transition-colors ${
              tab === key ? 'bg-base-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {tab === 'details' ? (
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Detail label="Status" value={STATUS_META[normaliseStatus(stage.status)].label} />
          <Detail label="Duration" value={formatDuration(stage.duration)} />
          <Detail label="Stage" value={stage.name} />
          <Detail label="Stage ID" value={stage.id} mono />
        </dl>
      ) : (
        <div className="rounded-lg border border-white/5 bg-base-950/80 p-3 font-mono text-xs leading-relaxed text-slate-300">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <Terminal className="h-3.5 w-3.5" /> stage logs
          </div>
          {stage.logs?.length ? (
            stage.logs.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                <span className="text-slate-600">$ </span>
                {line}
              </div>
            ))
          ) : (
            <div className="text-slate-600">No logs available for this stage.</div>
          )}
        </div>
      )}
    </Card>
  );
}

function Detail({ label, value, mono = false }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className={`mt-1 text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  );
}
