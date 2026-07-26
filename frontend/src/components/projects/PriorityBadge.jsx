import { PRIORITY_META } from './projectData';

const PriorityBadge = ({ priority, className = '' }) => {
  const meta = PRIORITY_META[priority] || PRIORITY_META.medium;
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md px-1.5 py-0.5
        text-[10.5px] font-semibold tracking-tight ring-1 whitespace-nowrap
        ${meta.tone} ${className}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.bar}`} />
      {meta.label}
    </span>
  );
};

export default PriorityBadge;
