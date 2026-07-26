import { useMemo, useState } from 'react';
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
} from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import UserTable from '../../components/users/UserTable';
import DepartmentTabs from '../../components/departments/DepartmentTabs';
import DepartmentStatCard from '../../components/departments/DepartmentStatCard';
import ManagerBadge from '../../components/departments/ManagerBadge';
import ProjectCard from '../../components/projects/ProjectCard';
import StatusBadge from '../../components/users/StatusBadge';
import {
  getDepartmentById,
  formatDeptDate,
} from '../../components/departments/departmentData';
import { USERS } from '../../components/users/userData';
import { getProjectsByDepartment } from '../../components/projects/projectData';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dept = useMemo(() => getDepartmentById(id), [id]);
  const [tab, setTab] = useState('overview');
  const [selectedIds, setSelectedIds] = useState([]);

  const members = useMemo(() => {
    if (!dept) return [];
    return USERS.filter((u) => dept.memberIds.includes(u.id));
  }, [dept]);

  const deptProjects = useMemo(
    () => (dept ? getProjectsByDepartment(dept.id) : []),
    [dept]
  );

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
        counts={{ members: members.length, projects: deptProjects.length }}
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
                  value={dept.memberIds.length}
                  tone="from-[#EFF6FF] to-[#BFDBFE] text-primary ring-primary/10"
                />
                <DepartmentStatCard
                  icon={FolderKanban}
                  label="Active projects"
                  value={dept.projectCount}
                  tone="from-[#ECFDF5] to-[#A7F3D0] text-emerald-600 ring-emerald-500/10"
                />
                <DepartmentStatCard
                  icon={Clock}
                  label="Avg tenure"
                  value={`${dept.avgTenureMonths} mo`}
                  tone="from-[#FFFBEB] to-[#FDE68A] text-amber-700 ring-amber-500/10"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <div className="xl:col-span-3 rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[14px] font-semibold text-heading tracking-tight mb-3">
                    About this department
                  </h2>
                  <p className="text-[13px] text-secondaryText leading-relaxed">
                    {dept.description}
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
            members.length === 0 ? (
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

          {tab === 'projects' && (
            deptProjects.length === 0 ? (
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
            <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
              <EmptyState
                icon={Settings}
                title="Department settings"
                description="Naming, ownership, and visibility controls will live here."
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DepartmentDetail;
