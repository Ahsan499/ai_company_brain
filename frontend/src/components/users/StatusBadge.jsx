import { STATUS_META } from './userData';

const StatusBadge = ({ status, className = '' }) => {
  const meta = STATUS_META[status] || STATUS_META.suspended;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2 py-0.5
        text-[10.5px] font-semibold capitalize tracking-tight ring-1 whitespace-nowrap
        ${meta.tone} ${className}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
};

export default StatusBadge;
