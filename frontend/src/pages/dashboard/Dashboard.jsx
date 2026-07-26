import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  CheckCircle2,
  Users,
  CalendarDays,
  Plus,
  UserPlus,
  HardDrive,
  Building2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import DashboardPanel from '../../components/dashboard/DashboardPanel';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import ProgressCard from '../../components/dashboard/ProgressCard';
import RecentTasks from '../../components/dashboard/RecentTasks';
import UpcomingMeetings from '../../components/dashboard/UpcomingMeetings';
import QuickActions from '../../components/dashboard/QuickActions';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import EmptyState from '../../components/dashboard/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useDashboardOverview } from '../../hooks/useDashboard';

const ONLINE_MEMBERS = [
  { initials: 'AH', name: 'Ahsan Hassan' },
  { initials: 'SK', name: 'Sara Khan' },
  { initials: 'MR', name: 'M. Raza' },
  { initials: 'LN', name: 'Lina Noor' },
];

const DEADLINES = [
  { title: 'API Integration', date: 'Thu 26 Jul' },
  { title: 'Notifications UI', date: 'Fri 27 Jul' },
  { title: 'Reports MVP', date: 'Mon 29 Jul' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const firstName = (user?.name || 'there').split(' ')[0];

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6 xl:space-y-7">
      {/* Welcome — same structure, refined type & spacing */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary/80 mb-1.5">
            Workspace overview
          </p>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-heading tracking-tight leading-[1.15]">
            Good Morning, {firstName} 👋
          </h1>
          <p className="mt-2 text-[13px] sm:text-[15px] text-secondaryText max-w-xl leading-relaxed">
            Welcome back. Here&apos;s everything happening across your workspace today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button className="h-11 rounded-xl gap-2 px-4 text-[13px] font-semibold bg-gradient-to-r from-primary to-[#1D4ED8] border-0 shadow-[0_4px_14px_rgba(37,99,235,0.28)]">
            <Plus size={15} strokeWidth={2.25} />
            New Project
          </Button>
          <Button variant="secondary" className="h-11 rounded-xl gap-2 px-4 text-[13px] font-semibold bg-white/80 backdrop-blur-sm">
            <UserPlus size={15} strokeWidth={2} />
            Invite Team
          </Button>
        </div>
      </motion.section>

      {/* Stats — Users + Organizations from API; Projects/Tasks/Meetings remain dummy until those modules wire */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 xl:gap-5">
        <StatCard title="Projects" value="24" growth="+12%" icon={FolderKanban} tone="blue" delay={0.04} />
        <StatCard title="Tasks" value="189" growth="+18%" icon={CheckCircle2} tone="green" delay={0.08} />
        {overviewLoading ? (
          <Skeleton className="h-[118px] w-full" rounded="rounded-[20px]" />
        ) : (
          <StatCard
            title="Users"
            value={String(overview?.activeUsersTotal ?? '—')}
            growth="Active"
            icon={Users}
            tone="purple"
            delay={0.12}
          />
        )}
        <StatCard title="Meetings" value="6" growth="Today" icon={CalendarDays} tone="orange" delay={0.16} />
      </section>

      {overviewLoading ? (
        <Skeleton className="h-[72px] w-full max-w-sm" rounded="rounded-[18px]" />
      ) : (
        <div className="inline-flex items-center gap-2.5 rounded-[18px] border border-border/45 bg-white/90 px-4 py-3 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br from-[#EFF6FF] to-[#BFDBFE] text-primary ring-1 ring-primary/10">
            <Building2 size={15} strokeWidth={2} />
          </span>
          <div>
            <p className="text-[18px] font-semibold text-heading tabular-nums leading-none">
              {overview?.organizationsTotal ?? '—'}
            </p>
            <p className="mt-1 text-[12px] font-medium text-secondaryText">Organizations</p>
          </div>
        </div>
      )}

      {/* Charts + right rail — same grid */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 sm:gap-4 xl:gap-5">
        <div className="xl:col-span-5">
          <ChartCard delay={0.18} />
        </div>
        <div className="xl:col-span-4">
          <ProgressCard delay={0.22} />
        </div>

        <aside className="xl:col-span-3 space-y-3.5 sm:space-y-4">
          <DashboardPanel delay={0.26} padding="p-4 sm:p-5" hoverLift>
            <h3 className="text-[13px] font-semibold text-heading tracking-tight">Today&apos;s Calendar</h3>
            <p className="text-[11px] text-secondaryText mt-0.5 mb-3.5">Sunday, 26 Jul 2026</p>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-slate-400 mb-1.5">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={`${d}-${i}`}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
              {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`
                    aspect-square flex items-center justify-center rounded-lg transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
                    ${
                      day === 26
                        ? 'bg-gradient-to-br from-primary to-[#1D4ED8] text-white font-semibold shadow-sm'
                        : 'text-heading hover:bg-slate-50'
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel delay={0.3} padding="p-4 sm:p-5" hoverLift>
            <h3 className="text-[13px] font-semibold text-heading tracking-tight mb-3">
              Upcoming Deadlines
            </h3>
            {DEADLINES.length === 0 ? (
              <EmptyState title="No deadlines" description="You’re all caught up." className="py-6" />
            ) : (
              <ul className="space-y-2">
                {DEADLINES.map((d) => (
                  <li
                    key={d.title}
                    className="flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-[13px] text-heading font-medium truncate">{d.title}</span>
                    <span className="text-[11px] font-medium text-secondaryText shrink-0 tabular-nums">
                      {d.date}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </DashboardPanel>

          <DashboardPanel delay={0.34} padding="p-4 sm:p-5" hoverLift>
            <h3 className="text-[13px] font-semibold text-heading tracking-tight mb-3">
              Online Members
            </h3>
            <ul className="space-y-2">
              {ONLINE_MEMBERS.map((m) => (
                <li key={m.initials} className="flex items-center gap-2.5 rounded-xl px-1 py-1 hover:bg-slate-50 transition-colors">
                  <div className="relative shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm">
                      {m.initials}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-white" />
                  </div>
                  <span className="text-[13px] text-heading font-medium truncate">{m.name}</span>
                </li>
              ))}
            </ul>
          </DashboardPanel>

          <DashboardPanel delay={0.38} padding="p-4 sm:p-5" hoverLift>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <HardDrive size={14} strokeWidth={2} />
              </span>
              <h3 className="text-[13px] font-semibold text-heading tracking-tight">Storage Usage</h3>
            </div>
            <div className="flex items-end justify-between mb-2.5">
              <span className="text-[28px] font-bold text-heading tracking-tight leading-none tabular-nums">
                64%
              </span>
              <span className="text-[11px] font-medium text-secondaryText tabular-nums">
                12.8 / 20 GB
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden ring-1 ring-inset ring-slate-200/50">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-[#60A5FA]"
                initial={{ width: 0 }}
                animate={{ width: '64%' }}
                transition={{ delay: 0.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </DashboardPanel>
        </aside>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 xl:gap-5">
        <RecentTasks delay={0.28} />
        <UpcomingMeetings delay={0.32} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-3.5 sm:gap-4 xl:gap-5">
        <QuickActions delay={0.34} />
        <ActivityTimeline delay={0.38} />
      </section>
    </div>
  );
};

export default Dashboard;
