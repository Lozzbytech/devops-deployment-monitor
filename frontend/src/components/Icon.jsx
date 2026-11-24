import {
  GitBranch,
  Hammer,
  FlaskConical,
  ShieldCheck,
  Box,
  UploadCloud,
  GitMerge,
  Boxes,
  Github,
  Server,
  Database,
  Cpu,
  Activity,
  LayoutDashboard,
  Rocket,
  Settings,
  Network,
} from 'lucide-react';

/**
 * Maps the icon names returned by the backend to real Lucide components.
 * Keeping the mapping in one place lets the API send plain strings.
 */
const iconMap = {
  GitBranch,
  Hammer,
  FlaskConical,
  ShieldCheck,
  Box,
  UploadCloud,
  GitMerge,
  Boxes,
  Github,
  Server,
  Database,
  Cpu,
  Activity,
  LayoutDashboard,
  Rocket,
  Settings,
  Network,
};

/** Render a Lucide icon by name, falling back to a generic server icon. */
export default function Icon({ name, ...props }) {
  const Component = iconMap[name] || Server;
  return <Component {...props} />;
}
