import { useCallback, useEffect, useRef, useState } from 'react';
import { formatClock } from '../utils/format';

/**
 * Scripted pipeline simulation.
 * Each step maps to a pipeline stage; the script drives the stage statuses
 * and the log panel with realistic delays.
 */
const SCRIPT = [
  { stage: 'git', message: 'Git commit detected', delay: 900 },
  { stage: 'jenkins', message: 'Jenkins pipeline started', delay: 700 },
  { stage: 'jenkins', message: 'Installing dependencies', delay: 1100 },
  { stage: 'tests', message: 'Tests passed', delay: 1200 },
  { stage: 'sonar', message: 'SonarQube quality gate passed', delay: 1000 },
  { stage: 'docker-build', message: 'Docker image built', delay: 1300 },
  { stage: 'docker-push', message: 'Image pushed to Docker Hub', delay: 1100 },
  { stage: 'argocd', message: 'Manifest repository updated', delay: 800 },
  { stage: 'argocd', message: 'Argo CD sync completed', delay: 900 },
  { stage: 'kubernetes', message: 'Kubernetes rollout successful', delay: 1200 },
];

const STAGE_IDS = [...new Set(SCRIPT.map((s) => s.stage))];

/**
 * useSimulator
 * @param {object} options
 * @param {(newVersion: object) => void} options.onDeployComplete - called when a
 *        full deployment simulation finishes (used to bump the version + history)
 * @returns simulation state + run controls
 */
export function useSimulator({ onDeployComplete } = {}) {
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState(null); // 'pipeline' | 'deployment'
  const [logs, setLogs] = useState([]);
  const [currentStage, setCurrentStage] = useState(null);
  const [statuses, setStatuses] = useState(() => ({}));

  const abortRef = useRef(false);
  const logIdRef = useRef(0);

  // Make sure we never leave timers running after unmount / re-run.
  useEffect(() => () => { abortRef.current = true; }, []);

  const pushLog = useCallback((stage, message, level = 'info') => {
    logIdRef.current += 1;
    setLogs((prev) => [
      ...prev,
      { id: logIdRef.current, time: formatClock(), stage, message, level },
    ]);
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const run = useCallback(
    async ({ deploy = false } = {}) => {
      if (running) return;

      abortRef.current = false;
      setRunning(true);
      setMode(deploy ? 'deployment' : 'pipeline');
      setLogs([]);
      logIdRef.current = 0;

      // Reset every stage to pending before starting.
      const pending = STAGE_IDS.reduce((acc, id) => ({ ...acc, [id]: 'pending' }), {});
      setStatuses(pending);

      pushLog('system', deploy ? 'Starting simulated deployment...' : 'Starting simulated pipeline run...');

      for (const step of SCRIPT) {
        if (abortRef.current) return;

        setCurrentStage(step.stage);
        setStatuses((prev) => ({ ...prev, [step.stage]: 'running' }));
        pushLog(step.stage, step.message);

        await sleep(step.delay);
        if (abortRef.current) return;

        setStatuses((prev) => ({ ...prev, [step.stage]: 'success' }));
      }

      setCurrentStage(null);
      pushLog('system', 'Simulation finished successfully', 'success');

      if (deploy && onDeployComplete) {
        onDeployComplete();
      }

      setRunning(false);
      setMode(null);
    },
    [running, onDeployComplete, pushLog]
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    setRunning(false);
    setMode(null);
    setCurrentStage(null);
    setLogs([]);
    setStatuses({});
  }, []);

  return { running, mode, logs, currentStage, statuses, run, reset };
}

export default useSimulator;
