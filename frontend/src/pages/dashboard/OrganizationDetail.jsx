import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Users2,
  Network,
  FolderKanban,
  Settings,
  MapPin,
  Globe,
  Mail,
  CalendarDays,
  Activity,
  Trash2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import OrganizationTabs from '../../components/organizations/OrganizationTabs';
import MemberRow from '../../components/organizations/MemberRow';
import DepartmentCard from '../../components/departments/DepartmentCard';
import {
  ORGANIZATION_PLANS,
  formatOrgDate,
} from '../../components/organizations/organizationData';
import { getDepartmentsByOrganization } from '../../components/departments/departmentData';
import { getProjectsByOrganization } from '../../components/projects/projectData';
import {
  useDeleteOrganization,
  useOrganization,
  useUpdateOrganization,
} from '../../hooks/useOrganizations';
import { getApiErrorMessage } from '../../lib/api';

const StatMini = ({ icon: Icon, label, value, tone }) => (
  <div
    className="
      rounded-[18px] border border-border/45 bg-white/90 p-4
      shadow-[0_2px_12px_rgba(15,23,42,0.04)]
    "
  >
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

const PlaceholderPanel = ({ title, description }) => (
  <div className="rounded-[20px] border border-dashed border-border/70 bg-white/60 py-4">
    <EmptyState title={title} description={description} />
  </div>
);

const OrganizationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: org, isLoading, isError, error, refetch } = useOrganization(id);
  const updateOrganization = useUpdateOrganization();
  const deleteOrganization = useDeleteOrganization();
  const [tab, setTab] = useState('overview');
  const [actionError, setActionError] = useState('');
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('active');

  // Other-module tabs stay on dummy catalogs until those modules are wired.
  const orgDepartments = useMemo(
    () => (org ? getDepartmentsByOrganization(org.id) : []),
    [org]
  );
  const orgProjects = useMemo(
    () => (org ? getProjectsByOrganization(org.id) : []),
    [org]
  );

  const activeProjects =
    org?.activeProjectsCount ??
    orgProjects.filter((p) => p.status === 'active').length;

  const openEdit = () => {
    if (!org) return;
    setEditName(org.name || '');
    setEditStatus(org.status || 'active');
    setTab('settings');
    setActionError('');
  };

  const saveEdits = async () => {
    if (!org) return;
    setActionError('');
    try {
      await updateOrganization.mutateAsync({
        id: org.id,
        name: editName.trim() || org.name,
        status: editStatus,
      });
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not update organization.'));
    }
  };

  const handleDelete = async () => {
    if (!org) return;
    if (!window.confirm(`Delete “${org.name}”? This cannot be undone.`)) return;
    setActionError('');
    try {
      await deleteOrganization.mutateAsync(org.id);
      navigate('/dashboard/organizations', { replace: true });
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not delete organization.'));
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
          title="Couldn’t load organization"
          message={error?.response?.data?.message || error?.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="mx-auto max-w-lg py-16">
        <EmptyState
          icon={Building2}
          title="Organization not found"
          description="This workspace may have been removed or the link is invalid."
          action={
            <Button
              type="button"
              variant="primary"
              className="rounded-xl"
              onClick={() => navigate('/dashboard/organizations')}
            >
              Back to Organizations
            </Button>
          }
        />
      </div>
    );
  }

  const plan = ORGANIZATION_PLANS[org.plan] || ORGANIZATION_PLANS.starter;

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link
          to="/dashboard/organizations"
          className="
            inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-secondaryText
            hover:text-primary transition-colors mb-4
          "
        >
          <ArrowLeft size={14} strokeWidth={2.2} />
          Organizations
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
              <div
                className={`
                  flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-[18px]
                  bg-gradient-to-br ${org.gradient || 'from-[#3B82F6] to-[#1D4ED8]'} text-white text-[15px] sm:text-[17px] font-semibold
                  shadow-[0_10px_24px_rgba(37,99,235,0.28)] ring-[3px] ring-white
                `}
              >
                {org.initials}
              </div>
              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[22px] sm:text-[28px] font-bold text-heading tracking-tight leading-tight truncate">
                    {org.name}
                  </h1>
                  <span
                    className={`
                      inline-flex items-center gap-1.5 rounded-full px-2 py-0.5
                      text-[10.5px] font-semibold capitalize ring-1
                      ${
                        org.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-500/15'
                          : 'bg-slate-100 text-slate-500 ring-slate-300/50'
                      }
                    `}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        org.status === 'active' ? 'bg-success' : 'bg-slate-400'
                      }`}
                    />
                    {org.status}
                  </span>
                  <span className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ring-1 ${plan.tone}`}>
                    {plan.label}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] text-secondaryText leading-relaxed max-w-2xl">
                  {org.description || 'No description yet.'}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-secondaryText">
                  {org.location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400" />
                      {org.location}
                    </span>
                  ) : null}
                  {org.website ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Globe size={12} className="text-slate-400" />
                      {org.website}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-xl gap-2 text-[13px] font-semibold bg-white"
                onClick={() => setTab('settings')}
              >
                <Settings size={15} strokeWidth={1.9} />
                Settings
              </Button>
              <Button
                type="button"
                variant="primary"
                className="h-10 rounded-xl text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
                onClick={openEdit}
              >
                Edit Organization
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <OrganizationTabs
        value={tab}
        onChange={setTab}
        counts={{
          members: org.members?.length || org.memberCount || 0,
          departments: org.departmentCount ?? orgDepartments.length,
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
                <StatMini
                  icon={Users2}
                  label="Total members"
                  value={(org.memberCount ?? org.members?.length ?? 0).toLocaleString()}
                  tone="from-[#EFF6FF] to-[#BFDBFE] text-primary ring-primary/10"
                />
                <StatMini
                  icon={Network}
                  label="Departments"
                  value={org.departmentCount ?? org.departmentsCount ?? 0}
                  tone="from-[#ECFDF5] to-[#A7F3D0] text-emerald-600 ring-emerald-500/10"
                />
                <StatMini
                  icon={FolderKanban}
                  label="Active projects"
                  value={activeProjects}
                  tone="from-[#FFFBEB] to-[#FDE68A] text-amber-700 ring-amber-500/10"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <div
                  className="
                    xl:col-span-2 rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5
                    shadow-[0_2px_12px_rgba(15,23,42,0.04)]
                  "
                >
                  <h2 className="text-[14px] font-semibold text-heading tracking-tight mb-4">
                    Organization info
                  </h2>
                  <dl className="space-y-3.5">
                    {[
                      { icon: Building2, label: 'Industry', value: org.industry || '—' },
                      { icon: Users2, label: 'Company size', value: org.size || '—' },
                      { icon: CalendarDays, label: 'Created', value: formatOrgDate(org.createdAt) },
                      {
                        icon: Mail,
                        label: 'Owner',
                        value: org.owner
                          ? `${org.owner}${org.ownerEmail ? ` · ${org.ownerEmail}` : ''}`
                          : org.ownerEmail || '—',
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

                <div
                  className="
                    xl:col-span-3 rounded-[20px] border border-border/45 bg-white/90 p-4 sm:p-5
                    shadow-[0_2px_12px_rgba(15,23,42,0.04)]
                  "
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Activity size={15} className="text-primary" strokeWidth={2} />
                    <h2 className="text-[14px] font-semibold text-heading tracking-tight">
                      Recent activity
                    </h2>
                  </div>
                  <ul className="space-y-1">
                    {(org.activity || []).map((item) => (
                      <li
                        key={item.id}
                        className="
                          flex items-start justify-between gap-3 rounded-[14px]
                          px-3 py-2.5 hover:bg-slate-50/90 transition-colors
                        "
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                          <p className="text-[13px] text-heading leading-snug">{item.text}</p>
                        </div>
                        <span className="shrink-0 text-[11px] font-medium text-slate-400 whitespace-nowrap">
                          {item.time}
                        </span>
                      </li>
                    ))}
                    {!org.activity?.length && (
                      <p className="text-[13px] text-secondaryText px-1 py-4">No recent activity.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'members' && (
            <div
              className="
                rounded-[20px] border border-border/45 bg-white/90 overflow-hidden
                shadow-[0_2px_12px_rgba(15,23,42,0.04)]
              "
            >
              <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 sm:px-5 py-3.5">
                <div>
                  <h2 className="text-[14px] font-semibold text-heading">Members</h2>
                  <p className="text-[12px] text-secondaryText mt-0.5">
                    People with access to this organization
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-secondaryText tabular-nums">
                  {org.members?.length || 0}
                </span>
              </div>
              <div className="divide-y divide-border/35 px-1.5 sm:px-2 py-1.5">
                {(org.members || []).map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
                {!org.members?.length && (
                  <p className="text-[13px] text-secondaryText px-4 py-6">No members loaded.</p>
                )}
              </div>
            </div>
          )}

          {tab === 'departments' && (
            orgDepartments.length === 0 ? (
              <PlaceholderPanel
                title="No departments yet"
                description="Departments created for this organization will appear here. (Dummy catalog until Departments module is wired.)"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {orgDepartments.map((dept, i) => (
                  <DepartmentCard key={dept.id} dept={dept} index={i} />
                ))}
              </div>
            )
          )}

          {tab === 'settings' && (
            <div className="rounded-[20px] border border-border/45 bg-white/90 p-5 sm:p-6 shadow-sm space-y-5 max-w-xl">
              <div>
                <h2 className="text-[15px] font-semibold text-heading">Edit organization</h2>
                <p className="mt-1 text-[12.5px] text-secondaryText">
                  Update workspace name and status. Billing/security stay UI-only for now.
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
                    value={editName || org.name}
                    onChange={(e) => setEditName(e.target.value)}
                    onFocus={() => {
                      if (!editName) setEditName(org.name || '');
                    }}
                    className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">Status</label>
                  <select
                    value={editStatus || org.status}
                    onChange={(e) => setEditStatus(e.target.value)}
                    onFocus={() => {
                      if (!editStatus) setEditStatus(org.status || 'active');
                    }}
                    className="block w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <Button
                  type="button"
                  variant="primary"
                  isLoading={updateOrganization.isPending}
                  onClick={saveEdits}
                  className="rounded-xl"
                >
                  Save changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  isLoading={deleteOrganization.isPending}
                  onClick={handleDelete}
                  className="rounded-xl gap-2 text-error border-error/20 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OrganizationDetail;
