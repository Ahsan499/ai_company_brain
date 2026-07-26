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
} from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import OrganizationTabs from '../../components/organizations/OrganizationTabs';
import MemberRow from '../../components/organizations/MemberRow';
import DepartmentCard from '../../components/departments/DepartmentCard';
import {
  getOrganizationById,
  ORGANIZATION_PLANS,
  formatOrgDate,
} from '../../components/organizations/organizationData';
import { getDepartmentsByOrganization } from '../../components/departments/departmentData';
import { getProjectsByOrganization } from '../../components/projects/projectData';

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
  const org = useMemo(() => getOrganizationById(id), [id]);
  const [tab, setTab] = useState('overview');
  const orgDepartments = useMemo(
    () => (org ? getDepartmentsByOrganization(org.id) : []),
    [org]
  );
  const orgProjects = useMemo(
    () => (org ? getProjectsByOrganization(org.id) : []),
    [org]
  );
  const activeOrgProjects = useMemo(
    () => orgProjects.filter((p) => p.status === 'active').length,
    [orgProjects]
  );

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
                  bg-gradient-to-br ${org.gradient} text-white text-[15px] sm:text-[17px] font-semibold
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
                  {org.description}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-secondaryText">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} className="text-slate-400" />
                    {org.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Globe size={12} className="text-slate-400" />
                    {org.website}
                  </span>
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
        counts={{ members: org.members?.length || 0, departments: orgDepartments.length }}
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
                  value={org.memberCount.toLocaleString()}
                  tone="from-[#EFF6FF] to-[#BFDBFE] text-primary ring-primary/10"
                />
                <StatMini
                  icon={Network}
                  label="Departments"
                  value={org.departmentCount}
                  tone="from-[#ECFDF5] to-[#A7F3D0] text-emerald-600 ring-emerald-500/10"
                />
                <StatMini
                  icon={FolderKanban}
                  label="Active projects"
                  value={activeOrgProjects}
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
                      { icon: Building2, label: 'Industry', value: org.industry },
                      { icon: Users2, label: 'Company size', value: org.size },
                      { icon: CalendarDays, label: 'Created', value: formatOrgDate(org.createdAt) },
                      { icon: Mail, label: 'Owner', value: `${org.owner} · ${org.ownerEmail}` },
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
              </div>
            </div>
          )}

          {tab === 'departments' && (
            orgDepartments.length === 0 ? (
              <PlaceholderPanel
                title="No departments yet"
                description="Departments created for this organization will appear here."
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
            <PlaceholderPanel
              title="Organization settings"
              description="Billing, security, and workspace preferences will live here — UI placeholder only."
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OrganizationDetail;
