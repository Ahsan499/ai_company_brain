import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  Layers,
  Network,
  UserMinus,
  UserPlus,
  Users2,
  UsersRound,
  Video,
  X,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import UserTable from '../../components/users/UserTable';
import ProjectCard from '../../components/projects/ProjectCard';
import TaskRow from '../../components/tasks/TaskRow';
import MeetingRow from '../../components/meetings/MeetingRow';
import TeamTabs from '../../components/teams/TeamTabs';
import TeamStatCard from '../../components/teams/TeamStatCard';
import TeamLeadBadge from '../../components/teams/TeamLeadBadge';
import StatusBadge from '../../components/users/StatusBadge';
import { formatTeamDate } from '../../components/teams/teamData';
import { TASKS } from '../../components/tasks/taskData';
import { getMeetingsByTeam } from '../../components/meetings/meetingData';
import {
  useAddTeamMember,
  useRemoveTeamMember,
  useTeam,
  useTeamMembers,
  useTeamProjects,
  useUpdateTeam,
} from '../../hooks/useTeams';
import { useUsers } from '../../hooks/useUsers';
import { getApiErrorMessage } from '../../lib/api';

const AddMemberModal = ({ open, onClose, team, existingIds }) => {
  const titleId = useId();
  const firstRef = useRef(null);
  const addMember = useAddTeamMember();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const { data: usersData } = useUsers({
    organizationId: team?.organizationId || 'all',
    perPage: 100,
    page: 1,
  });

  const candidates = useMemo(() => {
    const all = usersData?.data ?? [];
    const taken = new Set((existingIds || []).map(String));
    return all.filter((u) => !taken.has(String(u.id)));
  }, [usersData, existingIds]);

  useEffect(() => {
    if (!open) return;
    setError('');
    setUserId(candidates[0] ? String(candidates[0].id) : '');
  }, [open, candidates]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && !addMember.isPending) onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, addMember.isPending]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setError('');
    try {
      await addMember.mutateAsync({ teamId: team.id, userId: Number(userId) });
      onClose?.();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not add member.'));
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
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full sm:max-w-[420px] rounded-t-[24px] sm:rounded-[24px] border border-white/70 bg-white/95 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)]"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 id={titleId} className="text-[16px] font-semibold text-heading">
              Add member
            </h2>
            <p className="mt-0.5 text-[12.5px] text-secondaryText">
              Assign someone from {team.organizationName || 'this organization'}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-secondaryText hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div role="alert" className="rounded-xl border border-error/20 bg-red-50 px-3.5 py-2.5 text-sm text-error">
              {error}
            </div>
          ) : null}
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">User</label>
            <select
              ref={firstRef}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {candidates.length === 0 ? (
                <option value="">No eligible users</option>
              ) : (
                candidates.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                    {u.role ? ` · ${u.role}` : ''}
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
              disabled={!userId || addMember.isPending}
              className="rounded-xl"
            >
              {addMember.isPending ? 'Adding…' : 'Add member'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: team, isLoading, isError, error, refetch } = useTeam(id);
  const { data: membersData, isLoading: membersLoading } = useTeamMembers(id);
  const { data: projectsData, isLoading: projectsLoading } = useTeamProjects(id);
  const removeMember = useRemoveTeamMember();
  const updateTeam = useUpdateTeam();

  const [tab, setTab] = useState('overview');
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusOverrides, setStatusOverrides] = useState({});
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [memberError, setMemberError] = useState('');
  const [actionError, setActionError] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const members = membersData?.data ?? [];
  const teamProjects = projectsData?.data ?? [];
  const memberIds = members.map((m) => m.id);
  const projectIds = teamProjects.map((p) => p.id);

  // Tasks / meetings stay on dummy catalogs until those modules are wired.
  const teamTasks = useMemo(() => {
    if (!team) return [];
    const projectSet = new Set(projectIds.length ? projectIds : team.projectIds || []);
    const memberSet = new Set(memberIds.length ? memberIds : team.memberIds || []);
    return TASKS.filter(
      (t) => projectSet.has(t.projectId) && memberSet.has(t.assigneeId)
    ).map((t) =>
      statusOverrides[t.id] ? { ...t, status: statusOverrides[t.id] } : t
    );
  }, [team, projectIds, memberIds, statusOverrides]);

  const teamMeetings = useMemo(
    () => (team ? getMeetingsByTeam(team.id) : []),
    [team]
  );

  const activeProjectCount = useMemo(
    () => teamProjects.filter((p) => p.status === 'active').length,
    [teamProjects]
  );

  const taskStats = useMemo(() => {
    const total = teamTasks.length;
    const done = teamTasks.filter((t) => t.status === 'done').length;
    const avg =
      members.length > 0 ? (total / members.length).toFixed(1) : '0';
    return { total, done, avg };
  }, [teamTasks, members.length]);

  useEffect(() => {
    if (!team) return;
    setEditName(team.name || '');
    setEditDescription(team.description || '');
  }, [team]);

  const openEdit = () => {
    if (!team) return;
    setEditName(team.name || '');
    setEditDescription(team.description || '');
    setActionError('');
    setEditOpen(true);
  };

  const saveEdit = async (e) => {
    e?.preventDefault?.();
    if (!team) return;
    setActionError('');
    try {
      await updateTeam.mutateAsync({
        id: team.id,
        name: editName.trim() || team.name,
        description: editDescription,
      });
      setEditOpen(false);
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not update team.'));
    }
  };

  const handleRemoveSelected = async () => {
    if (!team || selectedIds.length === 0) return;
    if (!window.confirm(`Remove ${selectedIds.length} member(s) from this team?`)) return;
    setMemberError('');
    try {
      for (const userId of selectedIds) {
        await removeMember.mutateAsync({ teamId: team.id, userId });
      }
      setSelectedIds([]);
    } catch (err) {
      setMemberError(getApiErrorMessage(err, 'Could not remove member(s).'));
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1600px] space-y-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-40 w-full" rounded="rounded-[24px]" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Skeleton className="h-24" rounded="rounded-[18px]" />
          <Skeleton className="h-24" rounded="rounded-[18px]" />
          <Skeleton className="h-24" rounded="rounded-[18px]" />
          <Skeleton className="h-24" rounded="rounded-[18px]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <ErrorState
          title="Couldn’t load team"
          message={error?.response?.data?.message || error?.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="mx-auto max-w-lg py-16">
        <EmptyState
          icon={UsersRound}
          title="Team not found"
          description="This squad may have been removed or the link is invalid."
          action={
            <Button
              type="button"
              variant="primary"
              className="rounded-xl"
              onClick={() => navigate('/dashboard/teams')}
            >
              Back to Teams
            </Button>
          }
        />
      </div>
    );
  }

  const toggle = (uid) => {
    setSelectedIds((prev) =>
      prev.includes(uid) ? prev.filter((x) => x !== uid) : [...prev, uid]
    );
  };

  const toggleAll = () => {
    const ids = members.map((u) => u.id);
    const all = ids.length > 0 && ids.every((x) => selectedIds.includes(x));
    setSelectedIds(all ? [] : ids);
  };

  const toggleTaskComplete = (taskId) => {
    const current = teamTasks.find((t) => t.id === taskId);
    if (!current) return;
    const next = current.status === 'done' ? 'todo' : 'done';
    setStatusOverrides((prev) => ({ ...prev, [taskId]: next }));
  };

  const memberCount = team.memberCount ?? memberIds.length;

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link
          to="/dashboard/teams"
          className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-secondaryText hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={2.2} />
          Teams
        </Link>

        <div
          className="
            relative overflow-hidden rounded-[24px]
            border border-border/45 bg-white/90 backdrop-blur-md
            p-4 sm:p-6
            shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_28px_rgba(15,23,42,0.05)]
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/[0.06] blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
              <span
                className={`
                  flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-[18px]
                  bg-gradient-to-br ${team.iconTone}
                  shadow-sm ring-[3px] ring-white
                `}
              >
                <Layers size={22} strokeWidth={2} />
              </span>
              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[22px] sm:text-[28px] font-bold text-heading tracking-tight leading-tight truncate">
                    {team.name}
                  </h1>
                  <StatusBadge status={team.status === 'active' ? 'active' : 'suspended'} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <Link
                    to={`/dashboard/departments/${team.departmentId}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-slate-50/90 px-2.5 py-1 text-[12px] font-semibold text-heading hover:border-primary/25 hover:text-primary transition-colors"
                  >
                    <Network size={12} className="text-slate-400" />
                    {team.departmentName}
                  </Link>
                  <Link
                    to={`/dashboard/organizations/${team.organizationId}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-slate-50/90 px-2.5 py-1 text-[12px] font-semibold text-heading hover:border-primary/25 hover:text-primary transition-colors"
                  >
                    <Building2 size={12} className="text-slate-400" />
                    {team.organizationName}
                  </Link>
                </div>
                <div className="mt-3">
                  <TeamLeadBadge
                    leadId={team.leadId}
                    name={team.leadName}
                    initials={team.leadInitials}
                    size="lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0 self-start">
              <Button
                type="button"
                variant="secondary"
                onClick={openEdit}
                className="h-10 rounded-xl gap-2 text-[13px] font-semibold bg-white"
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setAddOpen(true)}
                className="h-10 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
              >
                <UserPlus size={15} strokeWidth={1.9} />
                Add Member
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {actionError ? (
        <div role="alert" className="rounded-xl border border-error/20 bg-red-50 px-3.5 py-2.5 text-sm text-error">
          {actionError}
        </div>
      ) : null}

      <TeamTabs
        value={tab}
        onChange={setTab}
        counts={{
          members: members.length || memberCount,
          projects: teamProjects.length,
          tasks: teamTasks.length,
          meetings: teamMeetings.length,
        }}
      />

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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <TeamStatCard
                  icon={Users2}
                  label="Members"
                  value={memberCount}
                  tone="from-[#EFF6FF] to-[#BFDBFE] text-primary ring-primary/10"
                />
                <TeamStatCard
                  icon={FolderKanban}
                  label="Active projects"
                  value={activeProjectCount}
                  tone="from-[#ECFDF5] to-[#A7F3D0] text-emerald-600 ring-emerald-500/10"
                />
                <TeamStatCard
                  icon={CheckSquare}
                  label="Tasks done"
                  value={`${taskStats.done}/${taskStats.total}`}
                  tone="from-[#EEF2FF] to-[#C7D2FE] text-indigo-700 ring-indigo-500/10"
                />
                <TeamStatCard
                  icon={Layers}
                  label="Avg tasks / member"
                  value={taskStats.avg}
                  tone="from-[#FFFBEB] to-[#FDE68A] text-amber-700 ring-amber-500/10"
                />
              </div>

              <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                <h2 className="text-[14px] font-semibold text-heading tracking-tight mb-3">
                  About this team
                </h2>
                <p className="text-[13px] text-secondaryText leading-relaxed">
                  {team.description || 'No description yet.'}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[12px] text-secondaryText">
                  <CalendarDays size={13} className="text-slate-400" />
                  Created {formatTeamDate(team.createdAt)}
                </div>
              </div>
            </div>
          )}

          {tab === 'members' && (
            <div className="space-y-3">
              {memberError ? (
                <div role="alert" className="rounded-xl border border-error/20 bg-red-50 px-3.5 py-2.5 text-sm text-error">
                  {memberError}
                </div>
              ) : null}
              {selectedIds.length > 0 && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-white/90 px-3.5 py-2.5">
                  <p className="text-[12.5px] font-medium text-secondaryText">
                    {selectedIds.length} selected
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleRemoveSelected}
                    disabled={removeMember.isPending}
                    className="h-9 rounded-xl gap-2 text-[12.5px] text-error border-error/20 hover:bg-red-50"
                  >
                    <UserMinus size={14} />
                    {removeMember.isPending ? 'Removing…' : 'Remove selected'}
                  </Button>
                </div>
              )}
              {membersLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : members.length === 0 ? (
                <div className="rounded-[20px] border border-border/45 bg-white/85 py-6">
                  <EmptyState
                    icon={Users2}
                    title="No members yet"
                    description="People assigned to this squad will appear here."
                    action={
                      <Button
                        type="button"
                        variant="primary"
                        className="rounded-xl gap-2"
                        onClick={() => setAddOpen(true)}
                      >
                        <UserPlus size={14} />
                        Add Member
                      </Button>
                    }
                  />
                </div>
              ) : (
                <UserTable
                  users={members}
                  selectedIds={selectedIds}
                  onToggle={toggle}
                  onToggleAll={toggleAll}
                  teamLeadId={team.leadId}
                />
              )}
            </div>
          )}

          {tab === 'projects' && (
            projectsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full" rounded="rounded-[20px]" />
                ))}
              </div>
            ) : teamProjects.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={FolderKanban}
                  title="No projects assigned"
                  description="Projects linked to this squad will appear here."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {teamProjects.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            )
          )}

          {tab === 'tasks' && (
            teamTasks.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={CheckSquare}
                  title="No matching tasks"
                  description="Tasks on this team's projects assigned to squad members will appear here."
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto dashboard-scrollbar">
                  <table className="w-full min-w-[720px] text-left">
                    <thead>
                      <tr className="border-b border-border/50 bg-slate-50/80">
                        <th className="px-3 py-3 w-12" />
                        {['Task', 'Project', 'Assignee', 'Priority', 'Status', 'Due', 'Subtasks'].map(
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
                      {teamTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          compact
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

          {tab === 'meetings' && (
            teamMeetings.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={Video}
                  title="No meetings yet"
                  description="Meetings linked to this squad will appear here."
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
                {teamMeetings.map((m) => (
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
        </motion.div>
      </AnimatePresence>

      <AddMemberModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        team={team}
        existingIds={memberIds}
      />

      {editOpen && (
        <div className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-heading/25 backdrop-blur-[6px]"
            onClick={() => setEditOpen(false)}
          />
          <form
            onSubmit={saveEdit}
            className="relative z-10 w-full sm:max-w-[420px] rounded-t-[24px] sm:rounded-[24px] border border-white/70 bg-white/95 p-5 sm:p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[16px] font-semibold text-heading">Edit team</h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-secondaryText hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
            {actionError ? (
              <div role="alert" className="rounded-xl border border-error/20 bg-red-50 px-3.5 py-2.5 text-sm text-error">
                {actionError}
              </div>
            ) : null}
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Name</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <div className="flex justify-end gap-2.5">
              <Button type="button" variant="secondary" onClick={() => setEditOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={updateTeam.isPending} className="rounded-xl">
                Save changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamDetail;
