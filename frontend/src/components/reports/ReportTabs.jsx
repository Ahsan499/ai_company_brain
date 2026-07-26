import { motion } from 'framer-motion';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'team', label: 'Team Performance' },
  { id: 'time', label: 'Time Tracking' },
];

const ReportTabs = ({ active, onChange }) => (
  <div
    className="
      relative flex gap-0.5 overflow-x-auto dashboard-scrollbar
      rounded-[14px] border border-border/45 bg-slate-100/70 p-1
    "
    role="tablist"
    aria-label="Report categories"
  >
    {TABS.map((t) => {
      const isActive = active === t.id;
      return (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange?.(t.id)}
          className={`
            relative z-10 shrink-0 rounded-[11px] px-3.5 py-2
            text-[12.5px] font-semibold tracking-tight
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
            ${isActive ? 'text-primary' : 'text-secondaryText hover:text-heading'}
          `}
        >
          {isActive && (
            <motion.span
              layoutId="report-tab-pill"
              className="absolute inset-0 rounded-[11px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-primary/10"
              transition={{ type: 'spring', stiffness: 440, damping: 34 }}
            />
          )}
          <span className="relative z-10">{t.label}</span>
        </button>
      );
    })}
  </div>
);

export default ReportTabs;
export { TABS };
