import React from 'react';
import { motion } from 'framer-motion';
import DashboardPanel, { PanelHeader } from './DashboardPanel';
import EmptyState from './EmptyState';
import { CheckSquare } from 'lucide-react';

const STATUS_STYLES = {
  Done: 'bg-success/10 text-success ring-success/15',
  'In Progress': 'bg-primary/10 text-primary ring-primary/15',
  Review: 'bg-violet-500/10 text-violet-600 ring-violet-500/15',
  Todo: 'bg-slate-100 text-secondaryText ring-slate-200/80',
};

const PRIORITY_STYLES = {
  High: 'bg-error/10 text-error ring-error/15',
  Medium: 'bg-warning/10 text-amber-700 ring-warning/20',
  Low: 'bg-success/10 text-success ring-success/15',
};

const DEFAULT_TASKS = [
  { title: 'Dashboard UI', status: 'In Progress', priority: 'High', user: 'AH', due: 'Today' },
  { title: 'Authentication', status: 'Done', priority: 'High', user: 'SK', due: 'Yesterday' },
  { title: 'API Integration', status: 'Review', priority: 'Medium', user: 'MR', due: 'Thu' },
  { title: 'Notifications', status: 'Todo', priority: 'Medium', user: 'LN', due: 'Fri' },
  { title: 'Reports', status: 'Todo', priority: 'Low', user: 'AH', due: 'Next week' },
];

const RecentTasks = ({ tasks = DEFAULT_TASKS, delay = 0 }) => {
  const isEmpty = !tasks?.length;

  return (
    <DashboardPanel delay={delay} className="h-full" hoverLift={false}>
      <PanelHeader
        title="Recent Tasks"
        subtitle="Latest workspace activity"
        action={
          !isEmpty && (
            <button
              type="button"
              className="text-[13px] font-semibold text-primary hover:text-blue-700 transition-colors focus:outline-none focus-visible:underline"
            >
              View all
            </button>
          )
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Assign or create tasks and they’ll show up here."
        />
      ) : (
        <ul className="space-y-2.5">
          {tasks.map((task, i) => (
            <motion.li
              key={task.title}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.08 + i * 0.04 }}
              whileHover={{ x: 2 }}
              className="
                flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3
                rounded-2xl border border-border/50 bg-slate-50/70
                px-3.5 py-3
                hover:bg-white hover:border-primary/15 hover:shadow-[0_4px_16px_rgba(15,23,42,0.05)]
                transition-all duration-200
              "
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13px] sm:text-sm font-semibold text-heading truncate">
                  {task.title}
                </p>
                <p className="text-[11px] sm:text-xs text-secondaryText mt-0.5">Due {task.due}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold ring-1 ${STATUS_STYLES[task.status]}`}>
                {task.status}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold ring-1 ${PRIORITY_STYLES[task.priority]}`}>
                {task.priority}
              </span>
              <div
                className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[10px] font-bold flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm"
                aria-label={`Assigned to ${task.user}`}
              >
                {task.user}
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
};

export default RecentTasks;
