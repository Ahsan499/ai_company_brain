import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const SubtaskChecklist = ({ subtasks = [], onToggle }) => {
  if (!subtasks.length) {
    return <p className="text-[12.5px] text-secondaryText py-2">No subtasks.</p>;
  }

  const done = subtasks.filter((s) => s.done).length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[12px] font-semibold text-heading">Subtasks</p>
        <p className="text-[11px] font-medium text-secondaryText tabular-nums">
          {done}/{subtasks.length}
        </p>
      </div>
      <ul className="space-y-1">
        {subtasks.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onToggle?.(s.id)}
              className="
                group flex w-full items-center gap-2.5 rounded-[12px] px-2 py-2 text-left
                hover:bg-slate-50 transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
              "
            >
              <span
                className={`
                  flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all
                  ${
                    s.done
                      ? 'border-success bg-success text-white'
                      : 'border-border bg-white group-hover:border-primary/40'
                  }
                `}
              >
                {s.done && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.span>
                )}
              </span>
              <span
                className={`text-[13px] ${
                  s.done ? 'text-secondaryText line-through' : 'text-heading font-medium'
                }`}
              >
                {s.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubtaskChecklist;
