import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Check, ListTree } from 'lucide-react';
import PriorityBadge from '../projects/PriorityBadge';
import { formatTaskDate, isOverdue } from './taskData';

const TaskCard = ({ task, index = 0, onOpen, onToggleComplete }) => {
  if (!task) return null;
  const done = task.status === 'done';
  const overdue = isOverdue(task.dueDate, task.status);
  const subCount = task.subtasks?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.28 }}
      whileHover={{ y: -2 }}
      className={`
        rounded-[16px] border bg-white/95 p-3.5
        shadow-[0_2px_10px_rgba(15,23,42,0.04)]
        transition-all duration-200
        hover:border-primary/20 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)]
        ${done ? 'border-border/35 opacity-90' : 'border-border/45'}
      `}
    >
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={() => onToggleComplete?.(task.id)}
          aria-label={done ? 'Mark incomplete' : 'Mark complete'}
          className={`
            mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all
            ${done ? 'border-success bg-success text-white' : 'border-border bg-white hover:border-primary/50'}
          `}
        >
          {done && <Check size={12} strokeWidth={3} />}
        </button>
        <button
          type="button"
          onClick={() => onOpen?.(task.id)}
          className="min-w-0 flex-1 text-left focus:outline-none"
        >
          <p
            className={`text-[13px] font-semibold tracking-tight leading-snug line-clamp-2 ${
              done ? 'text-secondaryText line-through' : 'text-heading'
            }`}
          >
            {task.title}
          </p>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority} />
        <Link
          to={`/dashboard/projects/${task.projectId}`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-secondaryText ring-1 ring-slate-200/70 truncate max-w-[140px] hover:text-primary"
        >
          {task.projectName}
        </Link>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
        <Link
          to={`/dashboard/users/${task.assigneeId}`}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[9px] font-semibold"
          title={task.assigneeName}
          onClick={(e) => e.stopPropagation()}
        >
          {task.assigneeInitials}
        </Link>
        <div className="flex items-center gap-2 text-[11px]">
          {subCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-secondaryText tabular-nums">
              <ListTree size={11} />
              {subCount}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 font-medium tabular-nums ${
              overdue ? 'text-error' : 'text-slate-400'
            }`}
          >
            <CalendarDays size={11} />
            {formatTaskDate(task.dueDate)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
