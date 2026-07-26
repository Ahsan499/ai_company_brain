import { motion } from 'framer-motion';
import { Users2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ORGANIZATION_PLANS, formatOrgDate } from './organizationData';

const StatusBadge = ({ status }) => (
  <span
    className={`
      inline-flex items-center gap-1.5 rounded-full px-2 py-0.5
      text-[10.5px] font-semibold capitalize ring-1
      ${
        status === 'active'
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-500/15'
          : 'bg-slate-100 text-slate-500 ring-slate-300/50'
      }
    `}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        status === 'active' ? 'bg-success' : 'bg-slate-400'
      }`}
    />
    {status}
  </span>
);

/** Desktop table + mobile stacked cards for organization list */
const OrganizationTable = ({ organizations = [] }) => {
  return (
    <>
      {/* Mobile card list */}
      <ul className="space-y-2.5 md:hidden">
        {organizations.map((org, i) => {
          const plan = ORGANIZATION_PLANS[org.plan] || ORGANIZATION_PLANS.starter;
          return (
            <motion.li
              key={org.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/dashboard/organizations/${org.id}`}
                className="
                  flex items-center gap-3 rounded-[16px] border border-border/45
                  bg-white/90 p-3.5
                  shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                  hover:border-primary/20 transition-colors
                "
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${org.gradient} text-white text-[12px] font-semibold`}
                >
                  {org.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-heading truncate">{org.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-secondaryText truncate">
                    {org.industry} · {org.memberCount} members
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${plan.tone}`}>
                      {plan.label}
                    </span>
                    <StatusBadge status={org.status} />
                  </div>
                </div>
                <ChevronRight size={16} className="shrink-0 text-slate-300" />
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-[20px] border border-border/45 bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto dashboard-scrollbar">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-border/50 bg-slate-50/80">
                {['Organization', 'Industry', 'Members', 'Plan', 'Status', 'Created', ''].map(
                  (h) => (
                    <th
                      key={h || 'action'}
                      className="px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {organizations.map((org, i) => {
                const plan = ORGANIZATION_PLANS[org.plan] || ORGANIZATION_PLANS.starter;
                return (
                  <motion.tr
                    key={org.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.025 }}
                    className="group border-b border-border/35 last:border-0 hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <Link
                        to={`/dashboard/organizations/${org.id}`}
                        className="flex items-center gap-3 min-w-0 focus:outline-none"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${org.gradient} text-white text-[11px] font-semibold shadow-sm`}
                        >
                          {org.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-semibold text-heading tracking-tight truncate group-hover:text-primary transition-colors">
                            {org.name}
                          </p>
                          <p className="text-[11.5px] text-secondaryText truncate">{org.owner}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-secondaryText">{org.industry}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-heading tabular-nums">
                        <Users2 size={13} className="text-slate-400" />
                        {org.memberCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ring-1 ${plan.tone}`}>
                        {plan.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={org.status} />
                    </td>
                    <td className="px-4 py-3.5 text-[12.5px] text-secondaryText whitespace-nowrap">
                      {formatOrgDate(org.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        to={`/dashboard/organizations/${org.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
                        aria-label={`Open ${org.name}`}
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrganizationTable;
