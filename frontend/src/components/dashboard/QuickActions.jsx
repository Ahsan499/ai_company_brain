import React from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, CheckSquare, UserPlus, CalendarPlus } from 'lucide-react';
import DashboardPanel, { PanelHeader } from './DashboardPanel';

const ACTIONS = [
  { label: 'Create Project', icon: FolderKanban, tone: 'from-[#2563EB] to-[#3B82F6]', glow: 'shadow-blue-500/25' },
  { label: 'Create Task', icon: CheckSquare, tone: 'from-[#059669] to-[#10B981]', glow: 'shadow-emerald-500/25' },
  { label: 'Invite Member', icon: UserPlus, tone: 'from-[#7C3AED] to-[#8B5CF6]', glow: 'shadow-violet-500/25' },
  { label: 'Schedule Meeting', icon: CalendarPlus, tone: 'from-[#D97706] to-[#F59E0B]', glow: 'shadow-amber-500/25' },
];

const QuickActions = ({ delay = 0 }) => {
  return (
    <DashboardPanel delay={delay} hoverLift={false}>
      <PanelHeader title="Quick Actions" subtitle="Jump into common workflows" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.06 + i * 0.04 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="
                group flex flex-col items-center gap-3 rounded-2xl
                border border-border/50 bg-slate-50/60
                px-3 py-5 sm:py-6 text-center
                hover:bg-white hover:border-primary/15
                hover:shadow-[0_10px_28px_rgba(15,23,42,0.06)]
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
              "
            >
              <span
                className={`
                  flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl
                  bg-gradient-to-br ${action.tone} text-white
                  shadow-lg ${action.glow}
                  transition-transform duration-200 group-hover:scale-105
                `}
              >
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="text-[12px] sm:text-[13px] font-semibold text-heading leading-snug px-1">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </DashboardPanel>
  );
};

export default QuickActions;
