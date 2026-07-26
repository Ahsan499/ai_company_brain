import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UsersRound } from 'lucide-react';
import EmptyState from '../dashboard/EmptyState';

const TeamPerformanceTable = ({ rows = [] }) => {
  if (!rows.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
        <EmptyState
          icon={UsersRound}
          title="No teams in scope"
          description="Adjust filters to see team performance."
        />
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-2.5 md:hidden">
        {rows.map((t, i) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              to={`/dashboard/teams/${t.id}`}
              className="block rounded-[16px] border border-border/45 bg-white/90 p-3.5 shadow-sm hover:border-primary/20"
            >
              <span className="text-[13.5px] font-semibold text-heading">{t.name}</span>
              <p className="mt-0.5 text-[11.5px] text-secondaryText">
                {t.departmentName} · {t.memberCount} members
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="rounded-md bg-primary/8 px-1.5 py-0.5 text-primary ring-1 ring-primary/10">
                  {t.tasksCompleted} done
                </span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600 ring-1 ring-slate-300/50">
                  {t.hoursLabel}
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>

      <div className="hidden md:block overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto dashboard-scrollbar">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-border/50 bg-slate-50/80">
                {[
                  'Team',
                  'Members',
                  'Tasks completed',
                  'Avg cycle (days)',
                  'Hours logged',
                ].map((h) => (
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
              {rows.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/35 last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/dashboard/teams/${t.id}`}
                      className="text-[13px] font-semibold text-heading hover:text-primary"
                    >
                      {t.name}
                    </Link>
                    <p className="text-[11px] text-secondaryText">{t.departmentName}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] tabular-nums text-secondaryText">
                    {t.memberCount}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] tabular-nums font-semibold text-heading">
                    {t.tasksCompleted}
                    <span className="ml-1 font-medium text-secondaryText">
                      / {t.tasksTotal}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] tabular-nums text-secondaryText">
                    {t.avgCompletionDays == null ? '—' : t.avgCompletionDays}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] tabular-nums font-medium text-heading">
                    {t.hoursLabel}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TeamPerformanceTable;
