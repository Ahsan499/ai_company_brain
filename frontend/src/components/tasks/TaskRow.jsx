import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Check, ListTree } from 'lucide-react';
import PriorityBadge from '../projects/PriorityBadge';
import TaskStatusBadge from './TaskStatusBadge';
import { formatTaskDate, isOverdue } from './taskData';

const TaskRow = ({
  task,
  compact = false,
  onOpen,
  onToggleComplete,
  showProject = true,
}) => {
  if (!task) return null;
  const done = task.status === 'done';
  const overdue = isOverdue(task.dueDate, task.status);
  const subCount = task.subtasks?.length || 0;
  const subDone = task.subtasks?.filter((s) => s.done).length || 0;

  return (
    <motion.tr
      layout
      className={`
        group border-b border-border/35 last:border-0
        transition-colors duration-150
        ${done ? 'bg-slate-50/40' : 'hover:bg-slate-50/80'}
      `}
    >
      <td className="px-3 py-3 w-12">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete?.(task.id);
          }}
          aria-label={done ? 'Mark incomplete' : 'Mark complete'}
          className={`
            flex h-5 w-5 items-center justify-center rounded-md border transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
            ${
              done
                ? 'border-success bg-success text-white'
                : 'border-border bg-white hover:border-primary/50'
            }
          `}
        >
          {done && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Check size={12} strokeWidth={3} />
            </motion.span>
          )}
        </button>
      </td>
      <td className="px-3 py-3 min-w-[200px]">
        <button
          type="button"
          onClick={() => onOpen?.(task.id)}
          className="text-left w-full focus:outline-none"
        >
          <span
            className={`block text-[13px] font-semibold tracking-tight truncate ${
              done ? 'text-secondaryText line-through' : 'text-heading group-hover:text-primary'
            }`}
          >
            {task.title}
          </span>
          {!compact && showProject && (
            <Link
              to={`/dashboard/projects/${task.projectId}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 inline-block text-[11.5px] font-medium text-secondaryText hover:text-primary truncate max-w-full"
            >
              {task.projectName}
            </Link>
          )}
        </button>
      </td>
      {showProject && !compact && (
        <td className="px-3 py-3 hidden md:table-cell">
          <Link
            to={`/dashboard/projects/${task.projectId}`}
            className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[10.5px] font-semibold text-primary ring-1 ring-primary/10 hover:bg-primary/10"
            onClick={(e) => e.stopPropagation()}
          >
            {task.projectName}
          </Link>
        </td>
      )}
      <td className="px-3 py-3 hidden sm:table-cell">
        <Link
          to={`/dashboard/users/${task.assigneeId}`}
          className="inline-flex items-center gap-2 hover:opacity-90"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[9px] font-semibold">
            {task.assigneeInitials}
          </span>
          {!compact && (
            <span className="text-[12.5px] font-medium text-heading truncate max-w-[100px]">
              {task.assigneeName}
            </span>
          )}
        </Link>
      </td>
      <td className="px-3 py-3">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="px-3 py-3 hidden lg:table-cell">
        <TaskStatusBadge status={task.status} />
      </td>
      <td className="px-3 py-3">
        <span
          className={`inline-flex items-center gap-1 text-[12px] font-medium tabular-nums whitespace-nowrap ${
            overdue ? 'text-error' : 'text-secondaryText'
          }`}
        >
          <CalendarDays size={11} />
          {formatTaskDate(task.dueDate)}
        </span>
      </td>
      <td className="px-3 py-3 hidden xl:table-cell">
        {subCount > 0 ? (
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-secondaryText tabular-nums">
            <ListTree size={12} className="text-slate-400" />
            {subDone}/{subCount}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </td>
    </motion.tr>
  );
};

export default TaskRow;
