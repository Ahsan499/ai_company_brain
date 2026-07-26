import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, CheckSquare, ArrowUpRight } from 'lucide-react';
import ProjectStatusBadge from './ProjectStatusBadge';
import PriorityBadge from './PriorityBadge';
import ProjectProgressBar from './ProjectProgressBar';
import MemberAvatarStack from './MemberAvatarStack';
import { formatProjectDate } from './projectData';
import { projectTaskStats } from '../tasks/taskData';

const ProjectCard = ({ project, index = 0, compact = false }) => {
  if (!project) return null;

  // Prefer API taskCounts (real ProjectResource); fall back to dummy catalog stats.
  const apiCounts = project.taskCounts;
  const dummyStats = !apiCounts ? projectTaskStats(project.id) : null;
  const done = apiCounts?.done ?? project.tasksDone ?? dummyStats?.done ?? 0;
  const total = apiCounts?.total ?? project.tasksTotal ?? dummyStats?.total ?? 0;
  const organizationName =
    project.organizationName ||
    (typeof project.organization === 'string' ? project.organization : project.organization?.name) ||
    '—';
  const departmentName =
    project.departmentName ||
    (typeof project.department === 'string' ? project.department : project.department?.name) ||
    '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
    >
      <Link
        to={`/dashboard/projects/${project.id}`}
        className={`
          group relative flex h-full flex-col
          rounded-[20px] border border-border/45 bg-white/90 backdrop-blur-sm
          ${compact ? 'p-3.5' : 'p-4 sm:p-5'}
          shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_16px_rgba(15,23,42,0.04)]
          transition-all duration-200
          hover:border-primary/20
          hover:shadow-[0_12px_32px_rgba(37,99,235,0.1)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
        `}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14.5px] font-semibold text-heading tracking-[-0.02em] leading-snug line-clamp-2 group-hover:text-primary transition-colors pr-1">
            {project.name}
          </h3>
          <ArrowUpRight
            size={15}
            className="shrink-0 text-slate-300 opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary"
          />
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-secondaryText ring-1 ring-slate-200/70 truncate max-w-[140px]">
            {organizationName}
          </span>
          <span className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/10 truncate max-w-[100px]">
            {departmentName}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <ProjectStatusBadge status={project.status} />
          <PriorityBadge priority={project.priority} />
        </div>

        <div className="mt-3.5">
          <ProjectProgressBar value={project.progress} size="sm" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
          <MemberAvatarStack members={project.members || []} max={4} size="sm" />
          <div className="text-right min-w-0">
            <p className="inline-flex items-center gap-1 text-[11px] font-medium text-secondaryText tabular-nums">
              <CheckSquare size={11} className="text-slate-400" />
              {done}/{total} tasks
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] text-slate-400">
              <CalendarDays size={10} />
              {formatProjectDate(project.dueDate)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
