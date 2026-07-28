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
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useDepartments } from '../../hooks/useDepartments';
import {
  useOverdueTasks,
  useProjectsByDepartment,
  useProjectsByStatus,
  useReportsOverview,
  useTaskCompletionTrend,
  useTasksByPriority,
  useTasksByStatus,
  useTeamPerformance,
} from '../../hooks/useReports';
import { useTimeReportByProject, useTimeReportByUser, useTimeReportSummary } from '../../hooks/useTimeTracking';
import { useProjects } from '../../hooks/useProjects';

const Reports = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [preset, setPreset] = useState('this-month');
  const [organizationId, setOrganizationId] = useState('all');
  const [departmentId, setDepartmentId] = useState('all');
  const [customAfter, setCustomAfter] = useState('');
  const [customBefore, setCustomBefore] = useState('');
  const [exportToast, setExportToast] = useState(false);

  const range = useMemo(() => {
    const today = new Date();
    const format = (date) => date.toISOString().slice(0, 10);
    if (preset === 'custom') {
      return { after: customAfter || '', before: customBefore || '' };
    }
    if (preset === 'this-week') {
      const day = today.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      const start = new Date(today);
      start.setDate(today.getDate() + mondayOffset);
      return { after: format(start), before: format(today) };
    }
    if (preset === 'this-quarter') {
      const qStartMonth = Math.floor(today.getMonth() / 3) * 3;
      const start = new Date(today.getFullYear(), qStartMonth, 1);
      return { after: format(start), before: format(today) };
    }
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { after: format(start), before: format(today) };
  }, [preset, customAfter, customBefore]);

  const filterParams = useMemo(
    () => ({
      organizationId,
      departmentId,
      dateFrom: range.after,
      dateTo: range.before,
    }),
    [organizationId, departmentId, range]
  );

  const { data: organizationsData } = useOrganizations({ perPage: 200 });
  const { data: departmentsData } = useDepartments({ organizationId, perPage: 200 });

  const overviewQuery = useReportsOverview(filterParams);
  const trendQuery = useTaskCompletionTrend(filterParams);
  const projectStatusQuery = useProjectsByStatus(filterParams);
  const projectsByDeptQuery = useProjectsByDepartment(filterParams);
  const projectsQuery = useProjects({
    organizationId,
    departmentId,
    page: 1,
    perPage: 100,
  });
  const taskStatusQuery = useTasksByStatus(filterParams);
  const taskPriorityQuery = useTasksByPriority(filterParams);
  const overdueQuery = useOverdueTasks({ ...filterParams, perPage: 100 });
  const teamPerfQuery = useTeamPerformance(filterParams);
  const timeSummaryQuery = useTimeReportSummary(filterParams);
  const timeByProjectQuery = useTimeReportByProject(filterParams);
  const timeByUserQuery = useTimeReportByUser(filterParams);

  const overview = overviewQuery.data ?? {};
  const trend = trendQuery.data ?? [];
  const projectStatus = projectStatusQuery.data ?? [];
  const taskStatus = taskStatusQuery.data ?? [];
  const taskPriority = taskPriorityQuery.data ?? [];
  const projectsByDept = projectsByDeptQuery.data ?? [];
  const overdue = overdueQuery.data?.data ?? [];
  const teamPerf = (teamPerfQuery.data ?? []).map((row) => ({
    ...row,
    hoursLabel: `${row.hoursLogged ?? Math.round((row.hoursMinutes || 0) / 60)}h`,
  }));
  const projectRows = (projectsQuery.data?.data ?? []).map((project) => {
    const today = new Date().toISOString().slice(0, 10);
    const delayed = project.status !== 'completed' && project.dueDate && project.dueDate < today;
    const total = project.taskCounts?.total ?? project.tasksTotal ?? 0;
    const done = project.taskCounts?.done ?? project.tasksDone ?? 0;
    return {
      id: project.id,
      name: project.name,
      status: project.status,
      departmentName: project.departmentName,
      progress: project.progress ?? 0,
      delayed,
      tasksDone: done,
      tasksTotal: total,
      completionRatio: total ? Math.round((done / total) * 100) : 0,
    };
  });
  const timeBundle = {
    totalMinutes: timeSummaryQuery.data?.totalMinutes ?? timeSummaryQuery.data?.totalHoursMinutes ?? 0,
    byProject: (timeByProjectQuery.data ?? []).map((row) => ({
      name: row.projectName || 'Unassigned',
      hours: row.hours || 0,
    })),
    byDepartment: timeSummaryQuery.data?.hoursByDepartment ?? [],
    byUser: (timeByUserQuery.data ?? []).map((row) => ({
      userId: row.userId,
      userName: row.userName,
      initials: row.initials,
      teamName: row.teamName || '—',
      minutes: row.durationMinutes || 0,
      billable: row.durationMinutes || 0,
      nonBillable: 0,
    })),
  };

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
        organizations={organizationsData?.data ?? []}
        departments={departmentsData?.data ?? []}
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
              {overviewQuery.isError || trendQuery.isError || projectStatusQuery.isError ? (
                <ErrorState message={overviewQuery.error?.message || trendQuery.error?.message || projectStatusQuery.error?.message} onRetry={() => { overviewQuery.refetch(); trendQuery.refetch(); projectStatusQuery.refetch(); }} />
              ) : overviewQuery.isLoading ? (
                <Skeleton className="h-56 w-full" />
              ) : (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
                <ReportStatCard
                  title="Active projects"
                  value={overview.activeProjects ?? 0}
                  hint="Projects in current filter scope"
                  icon={FolderKanban}
                  tone="blue"
                  delay={0.02}
                />
                <ReportStatCard
                  title="Tasks"
                  value={overview.taskCounts?.total ?? 0}
                  hint={`${overview.taskCounts?.done ?? 0} done · ${overview.taskCounts?.inProgress ?? 0} in progress · ${overview.taskCounts?.overdue ?? 0} overdue`}
                  icon={CheckSquare}
                  tone="purple"
                  delay={0.06}
                />
                <ReportStatCard
                  title="Hours logged"
                  value={`${overview.hoursLoggedThisPeriod ?? 0}h`}
                  hint="From time entries in period"
                  icon={Timer}
                  tone="green"
                  delay={0.1}
                />
                <ReportStatCard
                  title="Active users"
                  value={overview.activeUsers ?? 0}
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
                <PanelHeader title="Recent completions" subtitle="Server-side endpoint pending for recent feed" />
                <EmptyState icon={CheckCircle2} title="Not available yet" description="Overview metrics and charts are live; recent completion stream is not exposed in current API." />
              </DashboardPanel>
              </>
              )}
            </>
          )}

          {tab === 'projects' && (
            <>
              {projectsByDeptQuery.isError ? <ErrorState message={projectsByDeptQuery.error?.message} onRetry={() => projectsByDeptQuery.refetch()} /> : null}
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
              {overdueQuery.isError ? <ErrorState message={overdueQuery.error?.message} onRetry={() => overdueQuery.refetch()} /> : null}
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
              {teamPerfQuery.isError ? <ErrorState message={teamPerfQuery.error?.message} onRetry={() => teamPerfQuery.refetch()} /> : null}
              <TeamComparisonChart data={teamPerf} delay={0.05} />
              <TeamPerformanceTable rows={teamPerf} />
            </>
          )}

          {tab === 'time' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <ReportStatCard
                  title="Total hours"
                  value={`${timeSummaryQuery.data?.totalHours ?? 0}h`}
                  icon={Clock}
                  tone="blue"
                  delay={0.02}
                />
                <ReportStatCard
                  title="Projects with time"
                  value={timeBundle.byProject.length || 0}
                  icon={FolderKanban}
                  tone="green"
                  delay={0.06}
                />
                <ReportStatCard
                  title="People logging"
                  value={timeBundle.byUser.length || 0}
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
