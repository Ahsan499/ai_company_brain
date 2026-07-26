import { AnimatePresence, motion } from 'framer-motion';
import { UserCog, UserX, X } from 'lucide-react';
import { USER_ROLES } from './userData';
import Button from '../ui/Button';

/**
 * Bulk actions — desktop floating bar / mobile bottom sheet style.
 */
const BulkActionBar = ({
  count = 0,
  onClear,
  onDeactivate,
  onRoleChange,
}) => {
  return (
    <AnimatePresence>
      {count > 0 && (
        <>
          {/* Mobile bottom sheet bar */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="
              fixed inset-x-0 bottom-0 z-40 sm:hidden
              border-t border-border/50 bg-white/95 backdrop-blur-xl
              px-4 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]
              shadow-[0_-12px_40px_rgba(15,23,42,0.12)]
            "
          >
            <div className="mx-auto mb-2.5 h-1 w-9 rounded-full bg-slate-200" />
            <BulkContent
              count={count}
              onClear={onClear}
              onDeactivate={onDeactivate}
              onRoleChange={onRoleChange}
              compact
            />
          </motion.div>

          {/* Desktop floating bar */}
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="
              pointer-events-none fixed inset-x-0 bottom-6 z-40 hidden sm:flex justify-center px-4
            "
          >
            <div
              className="
                pointer-events-auto flex flex-wrap items-center gap-3
                rounded-[18px] border border-border/50 bg-white/95 backdrop-blur-xl
                px-4 py-3
                shadow-[0_16px_48px_rgba(15,23,42,0.16),0_0_0_1px_rgba(15,23,42,0.04)]
              "
            >
              <BulkContent
                count={count}
                onClear={onClear}
                onDeactivate={onDeactivate}
                onRoleChange={onRoleChange}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const BulkContent = ({ count, onClear, onDeactivate, onRoleChange, compact = false }) => (
  <div className={`flex ${compact ? 'flex-col gap-2.5' : 'flex-wrap items-center gap-3'} w-full`}>
    <div className="flex items-center justify-between gap-3">
      <p className="text-[13px] font-semibold text-heading tabular-nums">
        {count} selected
      </p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-heading sm:hidden"
        aria-label="Clear selection"
      >
        <X size={16} />
      </button>
    </div>

    <div className={`flex flex-wrap items-center gap-2 ${compact ? 'w-full' : ''}`}>
      <label className="sr-only" htmlFor="bulk-role">
        Change role
      </label>
      <div className="relative flex items-center gap-1.5">
        <UserCog size={14} className="text-slate-400 absolute left-2.5 pointer-events-none" />
        <select
          id="bulk-role"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onRoleChange?.(e.target.value);
              e.target.value = '';
            }
          }}
          className="
            h-9 rounded-xl border border-border/60 bg-white pl-8 pr-3
            text-[12.5px] font-medium text-heading
            focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
          "
        >
          <option value="" disabled>
            Change role…
          </option>
          {USER_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={onDeactivate}
        className="h-9 rounded-xl gap-1.5 text-[12.5px] font-semibold"
      >
        <UserX size={14} />
        Deactivate
      </Button>

      <button
        type="button"
        onClick={onClear}
        className="hidden sm:inline-flex h-9 items-center gap-1 rounded-xl px-2.5 text-[12.5px] font-medium text-secondaryText hover:text-heading hover:bg-slate-50"
      >
        <X size={14} />
        Clear
      </button>
    </div>
  </div>
);

export default BulkActionBar;
