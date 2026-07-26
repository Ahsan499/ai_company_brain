import { motion } from 'framer-motion';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
  { id: 'departments', label: 'Departments' },
  { id: 'settings', label: 'Settings' },
];

const OrganizationTabs = ({ value = 'overview', onChange, counts = {} }) => {
  return (
    <div
      className="
        relative flex gap-0.5 overflow-x-auto dashboard-scrollbar
        rounded-[14px] border border-border/45 bg-slate-100/70 p-1
        shadow-[0_1px_2px_rgba(15,23,42,0.03)_inset]
      "
      role="tablist"
      aria-label="Organization sections"
    >
      {TABS.map((tab) => {
        const active = value === tab.id;
        const count = counts[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(tab.id)}
            className={`
              relative z-10 shrink-0 rounded-[11px] px-3.5 py-2
              text-[12.5px] font-semibold tracking-tight
              transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
              ${active ? 'text-primary' : 'text-secondaryText hover:text-heading'}
            `}
          >
            {active && (
              <motion.span
                layoutId="org-tab-pill"
                className="absolute inset-0 rounded-[11px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-primary/10"
                transition={{ type: 'spring', stiffness: 440, damping: 34 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {tab.label}
              {typeof count === 'number' && (
                <span
                  className={`
                    rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums
                    ${active ? 'bg-primary/10 text-primary' : 'bg-slate-200/80 text-slate-500'}
                  `}
                >
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default OrganizationTabs;
