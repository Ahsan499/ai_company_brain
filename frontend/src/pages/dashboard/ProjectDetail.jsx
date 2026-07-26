import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckSquare,
  Clock,
  FileText,
  FolderKanban,
  Layers,
  Network,
  Settings,
  Timer,
  UserPlus,
  Users2,
  Video,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import ProjectStatusBadge from '../../components/projects/ProjectStatusBadge';
import PriorityBadge from '../../components/projects/PriorityBadge';
import ProjectProgressBar from '../../components/projects/ProjectProgressBar';
import ProjectStatCard from '../../components/projects/ProjectStatCard';
import MemberAvatarStack from '../../components/projects/MemberAvatarStack';
import MilestoneList from '../../components/projects/MilestoneList';
import TaskRow from '../../components/tasks/TaskRow';
import MeetingRow from '../../components/meetings/MeetingRow';
import FileRow from '../../components/files/FileRow';
import {
  getProjectById,
  formatProjectDate,
  daysRemaining,
} from '../../components/projects/projectData';
import {
  getTasksByProject,
  projectTaskStats,
} from '../../components/tasks/taskData';
import { getTeamsByProject } from '../../components/teams/teamData';
import { getMeetingsByProject } from '../../components/meetings/meetingData';
import {
  formatHours,
  getProjectLoggedMinutes,
} from '../../components/time-tracking/timeEntryData';
import { getFilesByProject } from '../../components/files/fileData';
import { getUserById } from '../../components/users/userData';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'team', label: 'Team' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'files', label: 'Files' },
  { id: 'settings', label: 'Settings' },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = useMemo(() => getProjectById(id), [id]);
  const [tab, setTab] = useState('overview');
  const [statusOverrides, setStatusOverrides] = useState({});

  const baseTasks = useMemo(
    () => (project ? getTasksByProject(project.id) : []),
    [project]
  );

  const projectTasks = useMemo(
    () =>
      baseTasks.map((t) =>
        statusOverrides[t.id] ? { ...t, status: statusOverrides[t.id] } : t
      ),
    [baseTasks, statusOverrides]
  );

  const taskStats = useMemo(
    () => (project ? projectTaskStats(project.id) : { total: 0, done: 0 }),
    [project]
  );

  const assignedTeams = useMemo(
    () => (project ? getTeamsByProject(project.id) : []),
    [project]
  );

  const projectMeetings = useMemo(
    () => (project ? getMeetingsByProject(project.id) : []),
    [project]
  );

  const projectFiles = useMemo(
    () => (project ? getFilesByProject(project.id) : []),
    [project]
  );

  const remaining = project ? daysRemaining(project.dueDate) : null;

  const toggleTaskComplete = (taskId) => {
    const current = projectTasks.find((t) => t.id === taskId);
    if (!current) return;
    const next = current.status === 'done' ? 'todo' : 'done';
    setStatusOverrides((prev) => ({ ...prev, [taskId]: next }));
  };

  if (!project) {
    return (
      <div className="mx-auto max-w-lg py-16">
        <EmptyState
          icon={FolderKanban}
          title="Project not found"
          description="This workspace may have been removed or the link is invalid."
          action={
            <Button
              type="button"
              variant="primary"
              className="rounded-xl"
              onClick={() => navigate('/dashboard/projects')}
            >
              Back to Projects
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[12.5px] font-semibold text-secondaryText">
          <Link to="/dashboard/projects" className="inline-flex items-center gap-1 hover:text-primary">
            <ArrowLeft size={14} strokeWidth={2.2} />
            Projects
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            to={`/dashboard/organizations/${project.organizationId}`}
            className="hover:text-primary truncate max-w-[140px]"
          >
            {project.organizationName}
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            to={`/dashboard/departments/${project.departmentId}`}
            className="hover:text-primary truncate max-w-[120px]"
          >
            {project.departmentName}
          </Link>
        </nav>

        <div
          className="
            relative overflow-hidden rounded-[24px]
            border border-border/45 bg-white/90 backdrop-blur-md
            p-4 sm:p-6
            shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_28px_rgba(15,23,42,0.05)]
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/[0.06] blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <ProjectStatusBadge status={project.status} />
                <PriorityBadge priority={project.priority} />
              </div>
              <h1 className="text-[22px] sm:text-[28px] font-bold text-heading tracking-tight leading-tight">
                <span className="border-b border-dashed border-transparent hover:border-border/70 cursor-text transition-colors">
                  {project.name}
                </span>
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] text-secondaryText leading-relaxed">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <MemberAvatarStack members={project.members} max={5} size="md" />
                <span className="text-[12px] text-secondaryText">
                  {project.members.length} team members
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-xl gap-2 text-[13px] font-semibold bg-white"
              >
                <UserPlus size={15} />
                Add Member
              </Button>
              <Button
                type="button"
                variant="primary"
                className="h-10 rounded-xl text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
              >
                Edit Project
              </Button>
            </div>
          </div>

          <div className="relative mt-5 max-w-md">
            <ProjectProgressBar value={project.progress} />
          </div>
        </div>
      </motion.div>

      <div
        className="
          relative flex gap-0.5 overflow-x-auto dashboard-scrollbar
          rounded-[14px] border border-border/45 bg-slate-100/70 p-1
        "
        role="tablist"
        aria-label="Project sections"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          const count =
            t.id === 'tasks'
              ? projectTasks.length
              : t.id === 'team'
                ? project.members.length
                : t.id === 'meetings'
                  ? projectMeetings.length
                  : t.id === 'files'
                    ? projectFiles.length
                    : undefined;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`
                relative z-10 shrink-0 rounded-[11px] px-3.5 py-2
                text-[12.5px] font-semibold tracking-tight
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
                ${active ? 'text-primary' : 'text-secondaryText hover:text-heading'}
              `}
            >
              {active && (
                <motion.span
                  layoutId="project-tab-pill"
                  className="absolute inset-0 rounded-[11px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-primary/10"
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {t.label}
                {typeof count === 'number' && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                      active ? 'bg-primary/10 text-primary' : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === 'overview' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <ProjectStatCard
                  icon={FolderKanban}
                  label="Progress"
                  value={`${project.progress}%`}
                  tone="from-[#EFF6FF] to-[#BFDBFE] text-primary ring-primary/10"
                />
                <ProjectStatCard
                  icon={CheckSquare}
                  label="Tasks done"
                  value={`${taskStats.done}/${taskStats.total}`}
                  tone="from-[#ECFDF5] to-[#A7F3D0] text-emerald-600 ring-emerald-500/10"
                />
                <ProjectStatCard
                  icon={Timer}
                  label="Hours logged"
                  value={formatHours(getProjectLoggedMinutes(project.id))}
                  tone="from-[#EEF2FF] to-[#C7D2FE] text-indigo-700 ring-indigo-500/10"
                />
                <ProjectStatCard
                  icon={Clock}
                  label="Days remaining"
                  value={
                    remaining === null
                      ? '—'
                      : remaining < 0
                        ? `${Math.abs(remaining)}d overdue`
                        : `${remaining}d`
                  }
                  tone="from-[#FFFBEB] to-[#FDE68A] text-amber-700 ring-amber-500/10"
                />
                <ProjectStatCard
                  icon={Users2}
                  label="Team size"
                  value={project.members.length}
                  tone="from-[#F5F3FF] to-[#DDD6FE] text-violet-600 ring-violet-500/10"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <div className="xl:col-span-3 space-y-4">
                  <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                    <h2 className="text-[14px] font-semibold text-heading mb-3">Description</h2>
                    <p className="text-[13px] text-secondaryText leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-[12px] text-secondaryText">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={12} className="text-slate-400" />
                        Due {formatProjectDate(project.dueDate)}
                      </span>
                      <Link
                        to={`/dashboard/organizations/${project.organizationId}`}
                        className="inline-flex items-center gap-1.5 font-medium text-heading hover:text-primary"
                      >
                        <Building2 size={12} className="text-slate-400" />
                        {project.organizationName}
                      </Link>
                      <Link
                        to={`/dashboard/departments/${project.departmentId}`}
                        className="inline-flex items-center gap-1.5 font-medium text-heading hover:text-primary"
                      >
                        <Network size={12} className="text-slate-400" />
                        {project.departmentName}
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                    <div className="mb-3 flex items-center gap-2">
                      <Activity size={15} className="text-primary" />
                      <h2 className="text-[14px] font-semibold text-heading">Recent activity</h2>
                    </div>
                    <ul className="space-y-1">
                      {(project.activity || []).map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start justify-between gap-3 rounded-[14px] px-3 py-2.5 hover:bg-slate-50/90"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                            <p className="text-[13px] text-heading leading-snug">{item.text}</p>
                          </div>
                          <span className="shrink-0 text-[11px] font-medium text-slate-400">
                            {item.time}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="xl:col-span-2 rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[14px] font-semibold text-heading mb-3">Milestones</h2>
                  <MilestoneList milestones={project.milestones} />
                </div>
              </div>
            </div>
          )}

          {tab === 'tasks' && (
            projectTasks.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={CheckSquare}
                  title="No tasks on this project"
                  description="Tasks linked to this workspace will appear here."
                  action={
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => navigate('/dashboard/tasks')}
                    >
                      Open Tasks
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                <div className="border-b border-border/40 px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-[14px] font-semibold text-heading">Project tasks</h2>
                    <p className="mt-0.5 text-[12px] text-secondaryText">
                      From the Tasks module — filtered to this project.
                    </p>
                  </div>
                  <Link
                    to="/dashboard/tasks"
                    className="text-[12.5px] font-semibold text-primary hover:underline"
                  >
                    View all tasks
                  </Link>
                </div>
                <div className="overflow-x-auto dashboard-scrollbar">
                  <table className="w-full min-w-[720px] text-left">
                    <thead>
                      <tr className="border-b border-border/50 bg-slate-50/80">
                        <th className="px-3 py-3 w-12" />
                        {['Task', 'Assignee', 'Priority', 'Status', 'Due', 'Subtasks'].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-3 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {projectTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          showProject={false}
                          onOpen={(taskId) => navigate(`/dashboard/tasks/${taskId}`)}
                          onToggleComplete={toggleTaskComplete}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {tab === 'team' && (
            <div className="space-y-4">
              {assignedTeams.length > 0 && (
                <div className="overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                  <div className="border-b border-border/40 px-4 sm:px-5 py-3.5 flex items-center justify-between">
                    <div>
                      <h2 className="text-[14px] font-semibold text-heading">Assigned teams</h2>
                      <p className="mt-0.5 text-[12px] text-secondaryText">
                        Squads linked to this project
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-secondaryText tabular-nums">
                      {assignedTeams.length}
                    </span>
                  </div>
                  <ul className="divide-y divide-border/35">
                    {assignedTeams.map((t) => (
                      <li key={t.id}>
                        <Link
                          to={`/dashboard/teams/${t.id}`}
                          className="flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-slate-50/80 transition-colors"
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.iconTone}`}
                          >
                            <Layers size={16} strokeWidth={2} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13.5px] font-semibold text-heading truncate">
                              {t.name}
                            </span>
                            <span className="block text-[12px] text-secondaryText truncate">
                              {t.departmentName} · {t.memberIds.length} members · Lead {t.leadName}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                <div className="border-b border-border/40 px-4 sm:px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <h2 className="text-[14px] font-semibold text-heading">Project team</h2>
                    <p className="mt-0.5 text-[12px] text-secondaryText">
                      Members with roles on this workspace
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-secondaryText tabular-nums">
                    {project.members.length}
                  </span>
                </div>
                <ul className="divide-y divide-border/35">
                  {project.members.map((m) => {
                    const user = getUserById(m.userId);
                    return (
                      <li key={m.userId}>
                        <Link
                          to={`/dashboard/users/${m.userId}`}
                          className="flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-slate-50/80 transition-colors"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[11px] font-semibold ring-2 ring-white shadow-sm">
                            {m.initials}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13.5px] font-semibold text-heading truncate">
                              {m.name}
                            </span>
                            <span className="block text-[12px] text-secondaryText truncate">
                              {user?.email || '—'}
                            </span>
                          </span>
                          <span className="rounded-md bg-primary/5 px-2 py-0.5 text-[10.5px] font-semibold text-primary ring-1 ring-primary/10 whitespace-nowrap">
                            {m.projectRole}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {tab === 'meetings' && (
            projectMeetings.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={Video}
                  title="No meetings yet"
                  description="Meetings linked to this project will appear here."
                  action={
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => navigate('/dashboard/meetings')}
                    >
                      Open Meetings
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-2.5">
                {projectMeetings.map((m) => (
                  <MeetingRow
                    key={m.id}
                    meeting={m}
                    compact
                    onOpen={(meetingId) => navigate(`/dashboard/meetings/${meetingId}`)}
                  />
                ))}
              </div>
            )
          )}

          {tab === 'timeline' && (
            <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
              <EmptyState
                icon={CalendarDays}
                title="Timeline coming soon"
                description="Gantt-style milestones and delivery schedule will live here."
              />
            </div>
          )}

          {tab === 'files' && (
            projectFiles.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={FileText}
                  title="No files linked"
                  description="Documents linked to this project will appear here."
                  action={
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => navigate('/dashboard/files')}
                    >
                      Open Files
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                <div className="border-b border-border/40 px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-[14px] font-semibold text-heading">Project files</h2>
                    <p className="mt-0.5 text-[12px] text-secondaryText">
                      Linked from the Files module.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-xl w-fit"
                    onClick={() => navigate('/dashboard/files')}
                  >
                    Browse all
                  </Button>
                </div>
                <div className="overflow-x-auto dashboard-scrollbar">
                  <table className="w-full min-w-[420px] text-left">
                    <thead>
                      <tr className="border-b border-border/50 bg-slate-50/80">
                        {['Name', ''].map((h) => (
                          <th
                            key={h || 'actions'}
                            className="px-3 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {projectFiles.map((f, i) => (
                        <FileRow
                          key={f.id}
                          file={f}
                          index={i}
                          compact
                          onOpen={(fileId) => navigate(`/dashboard/files/${fileId}`)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {tab === 'settings' && (
            <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
              <EmptyState
                icon={Settings}
                title="Project settings"
                description="Visibility, ownership, and archive controls will live here."
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
