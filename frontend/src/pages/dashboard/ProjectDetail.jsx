import { useEffect, useMemo, useRef, useState } from 'react';
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
  X,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
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
import { formatProjectDate, daysRemaining } from '../../components/projects/projectData';
import { useMeetings } from '../../hooks/useMeetings';
import { formatHours } from '../../components/time-tracking/timeEntryData';
import { useProjectFiles } from '../../hooks/useFiles';
import {
  useAddProjectMember,
  useProject,
  useProjectMembers,
  useProjectTasks,
  useProjectTeams,
  useRemoveProjectMember,
} from '../../hooks/useProjects';
import { useUsers } from '../../hooks/useUsers';
import { getApiErrorMessage } from '../../lib/api';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'team', label: 'Team' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'files', label: 'Files' },
  { id: 'settings', label: 'Settings' },
];

const AddProjectMemberModal = ({ open, onClose, project, existingMemberIds = [] }) => {
  const addMember = useAddProjectMember();
  const firstRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const { data: usersData } = useUsers({
    organizationId: project?.organizationId || 'all',
    perPage: 100,
    page: 1,
  });

  const candidates = useMemo(() => {
    const taken = new Set(existingMemberIds.map(String));
    return (usersData?.data ?? []).filter((user) => !taken.has(String(user.id)));
  }, [usersData, existingMemberIds]);

  const selectedUserId = userId || (candidates[0] ? String(candidates[0].id) : '');

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape' && !addMember.isPending) onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, addMember.isPending]);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!project?.id || !selectedUserId) return;
    setError('');
    try {
      await addMember.mutateAsync({ projectId: project.id, userId: Number(selectedUserId) });
      onClose?.();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Could not add member.'));
    }
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-heading/25 backdrop-blur-[6px]"
        onClick={onClose}
      />
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full sm:max-w-[430px] rounded-t-[24px] sm:rounded-[24px] border border-white/70 bg-white/95 p-5 sm:p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-heading">Add member</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-secondaryText hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>
        {error ? (
          <div role="alert" className="rounded-xl border border-error/20 bg-red-50 px-3.5 py-2.5 text-sm text-error">
            {error}
          </div>
        ) : null}
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">User</label>
          <select
            ref={firstRef}
            value={selectedUserId}
            onChange={(event) => setUserId(event.target.value)}
            className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {candidates.length === 0 ? (
              <option value="">No eligible users</option>
            ) : (
              candidates.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                  {user.role ? ` · ${user.role}` : ''}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedUserId || addMember.isPending}
            className="rounded-xl"
          >
            {addMember.isPending ? 'Adding…' : 'Add member'}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error, refetch } = useProject(id);
  const { data: projectTasksData, isLoading: tasksLoading } = useProjectTasks(id);
  const { data: projectMembersData, isLoading: membersLoading } = useProjectMembers(id);
  const { data: projectTeamsData } = useProjectTeams(id);
  const removeProjectMember = useRemoveProjectMember();
  const [tab, setTab] = useState('overview');
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [memberError, setMemberError] = useState('');

  const projectTasks = projectTasksData?.data ?? [];
  const projectMembers = projectMembersData?.data ?? [];
  const assignedTeams = projectTeamsData?.data ?? [];
  const taskStats = project?.taskCounts ?? { total: 0, done: 0 };

  const { data: meetingsData } = useMeetings({ projectId: project?.id ?? 'all', perPage: 50 });
  const projectMeetings = meetingsData?.data ?? [];

  const { data: projectFilesData } = useProjectFiles(project?.id, { perPage: 100 });
  const projectFiles = projectFilesData?.data ?? [];

  const remaining = project ? daysRemaining(project.dueDate) : null;
  const memberIds = projectMembers.map((member) => member.userId ?? member.id);

  const toggleMemberSelection = (userId) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((idValue) => idValue !== userId) : [...prev, userId]
    );
  };

  const removeSelectedMembers = async () => {
    if (!project || selectedMemberIds.length === 0) return;
    if (!window.confirm(`Remove ${selectedMemberIds.length} member(s) from this project?`)) return;
    setMemberError('');
    try {
      for (const memberId of selectedMemberIds) {
        await removeProjectMember.mutateAsync({ projectId: project.id, userId: memberId });
      }
      setSelectedMemberIds([]);
    } catch (apiError) {
      setMemberError(getApiErrorMessage(apiError, 'Could not remove member(s).'));
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1600px] space-y-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-44 w-full" rounded="rounded-[24px]" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" rounded="rounded-[18px]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <ErrorState
          title="Couldn’t load project"
          message={error?.response?.data?.message || error?.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

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
                  {project.memberCount ?? project.members?.length ?? 0} team members
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-xl gap-2 text-[13px] font-semibold bg-white"
                onClick={() => setAddMemberOpen(true)}
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
                    : t.id === 'team'
                      ? projectMembers.length
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
                  value={project?.totalHoursLogged ? `${project.totalHoursLogged}h` : formatHours(0)}
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
                  value={project.memberCount ?? projectMembers.length}
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
            tasksLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : projectTasks.length === 0 ? (
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
                              {t.departmentName} · {t.memberCount ?? t.memberIds?.length ?? 0} members · Lead {t.leadName}
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
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-secondaryText tabular-nums">
                      {projectMembers.length}
                    </span>
                    {selectedMemberIds.length > 0 && (
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-8 rounded-lg text-[11.5px] text-error border-error/20 hover:bg-red-50"
                        disabled={removeProjectMember.isPending}
                        onClick={removeSelectedMembers}
                      >
                        {removeProjectMember.isPending ? 'Removing…' : `Remove (${selectedMemberIds.length})`}
                      </Button>
                    )}
                  </div>
                </div>
                {memberError ? (
                  <div role="alert" className="mx-4 mt-3 rounded-xl border border-error/20 bg-red-50 px-3.5 py-2.5 text-sm text-error">
                    {memberError}
                  </div>
                ) : null}
                <ul className="divide-y divide-border/35">
                  {membersLoading ? (
                    <div className="p-4 space-y-2.5">
                      <Skeleton className="h-11 w-full" />
                      <Skeleton className="h-11 w-full" />
                    </div>
                  ) : (
                    projectMembers.map((m) => {
                      const userId = m.userId ?? m.id;
                      const selected = selectedMemberIds.includes(userId);
                      return (
                        <li key={userId}>
                          <button
                            type="button"
                            onClick={() => toggleMemberSelection(userId)}
                            className={`w-full text-left flex items-center gap-3 px-4 sm:px-5 py-3.5 transition-colors ${
                              selected ? 'bg-primary/[0.05]' : 'hover:bg-slate-50/80'
                            }`}
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[11px] font-semibold ring-2 ring-white shadow-sm">
                              {m.initials}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[13.5px] font-semibold text-heading truncate">
                                {m.name}
                              </span>
                              <span className="block text-[12px] text-secondaryText truncate">
                                {m.email || '—'}
                              </span>
                            </span>
                            <span className="rounded-md bg-primary/5 px-2 py-0.5 text-[10.5px] font-semibold text-primary ring-1 ring-primary/10 whitespace-nowrap">
                              {m.projectRole}
                            </span>
                          </button>
                        </li>
                      );
                    })
                  )}
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
      <AddProjectMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        project={project}
        existingMemberIds={memberIds}
      />
    </div>
  );
};

export default ProjectDetail;
