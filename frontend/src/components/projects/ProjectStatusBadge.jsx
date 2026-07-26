import { PROJECT_STATUS_META } from './projectData';

const ProjectStatusBadge = ({ status, className = '' }) => {
  const meta = PROJECT_STATUS_META[status] || PROJECT_STATUS_META.planning;
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2 py-0.5
        text-[10.5px] font-semibold tracking-tight ring-1 whitespace-nowrap
        ${meta.tone} ${className}
      `}
    >
      {meta.label}
    </span>
  );
};

export default ProjectStatusBadge;
