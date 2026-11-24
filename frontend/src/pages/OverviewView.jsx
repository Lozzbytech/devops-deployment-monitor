import { Activity, Tag, TrendingUp, CheckCircle2, GitCommitHorizontal, Hash } from 'lucide-react';
import StatCard from '../components/StatCard';
import Pipeline from '../components/Pipeline';
import DeploymentTable from '../components/DeploymentTable';
import HealthPanel from '../components/HealthPanel';
import Card from '../components/ui/Card';
import StatusDot from '../components/ui/StatusDot';

/**
 * Overview page: headline statistics, pipeline visualisation,
 * application health and the most recent deployments.
 */
export default function OverviewView({
  version,
  stats,
  pipeline,
  deployments,
  health,
  activeStageId,
  onSelectStage,
}) {
  return (
    <div className="space-y-5">
      {/* Statistic cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Application Status"
          value="RUNNING"
          accent="emerald"
          sublabel={`${version?.environment ?? 'development'} environment`}
          badge={
            <span className="inline-flex items-center gap-2 text-xs text-emerald-400">
              <StatusDot status="online" pulse />
              All systems operational
            </span>
          }
        />
        <StatCard
          icon={Tag}
          label="Latest Version"
          value={`v${version?.version ?? '1.0.0'}`}
          accent="indigo"
          sublabel={
            <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Build {version?.buildNumber ?? '1'}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitCommitHorizontal className="h-3 w-3" />
                {version?.commit ?? 'local'}
              </span>
            </span>
          }
        />
        <StatCard
          icon={TrendingUp}
          label="Deployment Frequency"
          value={`${stats.deploymentFrequency} deployments`}
          accent="purple"
          sublabel="Last 30 days"
        />
        <StatCard
          icon={CheckCircle2}
          label="Build Success Rate"
          value={`${stats.buildSuccessRate}%`}
          accent="sky"
          sublabel="Across recent builds"
        />
      </div>

      {/* Pipeline visualisation */}
      <Card
        title="CI/CD Pipeline"
        subtitle="Git Push → Jenkins → Tests → SonarQube → Docker → Argo CD → Kubernetes"
      >
        <Pipeline stages={pipeline} activeStageId={activeStageId} onSelectStage={onSelectStage} />
      </Card>

      {/* Health + recent deployments */}
      <div className="grid gap-5 xl:grid-cols-2">
        <HealthPanel health={health} />
        <DeploymentTable deployments={deployments} limit={4} showFilters={false} />
      </div>
    </div>
  );
}
