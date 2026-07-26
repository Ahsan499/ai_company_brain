import { motion } from 'framer-motion';
import { CheckSquare, Clock, FolderKanban, UsersRound } from 'lucide-react';

const CARDS = [
  {
    key: 'tasks',
    label: 'Tasks completed',
    icon: CheckSquare,
    tone: 'from-[#ECFDF5] to-[#A7F3D0] text-emerald-700 ring-emerald-500/15',
    getValue: (s) => s.tasksCompleted,
    getHint: (s) => `of ${s.tasksTotal} assigned`,
  },
  {
    key: 'projects',
    label: 'Active projects',
    icon: FolderKanban,
    tone: 'from-[#EFF6FF] to-[#BFDBFE] text-primary ring-primary/15',
    getValue: (s) => s.activeProjects,
    getHint: (s) => `${s.projectsTotal} total`,
  },
  {
    key: 'hours',
    label: 'Hours this month',
    icon: Clock,
    tone: 'from-[#FFFBEB] to-[#FDE68A] text-amber-800 ring-amber-500/20',
    getValue: (s) => s.hoursThisMonth,
    getHint: () => 'From time entries',
  },
  {
    key: 'teams',
    label: 'Teams joined',
    icon: UsersRound,
    tone: 'from-[#F0F9FF] to-[#BAE6FD] text-sky-700 ring-sky-500/15',
    getValue: (s) => s.teamsJoined,
    getHint: () => 'Active memberships',
  },
];

const ProfileStatsRow = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="flex gap-3 overflow-x-auto dashboard-scrollbar pb-1 sm:grid sm:grid-cols-2 xl:grid-cols-4 sm:overflow-visible">
      {CARDS.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
            className="
              min-w-[160px] sm:min-w-0
              rounded-[18px] border border-border/45 bg-white/90 p-4
              shadow-[0_2px_12px_rgba(15,23,42,0.04)]
            "
          >
            <span
              className={`mb-3 flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br ring-1 ${card.tone}`}
            >
              <Icon size={15} strokeWidth={2} />
            </span>
            <p className="text-[22px] font-semibold text-heading tracking-tight tabular-nums leading-none">
              {card.getValue(stats)}
            </p>
            <p className="mt-1.5 text-[12px] font-medium text-secondaryText">{card.label}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{card.getHint(stats)}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProfileStatsRow;
