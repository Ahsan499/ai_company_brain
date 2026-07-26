import { TASK_STATUS_META } from './taskData';

const TaskStatusBadge = ({ status, className = '' }) => {
  const meta = TASK_STATUS_META[status] || TASK_STATUS_META.todo;
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

export default TaskStatusBadge;
