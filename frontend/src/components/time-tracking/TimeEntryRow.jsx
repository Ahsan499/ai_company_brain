import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { formatHours, formatHoursDecimal } from './timeEntryData';

const TimeEntryRow = ({ entry, index = 0, onEdit, onDelete }) => {
  if (!entry) return null;

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="
        flex flex-col sm:flex-row sm:items-center gap-3
        rounded-[16px] border border-border/45 bg-white/90
        px-3.5 py-3.5
        shadow-[0_2px_10px_rgba(15,23,42,0.03)]
        hover:border-primary/15 transition-colors
      "
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/dashboard/tasks/${entry.taskId}`}
            className="text-[13px] font-semibold text-heading hover:text-primary truncate"
          >
            {entry.taskTitle}
          </Link>
          {entry.billable ? (
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/15">
              Billable
            </span>
          ) : (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-300/50">
              Non-billable
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[12px] text-secondaryText">
          <Link
            to={`/dashboard/projects/${entry.projectId}`}
            className="hover:text-primary"
          >
            {entry.projectName}
          </Link>
          <span className="text-slate-300"> · </span>
          {entry.date}
          <span className="text-slate-300"> · </span>
          <span className="font-semibold tabular-nums text-heading/80">
            {formatHours(entry.durationMinutes)} ({formatHoursDecimal(entry.durationMinutes)}h)
          </span>
        </p>
        {entry.note && (
          <p className="mt-1 text-[12px] text-secondaryText line-clamp-1">{entry.note}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit?.(entry)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-heading"
          aria-label="Edit entry"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(entry.id)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-error"
          aria-label="Delete entry"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.li>
  );
};

export default TimeEntryRow;
