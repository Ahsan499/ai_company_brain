import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

/**
 * Kanban-style column grouped by project status (visual only — no DnD).
 */
const ProjectBoardColumn = ({ status, meta, projects = [], index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className={`
        flex w-[280px] sm:w-[300px] shrink-0 flex-col
        rounded-[20px] border border-border/45
        bg-gradient-to-b ${meta?.column || 'from-slate-50 to-white'}
        shadow-[0_2px_12px_rgba(15,23,42,0.04)]
        max-h-[min(70vh,720px)]
      `}
    >
      <div className="flex items-center justify-between gap-2 px-3.5 py-3 border-b border-border/40">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${meta?.tone}`}>
            {meta?.label || status}
          </span>
        </div>
        <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[11px] font-semibold text-secondaryText tabular-nums ring-1 ring-border/50">
          {projects.length}
        </span>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto dashboard-scrollbar p-2.5 sm:p-3">
        {projects.length === 0 ? (
          <p className="px-2 py-6 text-center text-[12px] text-slate-400">No projects</p>
        ) : (
          projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} compact />)
        )}
      </div>
    </motion.div>
  );
};

export default ProjectBoardColumn;
