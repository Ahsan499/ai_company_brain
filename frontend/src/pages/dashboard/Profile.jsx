import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckSquare,
  FolderKanban,
  Timer,
  UsersRound,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import ProjectCard from '../../components/projects/ProjectCard';
import TaskRow from '../../components/tasks/TaskRow';
import TimesheetGrid from '../../components/time-tracking/TimesheetGrid';
import { formatHours } from '../../components/time-tracking/timeEntryData';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStatsRow from '../../components/profile/ProfileStatsRow';
import ProfileTabs from '../../components/profile/ProfileTabs';
import AboutCard from '../../components/profile/AboutCard';
import ContactInfoCard from '../../components/profile/ContactInfoCard';
import SkillTags from '../../components/profile/SkillTags';
import {
  PROFILE_CURRENT_USER_ID,
  getProfileUser,
  getUserStats,
  getUserBio,
  getUserSkills,
  getUserActivity,
  getUserProfileProjects,
  getUserProfileTasks,
  getUserProfileTeams,
  getUserTimesheet,
  getTimezoneLabel,
} from '../../components/profile/profileSelectors';

const Profile = () => {
  const navigate = useNavigate();
  const userId = PROFILE_CURRENT_USER_ID;
  const user = useMemo(() => getProfileUser(userId), [userId]);
  const [tab, setTab] = useState('overview');
  const [statusOverrides, setStatusOverrides] = useState({});
  const [toast, setToast] = useState('');

  const stats = useMemo(() => getUserStats(userId), [userId]);
  const bio = useMemo(() => getUserBio(userId), [userId]);
  const skills = useMemo(() => getUserSkills(userId), [userId]);
  const activity = useMemo(() => getUserActivity(userId), [userId]);
  const projects = useMemo(() => getUserProfileProjects(userId), [userId]);
  const teams = useMemo(() => getUserProfileTeams(userId), [userId]);
  const timesheet = useMemo(() => getUserTimesheet(userId), [userId]);
  const timezone = useMemo(() => getTimezoneLabel(user), [user]);

  const baseTasks = useMemo(() => getUserProfileTasks(userId), [userId]);
  const tasks = useMemo(
    () =>
      baseTasks.map((t) =>
        statusOverrides[t.id] ? { ...t, status: statusOverrides[t.id] } : t
      ),
    [baseTasks, statusOverrides]
  );

  const flash = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 2000);
  };

  const toggleTaskComplete = (taskId) => {
    const current = tasks.find((t) => t.id === taskId);
    if (!current) return;
    const next = current.status === 'done' ? 'todo' : 'done';
    setStatusOverrides((prev) => ({ ...prev, [taskId]: next }));
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-16">
        <EmptyState
          icon={UsersRound}
          title="Profile not found"
          description="The current user profile could not be loaded."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-5 sm:space-y-6">
      <ProfileHeader
        user={user}
        isOwnProfile
        onMessage={() => flash('Messaging coming soon (demo)')}
      />

      <ProfileStatsRow stats={stats} />

      <ProfileTabs active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          {tab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="lg:col-span-2 space-y-4">
                <AboutCard bio={bio} />
                <SkillTags skills={skills} />
              </div>
              <div className="space-y-4">
                <ContactInfoCard user={user} timezone={timezone} />
                <div className="rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                  <h3 className="text-[14px] font-semibold text-heading tracking-tight inline-flex items-center gap-2 mb-3">
                    <UsersRound size={15} className="text-primary" />
                    Teams
                  </h3>
                  {teams.length === 0 ? (
                    <p className="text-[12.5px] text-secondaryText">No teams yet.</p>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {teams.map((t) => (
                        <li key={t.id}>
                          <Link
                            to={`/dashboard/teams/${t.id}`}
                            className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-semibold text-heading ring-1 ring-slate-200/70 hover:bg-primary/8 hover:text-primary hover:ring-primary/15"
                          >
                            {t.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {user.departmentId && (
                    <p className="mt-3 text-[12px] text-secondaryText">
                      Department:{' '}
                      <Link
                        to={`/dashboard/departments/${user.departmentId}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {user.department}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            activity.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  title="No activity yet"
                  description="Audit events for this user will appear here."
                />
              </div>
            ) : (
              <ActivityTimeline activities={activity} delay={0.04} />
            )
          )}

          {tab === 'tasks' && (
            tasks.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={CheckSquare}
                  title="No tasks assigned"
                  description="Tasks assigned to you will appear here."
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
                      {tasks.map((task) => (
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

          {tab === 'projects' && (
            projects.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={FolderKanban}
                  title="No projects"
                  description="Projects you belong to will appear here."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {projects.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            )
          )}

          {tab === 'time' && (
            timesheet.rows.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={Timer}
                  title="No time logged this week"
                  description="Your timesheet entries will show here."
                  action={
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => navigate('/dashboard/time-tracking')}
                    >
                      Open Time Tracking
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] text-secondaryText">
                    This week ·{' '}
                    <span className="font-semibold text-heading tabular-nums">
                      {formatHours(timesheet.totalMinutes)}
                    </span>
                  </p>
                  <Link
                    to="/dashboard/time-tracking"
                    className="text-[12px] font-semibold text-primary hover:underline"
                  >
                    Full timesheet
                  </Link>
                </div>
                <TimesheetGrid rows={timesheet.rows} weekDates={timesheet.weekDates} />
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-2xl bg-heading px-4 py-2.5 text-[13px] font-medium text-white shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
