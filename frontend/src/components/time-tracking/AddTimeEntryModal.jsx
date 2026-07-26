import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import Button from '../ui/Button';
import { TASKS } from '../tasks/taskData';
import { REFERENCE_TODAY } from './timeEntryData';

const INITIAL = {
  taskId: TASKS[0]?.id || '',
  date: REFERENCE_TODAY,
  hours: '1',
  minutes: '0',
  note: '',
  billable: true,
};

const CreateTimeEntryForm = ({ onClose }) => {
  const titleId = useId();
  const firstRef = useRef(null);
  const [form, setForm] = useState(INITIAL);

  useEffect(() => {
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose?.();
  };

  const selected = TASKS.find((t) => t.id === form.taskId);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      className="
        relative z-10 w-full sm:max-w-[520px]
        max-h-[92dvh] overflow-y-auto dashboard-scrollbar
        rounded-t-[24px] sm:rounded-[24px]
        border border-white/70 border-b-0 sm:border-b
        bg-white/95 backdrop-blur-2xl
        shadow-[0_24px_80px_rgba(15,23,42,0.2)]
        p-5 sm:p-6
        pb-[max(1.25rem,env(safe-area-inset-bottom))]
      "
    >
      <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-slate-200 sm:hidden" />

      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary ring-1 ring-primary/10">
            <Clock size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 id={titleId} className="text-[17px] font-semibold text-heading tracking-[-0.02em]">
              Add time entry
            </h2>
            <p className="mt-0.5 text-[12.5px] text-secondaryText">
              Log hours against a task or project.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-secondaryText hover:bg-slate-100 hover:text-heading"
          aria-label="Close"
        >
          <X size={17} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Task</label>
          <select
            ref={firstRef}
            value={form.taskId}
            onChange={set('taskId')}
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {TASKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          {selected && (
            <p className="mt-1.5 text-[12px] text-secondaryText">{selected.projectName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={set('date')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Hours</label>
            <input
              type="number"
              min="0"
              max="24"
              value={form.hours}
              onChange={set('hours')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              step="15"
              value={form.minutes}
              onChange={set('minutes')}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Note</label>
          <textarea
            value={form.note}
            onChange={set('note')}
            rows={3}
            placeholder="What did you work on…"
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.billable}
            onChange={set('billable')}
            className="h-4 w-4 rounded accent-primary"
          />
          <span className="text-[13px] font-medium text-heading">Billable</span>
        </label>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="rounded-xl shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
          >
            Add entry
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const AddTimeEntryModal = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-0 sm:p-6">
        <motion.button
          type="button"
          aria-label="Close dialog"
          className="absolute inset-0 bg-heading/25 backdrop-blur-[6px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <CreateTimeEntryForm onClose={onClose} />
      </div>
    )}
  </AnimatePresence>
);

export default AddTimeEntryModal;
