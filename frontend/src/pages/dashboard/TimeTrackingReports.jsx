import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Filter,
  FolderKanban,
  Timer,
  UserRound,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import TimeReportChart from '../../components/time-tracking/TimeReportChart';
import UserTimeBreakdownTable from '../../components/time-tracking/UserTimeBreakdownTable';
import {
  TIME_ENTRIES,
  filterTimeEntries,
  formatHours,
  formatHoursDecimal,
  hoursByProject,
  hoursByUser,
  minutesToHours,
  resolveDateRange,
  sumMinutes,
} from '../../components/time-tracking/timeEntryData';
import { PROJECTS } from '../../components/projects/projectData';
import { TEAMS } from '../../components/teams/teamData';
import { USERS } from '../../components/users/userData';

const selectClass =
  'h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <div className="rounded-[18px] border border-border/45 bg-white/90 p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
    <span
      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br ring-1 ${tone}`}
    >
      <Icon size={15} strokeWidth={2} />
    </span>
    <p className="text-[22px] font-semibold text-heading tracking-tight tabular-nums leading-none">
      {value}
    </p>
    <p className="mt-1.5 text-[12px] font-medium text-secondaryText">{label}</p>
  </div>
);

const TimeTrackingReports = () => {
  const [preset, setPreset] = useState('this-week');
  const [teamId, setTeamId] = useState('all');
  const [projectId, setProjectId] = useState('all');
  const [userId, setUserId] = useState('all');
  const [customAfter, setCustomAfter] = useState('');
  const [customBefore, setCustomBefore] = useState('');

  const range = useMemo(
    () => resolveDateRange(preset, customAfter, customBefore),
    [preset, customAfter, customBefore]
  );

  const filtered = useMemo(
    () =>
      filterTimeEntries(TIME_ENTRIES, {
        teamId,
        projectId,
        userId,
        dateAfter: range.after,
        dateBefore: range.before,
      }),
    [teamId, projectId, userId, range]
  );

  const totalMinutes = sumMinutes(filtered);
  const uniqueDays = new Set(filtered.map((e) => e.date)).size || 1;
  const avgPerDay = minutesToHours(totalMinutes / uniqueDays, 1);
  const byProject = hoursByProject(filtered);
  const byUser = hoursByUser(filtered);
  const topProject = byProject[0]?.name || '—';
  const topUser = byUser[0]?.userName || '—';

  const memberChartData = byUser.slice(0, 8).map((u) => ({
    name: u.userName.split(' ')[0],
    hours: minutesToHours(u.minutes, 1),
  }));

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link
          to="/dashboard/time-tracking"
          className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-secondaryText hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={2.2} />
          Time Tracking
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
                <BarChart3 size={17} strokeWidth={2} />
              </span>
            </div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
              Time reports
            </h1>
            <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
              Manager view — hours by project, team member, and billable split.
            </p>
          </div>
          <Link to="/dashboard/time-tracking">
            <Button type="button" variant="secondary" className="h-10 rounded-xl bg-white gap-2">
              <Timer size={15} />
              My timesheet
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="
          flex flex-wrap items-center gap-2
          rounded-[20px] border border-border/45 bg-white/85 backdrop-blur-md
          p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]
        "
      >
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-1">
          <Filter size={12} />
          Filters
        </span>
        <select
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
          className={selectClass}
          aria-label="Date range"
        >
          <option value="this-week">This week</option>
          <option value="last-week">Last week</option>
          <option value="this-month">This month</option>
          <option value="custom">Custom</option>
        </select>
        {preset === 'custom' && (
          <>
            <input
              type="date"
              value={customAfter}
              onChange={(e) => setCustomAfter(e.target.value)}
              className={selectClass}
              aria-label="From"
            />
            <input
              type="date"
              value={customBefore}
              onChange={(e) => setCustomBefore(e.target.value)}
              className={selectClass}
              aria-label="To"
            />
          </>
        )}
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className={`${selectClass} max-w-[160px]`}
        >
          <option value="all">All teams</option>
          {TEAMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className={`${selectClass} max-w-[200px]`}
        >
          <option value="all">All projects</option>
          {PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className={`${selectClass} max-w-[160px]`}
        >
          <option value="all">All people</option>
          {USERS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-border/45 bg-white/85 py-6">
          <EmptyState
            icon={BarChart3}
            title="No entries in this range"
            description="Try widening the date range or clearing filters."
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={Clock}
              label="Total hours"
              value={`${formatHoursDecimal(totalMinutes)}h`}
              tone="from-[#EFF6FF] to-[#BFDBFE] text-primary ring-primary/10"
            />
            <StatCard
              icon={Timer}
              label="Avg hours / day"
              value={`${avgPerDay}h`}
              tone="from-[#ECFDF5] to-[#A7F3D0] text-emerald-600 ring-emerald-500/10"
            />
            <StatCard
              icon={FolderKanban}
              label="Top project"
              value={topProject.length > 16 ? `${topProject.slice(0, 14)}…` : topProject}
              tone="from-[#EEF2FF] to-[#C7D2FE] text-indigo-700 ring-indigo-500/10"
            />
            <StatCard
              icon={UserRound}
              label="Most logged"
              value={topUser.split(' ')[0]}
              tone="from-[#FFFBEB] to-[#FDE68A] text-amber-700 ring-amber-500/10"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <TimeReportChart
              title="Hours by project"
              subtitle={`${formatHours(totalMinutes)} total`}
              data={byProject}
              delay={0.05}
            />
            <TimeReportChart
              title="Hours by person"
              subtitle="Top contributors"
              data={memberChartData}
              layout="horizontal"
              delay={0.1}
            />
          </div>

          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold text-heading tracking-tight px-0.5">
              Per-user breakdown
            </h2>
            <UserTimeBreakdownTable rows={byUser} />
          </section>
        </>
      )}
    </div>
  );
};

export default TimeTrackingReports;
