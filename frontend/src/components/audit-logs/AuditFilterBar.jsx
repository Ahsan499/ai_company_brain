import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import Button from '../ui/Button';
const AUDIT_ACTIONS = ['create', 'update', 'delete', 'login', 'permission_change', 'invite', 'remove'];
const AUDIT_MODULES = ['Organization', 'User', 'Department', 'Project', 'Task', 'Team', 'Meeting', 'File', 'Folder'];

const selectClass =
  'h-10 w-full rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1 min-w-0">
    <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
      {label}
    </span>
    {children}
  </label>
);

const FilterFields = ({
  query,
  onQuery,
  action,
  onAction,
  module,
  onModule,
  actorId,
  onActor,
  dateAfter,
  onDateAfter,
  dateBefore,
  onDateBefore,
  actors = [],
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-2.5 sm:gap-3">
      <Field label="Search">
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery?.(e.target.value)}
            placeholder="User or entity…"
            className={`${selectClass} pl-9`}
          />
        </div>
      </Field>

      <Field label="Action">
        <select className={selectClass} value={action} onChange={(e) => onAction?.(e.target.value)}>
          <option value="all">All actions</option>
            {AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>
                {a.replace('_', ' ')}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Module">
        <select className={selectClass} value={module} onChange={(e) => onModule?.(e.target.value)}>
          <option value="all">All modules</option>
          {AUDIT_MODULES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Actor">
        <select className={selectClass} value={actorId} onChange={(e) => onActor?.(e.target.value)}>
          <option value="all">All users</option>
          {actors.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="From">
        <input
          type="date"
          className={selectClass}
          value={dateAfter}
          onChange={(e) => onDateAfter?.(e.target.value)}
        />
      </Field>

      <Field label="To">
        <input
          type="date"
          className={selectClass}
          value={dateBefore}
          onChange={(e) => onDateBefore?.(e.target.value)}
        />
      </Field>
    </div>
  );
};

const AuditFilterBar = ({
  query,
  onQuery,
  action,
  onAction,
  module,
  onModule,
  actorId,
  onActor,
  dateAfter,
  onDateAfter,
  dateBefore,
  onDateBefore,
  mobileOpen,
  onMobileOpen,
  onMobileClose,
  onClear,
}) => {
  useEffect(() => {
    if (!mobileOpen) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const props = {
    query,
    onQuery,
    action,
    onAction,
    module,
    onModule,
    actorId,
    onActor,
    dateAfter,
    onDateAfter,
    dateBefore,
    onDateBefore,
  };

  return (
    <>
      <div className="hidden md:block rounded-[20px] border border-border/45 bg-white/90 p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <FilterFields {...props} />
      </div>

      <div className="md:hidden flex gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery?.(e.target.value)}
            placeholder="Search logs…"
            className={`${selectClass} pl-9`}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-10 rounded-xl bg-white gap-2 shrink-0"
          onClick={onMobileOpen}
        >
          <Filter size={15} />
          Filters
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 z-[70] bg-heading/25 backdrop-blur-[4px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Audit filters"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="
                fixed inset-x-0 bottom-0 z-[80] max-h-[85dvh] overflow-y-auto
                rounded-t-[24px] border border-border/40 bg-white/95 backdrop-blur-2xl
                p-4 pb-8 shadow-[0_-12px_48px_rgba(15,23,42,0.16)]
                md:hidden
              "
            >
              <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-slate-200" />
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-heading">Filters</h3>
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-heading"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <FilterFields {...props} />
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 flex-1 rounded-xl"
                  onClick={onClear}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="h-10 flex-1 rounded-xl"
                  onClick={onMobileClose}
                >
                  Apply
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuditFilterBar;
