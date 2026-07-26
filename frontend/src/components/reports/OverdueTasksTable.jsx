import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDownUp, CheckSquare } from 'lucide-react';
import EmptyState from '../dashboard/EmptyState';
import PriorityBadge from '../projects/PriorityBadge';

const OverdueTasksTable = ({ rows = [], onOpenTask }) => {
  const [sort, setSort] = useState('days');

  const sorted = useMemo(() => {
    const list = [...rows];
    if (sort === 'title') return list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'assignee') {
      return list.sort((a, b) => (a.assigneeName || '').localeCompare(b.assigneeName || ''));
    }
    return list.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }, [rows, sort]);

  if (!rows.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
        <EmptyState
          icon={CheckSquare}
          title="No overdue tasks"
          description="Everything in scope is on track."
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="border-b border-border/40 px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold text-heading">Overdue tasks</h3>
          <p className="mt-0.5 text-[12px] text-secondaryText">
            Past due and not marked done
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-[12px] font-medium text-secondaryText">
          <ArrowDownUp size={13} />
          <select
            className="h-9 rounded-xl border border-border/60 bg-white px-2.5 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="days">Days overdue</option>
            <option value="title">Title</option>
            <option value="assignee">Assignee</option>
          </select>
        </label>
      </div>

      <ul className="space-y-2.5 p-3 md:hidden">
        {sorted.map((t, i) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <button
              type="button"
              onClick={() => onOpenTask?.(t.id)}
              className="w-full rounded-[16px] border border-border/45 bg-white p-3.5 text-left shadow-sm hover:border-primary/20"
            >
              <span className="block text-[13px] font-semibold text-heading">{t.title}</span>
              <span className="mt-1 block text-[11.5px] text-secondaryText">
                {t.assigneeName} · {t.projectName}
              </span>
              <span className="mt-2 inline-flex rounded-md bg-rose-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-rose-700 ring-1 ring-rose-500/15">
                {t.daysOverdue}d overdue
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <div className="hidden md:block overflow-x-auto dashboard-scrollbar">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-border/50 bg-slate-50/80">
              {['Task', 'Assignee', 'Project', 'Priority', 'Days overdue'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-border/35 last:border-0 hover:bg-slate-50/70 cursor-pointer"
                onClick={() => onOpenTask?.(t.id)}
              >
                <td className="px-4 py-3.5">
                  <span className="text-[13px] font-semibold text-heading hover:text-primary">
                    {t.title}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <Link
                    to={`/dashboard/users/${t.assigneeId}`}
                    className="text-[12.5px] font-medium text-heading hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t.assigneeName}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <Link
                    to={`/dashboard/projects/${t.projectId}`}
                    className="text-[12.5px] text-secondaryText hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t.projectName}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <PriorityBadge priority={t.priority} />
                </td>
                <td className="px-4 py-3.5">
                  <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-500/15 tabular-nums">
                    {t.daysOverdue}d
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverdueTasksTable;
