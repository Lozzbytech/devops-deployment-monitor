import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

import OverviewView from './pages/OverviewView';
import DeploymentsView from './pages/DeploymentsView';
import PipelineView from './pages/PipelineView';
import InfrastructureView from './pages/InfrastructureView';
import SettingsView from './pages/SettingsView';

import { api } from './services/api';
import {
  fallbackVersion,
  fallbackDeployments,
  fallbackPipeline,
  fallbackInfrastructure,
  fallbackHealth,
} from './services/fallbackData';

import usePolling from './hooks/usePolling';
import useSimulator from './hooks/useSimulator';
import { bumpPatchVersion, fakeCommit, formatClock } from './utils/format';

const PAGE_TITLES = {
  overview: 'Deployment Overview',
  deployments: 'Deployments',
  pipeline: 'Pipeline',
  infrastructure: 'Infrastructure',
  settings: 'Settings',
};

export default function App() {
  const [view, setView] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [environment, setEnvironment] = useState('Production');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('—');

  const [version, setVersion] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [stats, setStats] = useState({ deploymentFrequency: 12, buildSuccessRate: 96.8 });
  const [pipeline, setPipeline] = useState([]);
  const [infrastructure, setInfrastructure] = useState(null);
  const [infraSource, setInfraSource] = useState('mock');
  const [health, setHealth] = useState([]);
  const [activeStageId, setActiveStageId] = useState('jenkins');
  const [toast, setToast] = useState(null);

  const baseHealthRef = useRef([]);

  const message = import.meta.env.VITE_APP_MESSAGE || 'Deployed via Jenkins + Argo CD';

  // -------------------------------------------------------------------------
  // Data loading (with graceful fallback when the API is unreachable)
  // -------------------------------------------------------------------------
  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const [ver, dep, pipe, infra] = await Promise.all([
        api.getVersion(),
        api.getDeployments(),
        api.getPipeline(),
        api.getInfrastructure(),
      ]);
      setVersion(ver);
      setDeployments(dep.deployments);
      setStats(dep.stats);
      setPipeline(pipe.pipeline);
      setInfrastructure(infra.infrastructure);
      setInfraSource(infra.source || 'kubernetes');
      setHealth(infra.health);
      baseHealthRef.current = infra.health;
      setBackendOnline(true);
    } catch (err) {
      // Backend down - keep the UI usable with local fallback data.
      console.warn('API unavailable, using fallback data:', err.message);
      setVersion(fallbackVersion);
      setDeployments(fallbackDeployments);
      setPipeline(fallbackPipeline);
      setInfrastructure(fallbackInfrastructure);
      setInfraSource('mock');
      setHealth(fallbackHealth);
      baseHealthRef.current = fallbackHealth;
      setBackendOnline(false);
    } finally {
      setLastUpdated(formatClock());
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Lightweight liveness poll + small response-time jitter so health feels live.
  usePolling(
    useCallback(async () => {
      try {
        await api.getHealth();
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
      const base = baseHealthRef.current;
      if (base.length) {
        setHealth(
          base.map((h) => ({
            ...h,
            responseTime: Math.max(3, h.responseTime + Math.round((Math.random() - 0.5) * 6)),
          }))
        );
      }
    }, []),
    15000
  );

  // -------------------------------------------------------------------------
  // Deployment simulation
  // -------------------------------------------------------------------------
  const handleDeployComplete = useCallback(() => {
    const nextVersion = bumpPatchVersion(version?.version || '1.0.0');
    const nextBuild = (parseInt(version?.buildNumber, 10) || 1) + 1;
    const commit = fakeCommit();
    const branch = environment === 'Production' ? 'main' : 'develop';
    const now = new Date().toISOString();

    setVersion((v) => ({
      ...v,
      version: nextVersion,
      buildNumber: String(nextBuild),
      commit,
      branch,
    }));

    setDeployments((prev) => [
      {
        version: `v${nextVersion}`,
        commit,
        branch,
        environment,
        status: 'Success',
        triggeredBy: 'jenkins',
        time: now,
        duration: '2m 09s',
      },
      ...prev,
    ]);

    setStats((s) => ({ ...s, deploymentFrequency: s.deploymentFrequency + 1 }));
    setToast({
      type: 'success',
      title: `Deployment successful — v${nextVersion}`,
      message: `Build #${nextBuild} (${commit}) rolled out to ${environment}.`,
    });
  }, [version, environment]);

  const simulator = useSimulator({ onDeployComplete: handleDeployComplete });

  const onRunPipeline = useCallback(() => simulator.run({ deploy: false }), [simulator]);
  const onRunDeployment = useCallback(() => simulator.run({ deploy: true }), [simulator]);

  // Overlay simulated stage statuses on top of the loaded pipeline.
  const mergedPipeline = useMemo(
    () =>
      pipeline.map((stage) =>
        simulator.statuses[stage.id] ? { ...stage, status: simulator.statuses[stage.id] } : stage
      ),
    [pipeline, simulator.statuses]
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="flex h-screen overflow-hidden bg-base-950">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        view={view}
        onNavigate={setView}
        environment={environment}
        onEnvironmentChange={setEnvironment}
        backendOnline={backendOnline}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={PAGE_TITLES[view]}
          environment={environment}
          lastUpdated={lastUpdated}
          onRefresh={() => loadData({ silent: true })}
          refreshing={refreshing}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading dashboard…
            </div>
          ) : (
            <div className="mx-auto max-w-[1400px] space-y-5">
              {view === 'overview' && (
                <OverviewView
                  version={version}
                  stats={stats}
                  pipeline={mergedPipeline}
                  deployments={deployments}
                  health={health}
                  activeStageId={activeStageId}
                  onSelectStage={setActiveStageId}
                />
              )}

              {view === 'deployments' && (
                <DeploymentsView
                  deployments={deployments}
                  simulator={simulator}
                  onRunPipeline={onRunPipeline}
                  onRunDeployment={onRunDeployment}
                />
              )}

              {view === 'pipeline' && (
                <PipelineView
                  pipeline={mergedPipeline}
                  simulator={simulator}
                  activeStageId={activeStageId}
                  onSelectStage={setActiveStageId}
                  onRunPipeline={onRunPipeline}
                  onRunDeployment={onRunDeployment}
                />
              )}

              {view === 'infrastructure' && infrastructure && (
                <InfrastructureView
                  infrastructure={infrastructure}
                  health={health}
                  source={infraSource}
                />
              )}

              {view === 'settings' && (
                <SettingsView version={version} backendOnline={backendOnline} message={message} />
              )}

              <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-4 text-xs text-slate-600">
                <span>
                  DevOps Monitor · v{version?.version ?? '1.0.0'} · build #{version?.buildNumber ?? '1'} ·{' '}
                  <span className="font-mono">{version?.commit ?? 'local'}</span>
                </span>
                <span>{message}</span>
              </footer>
            </div>
          )}
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
