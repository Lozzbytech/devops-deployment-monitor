import Pipeline from '../components/Pipeline';
import DeploymentSimulator from '../components/DeploymentSimulator';
import Card from '../components/ui/Card';

/**
 * Pipeline page: full pipeline diagram, interactive simulator and logs.
 */
export default function PipelineView({
  pipeline,
  simulator,
  activeStageId,
  onSelectStage,
  onRunPipeline,
  onRunDeployment,
}) {
  return (
    <div className="space-y-5">
      <Card
        title="Deployment Pipeline"
        subtitle="Click any stage to inspect its details and logs"
      >
        <Pipeline stages={pipeline} activeStageId={activeStageId} onSelectStage={onSelectStage} />
      </Card>

      <DeploymentSimulator
        simulator={simulator}
        onRunPipeline={onRunPipeline}
        onRunDeployment={onRunDeployment}
      />
    </div>
  );
}
