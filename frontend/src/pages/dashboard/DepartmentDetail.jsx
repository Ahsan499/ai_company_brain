import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  Clock,
  FolderKanban,
  Network,
  Settings,
  Users2,
  UsersRound,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import UserTable from '../../components/users/UserTable';
import DepartmentTabs from '../../components/departments/DepartmentTabs';
import DepartmentStatCard from '../../components/departments/DepartmentStatCard';
import ManagerBadge from '../../components/departments/ManagerBadge';
import ProjectCard from '../../components/projects/ProjectCard';
import TeamCard from '../../components/teams/TeamCard';
import StatusBadge from '../../components/users/StatusBadge';
import { formatDeptDate } from '../../components/departments/departmentData';
import {
  useDepartment,
  useDepartmentMembers,
  useDepartmentProjects,
  useDepartmentTeams,
  useUpdateDepartment,
} from '../../hooks/useDepartments';
import { getApiErrorMessage } from '../../lib/api';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: dept, isLoading, isError, error, refetch } = useDepartment(id);
  const { data: membersData, isLoading: membersLoading } = useDepartmentMembers(id);
  const { data: teamsData, isLoading: teamsLoading } = useDepartmentTeams(id);
  const { data: projectsData, isLoading: projectsLoading } = useDepartmentProjects(id);
  const updateDepartment = useUpdateDepartment();

  const [tab, setTab] = useState('overview');
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionError, setActionError] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('active');

  const members = membersData?.data ?? [];
  const deptTeams = teamsData?.data ?? [];
  const deptProjects = projectsData?.data ?? [];

  useEffect(() => {
    if (!dept) return;
    setEditName(dept.name || '');
    setEditDescription(dept.description || '');
    setEditStatus(dept.status || 'active');
  }, [dept]);

  const openEdit = () => {
    if (!dept) return;
    setEditName(dept.name || '');
    setEditDescription(dept.description || '');
    setEditStatus(dept.status || 'active');
    setTab('settings');
    setActionError('');
  };

  const saveEdits = async () => {
    if (!dept) return;
    setActionError('');
    try {
      await updateDepartment.mutateAsync({
        id: dept.id,
        name: editName.trim() || dept.name,
        description: editDescription,
        status: editStatus,
      });
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not update department.'));
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1600px] space-y-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-40 w-full" rounded="rounded-[24px]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          title="Couldn’t load department"
          message={error?.response?.data?.message || error?.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="mx-auto max-w-lg py-16">
        <EmptyState
          icon={Network}
          title="Department not found"
          description="This department may have been removed or the link is invalid."
          action={
            <Button
              type="button"
              variant="primary"
              className="rounded-xl"
              onClick={() => navigate('/dashboard/departments')}
            >
              Back to Departments
            </Button>
          }
        />
      </div>
    );
  }

  const memberCount = dept.memberCount ?? dept.memberIds?.length ?? members.length;
  const projectCount = dept.projectCount ?? deptProjects.length;

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

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link
          to="/dashboard/departments"
          className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-secondaryText hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={2.2} />
          Departments
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
                  bg-gradient-to-br ${dept.iconTone}
                  shadow-sm ring-[3px] ring-white
                `}
              >
                <Briefcase size={22} strokeWidth={2} />
              </span>
              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[22px] sm:text-[28px] font-bold text-heading tracking-tight leading-tight truncate">
                    {dept.name}
                  </h1>
                  <StatusBadge status={dept.status === 'active' ? 'active' : 'suspended'} />
                </div>
                <Link
                  to={`/dashboard/organizations/${dept.organizationId}`}
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-slate-50/90 px-2.5 py-1 text-[12px] font-semibold text-heading hover:border-primary/25 hover:text-primary transition-colors"
                >
                  <Building2 size={12} className="text-slate-400" />
                  {dept.organizationName}
                </Link>
                <div className="mt-3">
                  <ManagerBadge
                    managerId={dept.managerId}
                    name={dept.managerName}
                    initials={dept.managerInitials}
                    size="lg"
                  />
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={openEdit}
              className="h-10 rounded-xl text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.25)] self-start"
            >
              Edit Department
            </Button>
          </div>
        </div>
      </motion.div>

      <DepartmentTabs
        value={tab}
        onChange={setTab}
        counts={{
          members: members.length || memberCount,
          teams: deptTeams.length || dept.teamCount || 0,
          projects: deptProjects.length || projectCount,
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <DepartmentStatCard
                  icon={Users2}
                  label="Total members"
                  value={memberCount}
                  tone="from-[#EFF6FF] to-[#BFDBFE] text-primary ring-primary/10"
                />
                <DepartmentStatCard
                  icon={FolderKanban}
                  label="Active projects"
                  value={dept.activeProjectsCount ?? projectCount}
                  tone="from-[#ECFDF5] to-[#A7F3D0] text-emerald-600 ring-emerald-500/10"
                />
                <DepartmentStatCard
                  icon={Clock}
                  label="Avg tenure"
                  value={`${dept.avgTenureMonths ?? 0} mo`}
                  tone="from-[#FFFBEB] to-[#FDE68A] text-amber-700 ring-amber-500/10"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <div className="xl:col-span-3 rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[14px] font-semibold text-heading tracking-tight mb-3">
                    About this department
                  </h2>
                  <p className="text-[13px] text-secondaryText leading-relaxed">
                    {dept.description || 'No description yet.'}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[12px] text-secondaryText">
                    <CalendarDays size={13} className="text-slate-400" />
                    Created {formatDeptDate(dept.createdAt)}
                  </div>
                </div>

                <div className="xl:col-span-2 rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[14px] font-semibold text-heading tracking-tight mb-4">
                    Parent organization
                  </h2>
                  <Link
                    to={`/dashboard/organizations/${dept.organizationId}`}
                    className="
                      flex items-start gap-3 rounded-[16px] border border-border/45
                      bg-slate-50/80 p-3.5 hover:border-primary/20 hover:bg-white transition-colors
                    "
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary">
                      <Building2 size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-semibold text-heading truncate">
                        {dept.organizationName}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-secondaryText">
                        Open organization profile
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {tab === 'members' && (
            membersLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : members.length === 0 ? (
              <div className="rounded-[20px] border border-border/45 bg-white/85 py-6">
                <EmptyState
                  icon={Users2}
                  title="No members yet"
                  description="People assigned to this department will appear here."
                />
              </div>
            ) : (
              <UserTable
                users={members}
                selectedIds={selectedIds}
                onToggle={toggle}
                onToggleAll={toggleAll}
              />
            )
          )}

          {tab === 'teams' && (
            teamsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[180px] w-full" rounded="rounded-[20px]" />
                ))}
              </div>
            ) : deptTeams.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={UsersRound}
                  title="No teams yet"
                  description="Squads inside this department will appear here."
                  action={
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => navigate('/dashboard/teams')}
                    >
                      Open Teams
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {deptTeams.map((t, i) => (
                  <TeamCard key={t.id} team={t} index={i} />
                ))}
              </div>
            )
          )}

          {tab === 'projects' && (
            projectsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full" rounded="rounded-[20px]" />
                ))}
              </div>
            ) : deptProjects.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
                <EmptyState
                  icon={FolderKanban}
                  title="No projects yet"
                  description="Projects linked to this department will appear here."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {deptProjects.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            )
          )}

          {tab === 'settings' && (
            <div className="rounded-[20px] border border-border/45 bg-white/90 p-5 sm:p-6 shadow-sm space-y-5 max-w-xl">
              <div>
                <h2 className="text-[15px] font-semibold text-heading flex items-center gap-2">
                  <Settings size={15} className="text-primary" />
                  Edit department
                </h2>
                <p className="mt-1 text-[12.5px] text-secondaryText">
                  Update name, description, and status.
                </p>
              </div>

              {actionError ? (
                <div role="alert" className="rounded-xl border border-error/20 bg-red-50 px-3.5 py-2.5 text-sm text-error">
                  {actionError}
                </div>
              ) : null}

              <div className="space-y-3.5">
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
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                isLoading={updateDepartment.isPending}
                onClick={saveEdits}
                className="rounded-xl"
              >
                Save changes
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DepartmentDetail;
