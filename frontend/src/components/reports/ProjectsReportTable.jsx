import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban } from 'lucide-react';
import EmptyState from '../dashboard/EmptyState';
import ProjectStatusBadge from '../projects/ProjectStatusBadge';
import ProjectProgressBar from '../projects/ProjectProgressBar';

const ProjectsReportTable = ({ rows = [] }) => {
  if (!rows.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
        <EmptyState
          icon={FolderKanban}
          title="No projects in scope"
          description="Adjust organization or department filters."
        />
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-2.5 md:hidden">
        {rows.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              to={`/dashboard/projects/${p.id}`}
              className="block rounded-[16px] border border-border/45 bg-white/90 p-3.5 shadow-sm hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13.5px] font-semibold text-heading">{p.name}</span>
                <ProjectStatusBadge status={p.status} />
              </div>
              <p className="mt-1 text-[11.5px] text-secondaryText">{p.departmentName}</p>
              <div className="mt-3">
                <ProjectProgressBar value={p.progress} />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-semibold">
                <span
                  className={`rounded-md px-1.5 py-0.5 ring-1 ${
                    p.delayed
                      ? 'bg-rose-50 text-rose-700 ring-rose-500/15'
                      : 'bg-emerald-50 text-emerald-700 ring-emerald-500/15'
                  }`}
                >
                  {p.delayed ? 'Delayed' : 'On track'}
                </span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600 ring-1 ring-slate-300/50 tabular-nums">
                  {p.tasksDone}/{p.tasksTotal} tasks
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>

      <div className="hidden md:block overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto dashboard-scrollbar">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-border/50 bg-slate-50/80">
                {['Project', 'Status', 'Department', 'Progress', 'Schedule', 'Task completion'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/35 last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/dashboard/projects/${p.id}`}
                      className="text-[13px] font-semibold text-heading hover:text-primary"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <ProjectStatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] text-secondaryText">
                    {p.departmentName}
                  </td>
                  <td className="px-4 py-3.5 min-w-[140px]">
                    <ProjectProgressBar value={p.progress} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ${
                        p.delayed
                          ? 'bg-rose-50 text-rose-700 ring-rose-500/15'
                          : 'bg-emerald-50 text-emerald-700 ring-emerald-500/15'
                      }`}
                    >
                      {p.delayed ? 'Delayed' : 'On track'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] tabular-nums text-secondaryText">
                    {p.tasksDone}/{p.tasksTotal}
                    <span className="ml-1.5 text-[11px] font-semibold text-heading">
                      ({p.completionRatio}%)
                    </span>
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

export default ProjectsReportTable;
