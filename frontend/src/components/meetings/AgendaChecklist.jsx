import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2 } from 'lucide-react';

const AgendaChecklist = ({ items = [], onToggle, onAdd, onDelete }) => {
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || !onAdd) return;
    onAdd(title);
    setNewTitle('');
  };

  const done = items.filter((s) => s.done).length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[12px] font-semibold text-heading">Agenda</p>
        <p className="text-[11px] font-medium text-secondaryText tabular-nums">
          {done}/{items.length}
        </p>
      </div>

      {items.length === 0 && !onAdd && (
        <p className="text-[12.5px] text-secondaryText py-2">No agenda items.</p>
      )}

      <ul className="space-y-1">
        {items.map((s) => (
          <li key={s.id} className="group flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggle?.(s.id)}
              className="
                flex w-full items-center gap-2.5 rounded-[12px] px-2 py-2 text-left
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
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(s.id)}
                className="opacity-0 group-hover:opacity-100 shrink-0 h-7 w-7 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-error transition-all"
                aria-label="Delete agenda item"
              >
                <Trash2 size={13} />
              </button>
            )}
          </li>
        ))}
      </ul>

      {onAdd && (
        <form onSubmit={handleAdd} className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add agenda item…"
            className="flex-1 h-8 rounded-lg border border-border/50 bg-white px-2.5 text-[12.5px] text-heading placeholder:text-slate-400 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/12"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 transition-colors"
            aria-label="Add"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </form>
      )}
    </div>
  );
};

export default AgendaChecklist;
