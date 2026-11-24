import DeploymentTable from '../components/DeploymentTable';
import DeploymentSimulator from '../components/DeploymentSimulator';

/**
 * Deployments page: full deployment history with filters and the simulator.
 */
export default function DeploymentsView({ deployments, simulator, onRunPipeline, onRunDeployment }) {
  return (
    <div className="space-y-5">
      <DeploymentTable deployments={deployments} />
      <DeploymentSimulator
        simulator={simulator}
        onRunPipeline={onRunPipeline}
        onRunDeployment={onRunDeployment}
      />
    </div>
  );
}
