import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  CheckCircle2,
  CheckSquare,
  Clock,
  FolderKanban,
  Timer,
  UserRound,
} from 'lucide-react';
import ReportFilterBar from '../../components/reports/ReportFilterBar';
import ReportTabs from '../../components/reports/ReportTabs';
import ReportStatCard from '../../components/reports/ReportStatCard';
import TaskTrendChart from '../../components/reports/TaskTrendChart';
import StatusDistributionChart from '../../components/reports/StatusDistributionChart';
import TeamComparisonChart from '../../components/reports/TeamComparisonChart';
import OverdueTasksTable from '../../components/reports/OverdueTasksTable';
import ProjectsReportTable from '../../components/reports/ProjectsReportTable';
import TeamPerformanceTable from '../../components/reports/TeamPerformanceTable';
import MetricBarChart from '../../components/reports/MetricBarChart';
import TimeReportChart from '../../components/time-tracking/TimeReportChart';
import UserTimeBreakdownTable from '../../components/time-tracking/UserTimeBreakdownTable';
import DashboardPanel, { PanelHeader } from '../../components/dashboard/DashboardPanel';
import EmptyState from '../../components/dashboard/EmptyState';
import {
  filterScopedEntities,
  formatHours,
  getOverviewStats,
  getTaskCompletionTrend,
  getProjectsByStatus,
  getTasksByStatus,
  getTasksByPriority,
  getRecentCompletions,
  getProjectsReportRows,
  getProjectsByDepartment,
  getOverdueTasks,
  getTeamPerformance,
  getTimeReportBundle,
  resolveDateRange,
} from '../../components/reports/reportSelectors';

const Reports = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [preset, setPreset] = useState('this-month');
  const [organizationId, setOrganizationId] = useState('all');
  const [departmentId, setDepartmentId] = useState('all');
  const [customAfter, setCustomAfter] = useState('');
  const [customBefore, setCustomBefore] = useState('');
  const [exportToast, setExportToast] = useState(false);

  const range = useMemo(
    () => resolveDateRange(preset, customAfter, customBefore),
    [preset, customAfter, customBefore]
  );

  const scope = useMemo(
    () =>
      filterScopedEntities({
        organizationId,
        departmentId,
        after: range.after,
        before: range.before,
      }),
    [organizationId, departmentId, range]
  );

  const overview = useMemo(() => getOverviewStats(scope), [scope]);
  const trend = useMemo(() => getTaskCompletionTrend(scope.tasks), [scope.tasks]);
  const projectStatus = useMemo(() => getProjectsByStatus(scope.projects), [scope.projects]);
  const taskStatus = useMemo(() => getTasksByStatus(scope.tasks), [scope.tasks]);
  const taskPriority = useMemo(() => getTasksByPriority(scope.tasks), [scope.tasks]);
  const recent = useMemo(
    () => getRecentCompletions(scope.tasks, scope.projects),
    [scope.tasks, scope.projects]
  );
  const projectRows = useMemo(() => getProjectsReportRows(scope.projects), [scope.projects]);
  const projectsByDept = useMemo(
    () => getProjectsByDepartment(scope.projects),
    [scope.projects]
  );
  const overdue = useMemo(() => getOverdueTasks(scope.tasks), [scope.tasks]);
  const teamPerf = useMemo(
    () => getTeamPerformance(scope.teams, scope.tasks, scope.entries),
    [scope]
  );
  const timeBundle = useMemo(() => getTimeReportBundle(scope.entries), [scope.entries]);

  const handleExport = () => {
    setExportToast(true);
    window.setTimeout(() => setExportToast(false), 2200);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
              <BarChart3 size={17} strokeWidth={2} />
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Reports
          </h1>
          <p className="mt-1.5 max-w-xl text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Cross-module analytics derived from projects, tasks, teams, and time entries.
          </p>
        </div>
      </motion.div>

      <ReportFilterBar
        preset={preset}
        onPresetChange={setPreset}
        organizationId={organizationId}
        onOrganizationChange={setOrganizationId}
        departmentId={departmentId}
        onDepartmentChange={setDepartmentId}
        customAfter={customAfter}
        customBefore={customBefore}
        onCustomAfter={setCustomAfter}
        onCustomBefore={setCustomBefore}
        onExport={handleExport}
      />

      <ReportTabs active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="space-y-5 sm:space-y-6"
        >
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
                <ReportStatCard
                  title="Active projects"
                  value={overview.activeProjects}
                  hint={`${scope.projects.length} in filter scope`}
                  icon={FolderKanban}
                  tone="blue"
                  delay={0.02}
                />
                <ReportStatCard
                  title="Tasks"
                  value={overview.totalTasks}
                  hint={`${overview.done} done · ${overview.inProgress} in progress · ${overview.overdue} overdue`}
                  icon={CheckSquare}
                  tone="purple"
                  delay={0.06}
                />
                <ReportStatCard
                  title="Hours logged"
                  value={overview.hoursLabel}
                  hint="From time entries in period"
                  icon={Timer}
                  tone="green"
                  delay={0.1}
                />
                <ReportStatCard
                  title="Active users"
                  value={overview.activeUsers}
                  hint="Workspace-wide active status"
                  icon={UserRound}
                  tone="orange"
                  delay={0.14}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                <TaskTrendChart data={trend} delay={0.05} />
                <StatusDistributionChart
                  title="Projects by status"
                  subtitle="Current status mix in scope"
                  data={projectStatus}
                  delay={0.1}
                />
              </div>

              <DashboardPanel hoverLift={false} delay={0.08}>
                <PanelHeader
                  title="Recent completions"
                  subtitle="Recently done tasks and completed projects"
                />
                {recent.length === 0 ? (
                  <EmptyState
                    icon={CheckCircle2}
                    title="No completions yet"
                    description="Finished work in scope will list here."
                  />
                ) : (
                  <ul className="divide-y divide-border/40">
                    {recent.map((item, i) => (
                      <motion.li
                        key={`${item.type}-${item.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link
                          to={item.href}
                          className="flex items-center gap-3 py-3 hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition-colors"
                        >
                          <span
                            className={`
                              flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ring-1
                              ${
                                item.type === 'project'
                                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-500/15'
                                  : 'bg-primary/8 text-primary ring-primary/10'
                              }
                            `}
                          >
                            {item.type === 'project' ? (
                              <FolderKanban size={15} />
                            ) : (
                              <CheckSquare size={15} />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13.5px] font-semibold text-heading truncate">
                              {item.title}
                            </span>
                            <span className="block text-[11.5px] text-secondaryText truncate">
                              {item.meta}
                            </span>
                          </span>
                          <span className="text-[11.5px] text-slate-400 tabular-nums shrink-0">
                            {item.date}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </DashboardPanel>
            </>
          )}

          {tab === 'projects' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                <MetricBarChart
                  title="Projects by department"
                  subtitle="Count of projects in each department"
                  data={projectsByDept}
                  valueKey="count"
                  delay={0.05}
                />
                <StatusDistributionChart
                  title="Status mix"
                  subtitle="Planning · Active · On hold · Completed"
                  data={projectStatus}
                  delay={0.1}
                />
              </div>
              <ProjectsReportTable rows={projectRows} />
            </>
          )}

          {tab === 'tasks' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                <StatusDistributionChart
                  title="Tasks by status"
                  subtitle="Todo through done"
                  data={taskStatus}
                  delay={0.05}
                />
                <MetricBarChart
                  title="Tasks by priority"
                  subtitle="Volume across priority levels"
                  data={taskPriority}
                  delay={0.1}
                />
              </div>
              <OverdueTasksTable
                rows={overdue}
                onOpenTask={(id) => navigate(`/dashboard/tasks/${id}`)}
              />
            </>
          )}

          {tab === 'team' && (
            <>
              <TeamComparisonChart data={teamPerf} delay={0.05} />
              <TeamPerformanceTable rows={teamPerf} />
            </>
          )}

          {tab === 'time' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <ReportStatCard
                  title="Total hours"
                  value={formatHours(timeBundle.totalMinutes)}
                  icon={Clock}
                  tone="blue"
                  delay={0.02}
                />
                <ReportStatCard
                  title="Projects with time"
                  value={timeBundle.byProject.length}
                  icon={FolderKanban}
                  tone="green"
                  delay={0.06}
                />
                <ReportStatCard
                  title="People logging"
                  value={timeBundle.byUser.length}
                  icon={UserRound}
                  tone="purple"
                  delay={0.1}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                <TimeReportChart
                  title="Hours by project"
                  subtitle="Selected period"
                  data={timeBundle.byProject}
                  delay={0.05}
                />
                <TimeReportChart
                  title="Hours by department"
                  subtitle="Joined via project department"
                  data={timeBundle.byDepartment}
                  delay={0.1}
                  layout="horizontal"
                />
              </div>
              {timeBundle.byUser.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                  <EmptyState
                    icon={Timer}
                    title="No time entries"
                    description="Widen the date range or clear filters."
                  />
                </div>
              ) : (
                <DashboardPanel hoverLift={false}>
                  <PanelHeader
                    title="People breakdown"
                    subtitle="Billable vs non-billable · same pattern as Time reports"
                  />
                  <UserTimeBreakdownTable rows={timeBundle.byUser} />
                </DashboardPanel>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {exportToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="
              fixed bottom-6 left-1/2 z-[90] -translate-x-1/2
              rounded-2xl border border-border/50 bg-heading px-4 py-2.5
              text-[13px] font-medium text-white shadow-xl
            "
          >
            Export queued (demo) — CSV/PDF coming with backend.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
