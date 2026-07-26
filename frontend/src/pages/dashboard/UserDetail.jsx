import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  CheckSquare,
  FolderKanban,
  LogIn,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield,
  UserCog,
  UserRound,
  UserX,
  Users2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import RoleBadge from '../../components/users/RoleBadge';
import StatusBadge from '../../components/users/StatusBadge';
import ProjectCard from '../../components/projects/ProjectCard';
import TaskRow from '../../components/tasks/TaskRow';
import {
  getUserById,
  formatJoinedDate,
} from '../../components/users/userData';
import { getProjectsByUser } from '../../components/projects/projectData';
import { getTasksByAssignee } from '../../components/tasks/taskData';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'projects', label: 'Projects' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'settings', label: 'Settings' },
];

const StatMini = ({ icon: Icon, label, value, tone }) => (
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

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useMemo(() => getUserById(id), [id]);
  const [tab, setTab] = useState('overview');
  const [statusOverrides, setStatusOverrides] = useState({});
  const userProjects = useMemo(
    () => (user ? getProjectsByUser(user.id) : []),
    [user]
  );

  const baseTasks = useMemo(
    () => (user ? getTasksByAssignee(user.id) : []),
    [user]
  );

  const userTasks = useMemo(
    () =>
      baseTasks.map((t) =>
        statusOverrides[t.id] ? { ...t, status: statusOverrides[t.id] } : t
      ),
    [baseTasks, statusOverrides]
  );

  const toggleTaskComplete = (taskId) => {
    const current = userTasks.find((t) => t.id === taskId);
    if (!current) return;
    const next = current.status === 'done' ? 'todo' : 'done';
    setStatusOverrides((prev) => ({ ...prev, [taskId]: next }));
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-16">
        <EmptyState
          icon={UserRound}
          title="User not found"
          description="This person may have been removed or the link is invalid."
          action={
            <Button
              type="button"
              variant="primary"
              className="rounded-xl"
              onClick={() => navigate('/dashboard/users')}
            >
              Back to Users
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
        <Link
          to="/dashboard/users"
          className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-secondaryText hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={2.2} />
          Users
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
              <div className="relative shrink-0">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] via-primary to-[#1E40AF] text-white text-[15px] sm:text-[17px] font-semibold shadow-[0_10px_24px_rgba(37,99,235,0.28)] ring-[3px] ring-white">
                  {user.initials}
                </div>
                {user.status === 'active' && (
                  <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-success shadow-[0_0_0_2.5px_#fff]" />
                )}
              </div>
              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[22px] sm:text-[28px] font-bold text-heading tracking-tight leading-tight truncate">
                    {user.name}
                  </h1>
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
                <p className="mt-1.5 text-[13px] text-secondaryText flex items-center gap-1.5 truncate">
                  <Mail size={13} className="shrink-0 text-slate-400" />
                  {user.email}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-secondaryText">
                  <span>{user.department} · {user.team}</span>
                  <Link
                    to={`/dashboard/organizations/${user.organizationId}`}
                    className="inline-flex items-center gap-1 font-medium text-heading hover:text-primary"
                  >
                    <Building2 size={12} className="text-slate-400" />
                    {user.organizationName}
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-xl gap-2 text-[13px] font-semibold bg-white"
              >
                <UserCog size={15} strokeWidth={1.9} />
                Edit
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-xl gap-2 text-[13px] font-semibold bg-white text-error border-error/20 hover:bg-red-50"
              >
                <UserX size={15} strokeWidth={1.9} />
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className="
          relative flex gap-0.5 overflow-x-auto dashboard-scrollbar
          rounded-[14px] border border-border/45 bg-slate-100/70 p-1
        "
        role="tablist"
        aria-label="User sections"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
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
                  layoutId="user-tab-pill"
                  className="absolute inset-0 rounded-[11px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-primary/10"
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <StatMini
                  icon={CheckSquare}
                  label="Tasks assigned"
                  value={userTasks.length || user.tasksAssigned}
                  tone="from-[#EFF6FF] to-[#BFDBFE] text-primary ring-primary/10"
                />
                <StatMini
                  icon={FolderKanban}
                  label="Projects"
                  value={user.projects}
                  tone="from-[#ECFDF5] to-[#A7F3D0] text-emerald-600 ring-emerald-500/10"
                />
                <StatMini
                  icon={LogIn}
                  label="Last login"
                  value={user.lastLogin === 'Never' ? '—' : user.lastLogin.split(',')[0]}
                  tone="from-[#FFFBEB] to-[#FDE68A] text-amber-700 ring-amber-500/10"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[14px] font-semibold text-heading tracking-tight mb-4">
                    Contact & profile
                  </h2>
                  <dl className="space-y-3.5">
                    {[
                      { icon: Mail, label: 'Email', value: user.email },
                      { icon: Phone, label: 'Phone', value: user.phone || 'Not provided' },
                      { icon: MapPin, label: 'Location', value: user.location },
                      {
                        icon: Users2,
                        label: 'Reports to',
                        value: user.manager || '— (top-level)',
                      },
                      {
                        icon: UserRound,
                        label: 'Joined',
                        value: formatJoinedDate(user.joinedAt),
                      },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
                          <row.icon size={14} strokeWidth={1.9} />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">
                            {row.label}
                          </dt>
                          <dd className="mt-0.5 text-[13px] font-medium text-heading break-words">
                            {row.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[14px] font-semibold text-heading tracking-tight mb-4">
                    Organization & team
                  </h2>
                  <dl className="space-y-3.5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
                        <Building2 size={14} strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">
                          Organization
                        </dt>
                        <dd className="mt-0.5">
                          <Link
                            to={`/dashboard/organizations/${user.organizationId}`}
                            className="text-[13px] font-semibold text-primary hover:underline"
                          >
                            {user.organizationName}
                          </Link>
                        </dd>
                      </div>
                    </div>
                    {[
                      { icon: Users2, label: 'Department', value: user.department },
                      { icon: UserRound, label: 'Team', value: user.team },
                      { icon: Shield, label: 'Role', value: user.role },
                      { icon: LogIn, label: 'Last login', value: user.lastLogin },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
                          <row.icon size={14} strokeWidth={1.9} />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">
                            {row.label}
                          </dt>
                          <dd className="mt-0.5 text-[13px] font-medium text-heading">
                            {row.label === 'Role' ? <RoleBadge role={user.role} /> : row.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <ActivityTimeline activities={user.activity} delay={0.05} />
          )}

          {tab === 'projects' && (
            userProjects.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={FolderKanban}
                  title="No projects yet"
                  description="Projects this person belongs to will appear here."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {userProjects.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            )
          )}

          {tab === 'tasks' && (
            userTasks.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={CheckSquare}
                  title="No tasks assigned"
                  description="Tasks assigned to this person will appear here."
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
                    <h2 className="text-[14px] font-semibold text-heading">Assigned tasks</h2>
                    <p className="mt-0.5 text-[12px] text-secondaryText">
                      From the Tasks module — filtered to this assignee.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-secondaryText tabular-nums w-fit">
                    {userTasks.length}
                  </span>
                </div>
                <div className="overflow-x-auto dashboard-scrollbar">
                  <table className="w-full min-w-[680px] text-left">
                    <thead>
                      <tr className="border-b border-border/50 bg-slate-50/80">
                        <th className="px-3 py-3 w-12" />
                        {['Task', 'Assignee', 'Priority', 'Status', 'Due', 'Subtasks'].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {userTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          compact
                          showProject
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

          {tab === 'permissions' && (
            <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
              <EmptyState
                icon={Shield}
                title="Permissions coming soon"
                description="Fine-grained role permissions for this user will appear here in a later phase."
              />
            </div>
          )}

          {tab === 'settings' && (
            <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
              <EmptyState
                icon={Settings}
                title="User settings"
                description="Notification preferences, security, and access recovery options will live here."
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserDetail;
