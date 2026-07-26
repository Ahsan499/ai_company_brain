import { motion } from 'framer-motion';
import TaskCard from './TaskCard';

const TaskBoardColumn = ({ status, meta, tasks = [], index = 0, onOpen, onToggleComplete }) => {
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
        transition-shadow duration-200 hover:shadow-[0_8px_28px_rgba(15,23,42,0.08)]
      `}
    >
      <div className="flex items-center justify-between gap-2 px-3.5 py-3 border-b border-border/40">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${meta?.tone}`}>
          {meta?.label || status}
        </span>
        <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[11px] font-semibold text-secondaryText tabular-nums ring-1 ring-border/50">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 space-y-2.5 overflow-y-auto dashboard-scrollbar p-2.5 sm:p-3">
        {tasks.length === 0 ? (
          <p className="px-2 py-6 text-center text-[12px] text-slate-400">No tasks</p>
        ) : (
          tasks.map((t, i) => (
            <TaskCard
              key={t.id}
              task={t}
              index={i}
              onOpen={onOpen}
              onToggleComplete={onToggleComplete}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TaskBoardColumn;
