import Infrastructure from '../components/Infrastructure';
import HealthPanel from '../components/HealthPanel';

/**
 * Infrastructure page: toolchain diagram + Kubernetes cluster + health.
 */
export default function InfrastructureView({ infrastructure, health, source }) {
  return (
    <div className="space-y-5">
      <Infrastructure infrastructure={infrastructure} source={source} />
      <div className="grid gap-5 xl:grid-cols-2">
        <HealthPanel health={health} />
      </div>
    </div>
  );
}
