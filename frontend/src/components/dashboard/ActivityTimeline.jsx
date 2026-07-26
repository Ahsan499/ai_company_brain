import React from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, CheckCircle2, CalendarClock, UserPlus, Activity } from 'lucide-react';
import DashboardPanel, { PanelHeader } from './DashboardPanel';
import EmptyState from './EmptyState';

const DEFAULT_ACTIVITIES = [
  {
    icon: FolderPlus,
    title: 'Project Created',
    detail: 'AI Company Brain workspace initialized',
    time: '2m ago',
    color: 'bg-gradient-to-br from-primary to-[#1D4ED8]',
  },
  {
    icon: CheckCircle2,
    title: 'Task Completed',
    detail: 'Authentication screens marked done',
    time: '28m ago',
    color: 'bg-gradient-to-br from-[#059669] to-[#10B981]',
  },
  {
    icon: CalendarClock,
    title: 'Meeting Scheduled',
    detail: 'Product Sync · 10:00 AM',
    time: '1h ago',
    color: 'bg-gradient-to-br from-[#D97706] to-[#F59E0B]',
  },
  {
    icon: UserPlus,
    title: 'User Joined',
    detail: 'Sara Khan joined Engineering',
    time: '3h ago',
    color: 'bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6]',
  },
];

const ActivityTimeline = ({ activities = DEFAULT_ACTIVITIES, delay = 0 }) => {
  const isEmpty = !activities?.length;

  return (
    <DashboardPanel delay={delay} hoverLift={false}>
      <PanelHeader title="Recent Activity" subtitle="Live workspace timeline" />

      {isEmpty ? (
        <EmptyState
          icon={Activity}
          title="No recent activity"
          description="Team actions will appear here as they happen."
        />
      ) : (
        <ol className="relative">
          {activities.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === activities.length - 1;
            return (
              <li key={item.title} className="relative flex gap-3.5 pb-5 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[15px] top-9 bottom-0 w-px bg-gradient-to-b from-border to-transparent"
                    aria-hidden
                  />
                )}
                <motion.span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.color} text-white shadow-md`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.12 + i * 0.06, type: 'spring', stiffness: 280, damping: 18 }}
                >
                  <Icon size={13} strokeWidth={2.25} />
                </motion.span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] sm:text-sm font-semibold text-heading">{item.title}</p>
                    <span className="text-[11px] font-medium text-secondaryText shrink-0 tabular-nums">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-secondaryText mt-0.5 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </DashboardPanel>
  );
};

export default ActivityTimeline;
